import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          🎓 Equipment Lending Portal
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>

          {user.role === 'admin' && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                Admin Panel
              </Link>
            </li>
          )}

          {(user.role === 'staff' || user.role === 'admin') && (
            <li className="nav-item">
              <Link to="/requests" className="nav-link">
                Manage Requests
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>

          <li className="nav-item">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </li>

          <li className="nav-item">
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
