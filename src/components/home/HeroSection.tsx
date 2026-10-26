import React from 'react';
import { Bot, AlertCircle, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onHelpAnimal: () => void;
  onTalkAssistant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onHelpAnimal,
  onTalkAssistant,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 bg-gradient-to-b from-brand-offwhite via-brand-beigeLight/40 to-brand-offwhite border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sageLight border border-brand-sage text-brand-forestDark text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>24/7 AI First-Aid Guidance & Rescue Network</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-5xl text-brand-forestDark leading-tight tracking-tight">
              They Can’t Tell Us What’s Wrong. <br />
              <span className="text-brand-charcoal">
                We Can Help You Take the First Step.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-brand-muted max-w-xl leading-relaxed">
              Found a sick, injured, or helpless street animal? Get simple guidance, learn how to respond safely, and find veterinary help when needed.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onHelpAnimal}
                className="px-6 py-3.5 rounded-xl bg-brand-forest hover:bg-brand-forestLight text-white font-bold text-sm sm:text-base shadow-elevated transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Help an Animal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onTalkAssistant}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-brand-sageLight text-brand-forestDark border-2 border-brand-forest/20 font-bold text-sm sm:text-base shadow-subtle transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-5 h-5 text-brand-forest" />
                <span>Talk to PawCare Assistant</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-brand-border/60 grid grid-cols-3 gap-4 text-xs text-brand-charcoal">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Zero Medical Knowledge Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Deterministic Safety Rules</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-forest shrink-0" />
                <span>Verified 24/7 Vet Clinics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Compassionate Photograph */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white aspect-4/3 sm:aspect-5/4">
              <img
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80"
                alt="Compassionate volunteer gently caring for a stray street dog"
                className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-sage">
                  PawCare Compassion
                </p>
                <p className="text-sm font-bold mt-0.5">
                  "Every stray deserves safety, every wounded soul deserves care."
                </p>
              </div>
            </div>

            {/* Subtle floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-elevated border border-brand-border hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-forest text-white flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-charcoal">Community First-Aid</p>
                <p className="text-[11px] text-brand-muted">Simple steps save lives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
