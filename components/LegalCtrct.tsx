import React, { useState } from 'react';
import { analyzeContractRisk } from '../services/geminiService';
import { Upload, AlertTriangle, FileCheck, Loader2, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { ContractAnalysisResult } from '../types';

const LegalCtrct: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [contractText, setContractText] = useState("");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState<ContractAnalysisResult | null>(null);

  // Simulate file reading (since we can't easily parse .doc/.pdf on frontend without heavy libs, we'll accept text paste or .txt files)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setContractText(text);
      };
      reader.readAsText(file); // Assuming .txt for simplicity in this demo, or user pastes text
    }
  };

  const handleAnalyze = async () => {
    if (!contractText) return;
    setStep('analyzing');
    try {
      const analysis = await analyzeContractRisk(contractText, requirements);
      setResult(analysis);
      setStep('result');
    } catch (error) {
      alert("分析失败，请重试");
      setStep('upload');
    }
  };

  const UploadView = () => (
    <div className="max-w-4xl mx-auto p-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">LegalCtrct 智能风控</h2>
        <p className="text-slate-500">上传合同文本，AI 自动识别风险条款并提供修改建议</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-8">
           <label className="block text-sm font-bold text-slate-700 mb-3">1. 输入合同内容</label>
           <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors relative">
             <textarea 
                className="w-full h-64 bg-transparent resize-none focus:outline-none text-sm font-mono text-slate-600"
                placeholder="在此粘贴合同文本，或点击下方上传 .txt 文件..."
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
             />
             <div className="absolute bottom-4 right-4">
                <input type="file" id="contractUpload" className="hidden" accept=".txt,.md" onChange={handleFileChange} />
                <label htmlFor="contractUpload" className="cursor-pointer flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                   <Upload size={14} /> 从文件导入
                </label>
             </div>
           </div>
        </div>

        <div className="mb-8">
           <label className="block text-sm font-bold text-slate-700 mb-3">2. 审查重点 (可选)</label>
           <input 
             type="text" 
             className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
             placeholder="例如：重点审查违约责任、知识产权条款、竞业限制..."
             value={requirements}
             onChange={(e) => setRequirements(e.target.value)}
           />
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={!contractText}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          开始审查 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const ResultView = () => {
    if (!result) return null;
    return (
      <div className="flex h-full">
        {/* Left: Original Text (Read Only) */}
        <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto hidden lg:block">
           <h3 className="font-bold text-slate-700 mb-4">合同原文</h3>
           <pre className="whitespace-pre-wrap text-xs text-slate-600 font-mono leading-relaxed">{contractText}</pre>
        </div>

        {/* Right: Report */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
           <div className="max-w-3xl mx-auto">
              <button onClick={() => setStep('upload')} className="text-sm text-slate-400 hover:text-indigo-600 mb-6 flex items-center gap-1">
                 <ArrowRight size={14} className="rotate-180"/> 返回重新审查
              </button>
              
              <div className="mb-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                 <div className="flex items-center gap-3 mb-2">
                    <FileCheck className="text-indigo-600" size={24} />
                    <h2 className="text-2xl font-bold text-indigo-900">审查报告摘要</h2>
                 </div>
                 <p className="text-indigo-800 leading-relaxed">{result.summary}</p>
                 <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-bold text-indigo-900">风险等级：</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${result.riskLevel === 'high' ? 'bg-red-100 text-red-600' : result.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {result.riskLevel === 'high' ? '高风险' : result.riskLevel === 'medium' ? '中等风险' : '低风险'}
                    </span>
                 </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldAlert className="text-red-500"/> 风险点与建议
              </h3>
              
              <div className="space-y-6">
                 {result.risks.map((risk, idx) => (
                   <div key={idx} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                         <div className="flex-shrink-0 w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-500 font-bold text-sm">
                           {idx + 1}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-800 mb-1">{risk.issue}</h4>
                            <p className="text-sm text-slate-500 mb-3 bg-slate-50 p-2 rounded border border-slate-100 italic">"{risk.clause}"</p>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-sm text-green-800">
                               <span className="font-bold mr-1">建议修改：</span> {risk.suggestion}
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              {result.missingClauses.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-500"/> 缺失条款提醒
                  </h3>
                  <ul className="space-y-2">
                    {result.missingClauses.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                         <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-slate-50">
      {step === 'upload' && <UploadView />}
      {step === 'analyzing' && (
        <div className="h-full flex flex-col items-center justify-center">
           <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
           <h3 className="text-xl font-bold text-slate-800">AI 正在深度分析合同...</h3>
           <p className="text-slate-500">正在识别潜在风险点与合规漏洞</p>
        </div>
      )}
      {step === 'result' && <ResultView />}
    </div>
  );
};

export default LegalCtrct;