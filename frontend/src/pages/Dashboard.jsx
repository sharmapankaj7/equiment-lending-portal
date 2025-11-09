import { useState, useEffect } from 'react';
import { equipmentAPI } from '../services/api';
import EquipmentCard from '../components/EquipmentCard';
import './Dashboard.css';

const Dashboard = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    availability: '',
  });

  const categories = [
    'Sports Equipment',
    'Lab Equipment',
    'Cameras/Electronics',
    'Musical Instruments',
    'Project Materials',
    'Other',
  ];

  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.availability) params.availability = filters.availability;

      const response = await equipmentAPI.getAll(params);
      setEquipment(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      availability: '',
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Equipment Dashboard</h1>
        <p>Browse and request equipment for your projects and activities</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search equipment..."
            className="filter-input search-input"
          />
        </div>

        <div className="filter-group">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="">All Items</option>
            <option value="available">Available Only</option>
          </select>
        </div>

        <button onClick={clearFilters} className="btn-clear-filters">
          Clear Filters
        </button>
      </div>

      {loading && <div className="loading">Loading equipment...</div>}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && equipment.length === 0 && (
        <div className="no-results">
          <p>No equipment found matching your criteria.</p>
        </div>
      )}

      {!loading && !error && equipment.length > 0 && (
        <div className="equipment-grid">
          {equipment.map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
