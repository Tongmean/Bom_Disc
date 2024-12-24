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

    { key: 'Display', icon: <ExceptionOutlined />, label: 'Display', children: [
      { key: '11', label: <Link to="/wipdisplay">WIP Code</Link> },
      { key: '12', label: <Link to="/Qcdisplay">Quality Control</Link> },
      { key: '13', label: <Link to="/saledisplay">Sale</Link> },
    ]},
    { key: 'Bom', icon: <FileExcelOutlined />, label: <Link to="/productregister">Product Register</Link>},
    { key: 'Product-Spec', icon: <FileExcelOutlined />, label: 'Product Spec', children: [
      { key: '50', label: <Link to="/productspec">Report</Link> },
      { key: '51', label: <Link to="/productspecfile">Product Spec File</Link> },
    ]},

    { key: 'Drawing', icon: <FileExcelOutlined />, label: 'Drawing', children: [
      { key: '80', label: <Link to="/drawing">Report</Link> },
      { key: '81', label: <Link to="/drawingfile">Drawing File</Link> },
    ]},
    { key: 'Data-Sheet', icon: <FileExcelOutlined />, label: <Link to="/dataSheet">Data Sheet</Link>},

    // { key: 'Shim', icon: <FileExcelOutlined />, label: <Link to="/shim">Shim</Link>},
    { key: 'Shim', icon: <FileExcelOutlined />,  label: 'Shim', children: [
      { key: '111', label: <Link to="/shim">Shim</Link> },
      { key: '112', label: <Link to="/shimfile">Shim File</Link> },
     
    ]},

    { key: 'Package', icon: <ExceptionOutlined />, label: <Link to="/package">กล่อง</Link>},

    { key: 'Outer', icon: <FileExclamationOutlined />, label: <Link to="/Outer">Outer</Link>},

    { key: 'โฟมสำเร็จรูปอุปกรณ์เสริม', icon: <FileExcelOutlined />, label: <Link to="/additionalpackage">โฟมสำเร็จรูปอุปกรณ์เสริม</Link>},
    { key: 'E-mark', icon: <FileExcelOutlined />, label: <Link to="/emark">E-mark</Link>},
    { key: 'Material', icon: <FileExcelOutlined />, label: <Link to="/material">Material</Link>},


    



    
    { key: 'user', icon: <UserOutlined />, label: <Link to="/usermanagement">User management</Link>},
   
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
        {collapsed ? `(${user.data.role})` : `${user.data.email}`}
        <div>
          {collapsed ? `` : `(${(user.data.role)})`}
        </div>
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
