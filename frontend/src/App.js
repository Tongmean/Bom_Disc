import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import HeaderComponent from './Components/Header';
import FooterComponent from './Components/Footer';
import { Layout } from 'antd';
import Loginpage from "./Components/Loginpage";
import Homepage from './Pages/Home/Home';
//Protect Route
import ProtectedRoute from './Components/ProtectedRoute';
//package
import Package from './Pages/Package/Package';
import CreateDisplayBox from './Pages/Package/Createpackage';
import UpdateDisplayBox from './Pages/Package/Updatepackage';
//Outer
import Outer from './Pages/Outer/Outer';
import CreateOuter from './Pages/Outer/Createouter';
import UpdateOuter from './Pages/Outer/Updateouter';
//data sheet
import DataSheet from './Pages/Datasheet/Datasheet';
import CreateDatasheet from './Pages/Datasheet/Creaatedatasheet';
import UpdateDatasheet from './Pages/Datasheet/Updatedatasheet';
//productspec
import Productspec from './Pages/Productspec/Productspec';
import CreateProductSpec from './Pages/Productspec/Createproductspec';
import UpdateProductSpec from './Pages/Productspec/Updateproductspec';
//Additionalpackage
import Additionalpackage from './Pages/Additionalpackage/Addtionalpackage';
import CreateAdditionalPackage from './Pages/Additionalpackage/Createadditionalpackage';
import UpdateAdditionPackage from './Pages/Additionalpackage/Updateadditionalpackage';
//Shim
import Shim from './Pages/Shim/Shim';
import CreateShim from './Pages/Shim/Createshim';
import UpdateShim from './Pages/Shim/UpdateShim';
//Drawing
import Drawing from './Pages/Drawing/Drawing';
//user
import Usermanagement from './Pages/Users/Users';
import CreateUser from './Pages/Users/Createuser';
import UpdateUser from './Pages/Users/Updateuser';

import { useAuthContext } from './Hook/useAuthContext';
const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthContext();
  const isAuthenticated = Boolean(user && user.token);
  console.log('user', user, isAuthenticated)
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
              <Route path='/login' element={isAuthenticated ? <Navigate to='/Home' /> : <Loginpage />} />
              <Route path='/Home' element={isAuthenticated ? <Homepage /> : <Navigate to='/login' />} />

              <Route path="/Package" element={isAuthenticated ? <Package /> : <Navigate to='/login' />} />

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="createPackage" element={<CreateDisplayBox />} />
                <Route path="/Package/:id" element={<UpdateDisplayBox />} />
              </Route>
              {/* <Route path="/createPackage" element={isAuthenticated ? <CreateDisplayBox /> : <Navigate to='/login' />} /> */}
              {/* <Route path="/Package/:id" element={isAuthenticated ? <UpdateDisplayBox /> : <Navigate to='/login' />} /> */}

              <Route path="/outer" element={isAuthenticated ? <Outer /> : <Navigate to='/login' />} />
              <Route path="/createouter" element={isAuthenticated ? <CreateOuter /> : <Navigate to='/login' />} />
              <Route path="/outer/:id" element={isAuthenticated ? <UpdateOuter /> : <Navigate to='/login' />} />

              <Route path="/dataSheet" element={isAuthenticated ? <DataSheet /> : <Navigate to='/login' />} />
              <Route path="/createdatasheet" element={isAuthenticated ? <CreateDatasheet /> : <Navigate to='/login' />} />
              <Route path="/datasheet/:id" element={isAuthenticated ? <UpdateDatasheet /> : <Navigate to='/login' />} />


              <Route path="/productspec" element={isAuthenticated ? <Productspec /> : <Navigate to='/login' />} />
              <Route path="/createproductspec" element={isAuthenticated ? <CreateProductSpec /> : <Navigate to='/login' />} />
              <Route path="/productspec/:id" element={isAuthenticated ? <UpdateProductSpec /> : <Navigate to='/login' />} />


              <Route path="/Additionalpackage" element={isAuthenticated ? <Additionalpackage /> : <Navigate to='/login' />} />
              <Route path="/createadditionalpackage" element={isAuthenticated ? <CreateAdditionalPackage /> : <Navigate to='/login' />} />
              <Route path="/additionalpackage/:id" element={isAuthenticated ? <UpdateAdditionPackage /> : <Navigate to='/login' />} />


              <Route path="/shim" element={isAuthenticated ? <Shim /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createshim" element={<CreateShim />} />
                <Route path="/shim/:id" element={<UpdateShim />} />
              </Route>

              <Route path="/drawing" element={isAuthenticated ? <Drawing /> : <Navigate to='/login' />} />
              {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createshim" element={<CreateShim />} />
                <Route path="/shim/:id" element={<UpdateShim />} />
              </Route> */}


              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/usermanagement" element={<Usermanagement />} />
                <Route path="/createuser" element={<CreateUser />} />
                <Route path="/user/:id" element={<UpdateUser />} />
                {/* <Route path="/Package/:id" element={<UpdateDisplayBox />} /> */}
              </Route>


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
