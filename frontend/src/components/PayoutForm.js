import React, { useState } from 'react';
import { createPayout } from '../api';
import { v4 as uuidv4 } from 'uuid';

export default function PayoutForm({ onSuccess }) {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const idempotencyKey = uuidv4();
    try {
      await createPayout(parseInt(amount, 10) * 100, bankAccount, idempotencyKey);
      onSuccess();
      setAmount('');
      setBankAccount('');
    } catch (err) {
      alert(err.response?.data?.error || 'Payout failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Request Payout</h2>
      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-2"
        required
      />
      <input
        type="text"
        placeholder="Bank Account ID"
        value={bankAccount}
        onChange={(e) => setBankAccount(e.target.value)}
        className="border p-2 w-full mb-2"
        required
      />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 w-full">
        {loading ? 'Processing...' : 'Withdraw'}
      </button>
    </form>
  );
}