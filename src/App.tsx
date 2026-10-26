import React from 'react';
import { useLearningStore } from './store/useLearningStore';
import { LandingPage } from './screens/LandingPage';
import { Dashboard } from './screens/Dashboard';
import { LabScreen } from './screens/LabScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { AlgorithmRaceScreen } from './screens/AlgorithmRaceScreen';
import { TopBar } from './components/layout/TopBar';

function App() {
  const { currentScreen } = useLearningStore();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0d0804', color: '#E5E4E2' }}>
      <TopBar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentScreen === 'landing' && <LandingPage />}
        {currentScreen === 'dashboard' && <Dashboard />}
        {(currentScreen === 'lab' || currentScreen === 'playground') && <LabScreen />}
        {currentScreen === 'results' && <ResultsScreen />}
        {currentScreen === 'race' && <AlgorithmRaceScreen />}
      </main>
    </div>
  );
}

export default App;
