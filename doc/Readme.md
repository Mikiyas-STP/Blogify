# Blogify - A Full-Stack PERN Content Management System

**Author:** Mikiyas G.M.
**Date Created:** November 2025
**Live Application:** [Link to your deployed front-end will go here]
**Back-End API:** [Link to your deployed back-end will go here]

---

## 1. Project Overview

Blogify is a comprehensive, full-stack web application engineered from the ground up using the **PERN (PostgreSQL, Express.js, React, Node.js)** stack. This project serves as a demonstration of a complete software development lifecycle, from initial database architecture and secure API design to the implementation of a feature-rich, responsive, and interactive user interface.

This is not just a simple blog; it is a complete Content Management System (CMS) that showcases advanced features including stateless JWT authentication, cloud media uploads, rich text editing, and complex relational data models for social features like comments and reactions.

---
_**[After deployment, add a high-quality GIF of your application in action here. This is highly recommended.]**_
---

## 2. Feature Set

### User & Authentication Features
*   **Secure User Registration:** New user creation with password hashing via `bcrypt`.
*   **Stateless JWT Authentication:** Secure login system that generates and validates JSON Web Tokens.
*   **Persistent Login State:** User login status is persisted across browser sessions using `localStorage` and a global state context.
*   **Authorization & Protected Routes:** Both back-end API routes and front-end UI components are protected, ensuring only authenticated and authorized users can perform sensitive actions (e.g., a user can only edit or delete their own content).

### Content & Media Features
*   **Full CRUD for Posts:** Complete Create, Read, Update, and Delete functionality for blog posts.
*   **Rich Text Editor (WYSIWYG):** Implemented using **React Quill**, allowing for formatted content with bold, italics, lists, and headings.
*   **Full-Stack Image Uploads:** A complete system for uploading cover images. Files are processed on the back-end with **Multer** and hosted on a cloud media service (**Cloudinary**). Old images are programmatically deleted from the cloud upon update to save resources.

### Social & Engagement Features
*   **Hierarchical Commenting System:** Logged-in users can comment on posts. The database schema supports nested replies.
*   **Interactive Reactions:** Users can add, change, or remove reactions ('like', 'love', 'helpful') on posts. The UI updates optimistically for a smooth experience.
*   **Dynamic Tooltips:** Hovering over reaction counts displays a list of users who have reacted.

---

## 3. Technical Deep Dive & Tech Stack

This project was built with a focus on modern, scalable, and professional development practices.

### **Front-End**
*   **Core Library:** **React 18** (Utilising `useState`, `useEffect`, `useContext`, `useParams`, `useNavigate` Hooks).
*   **State Management:** **React Context API** for global, application-wide authentication state. Local component state for UI and form management.
*   **Routing:** **React Router** for declarative, client-side routing and implementation of protected routes.
*   **API Communication:** Asynchronous `fetch` calls encapsulated in a modular and reusable API service layer.
*   **UI Components:** **React Quill** for rich text editing.
*   **Styling:** A custom, responsive, and mobile-first design implemented with **Global CSS** and **CSS Modules**.
*   **Build Tool:** **Vite** for a fast and modern development experience.

### **Back-End**
*   **Runtime:** **Node.js**.
*   **Framework:** **Express.js**.
*   **Core Principles:**
    *   **REST API Architecture:** Designed and implemented a clean, modular, and RESTful API.
    *   **Middleware:** Extensively used middleware for `cors`, JSON body parsing, and creating a custom middleware for JWT-based authorization.
*   **Authentication:**
    *   **`jsonwebtoken` (JWT):** For generating and verifying stateless authentication tokens.
    *   **`bcrypt`:** For industry-standard, one-way password hashing.
*   **File Handling:**
    *   **`multer`:** For processing `multipart/form-data` and handling in-memory file uploads.
    *   **`cloudinary`:** For programmatically uploading and deleting media assets in the cloud.

### **Database**
*   **Type:** **PostgreSQL** (Relational Database).
*   **Core Principles:**
    *   **Relational Data Modeling:** Designed a normalized schema with multiple tables (`users`, `posts`, `comments`, `reactions`) linked by foreign key constraints.
    *   **Data Integrity:** Enforced rules like `UNIQUE` constraints (for emails, usernames, and composite reaction keys) and `NOT NULL` constraints.
    *   **Cascading Deletes:** Used `ON DELETE CASCADE` to ensure that deleting a user or a post cleanly removes all of their dependent data (comments, reactions).
*   **Driver:** **`node-postgres` (pg)** with a connection pool for efficient database communication.

### **Development & Tooling**
*   **Version Control:** **Git** & **GitHub** with a feature-branching workflow and Conventional Commit messages.
*   **Package Management:** **npm**.
*   **API Testing:** **Thunder Client** (VS Code Extension) for rigorous testing of all back-end API endpoints.
*   **Database Management:** **DBeaver** for database connection, schema creation, and query testing.
*   **Security:** **`dotenv`** for secure management of all environment variables (database credentials, JWT secrets, Cloudinary keys), keeping them out of version control.

---

## 4. How to Run Locally

### Prerequisites
*   Node.js (v18+)
*   npm
*   A running PostgreSQL instance

### Setup Instructions
1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd blogify
    ```
2.  **Set up the Back-End:**
    ```bash
    cd server
    npm install
    # Create a .env file and add your database and Cloudinary credentials (see .env.example)
    # Set up the database schema using server/db/schema.sql
    node index.js
    ```
3.  **Set up the Front-End (in a new terminal):**
    ```bash
    cd client
    npm install
    npm run dev
    ```
The server will be running on `http://localhost:5001` and the client on `http://localhost:5173`.


## 5. Learning Journey & Project Successes

This project represents a significant milestone in my journey to becoming a full-stack engineer. It was built as a capstone project under the guidance of a mentor, focusing on professional practices and deep understanding of the PERN stack.

**Key successes and challenges overcome:**

*   **Architecting a Full-Stack System:** Successfully designed and integrated a complete client-server-database architecture from scratch.
*   **Implementing Advanced Features:** Went beyond a simple CRUD app to implement complex, marketable features like JWT authentication, cloud image uploads with resource deletion, and relational data models for social features.
*   **Deep Debugging:** Independently diagnosed and solved a wide range of real-world problems, including:
    *   Resolving advanced React version compatibility issues (`findDOMNode`) by correctly downgrading dependencies.
    *   Fixing subtle front-end state synchronization and stale data bugs after mutations.
    *   Debugging back-end `500 Internal Server Errors` related to database queries and security configurations.
*   **Adopting Professional Workflows:** Utilised Git and GitHub with a feature-branching strategy and Conventional Commit messages, and maintained a clear, separated codebase.
```