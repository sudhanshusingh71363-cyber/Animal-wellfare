import React, { useState } from 'react';
import {
  TriageResultData,
  TriageUrgency,
  ConversationState,
} from '../../types/assistant';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  PhoneCall,
  MapPin,
  FileText,
  Copy,
  Check,
  ShieldAlert,
  Info,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { ConversationSummary } from './ConversationSummary';

interface TriageResultProps {
  result: TriageResultData;
  state: ConversationState;
  onFindNearbyClinics: () => void;
  onRestart: () => void;
}

export const TriageResult: React.FC<TriageResultProps> = ({
  result,
  state,
  onFindNearbyClinics,
  onRestart,
}) => {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isEmergency = result.urgency === 'emergency';
  const isAssessment = result.urgency === 'veterinary_assessment';
  const isBasicCare = result.urgency === 'basic_care';

  const handleCopySummaryQuick = () => {
    const text = `PAWCARE FIRST-AID TRIAGE SUMMARY
Animal Type: ${result.animalType.toUpperCase()}
Category: ${result.concernCategory}
Urgency Level: ${result.urgencyTitle}
Warning Signs: ${result.emergencyIndicators.map((i) => i.title).join(', ') || 'None flagged'}
Safe Interim Care:
${result.safeInterimSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}
Critical Cautions:
${result.whatNotToDo.map((w, idx) => `* ${w}`).join('\n')}
Disclaimer: Preliminary observational triage. Not a confirmed diagnosis.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-5 sm:p-7 shadow-elevated my-6 animate-fadeIn">
      {/* Category Header Badge */}
      <div
        className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isEmergency
            ? 'bg-red-50 border-red-300 text-red-900'
            : isAssessment
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}
      >
        <div className="flex items-start gap-3">
          {isEmergency && (
            <AlertOctagon className="w-8 h-8 text-red-600 shrink-0 mt-0.5 animate-pulse" />
          )}
          {isAssessment && (
            <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
          )}
          {isBasicCare && (
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 ${
                isEmergency
                  ? 'bg-red-600 text-white'
                  : isAssessment
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isEmergency
                ? 'Category 1: Emergency'
                : isAssessment
                ? 'Category 2: Vet Assessment Advised'
                : 'Category 3: Basic Support & Watch'}
            </span>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-brand-charcoal">
              {result.urgencyTitle}
            </h2>
            <p className="text-xs sm:text-sm mt-0.5 opacity-90 text-brand-charcoal">
              {result.urgencySubtitle}
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          {isEmergency ? (
            <button
              onClick={onFindNearbyClinics}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>Find Emergency Vet Now</span>
            </button>
          ) : (
            <button
              onClick={onFindNearbyClinics}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-forest hover:bg-brand-forestLight text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>Locate Nearby Clinics</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Indicators Identified (if any) */}
      {result.emergencyIndicators.length > 0 && (
        <div className="mt-5 p-4 rounded-xl bg-red-50/70 border border-red-200">
          <h3 className="font-heading font-bold text-sm text-red-900 flex items-center gap-1.5 mb-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            Reported Critical Warning Signs
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-red-800">
            {result.emergencyIndicators.map((ind, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>
                  <strong>{ind.title}:</strong> {ind.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safe Immediate Steps */}
      <div className="mt-6">
        <h3 className="font-heading font-bold text-base text-brand-charcoal mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-forest text-white flex items-center justify-center text-xs">
            ✓
          </span>
          Safe Immediate Steps Right Now
        </h3>
        <ol className="space-y-2.5 text-xs sm:text-sm text-brand-charcoal">
          {result.safeInterimSteps.map((step, idx) => (
            <li
              key={idx}
              className="p-3 rounded-xl bg-brand-sageLight/60 border border-brand-sage/60 flex items-start gap-3"
            >
              <span className="font-bold text-brand-forest shrink-0 mt-0.5">
                {idx + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Strict "What NOT to Do" rules */}
      <div className="mt-6">
        <h3 className="font-heading font-bold text-base text-red-950 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
            ✕
          </span>
          Strictly Avoid (What NOT To Do)
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-brand-charcoal">
          {result.whatNotToDo.map((dont, idx) => (
            <li
              key={idx}
              className="p-3 rounded-xl bg-red-50/40 border border-red-100 flex items-start gap-2.5 text-red-950"
            >
              <span className="text-red-500 font-extrabold text-base leading-none">
                •
              </span>
              <span>{dont}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* When to escalate (Category 2 & 3) */}
      {!isEmergency && result.whenToEscalate.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-brand-beigeLight border border-brand-beige">
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-forest mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Watch for Immediate Escalation Signs
          </h4>
          <ul className="space-y-1.5 text-xs text-brand-muted">
            {result.whenToEscalate.map((esc, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-brand-forest font-bold">•</span>
                <span>{esc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Copy Summary & Clinical Print Bar */}
      <div className="mt-7 pt-5 border-t border-brand-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSummaryModal(true)}
            className="px-4 py-2 rounded-xl bg-brand-beige border border-brand-border text-brand-forestDark text-xs font-semibold hover:bg-brand-sageLight transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-brand-forest" />
            <span>View Full Vet Summary</span>
          </button>

          <button
            onClick={handleCopySummaryQuick}
            className="px-3.5 py-2 rounded-xl bg-white border border-brand-border text-brand-charcoal text-xs font-medium hover:bg-brand-offwhite transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-brand-muted" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={onRestart}
          className="text-xs text-brand-muted hover:text-brand-charcoal underline flex items-center gap-1 transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Assessment</span>
        </button>
      </div>

      {/* Disclaimer statement */}
      <div className="mt-4 text-[11px] text-brand-muted/80 leading-relaxed italic border-t border-brand-border/40 pt-3">
        {result.disclaimer}
      </div>

      {/* Modal for Shareable / Printable Clinical Summary */}
      {showSummaryModal && (
        <ConversationSummary
          result={result}
          state={state}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
    </div>
  );
};
