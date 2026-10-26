import React from 'react';
import { Heart, ShieldCheck, PhoneCall, AlertTriangle, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-brand-charcoal text-brand-offwhite border-t border-brand-border/20 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Central Principle */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-forest flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                PawCare
              </span>
            </div>
            <p className="text-xs text-brand-offwhite/80 leading-relaxed italic">
              "When an animal cannot ask for help, PawCare helps people take the next safe step."
            </p>
            <p className="text-xs text-brand-offwhite/60 leading-relaxed">
              Dedicated to street animal first-aid, medical triage, community feeding, and prompt veterinary connection.
            </p>
          </div>

          {/* Col 2: Quick Assistance */}
          <div>
            <h4 className="font-heading font-bold text-sm tracking-wider text-brand-beige uppercase mb-3">
              Emergency Guidance
            </h4>
            <ul className="space-y-2 text-xs text-brand-offwhite/75">
              <li>
                <button
                  onClick={() => setCurrentTab('assistant')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Symptom Guidance Chatbot</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('clinics')}
                  className="hover:text-white transition-colors"
                >
                  Find 24/7 Veterinary Clinics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('report')}
                  className="hover:text-white transition-colors"
                >
                  Report an Animal in Distress
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('track')}
                  className="hover:text-white transition-colors"
                >
                  Track Existing Rescue Report
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Reliable Guides */}
          <div>
            <h4 className="font-heading font-bold text-sm tracking-wider text-brand-beige uppercase mb-3">
              Veterinary Guides
            </h4>
            <ul className="space-y-2 text-xs text-brand-offwhite/75">
              <li>
                <button
                  onClick={() => setCurrentTab('resources')}
                  className="hover:text-white transition-colors"
                >
                  Recognizing Signs of Sickness
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('resources')}
                  className="hover:text-white transition-colors"
                >
                  Approaching Frightened Animals
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('resources')}
                  className="hover:text-white transition-colors"
                >
                  Summer Heatstroke First-Aid
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('resources')}
                  className="hover:text-white transition-colors"
                >
                  Wound & Maggot Safety Protocol
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('resources')}
                  className="hover:text-white transition-colors"
                >
                  Rabies & Sterilization (ABC)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Medical Disclaimer & Transparency */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm tracking-wider text-brand-beige uppercase mb-1">
              Safety & Ethics
            </h4>
            <div className="bg-brand-charcoal/80 border border-brand-offwhite/10 rounded-lg p-3 text-[11px] text-brand-offwhite/70 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Not a Veterinary Replacement</span>
              </div>
              <p>
                PawCare does not diagnose medical conditions. Always consult a certified veterinarian before administering any substance.
              </p>
            </div>
            <div className="text-[11px] text-brand-offwhite/50 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Backend status: {isSupabaseConfigured ? 'Supabase Connected' : 'Local Persistent Storage Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-offwhite/10 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-offwhite/50 gap-4">
          <p>© {new Date().getFullYear()} PawCare Platform. All rights reserved. Open welfare initiative.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentTab('admin')} className="hover:text-brand-offwhite">
              Admin Portal
            </button>
            <span>•</span>
            <span className="text-brand-offwhite/40">Privacy Policy & Safe Rescue Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
