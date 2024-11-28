import React, { memo, useEffect } from 'react';
import { HomeOutlined, UserOutlined, ExceptionOutlined, FileExcelOutlined, FileExclamationOutlined } from '@ant-design/icons';
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
    { key: 'Package', icon: <ExceptionOutlined />, label: 'Package', children: [
      { key: '20', label: <Link to="/package">Report</Link> },
    ]},
    { key: 'Outer', icon: <FileExclamationOutlined />, label: 'Outer', children: [
      { key: '30', label: <Link to="/Outer">Report</Link> },
    ]},
    { key: 'Data-Sheet', icon: <FileExcelOutlined />, label: 'Data Sheet', children: [
      { key: '40', label: <Link to="/Data-Sheet">Report</Link> },
    ]},
    { key: 'Product-Spec', icon: <FileExcelOutlined />, label: 'Product Spec', children: [
      { key: '50', label: <Link to="/Product-Spec">Report</Link> },
    ]},
    { key: 'โฟมสำเร็จรูปอุปกรณ์เสริม', icon: <FileExcelOutlined />, label: 'โฟมสำเร็จรูปอุปกรณ์เสริม', children: [
      { key: '60', label: <Link to="/โฟมสำเร็จรูปอุปกรณ์เสริม">Report</Link> },
    ]},
    { key: 'Shim', icon: <FileExcelOutlined />, label: 'Shim', children: [
      { key: '70', label: <Link to="/Shim">Report</Link> },
    ]},
    { key: 'Drawing', icon: <FileExcelOutlined />, label: 'Drawing', children: [
      { key: '80', label: <Link to="/Drawing">Report</Link> },
    ]},
    { key: 'Drawing-File', icon: <FileExcelOutlined />, label: 'Drawing-File', children: [
      { key: '90', label: <Link to="/Drawing-File">Report</Link> },
    ]},
    { key: 'Bom', icon: <FileExcelOutlined />, label: 'Bom', children: [
      { key: '100', label: <Link to="/bom">Report</Link> },
    ]},
    { key: 'Product-Data', icon: <FileExcelOutlined />, label: 'Product Data', children: [
      { key: '110', label: <Link to="/Product-Data">Report</Link> },
    ]},
    { key: 'user', icon: <UserOutlined />, label: 'User Management', children: [
      { key: '120', label: <Link to="/user">Report</Link> },
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
