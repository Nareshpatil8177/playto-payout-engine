import React, { useEffect, useState } from 'react';
import { getPayoutHistory } from '../api';

export default function PayoutHistory() {
  const [payouts, setPayouts] = useState([]);

  const fetchHistory = async () => {
    const res = await getPayoutHistory();
    setPayouts(res.data);
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Payout History</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Bank Account</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map(p => (
            <tr key={p.id}>
              <td>₹{(p.amount_paise / 100).toFixed(2)}</td>
              <td>{p.bank_account_id}</td>
              <td>{p.status}</td>
              <td>{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}