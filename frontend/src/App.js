import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import HeaderComponent from './Components/Header';
import FooterComponent from './Components/Footer';
import { Layout } from 'antd';
import Loginpage from "./Components/Loginpage";
//Display
import Homepage from './Pages/Display/Home';
import Wipdisplay from './Pages/Display/Wipdisplay';
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
import CreateDrawing from './Pages/Drawing/Createdrawing';
import UpdateDrawing from './Pages/Drawing/Updatedrawing';
//bom
import Bom from './Pages/Bom/Bom';
import CreateBom from './Pages/Bom/Createbom';
import UpdateBom from './Pages/Bom/Updatebom';
//Drawing File
import Drawingfile from './Pages/Drawingfile/Drawingfile';
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
              <Route path='/wipdisplay' element={isAuthenticated ? <Wipdisplay /> : <Navigate to='/login' />} />

              <Route path="/Package" element={isAuthenticated ? <Package /> : <Navigate to='/login' />} />

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createPackage" element={<CreateDisplayBox />} />
                <Route path="/Package/:id" element={<UpdateDisplayBox />} />
              </Route>
              {/* <Route path="/createPackage" element={isAuthenticated ? <CreateDisplayBox /> : <Navigate to='/login' />} /> */}
              {/* <Route path="/Package/:id" element={isAuthenticated ? <UpdateDisplayBox /> : <Navigate to='/login' />} /> */}

              <Route path="/outer" element={isAuthenticated ? <Outer /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createouter" element={<CreateOuter />} />
                <Route path="/outer/:id" element={<UpdateOuter />} />
              </Route>

              <Route path="/dataSheet" element={isAuthenticated ? <DataSheet /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createdatasheet" element={<CreateDatasheet />} />
                <Route path="/datasheet/:id" element={<UpdateDatasheet />} />
              </Route>

              <Route path="/productspec" element={isAuthenticated ? <Productspec /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createproductspec" element={<CreateProductSpec />} />
                <Route path="/productspec/:id" element={<UpdateProductSpec />} />
              </Route>

              <Route path="/Additionalpackage" element={isAuthenticated ? <Additionalpackage /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createadditionalpackage" element={<CreateAdditionalPackage />} />
                <Route path="/additionalpackage" element={<UpdateAdditionPackage />} />
              </Route>


              <Route path="/shim" element={isAuthenticated ? <Shim /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createshim" element={<CreateShim />} />
                <Route path="/shim/:id" element={<UpdateShim />} />
              </Route>

              <Route path="/drawing" element={isAuthenticated ? <Drawing /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createdrawing" element={<CreateDrawing />} />
                <Route path="/drawing/:id" element={<UpdateDrawing />} />
              </Route>

              <Route path="/bom" element={isAuthenticated ? <Bom /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/createbom" element={<CreateBom />} />
                <Route path="/bom/:id" element={<UpdateBom />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/usermanagement" element={<Usermanagement />} />
                <Route path="/createuser" element={<CreateUser />} />
                <Route path="/user/:id" element={<UpdateUser />} />
                {/* <Route path="/Package/:id" element={<UpdateDisplayBox />} /> */}
              </Route>

              <Route path="/drawingfile" element={isAuthenticated ? <Drawingfile /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
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
