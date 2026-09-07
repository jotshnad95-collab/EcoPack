import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../../store/projectStore';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  IndianRupee,
  DollarSign,
  TrendingDown,
  Info,
  Maximize2,
  RefreshCw
} from 'lucide-react';

export const EchoCopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    copilotMessages,
    sendCopilotMessage,
    activeDesign,
    product,
    currency
  } = useProject();

  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotOpen) {
      scrollToBottom();
    }
  }, [copilotMessages, isCopilotOpen]);

  if (!isCopilotOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setInputVal('');
    try {
      await sendCopilotMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              EchoCopilot
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                Active Context
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded in {product.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Configuration Pill Bar */}
      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-300 font-mono">
        <div>
          <span>Cost: </span>
          <strong className="text-emerald-400">
            {currency === 'INR' ? '₹' : '$'}{activeDesign.costBreakdown.totalCostPerPackage}
          </strong>
        </div>
        <div>
          <span>Prot: </span>
          <strong className="text-cyan-400">{activeDesign.protectionBreakdown.overallProtectionScore}/100</strong>
        </div>
        <div>
          <span>CO₂e: </span>
          <strong className="text-amber-400">{activeDesign.carbonBreakdown.totalCo2ePerPackageKg} kg</strong>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {copilotMessages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id || i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {!isUser && msg.badge && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 mb-1.5 pb-1 border-b border-slate-800">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{msg.badge}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>

              {/* Prompt suggestion chips */}
              {!isUser && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestedPrompts.map((chip, chipIdx) => (
                    <button
                      key={chipIdx}
                      onClick={() => handleSend(chip)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700/80 hover:border-emerald-500/50 transition flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 p-3 rounded-2xl border border-slate-800 max-w-[70%]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Analyzing calculations...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box & Quick Questions */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/70">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Ask anything about this packaging..."
            className="flex-1 glass-input px-3.5 py-2 text-xs focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isSending}
            className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-40 disabled:pointer-events-none transition shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-2">
          Deterministic engines calculate numbers. EchoCopilot interprets & recommends.
        </p>
      </div>
    </div>
  );
};
