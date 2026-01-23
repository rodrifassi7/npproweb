import React from 'react';
import { motion } from 'framer-motion';
import { Box, Send, CreditCard, ChevronRight } from 'lucide-react';

const FeaturesSection: React.FC = () => {
    const features = [
        {
            icon: <Box size={28} />,
            title: "SELECCIÓN",
            desc: "Explorá el menú y elegís tus viandas según tus objetivos nutricionales de la semana.",
            step: "01",
            label: "Performance"
        },
        {
            icon: <Send size={28} />,
            title: "LOGÍSTICA",
            desc: "Coordinamos vía WhatsApp de forma humana. Sin bots, atención directa para tu pedido.",
            step: "02",
            label: "Agilidad"
        },
        {
            icon: <CreditCard size={28} />,
            title: "ENTREGA",
            desc: "Recibís en tu domicilio o retiras en nuestro punto central. Vos elegís la comodidad.",
            step: "03",
            label: "Flexibilidad"
        }
    ];

    return (
        <section className="py-32 bg-[#0B0B0B] relative overflow-hidden">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-nppro-green/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header dinámico */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[2px] bg-nppro-green"></div>
                            <span className="text-nppro-green font-bold uppercase tracking-[0.4em] text-xs">Metodología</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] mb-8">
                            EL SISTEMA <br />
                            <span className="text-white/20">NPPRO.</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-nppro-gray max-w-sm text-lg leading-relaxed font-light border-l border-white/10 pl-8 mb-4"
                    >
                        Simplificamos tu alimentación al máximo para que tu único enfoque sea <span className="text-white">superar tus límites</span>.
                    </motion.p>
                </div>

                {/* Grid de Pasos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Línea conectora decorativa (solo en desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 pointer-events-none" />

                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="group relative"
                        >
                            {/* Card Body */}
                            <div className="relative z-10 h-full p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-nppro-green/30 hover:bg-white/[0.04] transition-all duration-500 flex flex-col">

                                {/* Top: Icon & Step */}
                                <div className="flex justify-between items-start mb-16">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nppro-green/20 to-transparent flex items-center justify-center text-nppro-green border border-nppro-green/20 group-hover:scale-110 transition-transform duration-500">
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-5xl font-black italic text-white/5 group-hover:text-nppro-green/10 transition-colors tracking-tighter leading-none">
                                            {item.step}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-nppro-gray mt-2">
                                            Step
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mt-auto">
                                    <div className="text-[10px] font-black text-nppro-green uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-nppro-green animate-pulse" />
                                        {item.label}
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 italic tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-nppro-gray leading-relaxed font-light">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Bottom Decorative Chevron */}
                                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="text-nppro-green animate-bounce-x" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer de sección sutil */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 flex justify-center"
                >
                    <div className="px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.3em] text-nppro-gray flex items-center gap-4">
                        <span>Sin suscripciones forzadas</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Comida real</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Trelew, Chubut</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;