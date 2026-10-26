import React from 'react';
import { Bot, User, AlertOctagon } from 'lucide-react';
import { AssistantMessage } from '../../types/assistant';

interface ChatMessageProps {
  message: AssistantMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const isEmergency = message.isEmergencyAlert;

  return (
    <div
      className={`flex items-start gap-3 my-3 animate-fadeIn ${
        isBot ? 'justify-start' : 'justify-end'
      }`}
    >
      {isBot && (
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
            isEmergency
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-brand-forest text-white'
          }`}
        >
          {isEmergency ? <AlertOctagon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>
      )}

      <div
        className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 sm:px-5 py-3.5 shadow-subtle ${
          isEmergency
            ? 'bg-red-50 border-2 border-red-400 text-red-950'
            : isBot
            ? 'bg-white border border-brand-border text-brand-charcoal'
            : 'bg-brand-forest text-white'
        }`}
      >
        {/* Optional Attached Image Preview */}
        {message.imageUrl && (
          <div className="mb-3 rounded-lg overflow-hidden border border-brand-border/40 max-h-56">
            <img
              src={message.imageUrl}
              alt="Uploaded animal symptom"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Message Text with simple markdown linebreaks */}
        <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
          {message.text}
        </div>

        {/* Observation note from AI if present */}
        {message.imageObservation && (
          <div className="mt-2 text-xs italic opacity-85 border-t border-brand-border/30 pt-1.5">
            {message.imageObservation}
          </div>
        )}

        <div
          className={`mt-1.5 text-[10px] ${
            isBot ? 'text-brand-muted' : 'text-white/70'
          } text-right`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {!isBot && (
        <div className="w-9 h-9 rounded-full bg-brand-forestDark text-brand-sageLight flex items-center justify-center shrink-0 shadow-xs">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
