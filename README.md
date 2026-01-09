# React Native + Node.js + Database (Dockerized Setup)

This repository contains a full-stack mobile application with:

- **Frontend** → React Native (TypeScript)  
- **Backend** → Node.js/Express (TypeScript + Prisma ORM)  
- **Database** → PostgreSQL / MongoDB  
- **Docker** → Cross-OS development without dependency issues  

---

## Initial Setup

```bash
# Clone repository
git clone <repo-url>

# Go to project directory
cd my-project

# Run setup script (build + start services)
./docker/setup.sh

#Run Frontend only
docker-compose up frontend

#Run Backend only
docker-compose up backend

#Run Both (Frontend + Backend)
docker-compose up

#Build all services
docker-compose build

#Start all services
docker-compose up

#Start in background
docker-compose up -d

#Stop all services/Container
docker-compose down



