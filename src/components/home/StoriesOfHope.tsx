import React, { useState } from 'react';
import { SEED_SUCCESS_STORIES } from '../../lib/seedData';
import { SuccessStory } from '../../types/database';
import { Heart, Calendar, MapPin, CheckCircle, Info, X } from 'lucide-react';

export const StoriesOfHope: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  return (
    <section className="py-12 sm:py-16 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-forest bg-brand-sageLight px-3 py-1 rounded-full">
            Impact & Recovery
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-forestDark mt-2">
            Stories of Hope
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-2">
            Every recovery begins when an ordinary citizen pauses to take the first safe step.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_SUCCESS_STORIES.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:border-brand-forest/40 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Image Banner */}
                {story.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden bg-brand-beige">
                    <img
                      src={story.imageUrl}
                      alt={story.animalName}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    {story.isDevelopmentSample && (
                      <span className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                        Development Sample Case
                      </span>
                    )}
                    <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-brand-forestDark text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                      {story.animalName} ({story.animalType})
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-brand-charcoal group-hover:text-brand-forest transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-brand-muted mt-2 line-clamp-3 leading-relaxed">
                    {story.story}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-brand-border/40 mt-3 flex items-center justify-between text-[11px] text-brand-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-forest shrink-0" />
                  <span className="truncate max-w-[170px]">{story.rescueLocation}</span>
                </span>
                <span className="text-brand-forest font-semibold">Read Full Story →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-brand-border overflow-hidden">
            {selectedStory.imageUrl && (
              <div className="relative h-56 w-full">
                <img
                  src={selectedStory.imageUrl}
                  alt={selectedStory.animalName}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-forest bg-brand-sageLight px-3 py-0.5 rounded-full">
                  {selectedStory.animalName} • {selectedStory.animalType}
                </span>
                {selectedStory.isDevelopmentSample && (
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Info className="w-3 h-3 text-amber-700" />
                    Development Example
                  </span>
                )}
              </div>

              <h3 className="font-heading font-extrabold text-xl text-brand-charcoal">
                {selectedStory.title}
              </h3>

              <div className="p-3 rounded-xl bg-brand-offwhite border border-brand-border text-xs text-brand-muted flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-forest" />
                  Rescued: {selectedStory.rescueDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-forest" />
                  {selectedStory.rescueLocation}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed whitespace-pre-line">
                {selectedStory.story}
              </p>
            </div>

            <div className="p-4 border-t border-brand-border bg-brand-offwhite flex justify-end">
              <button
                onClick={() => setSelectedStory(null)}
                className="px-5 py-2 rounded-xl bg-brand-forest text-white text-xs font-semibold hover:bg-brand-forestLight shadow-xs"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
