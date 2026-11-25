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
| Cloud Platform | AWS |
| Compute Service | EC2 |
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
│   ├── models/
│   │   └── Url.js
│   ├── routes/
│   │   └── urlRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
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
- Git
- MongoDB Atlas database or a reachable MongoDB server

---

# Part 1: Local Development Setup

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
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `backend/.env` and configure:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/quicklink?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
PUBLIC_BASE_URL=http://localhost:5000
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

The backend listens on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

## 3. Start the Frontend

Open a second terminal from the project root:

```bash
cd frontend
```

Create the environment file:

```bash
cp .env.example .env
```

Configure the frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the Vite URL, normally:

```text
http://localhost:5173
```

---

# Part 2: REST API

## 1. Health Check

**Method:** GET

```text
/health
```

## 2. Create a Short URL

**Method:** POST

```text
/api/urls
```

Request JSON:

```json
{
  "originalUrl": "https://www.example.com/a/long/path"
}
```

## 3. List Saved URLs

**Method:** GET

```text
/api/urls
```

## 4. Redirect

**Method:** GET

```text
/:shortCode
```

For example:

```text
http://localhost:5000/AbCd123
```

Redirects to the stored original URL.

---

# Part 3: AWS EC2 Manual Deployment

This section explains how to deploy the complete QuickLink application on an AWS EC2 Ubuntu instance without Docker.

## 1. Create an EC2 Instance

1. Log in to the AWS Management Console.
2. Search for EC2.
3. Select **Launch Instance**.
4. Configure the following settings:

| Configuration | Value |
|---|---|
| Name | QuickLink-Server |
| AMI | Ubuntu Server 24.04 LTS |
| Instance Type | t2.micro or suitable instance type |
| Key Pair | Create or select an existing key pair |
| Storage | 20 GB |
| VPC | Default VPC |
| Auto-assign Public IP | Enable |

5. Click **Launch Instance**.

## 2. Configure Security Group

Configure these inbound rules:

| Type | Protocol | Port | Source |
|---|---|---:|---|
| SSH | TCP | 22 | My IP |
| HTTP | TCP | 80 | 0.0.0.0/0 |

For this deployment, Nginx will serve the frontend and forward API requests to the backend. Port 5000 does not need to be publicly exposed.

## 3. Connect to EC2

Open PowerShell or your local terminal.

Navigate to the directory containing your PEM file:

```bash
cd Downloads
```

Connect to EC2:

```bash
ssh -i quicklink-key.pem ubuntu@<EC2_PUBLIC_IP>
```

Replace `<EC2_PUBLIC_IP>` with your EC2 public IPv4 address.

## 4. Update Ubuntu Packages

```bash
sudo apt update
```

```bash
sudo apt upgrade -y
```

## 5. Install Node.js and npm

Install Node.js 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
```

Install Node.js:

```bash
sudo apt install -y nodejs
```

Verify:

```bash
node --version
npm --version
```

## 6. Install Git

```bash
sudo apt install -y git
```

Verify:

```bash
git --version
```

## 7. Install PM2

Install PM2 globally:

```bash
sudo npm install -g pm2
```

Verify:

```bash
pm2 --version
```

PM2 manages the backend Node.js application and keeps it running in the background.

## 8. Install Nginx

Install Nginx:

```bash
sudo apt install -y nginx
```

Start Nginx:

```bash
sudo systemctl start nginx
```

Enable Nginx at system startup:

```bash
sudo systemctl enable nginx
```

Verify:

```bash
sudo systemctl status nginx
```

## 9. Clone the GitHub Repository

Clone your project:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd quicklink-mern
```

Verify:

```bash
ls
```

Expected directories:

```text
backend/
frontend/
```

## 10. Configure Backend Environment Variables

Navigate to the backend directory:

```bash
cd backend
```

Create the `.env` file:

```bash
cp .env.example .env
```

Edit:

```bash
vim .env
```

Configure:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/quicklink?retryWrites=true&w=majority
FRONTEND_URL=http://<EC2_PUBLIC_IP>
PUBLIC_BASE_URL=http://<EC2_PUBLIC_IP>
```

Replace the placeholders with your actual MongoDB Atlas connection details and EC2 public IP.

**Important:** The `PUBLIC_BASE_URL` above assumes short links are generated using the same public Nginx URL and that Nginx redirects `/:shortCode` requests to the backend. This is configured in a later step.

Save and exit.

Do not commit `.env` to GitHub.

## 11. Install Backend Dependencies

Make sure you are inside the backend directory:

```bash
npm install
```

## 12. Start Backend Using PM2

Start the backend:

```bash
pm2 start server.js --name quicklink-backend
```

Check the process:

```bash
pm2 status
```

View backend logs:

```bash
pm2 logs quicklink-backend
```

Test the backend locally:

```bash
curl http://localhost:5000/health
```

## 13. Configure PM2 Startup

Save the current process list:

```bash
pm2 save
```

Generate the startup configuration:

```bash
pm2 startup
```

PM2 displays a command. Copy and execute that exact command.

Save the process list again:

```bash
pm2 save
```

This allows PM2 to restore the backend process after an EC2 reboot.

## 14. Configure Frontend Environment Variables

Navigate to the frontend directory:

```bash
cd ../frontend
```

Create the `.env` file:

```bash
cp .env.example .env
```

Edit:

```bash
vim .env
```

Configure:

```env
VITE_API_BASE_URL=/api
```

This uses Nginx as a reverse proxy, so the browser sends API requests through the same public origin.

Save and exit.

**Important:** This assumes the frontend uses `VITE_API_BASE_URL` as its API base URL and makes requests using paths such as `/api/urls`.

## 15. Install Frontend Dependencies

```bash
npm install
```

## 16. Build the Frontend

Build the production frontend:

```bash
npm run build
```

Vite generates production-ready files inside the `dist` directory.

Verify:

```bash
ls -l dist
```

## 17. Deploy Frontend Files to Nginx

Create the frontend directory:

```bash
sudo mkdir -p /var/www/quicklink
```

Copy the production build:

```bash
sudo cp -r dist/* /var/www/quicklink/
```

Set ownership:

```bash
sudo chown -R www-data:www-data /var/www/quicklink
```

Set permissions:

```bash
sudo chmod -R 755 /var/www/quicklink
```

## 18. Configure Nginx as Frontend Server and API Reverse Proxy

Create the Nginx configuration:

```bash
sudo vim /etc/nginx/sites-available/quicklink
```

Add:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/quicklink;
    index index.html;

    # Frontend application
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Short URL redirection
    location ~ ^/[A-Za-z0-9_-]+$ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The API and short-code locations forward matching requests to the backend on port 5000.

The configuration assumes your backend routes use `/api/urls` for API requests and `/:shortCode` for redirects. If your backend uses different routes, adjust the Nginx locations accordingly.

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/quicklink /etc/nginx/sites-enabled/quicklink
```

Remove the default Nginx configuration:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

Test Nginx configuration:

```bash
sudo nginx -t
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

## 19. Verify Complete Deployment

Check backend status:

```bash
pm2 status
```

Check Nginx status:

```bash
sudo systemctl status nginx
```

Test backend locally:

```bash
curl http://localhost:5000/health
```

Test frontend:

```bash
curl -I http://localhost
```

Test the API through Nginx:

```bash
curl http://localhost/api/urls
```

Open the application:

```text
http://<EC2_PUBLIC_IP>
```

Your QuickLink frontend should now be accessible through the EC2 public IP.

## 20. Application Management

### Backend Management Using PM2

Check status:

```bash
pm2 status
```

View logs:

```bash
pm2 logs quicklink-backend
```

Restart backend:

```bash
pm2 restart quicklink-backend
```

Stop backend:

```bash
pm2 stop quicklink-backend
```

Delete backend process:

```bash
pm2 delete quicklink-backend
```

### Frontend Management Using Nginx

Check Nginx status:

```bash
sudo systemctl status nginx
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

Reload Nginx:

```bash
sudo systemctl reload nginx
```

Stop Nginx:

```bash
sudo systemctl stop nginx
```

## 21. Deploy a New Application Version

### Backend Update

Navigate to the backend directory:

```bash
cd ~/quicklink-mern/backend
```

Pull the latest code:

```bash
git pull
```

Install updated dependencies:

```bash
npm install
```

Restart the backend:

```bash
pm2 restart quicklink-backend --update-env
```

### Frontend Update

Navigate to the frontend directory:

```bash
cd ~/quicklink-mern/frontend
```

Pull the latest code:

```bash
git pull
```

Install updated dependencies:

```bash
npm install
```

Build the frontend:

```bash
npm run build
```

Copy updated files to Nginx:

```bash
sudo cp -r dist/* /var/www/quicklink/
```

Reload Nginx:

```bash
sudo systemctl reload nginx
```

## 22. Troubleshooting

Check backend process:

```bash
pm2 status
```

Check backend logs:

```bash
pm2 logs quicklink-backend
```

Check Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

Check Nginx configuration:

```bash
sudo nginx -t
```

Check port 80:

```bash
sudo ss -lntp | grep :80
```

Check port 5000:

```bash
sudo ss -lntp | grep :5000
```

Verify MongoDB Atlas connectivity:

- Check MongoDB username and password.
- Verify the connection string in backend `.env`.
- Allow the EC2 public IP in MongoDB Atlas Network Access.
- Verify that the backend process is running.

Verify frontend connectivity:

- Check the `VITE_API_BASE_URL` value.
- Rebuild the frontend after changing environment variables.
- Verify Nginx reverse proxy configuration.
- Check the backend API routes.
- Inspect the browser developer console for errors.

## 23. Deployment Summary

| Component | Technology |
|---|---|
| Cloud Provider | AWS |
| Compute Service | EC2 |
| Operating System | Ubuntu |
| Frontend | React + Vite |
| Frontend Web Server | Nginx |
| Backend | Node.js + Express |
| Process Manager | PM2 |
| Database | MongoDB Atlas |
| Frontend Access | Port 80 |
| Backend Internal Port | 5000 |
| Deployment Method | Manual EC2 Deployment |

**Deployment completed:** QuickLink is deployed directly on AWS EC2. Nginx serves the React frontend and forwards API and short-link requests to the Node.js backend. PM2 manages the backend process, while MongoDB Atlas stores URL information.
