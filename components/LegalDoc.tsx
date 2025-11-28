import React, { useState, useRef, useEffect } from 'react';
import DynamicForm from './DynamicForm';
import DocumentPreview from './DocumentPreview';
import { TEMPLATES } from '../constants';
import { parseCaseDescription } from '../services/geminiService';
import { Template, FormField } from '../types';
import { Download, Printer, Plus, FileSpreadsheet, Upload, Loader2, FileText, RotateCcw, Search, ArrowLeft, Sparkles, ChevronRight, LayoutTemplate } from 'lucide-react';

// This component encapsulates the entire previous App.tsx logic
const LegalDoc: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'selection' | 'editor' | 'batch' | 'templates_manage'>('home');
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES as unknown as Template[]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isThinking, setIsThinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTemplate) {
      setFormData(selectedTemplate.defaultContent || {});
    }
  }, [selectedTemplate]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (window.confirm("确定要清空所有已填信息吗？")) {
      setFormData(selectedTemplate?.defaultContent || {});
    }
  };

  const handleSmartFill = async (description: string) => {
    if (!selectedTemplate) return;
    setIsThinking(true);
    try {
      const filledData = await parseCaseDescription(description, selectedTemplate);
      setFormData(prev => ({ ...prev, ...filledData }));
    } catch (error) {
      alert("AI 分析失败，请检查网络或 API Key。");
    } finally {
      setIsThinking(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const docElement = document.querySelector('.legal-document-container');
    if (!docElement) {
      alert("无法找到文档内容，请确保预览区域可见。");
      return;
    }
    const content = docElement.outerHTML;
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${selectedTemplate?.name}</title>
        <style>
          body { font-family: 'SimSun', 'Songti SC', serif; font-size: 12pt; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          td { border: 1px solid black; padding: 10px; vertical-align: top; }
          h1 { text-align: center; font-size: 24pt; margin-bottom: 30px; font-family: 'SimHei'; }
          p { line-height: 1.8; margin: 5px 0; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .indent-8 { text-indent: 2em; }
        </style>
      </head>
      <body>
    `;
    const footer = "</body></html>";
    const html = header + content + footer;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = `${selectedTemplate?.name || 'document'}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        const fileName = file.name;
        const newTemplateId = `CUSTOM_${Date.now()}`;
        let docType: 'complaint' | 'answer' | 'application' = 'complaint';
        let category = '自定义导入';
        let fields: FormField[] = [];
        
        // Simple detection logic (same as before)
        if (fileName.includes("调查") || fileName.includes("申请")) {
          docType = 'application';
          category = '申请/非诉';
          fields = [
            { key: 'clientName', label: '当事人姓名', type: 'text', section: '当事人信息', width: 'half' },
            { key: 'clientAddress', label: '当事人住址', type: 'text', section: '当事人信息', width: 'full' },
            { key: 'lawyer1Name', label: '申请人(律师)姓名', type: 'text', section: '申请人信息', width: 'half' },
            { key: 'targetCompany', label: '调查对象(银行/公司)', type: 'text', section: '调查对象信息', width: 'full' },
            { key: 'executeeName', label: '被执行人姓名', type: 'text', section: '调查对象信息', width: 'half' },
            { key: 'requestContent', label: '申请事项', type: 'textarea', section: '申请事项', width: 'full' },
            { key: 'facts', label: '事实与理由', type: 'textarea', section: '事实与理由', width: 'full' },
            { key: 'courtName', label: '致送法院', type: 'text', section: '致送法院', width: 'full' },
            { key: 'submitDate', label: '提交日期', type: 'date', section: '致送法院', width: 'half' }
          ];
        } else {
          fields = [
            { key: 'plaintiffName', label: '原告姓名/名称', type: 'text', section: '当事人信息', width: 'half' },
            { key: 'defendantName', label: '被告姓名/名称', type: 'text', section: '当事人信息', width: 'half' },
            { key: 'claims', label: '诉讼请求', type: 'textarea', section: '诉讼请求', width: 'full' },
            { key: 'facts', label: '事实与理由', type: 'textarea', section: '事实与理由', width: 'full' },
            { key: 'courtName', label: '致送法院', type: 'text', section: '致送法院', width: 'full' },
            { key: 'submitDate', label: '提交日期', type: 'date', section: '致送法院', width: 'half' }
          ];
        }

        const newTemplate: Template = {
          id: newTemplateId,
          name: fileName.replace(/\.[^/.]+$/, ""), 
          category: category,
          type: docType,
          fields: fields,
          defaultContent: {}
        };
        setTemplates(prev => [...prev, newTemplate]);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (window.confirm(`模板 "${newTemplate.name}" 导入成功！\n是否立即使用？`)) {
          setSelectedTemplate(newTemplate);
          setCurrentView('editor');
        }
      }, 1000);
    }
  };

  // --- Views ---

  const Dashboard = () => (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col justify-center fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">LegalDoc <span className="text-indigo-600">Gen</span></h1>
        <p className="text-lg text-slate-500">专业的法律文书自动化生成引擎</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div onClick={() => setCurrentView('selection')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col items-center text-center group">
          <div className="bg-indigo-50 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">新建文书</h3>
          <p className="text-slate-500 text-sm">选择标准模板，AI 辅助快速起草</p>
        </div>
        <div onClick={() => setCurrentView('batch')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer flex flex-col items-center text-center group">
          <div className="bg-emerald-50 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">批量生成</h3>
          <p className="text-slate-500 text-sm">导入 Excel 数据，批量产出文书</p>
        </div>
        <div onClick={() => setCurrentView('templates_manage')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer flex flex-col items-center text-center group">
          <div className="bg-purple-50 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <LayoutTemplate className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">模板管理</h3>
          <p className="text-slate-500 text-sm">上传自定义模板，管理常用格式</p>
        </div>
      </div>
    </div>
  );

  const TemplateSelection = () => {
    const categories = Array.from(new Set(templates.map(t => t.category)));
    const filteredTemplates = templates.filter(t => 
      (filterCategory === 'all' || t.category === filterCategory) &&
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="text-slate-600" /></button>
              <h2 className="text-2xl font-bold text-slate-800">模板库</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="搜索模板..." className="pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:ring-2 focus:ring-indigo-500 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setFilterCategory('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>全部</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredTemplates.map(t => (
              <div key={t.id} onClick={() => { setSelectedTemplate(t); setCurrentView('editor'); }} className="bg-white rounded-xl border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all group relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${t.type === 'complaint' ? 'bg-blue-500' : t.type === 'answer' ? 'bg-green-500' : 'bg-purple-500'}`} />
                <div className="mb-4 flex justify-between items-start">
                  <div className={`p-3 rounded-lg ${t.type === 'complaint' ? 'bg-blue-50 text-blue-600' : t.type === 'answer' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}><FileText size={24} /></div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">{t.category}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{t.name}</h3>
                <div className="flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-4">立即生成 <ChevronRight size={16} className="ml-1" /></div>
              </div>
            ))}
            <div onClick={handleUploadClick} className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 min-h-[200px]">
              {isUploading ? <Loader2 className="animate-spin mb-2" /> : <Upload className="mb-2" size={32} />}
              <span className="font-medium">{isUploading ? "解析中..." : "导入新模板"}</span>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json,.doc,.docx" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditorView = () => {
    if (!selectedTemplate) return null;
    return (
      <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100">
        <div className="w-full lg:w-5/12 h-full flex flex-col border-r border-slate-200 bg-white shadow-xl z-20">
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('selection')} className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} /></button>
              <h2 className="font-bold text-slate-800 truncate max-w-[200px]">{selectedTemplate.name}</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={handleReset} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="清空"><RotateCcw size={18} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <DynamicForm template={selectedTemplate} formData={formData} onChange={handleFieldChange} onSmartFill={handleSmartFill} isThinking={isThinking} />
          </div>
        </div>
        <div className="w-full lg:w-7/12 h-full flex flex-col relative bg-slate-100/50">
          <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm z-10">
            <div className="flex items-center gap-2 text-slate-500 text-sm"><FileText size={16} /><span>A4 预览模式</span></div>
            <div className="flex gap-3">
              <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm"><Printer size={16} /><span>打印</span></button>
              <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-md"><Download size={16} /><span>下载 Word</span></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 md:p-12 flex justify-center scrollbar-thin">
            <DocumentPreview template={selectedTemplate} data={formData} />
          </div>
        </div>
      </div>
    );
  };

  const BatchView = () => (
     <div className="flex flex-col h-full">
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-4">
           <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="text-slate-600"/></button>
           <h2 className="text-xl font-bold text-slate-800">批量生成</h2>
        </div>
        <div className="flex-1 p-10 bg-slate-50 flex items-center justify-center">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center max-w-2xl w-full">
            <div className="border-3 border-dashed border-slate-200 rounded-xl p-16 hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer group">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-10 w-10 text-indigo-600" />
              </div>
              <p className="text-xl font-bold text-slate-700 mb-2">点击上传 Excel / CSV 文件</p>
              <p className="text-slate-500">支持批量导入案件信息，系统将自动生成多份文书压缩包</p>
            </div>
          </div>
        </div>
     </div>
  );

  return (
    <div className="h-full w-full bg-slate-50">
        {currentView === 'home' && <Dashboard />}
        {(currentView === 'selection' || currentView === 'templates_manage') && <TemplateSelection />}
        {currentView === 'editor' && <EditorView />}
        {currentView === 'batch' && <BatchView />}
    </div>
  );
};

export default LegalDoc;