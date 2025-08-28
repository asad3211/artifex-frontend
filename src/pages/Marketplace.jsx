import { useEffect, useState } from 'react';
import axios from 'axios';
import pi from '../pi'; // Pi SDK from CDN wrapper

function Marketplace() {
  const [nfts, setNFTs] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch NFTs from backend
  useEffect(() => {
    async function fetchNFTs() {
      try {
        const res = await axios.get('http://localhost:5000/nfts/');
        // Show only NFTs not sold yet
        const availableNFTs = res.data.filter(nft => nft.txStatus !== 'paid');
        setNFTs(availableNFTs);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
      }
    }
    fetchNFTs();
  }, []);

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

  // Handle buying NFT
  const handleBuy = async (nft) => {
    if (!user) return alert('Please login with Pi first!');
    if (!window.confirm(`Buy ${nft.title} for ${nft.price} Pi?`)) return;

    try {
      await pi.createPayment(
        {
          amount: nft.price,
          memo: `Artifex NFT #${nft._id}`,
          metadata: { nftId: nft._id }
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            await axios.post('http://localhost:5000/payments/approve', { paymentId });
            console.log('Payment approved on server');
          },
          onReadyForServerCompletion: async (paymentId, txId) => {
            await axios.post('http://localhost:5000/payments/complete', { paymentId, txId });
            await axios.put(`http://localhost:5000/nfts/${nft._id}/status`, { txStatus: 'paid' });
            alert('NFT purchased successfully!');
            // Refresh NFT list
            setNFTs(prev => prev.filter(item => item._id !== nft._id));
          },
          onCancel: () => alert('Payment cancelled'),
          onError: (e) => console.error('Payment error:', e)
        }
      );
    } catch (err) {
      console.error('Error buying NFT:', err);
    }
  };

  return (
    <div>
      <h1>Marketplace</h1>
      {!user && <button onClick={handleLogin}>Login with Pi</button>}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        {nfts.length === 0 ? (
          <p>No NFTs available for sale.</p>
        ) : (
          nfts.map(nft => (
            <div key={nft._id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
              <img src={nft.imageUrl} alt={nft.title} width="100%" />
              <h3>{nft.title}</h3>
              <p>Price: {nft.price} Pi</p>
              <p>Status: {nft.txStatus}</p>
              <button onClick={() => handleBuy(nft)}>Buy</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Marketplace;
