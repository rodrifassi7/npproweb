import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Target, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
    const { scrollY } = useScroll();

    // MEJORA: El contenido ahora es mucho más estable al scrollear
    const yContent = useTransform(scrollY, [0, 1000], [0, 150]);
    const opacityContent = useTransform(scrollY, [0, 700], [1, 0]);

    return (
        // Usamos svh para asegurar que entre todo en la pantalla del móvil
        <section className="relative min-h-[100svh] flex items-center justify-center pt-16 pb-10 overflow-hidden bg-[#050505]">

            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-nppro-green/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-nppro-green/[0.05] blur-[150px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
                <motion.div
                    style={{ y: yContent, opacity: opacityContent }}
                    className="max-w-6xl mx-auto flex flex-col items-center w-full"
                >
                    {/* Badge más compacto en mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md mb-6 md:mb-10"
                    >
                        <Activity size={12} className="text-nppro-green animate-pulse" />
                        <span className="text-white/60 text-[9px] md:text-xs font-bold tracking-[0.3em] uppercase font-mono">
                            System Status: Optimized
                        </span>
                    </motion.div>

                    {/* TÍTULO: Ajustado el leading para que no ocupe tanto espacio vertical */}
                    <div className="text-center mb-6 md:mb-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[13vw] md:text-[8rem] lg:text-[10rem] font-black leading-[0.8] italic tracking-tighter uppercase"
                        >
                            Comida <span className="text-nppro-green">Real</span>
                            <br />
                            <span className="text-white/10 italic">Resultados</span> Reales
                        </motion.h1>
                    </div>

                    {/* DESCRIPCIÓN: Un poco más corta en mobile para subir los botones */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm md:text-xl text-nppro-gray font-light max-w-md md:max-w-xl text-center leading-tight mb-8 md:mb-14 px-4"
                    >
                        Ingeniería nutricional para llevar tu rendimiento al siguiente nivel.
                    </motion.p>

                    {/* BOTONES: Stackeados solo en pantallas muy pequeñas, pero compactos */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10 w-full"
                    >
                        <Link to="/menu" className="w-full sm:w-auto">
                            <button className="w-full px-6 py-3 bg-nppro-green text-black font-extrabold italic rounded-full flex items-center justify-center gap-3 text-base md:text-lg transition-transform active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                VER MENÚ SEMANAL
                                <ArrowRight size={20} strokeWidth={3} />
                            </button>
                        </Link>

                        <Link to="/packs" className="flex items-center gap-2 text-white/50 hover:text-nppro-green font-black tracking-[0.2em] text-[10px] md:text-xs py-3 group">
                            <Target size={16} className="text-nppro-green" />
                            ARMAR PACK
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator más pequeño para no estorbar visualmente */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-20 hidden md:block">
                <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
            </div>
        </section>
    );
};

export default HeroSection;