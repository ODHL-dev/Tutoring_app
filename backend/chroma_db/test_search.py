import chromadb
from chromadb.utils import embedding_functions

client = chromadb.PersistentClient(path="./chroma_db")
embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
collection = client.get_collection(name="tuteur_intelligent", embedding_function=embedding_func)

# Simuler une question utilisateur
results = collection.query(
    query_texts=["OUTILS PÉDAGOGIQUES"], # Remplacez par un sujet de vos PDF
    n_results=2
)

print("Résultats trouvés :")
print(results['documents'])