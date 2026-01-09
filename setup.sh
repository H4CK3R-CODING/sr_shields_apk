#!/bin/bash
docker-compose build
docker-compose up -d
echo "✅ Frontend: http://localhost:8081"
echo "✅ Backend:  http://localhost:5000"
