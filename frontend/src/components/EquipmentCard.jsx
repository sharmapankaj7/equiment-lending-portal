import { Link } from 'react-router-dom';
import './EquipmentCard.css';

const EquipmentCard = ({ equipment }) => {
  const getConditionClass = (condition) => {
    const classes = {
      Excellent: 'condition-excellent',
      Good: 'condition-good',
      Fair: 'condition-fair',
      Poor: 'condition-poor',
    };
    return classes[condition] || '';
  };

  const isAvailable = equipment.available > 0;

  return (
    <Link to={`/equipment/${equipment._id}`} className="equipment-card">
      <div className="card-header">
        <h3 className="equipment-name">{equipment.name}</h3>
        <span className={`availability-badge ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable ? `${equipment.available} Available` : 'Not Available'}
        </span>
      </div>

      <div className="card-body">
        <div className="equipment-category">
          <span className="category-badge">{equipment.category}</span>
        </div>

        {equipment.description && (
          <p className="equipment-description">{equipment.description}</p>
        )}

        <div className="equipment-details">
          <div className="detail-item">
            <span className="detail-label">Condition:</span>
            <span className={`detail-value ${getConditionClass(equipment.condition)}`}>
              {equipment.condition}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Quantity:</span>
            <span className="detail-value">{equipment.quantity}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button className="btn-view-details">View Details</button>
      </div>
    </Link>
  );
};

export default EquipmentCard;
