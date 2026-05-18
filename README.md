# Employee Performance System (EPS)

A full-stack MERN application for employee performance analytics with AI-powered recommendations and role-based access control.

## Overview

The Employee Performance System is a comprehensive web application designed to streamline employee performance management. It features a modern glassmorphism UI, real-time analytics, and AI-driven insights to help HR professionals make informed decisions about promotions, training, and career development.

## Key Features

### Role-Based Access Control
- **HR Role**: Complete access to all employee data, analytics dashboard, AI recommendations, and administrative functions
- **Candidate Role**: Secure personal portal to view and update own profile information only

### Core Functionality
- **Performance Analytics**: Visual dashboard with statistics, top performers, and department-wise metrics
- **AI Recommendations**: OpenAI/OpenRouter integration for intelligent career guidance and performance insights
- **Employee Management**: Full CRUD operations with search and filter capabilities
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Modern UI**: Glassmorphism design with responsive sidebar navigation and smooth animations

## Technology Stack

**Frontend**
- React.js with React Router DOM
- Axios for API communication
- Custom CSS with glassmorphism effects

**Backend**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password security

**AI Integration**
- OpenRouter / OpenAI API

## Project Structure

```
employee-performance-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic (auth, employee, AI)
│   ├── middleware/      # Authentication & authorization
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route definitions
│   └── server.js        # Application entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── App.js       # Main application component
│   └── public/          # Static assets
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- OpenRouter or OpenAI API key

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   AI_API_KEY=your_openrouter_or_openai_key
   AI_API_URL=https://openrouter.ai/api/v1/chat/completions
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Employee Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/employees/me` | Get own profile | Candidate |
| GET | `/api/employees` | List all employees | HR Only |
| GET | `/api/employees/search` | Search employees | HR Only |
| POST | `/api/employees` | Create employee profile | Both |
| GET | `/api/employees/:id` | Get employee by ID | HR / Own |
| PUT | `/api/employees/:id` | Update employee | HR / Own |
| DELETE | `/api/employees/:id` | Delete employee | HR Only |

### AI Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/ai/recommend` | Get AI recommendation | HR Only |
| GET | `/api/ai/rank` | Get employee rankings | HR Only |
| GET | `/api/ai/batch-recommendations` | Batch recommendations | HR Only |

## User Roles & Permissions

### HR Role
- View all employees in the system
- Access complete analytics dashboard
- Search and filter employee directory
- Add, update, and delete employee records
- Generate AI-powered recommendations
- View employee performance rankings
- Access department statistics

### Candidate Role
- Create personal profile (one-time)
- View own profile information
- Update own performance data
- Changes reflect immediately in HR dashboard
- Cannot view other employees' data
- No access to AI recommendations or analytics

## Features in Detail

### Dashboard (HR Only)
- Total employee count
- Average performance score across organization
- Top 5 performers with rankings
- Department-wise statistics and averages
- Visual performance indicators

### Employee Management
- **HR**: Full CRUD operations on all employee records
- **Candidate**: Create and update own profile only
- Real-time search and filtering
- Department-based categorization
- Skills tracking

### AI Recommendations (HR Only)
- Individual employee analysis
- Promotion recommendations
- Training and skill development suggestions
- Performance improvement feedback
- Career growth guidance
- Employee ranking system

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control middleware
- Protected API routes
- Token expiration (7 days)
- Secure HTTP-only practices

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['hr', 'candidate']),
  createdAt: Date
}
```

### Employee Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  email: String (unique),
  department: String (enum),
  skills: [String],
  performanceScore: Number (0-100),
  experience: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Render Deployment

**Backend**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`

**Frontend**
1. Create new Static Site on Render
2. Connect GitHub repository
3. Set build command: `npm install && npm run build`
4. Set publish directory: `build`
5. Add `REACT_APP_API_URL` environment variable

### MongoDB Atlas
1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for Render)
4. Copy connection string to backend `.env`

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Code Quality
- Clean folder structure
- Modular component design
- Reusable API service layer
- Error handling middleware
- Input validation
- Consistent naming conventions

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing documentation
- Review API endpoint specifications

## Acknowledgments

- Built with MERN stack
- AI powered by OpenRouter/OpenAI
- Modern UI inspired by glassmorphism design trends
- Developed for AI Driven Full Stack Development (AI308B) course

---

**Version**: 1.0.0  
**Last Updated**: May 2026
