import React, { useState, useRef, useEffect } from 'react';
import { sendLegalChatMessage } from '../services/geminiService';
import { Send, User, Bot, Loader2, Eraser } from 'lucide-react';
import { ChatMessage } from '../types';

const LegalAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: '您好，我是 Legal Mind 法律智能助手。请问有什么法律问题可以帮您？', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // Format history for the service
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await sendLegalChatMessage(history, userMsg.content);
      
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm("确定清除对话记录吗？")) {
      setMessages([{ id: '1', role: 'model', content: '对话已重置。请问有什么新的法律问题？', timestamp: Date.now() }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-8 py-5 bg-white border-b border-slate-200 shadow-sm flex justify-between items-center z-10">
        <div>
           <h2 className="text-xl font-bold text-slate-800">LegalAI 法律咨询</h2>
           <p className="text-sm text-slate-500">基于大模型的智能法律问答</p>
        </div>
        <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="清除对话">
          <Eraser size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white text-slate-800 rounded-tr-none border border-slate-100' : 'bg-indigo-600 text-white rounded-tl-none'}`}>
                {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="min-h-[1em]">{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                 <Bot size={20} className="text-white" />
               </div>
               <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                 <Loader2 className="animate-spin text-indigo-600" size={20} />
                 <span className="ml-2 text-slate-500 text-sm">正在分析案情...</span>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 pr-16 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none resize-none shadow-inner transition-all"
            rows={3}
            placeholder="请输入您的法律问题..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">AI 回复仅供参考，不构成正式法律意见。</p>
      </div>
    </div>
  );
};

export default LegalAI;