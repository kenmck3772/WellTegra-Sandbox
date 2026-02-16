
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const Step: React.FC<{ step: number; label: string; isActive: boolean; isCompleted: boolean; }> = ({ step, label, isActive, isCompleted }) => {
  const circleClasses = `w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
    ${isActive ? 'bg-teal-500 text-white scale-110' : ''}
    ${isCompleted ? 'bg-teal-700 text-white' : ''}
    ${!isActive && !isCompleted ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400' : ''}
  `;
  return (
    <div className="flex flex-col items-center">
        <div className={circleClasses}>{step}</div>
        <p className={`mt-2 text-sm font-medium ${isActive ? 'text-teal-500' : 'text-slate-500 dark:text-slate-400'}`}>{label}</p>
    </div>
  );
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Select Well' },
    { num: 2, label: 'Define Plan' },
    { num: 3, label: 'Review & Execute' },
  ];
  return (
    <div className="mb-12 flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.num}>
            <Step 
                step={step.num}
                label={step.label}
                isActive={currentStep === step.num}
                isCompleted={currentStep > step.num}
            />
            {index < steps.length - 1 && (
                <div className={`flex-1 h-1 rounded-full ${currentStep > step.num ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
            )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
