import os
import chromadb
from chromadb.utils import embedding_functions
from django.conf import settings

# Prefer the new google.genai package, fallback to legacy google.generativeai if needed
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
gen_client = None
genai_module = None
genai_legacy = None
try:
    import google.genai as genai_module
    try:
        gen_client = genai_module.Client(api_key=GEMINI_KEY) if GEMINI_KEY else genai_module.Client()
    except Exception:
        gen_client = None
except Exception:
    genai_module = None

if gen_client is None:
    try:
        import google.generativeai as genai_legacy
        # legacy: configuration will be attempted on demand
    except Exception:
        genai_legacy = None


def _get_embedding_via_gemini(text: str):
    """Try to get embeddings from Gemini. Return list[float] or raise."""
    # The client API surface may vary; try common patterns and raise on failure
    # Try new client-based API
    if gen_client is not None:
        try:
            # client.embeddings.create -> data[0].embedding
            resp = gen_client.embeddings.create(model="embed-text-1", input=[text])
            return resp.data[0].embedding
        except Exception:
            try:
                # alternative: client.embed
                resp = gen_client.embed(model="embed-text-1", text=[text])
                return resp.data[0].embedding
            except Exception:
                pass

    # Try legacy module if available
    if genai_legacy is not None:
        try:
            genai_legacy.configure(api_key=GEMINI_KEY)
            emb_resp = genai_legacy.embeddings.create(model="embed-text-1", input=[text])
            return emb_resp.data[0].embedding
        except Exception:
            try:
                emb_resp = genai_legacy.get_embeddings(input=[text], model="embed-text-1")
                return emb_resp['data'][0]['embedding']
            except Exception:
                pass

    raise RuntimeError("Unable to obtain embeddings from Gemini or legacy client")


def _get_embedding_local(text: str):
    """Fallback to sentence-transformers local embedding."""
    try:
        from sentence_transformers import SentenceTransformer
    except Exception:
        raise RuntimeError("sentence-transformers not available for local embeddings")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    vec = model.encode(text)
    return vec.tolist()


def _get_embedding(text: str):
    # If a Gemini client (new or legacy) is available, try remote embeddings first
    if gen_client is not None or genai_legacy is not None:
        try:
            return _get_embedding_via_gemini(text)
        except Exception:
            return _get_embedding_local(text)
    return _get_embedding_local(text)


def get_ai_response(user_query: str, n_results: int = 3, max_context_chars: int = 1500):
    """Return a dict: { 'reply': str, 'sources': [str,...] }
    - uses Gemini embeddings when available, else local SentenceTransformer
    - queries ChromaDB with embeddings
    - limits concatenated context size to max_context_chars
    """
    # 1. Connect to ChromaDB
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_collection(name="tuteur_intelligent")

    # Check collection non-empty (best-effort)
    try:
        col_count = collection.count()
    except Exception:
        # fallback: attempt a query and see if results exist
        try:
            probe = collection.query(query_texts=["test"], n_results=1)
            col_count = len(probe.get('ids', [[]])[0])
        except Exception:
            col_count = 0

    if not col_count:
        # Fallback: générer quand même une réponse avec Gemini sans contexte RAG
        prompt_only = f"""
Vous êtes un assistant tuteur pédagogique concis et clair.
Répondez de manière bienveillante et pédagogique à la question ou à la demande de l'élève.

QUESTION OU DEMANDE:\n{user_query}\n\nREPONSE PEDAGOGIQUE:
"""
        reply_text = None
        if gen_client is not None:
            try:
                resp = gen_client.models.generate_content(model="gemini-3-flash-preview", contents=prompt_only)
                reply_text = getattr(resp, 'text', None) or str(resp)
            except Exception:
                pass
        if not reply_text and genai_legacy is not None:
            try:
                genai_legacy.configure(api_key=GEMINI_KEY)
                model = genai_legacy.GenerativeModel('gemini-3-flash-preview')
                response = model.generate_content(prompt_only)
                reply_text = getattr(response, 'text', '') or str(response)
            except Exception:
                pass
        if not reply_text:
            reply_text = "Désolé, ma base de connaissances n'est pas encore indexée. Réessayez plus tard."
        return {"reply": reply_text, "sources": []}

    # 2. Compute embedding for the query
    try:
        q_emb = _get_embedding(user_query)
    except Exception:
        # As a last resort, use chroma internal embedding via SentenceTransformer
        embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
        collection.embedding_function = embedding_func
        results = collection.query(query_texts=[user_query], n_results=n_results)
        docs = results.get('documents', [[]])[0]
        metadatas = results.get('metadatas', [[]])[0]
        ids = results.get('ids', [[]])[0]
    else:
        # 3. Query by embeddings
        results = collection.query(query_embeddings=[q_emb], n_results=n_results)
        docs = results.get('documents', [[]])[0]
        metadatas = results.get('metadatas', [[]])[0]
        ids = results.get('ids', [[]])[0]

    # 4. Build context (limit size)
    context_parts = []
    for doc in docs:
        if not doc:
            continue
        context_parts.append(doc)
    context = " \n\n ".join(context_parts)
    if len(context) > max_context_chars:
        context = context[:max_context_chars] + "..."

    # 5. Build prompt (do NOT include sources in the reply text)
    prompt = f"""
Vous êtes un assistant tuteur pédagogique concis et clair.
Utilisez uniquement le contexte fourni pour répondre. Si la réponse n'est pas dans le contexte, dites-le brièvement et proposez une aide générale.

CONTEXTE:\n{context}\n\nQUESTION: {user_query}\n\nREPONSE PEDAGOGIQUE:
"""

    # 6. Generate with Gemini (or fallback to legacy). Keep the generated text if available.
    reply_text = None
    # Try new google.genai client first
    if gen_client is not None:
        try:
            # Use the client models API (client.models.generate_content)
            # Use a supported Gemini model (match the test script which used gemini-3-flash-preview)
            resp = gen_client.models.generate_content(model="gemini-3-flash-preview", contents=prompt)
            reply_text = getattr(resp, 'text', None) or str(resp)
        except Exception:
            reply_text = None

    # Fallback to legacy google.generativeai usage
    if not reply_text and genai_legacy is not None:
        try:
            genai_legacy.configure(api_key=GEMINI_KEY)
            model = genai_legacy.GenerativeModel('gemini-3-flash-preview')
            response = model.generate_content(prompt)
            reply_text = getattr(response, 'text', '') or str(response)
        except Exception:
            reply_text = None

    if not reply_text:
        reply_text = "Désolé, impossible de générer une réponse pour le moment."

    # 7. Prepare sources list (filenames / metadata)
    sources = []
    for m, _id in zip(metadatas, ids):
        src = m.get('source') if isinstance(m, dict) else None
        sources.append({'id': _id, 'source': src, 'meta': m})

    return {"reply": reply_text, "sources": sources}
