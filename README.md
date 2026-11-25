# QuickLink - Basic MERN URL Shortener

A beginner-friendly URL shortener built with React, Node.js, Express, MongoDB Atlas and Mongoose.

## Features

- Enter a long HTTP/HTTPS URL and generate a short code.
- Save the original URL and short code in MongoDB.
- List previously created links.
- Copy and open shortened links.
- Redirect short links to their original destination.
- Count redirects.
- Health endpoint for server checks.

## Project structure

```text
quicklink-mern/
├── backend/
│   ├── models/Url.js
│   ├── routes/urlRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/App.jsx
    ├── src/App.css
    ├── src/index.css
    ├── src/main.jsx
    ├── .env.example
    ├── index.html
    └── package.json
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas database or a reachable MongoDB server

## 1. Configure MongoDB

1. In MongoDB Atlas, create or select a cluster.
2. Create a database user.
3. Allow the development machine's public IP in Network Access.
4. Copy the MongoDB connection string.
5. Replace the username, password and cluster host in the backend environment file.

Do not commit your `.env` file or expose database credentials.

## 2. Start the backend

Open a terminal:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set `MONGO_URI`. For local development, keep:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
PUBLIC_BASE_URL=http://localhost:5000
```

Install and start:

```bash
npm install
npm run dev
```

The backend listens on `http://localhost:5000`.

Health check: http://localhost:5000/health

## 3. Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open the Vite URL, normally http://localhost:5173.

## REST API

### Health check

`GET /health`

### Create a short URL

`POST /api/urls`

Request JSON:

```json
{
  "originalUrl": "https://www.example.com/a/long/path"
}
```

### List saved URLs

`GET /api/urls`

### Redirect

`GET /:shortCode`

For example, `GET http://localhost:5000/AbCd123` redirects to the stored original URL.

## Manual deployment notes

For a single-EC2 deployment:

- Build the frontend with `npm run build` and serve the `frontend/dist` directory through Nginx.
- Run the backend with a process manager such as PM2.
- Set `VITE_API_BASE_URL` to the public API origin before building the frontend.
- Set backend `PUBLIC_BASE_URL` to the public origin used for short links.
- Set backend `FRONTEND_URL` to the deployed frontend origin.
- Configure MongoDB Atlas Network Access for the EC2 server. Prefer a restricted IP rule rather than `0.0.0.0/0`.
- Configure HTTPS before using the application publicly.

Vite environment variables are embedded at build time. Rebuild the frontend after changing `VITE_API_BASE_URL`.

## Important

This is a teaching/demo application. It does not include authentication, rate limiting, abuse reporting, custom domains, or link expiration. Before exposing it publicly, add abuse controls and operational protections.
