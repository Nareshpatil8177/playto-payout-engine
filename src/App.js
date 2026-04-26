import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PayoutForm from './components/PayoutForm';
import PayoutHistory from './components/PayoutHistory';

function App() {
  const [refresh, setRefresh] = useState(0);
  const handlePayoutSuccess = () => setRefresh(prev => prev + 1);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse-slow"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Hero section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-4 border border-white/20">
            <span className="text-yellow-300 text-sm font-medium animate-pulse">⚡ LIVE</span>
            <span className="text-white/70 text-xs">instant settlements</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-transparent bg-300% animate-gradient">
            Playto Payout
          </h1>
          <p className="text-indigo-200 text-lg mt-3 max-w-2xl mx-auto">
            Lightning‑fast, secure international payouts for Indian freelancers & agencies.
          </p>
        </div>

        {/* Main grid with hover lift */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="transition-all duration-500 hover:translate-y-[-8px]">
            <Dashboard key={refresh} />
          </div>
          <div className="transition-all duration-500 hover:translate-y-[-8px]">
            <PayoutForm onSuccess={handlePayoutSuccess} />
          </div>
        </div>

        <div className="mt-10">
          <PayoutHistory key={refresh} />
        </div>
      </div>
    </div>
  );
}

export default App;