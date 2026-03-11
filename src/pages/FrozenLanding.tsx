import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Wind } from 'lucide-react';

// --- PARTÍCULAS DE HIELO (Optimizadas para rendimiento) ---
const IceParticle: React.FC = () => {
    const config = useMemo(() => ({
        x: Math.random() * 100,
        duration: 12 + Math.random() * 15,
        delay: Math.random() * -20,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
    }), []);

    return (
        <motion.div
            className="absolute rounded-full bg-white"
            style={{
                width: config.size,
                height: config.size,
                left: `${config.x}%`,
                top: -10,
                opacity: config.opacity,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 8px white'
            }}
            animate={{
                y: [0, 1200], // Valor fijo alto para asegurar que cruce cualquier pantalla
                x: [`${config.x}%`, `${config.x + (Math.random() - 0.5) * 15}%`],
            }}
            transition={{
                duration: config.duration,
                repeat: Infinity,
                delay: config.delay,
                ease: "linear",
            }}
        />
    );
};

const FrozenLanding: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Menos partículas en móvil para asegurar 60fps
    const particles = Array.from({ length: 35 });

    return (
        <div className="relative min-h-screen bg-[#010409] overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-cyan-500/30">

            {/* 1. TEXTURA DE ESCARCHA (Visible en todo dispositivo) */}
            <div
                className="absolute inset-0 z-50 pointer-events-none opacity-[0.12]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* 2. BORDES CONGELADOS (Ajustado el grosor para móvil) */}
            <div className="absolute inset-0 z-40 pointer-events-none border-[15px] md:border-[40px] border-transparent shadow-[inset_0_0_80px_rgba(255,255,255,0.15)] md:shadow-[inset_0_0_200px_rgba(255,255,255,0.2)]" />

            {/* 3. NIEVE CAYENDO */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {particles.map((_, i) => <IceParticle key={i} />)}
            </div>

            {/* 4. CONTENIDO CENTRAL RESPONSIVO */}
            <main className="relative z-30 px-4 w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    {/* Título Adaptable */}
                    <h1 className="text-[3.5rem] leading-[0.9] sm:text-7xl md:text-[10rem] lg:text-[12rem] font-black italic tracking-tighter uppercase text-white mb-4">
                        <span className="block opacity-70 text-[0.6em]">NP PRO</span>
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-cyan-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                            FROZEN
                            {/* Brillo de hielo (solo en pantallas grandes para evitar lag en móvil) */}
                            <motion.div
                                className="hidden md:block absolute top-0 bottom-0 w-32 bg-white/10 skew-x-[-25deg] blur-2xl"
                                animate={{ left: ['-150%', '250%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                            />
                        </span>
                    </h1>

                    {/* Subtítulo Responsivo */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1.5 }}
                        className="mt-6 md:mt-10"
                    >
                        <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mx-auto mb-6" />
                        <h2 className="text-sm md:text-2xl font-light tracking-[0.2em] md:tracking-[0.4em] text-cyan-50/60 uppercase px-4">
                            Algo nuevo está llegando... <br className="md:hidden" />
                            <span className="font-bold text-white mt-2 inline-block md:ml-2">Muy pronto</span>
                        </h2>
                    </motion.div>
                </motion.div>

                {/* Iconos Decorativos (Simplificados para móvil) */}
                <div className="mt-16 md:mt-24 flex justify-center gap-8 md:gap-16 opacity-30">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                        <Snowflake size={24} className="text-white md:w-10 md:h-10" />
                    </motion.div>
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                        <Wind size={24} className="text-white md:w-10 md:h-10" />
                    </motion.div>
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                        <Snowflake size={24} className="text-white md:w-10 md:h-10" />
                    </motion.div>
                </div>
            </main>

            {/* Efecto Neblina Inferior (Sutil para no tapar contenido) */}
            <div className="absolute bottom-[-2%] left-0 right-0 h-[15vh] bg-cyan-500/5 blur-[60px] z-20 pointer-events-none" />

            <style>{`
                h1 {
                    text-shadow: 0 0 30px rgba(165, 243, 252, 0.2);
                    -webkit-text-stroke: 1px rgba(255,255,255,0.1);
                }
                @media (max-width: 640px) {
                    h1 {
                        text-shadow: 0 0 15px rgba(165, 243, 252, 0.4);
                    }
                }
            `}</style>
        </div>
    );
};

export default FrozenLanding;