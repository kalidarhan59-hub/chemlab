import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeroSection } from '../components/home/HeroSection';
import { SectionsGrid } from '../components/home/SectionsGrid';
import { FactOfTheDayCard } from '../components/home/FactOfTheDayCard';
import { UserProgressCard } from '../components/home/UserProgressCard';
import { PageTransition } from '../components/ui/PageTransition';
import { SEO } from '../components/ui/SEO';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <SEO
        title={t('app.name')}
        description={t('app.description')}
      />
      <HeroSection />
      <FactOfTheDayCard />
      <SectionsGrid />
      <UserProgressCard />
    </PageTransition>
  );
};

export default HomePage;
