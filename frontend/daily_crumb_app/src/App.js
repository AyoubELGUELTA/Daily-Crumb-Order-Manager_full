import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Products from './pages/Products';
import AuthPage from './pages/AuthPage';


function App() {
  return (
    <div>

      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/authentification" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
