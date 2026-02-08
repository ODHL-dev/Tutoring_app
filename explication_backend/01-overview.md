# Backend - Overview

Objectif
- Fournir une API HTTP pour l'authentification, les cours, les groupes et le chat IA.
- Proposer du temps reel (WebSocket) pour le chat et les notifications.
- Garantir une structure de donnees stable pour le frontend.

Architecture proposee
- API REST (JSON)
- WebSocket pour le chat en direct
- Stockage (SQL ou NoSQL)
- Services IA (appel a un LLM via API)

Base URL
- DEV: http://localhost:3000
- PROD: https://api.tutoringapp.com

Conventions
- JSON en camelCase
- Dates ISO 8601 en UTC
- Erreurs structurees (voir 06-errors.md)

