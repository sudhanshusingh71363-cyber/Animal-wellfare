import React, { useState } from 'react';
import { SymptomQuestion as SymptomQuestionType } from '../../types/assistant';
import { HelpCircle, Check, ArrowRight } from 'lucide-react';

interface SymptomQuestionProps {
  question: SymptomQuestionType;
  onAnswer: (selectedIds: string[], selectedLabels: string[]) => void;
  disabled?: boolean;
}

export const SymptomQuestion: React.FC<SymptomQuestionProps> = ({
  question,
  onAnswer,
  disabled = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isMultiple = question.type === 'multiple_choice';

  const handleToggle = (choiceId: string) => {
    if (disabled) return;

    if (!isMultiple) {
      // Single choice -> immediate submit
      const choice = question.choices.find((c) => c.id === choiceId);
      if (choice) {
        onAnswer([choice.id], [choice.label]);
      }
      return;
    }

    // Multiple choice
    let updated: string[];
    if (choiceId === 'none' || choiceId === 'not_sure') {
      updated = [choiceId];
    } else {
      updated = selectedIds.filter((id) => id !== 'none' && id !== 'not_sure');
      if (updated.includes(choiceId)) {
        updated = updated.filter((id) => id !== choiceId);
      } else {
        updated.push(choiceId);
      }
    }
    setSelectedIds(updated);
  };

  const handleMultipleSubmit = () => {
    if (selectedIds.length === 0) return;
    const labels = question.choices
      .filter((c) => selectedIds.includes(c.id))
      .map((c) => c.label);
    onAnswer(selectedIds, labels);
  };

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-6 shadow-card my-4 transition-all">
      <div className="mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-forest">
          Question {question.order}
        </span>
        <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-charcoal mt-0.5 leading-snug">
          {question.text}
        </h3>
        {question.plainLanguageClarification && (
          <div className="flex items-start gap-1.5 mt-2 text-xs sm:text-sm text-brand-muted bg-brand-beigeLight p-2.5 rounded-lg border border-brand-beige">
            <HelpCircle className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
            <span>{question.plainLanguageClarification}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mt-4">
        {question.choices.map((choice) => {
          const isSelected = selectedIds.includes(choice.id);

          return (
            <button
              key={choice.id}
              type="button"
              disabled={disabled}
              onClick={() => handleToggle(choice.id)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-brand-forest bg-brand-sageLight text-brand-forestDark shadow-xs'
                  : 'border-brand-border bg-white text-brand-charcoal hover:border-brand-forest/60 hover:bg-brand-sage/20'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-${
                    isMultiple ? 'md' : 'full'
                  } border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-brand-forest border-brand-forest text-white'
                      : 'border-brand-border bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
                <span>{choice.label}</span>
              </div>

              {choice.isEmergencyFlag && (
                <span className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">
                  Critical Check
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isMultiple && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={disabled || selectedIds.length === 0}
            onClick={handleMultipleSubmit}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              selectedIds.length > 0 && !disabled
                ? 'bg-brand-forest text-white hover:bg-brand-forestLight shadow-subtle'
                : 'bg-brand-border text-brand-muted cursor-not-allowed'
            }`}
          >
            <span>Confirm & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
