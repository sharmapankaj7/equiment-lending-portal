import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equipmentAPI, borrowRequestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './EquipmentDetail.css';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    quantity: 1,
    expectedReturnDate: '',
    purpose: '',
  });
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentAPI.getById(id);
      setEquipment(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load equipment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestError('');
    setSubmitting(true);

    try {
      await borrowRequestAPI.create({
        equipmentId: equipment._id,
        ...requestData,
      });
      setRequestSuccess(true);
      setShowRequestForm(false);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setRequestError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getConditionClass = (condition) => {
    const classes = {
      Excellent: 'condition-excellent',
      Good: 'condition-good',
      Fair: 'condition-fair',
      Poor: 'condition-poor',
    };
    return classes[condition] || '';
  };

  if (loading) {
    return <div className="loading">Loading equipment details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!equipment) {
    return <div className="error-message">Equipment not found</div>;
  }

  const isAvailable = equipment.available > 0;
  const canBorrow = user.role === 'student' || user.role === 'staff';

  return (
    <div className="equipment-detail">
      <button onClick={() => navigate('/dashboard')} className="btn-back">
        ← Back to Dashboard
      </button>

      <div className="detail-container">
        <div className="detail-header">
          <h1>{equipment.name}</h1>
          <span className={`availability-badge ${isAvailable ? 'available' : 'unavailable'}`}>
            {isAvailable ? `${equipment.available} Available` : 'Not Available'}
          </span>
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <h2>Details</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Category:</span>
                <span className="value">{equipment.category}</span>
              </div>
              <div className="detail-item">
                <span className="label">Condition:</span>
                <span className={`value ${getConditionClass(equipment.condition)}`}>
                  {equipment.condition}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Total Quantity:</span>
                <span className="value">{equipment.quantity}</span>
              </div>
              <div className="detail-item">
                <span className="label">Available:</span>
                <span className="value">{equipment.available}</span>
              </div>
            </div>

            {equipment.description && (
              <div className="description">
                <h3>Description</h3>
                <p>{equipment.description}</p>
              </div>
            )}
          </div>

          {requestSuccess && (
            <div className="success-message">
              Request submitted successfully! Redirecting to your profile...
            </div>
          )}

          {canBorrow && isAvailable && !showRequestForm && !requestSuccess && (
            <div className="action-section">
              <button
                onClick={() => setShowRequestForm(true)}
                className="btn-primary btn-request"
              >
                Request to Borrow
              </button>
            </div>
          )}

          {showRequestForm && (
            <div className="request-form-section">
              <h2>Submit Borrow Request</h2>
              {requestError && <div className="error-message">{requestError}</div>}

              <form onSubmit={handleSubmitRequest} className="request-form">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={requestData.quantity}
                    onChange={handleRequestChange}
                    min="1"
                    max={equipment.available}
                    required
                    className="form-input"
                  />
                  <small>Maximum available: {equipment.available}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="expectedReturnDate">Expected Return Date</label>
                  <input
                    type="date"
                    id="expectedReturnDate"
                    name="expectedReturnDate"
                    value={requestData.expectedReturnDate}
                    onChange={handleRequestChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="purpose">Purpose</label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    value={requestData.purpose}
                    onChange={handleRequestChange}
                    required
                    rows="4"
                    placeholder="Explain why you need this equipment..."
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
