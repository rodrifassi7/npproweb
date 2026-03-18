import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Wind } from 'lucide-react';

// --- PARTÍCULAS OPTIMIZADAS (Sin Blur ni Box-shadow) ---
const IceParticle: React.FC = () => {
    const config = useMemo(() => ({
        x: Math.random() * 100,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * -20,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
    }), []);

    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: config.size,
                height: config.size,
                left: `${config.x}%`,
                top: -20,
                opacity: config.opacity,
                background: 'white', // Color sólido es más rápido que gradientes
                willChange: 'transform', // Avisa al navegador que use la GPU
            }}
            animate={{
                y: [0, 1000],
                x: [0, (Math.random() - 0.5) * 40],
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

    // Reducimos aún más para estabilidad total en móviles de gama media
    const particles = Array.from({ length: 25 });

    return (
        <div className="relative min-h-screen bg-[#010409] overflow-hidden flex flex-col items-center justify-center font-sans">

            {/* 1. TEXTURA DE ESCARCHA (Optimizada con Opacity fija) */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.08]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* 2. BORDES CONGELADOS (Simplificado para evitar overdraw) */}
            <div className="absolute inset-0 z-40 pointer-events-none border-[10px] md:border-[40px] border-transparent shadow-[inset_0_0_60px_rgba(255,255,255,0.1)]" />

            {/* 3. NIEVE CAYENDO */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {particles.map((_, i) => <IceParticle key={i} />)}
            </div>

            {/* 4. CONTENIDO CENTRAL */}
            <main className="relative z-30 px-6 w-full text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center"
                >
                    <h1 className="text-[3.5rem] leading-[0.9] sm:text-7xl md:text-[10rem] lg:text-[12rem] font-black italic tracking-tighter uppercase text-white mb-4">
                        <span className="block opacity-60 text-[0.6em] tracking-normal">NP PRO</span>
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-cyan-300 drop-shadow-lg">
                            FROZEN
                        </span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-6 md:mt-10"
                    >
                        <div className="h-[1px] w-12 bg-cyan-400/40 mx-auto mb-6" />
                        <h2 className="text-sm md:text-2xl font-light tracking-[0.2em] text-cyan-50/70 uppercase px-4">
                            Algo nuevo se está congelando... <br className="md:hidden" />
                            <span className="font-bold text-white mt-2 inline-block md:ml-2">Muy pronto</span>
                        </h2>
                    </motion.div>
                </motion.div>

                {/* Iconos Decorativos (Sin animaciones complejas) */}
                <div className="mt-16 flex justify-center gap-10 opacity-20">
                    <Snowflake size={24} className="text-white" />
                    <Wind size={24} className="text-white" />
                    <Snowflake size={24} className="text-white" />
                </div>
            </main>

            {/* Brillo inferior estático (Sin Blur dinámico) */}
            <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-cyan-500/10 to-transparent z-20 pointer-events-none" />

            <style>{`
                h1 {
                    -webkit-text-stroke: 0.5px rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
};

export default FrozenLanding;