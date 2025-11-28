import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DynamicForm from './components/DynamicForm';
import DocumentPreview from './components/DocumentPreview';
import { TEMPLATES } from './constants';
import { parseCaseDescription } from './services/geminiService';
import { DocumentType, Template } from './types';
import { Download, Printer, Plus, FileSpreadsheet, Upload, Loader2, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'templates'>('single');
  // Initialize templates from constant but keep them in state to allow additions
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isThinking, setIsThinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Ref for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Reset form data when template changes, but keep defaults
  useEffect(() => {
    setFormData(currentTemplate.defaultContent || {});
  }, [selectedTemplateId, currentTemplate]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSmartFill = async (description: string) => {
    setIsThinking(true);
    try {
      // Pass the *entire template* so AI knows available fields
      const filledData = await parseCaseDescription(description, currentTemplate);
      setFormData(prev => ({
        ...prev,
        ...filledData
      }));
    } catch (error) {
      alert("AI Fill Failed: Check API Key or Network.");
    } finally {
      setIsThinking(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Basic simulation of downloading content
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(formData, null, 2)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${currentTemplate.name}_data.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Template Upload Handlers
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate async processing/parsing of the uploaded file
      setTimeout(() => {
        const newTemplateId = `CUSTOM_${Date.now()}`;
        const newTemplate: Template = {
          id: newTemplateId as any, // Cast to avoid strict enum conflict for dynamic IDs
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          category: '自定义导入',
          type: 'complaint', // Default assumption, real app would parse this
          fields: [
            // Mock fields extracted from the "file"
            { key: 'plaintiffName', label: '原告姓名/名称', type: 'text', section: '当事人信息', width: 'half' },
            { key: 'defendantName', label: '被告姓名/名称', type: 'text', section: '当事人信息', width: 'half' },
            { key: 'facts', label: '事实与理由', type: 'textarea', section: '事实与理由', width: 'full' },
            { key: 'customField', label: '自定义解析字段', type: 'textarea', section: '其他信息', width: 'full', placeholder: '此处为从文档解析出的特定内容...' }
          ],
          defaultContent: {}
        };

        setTemplates(prev => [...prev, newTemplate]);
        setIsUploading(false);
        
        // Reset input so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Optional: Switch view or notify
        if (window.confirm(`模板 "${newTemplate.name}" 解析成功！是否立即前往生成文书？`)) {
          setSelectedTemplateId(newTemplateId);
          setActiveTab('single');
        }
      }, 1500); // 1.5s simulated delay
    }
  };

  // Render Views
  const renderSingleGen = () => (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Left: Input Area */}
      <div className="w-full lg:w-1/2 h-full flex flex-col border-r border-gray-200 bg-gray-50 no-print">
        <div className="p-6 border-b bg-white shadow-sm z-10">
          <label className="block text-sm font-medium text-gray-700 mb-2">选择文书类型</label>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
            ))}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <DynamicForm 
            template={currentTemplate} 
            formData={formData} 
            onChange={handleFieldChange} 
            onSmartFill={handleSmartFill}
            isThinking={isThinking}
          />
        </div>
      </div>

      {/* Right: Preview Area */}
      <div className="w-full lg:w-1/2 h-full bg-gray-200 flex flex-col relative">
        <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10 no-print">
          <span className="font-semibold text-gray-600">文档预览 (A4)</span>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              <Printer size={16} /> 打印/PDF
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              <Download size={16} /> 下载数据
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 flex justify-center scrollbar-thin print:p-0 print:overflow-visible">
          <DocumentPreview template={currentTemplate} data={formData} />
        </div>
      </div>
    </div>
  );

  const renderBatchGen = () => (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FileSpreadsheet className="text-green-600"/> 批量文书生成
      </h2>
      <div className="bg-white p-8 rounded-lg shadow border border-gray-200 text-center">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:bg-gray-50 transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg text-gray-600">点击上传 CSV / Excel 文件</p>
          <p className="mt-2 text-sm text-gray-500">支持批量导入案件信息，自动生成多份文书压缩包</p>
        </div>
        <div className="mt-8 text-left">
          <h3 className="font-bold text-gray-700 mb-2">使用说明：</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>请下载 <span className="text-blue-600 cursor-pointer hover:underline">标准模板.csv</span></li>
            <li>按照模板列名填写案件信息（原告、被告、案由等）</li>
            <li>上传后系统将自动校验数据格式</li>
            <li>生成完成后可一键下载 ZIP 包</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">模板管理</h2>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".json,.doc,.docx"
          />
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            {isUploading ? "解析中..." : "上传新模板"}
          </button>
        </div>
      </div>
      <div className="grid gap-4">
        {templates.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{t.name}</h3>
                <div className="flex gap-3 text-sm text-gray-500 mt-1">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{t.category}</span>
                  <span>{t.type === 'complaint' ? '起诉状' : '答辩状'}</span>
                  <span>{t.fields.length} 个字段</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedTemplateId(t.id);
                  setActiveTab('single');
                }}
                className="text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded font-medium transition-colors"
              >
                使用
              </button>
              <button className="text-sm text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded transition-colors">编辑</button>
              <button className="text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors">删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-full overflow-hidden bg-gray-100">
        {activeTab === 'single' && renderSingleGen()}
        {activeTab === 'batch' && renderBatchGen()}
        {activeTab === 'templates' && renderTemplates()}
      </main>
    </div>
  );
};

export default App;