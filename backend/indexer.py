import chromadb
from chromadb.utils import embedding_functions

# 1. Initialiser le client Chroma (stockage local)
client = chromadb.PersistentClient(path="./chroma_db")

# 2. Choisir le modèle d'embedding (le même que ton script 2)
# On utilise ici une version compatible avec ChromaDB
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

# 3. Créer ou récupérer la "collection" (l'équivalent d'une table SQL)
collection = client.get_or_create_collection(
    name="cours_tuteur",
    embedding_function=sentence_transformer_ef
)

# 4. Ajouter tes documents (Exemple manuel)
collection.add(
    documents=["La photosynthèse transforme la lumière en énergie.", "Le Burkina Faso est un pays d'Afrique de l'Ouest."],
    metadatas=[{"source": "SVT_chap1"}, {"source": "Geo_chap1"}],
    ids=["id1", "id2"]
)

print("✅ Documents indexés avec succès dans ChromaDB !")