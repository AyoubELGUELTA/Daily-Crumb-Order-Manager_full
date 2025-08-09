import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Products from './pages/Products';
import AuthPage from './pages/AuthPage';
import VerifyEmail from './pages/VerifyEmail';


function App() {
  const onVerificationEmailSuccess = () => {
    console.log("Email was indeed verified, you're now logged in.")
  }
  return (
    <div>

      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/authentification" element={<AuthPage />} />
        <Route path="/verifyEmail" element={<VerifyEmail onVerificationSuccess={onVerificationEmailSuccess} />} />
      </Routes>
    </div>
  );
}

export default App;
