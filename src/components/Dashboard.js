import React, { useEffect, useState } from 'react';
import { getBalance } from '../api';

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getBalance();
        setBalance(res.data);
      } catch (error) {
        console.error('Balance fetch error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 animate-pulse">
        <div className="h-40 bg-white/10 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-300 hover:shadow-pink-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-amber-400 to-pink-500 p-3 rounded-2xl shadow-lg animate-float">
          <span className="text-2xl">💰</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Financial Health</h2>
      </div>
      <div className="space-y-5">
        <div className="bg-black/30 rounded-2xl p-5">
          <p className="text-indigo-200 text-sm uppercase tracking-wider">Available Balance</p>
          <p className="text-5xl font-black text-green-400 mt-1">
            ₹{(balance.available_balance_paise / 100).toFixed(2)}
          </p>
        </div>
        <div className="bg-black/30 rounded-2xl p-5">
          <p className="text-indigo-200 text-sm uppercase tracking-wider">In Escrow (Held)</p>
          <p className="text-3xl font-bold text-yellow-300 mt-1">
            ₹{(balance.held_balance_paise / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}