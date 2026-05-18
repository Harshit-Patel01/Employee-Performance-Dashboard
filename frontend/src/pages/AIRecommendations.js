import React, { useState, useEffect } from 'react';
import { employeeService, aiService } from '../services/api';
import './AIRecommendations.css';

const AIRecommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('individual');

  useEffect(() => {
    fetchEmployees();
    fetchRankings();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchRankings = async () => {
    try {
      const response = await aiService.rankEmployees();
      setRankings(response.data.data);
    } catch (err) {
      console.error('Error fetching rankings:', err);
    }
  };

  const handleGetRecommendation = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const response = await aiService.getRecommendation(selectedEmployee);
      setRecommendation(response.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get AI recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>AI Recommendations</h1>
        <p className="page-subtitle">AI-powered insights for employee performance</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'individual' ? 'active' : ''}`}
          onClick={() => setActiveTab('individual')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Individual Recommendation
        </button>
        <button
          className={`tab ${activeTab === 'rankings' ? 'active' : ''}`}
          onClick={() => setActiveTab('rankings')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          Employee Rankings
        </button>
      </div>

      {activeTab === 'individual' && (
        <div className="card" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <h2>Get AI Recommendation for Employee</h2>
          </div>
          <div className="ai-input-row">
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Select Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} - {emp.department} ({emp.performanceScore}%)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGetRecommendation}
              className="btn btn-primary ai-generate-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Get Recommendation
                </>
              )}
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          {recommendation && (
            <div className="recommendation-box">
              <div className="recommendation-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <h3>AI Recommendation</h3>
              </div>
              <pre>{recommendation}</pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rankings' && (
        <div className="card" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <h2>Employee Performance Rankings</h2>
            <span className="card-badge">{rankings.length}</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Performance Score</th>
                  <th>Experience</th>
                  <th>Skills</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <span className={`rank-badge rank-badge--${emp.rank <= 3 ? 'top' : 'default'}`}>#{emp.rank}</span>
                    </td>
                    <td className="td-name">{emp.name}</td>
                    <td><span className="dept-tag">{emp.department}</span></td>
                    <td>
                      <span className={`score-badge ${emp.performanceScore >= 85 ? 'score-badge--high' : emp.performanceScore >= 70 ? 'score-badge--medium' : 'score-badge--low'}`}>
                        {emp.performanceScore}%
                      </span>
                    </td>
                    <td className="td-exp">{emp.experience} years</td>
                    <td>
                      <div className="skills-list">
                        {emp.skills.map((skill, i) => (
                          <span key={i} className="skill-chip">{skill}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
