import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DynamicForm from './components/DynamicForm';
import DocumentPreview from './components/DocumentPreview';
import { TEMPLATES } from './constants';
import { parseCaseDescription } from './services/geminiService';
import { Template, FormField } from './types';
import { 
  Download, Printer, Plus, FileSpreadsheet, Upload, Loader2, 
  FileText, RotateCcw, Search, ArrowLeft, Sparkles, ChevronRight, LayoutTemplate 
} from 'lucide-react';

type ViewState = 'home' | 'selection' | 'editor' | 'batch' | 'templates_manage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES as unknown as Template[]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isThinking, setIsThinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when a new template is selected
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
      setFormData(prev => ({
        ...prev,
        ...filledData
      }));
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
        alert(`模板 "${newTemplate.name}" 导入成功！`);
      }, 1000);
    }
  };

  // --- Sub-Components for different views ---

  const Dashboard = () => (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col justify-center">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">LawDoc <span className="text-blue-600">AI</span></h1>
        <p className="text-xl text-slate-500">智能法律文书生成系统 · 专业 · 高效 · 规范</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          onClick={() => setCurrentView('selection')}
          className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer flex flex-col items-center text-center"
        >
          <div className="bg-blue-50 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">新建文书</h3>
          <p className="text-slate-500">选择模板，通过 AI 辅助快速生成起诉状、答辩状等法律文书。</p>
        </div>

        <div 
          onClick={() => setCurrentView('batch')}
          className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-100 transition-all cursor-pointer flex flex-col items-center text-center"
        >
          <div className="bg-green-50 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
            <FileSpreadsheet className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">批量生成</h3>
          <p className="text-slate-500">上传 Excel/CSV 数据文件，一键批量生成多份标准化文书。</p>
        </div>

        <div 
          onClick={() => setCurrentView('templates_manage')}
          className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-purple-100 transition-all cursor-pointer flex flex-col items-center text-center"
        >
          <div className="bg-purple-50 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
            <LayoutTemplate className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">模板管理</h3>
          <p className="text-slate-500">上传、编辑或删除自定义模板，扩展系统的文书支持能力。</p>
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
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="text-slate-600" />
              </button>
              <h2 className="text-2xl font-bold text-slate-800">选择文书模板</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="搜索模板名称..." 
                className="pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              全部
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(t => (
              <div 
                key={t.id}
                onClick={() => { setSelectedTemplate(t); setCurrentView('editor'); }}
                className="bg-white rounded-xl border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${t.type === 'complaint' ? 'bg-blue-500' : t.type === 'answer' ? 'bg-green-500' : 'bg-purple-500'}`} />
                <div className="mb-4 flex justify-between items-start">
                  <div className={`p-3 rounded-lg ${t.type === 'complaint' ? 'bg-blue-50 text-blue-600' : t.type === 'answer' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">{t.category}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">{t.name}</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {t.type === 'complaint' ? '适用于提起民事诉讼' : t.type === 'answer' ? '适用于民事案件答辩' : '适用于向法院申请调查'}
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  开始编辑 <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            ))}
            
            {/* Add New Card */}
            <div 
              onClick={handleUploadClick}
              className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 min-h-[200px]"
            >
              {isUploading ? <Loader2 className="animate-spin mb-2" /> : <Upload className="mb-2" size={32} />}
              <span className="font-medium">{isUploading ? "解析中..." : "导入新模板"}</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".json,.doc,.docx"
              />
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
        {/* Left: Form */}
        <div className="w-full lg:w-5/12 h-full flex flex-col border-r border-slate-200 bg-white shadow-xl z-20">
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('selection')}
                className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                title="返回模板选择"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="font-bold text-slate-800 truncate max-w-[200px]">{selectedTemplate.name}</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="清空表单"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <DynamicForm 
              template={selectedTemplate} 
              formData={formData} 
              onChange={handleFieldChange} 
              onSmartFill={handleSmartFill}
              isThinking={isThinking}
            />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-full lg:w-7/12 h-full flex flex-col relative bg-slate-100/50">
          <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm z-10">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <FileText size={16} />
              <span>打印预览 (A4)</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <Printer size={16} /> 
                <span>打印</span>
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all"
              >
                <Download size={16} /> 
                <span>下载 Word</span>
              </button>
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
            <div className="border-3 border-dashed border-slate-200 rounded-xl p-16 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-slate-700 mb-2">点击上传 Excel / CSV 文件</p>
              <p className="text-slate-500">支持批量导入案件信息，系统将自动生成多份文书压缩包</p>
            </div>
            <div className="mt-8 text-left bg-slate-50 p-6 rounded-lg">
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Sparkles size={16} className="text-yellow-500"/> 使用说明</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 text-sm">
                <li>请先下载 <span className="text-blue-600 font-medium cursor-pointer hover:underline">标准数据模板.csv</span></li>
                <li>按照模板列名填写案件信息，每行代表一份文书</li>
                <li>上传后系统将自动校验数据格式，并生成下载链接</li>
              </ul>
            </div>
          </div>
        </div>
     </div>
  );

  // --- Main Render ---
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={currentView} setActiveTab={setCurrentView} />
      <main className="flex-1 h-full overflow-hidden relative">
        {currentView === 'home' && <Dashboard />}
        {currentView === 'selection' && <TemplateSelection />}
        {currentView === 'editor' && <EditorView />}
        {currentView === 'batch' && <BatchView />}
        {currentView === 'templates_manage' && <TemplateSelection />} {/* Reuse for now */}
      </main>
    </div>
  );
};

export default App;
