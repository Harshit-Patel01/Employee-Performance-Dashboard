# Quick Start Guide

## Employee Performance System (EPS)

### For First-Time Users

#### 1. Sign Up
- Navigate to the signup page
- Enter your name, email, and password
- Select your role:
  - **HR**: Full system access
  - **Candidate**: Personal profile access only
- Click "Create Account"

#### 2. Login
- Use your registered email and password
- You'll be redirected to your dashboard based on your role

#### 3. HR Users - Getting Started
After login, you can:
- **Dashboard**: View overall statistics and top performers
- **Employees**: See all employee records, search and filter
- **Add Employee**: Create new employee profiles
- **AI Recommendations**: Get AI-powered insights for employees

#### 4. Candidate Users - Getting Started
After login, you can:
- **Create Profile**: Fill in your employee information (one-time)
- **View Profile**: See your performance data
- **Update Profile**: Edit your skills, experience, and other details
- Your updates are immediately visible to HR

### Sample Data for Testing

#### HR Account
```
Email: hr@example.com
Password: password123
Role: HR
```

#### Candidate Account
```
Email: candidate@example.com
Password: password123
Role: Candidate
```

#### Sample Employee Data
```json
{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB", "Python"],
  "performanceScore": 85,
  "experience": 3
}
```

### Common Tasks

#### For HR: Adding an Employee
1. Click "Add Employee" in the sidebar
2. Fill in all required fields:
   - Name
   - Email (must be unique)
   - Department
   - Skills (comma-separated)
   - Performance Score (0-100)
   - Years of Experience
3. Click "Add Employee"

#### For HR: Getting AI Recommendations
1. Navigate to "AI Recommendations"
2. Select "Individual Recommendation" tab
3. Choose an employee from the dropdown
4. Click "Get Recommendation"
5. View AI-generated insights

#### For HR: Viewing Rankings
1. Navigate to "AI Recommendations"
2. Click "Employee Rankings" tab
3. View all employees sorted by performance

#### For Candidates: Creating Profile
1. After login, click "Add Employee" or navigate to profile
2. Fill in your information
3. Submit to create your profile
4. You can only create one profile per account

#### For Candidates: Updating Profile
1. Navigate to your profile
2. Click edit or update
3. Modify your information
4. Save changes
5. HR will see your updates immediately

### Troubleshooting

#### Cannot Login
- Verify email and password are correct
- Ensure you've completed signup
- Check if token has expired (7 days)

#### Cannot See Employees (Candidate)
- This is expected behavior
- Candidates can only see their own profile
- Contact HR for access to other data

#### AI Recommendations Not Working
- Verify AI API key is configured in backend `.env`
- Check API_URL is correct
- Ensure you have HR role
- Check backend logs for errors

#### Profile Already Exists Error
- Candidates can only create one profile
- Use update functionality instead
- Contact HR if you need to delete and recreate

### Environment Variables Checklist

#### Backend (.env)
- [ ] PORT=5000
- [ ] MONGODB_URI (MongoDB Atlas connection string)
- [ ] JWT_SECRET (random secure string)
- [ ] AI_API_KEY (OpenRouter or OpenAI key)
- [ ] AI_API_URL (API endpoint URL)

#### Frontend (.env)
- [ ] REACT_APP_API_URL (Backend API URL)

### API Testing with Postman/Thunder Client

#### 1. Signup Request
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "hr"
}
```

#### 2. Login Request
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
Copy the token from response.

#### 3. Get All Employees (HR Only)
```
GET http://localhost:5000/api/employees
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 4. Add Employee
```
POST http://localhost:5000/api/employees
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "department": "Marketing",
  "skills": ["SEO", "Content Marketing", "Analytics"],
  "performanceScore": 78,
  "experience": 2
}
```

#### 5. Get AI Recommendation (HR Only)
```
POST http://localhost:5000/api/ai/recommend
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "employeeId": "EMPLOYEE_ID_HERE"
}
```

### Performance Tips

- Keep employee records under 1000 for optimal performance
- Use search and filter instead of scrolling through large lists
- AI recommendations may take 5-10 seconds to generate
- Clear browser cache if UI doesn't update

### Security Best Practices

- Never commit `.env` files to version control
- Use strong JWT secrets (minimum 32 characters)
- Rotate API keys regularly
- Use HTTPS in production
- Keep dependencies updated
- Implement rate limiting for production

### Next Steps

1. Customize the UI colors and branding
2. Add more departments as needed
3. Implement email notifications
4. Add export functionality for reports
5. Integrate with existing HR systems
6. Add more AI features (sentiment analysis, etc.)

---

For detailed documentation, see the main README.md file.
