import React from 'react';
import HeroSection from '../components/home/HeroSection';
import DailySpecialSection from '../components/home/DailySpecialSection';
import VacuumSection from '../components/home/VacuumSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TrustSection from '../components/home/TrustSection';
import FAQSection from '../components/home/FAQSection';
import MacrosCalculator from '../components/MacrosCalculator/MacrosCalculator';
import { getTodaySpecialByTime } from '../data/weeklyMenu';

const Home: React.FC = () => {
    const dailySpecial = getTodaySpecialByTime();

    return (
        <div className="flex flex-col bg-[#0B0B0B] text-white overflow-hidden">
            <HeroSection />
            <DailySpecialSection dailySpecial={dailySpecial} />
            <VacuumSection />
            <FeaturesSection />
            <MacrosCalculator />
            <TrustSection />
            <FAQSection />
        </div>
    );
};

export default Home;
