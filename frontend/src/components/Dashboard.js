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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="bg-gray-800 p-6 rounded-lg animate-pulse h-48"></div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Balance</h2>
      <div className="space-y-2">
        <p className="text-gray-300">Available: <span className="text-green-400 font-bold">₹{(balance.available_balance_paise / 100).toFixed(2)}</span></p>
        <p className="text-gray-300">Held: <span className="text-yellow-400 font-bold">₹{(balance.held_balance_paise / 100).toFixed(2)}</span></p>
      </div>
    </div>
  );
}