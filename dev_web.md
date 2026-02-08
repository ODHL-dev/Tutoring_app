Fiche Technique : Plateforme de Tutorat Intelligent (IA Hybride)
1. Vision du Projet
Développer une solution éducative pour le primaire et le secondaire, capable de fonctionner hors-ligne sur mobile (< 1 Go) tout en offrant une expérience complète et synchronisée sur le Web.

2. Architecture Logicielle (Stack Technique)
Couche,Technologie,Rôle
Backend,Django (Python),"Gestion de l'API, logique métier, orchestration des modèles IA (serveur) et génération des rapports de diagnostic."
Base de Données,MySQL,"Centralisation des utilisateurs, de la progression scolaire et de la bibliothèque de contenus."
Frontend Web,React.js,Interface pour les enseignants (Tableaux de bord) et les élèves sur ordinateur.
App Mobile,Flutter (ou React Native),Interface cross-platform gérant l'exécution de l'IA locale via ExecuTorch.
IA Locale (Mobile),Llama 3.2 1B,Moteur de raisonnement hors-ligne quantifié en 4-bit (~700 Mo).
Vision (OCR),Google ML Kit,Reconnaissance de texte manuscrit et formules (compatible iOS & Android).

3. Stratégie IA & Modularité (Le système de Plugins)
Afin de respecter la limite de 1 Go tout en couvrant plusieurs niveaux et langues, l'IA est découpée en modules :
Modèle de base (Backbone) : Llama 3.2 1B, gérant la structure du langage.
Plugins LoRA (Adapteurs) : Petits fichiers (~80 Mo) téléchargeables à la demande.
LoRA Cycle : Spécialisation "Primaire" (ludique) ou "Secondaire" (académique).
LoRA Langue : Support des langues locales (Wolof, Bambara, etc.) pour expliquer les concepts complexes.
RAG Local (Connaissances) : Les leçons ne sont pas "apprises" par l'IA mais stockées en fichiers JSON légers. L'IA les consulte en temps réel pour éviter les erreurs (hallucinations).

4. Fonctionnalités Clés
Tuteur Socratique : L'IA guide l'élève par des questions au lieu de donner la réponse directe.
Répétition Espacée (Spaced Repetition) : Algorithme (type SM-2) planifiant les révisions selon la courbe de l'oubli.
Avatar Évolutif : Gamification via un compagnon visuel dont l'état dépend des succès de l'élève.
OCR Math/PC : Scan des exercices papier pour une aide immédiate étape par étape.
Rapport de Diagnostic : Analyse par Django des points forts/faibles pour envoi automatique aux parents.
Espace Enseignant : Dashboard React permettant de suivre la progression de la classe et d'importer des cours personnalisés.

5. Budget de Stockage Mobile (Cible < 1 Go)
Composant,Taille estimée
Moteur IA (Llama 3.2 1B quantifié),700 Mo
Application (Flutter + Assets UI),100 Mo
Librairies Vision (ML Kit),50 Mo
Modules LoRA & Leçons (Initiaux),130 Mo
TOTAL,~980 Mo

6. Flux de Fonctionnement (Data Flow)Hors-ligne : L'élève scanne un exercice $\rightarrow$ ML Kit extrait le texte $\rightarrow$ Llama local analyse via le RAG local $\rightarrow$ L'élève progresse $\rightarrow$ Sauvegarde en SQLite.Synchronisation : Dès qu'une connexion est détectée $\rightarrow$ SQLite pousse les données vers Django/MySQL.Web / Cloud : Le parent se connecte sur React $\rightarrow$ Django récupère les données MySQL $\rightarrow$ Génération d'un rapport de progression personnalisé.

Demande perso
-	L’IA suit les progressions en fonction du Curricula de l’Etat et des photos des leçons de l’élève
-	Pédagogie est l’art et la science de l’enseignement, c’est transmettant des connaissances tout en mettant l’épanouissement de l’apprenant au centre.
-	Le tuteur doit s’adapter à la manière d’apprendre de l’étudiant
-	L’IA doit prendre des feedbacks chez l’User pour améliorer son approche d’enseignement
-	Mettre en place un système de feedbacks entre l’étudiant, l’enseignant et l’IA.
-	Mise en place de groupe par le prof pour pister les zones d’incompréhension des étudiants.
-	Permettre de faire de feedback entre l’App et les Parents afin de se tenir informer sur l’évolution de l’élève.
-	Utiliser des données personnalisées pour des classes précises et laisser l’IA gérer le reste.
-	Il doit avoir une interactivité entre l’IA et l’apprenant dans les leçons et les exercices.
-	Labéliser(donner un titre comme génie, ……) la connaissance de l’étudiant après chaque interaction
-	Se baser sur un système de label (débutant, amateur, pro, …)pour permettre en place des sessions de révisions sur une notion non maitriser
-	L’IA doit être le chef d’orchestre de notre application

Cahier de charge
Objet :
On parle d’une application web et d’une application mobile. L’application web donne acces a un tuteur. Ce tuteur ai-powered est capable d’etre un enseignant, un repetiteur, un precepteur mandaté par l’enseignant reel. Depuis l’app mobile il est possible d’acceder aux memes fonctionnalités avec l’avantage que les conversations sont sauvegardees en local , les rapports du repetiteurs et les evals sont exportables et il est possible d’avoir un mini model en local.

Motif et contexte : Pas suffisamment d’enseignants dans le pays, les repetiteurs coutent chers, et en vrai c’est un tp sinon jamaissss…

Objectifs :
	Temps : En 20jrs stp. Date limite : 10 fevrier 2025

	Charges : Depenser le moins possible en hebergement et autres

	Qualité : Un enfant du primaire devrait pas se voir poser des questons dans un langage compliqué et des questions qui reclament une vision claire des objectifs de l’apprentissage. La version web devrait etre zero bugs. 

	Couts : Zero centimes.

Objectif : Obtenir le stage promis par le prof.
	*L’appli doit donner donner des reponses satisfaisantes meme hors ligne.
	*Le code doit etre maintenable et bien structuré via github.
	• Offrir un accompagnement pédagogique personnalisé à chaque élève
	• Réduire les difficultés scolaires et le décrochage
	• Compléter le travail des enseignants sans le remplacer

 
Acteurs:
Dev 1  : Loukman
Dev secondaire : Felix 

Organisation : 
	*Chef de Projet : Loukmane
	*Responsable des tests : Sylvanus Sanou
	*Front-end dev : Loukmane
	*Backend dev : Nanema Félix
	*Mobile dev :  Felix & Loukmane

Logique applicative :
I) Front-end :
A)Create_account/Login
Login/Create_account → As_School → School_Dashboard
Login/Create_account → Credentials → Home

School_dash→ Create-teacher-account                                                                                       
School_dash→ Create-student-account
School_dash → Stats
School_dash → 



Home_Home → Account
Home → Menu_Hamburger → 
Home → Cours →  Selection_de_text →Copy/IA → IA_App Openning → His prompt
Home → Chat → Type your prompt
Home → 

	
Comment entrainer une IA selon Moussa :
On sait prkw on entraine l’IA.
On a les donnees : pdf , txt , csv , ….
Data cleaning 
Comment integrer les donnees a notre IA pre-entrainees : 
Choix du modele pre-entrainee : Net_Mobile_v2
Numpy
Tensor_Flow  
Machinelearnia + SimpleLearn
RAG : L’USER donne un prompte qui sera transformé en un autre prompt et donner a l’IA generative. 
LoRA : ---
