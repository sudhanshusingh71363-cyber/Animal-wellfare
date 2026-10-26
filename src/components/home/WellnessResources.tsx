import React, { useState } from 'react';
import { SEED_WELLNESS_RESOURCES } from '../../lib/seedData';
import { WellnessResource } from '../../types/database';
import { BookOpen, Clock, ShieldCheck, ArrowRight, X, ExternalLink } from 'lucide-react';

export const WellnessResources: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<WellnessResource | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Basic Health', 'Safety & Handling', 'Emergency Care', 'Wound Management', 'Nutrition & Care', 'Prevention & Community', 'Adoption'];

  const filtered = activeCategory === 'all'
    ? SEED_WELLNESS_RESOURCES
    : SEED_WELLNESS_RESOURCES.filter((r) => r.category === activeCategory);

  return (
    <section className="py-12 sm:py-16 bg-brand-beigeLight/30 border-y border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-forest bg-brand-sageLight px-3 py-1 rounded-full">
              Authoritative Guides
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-forestDark mt-2">
              Animal Wellness & Field Care
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
              Reviewed guidance from the World Small Animal Veterinary Association (WSAVA), AVMA, and Humane Society.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize shrink-0 transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-forest text-white shadow-xs'
                    : 'bg-white border border-brand-border text-brand-charcoal hover:bg-brand-sage/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <div
              key={res.id}
              onClick={() => setSelectedResource(res)}
              className="bg-white border border-brand-border rounded-2xl p-5 sm:p-6 shadow-card hover:border-brand-forest/40 hover:shadow-elevated transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-brand-forest bg-brand-sageLight px-2.5 py-0.5 rounded-full">
                    {res.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                    <Clock className="w-3 h-3" />
                    <span>{res.readTimeMinutes} min read</span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-charcoal group-hover:text-brand-forest transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-brand-muted mt-2 line-clamp-3 leading-relaxed">
                  {res.summary}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-forest font-semibold">
                <span className="flex items-center gap-1 text-[10px] text-brand-muted truncate max-w-[200px]">
                  <ShieldCheck className="w-3 h-3 text-brand-forest shrink-0" />
                  {res.authoritativeSource}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-brand-border overflow-hidden">
            <div className="p-6 border-b border-brand-border flex items-start justify-between bg-brand-offwhite">
              <div>
                <span className="text-[11px] font-bold text-brand-forest uppercase tracking-wider bg-brand-sageLight px-2.5 py-0.5 rounded-full">
                  {selectedResource.category}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-brand-charcoal mt-1.5">
                  {selectedResource.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-brand-muted">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-forest" />
                    {selectedResource.authoritativeSource}
                  </span>
                  <span>•</span>
                  <span>{selectedResource.readTimeMinutes} min read</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-brand-sage/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-brand-charcoal leading-relaxed whitespace-pre-line">
              {selectedResource.content}
            </div>

            <div className="p-4 border-t border-brand-border bg-brand-offwhite flex justify-end">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-5 py-2 rounded-xl bg-brand-forest text-white text-xs font-semibold hover:bg-brand-forestLight shadow-xs"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
