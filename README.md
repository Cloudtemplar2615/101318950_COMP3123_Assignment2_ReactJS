# COMP 3123 – Assignment 2  
Employee Management Frontend (React)

This is the React frontend for the Employee Management API built in **Assignment 1**.  
It provides login/signup, protected routes, full employee CRUD, search filters, and profile picture upload, with a modern neutral grey UI using Bootstrap and custom styling.

---

## Tech Stack

- **React** (Create React App)
- **React Router**
- **Axios**
- **Bootstrap 5** (via CDN)
- **Node.js + Express + MongoDB** backend (from Assignment 1)

---

## Backend (Assignment 1)

The backend API is required for this frontend to work.

### Local Backend Setup

1. Go to your Assignment 1 project:

   ```bash
   cd E:\comp3132\assignment1
   npm install
2. Create .env file 
    PORT=8080
    MONGODB_URI=your_mongo_uri_here
    JWT_SECRET=supersecret
    JWT_EXPIRES=1d
3. Start backend 
    npm run dev
    it will work once you see 
    "MongoDB connected"
    "API running on http://localhost:8080"

### Frontend SetUp
1. cd to studentnumber_comp3123_assignment2.react.js
2. npm install
3. npm start 
4. open app in the browser app link should be http://localhost:3000/login
