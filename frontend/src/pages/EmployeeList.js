import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/api';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, departmentFilter, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data.data);
      setFilteredEmployees(response.data.data);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Employees</h1>
        <p className="page-subtitle">Manage your team members</p>
      </div>

      <div className="card">
        <div className="search-filter">
          <div className="search-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-wrapper">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Departments</option>
              <option value="Development">Development</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="employee-count">
          Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> employees
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Skills</th>
                <th>Performance</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td className="td-name">{emp.name}</td>
                  <td className="td-email">{emp.email}</td>
                  <td><span className="dept-tag">{emp.department}</span></td>
                  <td>
                    <div className="skills-list">
                      {emp.skills.map((skill, i) => (
                        <span key={i} className="skill-chip">{skill}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="perf-bar-wrapper">
                      <div className="perf-bar" style={{ width: `${emp.performanceScore}%` }}></div>
                      <span className="perf-text">{emp.performanceScore}%</span>
                    </div>
                  </td>
                  <td className="td-exp">{emp.experience} yrs</td>
                  <td>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="btn-icon btn-icon--danger"
                      title="Delete employee"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="no-data">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '12px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="17" y1="11" x2="23" y2="11"/>
            </svg>
            <p>No employees found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
