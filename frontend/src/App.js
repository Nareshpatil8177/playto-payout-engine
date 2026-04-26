import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PayoutForm from './components/PayoutForm';
import PayoutHistory from './components/PayoutHistory';

function App() {
  const [refresh, setRefresh] = useState(0);
  const handlePayoutSuccess = () => setRefresh(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Playto Payout Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Dashboard key={refresh} />
          <PayoutForm onSuccess={handlePayoutSuccess} />
        </div>
        <div className="mt-8">
          <PayoutHistory key={refresh} />
        </div>
      </div>
    </div>
  );
}

export default App;