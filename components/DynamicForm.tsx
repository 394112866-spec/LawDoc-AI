import React, { useMemo } from 'react';
import { Template, FormField, GeneratedDocData } from '../types';
import { Wand2, Loader2 } from 'lucide-react';

interface DynamicFormProps {
  template: Template;
  formData: GeneratedDocData;
  onChange: (key: string, value: any) => void;
  onSmartFill: (description: string) => Promise<void>;
  isThinking: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ template, formData, onChange, onSmartFill, isThinking }) => {
  const [smartFillText, setSmartFillText] = React.useState("");

  // Group fields by section
  const sections = useMemo(() => {
    const groups: Record<string, FormField[]> = {};
    template.fields.forEach(field => {
      if (!groups[field.section]) {
        groups[field.section] = [];
      }
      groups[field.section].push(field);
    });
    return groups;
  }, [template]);

  return (
    <div className="space-y-8 pb-20">
      {/* Smart Fill Section */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2 text-indigo-800 font-semibold">
          <Wand2 size={18} />
          <span>AI 智能填充</span>
        </div>
        <textarea
          className="w-full text-sm p-3 rounded border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          rows={3}
          placeholder="请输入案情描述，例如：原告张三与被告李四于2023年1月1日签订借款合同，借款50万元，李四至今未还..."
          value={smartFillText}
          onChange={(e) => setSmartFillText(e.target.value)}
        />
        <button
          onClick={() => onSmartFill(smartFillText)}
          disabled={!smartFillText || isThinking}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
        >
          {isThinking ? <Loader2 className="animate-spin" size={14} /> : null}
          {isThinking ? "分析中..." : "一键生成填充"}
        </button>
      </div>

      {Object.entries(sections).map(([sectionName, fields]) => (
        <div key={sectionName} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            {sectionName}
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {fields.map((field) => {
              const colSpan = field.width === 'full' ? 'col-span-6' : field.width === 'half' ? 'col-span-3' : 'col-span-2';
              
              return (
                <div key={field.key} className={colSpan}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      rows={4}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === 'radio' ? (
                    <div className="flex gap-4 mt-2">
                      {field.options?.map((opt) => (
                        <label key={opt} className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-blue-600"
                            name={field.key}
                            value={opt}
                            checked={formData[field.key] === opt}
                            onChange={(e) => onChange(field.key, e.target.value)}
                          />
                          <span className="ml-2 text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={field.type === 'currency' ? 'number' : field.type === 'checkbox' ? 'checkbox' : field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border h-10"
                      placeholder={field.placeholder}
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