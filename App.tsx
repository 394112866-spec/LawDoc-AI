import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LegalDoc from './components/LegalDoc';
import LegalAI from './components/LegalAI';
import LegalCtrct from './components/LegalCtrct';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('legal-doc');

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={activeModule} setActiveTab={setActiveModule} />
      <main className="flex-1 h-full overflow-hidden relative">
        {activeModule === 'legal-ai' && <LegalAI />}
        {activeModule === 'legal-doc' && <LegalDoc />}
        {activeModule === 'legal-ctrct' && <LegalCtrct />}
        {/* Fallback or Dashboard could go here if logic requires */}
      </main>
    </div>
  );
};

export default App;