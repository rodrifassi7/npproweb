import React from 'react';
import { Link } from 'react-router-dom';

// Components
import HeroSection from '../components/home/HeroSection';
import DailySpecialSection from '../components/home/DailySpecialSection';
import VacuumSection from '../components/home/VacuumSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TrustSection from '../components/home/TrustSection';
import FAQSection from '../components/home/FAQSection';
// import MacrosCalculator from '../components/MacrosCalculator/MacrosCalculator';
import EntryDiscountModal from '../components/common/EntryDiscountModal';

// Data & Utils
import { getTodaySpecialByTime } from '../data/weeklyMenu';

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
    const dailySpecial = getTodaySpecialByTime();

    return (
        <div className="flex flex-col bg-[#0B0B0B] text-white overflow-hidden">
            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(JSON_LD)}
            </script>

            <HeroSection />

            {/* SEO Banner */}
            <section className="bg-[#0B0B0B] pt-4 pb-2 text-center border-b border-white/5">
                <div className="container mx-auto px-4">
                    <p className="text-gray-400 text-sm md:text-base">
                        Encontrá las mejores <strong className="text-white font-medium">viandas proteicas en Trelew</strong>.
                        Somos tu opción de <strong className="text-white font-medium">meal prep saludable</strong> y <strong className="text-white font-medium">comida fitness</strong> lista para consumir.
                        <Link to="/viandas-en-trelew" className="text-nppro-green hover:underline ml-2 transition-colors">
                            Ver info local
                        </Link>
                    </p>
                </div>
            </section>

            {/* Main Content Sections */}
            <EntryDiscountModal />
            <DailySpecialSection dailySpecial={dailySpecial} />
            <VacuumSection />
            <FeaturesSection />
            {/* <MacrosCalculator /> */}
            <TrustSection />
            <FAQSection />
        </div>
    );
};

export default Home;