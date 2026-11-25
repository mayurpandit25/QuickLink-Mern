# QuickLink Frontend – Docker Deployment on AWS EC2

This guide explains how to deploy the QuickLink React frontend application on an AWS EC2 Ubuntu instance using Docker and Nginx.

## 1. Architecture

```text
                 Internet
                    |
                    |
              AWS EC2 Instance
                    |
                    |
             Docker Container
                    |
                  Nginx
                    |
             React Frontend
                    |
                Port 80
                    |
                    |
             Backend API
                    |
                Port 5000
```

## 2. Clone the Repository

Connect to your EC2 instance and clone the project:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd QuickLink-Mern
```

Navigate to the frontend directory:

```bash
cd frontend
```

## 3. Configure Environment Variables

Create the `.env` file:

```bash
vim .env
```

Add the following configuration:

```env
VITE_API_BASE_URL=http://<EC2_PUBLIC_IP>:5000
```

Save and exit.

**Important:** Replace `<EC2_PUBLIC_IP>` with your actual EC2 public IP address.

The Vite environment variable is used during the frontend build process. It becomes part of the generated frontend JavaScript files, so never store passwords, database credentials, or other secrets in Vite environment variables.

## 4. Create Frontend Dockerfile

Inside the `frontend` directory:

```bash
vim Dockerfile
```

Add the following Dockerfile:

```dockerfile
# Stage 1: Build React application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve application using Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 5. Create .dockerignore

Inside the `frontend` directory:

```bash
vim .dockerignore
```

Add the following configuration:

```text
node_modules
dist
.git
npm-debug.log
```

**Important:** Do not exclude the frontend `.env` file from the Docker build context in this setup. Vite needs it during the build process.

## 6. Build the Docker Image

Make sure you are inside the `frontend` directory:

```bash
docker build -t quicklink-frontend:v1 .
```

Verify the image:

```bash
docker images
```

## 7. Run the Frontend Container

Run the frontend application:

```bash
docker run -d \
  --name quicklink-frontend \
  -p 80:80 \
  quicklink-frontend:v1
```

## 8. Verify the Deployment

Check running containers:

```bash
docker ps
```

Check frontend container logs:

```bash
docker logs quicklink-frontend
```

Follow logs continuously:

```bash
docker logs -f quicklink-frontend
```

Test the frontend locally from EC2:

```bash
curl -I http://localhost
```

Test using the EC2 public IP:

```text
http://<EC2_PUBLIC_IP>
```

The EC2 Security Group must allow inbound HTTP traffic on port `80` for public access.

## 9. Container Management

Stop the container:

```bash
docker stop quicklink-frontend
```

Start the existing container:

```bash
docker start quicklink-frontend
```

Restart the container:

```bash
docker restart quicklink-frontend
```

View container logs:

```bash
docker logs quicklink-frontend
```

Remove the container:

```bash
docker stop quicklink-frontend
docker rm quicklink-frontend
```

## 10. Deploy a New Frontend Version

After making changes to the frontend source code:

Build a new image:

```bash
docker build -t quicklink-frontend:v2 .
```

Stop and remove the old container:

```bash
docker stop quicklink-frontend
docker rm quicklink-frontend
```

Run the new version:

```bash
docker run -d \
  --name quicklink-frontend \
  -p 80:80 \
  quicklink-frontend:v2
```

Verify the new deployment:

```bash
docker ps
docker logs quicklink-frontend
```

## 11. Troubleshooting

**Check container status:**

```bash
docker ps -a
```

**Check container logs:**

```bash
docker logs quicklink-frontend
```

**Check whether port 80 is already in use:**

```bash
sudo ss -lntp | grep :80
```

**Check Docker service:**

```bash
sudo systemctl status docker
```

**Check Nginx inside the container:**

```bash
docker exec -it quicklink-frontend nginx -t
```

**Check frontend files inside the container:**

```bash
docker exec -it quicklink-frontend ls -l /usr/share/nginx/html
```

Verify:

- The frontend `.env` file contains the correct `VITE_API_BASE_URL`.
- The frontend Docker image was built after configuring the correct API URL.
- The backend container is running and accessible.
- The EC2 Security Group allows inbound HTTP traffic on port `80`.
- The EC2 Security Group allows the frontend to reach the backend on port `5000`.
- The backend application allows requests from the frontend origin through CORS.

## Deployment Summary

| Component | Configuration |
|---|---|
| Application | QuickLink Frontend |
| Framework | React + Vite |
| Build Runtime | Node.js 22 |
| Web Server | Nginx |
| Container Engine | Docker |
| Container Name | quicklink-frontend |
| Docker Image | quicklink-frontend:v1 |
| Application Port | 80 |
| Host Port | 80 |
| Deployment Platform | AWS EC2 Ubuntu |

**Deployment completed:** QuickLink Frontend is running inside a Docker container on AWS EC2 and served using Nginx.
