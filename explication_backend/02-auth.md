# Backend - Auth

Flux auth
- Inscription
- Connexion
- Rafraichissement de token
- Deconnexion

Endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout

Requetes
POST /auth/register
{
  "firstName": "Eleve",
  "lastName": "Web",
  "email": "web@test.com",
  "password": "123456",
  "role": "student",
  "classCycle": "secondaire",
  "classLevel": "3e",
  "series": "A"
}

POST /auth/login
{
  "email": "web@test.com",
  "password": "123456"
}

Reponses
200 OK
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}

Headers
- Authorization: Bearer <accessToken>

