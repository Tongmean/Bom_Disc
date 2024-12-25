import React, {useEffect} from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuthContext } from '../Hook/useAuthContext';
import { useLogout } from '../Hook/useLogout';
import { useNavigate, useLocation  } from 'react-router-dom';
import TokenTimer from './TokenTimer';
const { Header } = Layout;

const HeaderComponent = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path
  const isAuthenticated = user && user.token;
  const { logout } = useLogout();
  const onLogout = () => {
    logout();
  }

  useEffect(() => {
    if (!isAuthenticated && window.location.pathname !== '/') {
      navigate('/login'); // Redirect to login page if user is not authenticated
    }
  }, [isAuthenticated, navigate]);

  // If user is not loaded yet, don't render the sidebar
  if (!user) return null;
  const decodedPath = decodeURIComponent(location.pathname);
  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <span>
        {/* User: {user ? `${user.data.email}` : ''}
        ({user ? `${user.data.role}` : ''})  */}
        {/* <h6>{decodedPath}</h6> */}
        <h6><TokenTimer token={user.token} /></h6>
      </span>
      {user && (
        <Button type="primary" icon={<LogoutOutlined />} onClick={onLogout}>
          Logout
        </Button>
      )}
    </Header>
  );
};

export default HeaderComponent;
