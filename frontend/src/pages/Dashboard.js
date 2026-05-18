import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    avgPerformance: 0,
    topPerformers: [],
    departmentStats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      const employees = response.data.data;

      // Calculate statistics
      const total = employees.length;
      const avgScore = employees.reduce((sum, emp) => sum + emp.performanceScore, 0) / total || 0;
      const top = employees
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, 5);

      // Department statistics
      const deptStats = {};
      employees.forEach(emp => {
        if (!deptStats[emp.department]) {
          deptStats[emp.department] = { count: 0, totalScore: 0 };
        }
        deptStats[emp.department].count++;
        deptStats[emp.department].totalScore += emp.performanceScore;
      });

      setStats({
        totalEmployees: total,
        avgPerformance: avgScore.toFixed(2),
        topPerformers: top,
        departmentStats: deptStats
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const deptCount = Object.keys(stats.departmentStats).length;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your employee performance data</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-label">Total Employees</p>
            <p className="stat-value">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon--accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-label">Avg Performance</p>
            <p className="stat-value">{stats.avgPerformance}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon--dark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-label">Departments</p>
            <p className="stat-value">{deptCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon--success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-label">Top Performers</p>
            <p className="stat-value">{stats.topPerformers.length}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <h2>Top Performers</h2>
            <span className="card-badge">{stats.topPerformers.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Department</th>
                <th>Performance Score</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPerformers.map((emp, index) => (
                <tr key={emp._id}>
                  <td>
                    <span className={`rank-indicator rank-indicator--${index < 3 ? 'top' : 'default'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="td-name">{emp.name}</td>
                  <td><span className="dept-tag">{emp.department}</span></td>
                  <td>
                    <div className="perf-bar-wrapper">
                      <div className="perf-bar" style={{ width: `${emp.performanceScore}%` }}></div>
                      <span className="perf-text">{emp.performanceScore}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <h2>Department Statistics</h2>
            <span className="card-badge">{deptCount}</span>
          </div>
          <div className="dept-stats-list">
            {Object.entries(stats.departmentStats).map(([dept, data]) => {
              const avg = (data.totalScore / data.count).toFixed(1);
              return (
                <div key={dept} className="dept-stat-item">
                  <div className="dept-stat-info">
                    <span className="dept-stat-name">{dept}</span>
                    <span className="dept-stat-count">{data.count} employee{data.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="dept-stat-bar-wrapper">
                    <div className="dept-stat-bar" style={{ width: `${avg}%` }}></div>
                  </div>
                  <span className="dept-stat-avg">{avg}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
