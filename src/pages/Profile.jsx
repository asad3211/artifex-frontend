import { useEffect, useState } from 'react';
import axios from 'axios';
import pi from '../pi'; // Pi SDK from CDN wrapper

function Profile() {
  const [user, setUser] = useState(null);
  const [userNFTs, setUserNFTs] = useState([]);

  // Pi login
  const handleLogin = async () => {
    if (!pi) return alert('Pi SDK not loaded');

    try {
      const scopes = ['username', 'payments'];
      const auth = await pi.authenticate(scopes, (incomplete) => {
        console.log('Incomplete payment:', incomplete);
      });
      console.log('Logged in user:', auth.user);
      setUser(auth.user);
    } catch (err) {
      console.error('Pi login error:', err);
    }
  };

  // Fetch NFTs owned by user
  useEffect(() => {
    async function fetchUserNFTs() {
      if (!user) return;

      try {
        const res = await axios.get('http://localhost:5000/nfts/');
        // Filter NFTs where owner matches logged-in user
        const ownedNFTs = res.data.filter(nft => nft.owner === user.walletAddress);
        setUserNFTs(ownedNFTs);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
      }
    }

    fetchUserNFTs();
  }, [user]);

  return (
    <div>
      <h1>Your Profile</h1>

      {!user ? (
        <button onClick={handleLogin}>Login with Pi</button>
      ) : (
        <>
          <h3>Wallet: {user.walletAddress}</h3>
          <h2>Your NFTs</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {userNFTs.length === 0 ? (
              <p>You don’t own any NFTs yet.</p>
            ) : (
              userNFTs.map(nft => (
                <div key={nft._id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                  <img src={nft.imageUrl} alt={nft.title} width="100%" />
                  <h3>{nft.title}</h3>
                  <p>Price: {nft.price} Pi</p>
                  <p>Status: {nft.txStatus}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
