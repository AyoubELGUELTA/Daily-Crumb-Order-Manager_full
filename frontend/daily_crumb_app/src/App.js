import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Products from './pages/Products';
import AuthPageLogin from './pages/AuthPageLogin';


function App() {
  return (
    <div>

      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<AuthPageLogin />} />
      </Routes>
    </div>
  );
}

export default App;
