import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/api';
import './CandidateProfile.css';

const CandidateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Development',
    skills: '',
    performanceScore: '',
    experience: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await employeeService.getMyProfile();
      setProfile(response.data.data);
      setFormData({
        name: response.data.data.name,
        email: response.data.data.email,
        department: response.data.data.department,
        skills: response.data.data.skills.join(', '),
        performanceScore: response.data.data.performanceScore,
        experience: response.data.data.experience
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Profile not found. Please create your profile first.');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      await employeeService.updateEmployee(profile._id, data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile.name,
      email: profile.email,
      department: profile.department,
      skills: profile.skills.join(', '),
      performanceScore: profile.performanceScore,
      experience: profile.experience
    });
    setError('');
  };

  if (loading) {
    return <div className="loading">Loading your profile...</div>;
  }

  if (!profile && error) {
    return (
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p className="page-subtitle">Create and manage your employee profile</p>
        </div>
        <div className="card">
          <div className="empty-profile">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <h3>No Profile Found</h3>
            <p>You haven't created your profile yet. Click "Add Employee" in the sidebar to create your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="page-subtitle">View and update your employee information</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {success && <div className="success-banner">{success}</div>}

      <div className="profile-grid">
        {/* Profile Overview Card */}
        <div className="card profile-overview">
          <div className="profile-avatar">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2>{profile.name}</h2>
          <p className="profile-email">{profile.email}</p>
          <div className="profile-dept-badge">{profile.department}</div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-label">Performance</span>
              <span className="profile-stat-value">{profile.performanceScore}%</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-label">Experience</span>
              <span className="profile-stat-value">{profile.experience} yrs</span>
            </div>
          </div>

          <div className="profile-skills-section">
            <h4>Skills</h4>
            <div className="profile-skills">
              {profile.skills.map((skill, i) => (
                <span key={i} className="profile-skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="card profile-edit-card">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <h3>Edit Information</h3>
              <p className="form-note">Update your profile details. Changes will be visible to HR immediately.</p>

              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
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
                  placeholder="Enter your email"
                  required
                />
              </div>

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

              <div className="form-group">
                <label>Performance Score (0-100) *</label>
                <input
                  type="number"
                  name="performanceScore"
                  value={formData.performanceScore}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="Enter your score"
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

              {error && <div className="error">{error}</div>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <h3>Profile Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{profile.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{profile.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{profile.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">{profile.experience} years</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Performance Score</span>
                  <span className="detail-value">{profile.performanceScore}%</span>
                </div>
                <div className="detail-item detail-item--full">
                  <span className="detail-label">Skills</span>
                  <div className="detail-skills">
                    {profile.skills.map((skill, i) => (
                      <span key={i} className="skill-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="profile-info-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Your profile information is visible to HR and will be used for performance evaluations.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
