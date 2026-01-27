import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LocalSeo: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pt-24 pb-20 relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nppro-green/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-nppro-green/10 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 max-w-5xl relative z-10">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="text-nppro-green font-semibold tracking-widest uppercase text-sm mb-4 block">
                        Trelew • Chubut
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent mb-6">
                        Viandas Proteicas <br className="hidden md:block" /> en Trelew
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        La solución de <span className="text-white">meal prep</span> definitiva para quienes buscan rendimiento, salud y sabor sin perder tiempo.
                    </p>
                </motion.header>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8 text-gray-300"
                    >
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Nutrición de Élite</h2>
                            <p className="leading-relaxed">
                                En <strong className="text-nppro-green">NP PRO</strong>, no solo hacemos comida. Diseñamos
                                <strong className="text-white"> viandas proteicas</strong> con tecnología
                                <span className="text-white underline decoration-nppro-green/40 underline-offset-4"> sous-vide</span>,
                                preservando el 100% del sabor y los nutrientes que tu cuerpo necesita.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                "Ahorrá más de 10 horas semanales de cocina",
                                "Menú diseñado por expertos en nutrición",
                                "Macros exactos en cada etiqueta",
                                "Sin conservantes ni aditivos"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-nppro-green/10 border border-nppro-green/20 flex items-center justify-center group-hover:bg-nppro-green/20 transition-colors">
                                        <div className="w-2 h-2 bg-nppro-green rounded-full shadow-[0_0_8px_#nppro-green]" />
                                    </div>
                                    <span className="text-sm md:text-base group-hover:text-white transition-colors">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* How it works Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-b from-nppro-green/20 to-transparent rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-[#111111] p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
                            <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                                <span className="text-nppro-green">➤</span>
                                ¿Cómo funciona?
                            </h3>
                            <div className="space-y-8">
                                {[
                                    { step: 1, title: "Elegí tus comidas", desc: "Seleccioná tus favoritos de nuestro menú semanal actualizado." },
                                    { step: 2, title: "Armá tu Pack", desc: "Llevá 14, 20 o más viandas con descuentos exclusivos." },
                                    { step: 3, title: "Retirá o recibí", desc: "Envíos a domicilio en Trelew o pick-up en punto central." }
                                ].map((s) => (
                                    <div key={s.step} className="flex gap-5 relative">
                                        {s.step !== 3 && <div className="absolute left-4 top-10 w-[1px] h-10 bg-white/10" />}
                                        <div className="w-8 h-8 rounded-lg bg-nppro-green text-black flex items-center justify-center font-bold shrink-0 shadow-[0_0_15px_rgba(var(--nppro-green-rgb),0.3)]">
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{s.title}</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center relative overflow-hidden bg-gradient-to-br from-[#151515] to-[#0B0B0B] p-12 rounded-[2.5rem] border border-white/5"
                >
                    {/* Subtle inner glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-nppro-green/10 blur-[80px] rounded-full" />

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 italic">¿Listo para transformar tu alimentación?</h2>
                    <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                        Sumate a la comunidad fitness de Trelew que ya confía en <span className="text-white font-medium">NP PRO</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-5 items-center">
                        <Link to="/menu" className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-white/5">
                            Ver Menú
                        </Link>
                        <Link to="/packs" className="w-full sm:w-auto px-10 py-4 bg-nppro-green text-black font-extrabold rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--nppro-green-rgb),0.4)] transition-all">
                            Armar Pack
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default LocalSeo;