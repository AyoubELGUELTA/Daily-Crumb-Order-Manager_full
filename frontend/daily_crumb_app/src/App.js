import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import OurProducts from './pages/OurProducts';
import AuthPage from './pages/AuthRelatedPages/AuthPage';
import VerifyEmail from './pages/AuthRelatedPages/VerifyEmail';
import HomeCooking from './pages/HomeCooking';
import AddProducts from './pages/AddAndCreate/AddProducts';
import UpdateProducts from './pages/UpdateAndManage/UpdateProducts';
import UpdateFormProduct from './pages/UpdateAndManage/UpdateFormProduct';


function App() {
  const onVerificationEmailSuccess = () => {
    console.log("Email was indeed verified, you're now logged in.")
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeCooking />} />
        <Route path="/ourProducts" element={<OurProducts />} />
        <Route path="/authentification" element={<AuthPage />} />
        <Route path="/verifyEmail" element={<VerifyEmail onVerificationSuccess={onVerificationEmailSuccess} />} />
        <Route path="/homeCooking" element={<HomeCooking />} />
        <Route path="/add/products" element={<AddProducts />} />
        <Route path="/update/products" element={<UpdateProducts />} />
        <Route path="/update/products/product" element={<UpdateFormProduct />} />
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  );
}

export default App;
