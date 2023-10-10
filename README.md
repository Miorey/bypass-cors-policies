# bypass-cors-policies

Bypass the CORS policies of remote servers, primarily for development purposes.

## Features

- Easily configure the target server.
- Seamless setup either locally or with Docker.
- Store and manage files with a dedicated storage directory.

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/), if you're using the Docker setup.

## Local Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd bypass-cors-policies
```
Update the target server in `.env`:
```dotenv
SERVER_NAME="https://www.example.com"
```
Set up your Node environment and dependencies:
```bash
nvm install 18
nvm use
npm ci
```
Start the application:
```bash
npm start
```