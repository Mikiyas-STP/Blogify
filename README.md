# Blogify

**My First PERN Project** — a full-stack blog application built with **PostgreSQL, Express, React, and Node.js**.

Repository: https://github.com/Mikiyas-STP/Blogify :contentReference[oaicite:1]{index=1}

---

## 🚀 Live Demo

🌐 https://blogifyfend.hosting.codeyourfuture.io/
---

## 🧠 About

Blogify is a personal blog platform where users can read and write posts.  
This project demonstrates a classic PERN architecture with:

- **Express** for backend API
- **PostgreSQL** as the database
- **React** for the frontend UI
- **Docker** configuration for easy setup

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Client | React |
| Server | Node.js + Express |
| Database | PostgreSQL |
| Styling | CSS / any UI libraries |
| Dev / Deployment | Docker, Docker-Compose |

---

## 📁 Project Structure

```

Blogify/
├─ client/                    # Frontend React app
├─ server/                    # Backend Express API
├─ doc/                       # Documentation & API specs
├─ docker-compose.yml         # Development containers
├─ .gitignore
└─ package-lock.json

````

---

## 📦 Features

✔ Create, read, update, and delete blog posts  
✔ REST API backend  
✔ React SPA frontend  
✔ Containerised with Docker  
✔ Structured directory separation  
✔ PostgreSQL integration

---

## 🚀 Getting Started (Local Development)

### 1. Clone the project

```bash
git clone https://github.com/Mikiyas-STP/Blogify.git
cd Blogify
````

### 2. Start with Docker (recommended)

Make sure you have **Docker** and **Docker Compose** installed.

```bash
docker compose up
```

This will:

* Start PostgreSQL
* Run the backend server
* Run the frontend development server

Then open your browser at:

```
http://localhost:3000
```

### 3. Manual setup (optional)

#### Backend

```bash
cd server
npm install
npm run dev
```

> Set up environment variables (e.g., database URL, ports) as needed.

#### Frontend

```bash
cd client
npm install
npm start
```

---

## 📄 API Endpoints

*(Write these out based on your routes — e.g., `/api/posts`, `/api/users`, etc.)*

Example:

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| GET    | `/posts`     | Get all blog posts |
| POST   | `/posts`     | Create a new post  |
| PUT    | `/posts/:id` | Update a post      |
| DELETE | `/posts/:id` | Delete a post      |

---

## 📌 Environment Variables

Create a `.env` file in the **server** folder:

```
DATABASE_URL=postgres://username:password@localhost:5432/dbname
PORT=5000
```

*(Adjust to match your PostgreSQL settings.)*

---

## 📦 Scripts

| Folder   | Script        | Purpose                    |
| -------- | ------------- | -------------------------- |
| `server` | `npm run dev` | Run backend (development)  |
| `server` | `npm start`   | Start backend (production) |
| `client` | `npm start`   | Start React app            |

---

## 🧑‍💻 Author

**Mikiyas-STP**
Software developer building full-stack apps.
📍 London, United Kingdom

---

## 🙌 Acknowledgements

Thanks to the PERN stack community and the online ecosystem of resources and tutorials.
