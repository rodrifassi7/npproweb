import React from 'react';
import AnimatedNumber from '../common/AnimatedNumber';


const TrustSection: React.FC = () => {
    const stats = [
        { val: "+100", label: "ATLETAS ALIMENTADOS" },
        { val: "100%", label: "INGREDIENTES NOBLES" },
        { val: "24h", label: "DESDE LA COCINA A TU MESA" }
    ];

    return (
        <section className="py-24 border-y border-white/5 bg-gradient-to-b from-transparent to-white/[0.01]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center group">
                            <div className="text-7xl font-black italic text-white mb-2 group-hover:text-nppro-green transition-colors duration-500">
                                <AnimatedNumber value={stat.val} />
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-nppro-green">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
