import React from 'react';
import {
  AlertCircle,
  ShieldAlert,
  Wind,
  UtensilsCrossed,
  Skull,
  HelpCircle,
  ArrowRight,
  HeartPulse,
} from 'lucide-react';

interface QuickHelpCardsProps {
  onSelectConcern: (categoryId: string) => void;
}

export const QuickHelpCards: React.FC<QuickHelpCardsProps> = ({ onSelectConcern }) => {
  const quickCards = [
    {
      id: 'vomiting',
      title: 'Animal is vomiting or appears sick',
      subtitle: 'Nausea, foamy retching, yellow bile, lethargy',
      icon: AlertCircle,
      badge: 'Common Distress',
      color: 'hover:border-amber-400 group-hover:text-amber-800',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'injury',
      title: 'Animal is injured or bleeding',
      subtitle: 'Visible wounds, road accidents, limping, scrapes',
      icon: ShieldAlert,
      badge: 'Trauma Check',
      color: 'hover:border-red-400 group-hover:text-red-800',
      iconBg: 'bg-red-100 text-red-700',
    },
    {
      id: 'breathing',
      title: 'Weak, unconscious, or struggling to breathe',
      subtitle: 'Heavy gasping, blue/pale gums, collapsed, limp',
      icon: HeartPulse,
      badge: 'Critical Emergency',
      color: 'hover:border-red-500 group-hover:text-red-900',
      iconBg: 'bg-red-100 text-red-700',
    },
    {
      id: 'not_eating',
      title: 'Animal needs food or clean water',
      subtitle: 'Severely dehydrated, malnourished, refusal to eat',
      icon: UtensilsCrossed,
      badge: 'Safe Nutrition',
      color: 'hover:border-emerald-400 group-hover:text-emerald-800',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'poisoning',
      title: 'Appears poisoned or swallowed danger',
      subtitle: 'Rat poison, chemicals, foaming, seizures, lilies',
      icon: Skull,
      badge: 'High Toxicity',
      color: 'hover:border-purple-400 group-hover:text-purple-800',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'trapped',
      title: 'Animal is trapped or in immediate danger',
      subtitle: 'Stuck in drainage, wire tangle, height, road hazard',
      icon: HelpCircle,
      badge: 'Physical Hazard',
      color: 'hover:border-blue-400 group-hover:text-blue-800',
      iconBg: 'bg-blue-100 text-blue-700',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-forest bg-brand-sageLight px-3 py-1 rounded-full">
            Instant Guidance
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-forestDark mt-2.5">
            What Situation Are You Facing?
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-2">
            Click on the problem below to immediately launch the guided questionnaire and safety protocol.
          </p>
        </div>

        {/* 6 Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onSelectConcern(card.id)}
                className={`bg-white border border-brand-border rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all text-left flex flex-col justify-between group cursor-pointer ${card.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted bg-brand-offwhite border border-brand-border px-2.5 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base sm:text-lg text-brand-charcoal group-hover:text-brand-forest transition-colors leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-brand-border/60 flex items-center justify-between text-xs font-bold text-brand-forest group-hover:translate-x-1 transition-transform">
                  <span>Start Step-by-Step Triage</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
