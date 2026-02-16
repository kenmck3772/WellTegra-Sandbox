
import React from 'react';
import { Well } from '../../types';

interface WellCardProps {
  well: Well;
  isSelected: boolean;
  onSelect: (wellId: string) => void;
  onViewDetails: (wellId: string) => void;
}

const WellCard: React.FC<WellCardProps> = ({ well, isSelected, onSelect, onViewDetails }) => {
  const isProblemWell = well.id === 'W666';
  
  const getStatusColorInfo = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('shut-in') || lowerStatus.includes('failed')) {
      return {
        badgeClasses: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        dotClasses: 'bg-red-500',
      };
    }
    if (lowerStatus.includes('active')) {
      return {
        badgeClasses: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        dotClasses: 'bg-green-500',
      };
    }
    return {
      badgeClasses: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
      dotClasses: 'bg-slate-500',
    };
  };

  const cardClasses = `
    p-6 cursor-pointer rounded-lg shadow-md border-2 transition-all duration-300
    ${isSelected 
        ? 'scale-105 shadow-xl ' + (isProblemWell ? 'border-red-500 bg-red-500/10' : 'border-teal-500 bg-teal-500/10')
        : 'bg-white dark:bg-slate-800 ' + (isProblemWell ? 'border-red-500/50 hover:border-red-500' : 'border-slate-300 dark:border-slate-700 hover:border-teal-400')
    }
  `;

  const statusInfo = getStatusColorInfo(well.status);
  const parsedStatus = well.status.split(' - ')[0];

  return (
    <div className={cardClasses} onClick={() => onSelect(well.id)}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${isProblemWell ? 'text-red-600 dark:text-red-400' : 'dark:text-white'}`}>{well.name}</h3>
          <p className="text-sm font-medium text-teal-600 dark:text-teal-400">{well.field}</p>
        </div>
        {well.completion && (
            <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(well.id); }}
                className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-semibold"
            >
                Details
            </button>
        )}
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center">
          <strong className="text-slate-600 dark:text-slate-400 mr-2">Status:</strong>
          <span className={`inline-flex items-center font-medium text-xs px-2.5 py-0.5 rounded-full ${statusInfo.badgeClasses}`}>
            <span className={`w-2 h-2 mr-1.5 rounded-full ${statusInfo.dotClasses}`}></span>
            {parsedStatus}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          <strong>Issue:</strong>
          <span className="font-normal"> {well.issue}</span>
        </p>
      </div>
    </div>
  );
};

export default WellCard;
