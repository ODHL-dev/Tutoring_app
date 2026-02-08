# Backend - Endpoints principaux

Users
- GET /users/me
- PATCH /users/me

Courses
- GET /courses
- GET /courses/:courseId

Lessons
- GET /lessons
- GET /lessons/:lessonId

Groups
- GET /groups
- POST /groups
- GET /groups/:groupId
- POST /groups/:groupId/join
- GET /groups/:groupId/members

Teacher
- GET /teacher/classes
- GET /teacher/classes/:classId
- POST /teacher/classes/:classId/pdfs

Chat IA
- POST /ai/chat

Exemple /ai/chat
Requete
{
  "messages": [
    { "role": "user", "content": "Explique les fractions" }
  ]
}

Reponse
{
  "message": { "role": "assistant", "content": "..." }
}

