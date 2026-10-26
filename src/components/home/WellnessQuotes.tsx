import React, { useState } from 'react';
import { SEED_WELLNESS_QUOTES } from '../../lib/seedData';
import { Quote, ChevronRight, Copy, Share2, Check, Sparkles } from 'lucide-react';

export const WellnessQuotes: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const quotes = SEED_WELLNESS_QUOTES;
  const currentQuote = quotes[currentIndex];

  const handleNextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handleCopyQuote = () => {
    const text = `"${currentQuote.quote}" — ${currentQuote.author} (PawCare)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareQuote = async () => {
    const text = `"${currentQuote.quote}" — ${currentQuote.author}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PawCare Compassion Quote',
          text,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        // Fallback to copy
        handleCopyQuote();
      }
    } else {
      handleCopyQuote();
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-brand-forest text-white relative overflow-hidden">
      {/* Subtle decorative background shapes */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-forestLight/40 blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-brand-forestDark/50 blur-2xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-sage text-xs font-semibold backdrop-blur-xs mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Compassion & Mindfulness</span>
        </div>

        {/* Quote Box */}
        <div className="bg-brand-forestDark/40 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-elevated">
          <Quote className="w-10 h-10 text-brand-sage/40 mx-auto mb-4" />

          <p className="font-heading font-extrabold text-xl sm:text-3xl lg:text-3xl leading-snug tracking-tight text-brand-offwhite max-w-2xl mx-auto transition-all">
            "{currentQuote.quote}"
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-brand-beige">
              — {currentQuote.author}
            </span>
            {currentQuote.context && (
              <span className="text-[11px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                {currentQuote.context}
              </span>
            )}
          </div>

          {/* Interactive Action Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleNextQuote}
              className="px-5 py-2.5 rounded-xl bg-white text-brand-forestDark hover:bg-brand-sage font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Next Quote</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyQuote}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-brand-sage" />
                  <span>Copy Quote</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareQuote}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {shared ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Shared!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-brand-sage" />
                  <span>Share Quote</span>
                </>
              )}
            </button>
          </div>

          {/* Indicator dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === i ? 'w-6 bg-brand-sage' : 'bg-white/20'
                }`}
                title={`Quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
