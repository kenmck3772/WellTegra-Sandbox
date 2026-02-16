
import React from 'react';
import { Well } from '../../types';

interface WellSchematicProps {
  well: Well;
  theme: 'light' | 'dark';
}

const WellSchematic: React.FC<WellSchematicProps> = ({ well, theme }) => {
  if (!well.completion) return null;

  const isDark = theme === 'dark';
  const completion = well.completion;
  const isProblemWell = well.id === 'W666';
  
  // 1. Determine actual max depth
  const depths = [
    ...completion.casing.map(c => c.bottom),
    ...completion.tubing.map(t => t.bottom),
    ...completion.perforations.map(p => p.bottom),
    ...completion.equipment.map(e => e.top),
    1000 // Min depth baseline
  ];
  const actualMaxDepth = Math.max(...depths);
  const depthWithBuffer = actualMaxDepth * 1.05;

  /**
   * 2. Calculate Scaling
   * We want a "mostly linear" growth but with constraints.
   * Internal SVG units: 1 unit = 10 feet for a clean coordinate system.
   */
  const unitsPerFoot = 0.1; 
  const totalUnitsHeight = depthWithBuffer * unitsPerFoot;
  
  // The physical display height in the browser.
  const displayHeight = Math.max(500, Math.min(1500, totalUnitsHeight));
  
  // Internal coordinate scaler
  const scale = unitsPerFoot;

  // 3. Adaptive Depth Markers
  const getStepSize = (depth: number) => {
    if (depth < 2500) return 500;
    if (depth < 7500) return 1000;
    if (depth < 15000) return 2500;
    return 5000;
  };

  const stepSize = getStepSize(actualMaxDepth);

  const DepthMarkers = () => (
    <g className="font-roboto-mono" textAnchor="end" fill={isDark ? '#94a3b8' : '#1d4ed8'} fontSize="10px">
      {Array.from({ length: Math.floor(depthWithBuffer / stepSize) + 1 }, (_, i) => i * stepSize).map(d => {
        const y = d * scale;
        return (
          <React.Fragment key={d}>
            <text x="30" y={y + 4}>{d >= 1000 ? `${(d / 1000).toFixed(1)}k` : d}</text>
            <line x1="35" y1={y} x2="42" y2={y} stroke={isDark ? '#4b5563' : '#cbd5e1'} strokeWidth="1"/>
          </React.Fragment>
        );
      })}
    </g>
  );

  const getEquipHeight = (feet: number) => Math.max(15, feet * scale);

  return (
    <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Well Status & Issue Summary */}
      <div className={`w-full mb-6 p-4 rounded-lg border-l-4 ${
        isProblemWell 
          ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
          : 'bg-slate-50 dark:bg-slate-800/50 border-teal-500'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className={`text-sm font-bold uppercase tracking-widest ${isProblemWell ? 'text-red-600 dark:text-red-400' : 'text-teal-600 dark:text-teal-400'}`}>
            Well Status Summary
          </h4>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            isProblemWell ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
          }`}>
            {well.status}
          </span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
          "{well.issue}"
        </p>
      </div>

      <div className="text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wider opacity-60">
        Vertical Scale: 100ft ≈ {Math.round(100 * scale)} Units
      </div>
      
      <svg 
          viewBox={`0 0 200 ${totalUnitsHeight}`} 
          width="200" 
          height={displayHeight} 
          className="transition-all duration-500 shadow-inner bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700"
          preserveAspectRatio="xMidYMin meet"
      >
        <DepthMarkers />
        
        {/* Wellbore background - the "hole" */}
        <rect x="50" y="0" width="100" height={totalUnitsHeight} fill={isDark ? '#1a1a1a' : '#f1f5f9'} />
        <line x1="50" y1="0" x2="50" y2={totalUnitsHeight} stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" />
        <line x1="150" y1="0" x2="150" y2={totalUnitsHeight} stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" />

        {/* Casing components - drawn wide */}
        {completion.casing?.map((c, i) => (
          <rect 
            key={`casing-${i}`} 
            x="65" 
            y={c.top * scale} 
            width="70" 
            height={(c.bottom - c.top) * scale} 
            fill="none" 
            stroke={c.isProblem ? '#ef4444' : (isDark ? '#64748b' : '#94a3b8')} 
            strokeWidth="3"
            strokeDasharray={c.isProblem ? "4 2" : "none"}
          />
        ))}
        
        {/* Tubing components - drawn inside casing */}
        {completion.tubing?.map((t, i) => (
          <rect 
            key={`tubing-${i}`} 
            x="96" 
            y={t.top * scale} 
            width="8" 
            height={(t.bottom - t.top) * scale} 
            fill={t.isProblem ? 'rgba(239, 68, 68, 0.2)' : (isDark ? '#475569' : '#cbd5e1')} 
            stroke={t.isProblem ? '#ef4444' : (isDark ? '#334155' : '#94a3b8')} 
            strokeWidth="1"
          />
        ))}
        
        {/* Downhole equipment */}
        {completion.equipment?.map((e, i) => {
          const y = e.top * scale;
          const h = getEquipHeight(10); 
          const textY = y + h/2 + 4;
          const fillProblem = 'rgba(239, 68, 68, 0.6)';
          const strokeProblem = '#ef4444';
          const fillNormal = isDark ? '#94a3b8' : '#64748b';

          let equipmentElement = null;
          
          if (e.item.includes('Packer')) {
            equipmentElement = (
              <g>
                <polygon points={`85,${y} 115,${y} 120,${y+h} 80,${y+h}`} fill={fillNormal} stroke={isDark ? '#1e293b' : '#fff'} strokeWidth="1" />
                <line x1="80" y1={y + h/2} x2="120" y2={y + h/2} stroke={isDark ? '#1e293b' : '#fff'} strokeWidth="1" />
              </g>
            );
          } else if (e.item.includes('SSSV')) {
            equipmentElement = (
              <g>
                <rect x="92" y={y} width="16" height={h} fill={fillProblem} stroke={strokeProblem} strokeWidth="1"/>
                <path d={`M 94 ${y + 4} L 106 ${y + h - 4} M 106 ${y + 4} L 94 ${y + h - 4}`} stroke="#fff" strokeWidth="1.5"/>
                <text x="115" y={textY} className="font-roboto-mono font-bold" fontSize="11px" fill={strokeProblem}>{e.item}</text>
              </g>
            );
          } else if (e.item.includes('Deformation')) {
              const defH = Math.max(40, getEquipHeight(60));
              equipmentElement = (
                  <g>
                      <path d={`M 65 ${y} Q 50 ${y + defH/2} 65 ${y + defH}`} stroke={strokeProblem} strokeWidth="3" fill="none" />
                      <path d={`M 135 ${y} Q 150 ${y + defH/2} 135 ${y + defH}`} stroke={strokeProblem} strokeWidth="3" fill="none" />
                      <text x="145" y={y + defH/2 + 4} className="font-roboto-mono font-bold" fontSize="11px" fill={strokeProblem}>{e.item}</text>
                  </g>
              );
          } else if (e.item.includes('Scale')) {
               const scaleH = Math.max(30, getEquipHeight(40));
               equipmentElement = (
                  <g>
                      <path d={`M 96 ${y} L 104 ${y} L 110 ${y+scaleH/2} L 104 ${y+scaleH} L 96 ${y+scaleH} L 90 ${y+scaleH/2} Z`} fill={fillProblem} stroke={strokeProblem} />
                      <text x="115" y={y + scaleH/2 + 4} className="font-roboto-mono font-bold" fontSize="11px" fill={strokeProblem}>{e.item}</text>
                  </g>
              );
          }
          return <React.Fragment key={`equip-${i}`}>{equipmentElement}</React.Fragment>;
        })}
        
        {/* Perforations */}
        {completion.perforations?.map((p, i) => {
            const perfTop = p.top * scale;
            const perfBottom = p.bottom * scale;
            const numArrows = Math.max(3, Math.min(20, Math.round((p.bottom - p.top) / 20)));
            const step = (numArrows > 1) ? (perfBottom - perfTop) / (numArrows - 1) : 0;
            
            return (
                <g key={`perfs-${i}`}>
                    {Array.from({ length: numArrows }, (_, j) => {
                        const y = perfTop + (j * step);
                        return (
                            <g key={j}>
                                <path d={`M 65 ${y} L 50 ${y} M 50 ${y} L 55 ${y-3} M 50 ${y} L 55 ${y+3}`} stroke="#3b82f6" strokeWidth="1" fill="none" />
                                <path d={`M 135 ${y} L 150 ${y} M 150 ${y} L 145 ${y-3} M 150 ${y} L 145 ${y+3}`} stroke="#3b82f6" strokeWidth="1" fill="none" />
                            </g>
                        );
                    })}
                    <rect x="65" y={perfTop} width="70" height={perfBottom - perfTop} fill="rgba(59, 130, 246, 0.1)" stroke="none" />
                </g>
            );
        })}

        {/* Surface indicator */}
        <line x1="40" y1="0" x2="160" y2="0" stroke={isDark ? '#94a3b8' : '#475569'} strokeWidth="4" />
      </svg>
      <div className="mt-4 text-[10px] text-slate-400 font-roboto-mono flex gap-4 bg-white/5 dark:bg-black/20 p-2 rounded-full px-4 border border-slate-200 dark:border-slate-800">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-400 rounded-sm"></span> Casing</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-300 rounded-sm border border-slate-400"></span> Tubing</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-sm"></span> Perforations</span>
      </div>
    </div>
  );
};

export default WellSchematic;
