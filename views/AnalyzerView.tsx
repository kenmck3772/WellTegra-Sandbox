
import React from 'react';
import { Well, Procedure, LiveData } from '../types';

interface AnalyzerViewProps {
  well: Well;
  plan: Procedure;
  result: LiveData;
  lessonsLearned: string[];
  onPlanNewJob: () => void;
}

const AnalyzerView: React.FC<AnalyzerViewProps> = ({ well, plan, result, lessonsLearned, onPlanNewJob }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Post-Job Analysis</h2>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
          Analysis for {plan.name} on {well.name}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Operational Time</p>
                <p className="text-3xl font-bold dark:text-white">{(result.opTime / 3600).toFixed(1)} hrs</p>
            </div>
             <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Non-Productive Time (NPT)</p>
                <p className="text-3xl font-bold dark:text-white">{(result.npt / 3600).toFixed(1)} hrs</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-lg">
           <h3 className="text-xl font-semibold mb-4 dark:text-white">Outcome</h3>
           <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg border-l-4 border-green-500">
               <h4 className="font-bold text-green-800 dark:text-green-300">Successful Intervention</h4>
               <p className="mt-2 text-green-700 dark:text-green-200">The primary objective was achieved. The well is now ready for the next phase of operations.</p>
           </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">System-Generated Lessons Learned</h3>
        <div className="space-y-4">
          {lessonsLearned.length > 0 ? (
            lessonsLearned.map((lesson, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-md flex items-start">
                  <span className="text-xl mr-3">💡</span>
                  <p className="text-slate-700 dark:text-slate-300">{lesson}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400">No new lessons were generated during this operation.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button onClick={onPlanNewJob} className="rounded-md bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-500">
          Plan Next Intervention
        </button>
      </div>
    </div>
  );
};

export default AnalyzerView;
