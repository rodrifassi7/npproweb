import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, ChevronRight, Copy, Check, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const GymLanding: React.FC = () => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('GYMPOWER10');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 overflow-x-hidden font-sans">
            {/* 1. HERO - IMPACTO RADICAL */}
            <section className="relative pt-24 pb-20 px-6">
                {/* Efecto de luz de fondo (Glow) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-nppro-green/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nppro-green/10 border border-nppro-green/30 text-[11px] font-black uppercase tracking-[0.2em] text-nppro-green mb-8"
                    >
                        <Zap size={12} fill="currentColor" />
                        Alianza Exclusiva para Gimnasios
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-[900] italic uppercase tracking-tighter leading-[0.85] mb-6"
                    >
                        TU CUERPO SE CONSTRUYE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                            EN LA COCINA
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 font-medium text-lg md:text-xl max-w-lg mx-auto leading-tight mb-10"
                    >
                        Packs de comidas <span className="text-white">Ultra-Proteicos</span> diseñados para socios que no tienen tiempo que perder.
                    </motion.p>
                </div>
            </section>

            {/* 2. EL "TICKET" DE BENEFICIO */}
            <section className="px-6 -mt-10 mb-20 relative z-20">
                <div className="container mx-auto max-w-md">
                    <motion.div
                        initial={{ rotate: -2, y: 20, opacity: 0 }}
                        animate={{ rotate: 0, y: 0, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="relative bg-nppro-green p-[2px] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(74,222,128,0.2)]"
                    >
                        <div className="bg-black rounded-[22px] p-8 text-center relative overflow-hidden">
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 opacity-10 uppercase font-black text-6xl italic -mr-10 -mt-5 select-none">GYM</div>

                            <h3 className="text-nppro-green font-black text-xs uppercase tracking-[0.3em] mb-2">Beneficio de tu Gym</h3>
                            <div className="text-6xl font-[1000] italic tracking-tighter text-white mb-6">
                                10%<span className="text-2xl uppercase">off</span>
                            </div>

                            <button
                                onClick={handleCopy}
                                className="w-full group relative bg-nppro-green hover:bg-white text-black font-black py-5 rounded-2xl transition-all duration-300 active:scale-95 overflow-hidden"
                            >
                                <div className="flex items-center justify-center gap-3 relative z-10">
                                    <span className="text-xl tracking-tighter uppercase">
                                        {copied ? '¡COPIADO!' : 'GYMPOWER10'}
                                    </span>
                                    {copied ? <Check size={22} strokeWidth={3} /> : <Copy size={22} strokeWidth={3} />}
                                </div>
                                <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
                            </button>

                            <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest">
                                Aplicable en Packs de 5 y 10 viandas
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. PROPUESTA DE VALOR - RÁPIDA Y AGRESIVA */}
            <section className="px-6 mb-24">
                <div className="container mx-auto max-w-md">
                    <div className="grid gap-3">
                        {[
                            { icon: <Flame />, title: "MAX PROTEIN", text: "Macros optimizados para hipertrofia." },
                            { icon: <Clock />, title: "ZERO COOKING", text: "Recuperá 10 horas de tu semana." },
                            { icon: <Trophy />, title: "REAL FOOD", text: "Sin químicos. Solo combustible real." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-nppro-green/30 transition-all"
                            >
                                <div className="w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-nppro-green group-hover:scale-110 transition-transform shadow-xl">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="font-[900] text-xl italic uppercase leading-none mb-1">{item.title}</div>
                                    <div className="text-sm text-gray-500 font-medium uppercase tracking-tighter">{item.text}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. SELECCIÓN DE PACKS - "CARDS DE ÉLITE" */}
            <section className="px-6 mb-12">
                <div className="container mx-auto max-w-md text-center">
                    <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter mb-8 italic">Seleccioná tu Blindaje</h2>

                    <div className="grid gap-6">
                        {/* Pack 10 - EL DOMINANTE */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="relative p-[1px] rounded-[35px] bg-gradient-to-b from-nppro-green to-transparent"
                        >
                            <div className="bg-[#111] rounded-[34px] p-8">
                                <span className="bg-nppro-green text-black text-[10px] font-[1000] uppercase px-4 py-1.5 rounded-full mb-4 inline-block">
                                    EL MÁS ELEGIDO POR ATLETAS
                                </span>
                                <div className="text-5xl font-[1000] italic tracking-tighter mb-1">PACK 10</div>
                                <div className="text-nppro-green font-bold uppercase text-xs tracking-widest mb-8 text-center italic">Dominá tu nutrición semanal</div>

                                <ul className="space-y-4 mb-8 text-left border-y border-white/5 py-6">
                                    <li className="flex items-center gap-3 font-bold text-sm uppercase italic">
                                        <Check className="text-nppro-green" size={20} strokeWidth={3} /> Almuerzo y Cena Lunes a Viernes
                                    </li>
                                    <li className="flex items-center gap-3 font-bold text-sm uppercase italic">
                                        <Check className="text-nppro-green" size={20} strokeWidth={3} /> Menú Variable (No te cansás)
                                    </li>
                                    <li className="flex items-center gap-3 font-bold text-sm uppercase italic text-nppro-green">
                                        <Check className="text-nppro-green" size={20} strokeWidth={3} /> Envío Prioritario y Gratuito al Gym
                                    </li>
                                </ul>

                                <Link to="/packs" className="block w-full bg-white text-black font-[1000] uppercase py-5 rounded-2xl hover:bg-nppro-green transition-colors text-xl tracking-tighter">
                                    ADQUIRIR PACK 10
                                </Link>
                            </div>
                        </motion.div>

                        {/* Pack 5 - EL INICIADOR */}
                        <Link to="/packs" className="group p-8 rounded-[35px] border-2 border-white/10 hover:border-white/30 transition-all">
                            <div className="text-2xl font-[900] italic text-gray-400 group-hover:text-white transition-colors">PACK 5 - PRUEBA</div>
                            <div className="text-xs text-gray-600 font-bold uppercase mt-1 tracking-widest">Para probar el poder</div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 5. CTA FIJO - "FLOTANTE AGRESIVO" */}
            <div className="fixed bottom-6 left-0 w-full px-6 z-[100]">
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="container mx-auto max-w-md bg-white text-black p-3 rounded-[24px] flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="pl-4">
                        <div className="text-[10px] font-black uppercase opacity-50 leading-none">Tu Nutrición</div>
                        <div className="text-lg font-[1000] italic uppercase leading-none">Lista ahora</div>
                    </div>
                    <Link to="/packs" className="bg-black text-white px-8 py-4 rounded-xl font-[1000] uppercase italic flex items-center gap-2 hover:bg-nppro-green hover:text-black transition-all">
                        IR A TIENDA <ChevronRight size={20} strokeWidth={3} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default GymLanding;