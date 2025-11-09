import { useState, useEffect } from 'react';
import { borrowRequestAPI } from '../services/api';
import './RequestManagement.css';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [returnNotes, setReturnNotes] = useState('');
  const [returningId, setReturningId] = useState(null);

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
      setError('Failed to load requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this request?')) {
      return;
    }

    try {
      await borrowRequestAPI.approve(id);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    setRejectingId(id);
  };

  const submitRejection = async (id) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await borrowRequestAPI.reject(id, rejectionReason);
      setRejectingId(null);
      setRejectionReason('');
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleReturn = async (id) => {
    setReturningId(id);
  };

  const submitReturn = async (id) => {
    try {
      await borrowRequestAPI.markReturned(id, returnNotes);
      setReturningId(null);
      setReturnNotes('');
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as returned');
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

  return (
    <div className="request-management">
      <div className="management-header">
        <h1>Request Management</h1>
        <div className="filter-section">
          <label htmlFor="statusFilter">Filter by Status:</label>
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
        <div className="no-results">No requests found.</div>
      )}

      {!loading && requests.length > 0 && (
        <div className="requests-container">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div className="request-title">
                  <h3>{request.equipment?.name}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                <div className="request-meta">
                  <span>Requested on: {formatDate(request.requestDate)}</span>
                </div>
              </div>

              <div className="request-body">
                <div className="request-info">
                  <div className="info-item">
                    <strong>Student:</strong> {request.user?.name} ({request.user?.email})
                  </div>
                  {request.user?.studentId && (
                    <div className="info-item">
                      <strong>Student ID:</strong> {request.user.studentId}
                    </div>
                  )}
                  <div className="info-item">
                    <strong>Category:</strong> {request.equipment?.category}
                  </div>
                  <div className="info-item">
                    <strong>Quantity:</strong> {request.quantity}
                  </div>
                  <div className="info-item">
                    <strong>Expected Return:</strong> {formatDate(request.expectedReturnDate)}
                  </div>
                  <div className="info-item">
                    <strong>Purpose:</strong> {request.purpose}
                  </div>
                  {request.borrowDate && (
                    <div className="info-item">
                      <strong>Borrow Date:</strong> {formatDate(request.borrowDate)}
                    </div>
                  )}
                  {request.actualReturnDate && (
                    <div className="info-item">
                      <strong>Return Date:</strong> {formatDate(request.actualReturnDate)}
                    </div>
                  )}
                  {request.approvedBy && (
                    <div className="info-item">
                      <strong>Processed By:</strong> {request.approvedBy.name}
                    </div>
                  )}
                  {request.rejectionReason && (
                    <div className="info-item rejection-reason">
                      <strong>Rejection Reason:</strong> {request.rejectionReason}
                    </div>
                  )}
                  {request.notes && (
                    <div className="info-item">
                      <strong>Return Notes:</strong> {request.notes}
                    </div>
                  )}
                </div>

                <div className="request-actions">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="btn-approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="btn-reject"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {request.status === 'approved' && (
                    <button
                      onClick={() => handleReturn(request._id)}
                      className="btn-return"
                    >
                      Mark as Returned
                    </button>
                  )}
                </div>

                {rejectingId === request._id && (
                  <div className="rejection-form">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      rows="3"
                      className="form-input"
                    />
                    <div className="form-actions">
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectionReason('');
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitRejection(request._id)}
                        className="btn-primary"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {returningId === request._id && (
                  <div className="return-form">
                    <textarea
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      placeholder="Enter any notes about the return (optional)..."
                      rows="3"
                      className="form-input"
                    />
                    <div className="form-actions">
                      <button
                        onClick={() => {
                          setReturningId(null);
                          setReturnNotes('');
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitReturn(request._id)}
                        className="btn-primary"
                      >
                        Confirm Return
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestManagement;
