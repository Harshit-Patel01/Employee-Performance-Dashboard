# AI-Based Employee Performance Analytics & Recommendation System

A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations.

## Features

- Employee Management (Add, Update, Delete, Search)
- AI-powered recommendations for promotions and training
- Employee performance analytics and rankings
- JWT Authentication & Authorization
- Secure password hashing with bcrypt

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Integration**: OpenRouter/OpenAI API
- **Authentication**: JWT, bcrypt

## Project Structure

```
employee-performance-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
└── README.md
```

## Installation

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Employee APIs
- `POST /api/employees` - Add new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/search` - Search employees
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### AI APIs
- `POST /api/ai/recommend` - Get AI recommendations

### Auth APIs
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

