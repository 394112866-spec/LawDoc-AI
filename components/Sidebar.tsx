import React from 'react';
import { Home, LayoutGrid, Scale, Files, Settings, FileText, Upload } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  // Mapping view states to visual menu items
  const menuItems = [
    { id: 'home', label: '工作台', icon: Home },
    { id: 'selection', label: '新建文书', icon: FileText },
    { id: 'batch', label: '批量生成', icon: Files },
    { id: 'templates_manage', label: '模板库', icon: LayoutGrid },
  ];

  return (
    <div className="w-[80px] lg:w-64 bg-[#0f172a] text-slate-300 flex flex-col h-full shadow-2xl no-print transition-all duration-300 z-50">
      {/* Brand */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
          <Scale className="text-white" size={24} />
        </div>
        <span className="ml-3 text-lg font-bold text-white hidden lg:block tracking-wide">LawDoc AI</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'selection' && activeTab === 'editor');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
              title={item.label}
            >
              <item.icon size={22} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
              <span className={`font-medium hidden lg:block`}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400">
          <Settings size={22} />
          <span className="font-medium hidden lg:block">系统设置</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
