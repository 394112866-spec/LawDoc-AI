import React from 'react';
import { BrainCircuit, FileText, ShieldCheck, MessageSquareText, Home } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  
  const modules = [
    { id: 'home', label: '主页', icon: Home, desc: 'Legal Mind' },
    { id: 'legal-ai', label: 'LegalAI · 咨询', icon: MessageSquareText, desc: '智能法律咨询对话' },
    { id: 'legal-doc', label: 'LegalDoc · 文书', icon: FileText, desc: '起诉/答辩/申请书生成' },
    { id: 'legal-ctrct', label: 'LegalCtrct · 风控', icon: ShieldCheck, desc: '合同审查与风险分析' },
  ];

  return (
    <div className="w-[80px] lg:w-64 bg-[#0f172a] text-slate-300 flex flex-col h-full shadow-2xl no-print transition-all duration-300 z-50 flex-shrink-0">
      {/* Brand */}
      <div className="h-24 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800/50 cursor-pointer" onClick={() => setActiveTab('home')}>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-900/50">
          <BrainCircuit className="text-white" size={28} />
        </div>
        <div className="ml-3 hidden lg:block">
          <h1 className="text-xl font-bold text-white tracking-wide">Legal Mind</h1>
          <p className="text-xs text-slate-500 font-medium">AI 法律智能体</p>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 py-8 px-3 space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 hidden lg:block">Menu</div>
        {modules.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
              title={item.label}
            >
              <item.icon size={24} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`} />
              <div className="hidden lg:block text-left">
                <span className="block font-bold text-base">{item.label}</span>
                {item.id !== 'home' && <span className={`text-xs block mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>{item.desc}</span>}
              </div>
              {isActive && <div className="absolute right-0 top-0 h-full w-1 bg-white/30 rounded-l"></div>}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800/50 text-center lg:text-left">
        <div className="text-xs text-slate-600">
          <p className="hidden lg:block">© 2024 Legal Mind AI</p>
          <p className="hidden lg:block">Version 2.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;