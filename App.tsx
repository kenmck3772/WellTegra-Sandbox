
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, ViewName, Well, Objective, Procedure, LiveData } from './types';
import { WELL_DATA, OBJECTIVES_DATA, PROCEDURES_DATA } from './constants';

import WelcomeScreen from './components/WelcomeScreen';
import Header from './components/Header';
import HomeView from './views/HomeView';
import PlannerView from './views/PlannerView';
import PerformerVIew from './views/PerformerVIew';
import AnalyzerView from './views/AnalyzerView';
import AboutView from './views/AboutView';
import FAQView from './views/FAQView';
import WellHistoryModal from './components/shared/WellHistoryModal';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'home',
    isAuthenticated: false,
    theme: 'dark',
    selectedWell: null,
    selectedObjective: null,
    generatedPlan: null,
    simulationResult: null,
    lessonsLearned: [],
    modalWell: null,
  });

  useEffect(() => {
    document.body.className = appState.theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-800';
  }, [appState.theme]);

  const handleLogin = useCallback(() => {
    setAppState(prev => ({ ...prev, isAuthenticated: true }));
  }, []);

  const handleSetView = useCallback((view: ViewName) => {
    setAppState(prev => ({ ...prev, currentView: view }));
  }, []);
  
  const handleSetTheme = useCallback((theme: 'light' | 'dark') => {
    setAppState(prev => ({ ...prev, theme }));
  }, []);

  const handleSelectWell = useCallback((wellId: string) => {
    const well = WELL_DATA.find(w => w.id === wellId) || null;
    setAppState(prev => ({ ...prev, selectedWell: well }));
  }, []);

  const handleOpenModal = useCallback((wellId: string) => {
    const well = WELL_DATA.find(w => w.id === wellId) || null;
    setAppState(prev => ({ ...prev, modalWell: well }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setAppState(prev => ({ ...prev, modalWell: null }));
  }, []);
  
  const handleGeneratePlan = useCallback((objectiveId: string) => {
    const objective = OBJECTIVES_DATA.find(o => o.id === objectiveId) || null;
    const plan = PROCEDURES_DATA[objectiveId] || null;
    if (objective && plan) {
      setAppState(prev => ({
        ...prev,
        selectedObjective: objective,
        generatedPlan: plan,
      }));
      return true;
    }
    return false;
  }, []);

  const handleJobComplete = useCallback((finalState: LiveData, lessons: string[]) => {
    setAppState(prev => ({
      ...prev,
      simulationResult: finalState,
      lessonsLearned: [...prev.lessonsLearned, ...lessons]
    }));
    handleSetView('analyzer');
  }, [handleSetView]);
  
  const handleReset = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      currentView: 'planner',
      selectedWell: null,
      selectedObjective: null,
      generatedPlan: null,
      simulationResult: null,
      lessonsLearned: [],
    }));
  }, []);

  const renderView = () => {
    switch (appState.currentView) {
      case 'planner':
        return (
          <PlannerView
            selectedWell={appState.selectedWell}
            generatedPlan={appState.generatedPlan}
            onSelectWell={handleSelectWell}
            onGeneratePlan={handleGeneratePlan}
            onOpenModal={handleOpenModal}
            onBeginOperation={() => handleSetView('performer')}
            onReset={handleReset}
          />
        );
      case 'performer':
        return appState.selectedWell && appState.generatedPlan ? (
          <PerformerVIew
            well={appState.selectedWell}
            plan={appState.generatedPlan}
            theme={appState.theme}
            onJobComplete={handleJobComplete}
          />
        ) : <HomeView onStart={() => handleSetView('planner')} />;
      case 'analyzer':
        return appState.simulationResult && appState.selectedWell && appState.generatedPlan ? (
          <AnalyzerView 
            well={appState.selectedWell}
            plan={appState.generatedPlan}
            result={appState.simulationResult}
            lessonsLearned={appState.lessonsLearned}
            onPlanNewJob={handleReset}
          />
        ) : <HomeView onStart={() => handleSetView('planner')} />;
      case 'about':
        return <AboutView />;
      case 'faq':
        return <FAQView />;
      case 'home':
      default:
        return <HomeView onStart={() => handleSetView('planner')} />;
    }
  };

  if (!appState.isAuthenticated) {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${appState.theme}`}>
      <Header
        currentView={appState.currentView}
        theme={appState.theme}
        onSetView={handleSetView}
        onSetTheme={handleSetTheme}
        wellName={appState.selectedWell?.name}
        planName={appState.generatedPlan?.name}
      />
      <main className="flex-1 relative">
        <div className="absolute inset-0 bg-center bg-repeat" style={{backgroundImage: `url('https://welltegra.network/assets/watermark.png')`, backgroundSize: '350px', opacity: appState.theme === 'dark' ? 0.04 : 0.02, filter: appState.theme === 'dark' ? 'invert(1)' : 'none', pointerEvents: 'none'}}></div>
        <div className="relative z-10">
          {renderView()}
        </div>
      </main>
      {appState.modalWell && (
        <WellHistoryModal 
          well={appState.modalWell} 
          onClose={handleCloseModal} 
          theme={appState.theme}
        />
      )}
    </div>
  );
};

export default App;
