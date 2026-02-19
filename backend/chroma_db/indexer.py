import os
import chromadb
from chromadb.utils import embedding_functions
import PyPDF2

# 1. Configuration du client persistant
# Cela crée un dossier 'chroma_db' dans votre projet pour stocker les données
client = chromadb.PersistentClient(path="./chroma_db")

# 2. Définition du modèle d'embedding (conversion texte -> nombres)
# 'all-MiniLM-L6-v2' est parfait pour un tuteur intelligent car il est rapide
embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# 3. Création ou récupération de la collection
collection = client.get_or_create_collection(
    name="tuteur_intelligent",
    embedding_function=embedding_func
)

def extract_text_from_pdf(pdf_path):
    """Lit le contenu textuel d'un PDF page par page"""
    text = ""
    try:
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                content = page.extract_text()
                if content:
                    text += content
    except Exception as e:
        print(f"Erreur lors de la lecture de {pdf_path}: {e}")
    return text

def split_text(text, chunk_size=1000):
    """
    Découpe le texte en morceaux de 1000 caractères.
    C'est crucial pour que l'IA puisse retrouver des passages précis plus tard.
    """
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

# 4. Processus d'indexation des fichiers
# Assurez-vous d'avoir créé ce dossier et d'y avoir mis vos PDF
pdf_folder = "./documents_pedagogiques"

if not os.path.exists(pdf_folder):
    os.makedirs(pdf_folder)
    print(f"Le dossier {pdf_folder} a été créé. Placez vos PDF dedans et relancez.")
else:
    for filename in os.listdir(pdf_folder):
        if filename.endswith(".pdf"):
            path = os.path.join(pdf_folder, filename)
            print(f"Traitement de : {filename}...")
            
            # Extraction et découpage
            raw_text = extract_text_from_pdf(path)
            chunks = split_text(raw_text)
            
            # Ajout à la base ChromaDB
            for i, chunk in enumerate(chunks):
                collection.add(
                    documents=[chunk],
                    metadatas=[{"source": filename, "partie": i}],
                    ids=[f"{filename}_{i}"]
                )

    print("\n✅ Félicitations ! Votre base de données vectorielle est remplie et sauvegardée localement.")