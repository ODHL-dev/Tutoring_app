# Backend - Data models

User
{
  "id": "user-123",
  "name": "Eleve Web",
  "firstName": "Eleve",
  "lastName": "Web",
  "email": "web@test.com",
  "role": "student",
  "classCycle": "secondaire",
  "classLevel": "3e",
  "series": "A",
  "createdAt": "2026-02-08T12:00:00Z"
}

Group
{
  "id": "group-123",
  "name": "Groupe Alpha",
  "code": "ALPHA1",
  "memberCount": 12
}

Lesson
{
  "id": "lesson-123",
  "title": "Introduction a l'algebre",
  "subject": "Mathematiques",
  "duration": "45 min",
  "progress": 0.75
}

ChatMessage
{
  "id": "msg-123",
  "role": "user",
  "content": "...",
  "timestamp": "2026-02-08T12:00:00Z"
}

