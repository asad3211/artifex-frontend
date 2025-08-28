import { useState } from 'react';
import axios from 'axios';

function Mint() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleMint = async () => {
    const res = await axios.post('http://localhost:5000/nfts/mint', {
      title,
      owner: '0xUserWallet', // replace with logged-in Pi user later
      price,
      imageUrl
    });
    alert('NFT Minted! ID: ' + res.data.nft._id);
  };

  return (
    <div>
      <h1>Mint NFT</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><br/>
      <input placeholder="Price (Pi)" value={price} onChange={e => setPrice(e.target.value)} /><br/>
      <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} /><br/>
      <button onClick={handleMint}>Mint</button>
    </div>
  );
}

export default Mint;
