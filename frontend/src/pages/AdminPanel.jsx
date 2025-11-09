import { useState, useEffect } from 'react';
import { equipmentAPI } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sports Equipment',
    description: '',
    condition: 'Good',
    quantity: 1,
    imageUrl: '',
  });

  const categories = [
    'Sports Equipment',
    'Lab Equipment',
    'Cameras/Electronics',
    'Musical Instruments',
    'Project Materials',
    'Other',
  ];

  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentAPI.getAll();
      setEquipment(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Sports Equipment',
      description: '',
      condition: 'Good',
      quantity: 1,
      imageUrl: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await equipmentAPI.update(editingId, formData);
      } else {
        await equipmentAPI.create(formData);
      }
      resetForm();
      fetchEquipment();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save equipment');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      condition: item.condition,
      quantity: item.quantity,
      imageUrl: item.imageUrl || '',
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) {
      return;
    }

    try {
      await equipmentAPI.delete(id);
      fetchEquipment();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete equipment');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel - Equipment Management</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Add New Equipment
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="equipment-form-container">
          <h2>{editingId ? 'Edit Equipment' : 'Add New Equipment'}</h2>
          <form onSubmit={handleSubmit} className="equipment-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Equipment Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condition">Condition *</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="form-input"
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Equipment' : 'Add Equipment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading">Loading equipment...</div>}

      {!loading && equipment.length > 0 && (
        <div className="equipment-table-container">
          <h2>All Equipment</h2>
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Condition</th>
                <th>Total</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`condition-badge condition-${item.condition.toLowerCase()}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.available}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
