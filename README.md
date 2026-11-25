# QuickLink – Basic MERN URL Shortener

A beginner-friendly URL shortener built with React, Node.js, Express, MongoDB Atlas and Mongoose.

## Features

- Enter a long HTTP/HTTPS URL and generate a short code.
- Save the original URL and short code in MongoDB.
- List previously created links.
- Copy and open shortened links.
- Redirect short links to their original destination.
- Count redirects.
- Health endpoint for server checks.

## Technology Stack

| Category | Technology |
|---|---|
| Frontend | React.js |
| Frontend Build Tool | Vite |
| Styling | CSS |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Environment Variables | dotenv |
| HTTP Client | Axios |
| Short Code Generation | Nano ID |
| Frontend Icons | Lucide React |
| Deployment | AWS EC2 |
| Web Server | Nginx |
| Process Manager | PM2 |
| Version Control | Git & GitHub |

## Database Details

- **Database Name:** `quicklink`
- **Database Type:** MongoDB
- **Collection Name:** `urls`

The application stores URL information in the `urls` collection.

Each URL document contains:
- `_id` – Unique document identifier.
- `originalUrl` – Original long URL.
- `shortCode` – Generated short URL code.
- `clicks` – Number of redirects.
- `createdAt` – Record creation timestamp.
- `updatedAt` – Last update timestamp.

MongoDB creates the database and collection automatically when the first URL document is inserted.

## Project Structure

```text
quicklink-mern/
├── backend/
│   ├── models/Url.js
│   ├── routes/urlRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
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

Database name: `quicklink`

Do not commit your `.env` file or expose database credentials.

## 2. Start the Backend

Open a terminal from the project root:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and configure:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/quicklink?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
PUBLIC_BASE_URL=http://localhost:5000
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The backend listens on:

`http://localhost:5000`

Health check:

`http://localhost:5000/health`

## 3. Start the Frontend

Open a second terminal from the project root:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open the Vite URL, normally:

`http://localhost:5173`

## REST API

### Health Check

`GET /health`

### Create a Short URL

`POST /api/urls`

Request JSON:

```json
{
  "originalUrl": "https://www.example.com/a/long/path"
}
```

### List Saved URLs

`GET /api/urls`

### Redirect

`GET /:shortCode`

For example:

`GET http://localhost:5000/AbCd123`

Redirects to the stored
