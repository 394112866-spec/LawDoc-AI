import React from 'react';
import { FileText, Files, Upload, Scale } from 'lucide-react';

interface SidebarProps {
  activeTab: 'single' | 'batch' | 'templates';
  setActiveTab: (tab: 'single' | 'batch' | 'templates') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'single', label: '文书生成', icon: FileText },
    { id: 'batch', label: '批量生成', icon: Files },
    { id: 'templates', label: '模板管理', icon: Upload },
  ] as const;

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl no-print">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <Scale className="text-blue-400" size={28} />
        <h1 className="text-xl font-bold tracking-tight">LawDoc AI</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded p-3">
          <p className="text-xs text-slate-400 mb-1">当前版本</p>
          <p className="text-sm font-semibold">v1.2.0 (Beta)</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
