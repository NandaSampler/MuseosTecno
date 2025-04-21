import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Login from './components/login';
import Register from './components/registrar';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
export default App;
