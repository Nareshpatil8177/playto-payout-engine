import React, { useEffect, useState } from 'react';
import { getPayoutHistory } from '../api';

const StatusBadge = ({ status }) => {
  const config = {
    COMPLETED: 'bg-green-500/20 text-green-300 border-green-500/50',
    FAILED: 'bg-red-500/20 text-red-300 border-red-500/50',
    PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 animate-pulse',
    PROCESSING: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  };
  const base = 'px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm';
  return <span className={`${base} ${config[status] || config.PENDING}`}>{status}</span>;
};

export default function PayoutHistory() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await getPayoutHistory();
      setPayouts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 animate-pulse">
        <div className="h-64 bg-white/10 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-2 rounded-xl">
          <span className="text-xl">📜</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-white/20 text-indigo-200 text-sm">
              <th className="text-left pb-3 pl-2 font-medium">Amount</th>
              <th className="text-left pb-3 pl-2 font-medium">Bank Account</th>
              <th className="text-left pb-3 pl-2 font-medium">Status</th>
              <th className="text-left pb-3 pl-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, idx) => (
              <tr key={payout.id} className={`border-b border-white/10 hover:bg-white/5 transition ${idx % 2 === 0 ? 'bg-white/5' : ''}`}>
                <td className="py-4 pl-2 font-bold">₹{(payout.amount_paise / 100).toFixed(2)}</td>
                <td className="py-4 pl-2 font-mono text-sm">{payout.bank_account_id}</td>
                <td className="py-4 pl-2"><StatusBadge status={payout.status} /></td>
                <td className="py-4 pl-2 text-sm text-indigo-200">{new Date(payout.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payouts.length === 0 && (
          <p className="text-center text-indigo-300 py-10">No payments yet. Make your first withdrawal!</p>
        )}
      </div>
    </div>
  );
}