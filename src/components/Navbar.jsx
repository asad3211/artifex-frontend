import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '10px', backgroundColor: '#eee' }}>
      <Link to="/">Home</Link>
      <Link to="/mint">Mint</Link>
      <Link to="/marketplace">Marketplace</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

export default Navbar;
