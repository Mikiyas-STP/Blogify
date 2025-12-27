# Blogify - A Full-Stack PERN Blogging Platform

**Author:** Mikiyas G.M.
**Date Created:** November 2025
**Live Application:** [Link to your deployed front-end]
**Back-End API:** [Link to your deployed back-end]

---

## 1. Project Overview

Blogify is a complete, full-stack web application built from the ground up using the **PERN (PostgreSQL, Express.js, React, Node.js)** stack. This project serves as my capstone project, demonstrating a comprehensive understanding of modern web development principles, from database design and back-end API creation to building a dynamic, responsive front-end.

The application is a functional blogging platform where an administrator can create, read, update, and delete posts through a clean and intuitive user interface.

## 2. Core Features

*   **Full CRUD Functionality:** Users can create new blog posts, view all posts, read single posts, update existing posts, and delete posts.
*   **RESTful Back-End API:** A robust back-end built with Node.js and Express, providing a complete set of API endpoints to manage post data.
*   **Persistent Data Storage:** All post data is stored in a relational **PostgreSQL** database, ensuring data integrity and permanence.
*   **Dynamic React Front-End:** A responsive and interactive single-page application (SPA) built with React, using hooks (`useState`, `useEffect`, `useParams`, `useNavigate`) to manage state and user interactions.
*   **Client-Side Routing:** Utilises **React Router** to provide a seamless, multi-page user experience without full page reloads.
*   **Professional Project Structure:** The codebase is organised with a clear separation of concerns, with distinct `client` and `server` applications, a modular API service on the front-end, and routed architecture on the back-end.

## 3. Tech Stack & Engineering Principles

This project was built with a focus on modern, professional development practices.

### Back-End

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL
*   **Database Driver:** `node-postgres` (pg)
*   **Key Principles:**
    *   **REST API Design:** Followed RESTful conventions for creating clear and predictable API endpoints.
    *   **Modular Routing:** Separated API routes into modules for better organisation and scalability.
    *   **Database Schema Design:** Designed a clear and efficient SQL schema for the `posts` table.
    *   **Security:** Used parameterised queries to prevent SQL injection vulnerabilities.
    *   **CORS:** Correctly configured the server to handle Cross-Origin Resource Sharing.

### Front-End

*   **Library:** React
*   **Routing:** React Router
*   **Styling:** CSS Modules & Global CSS for a responsive, mobile-first design.
*   **Build Tool:** Vite
*   **Key Principles:**
    *   **Component-Based Architecture:** Broke down the UI into reusable, manageable components.
    *   **State Management:** Employed React hooks for local component state.
    *   **Separation of Concerns:** Abstracted all API communication into a dedicated service module (`postService.js`).
    *   **Responsive Design:** Implemented a clean and modern UI that adapts to both desktop and mobile screen sizes.

## 4. Learning Journey & Project Successes

This project represents a significant milestone in my journey to becoming a full-stack engineer. Over the course of 4 Weeks, I progressed from foundational concepts to building and deploying a complete application.

**Key successes and challenges overcome:**

*   **Building a Full End-to-End Feature:** Successfully implemented the entire CRUD lifecycle, from a button click in React to a row change in the PostgreSQL database and back.
*   **Mastering the MERN Stack:** Gained practical, hands-on experience with every component of the PERN stack.
*   **Debugging Real-World Problems:** Independently diagnosed and solved complex issues, including:
    *   Setting up a complete development environment on a new machine.
    *   Resolving CORS errors between the client and server.
    *   Debugging `500 Internal Server Errors` caused by database schema mismatches.
    *   Fixing front-end state management bugs, such as "stale state" after an update.
*   **Adopting Professional Workflows:** Utilised Git and GitHub for version control with conventional commit messages and established a professional project structure.

## 5. How It Works

The application is composed of two main parts:

1.  **The Express.js Server:** This back-end application connects directly to the PostgreSQL database. It exposes a series of API endpoints (e.g., `GET /api/posts`, `POST /api/posts`). Its sole responsibility is to manage the data.
2.  **The React Client:** This front-end application runs in the user's browser. It makes HTTP requests to the Express server's API to fetch, create, update, or delete data. It then uses this data to render the user interface. The client itself never talks directly to the database.

This decoupled architecture is a modern standard that allows for scalability and easier maintenance.

---