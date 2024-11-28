import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import HeaderComponent from './Components/Header';
import FooterComponent from './Components/Footer';
import { Layout } from 'antd';
import Loginpage from "./Components/Loginpage";
import Homepage from './Pages/Home/Home';
import Package from './Pages/Package/Package';


import { useAuthContext } from './Hook/useAuthContext';
const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthContext();
  const isAuthenticated = Boolean(user && user.token);
  console.log('user', user)
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sidebar collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} />

        <Layout>
          {/* Header */}
          <HeaderComponent />

          {/* Main Content */}
          <Content
            style={{
              margin: '24px 16px',
              padding: '24px',
              background: '#ffffff',
              borderRadius: '4px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Routes>
              <Route path="/login" element={<Loginpage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/package" element={<Package />} />
              {/* Add more routes as needed */}
            </Routes>
          </Content>

          {/* Footer */}
          <FooterComponent />
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
