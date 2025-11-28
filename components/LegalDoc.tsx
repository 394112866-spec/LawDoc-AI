import React, { useState, useEffect, useRef } from 'react';
import DynamicForm from './DynamicForm';
import DocumentPreview from './DocumentPreview';
import { TEMPLATES } from '../constants';
import { parseCaseDescription } from '../services/geminiService';
import { Template, FormField } from '../types';
import { 
  Download, Printer, Search, ArrowLeft, Plus, Trash2, 
  FileText, User, RefreshCcw, Landmark, Banknote, 
  CreditCard, Car, Wrench, TrendingUp, Shield, 
  Sparkles, Copy, Save, FileSpreadsheet, CheckSquare, 
  LayoutGrid, List
} from 'lucide-react';

// Icon Mapping
const iconMap: Record<string, React.ElementType> = {
  'user': User,
  'refresh-ccw': RefreshCcw,
  'landmark': Landmark,
  'banknote': Banknote,
  'credit-card': CreditCard,
  'car': Car,
  'wrench': Wrench,
  'trending-up': TrendingUp,
  'shield': Shield,
  'search': Search,
  'home': FileText, // Default
  'file-text': FileText
};

const LegalDoc: React.FC = () => {
  const [view, setView] = useState<'selection' | 'editor'>('selection');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Selection State
  const [activeGroup, setActiveGroup] = useState<string>('民事');
  const [docFilter, setDocFilter] = useState<'complaint' | 'answer'>('complaint'); // Sub-tab
  const [searchTerm, setSearchTerm] = useState('');

  // Editor State
  const [editorMode, setEditorMode] = useState<'single' | 'batch'>('single');
  const [singleData, setSingleData] = useState<Record<string, any>>({});
  const [batchData, setBatchData] = useState<Array<Record<string, any>>>([{}]); // Start with 1 empty row
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (selectedTemplate) {
      setSingleData(selectedTemplate.defaultContent || {});
      setBatchData([selectedTemplate.defaultContent || {}]);
    }
  }, [selectedTemplate]);

  // --- Helpers ---
  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || FileText;
    return <Icon size={24} />;
  };

  const filteredTemplates = TEMPLATES.filter(t => 
    t.group === activeGroup &&
    (t.type === 'application' ? true : t.type === docFilter) && // Applications show in Execution tab regardless of sub-filter usually, but let's keep logic simple
    t.name.includes(searchTerm)
  );

  // --- Batch Handlers ---
  const addRow = () => {
    setBatchData([...batchData, { ...selectedTemplate?.defaultContent }]);
  };

  const copyRow = (index: number) => {
    const newRow = { ...batchData[index] };
    const newData = [...batchData];
    newData.splice(index + 1, 0, newRow);
    setBatchData(newData);
  };

  const deleteRow = (index: number) => {
    if (batchData.length <= 1) return;
    const newData = batchData.filter((_, i) => i !== index);
    setBatchData(newData);
  };

  const updateBatchCell = (index: number, key: string, value: any) => {
    const newData = [...batchData];
    newData[index] = { ...newData[index], [key]: value };
    setBatchData(newData);
  };

  // --- Renderers ---

  const renderSelection = () => (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header / Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 pt-8 pb-0 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">文书生成</h1>
        
        {/* Top Tabs (Groups) */}
        <div className="flex gap-8 mb-6">
          {['民事', '行政', '刑事', '执行', '国家赔偿'].map(group => (
            <button
              key={group}
              onClick={() => { setActiveGroup(group); if(group==='执行') setDocFilter('application' as any); else setDocFilter('complaint'); }}
              className={`pb-3 px-1 text-base font-medium transition-all border-b-2 ${
                activeGroup === group 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Sub-Tabs & Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {activeGroup !== '执行' ? (
              <>
                <button 
                  onClick={() => setDocFilter('complaint')}
                  className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${docFilter === 'complaint' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  起诉状
                </button>
                <button 
                  onClick={() => setDocFilter('answer')}
                  className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${docFilter === 'answer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  答辩状
                </button>
              </>
            ) : (
              <span className="px-4 py-1.5 text-sm font-medium text-gray-900">申请书</span>
            )}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索模板名称..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredTemplates.map(t => (
            <div 
              key={t.id} 
              onClick={() => { setSelectedTemplate(t); setView('editor'); }}
              className="group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md p-6 cursor-pointer transition-all flex flex-col items-center text-center h-48 justify-center relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">新</div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {getIcon(t.icon)}
              </div>
              <h3 className="text-gray-800 font-medium text-base group-hover:text-blue-700">{t.name.replace(/民事|起诉状|答辩状|\(|\)/g, '')}</h3>
              <span className="text-xs text-gray-400 mt-2">{t.category}</span>
            </div>
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400">
              未找到相关模板
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEditorHeader = () => (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm z-20">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('selection')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>文书模板</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">{selectedTemplate?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
        <button 
          onClick={() => setEditorMode('single')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${editorMode === 'single' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <FileText size={14} /> 单项填写
        </button>
        <button 
          onClick={() => setEditorMode('batch')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${editorMode === 'batch' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <FileSpreadsheet size={14} /> 批量生成
        </button>
      </div>

      <div className="w-20"></div>{/* Spacer */}
    </div>
  );

  // --- BATCH VIEW ---
  const renderBatchEditor = () => {
    if (!selectedTemplate) return null;
    const fields = selectedTemplate.fields;

    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Batch Toolbar */}
        <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded hover:bg-purple-100 text-sm transition-colors">
                <Sparkles size={14} /> AI 录入
              </button>
              <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded hover:bg-gray-100 text-sm transition-colors">
                <Plus size={14} /> 新增一项
              </button>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none hover:text-gray-900">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                自动删除空白主体
              </label>
           </div>
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded text-sm">
                 <RefreshCcw size={14} /> 批量替换文本
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded hover:bg-blue-100 text-sm">
                 <Save size={14} /> 保存数据
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm text-sm font-medium">
                 <Download size={14} /> 全部下载
              </button>
           </div>
        </div>

        {/* Spreadsheet */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left whitespace-nowrap">
                 <thead className="bg-gray-50 text-gray-700 font-medium">
                   <tr>
                     <th className="w-16 p-3 border-b border-r border-gray-200 text-center sticky left-0 bg-gray-50 z-10">序号</th>
                     <th className="w-20 p-3 border-b border-r border-gray-200 text-center sticky left-16 bg-gray-50 z-10">操作</th>
                     {fields.map(f => (
                       <th key={f.key} className="p-3 border-b border-r border-gray-200 min-w-[150px]">{f.label}</th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {batchData.map((row, rowIndex) => (
                     <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors group">
                       <td className="p-3 border-r border-gray-200 text-center text-gray-400 sticky left-0 bg-white group-hover:bg-blue-50/30">{rowIndex + 1}</td>
                       <td className="p-2 border-r border-gray-200 text-center sticky left-16 bg-white group-hover:bg-blue-50/30">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => copyRow(rowIndex)} className="p-1 text-gray-400 hover:text-blue-600" title="复制"><Copy size={14} /></button>
                            <button onClick={() => deleteRow(rowIndex)} className="p-1 text-gray-400 hover:text-red-600" title="删除"><Trash2 size={14} /></button>
                          </div>
                       </td>
                       {fields.map(f => (
                         <td key={f.key} className="p-0 border-r border-gray-200">
                           {f.type === 'date' ? (
                             <input 
                               type="date" 
                               className="w-full h-full p-3 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none"
                               value={row[f.key] || ''}
                               onChange={e => updateBatchCell(rowIndex, f.key, e.target.value)}
                             />
                           ) : (
                             <input 
                               type="text" 
                               className="w-full h-full p-3 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none"
                               value={row[f.key] || ''}
                               placeholder={f.placeholder}
                               onChange={e => updateBatchCell(rowIndex, f.key, e.target.value)}
                             />
                           )}
                         </td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             
             {/* Add Row Footer */}
             <div 
               onClick={addRow}
               className="p-3 text-center text-gray-400 hover:text-blue-600 hover:bg-gray-50 cursor-pointer border-t border-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
             >
               <Plus size={16} /> 添加一行
             </div>
          </div>
        </div>
      </div>
    );
  };

  // --- SINGLE VIEW ---
  const renderSingleEditor = () => {
    if (!selectedTemplate) return null;
    return (
      <div className="flex flex-col lg:flex-row h-full overflow-hidden">
        <div className="w-full lg:w-5/12 h-full flex flex-col border-r border-gray-200 bg-white z-10">
           <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <DynamicForm 
                template={selectedTemplate} 
                formData={singleData} 
                onChange={(k, v) => setSingleData(p => ({...p, [k]: v}))} 
                onSmartFill={async (desc) => {
                  setIsThinking(true);
                  try {
                    const data = await parseCaseDescription(desc, selectedTemplate);
                    setSingleData(p => ({...p, ...data}));
                  } finally { setIsThinking(false); }
                }} 
                isThinking={isThinking} 
              />
           </div>
        </div>
        <div className="w-full lg:w-7/12 h-full flex flex-col bg-gray-100/50 relative">
           <div className="flex-1 overflow-y-auto p-8 flex justify-center">
              <DocumentPreview template={selectedTemplate} data={singleData} />
           </div>
        </div>
      </div>
    );
  };

  if (view === 'selection') return renderSelection();

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {renderEditorHeader()}
      <div className="flex-1 overflow-hidden relative">
        {editorMode === 'single' ? renderSingleEditor() : renderBatchEditor()}
      </div>
    </div>
  );
};

export default LegalDoc;