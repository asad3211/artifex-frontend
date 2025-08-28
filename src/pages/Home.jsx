import { useState } from 'react';
import pi from '../pi';

function Home() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const scopes = ['username', 'payments']; // permissions
      const auth = await pi.authenticate(scopes, (incomplete) => {
        console.log('Incomplete payment', incomplete);
      });
      console.log('Logged in user:', auth.user);
      setUser(auth.user);
    } catch (err) {
      console.error('Pi login error:', err);
    }
  };

  return (
    <div>
      {!user ? (
        <button onClick={handleLogin}>Login with Pi</button>
      ) : (
        <h2>Welcome, {user.username}</h2>
      )}
    </div>
  );
}

export default Home;
