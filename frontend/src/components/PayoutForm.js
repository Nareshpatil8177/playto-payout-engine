import React, { useState } from 'react';
import { createPayout } from '../api';
import { v4 as uuidv4 } from 'uuid';

export default function PayoutForm({ onSuccess }) {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !bankAccount) {
      alert('Please fill both fields');
      return;
    }
    setLoading(true);
    const idempotencyKey = uuidv4();
    try {
      await createPayout(parseInt(amount, 10) * 100, bankAccount, idempotencyKey);
      onSuccess();
      setAmount('');
      setBankAccount('');
    } catch (err) {
      alert(err.response?.data?.error || 'Payout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Request Payout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Bank Account ID"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
      </form>
    </div>
  );
}