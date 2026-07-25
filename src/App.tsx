import { MotionConfig } from 'framer-motion';
import { Layout, ErrorBoundary, AppLoader } from '@/components/layout';
import { useLenis } from '@/hooks/useLenis';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Journey } from '@/sections/Journey';
import { FeaturedProjects } from '@/sections/FeaturedProjects';
import { CurrentlyBuilding } from '@/sections/CurrentlyBuilding';
import { Skills } from '@/sections/Skills';
import { ProgrammingProficiency } from '@/sections/ProgrammingProficiency';
import { CodingProfiles } from '@/sections/CodingProfiles';
import { LeetCodeStatistics } from '@/sections/LeetCodeStatistics';
import { Certificates } from '@/sections/Certificates';
import { Contact } from '@/sections/Contact';

export function App() {
  useLenis();

  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <AppLoader />
        <Layout>
          <Hero />
          <About />
          <Journey />
          <FeaturedProjects />
          <CurrentlyBuilding />
          <Skills />
          <ProgrammingProficiency />
          <CodingProfiles />
          <LeetCodeStatistics />
          <Certificates />
          <Contact />
        </Layout>
      </ErrorBoundary>
    </MotionConfig>
  );
}
