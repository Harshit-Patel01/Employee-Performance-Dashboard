import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../services/api';
import './AddEmployee.css';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Development',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      await employeeService.addEmployee(data);
      setSuccess('Employee added successfully!');

      // Get user role to determine redirect
      const userRole = localStorage.getItem('userRole');
      setTimeout(() => {
        if (userRole === 'candidate') {
          navigate('/profile');
        } else {
          navigate('/employees');
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Add Employee</h1>
        <p className="page-subtitle">Add a new team member to the system</p>
      </div>

      <div className="card add-employee-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="Development">Development</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="form-group">
              <label>Skills (comma-separated) *</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Performance Score (0-100) *</label>
              <input
                type="number"
                name="performanceScore"
                value={formData.performanceScore}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="Enter score"
                required
              />
            </div>

            <div className="form-group">
              <label>Years of Experience *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                placeholder="Enter years"
                required
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
