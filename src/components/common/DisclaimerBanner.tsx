import React, { useState } from 'react';
import { AlertTriangle, X, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-brand-sageLight border-b border-brand-sage/60 px-4 py-2.5 text-xs sm:text-sm text-brand-forestDark">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-forest shrink-0" />
          <span>
            <strong>First-Aid & Triage Aid Only:</strong> PawCare provides compassionate preliminary guidance and is not a substitute for a licensed veterinary examination. In a severe crisis, always proceed directly to a veterinary hospital.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-brand-muted hover:text-brand-charcoal p-1 rounded-md transition-colors"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
