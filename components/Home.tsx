import React from 'react';
import { BrainCircuit, FileText, ShieldCheck, MessageSquareText, ArrowRight } from 'lucide-react';

interface HomeProps {
  setActiveModule: (module: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveModule }) => {
  return (
    <div className="h-full w-full bg-slate-50 overflow-y-auto fade-in">
      {/* Hero Section */}
      <div className="relative bg-[#0f172a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 shadow-lg border border-white/10">
            <BrainCircuit size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Legal Mind
          </h1>
          <p className="text-xl md:text-3xl font-light text-slate-300 mb-12 tracking-widest">
            开启法律AI新纪元
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setActiveModule('legal-ai')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 group"
            >
              立即开始咨询 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            <button 
              onClick={() => setActiveModule('legal-doc')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
            >
              生成法律文书
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-16">全方位的智能法律服务</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: LegalAI */}
          <div 
            onClick={() => setActiveModule('legal-ai')}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <MessageSquareText size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">LegalAI 咨询</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                基于大模型的智能法律顾问，为您提供7x24小时的专业法律咨询服务，解答各类法律疑问。
              </p>
              <span className="text-indigo-600 font-bold flex items-center gap-1 text-sm group-hover:translate-x-2 transition-transform">
                进入咨询 <ArrowRight size={16} />
              </span>
            </div>
          </div>

          {/* Card 2: LegalDoc */}
          <div 
            onClick={() => setActiveModule('legal-doc')}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">LegalDoc 文书</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                自动化法律文书生成引擎，覆盖起诉状、答辩状、申请书等多种类型，支持一键批量生成。
              </p>
              <span className="text-blue-600 font-bold flex items-center gap-1 text-sm group-hover:translate-x-2 transition-transform">
                开始生成 <ArrowRight size={16} />
              </span>
            </div>
          </div>

          {/* Card 3: LegalCtrct */}
          <div 
            onClick={() => setActiveModule('legal-ctrct')}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">LegalCtrct 风控</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                智能合同审查与风险控制系统，自动识别合同漏洞与法律风险，并提供专业的修改建议。
              </p>
              <span className="text-emerald-600 font-bold flex items-center gap-1 text-sm group-hover:translate-x-2 transition-transform">
                智能审查 <ArrowRight size={16} />
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;