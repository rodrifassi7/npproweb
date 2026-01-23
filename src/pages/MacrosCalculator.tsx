import React from 'react';
import MacrosCalculator from '../components/MacrosCalculator/MacrosCalculator';
import { motion } from 'framer-motion';

const MacrosPage: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-20 min-h-screen bg-[#0B0B0B]"
        >
            <div className="py-12 bg-zinc-900/50 border-y border-white/5 mb-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">NUTRICIÓN <span className="text-nppro-green">SMART</span></h1>
                    <p className="text-nppro-gray font-light max-w-2xl mx-auto italic">Herramientas profesionales para optimizar tu rendimiento y alcanzar tus objetivos físicos.</p>
                </div>
            </div>

            <MacrosCalculator />

            {/* Seccion Info Adicional */}
            <section className="py-24 bg-black/40">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-2xl font-black italic uppercase mb-8 tracking-tight">¿POR QUÉ CALCULAR TUS MACROS?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="text-nppro-green font-black italic text-4xl mb-4 block underline">01</span>
                            <h3 className="text-lg font-bold mb-2 italic">PRECISIÓN</h3>
                            <p className="text-sm text-nppro-gray font-light leading-relaxed">Dejá de adivinar. Comé lo que tu cuerpo necesita exactamente para cambiar.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="text-nppro-green font-black italic text-4xl mb-4 block underline">02</span>
                            <h3 className="text-lg font-bold mb-2 italic">RENDIMIENTO</h3>
                            <p className="text-sm text-nppro-gray font-light leading-relaxed">Asegurá la energía necesaria para tus entrenamientos de alta intensidad.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="text-nppro-green font-black italic text-4xl mb-4 block underline">03</span>
                            <h3 className="text-lg font-bold mb-2 italic">CONTROL</h3>
                            <p className="text-sm text-nppro-gray font-light leading-relaxed">Ajustá tu ingesta semanal basado en datos reales de tu progreso físico.</p>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default MacrosPage;
