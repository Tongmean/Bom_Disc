import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import HeaderComponent from './Components/Header';
import FooterComponent from './Components/Footer';
import { Layout } from 'antd';
import { useAuthContext } from './Hook/useAuthContext';
import Loginpage from "./Components/Loginpage";
//Display
import HomepageTwin from './Components/Homepage';
import Homepage from './Pages/Display/Home';
import Wipdisplay from './Pages/Display/Wipdisplay';
import Qcdisplay from './Pages/Display/Qcdisplay';
import Saledisplay from './Pages/Display/Saledisplay';
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
import CreateDrawingFile from './Pages/Drawingfile/Createdraingfile';
import UpdateDrawingFile from './Pages/Drawingfile/Updatedrawingfile';
//Productspecfile
import Productspecfile from './Pages/Productspecfile/Productspecfile';
import CreateProductspecFile from './Pages/Productspecfile/Createproductspecfile';
import UpdateProductspecFile from './Pages/Productspecfile/Updateproductspec';
//emark
import Emark from './Pages/Emark/Emark';
import CreateEmark from './Pages/Emark/Createemark';
import UpdateEmark from './Pages/Emark/Updateemark';
//user
import Usermanagement from './Pages/Users/Users';
import CreateUser from './Pages/Users/Createuser';
import UpdateUser from './Pages/Users/Updateuser';
//shimfile
import Shimfile from './Pages/Shimfile/Shimfile';
import CreateShimFile from './Pages/Shimfile/Createshimfile';
import UpdateShimFile from './Pages/Shimfile/Updateshimfile';
//Material
import Material from './Pages/Matertial/Material';
import CreateMaterial from './Pages/Matertial/CreateMaterial';
import UpdateMaterial from './Pages/Matertial/UpdateMaterial';

const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthContext();
  // const isAuthenticated = Boolean(user && user.token);
  const isAuthenticated = Boolean(user && user.token && window.location.pathname !== '/');
  // console.log('user', user, isAuthenticated)
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
              <Route path='' element={<HomepageTwin/>} />

              <Route path='/login' element={isAuthenticated ? <Navigate to='/Home' /> : <Loginpage />} />
              <Route path='/Home' element={isAuthenticated ? <Homepage /> : <Navigate to='/login' />} />
              <Route path='/wipdisplay' element={isAuthenticated ? <Wipdisplay /> : <Navigate to='/login' />} />
              <Route path='/Qcdisplay' element={isAuthenticated ? <Qcdisplay /> : <Navigate to='/login' />} />
              <Route path='/saledisplay' element={isAuthenticated ? <Saledisplay /> : <Navigate to='/login' />} />

              <Route path="/Package" element={isAuthenticated ? <Package /> : <Navigate to='/login' />} />

              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['Rm&Pk']}/>}>
                <Route path="/createPackage" element={<CreateDisplayBox />} />
                <Route path="/Package/:id" element={<UpdateDisplayBox />} />
              </Route>

              <Route path="/outer" element={isAuthenticated ? <Outer /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['Outer']}/>} >
                <Route path="/createouter" element={<CreateOuter />} />
                <Route path="/outer/:id" element={<UpdateOuter />} />
              </Route>

              <Route path="/dataSheet" element={isAuthenticated ? <DataSheet /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createdatasheet" element={<CreateDatasheet />} />
                <Route path="/datasheet/:id" element={<UpdateDatasheet />} />
              </Route>

              <Route path="/productspec" element={isAuthenticated ? <Productspec /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['productspec']}/>}>
                <Route path="/createproductspec" element={<CreateProductSpec />} />
                <Route path="/productspec/:id" element={<UpdateProductSpec />} />
              </Route>

              <Route path="/additionalpackage" element={isAuthenticated ? <Additionalpackage /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['additionalpackage']}/>}>
                <Route path="/createadditionalpackage" element={<CreateAdditionalPackage />} />
                <Route path="/additionalpackage/:id" element={<UpdateAdditionPackage />} />
              </Route>


              <Route path="/shim" element={isAuthenticated ? <Shim /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['shim']}/>}>
                <Route path="/createshim" element={<CreateShim />} />
                <Route path="/shim/:id" element={<UpdateShim />} />
              </Route>

              <Route path="/drawing" element={isAuthenticated ? <Drawing /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['drawing']}/>}>
                <Route path="/createdrawing" element={<CreateDrawing />} />
                <Route path="/drawing/:id" element={<UpdateDrawing />} />
              </Route>

              <Route path="/productregister" element={isAuthenticated ? <Bom /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['productregister']} />}>
                <Route path="/createproductregister" element={<CreateBom />} />
                <Route path="/productregister/:id" element={<UpdateBom />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
                <Route path="/usermanagement" element={<Usermanagement />} />
                <Route path="/createuser" element={<CreateUser />} />
                <Route path="/user/:id" element={<UpdateUser />} />
              </Route>

              <Route path="/drawingfile" element={isAuthenticated ? <Drawingfile /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['drawingfile']}/>}>
                <Route path="/createdrawingfile" element={<CreateDrawingFile />} />
                <Route path="/drawingfile/:id" element={<UpdateDrawingFile />} />
              </Route>

              <Route path="/productspecfile" element={isAuthenticated ? <Productspecfile /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['productspecfile']}/>}>
                <Route path="/createproductspecfile" element={<CreateProductspecFile />} />
                <Route path="/productspecfile/:id" element={<UpdateProductspecFile />} />
              </Route>
              <Route path="/emark" element={isAuthenticated ? <Emark /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['emark']}/>}>
                <Route path="/createemark" element={<CreateEmark />} />
                <Route path="/emark/:id" element={<UpdateEmark />} />
              </Route>

              <Route path="/shimfile" element={isAuthenticated ? <Shimfile /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['shimfile']}/>}>
                <Route path="/createshimfile" element={<CreateShimFile />} />
                <Route path="/shimfile/:id" element={<UpdateShimFile />} />
              </Route>

              <Route path="/componentpart" element={isAuthenticated ? <Material /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['componentpart']}/>}>
                <Route path="/createcomponentpart" element={<CreateMaterial />} />
                <Route path="/componentpart/:id" element={<UpdateMaterial />} />
              </Route>


            </Routes>
          </Content>

          <FooterComponent />
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
