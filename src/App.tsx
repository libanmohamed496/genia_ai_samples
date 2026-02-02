import { useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { AllDataView } from './components/AllDataView';
import { TreeNavView } from './components/TreeNavView';
import carsData from './data/cars.json';
import type { Paradigm, CarsData } from './types';
import './App.css';

const paradigmLabels: Record<Paradigm, string> = {
  'all-data': 'All Data',
  'tree-nav': 'Tree Nav',
  'full-chat': 'Full Chat',
};

const paradigms: Paradigm[] = ['all-data', 'tree-nav', 'full-chat'];

function App() {
  const [currentParadigm, setCurrentParadigm] = useState<Paradigm>('all-data');

  const cycleParadigm = () => {
    const currentIndex = paradigms.indexOf(currentParadigm);
    const nextIndex = (currentIndex + 1) % paradigms.length;
    setCurrentParadigm(paradigms[nextIndex]);
  };

  const data: CarsData = carsData;

  return (
    <div className="app">
      <button className="paradigm-toggle" onClick={cycleParadigm}>
        {paradigmLabels[currentParadigm]}
      </button>

      {currentParadigm === 'full-chat' ? (
        <div className="full-chat-layout">
          <ChatPanel fullWidth paradigm={currentParadigm} data={data} />
        </div>
      ) : (
        <div className="split-layout">
          <div className="data-panel">
            {currentParadigm === 'all-data' && <AllDataView data={data} />}
            {currentParadigm === 'tree-nav' && <TreeNavView data={data} />}
          </div>
          <div className="chat-panel-container">
            <ChatPanel paradigm={currentParadigm} data={data} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
