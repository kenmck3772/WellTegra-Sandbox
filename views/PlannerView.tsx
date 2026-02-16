
import React, { useState, useEffect } from 'react';
import { Well, Procedure, Objective, Problem, AiRecommendation } from '../types';
import { WELL_DATA, OBJECTIVES_DATA, PROBLEMS_DATA, AI_RECOMMENDATIONS_DATA } from '../constants';
import WellCard from '../components/planner/WellCard';
import PlanReview from '../components/planner/PlanReview';
import StepIndicator from '../components/planner/StepIndicator';

interface PlannerViewProps {
  selectedWell: Well | null;
  generatedPlan: Procedure | null;
  onSelectWell: (wellId: string) => void;
  onGeneratePlan: (objectiveId: string) => boolean;
  onOpenModal: (wellId: string) => void;
  onBeginOperation: () => void;
  onReset: () => void;
}

type PlannerStep = 1 | 2 | 3;

const PlannerView: React.FC<PlannerViewProps> = ({
  selectedWell, generatedPlan, onSelectWell, onGeneratePlan, onOpenModal, onBeginOperation, onReset
}) => {
  const [step, setStep] = useState<PlannerStep>(1);
  const [useAI, setUseAI] = useState(true);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<AiRecommendation | null>(null);

  useEffect(() => {
    if (generatedPlan) {
      setStep(3);
    } else if (selectedWell) {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [selectedWell, generatedPlan]);
  
  const handleSelectProblem = (problemId: string) => {
    setSelectedProblemId(problemId);
    setSelectedRecommendation(null);
  };
  
  const handleSelectRecommendation = (rec: AiRecommendation) => {
    setSelectedRecommendation(rec);
  };
  
  const handleGenerateClick = () => {
    if (selectedRecommendation) {
      const success = onGeneratePlan(selectedRecommendation.objectiveId);
      if (success) setStep(3);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Well Intervention Planner</h2>
      </div>
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <section className="animate-fade-in">
          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-tight dark:text-white">Step 1: Select a Well</h3>
            <p className="mt-4 max-w-3xl mx-auto text-sm text-slate-500 dark:text-slate-400">Welcome to the "Well From Hell" case study. The portfolio below contains one critical problem well, <strong>W666 - The Perfect Storm</strong>. The other wells are historical case studies that provide proven solutions. Select the "Well From Hell" to begin.</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {WELL_DATA.map(well => (
              <WellCard
                key={well.id}
                well={well}
                isSelected={selectedWell?.id === well.id}
                onSelect={onSelectWell}
                onViewDetails={onOpenModal}
              />
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="animate-fade-in">
          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-tight dark:text-white">Step 2: Define Intervention Plan</h3>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-500 dark:text-slate-400">Use the <strong>AI Advisor</strong> to analyze the well's known problems and recommend the most effective intervention strategies based on historical case studies.</p>
          </div>
          <div className="mt-8 max-w-4xl mx-auto">
            <div id="ai-advisor-view">
              <div id="problem-selection">
                <h3 className="text-lg font-semibold text-center mb-4 dark:text-slate-200">What is the primary problem?</h3>
                <fieldset className="grid md:grid-cols-3 gap-4">
                  {PROBLEMS_DATA.map(prob => (
                    <div key={prob.id}>
                      <input type="radio" name="problem" id={prob.id} value={prob.id} className="sr-only" onChange={() => handleSelectProblem(prob.id)} checked={selectedProblemId === prob.id} />
                      <label htmlFor={prob.id} className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedProblemId === prob.id ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/50' : 'bg-white border-slate-300 hover:border-teal-400 dark:bg-slate-800 dark:border-slate-600 dark:hover:border-teal-500'}`}>
                        <span className="font-semibold dark:text-white">{prob.name}</span>
                      </label>
                    </div>
                  ))}
                </fieldset>
              </div>

              {selectedProblemId && (
                <div id="ai-recommendations" className="mt-8 animate-fade-in">
                   <h3 className="text-lg font-semibold text-center mb-4 mt-6 dark:text-slate-200">AI Recommendations</h3>
                   <div className="space-y-4">
                    {(AI_RECOMMENDATIONS_DATA[selectedProblemId] || []).map((rec, i) => {
                      const objective = OBJECTIVES_DATA.find(o => o.id === rec.objectiveId);
                      const isSelected = selectedRecommendation?.objectiveId === rec.objectiveId;
                      return (
                        <div key={i} onClick={() => handleSelectRecommendation(rec)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'bg-teal-50 border-teal-500 scale-105 dark:bg-teal-900/50' : 'bg-white border-slate-300 hover:border-teal-400 dark:bg-slate-800 dark:border-slate-600 dark:hover:border-teal-500'}`}>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-lg text-teal-700 dark:text-teal-400">{objective?.name}</h4>
                            <span className="text-sm font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded-full dark:bg-teal-900 dark:text-teal-200">{rec.confidence}% Confidence</span>
                          </div>
                          <p className="text-sm mt-1 text-slate-600 dark:text-slate-300"><strong>Projected Outcome:</strong> {rec.outcome}</p>
                          <p className="text-xs mt-2 text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: `<strong>Reasoning:</strong> ${rec.reason}` }}></p>
                        </div>
                      );
                    })}
                   </div>
                </div>
              )}
              <div className="mt-8 flex justify-center space-x-4">
                <button onClick={onReset} className="rounded-md bg-slate-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-slate-500">Back to Well Selection</button>
                <button onClick={handleGenerateClick} className="rounded-md bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-500 disabled:bg-slate-400" disabled={!selectedRecommendation}>Generate Plan</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 3 && selectedWell && generatedPlan && (
        <section className="animate-fade-in">
          <PlanReview 
            well={selectedWell} 
            plan={generatedPlan} 
          />
          <div className="mt-8 flex justify-center space-x-4">
              <button onClick={onReset} className="rounded-md bg-slate-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-slate-500">Start Over</button>
              <button onClick={onBeginOperation} className="rounded-md bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500">Begin Live Operation</button>
          </div>
        </section>
      )}
    </div>
  );
};

export default PlannerView;
