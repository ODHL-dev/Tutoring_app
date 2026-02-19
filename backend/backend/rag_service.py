import os
import chromadb
import google.generativeai as genai
from chromadb.utils import embedding_functions
from django.conf import settings

# Configuration de Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def get_ai_response(user_query):
    # 1. Connexion à ChromaDB
    client = chromadb.PersistentClient(path="./chroma_db")
    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    collection = client.get_collection(name="tuteur_intelligent", embedding_function=embedding_func)

    # 2. Recherche des passages pertinents dans vos PDF
    results = collection.query(
        query_texts=[user_query],
        n_results=3
    )
    
    # Extraire le texte trouvé
    context = " ".join(results['documents'][0])

    # 3. Création du prompt pour l'IA
    prompt = f"""
    Tu es un tuteur intelligent pédagogique. 
    Utilise les extraits de cours suivants pour répondre à la question de l'élève.
    Si la réponse n'est pas dans le contexte, dis-le poliment mais essaie d'aider quand même.

    CONTEXTE : {context}
    QUESTION : {user_query}
    
    REPONSE PEDAGOGIQUE :
    """

    # 4. Génération de la réponse
    response = model.generate_content(prompt)
    return response.text
