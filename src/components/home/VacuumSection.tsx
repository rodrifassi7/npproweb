import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Snowflake, Timer, Zap } from 'lucide-react';

const VacuumSection: React.FC = () => {
    const features = [
        { icon: <Zap size={16} />, text: 'Sin conservantes' },
        { icon: <ShieldCheck size={16} />, text: 'Sabor original' },
        { icon: <Snowflake size={16} />, text: 'Fácil de guardar' },
        { icon: <Timer size={16} />, text: 'Listo en 5 min' },
    ];

    return (
        <section className="relative py-24 md:py-40 bg-nppro-green overflow-hidden">
            {/* Texto de fondo gigante: Mejoramos la tipografía y opacidad */}
            <div className="absolute top-1/2 right-0 text-[15rem] md:text-[25rem] font-black italic text-black/[0.03] -translate-y-1/2 translate-x-1/4 select-none pointer-events-none tracking-tighter">
                FRESH
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">

                        {/* Columna Izquierda: Mensaje Principal */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-black text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-black/5 mb-6">
                                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Tecnología de punta</span>
                            </div>

                            <h2 className="text-6xl md:text-8xl font-black mb-8 italic leading-[0.85] tracking-tighter uppercase">
                                Sellado <br />
                                <span className="text-black/40">al</span> Vacío
                            </h2>

                            <p className="text-lg md:text-2xl font-medium leading-tight opacity-90 max-w-lg mx-auto lg:mx-0">
                                No es solo comida, es <span className="font-black underline decoration-black/20 underline-offset-4">ingeniería de conservación</span>.
                                Mantenemos el valor biológico intacto por hasta 12 días.
                            </p>
                        </motion.div>

                        {/* Columna Derecha: Grid de Beneficios */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 md:p-8 bg-black rounded-[32px] text-nppro-green flex flex-col justify-between aspect-square md:aspect-auto md:h-48 transition-transform hover:-translate-y-1 shadow-2xl shadow-black/20"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-nppro-green/10 flex items-center justify-center border border-nppro-green/20">
                                        {feature.icon}
                                    </div>
                                    <span className="text-xs md:text-sm font-black uppercase tracking-widest leading-none text-white italic">
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Separación visual con la siguiente sección */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#070707] to-transparent" />
        </section>
    );
};

export default VacuumSection;