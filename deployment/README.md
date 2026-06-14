SHNOOR LMS - Deployment Guide

This folder contains everything needed to run the SHNOOR LMS using Docker. This ensures that the application, its database, and all dependencies work exactly the same on any system.

Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine (Linux).

How to Run

1. Open a Terminal (Command Prompt or PowerShell) in this `deployment` folder.
2. Start the System:
   Run the following command:
   >> docker-compose up --build

3. Access the Application:
   - Website: [http://localhost](http://localhost)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - Database: Port 5432 (Postgres)
   
- The database data is stored in a Docker volume called `postgres_data`, so it persists even if you stop the containers.
- To stop the system, press `Ctrl+C` in the terminal or run `docker-compose down`.
