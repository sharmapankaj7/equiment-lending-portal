import { useState, useEffect } from 'react';
import { borrowRequestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const response = await borrowRequestAPI.getAll(params);
      setRequests(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load your requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
      borrowed: 'status-borrowed',
      returned: 'status-returned',
    };
    return classes[status] || '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusCounts = () => {
    return {
      pending: requests.filter((r) => r.status === 'pending').length,
      approved: requests.filter((r) => r.status === 'approved').length,
      rejected: requests.filter((r) => r.status === 'rejected').length,
      returned: requests.filter((r) => r.status === 'returned').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-info-card">
        <h2>Personal Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Role:</span>
            <span className="info-value role-badge">{user.role}</span>
          </div>
          {user.studentId && (
            <div className="info-item">
              <span className="info-label">Student ID:</span>
              <span className="info-value">{user.studentId}</span>
            </div>
          )}
          {user.department && (
            <div className="info-item">
              <span className="info-label">Department:</span>
              <span className="info-value">{user.department}</span>
            </div>
          )}
        </div>
      </div>

      <div className="request-stats">
        <h2>Request Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{statusCounts.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statusCounts.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statusCounts.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statusCounts.returned}</div>
            <div className="stat-label">Returned</div>
          </div>
        </div>
      </div>

      <div className="request-history">
        <div className="history-header">
          <h2>My Borrow Requests</h2>
          <div className="filter-section">
            <label htmlFor="statusFilter">Filter:</label>
            <select
              id="statusFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Loading requests...</div>}

        {!loading && requests.length === 0 && (
          <div className="no-results">
            <p>You haven't made any borrow requests yet.</p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request._id} className="request-item">
                <div className="request-item-header">
                  <h3>{request.equipment?.name}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="request-item-body">
                  <div className="request-details">
                    <div className="detail-row">
                      <span className="detail-label">Category:</span>
                      <span>{request.equipment?.category}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Quantity:</span>
                      <span>{request.quantity}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Requested on:</span>
                      <span>{formatDate(request.requestDate)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Expected Return:</span>
                      <span>{formatDate(request.expectedReturnDate)}</span>
                    </div>
                    {request.borrowDate && (
                      <div className="detail-row">
                        <span className="detail-label">Borrowed on:</span>
                        <span>{formatDate(request.borrowDate)}</span>
                      </div>
                    )}
                    {request.actualReturnDate && (
                      <div className="detail-row">
                        <span className="detail-label">Returned on:</span>
                        <span>{formatDate(request.actualReturnDate)}</span>
                      </div>
                    )}
                    <div className="detail-row purpose-row">
                      <span className="detail-label">Purpose:</span>
                      <span>{request.purpose}</span>
                    </div>
                    {request.rejectionReason && (
                      <div className="detail-row rejection-row">
                        <span className="detail-label">Rejection Reason:</span>
                        <span className="rejection-text">{request.rejectionReason}</span>
                      </div>
                    )}
                    {request.notes && (
                      <div className="detail-row">
                        <span className="detail-label">Return Notes:</span>
                        <span>{request.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
