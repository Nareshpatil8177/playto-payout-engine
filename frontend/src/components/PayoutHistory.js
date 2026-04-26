import React, { useEffect, useState } from 'react';
import { getPayoutHistory } from '../api';

const StatusBadge = ({ status }) => {
  const colors = {
    COMPLETED: 'bg-green-600',
    FAILED: 'bg-red-600',
    PENDING: 'bg-yellow-600',
    PROCESSING: 'bg-blue-600',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || 'bg-gray-600'}`}>
      {status}
    </span>
  );
};

export default function PayoutHistory() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await getPayoutHistory();
      setPayouts(res.data);
    } catch (err) {
      console.error(err);
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
    return <div className="bg-gray-800 p-6 rounded-lg animate-pulse h-64"></div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Payout History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-gray-300 text-sm">
          <thead className="border-b border-gray-700">
            <tr className="text-left">
              <th className="pb-2">Amount</th>
              <th className="pb-2">Bank Account</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-b border-gray-700">
                <td className="py-2">₹{(payout.amount_paise / 100).toFixed(2)}</td>
                <td className="py-2">{payout.bank_account_id}</td>
                <td className="py-2"><StatusBadge status={payout.status} /></td>
                <td className="py-2 text-xs">{new Date(payout.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {payouts.length === 0 && (
              <tr><td colSpan="4" className="text-center py-4 text-gray-500">No payouts yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}