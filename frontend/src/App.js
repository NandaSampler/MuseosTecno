import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Login from './ventanas/login';
import Register from './ventanas/registrar';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
export default App;
