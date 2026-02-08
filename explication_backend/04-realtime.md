# Backend - Realtime (WebSocket)

Objectif
- Echanges en direct pour le chat et notifications.

Connexion
- ws://localhost:3000/ws
- wss://api.tutoringapp.com/ws

Handshake
- Envoyer un message "auth" avec le token.

Exemple
Client ->
{
  "type": "auth",
  "token": "<accessToken>"
}

Serveur ->
{
  "type": "auth_ok"
}

Chat
Client ->
{
  "type": "chat_message",
  "conversationId": "conv-123",
  "message": { "role": "user", "content": "..." }
}

Serveur ->
{
  "type": "chat_message",
  "conversationId": "conv-123",
  "message": { "role": "assistant", "content": "..." }
}

