
import React from 'react';

interface HomeViewProps {
  onStart: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStart }) => {
  return (
    <div className="relative h-[calc(100vh-68px)] flex items-center justify-center text-center overflow-hidden">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        poster="https://welltegra.network/assets/thumbnail.png"
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      >
        <source src="https://welltegra.network/assets/thumbnail.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-900/70"></div>
      <div className="relative z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
          From Data Chaos to Predictive Clarity.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-3xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)' }}>
          The oil and gas industry is paralyzed by a disconnected digital ecosystem. Well-Tegra unifies your data, empowering your engineers with AI-driven insights to prevent failures before they happen.
        </p>
        <button 
          onClick={onStart}
          className="mt-10 inline-block bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
          Launch Planner Simulation
        </button>
      </div>
    </div>
  );
};

export default HomeView;
