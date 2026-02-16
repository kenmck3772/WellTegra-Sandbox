
import React, { useState } from 'react';

interface WelcomeScreenProps {
  onLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const handleLoginClick = () => {
    setIsLoggingIn(true);
    setTimeout(onLogin, 500); // Simulate network delay
  };

  return (
    <div className={`fixed inset-0 bg-slate-900 flex items-center justify-center z-50 transition-opacity duration-500 ${isLoggingIn ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        <img src="https://welltegra.network/assets/logo.png" alt="Well-Tegra Logo" className="h-24 w-auto mx-auto mb-8 animate-pulse" />
        <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-80">
          <h2 className="text-2xl font-bold text-white mb-6">Platform Login</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              defaultValue="demo@welltegra.com" 
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input 
              type="password" 
              placeholder="Password" 
              defaultValue="password" 
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button 
            onClick={handleLoginClick}
            className="mt-6 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
