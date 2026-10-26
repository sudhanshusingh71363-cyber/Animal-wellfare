import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { QuickHelpCards } from '../components/home/QuickHelpCards';
import { WellnessResources } from '../components/home/WellnessResources';
import { WellnessQuotes } from '../components/home/WellnessQuotes';
import { StoriesOfHope } from '../components/home/StoriesOfHope';

interface HomePageProps {
  onNavigateToAssistant: (categoryId?: string) => void;
  onNavigateToReport: () => void;
  onNavigateToClinics: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToAssistant,
  onNavigateToReport,
  onNavigateToClinics,
}) => {
  return (
    <div className="space-y-0">
      <HeroSection
        onHelpAnimal={onNavigateToReport}
        onTalkAssistant={() => onNavigateToAssistant()}
      />

      <QuickHelpCards
        onSelectConcern={(categoryId) => onNavigateToAssistant(categoryId)}
      />

      <WellnessResources />

      <WellnessQuotes />

      <StoriesOfHope />
    </div>
  );
};
