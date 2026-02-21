"""
Service RAG amélioré pour le système GRASSS
Gère la récupération et le stockage de données vectorielles
par utilisateur et par matière
"""

import os
import json
from typing import Optional, List, Dict, Any
from datetime import datetime

# chromadb is optional during development; provide a lightweight in-memory
# fallback client when chromadb is not available.
try:
    import chromadb
    from chromadb.config import Settings
    CHROMA_AVAILABLE = True
except Exception:
    chromadb = None
    Settings = None
    CHROMA_AVAILABLE = False


class _InMemoryCollection:
    def __init__(self, name: str):
        self.name = name
        self._docs = []
        self._ids = []
        self._metadatas = []

    def add(self, documents=None, ids=None, metadatas=None, **kwargs):
        documents = documents or []
        ids = ids or []
        metadatas = metadatas or []
        for d, i, m in zip(documents, ids, metadatas):
            self._docs.append(d)
            self._ids.append(i)
            self._metadatas.append(m)

    def get(self):
        return {"documents": list(self._docs), "metadatas": list(self._metadatas), "ids": list(self._ids)}

    def query(self, query_texts=None, n_results=5, **kwargs):
        # naive implementation: return last n_results documents
        docs = list(self._docs)[-n_results:]
        return {"documents": docs, "metadatas": list(self._metadatas)[-n_results:], "ids": list(self._ids)[-n_results:]}


class _InMemoryClient:
    def __init__(self):
        self._collections = {}

    def get_collection(self, name: str):
        if name not in self._collections:
            raise KeyError("Collection not found")
        return self._collections[name]

    def create_collection(self, name: str, metadata=None):
        col = _InMemoryCollection(name)
        self._collections[name] = col
        return col

    def list_collections(self):
        return [type('C', (), {'name': n}) for n in self._collections.keys()]

    def delete_collection(self, name: str):
        if name in self._collections:
            del self._collections[name]


class RAGGRASSService:
    """Service RAG pour le système GRASSS d'apprentissage adaptatif"""
    
    def __init__(self, chroma_db_path: str = None):
        """Initialiser le service RAG"""
        if chroma_db_path is None:
            chroma_db_path = os.path.join(os.path.dirname(__file__), 'chroma_db')
        
        self.chroma_db_path = chroma_db_path
        os.makedirs(chroma_db_path, exist_ok=True)
        
        # Initialiser Chroma (ou fallback mémoire si indisponible)
        if CHROMA_AVAILABLE:
            try:
                # Use persistent client when available
                self.client = chromadb.PersistentClient(path=chroma_db_path)
            except Exception:
                # Fallback to in-memory client if persistent init fails
                self.client = _InMemoryClient()
        else:
            self.client = _InMemoryClient()
    
    def get_or_create_collection(self, collection_name: str) -> any:
        """Obtenir ou créer une collection Chroma"""
        try:
            collection = self.client.get_collection(name=collection_name)
        except:
            collection = self.client.create_collection(
                name=collection_name,
                metadata={"hnsw:space": "cosine"}
            )
        return collection
    
    # ========================================================================
    # MÉTHODÉ UTILISATEURS
    # ========================================================================
    
    def get_user_collection_name(self, user_id: int) -> str:
        """Générer le nom de collection pour un utilisateur"""
        return f"user_{user_id}_data"
    
    def get_matter_collection_name(self, user_id: int, matiere: str) -> str:
        """Générer le nom de collection pour une matière d'un utilisateur"""
        sanitized_matiere = matiere.lower().replace(' ', '_').replace('/', '_')
        return f"user_{user_id}_matter_{sanitized_matiere}"
    
    def store_user_profile(self, user_id: int, profile_data: Dict[str, Any]) -> str:
        """Stocker le profil utilisateur dans la BD vectorielle"""
        collection = self.get_or_create_collection(self.get_user_collection_name(user_id))
        
        doc_text = self._format_user_profile(profile_data)
        doc_id = f"profile_{user_id}_{datetime.now().timestamp()}"
        
        collection.add(
            documents=[doc_text],
            ids=[doc_id],
            metadatas=[{
                "type": "profile",
                "user_id": user_id,
                "created_at": datetime.now().isoformat()
            }]
        )
        
        return doc_id
    
    def store_user_diagnostic(self, user_id: int, diagnostic_data: Dict[str, Any]) -> str:
        """Stocker les résultats du diagnostic utilisateur"""
        collection = self.get_or_create_collection(self.get_user_collection_name(user_id))
        
        doc_text = self._format_diagnostic(diagnostic_data)
        doc_id = f"diagnostic_{user_id}_{datetime.now().timestamp()}"
        
        collection.add(
            documents=[doc_text],
            ids=[doc_id],
            metadatas=[{
                "type": "diagnostic",
                "user_id": user_id,
                "niveau": diagnostic_data.get('niveau_diagnostique'),
                "created_at": datetime.now().isoformat()
            }]
        )
        
        return doc_id
    
    def store_conversation_summary(
        self, 
        user_id: int, 
        matiere: str, 
        summary_data: Dict[str, Any]
    ) -> str:
        """Stocker un résumé de conversation dans la BD vectorielle"""
        collection = self.get_or_create_collection(
            self.get_matter_collection_name(user_id, matiere)
        )
        
        doc_text = self._format_conversation_summary(summary_data)
        doc_id = f"summary_{user_id}_{matiere}_{datetime.now().timestamp()}"
        
        collection.add(
            documents=[doc_text],
            ids=[doc_id],
            metadatas=[{
                "type": "conversation_summary",
                "user_id": user_id,
                "matiere": matiere,
                "concepts": ",".join(summary_data.get('key_concepts', [])),
                "created_at": datetime.now().isoformat()
            }]
        )
        
        return doc_id
    
    # ========================================================================
    # RÉCUPÉRATION DE CONTEXTE
    # ========================================================================
    
    def get_user_context(self, user_id: int, query: str = None) -> str:
        """Récupérer le contexte utilisateur pour les prompts"""
        collection = self.get_or_create_collection(self.get_user_collection_name(user_id))
        
        try:
            if query:
                results = collection.query(
                    query_texts=[query],
                    n_results=3,
                    where={"type": {"$in": ["profile", "diagnostic"]}}
                )
            else:
                # Récupérer les documents les plus récents
                all_results = collection.get()
                results = {
                    "documents": all_results.get("documents", [])[-3:],
                    "metadatas": all_results.get("metadatas", [])[-3:]
                }
            
            context_text = ""
            if results.get("documents"):
                for doc in results["documents"]:
                    context_text += doc + "\n\n"
            
            return context_text if context_text else "Pas de contexte disponible."
        
        except Exception as e:
            print(f"Erreur lors de la récupération du contexte utilisateur: {e}")
            return "Contexte non disponible."
    
    def get_matter_context(
        self, 
        user_id: int, 
        matiere: str, 
        query: str = None,
        n_results: int = 5
    ) -> str:
        """Récupérer le contexte d'apprentissage pour une matière"""
        collection_name = self.get_matter_collection_name(user_id, matiere)
        
        try:
            collection = self.get_or_create_collection(collection_name)
            
            if query:
                results = collection.query(
                    query_texts=[query],
                    n_results=n_results
                )
            else:
                # Récupérer les documents les plus récents
                all_results = collection.get()
                documents = all_results.get("documents", [])
                results = {
                    "documents": documents[-n_results:] if documents else [],
                    "metadatas": all_results.get("metadatas", [])[-n_results:] if all_results.get("metadatas") else []
                }
            
            context_text = ""
            if results.get("documents"):
                for doc in results["documents"]:
                    context_text += doc + "\n\n"
            
            return context_text if context_text else "Pas d'historique d'apprentissage pour cette matière."
        
        except Exception as e:
            print(f"Erreur lors de la récupération du contexte matière: {e}")
            return "Contexte matière non disponible."
    
    # ========================================================================
    # FORMATAGE DES DOCUMENTS
    # ========================================================================
    
    def _format_user_profile(self, profile_data: Dict) -> str:
        """Formater les données de profil en texte"""
        return f"""
PROFIL UTILISATEUR
====================
Nom: {profile_data.get('name', 'N/A')}
Niveau global: {profile_data.get('niveau_global', 'N/A')}
Style d'apprentissage: {profile_data.get('style_apprentissage', 'N/A')}
Cycle scolaire: {profile_data.get('class_cycle', 'N/A')}
Niveau scolaire: {profile_data.get('class_level', 'N/A')}
Date d'inscription: {profile_data.get('date_inscription', 'N/A')}
"""
    
    def _format_diagnostic(self, diagnostic_data: Dict) -> str:
        """Formater les résultats du diagnostic"""
        return f"""
RÉSULTATS DU DIAGNOSTIC INITIAL
================================
Niveau diagnostiqué: {diagnostic_data.get('niveau_diagnostique', 'N/A')}
Lacunes identifiées: {', '.join(diagnostic_data.get('lacunes_identifiees', []))}
Points forts: {', '.join(diagnostic_data.get('points_forts', []))}
Vitesse de compréhension: {diagnostic_data.get('vitesse_comprehension', 'N/A')}
Style d'apprentissage probable: {diagnostic_data.get('style_apprentissage_probable', 'N/A')}
Recommandations: {', '.join(diagnostic_data.get('recommandations', []))}
Plan d'action: {json.dumps(diagnostic_data.get('plan_action', {}), ensure_ascii=False, indent=2)}
"""
    
    def _format_conversation_summary(self, summary_data: Dict) -> str:
        """Formater un résumérée de conversation"""
        return f"""
RÉSUMÉ DE SESSION D'APPRENTISSAGE
==================================
Titre: {summary_data.get('titre', 'N/A')}
Concepts couverts: {', '.join(summary_data.get('concepts_couverts', []))}
Compétences travaillées: {', '.join(summary_data.get('competences_travaillees', []))}
Points clés:
{self._format_key_points(summary_data.get('points_cles', []))}
Progression: {summary_data.get('progression', 'N/A')}
Points forts: {', '.join(summary_data.get('points_forts', []))}
Axes d'amélioration: {', '.join(summary_data.get('axes_amelioration', []))}
Recommandations: {summary_data.get('recommandations', 'N/A')}
"""
    
    def _format_key_points(self, points: List[Dict]) -> str:
        """Formater les points clés"""
        formatted = ""
        for point in points:
            formatted += f"  • {point.get('titre', 'N/A')}: {point.get('description', '')}\n"
        return formatted
    
    # ========================================================================
    # UTILITAIRES
    # ========================================================================
    
    def clear_user_data(self, user_id: int) -> bool:
        """Effacer toutes les données d'un utilisateur (utile pour reset)"""
        try:
            collection_name = self.get_user_collection_name(user_id)
            self.client.delete_collection(name=collection_name)
            return True
        except:
            return False
    
    def get_all_user_matters(self, user_id: int) -> List[str]:
        """Obtenir toutes les matières étudiées par un utilisateur"""
        matters = []
        try:
            # Parcourir toutes les collections
            collections = self.client.list_collections()
            prefix = f"user_{user_id}_matter_"
            for collection in collections:
                if collection.name.startswith(prefix):
                    # Extraire le nom de la matière
                    matter = collection.name.replace(prefix, "").replace("_", " ")
                    matters.append(matter)
        except:
            pass
        return matters


# Initialiser le service global
rag_service = RAGGRASSService()
