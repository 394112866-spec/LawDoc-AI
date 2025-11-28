import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LegalDoc from './components/LegalDoc';
import LegalAI from './components/LegalAI';
import LegalCtrct from './components/LegalCtrct';
import Home from './components/Home';

const App: React.FC = () => {
  // Set default to 'home' to show the landing page first
  const [activeModule, setActiveModule] = useState<string>('home');

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={activeModule} setActiveTab={setActiveModule} />
      <main className="flex-1 h-full overflow-hidden relative">
        {activeModule === 'home' && <Home setActiveModule={setActiveModule} />}
        {activeModule === 'legal-ai' && <LegalAI />}
        {activeModule === 'legal-doc' && <LegalDoc />}
        {activeModule === 'legal-ctrct' && <LegalCtrct />}
      </main>
    </div>
  );
};

export default App;