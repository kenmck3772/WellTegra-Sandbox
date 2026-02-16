
import React, { useState } from 'react';
import { Well } from '../../types';
import WellSchematic from './WellSchematic';

interface WellHistoryModalProps {
  well: Well;
  onClose: () => void;
  theme: 'light' | 'dark';
}

type ModalTab = 'history' | 'schematic';

const WellHistoryModal: React.FC<WellHistoryModalProps> = ({ well, onClose, theme }) => {
    const [activeTab, setActiveTab] = useState<ModalTab>('history');
  
    return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] mx-4 transform transition-transform animate-zoom-in`}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold dark:text-white">Well Details: {well.name}</h3>
          <button onClick={onClose} className="text-3xl font-bold text-slate-400 hover:text-red-500">&times;</button>
        </div>
        
        <div className="border-b border-slate-200 dark:border-slate-700 px-4">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('history')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                    Operational History
                </button>
                <button onClick={() => setActiveTab('schematic')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'schematic' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                    Wellbore Schematic
                </button>
            </nav>
        </div>

        <div className="p-6 overflow-y-auto">
            {activeTab === 'history' && (
                <div className="space-y-4">
                {well.history.map((h, i) => (
                    <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-lg dark:text-white">{h.operation} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">- {h.date}</span></p>
                    <div className="mt-3 space-y-3">
                        <div className="flex items-start">
                        <span className="text-xl mr-3">⚠️</span>
                        <div>
                            <strong className="font-semibold text-red-600 dark:text-red-400">Problem:</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{h.problem}</p>
                        </div>
                        </div>
                        <div className="flex items-start">
                        <span className="text-xl mr-3">💡</span>
                        <div>
                            <strong className="font-semibold text-green-600 dark:text-green-400">Lesson Learned:</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{h.lesson}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            {activeTab === 'schematic' && well.completion && (
                <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg shadow-inner border border-slate-200 dark:border-slate-700 flex justify-center">
                    <WellSchematic well={well} theme={theme} />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WellHistoryModal;
