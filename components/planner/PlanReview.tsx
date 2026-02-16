
import React from 'react';
import { Well, Procedure } from '../../types';

interface PlanReviewProps {
  well: Well;
  plan: Procedure;
}

const PlanReview: React.FC<PlanReviewProps> = ({ well, plan }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 space-y-8 rounded-lg shadow-lg">
      <div>
        <h3 className="text-2xl font-bold dark:text-white">Intervention Plan: {well.name}</h3>
        <p className="text-lg font-medium text-teal-600 dark:text-teal-400">{plan.name}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Conveyance Method</p>
          <p className="text-lg font-semibold dark:text-white">{plan.conveyance}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tool Weight</p>
          <p className="text-lg font-semibold dark:text-white">{plan.toolWeight.toLocaleString()} lbs</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Primary Objective</p>
          <p className="text-lg font-semibold dark:text-white">{well.issue.split(':')[0]}</p>
        </div>
      </div>
      <div>
        <h4 className="text-xl font-semibold mb-4 dark:text-white">Baseline Procedure</h4>
        <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
          {plan.steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </div>
    </div>
  );
};

export default PlanReview;
