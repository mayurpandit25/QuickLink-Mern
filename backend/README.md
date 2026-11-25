# QuickLink Backend – Docker Deployment on AWS EC2

This guide explains how to deploy the QuickLink Node.js backend application on an AWS EC2 Ubuntu instance using Docker.

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
             QuickLink Backend
               Node.js + Express
                    |
                    |
              Port 5000
                    |
                    |
             MongoDB Atlas
```

## 3. Clone the Repository

Connect to your EC2 instance and clone the project:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd QuickLink-Mern
```

Navigate to the backend directory:

```bash
cd backend
```

## 4. Configure Environment Variables

Create the `.env` file:

```bash
vim .env
```

Add the following configuration:

```env
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_URL>/quicklink
FRONTEND_URL=http://<EC2_PUBLIC_IP>
PUBLIC_BASE_URL=http://<EC2_PUBLIC_IP>:5000
```

Save and exit.

**Important:** Replace the placeholders with your actual MongoDB Atlas credentials and EC2 public IP.

Do not upload the `.env` file to GitHub or include it in the Docker image.

## 5. Create Backend Dockerfile

Inside the `backend` directory:

```bash
vim Dockerfile
```

Add the following Dockerfile:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

## 7. Build the Docker Image

Make sure you are inside the `backend` directory:

```bash
docker build -t quicklink-backend:v1 .
```

Verify the image:

```bash
docker images
```

## 8. Run the Backend Container

Run the backend application:

```bash
docker run -d \
  --name quicklink-backend \
  -p 5000:5000 \
  --env-file .env \
  quicklink-backend:v1
```

## 9. Verify the Deployment

Check running containers:

```bash
docker ps
```

Check backend logs:

```bash
docker logs quicklink-backend
```

Follow logs continuously:

```bash
docker logs -f quicklink-backend
```

Test the backend locally from EC2:

```bash
curl http://localhost:5000/health
```

Test using the EC2 public IP:

```text
http://<EC2_PUBLIC_IP>:5000/health
```

The EC2 Security Group must allow inbound TCP traffic on port `5000` for this public test.

## 10. Container Management

Stop the container:

```bash
docker stop quicklink-backend
```

Start the existing container:

```bash
docker start quicklink-backend
```

Restart the container:

```bash
docker restart quicklink-backend
```

View container logs:

```bash
docker logs quicklink-backend
```

Remove the container:

```bash
docker stop quicklink-backend
docker rm quicklink-backend
```

## 11. Deploy a New Backend Version

After making changes to the backend source code:

Build a new image:

```bash
docker build -t quicklink-backend:v2 .
```

Stop and remove the old container:

```bash
docker stop quicklink-backend
docker rm quicklink-backend
```

Run the new version:

```bash
docker run -d \
  --name quicklink-backend \
  -p 5000:5000 \
  --env-file .env \
  quicklink-backend:v2
```

Verify the new deployment:

```bash
docker ps
docker logs quicklink-backend
```

## 12. Troubleshooting

**Check container status:**

```bash
docker ps -a
```

**Check application logs:**

```bash
docker logs quicklink-backend
```

**Check whether port 5000 is already in use:**

```bash
sudo ss -lntp | grep :5000
```

**Check Docker service:**

```bash
sudo systemctl status docker
```

**Check MongoDB connectivity errors:**

```bash
docker logs quicklink-backend
```

Verify:

- MongoDB Atlas credentials are correct.
- The EC2 public IP is allowed in MongoDB Atlas Network Access.
- The `MONGO_URI` environment variable is configured correctly.
- The backend application listens on `0.0.0.0` inside the container.
