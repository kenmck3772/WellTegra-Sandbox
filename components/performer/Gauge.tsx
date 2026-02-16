
import React from 'react';

interface GaugeProps {
  label: string;
  value: string | number;
}

const Gauge: React.FC<GaugeProps> = ({ label, value }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center flex flex-col justify-between">
      <p className="text-sm text-slate-400 whitespace-nowrap">{label}</p>
      <p className="text-3xl font-bold font-roboto-mono text-teal-400 mt-2">{value}</p>
    </div>
  );
};

export default Gauge;
