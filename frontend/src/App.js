import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PayoutForm from './components/PayoutForm';
import PayoutHistory from './components/PayoutHistory';

function App() {
  const [refresh, setRefresh] = useState(0);
  const handlePayoutSuccess = () => setRefresh(prev => prev + 1);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Playto Payout Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dashboard key={refresh} />
        <PayoutForm onSuccess={handlePayoutSuccess} />
      </div>
      <div className="mt-4">
        <PayoutHistory key={refresh} />
      </div>
    </div>
  );
}

export default App;