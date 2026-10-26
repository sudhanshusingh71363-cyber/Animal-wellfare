import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface FloatingAssistantButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({
  onClick,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-brand-forest text-white shadow-elevated hover:bg-brand-forestLight transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Ask PawCare First-Aid Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
        </div>
        <div className="text-left">
          <div className="text-xs font-bold leading-tight flex items-center gap-1">
            <span>PawCare Assistant</span>
            <Sparkles className="w-3 h-3 text-brand-sage fill-brand-sage" />
          </div>
          <div className="text-[10px] text-brand-sageLight opacity-90 leading-none">
            Get instant first-aid triage
          </div>
        </div>
      </button>
    </div>
  );
};
