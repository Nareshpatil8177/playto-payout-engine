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
      alert('Please enter amount and bank account ID');
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
      alert(err.response?.data?.error || 'Payout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-2xl shadow-lg animate-float">
          <span className="text-2xl">💸</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Request Payout</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">Amount (INR)</label>
          <input
            type="number"
            step="any"
            placeholder="e.g., 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
            required
          />
        </div>
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">Bank Account ID</label>
          <input
            type="text"
            placeholder="Your registered bank account"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-2xl text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-60 disabled:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing....
            </span>
          ) : (
            'Withdraw →'
          )}
        </button>
      </form>
    </div>
  );
}