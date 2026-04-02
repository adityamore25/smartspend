# SmartSpend – Personal Finance Tracker

## Tech Stack

* Frontend: React (Vite)
* Backend: Node.js, Express
* Database: SQLite
* Authentication: JWT, bcrypt

---

## Prerequisites

* Node.js installed
* npm installed

---

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/YOUR-USERNAME/smartspend.git
cd smartspend

---

### 2. Backend Setup

cd backend
npm install
node server.js

---

### 3. Frontend Setup

cd frontend/vite-project
npm install
npm run dev

---

## Database Setup

* No manual setup required
* SQLite database (data.db) is automatically created when backend runs

---

## Environment Variables

* No environment variables required

---

## Run the Application

* Backend runs on: http://localhost:5000
* Frontend runs on: http://localhost:5173

---

## How to Verify

1. Open http://localhost:5173
2. Sign up using email and password
3. Add a transaction
4. Check if transaction appears
5. Refresh page → data should persist
6. Delete a transaction → should be removed

---

## Notes

* Ensure backend is running before starting frontend
* If port is busy, restart the server
