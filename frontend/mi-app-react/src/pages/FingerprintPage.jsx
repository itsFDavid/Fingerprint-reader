import { useState } from 'react';
import { enrollFingerprint, verifyFingerprint, deleteFingerprint } from '../services/api';

const FingerprintPage = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleEnroll = async () => {
    const response = await enrollFingerprint(userId);
    setMessage(response.message);
  };

  const handleVerify = async () => {
    const response = await verifyFingerprint();
    setMessage(response.message);
  };

  const handleDelete = async () => {
    const response = await deleteFingerprint(userId);
    setMessage(response.message);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Fingerprint Management</h1>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 mt-4"
      />
      <div className="mt-4">
        <button onClick={handleEnroll} className="bg-blue-500 text-white px-4 py-2 mr-2">Enroll</button>
        <button onClick={handleVerify} className="bg-green-500 text-white px-4 py-2 mr-2">Verify</button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2">Delete</button>
      </div>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default FingerprintPage;
