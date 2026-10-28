import React from 'react';
import { Link } from 'react-router-dom';

// Components
import HeroSection from '../components/home/HeroSection';
import DailySpecialSection from '../components/home/DailySpecialSection';
import PacksSection from '../components/home/PacksSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import GoalsSection from '../components/home/GoalsSection';
import VacuumSection from '../components/home/VacuumSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import MacrosTeaser from '../components/home/MacrosTeaser';
import FAQSection from '../components/home/FAQSection';
import EntryDiscountModal from '../components/common/EntryDiscountModal';

// Data & Utils
import { getTodayMenu } from '../data/weeklyMenu';

// SEO Schema Data
const JSON_LD = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "NP PRO Meal Prep",
    "description": "Viandas saludables y altas en proteína en Trelew. Packs semanales y comida fitness.",
    "areaServed": {
        "@type": "City",
        "name": "Trelew",
        "addressRegion": "Chubut",
        "addressCountry": "AR"
    },
    "url": "https://nppro.com.ar",
    "telephone": "+5492804385269",
    "priceRange": "$$"
};

const Home: React.FC = () => {
    const dailySpecials = getTodayMenu();

    return (
        <div className="flex flex-col bg-[#0B0B0B] text-white overflow-hidden">
            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(JSON_LD)}
            </script>

            <HeroSection />
            <EntryDiscountModal />
            <DailySpecialSection dailySpecials={dailySpecials} />
            <PacksSection />
            <HowItWorksSection />
            <GoalsSection />
            <VacuumSection />
            <TestimonialsSection />
            <FAQSection />
            <MacrosTeaser />

            {/* Texto para buscadores, al pie */}
            <section className="border-t border-white/5 bg-[#0B0B0B] py-8">
                <p className="container mx-auto px-6 text-center text-sm text-white/40">
                    Viandas proteicas en Trelew: meal prep saludable y comida fitness lista para consumir.{' '}
                    <Link to="/viandas-en-trelew" className="text-white/60 underline-offset-4 hover:text-nppro-green hover:underline">
                        Más info sobre entregas en Trelew
                    </Link>
                </p>
            </section>
        </div>
    );
};

export default Home;