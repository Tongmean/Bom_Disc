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
import Componentdisplay from './Pages/Display/Componentdisplay';
import Wipprocessdisplay from './Pages/Display/Wipprocessdisplay';
import Datasheetdisplay from './Pages/Display/Datasheetdisplay';
import HomeDescription from './HomeDescription/HomeDescription';
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
//kit
import Kit from './Pages/Kit/Kit';

//Datasheet file
import Datasheetfile from './Pages/Datasheetfile/Datasheetfile';
import CreateDatasheetFile from './Pages/Datasheetfile/Createdtasheetfile';
import UpdateDatasheetFile from './Pages/Datasheetfile/Updatedatasheet';
//Data-sheet-Revise
import Machine from './Pages/D_Machine/Machine';
import CreateMachine from './Pages/D_Machine/CreateMachine';
import UpdateMachine from './Pages/D_Machine/UpdateMachine';

import Mold from './Pages/D_Mold/Mold';
import CreateMold from './Pages/D_Mold/CreateMold';
import UpdateMold from './Pages/D_Mold/UpdateMold';
import Chemgrade from './Pages/D_Chemgrade/Chemgrade';
import CreateChemgrade from './Pages/D_Chemgrade/CreateChemgrade';
import UpdateChemgrade from './Pages/D_Chemgrade/UpdateChemgrade';

import D_Weight from './Pages/D_Weight/D_Weight';
import CreateD_Weight from './Pages/D_Weight/CreateD_Weight';
import UpdateD_Weight from './Pages/D_Weight/UpdateD_Weight';

import D_Pressure from './Pages/D_Pressure/D_Pressure';
import CreateD_Pressure from './Pages/D_Pressure/CreateD_Pressure';
import UpdateD_Pressure from './Pages/D_Pressure/UpdateD_Pressure';

import Moldmachine from './Pages/D_Moldmachine/Moldmachine';
import CreateMoldmachine from './Pages/D_Moldmachine/CreateMoldmachine';
import CreateMultipleMoldmachine from './Pages/D_Moldmachine/CreateMultipleMoldmachine';
import UpdateMoldmachine from './Pages/D_Moldmachine/UpdateMoldmachine';

import Wipprocess from './Pages/Wipprocess/Wipprocess';
import CreateWip from './Pages/Wipprocess/CreateWip';
import UpdateWip from './Pages/Wipprocess/UpdateWip';
const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthContext();
  // const isAuthenticated = Boolean(user && user.token);
  const isAuthenticated = Boolean(user && user.token && window.location.pathname !== '/');
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
              <Route path='' element={<HomepageTwin/>} />

              <Route path='/login' element={isAuthenticated ? <Navigate to='/Home' /> : <Loginpage />} />
              <Route path='/bomdisplay' element={isAuthenticated ? <Homepage /> : <Navigate to='/login' />} />
              <Route path='/Home' element={isAuthenticated ? <HomeDescription /> : <Navigate to='/login' />} />
              <Route path='/wipdisplay' element={isAuthenticated ? <Wipdisplay /> : <Navigate to='/login' />} />
              <Route path='/wipprocessdisplay' element={isAuthenticated ? <Wipprocessdisplay /> : <Navigate to='/login' />} />
              <Route path='/Qcdisplay' element={isAuthenticated ? <Qcdisplay /> : <Navigate to='/login' />} />
              <Route path='/saledisplay' element={isAuthenticated ? <Saledisplay /> : <Navigate to='/login' />} />
              <Route path='/componentdisplay' element={isAuthenticated ? <Componentdisplay /> : <Navigate to='/login' />} />
              <Route path='/datasheetdisplay' element={isAuthenticated ? <Datasheetdisplay /> : <Navigate to='/login' />} />

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

              <Route path="/machine" element={isAuthenticated ? <Machine /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createmachine" element={<CreateMachine />} />
                <Route path="/machine/:id" element={<UpdateMachine />} />
              </Route>

              <Route path="/mold" element={isAuthenticated ? <Mold /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createmold" element={<CreateMold />} />
                <Route path="/mold/:id" element={<UpdateMold />} />
              </Route>

              <Route path="/chemgrade" element={isAuthenticated ? <Chemgrade /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createchemgrade" element={<CreateChemgrade />} />
                <Route path="/chemgrade/:id" element={<UpdateChemgrade />} />
              </Route>

              <Route path="/dweight" element={isAuthenticated ? <D_Weight /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createdweight" element={<CreateD_Weight />} />
                <Route path="/dweight/:id" element={<UpdateD_Weight />} />
              </Route>
              <Route path="/dpressure" element={isAuthenticated ? <D_Pressure /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createdpressure" element={<CreateD_Pressure />} />
                <Route path="/dpressure/:id" element={<UpdateD_Pressure />} />
              </Route>
              <Route path="/dmoldmachine" element={isAuthenticated ? <Moldmachine /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createdmoldmachine" element={<CreateMoldmachine />} />
                <Route path="/createmultipledmoldmachine" element={<CreateMultipleMoldmachine />} />
                <Route path="/dmoldmachine/:id" element={<UpdateMoldmachine />} />
              </Route>
              <Route path="/wip" element={isAuthenticated ? <Wipprocess /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createwip" element={<CreateWip />} />
                <Route path="/wip/:id" element={<UpdateWip />} />
              </Route>


              <Route path="/dataSheetfile" element={isAuthenticated ? <Datasheetfile /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['datasheet']}/>}>
                <Route path="/createdatasheetfile" element={<CreateDatasheetFile />} />
                <Route path="/datasheetfile/:id" element={<UpdateDatasheetFile />} />
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
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['drawing']}/>}>
                <Route path="/createdrawingfile" element={<CreateDrawingFile />} />
                <Route path="/drawingfile/:id" element={<UpdateDrawingFile />} />
              </Route>

              <Route path="/productspecfile" element={isAuthenticated ? <Productspecfile /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['productspec']}/>}>
                <Route path="/createproductspecfile" element={<CreateProductspecFile />} />
                <Route path="/productspecfile/:id" element={<UpdateProductspecFile />} />
              </Route>
              <Route path="/emark" element={isAuthenticated ? <Emark /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['emark']}/>}>
                <Route path="/createemark" element={<CreateEmark />} />
                <Route path="/emark/:id" element={<UpdateEmark />} />
              </Route>

              <Route path="/shimfile" element={isAuthenticated ? <Shimfile /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['shim']}/>}>
                <Route path="/createshimfile" element={<CreateShimFile />} />
                <Route path="/shimfile/:id" element={<UpdateShimFile />} />
              </Route>

              <Route path="/componentpart" element={isAuthenticated ? <Material /> : <Navigate to='/login' />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['componentpart']}/>}>
                <Route path="/createcomponentpart" element={<CreateMaterial />} />
                <Route path="/componentpart/:id" element={<UpdateMaterial />} />
              </Route>
              <Route path="/kit" element={isAuthenticated ? <Kit /> : <Navigate to='/login' />} />
              {/* <Route element={<ProtectedRoute allowedRoles={['admin']} allowedPermissions={['componentpart']}/>}>
                <Route path="/createcomponentpart" element={<CreateMaterial />} />
                <Route path="/componentpart/:id" element={<UpdateMaterial />} />
              </Route> */}


            </Routes>
          </Content>

          <FooterComponent />
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
