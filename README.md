# NoteBoard Backend API

A secure, token-based backend built with **Node.js, Express, MongoDB**, and **Passport OAuth (Google & Email OTP)** for authentication, powering a modern full-stack note-taking app.

---

## Features

- JWT-based protected routes
- Google OAuth 2.0 login via Passport.js
- Email + OTP signup/login flow via NodeMailer
- MongoDB + Mongoose models
- Token generation with `jsonwebtoken`
- Notes CRUD operations (Create, Read, Delete)
- Clean modular route and middleware structure

---

## Folder Structure
```bash

backend/
├── config/
│ └── passport.ts # Google OAuth strategy config
├── controllers/
│ └── authControllers.ts # Signup, login, OTP logic
│ └── noteControllers.ts # Notes CRUD handlers
├── middlewares/
│ └── authMiddleware.ts # JWT protect middleware
├── models/
│ └── userModel.ts # Mongoose user schema
│ └── noteModel.ts # Mongoose note schema
├── routes/
│ └── authRoutes.ts # Auth routes
│ └── noteRoutes.ts # Notes routes
├── utils/
│ └── jwt.ts # Token generation util
│ └── otp.ts # OTP email util
├── .env
├── server.ts # Express server config
└── package.json

```
---

## Environment Variables (`.env`)

Create a `.env` file in `backend/` with:

```bash

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

```

---

## Install & Run Backend

```bash

cd backend
npm install
npm run dev

```

Server will run at:

```bash

http://localhost:5000

```

## API Routes

# Notes API

```bash 

| Method | Route            | Description              |
| :----- | :--------------- | :----------------------- |
| GET    | `/api/notes`     | Get all notes (auth)     |
| POST   | `/api/notes`     | Create new note (auth)   |
| DELETE | `/api/notes/:id` | Delete note by ID (auth) |

```

# Auth API

```bash 

| Method | Route                       | Description                        |
| :----- | :-------------------------- | :--------------------------------- |
| POST   | `/api/auth/signup`          | Signup with email + username (OTP) |
| POST   | `/api/auth/send-login-otp`  | Request OTP for login              |
| POST   | `/api/auth/verify-otp`      | Verify OTP, get JWT token          |
| GET    | `/api/auth/google`          | Google OAuth login redirect        |
| GET    | `/api/auth/google/callback` | Google OAuth callback + token      |

```