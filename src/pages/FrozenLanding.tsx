import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Snowflake } from 'lucide-react';

const Particle: React.FC = () => {
    // Generate random values for each particle
    const randomX = Math.random() * 100; // 0 to 100vw
    const randomDuration = 10 + Math.random() * 20; // 10s to 30s
    const randomDelay = Math.random() * 10;
    const randomSize = Math.random() * 3 + 1; // 1px to 4px
    const randomOpacity = Math.random() * 0.4 + 0.1; // 0.1 to 0.5

    return (
        <motion.div
            className="absolute rounded-full bg-cyan-100"
            style={{
                width: randomSize,
                height: randomSize,
                left: `${randomX}%`,
                bottom: -10,
                opacity: randomOpacity,
                filter: 'blur(1px)',
            }}
            animate={{
                y: [0, -window.innerHeight - 100],
                x: [0, (Math.random() - 0.5) * 200], // Drift left/right
                opacity: [0, randomOpacity, 0],
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "linear",
            }}
        />
    );
};

const Vapor: React.FC = () => {
    return (
        <motion.div
            className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-cyan-900/10 to-transparent blur-3xl"
            animate={{
                opacity: [0.3, 0.6, 0.3],
                scaleY: [1, 1.2, 1],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

const FrozenLanding: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Create an array of 50 particles
    const particles = Array.from({ length: 50 });

    return (
        <div className="relative min-h-screen bg-[#030712] overflow-hidden flex flex-col items-center justify-center frost-edges pt-20">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0f172a] to-[#082f49] opacity-40"></div>
            
            {/* Subtle glow behind the main container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Vapor & Particles */}
            <Vapor />
            {particles.map((_, i) => (
                <Particle key={i} />
            ))}

            <main className="relative z-20 px-6 w-full max-w-4xl text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-full frozen-glass rounded-[40px] p-10 md:p-16 relative overflow-hidden group"
                >
                    {/* Hover frost effect on the card itself */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-cyan-100/0 to-white/0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="h-px w-8 bg-cyan-200/50"></span>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-100/80">
                            Algo nuevo se está congelando...
                        </span>
                        <span className="h-px w-8 bg-cyan-200/50"></span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        NP PRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-cyan-300">Frozen</span>
                    </h1>

                    <div className="inline-flex items-center justify-center gap-2 mb-8 bg-cyan-950/30 border border-cyan-500/20 px-4 py-1.5 rounded-full text-cyan-200/90 text-sm font-bold tracking-widest uppercase">
                        <Snowflake size={14} className="animate-pulse" />
                        Muy pronto
                    </div>

                    <p className="max-w-xl mx-auto text-lg md:text-xl text-cyan-50/60 font-medium leading-relaxed">
                        Comidas proteicas congeladas.<br className="hidden md:block" /> 
                        <span className="text-white"> La misma calidad de siempre, con mayor practicidad.</span>
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

export default FrozenLanding;
