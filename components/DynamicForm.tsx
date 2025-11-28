import React, { useMemo } from 'react';
import { Template, FormField, GeneratedDocData } from '../types';
import { Wand2, Loader2, Send } from 'lucide-react';

interface DynamicFormProps {
  template: Template;
  formData: GeneratedDocData;
  onChange: (key: string, value: any) => void;
  onSmartFill: (description: string) => Promise<void>;
  isThinking: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ template, formData, onChange, onSmartFill, isThinking }) => {
  const [smartFillText, setSmartFillText] = React.useState("");

  const sections = useMemo(() => {
    const groups: Record<string, FormField[]> = {};
    template.fields.forEach(field => {
      const sec = field.section || '基本信息';
      if (!groups[sec]) {
        groups[sec] = [];
      }
      groups[sec].push(field);
    });
    return groups;
  }, [template]);

  return (
    <div className="space-y-8 pb-20">
      {/* AI Command Center */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-indigo-900 font-bold">
          <div className="bg-white p-1.5 rounded-md shadow-sm">
            <Wand2 size={16} className="text-indigo-600" />
          </div>
          <span>AI 案情分析</span>
        </div>
        <div className="relative">
          <textarea
            className="w-full text-sm p-4 pr-12 rounded-lg border border-indigo-200 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner resize-none transition-all"
            rows={3}
            placeholder="在此输入案情描述（支持语音转文字），例如：原告张三借给李四50万，约定利息..."
            value={smartFillText}
            onChange={(e) => setSmartFillText(e.target.value)}
          />
          <button
            onClick={() => onSmartFill(smartFillText)}
            disabled={!smartFillText || isThinking}
            className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-200"
            title="开始分析"
          >
            {isThinking ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-xs text-indigo-400 mt-2 ml-1">
           * AI 将自动提取案情中的关键要素并填充到下方表单
        </p>
      </div>

      {/* Form Sections */}
      {(Object.entries(sections) as [string, FormField[]][]).map(([sectionName, fields]) => (
        <div key={sectionName} className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
             <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
             <h3 className="text-lg font-bold text-slate-800">{sectionName}</h3>
          </div>
          
          <div className="grid grid-cols-6 gap-x-6 gap-y-6">
            {fields.map((field) => {
              const colSpan = field.width === 'full' ? 'col-span-6' : field.width === 'half' ? 'col-span-3' : 'col-span-2';
              
              return (
                <div key={field.key} className={colSpan}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                    {field.label}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      className="w-full rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all sm:text-sm p-3 text-slate-700"
                      rows={4}
                      placeholder={field.placeholder || "请输入..."}
                    />
                  ) : field.type === 'radio' ? (
                    <div className="flex flex-wrap gap-3">
                      {field.options?.map((opt) => (
                        <label key={opt} className={`inline-flex items-center px-4 py-2 rounded-lg border text-sm cursor-pointer transition-all ${formData[field.key] === opt ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                          <input
                            type="radio"
                            className="hidden"
                            name={field.key}
                            value={opt}
                            checked={formData[field.key] === opt}
                            onChange={(e) => onChange(field.key, e.target.value)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={field.type === 'currency' ? 'number' : field.type === 'checkbox' ? 'checkbox' : field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      className="w-full rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all sm:text-sm p-3 h-11 text-slate-700"
                      placeholder={field.placeholder || "请输入..."}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
