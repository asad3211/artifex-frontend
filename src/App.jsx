import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Mint from './pages/Mint'; // Make sure this exists

function App() {
  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/marketplace" style={{ marginRight: '10px' }}>Marketplace</Link>
        <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
        <Link to="/mint">Mint</Link>
      </nav>

      <Routes>
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="*" element={<Marketplace />} /> {/* default route */}
      </Routes>
    </div>
  );
}

export default App;
