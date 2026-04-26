import React, { useEffect, useState } from 'react';
import { getBalance } from '../api';

export default function Dashboard() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getBalance();
      setBalance(res.data);
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!balance) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Balance</h2>
      <p>Available: ₹{(balance.available_balance_paise / 100).toFixed(2)}</p>
      <p>Held: ₹{(balance.held_balance_paise / 100).toFixed(2)}</p>
    </div>
  );
}