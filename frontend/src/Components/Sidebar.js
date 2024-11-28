import React, { memo, useEffect } from 'react';
import { HomeOutlined, UserOutlined, ExceptionOutlined, FileExcelOutlined, FileExclamationOutlined, DashboardOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Hook/useAuthContext';


const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isAuthenticated = user && user.token;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login page if user is not authenticated
    }
  }, [isAuthenticated, navigate]);

  // If user is not loaded yet, don't render the sidebar
  if (!user) return null;

  const items = [
    { key: '1', icon: <HomeOutlined />, label: <Link to="/home">Home</Link> },
    { key: 'sub1', icon: <ExceptionOutlined />, label: 'Wip', children: [
      { key: '30', label: <Link to="/wip">Report</Link> },
      { key: '3', label: <Link to="/createwipexcel">Excel Insert</Link> },
      { key: '4', label: <Link to="/createwip">Form Insert</Link> }
    ]},
   
  ].filter(item => !item.hidden); // Filter out hidden items

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        background: 'linear-gradient(180deg, #001529 0%, #0a3d62 100%)',
        boxShadow: '2px 0 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="logo" style={{ padding: '16px', textAlign: 'center', color: '#fff' }}>
        <div>
          {collapsed ? 'Compact' : 'Compact Brake'}
        </div>
        {collapsed ? `${user.data.role}` : `${user.data.email}(${user.data.role})`}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

// Memoize the Sidebar component to prevent unnecessary re-renders
export default memo(Sidebar);
