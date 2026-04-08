import React, { useState } from 'react';
import { Clock, Flame, Check, Copy, Zap, ArrowRight, MessageSquare, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONFIG } from '../data/data';

const GymLandingV3WhatsApp: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('GYMPOWER10');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- CONFIGURACIÓN DE WHATSAPP ---
    const WHATSAPP_NUMBER = CONFIG.WHATSAPP_NUMBER;

    const WHATSAPP_MESSAGE = "¡Hola NPPRO! Quiero pedir mi Pack con el 10% OFF exclusivo de mi gym.";
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    // ---------------------------------

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-green-500 selection:text-black">

            {/* 1. HERO - RESPONSIVO & IMPACTANTE */}
            <header className="relative bg-gray-900 border-b border-gray-800">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />

                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12 pt-16 md:pt-24 pb-16">

                        <div className="md:w-1/2 text-center md:text-left relative z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1 border border-green-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-950/50 text-green-300 mb-8"
                            >
                                <Award size={12} className="text-green-400" /> Alianza Premium Gym
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-[1000] text-white leading-[0.9] tracking-tighter uppercase italic mb-6"
                            >
                                TU ENTRENAMIENTO <br /> <span className="text-white/40">TERMINA EN EL PLATO</span>
                            </motion.h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-xs md:max-w-none mx-auto md:mx-0">Nutrición ultra-proteica diseñada para los mas exigentes     </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="md:w-1/2 relative z-10"
                        >
                            <div className="w-full h-56 md:h-96 bg-gray-800 rounded-3xl flex items-center justify-center border-4 md:border-8 border-gray-900 shadow-inner overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
                                    alt="Vianda NPPRO premium"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* 2. PRODUCTOS - Grid Responsivo */}
            <section className="px-6 -mt-12 md:-mt-20 mb-16 relative z-20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <motion.div
                            whileHover={{ y: -8 }}
                            className="bg-gray-900 border-2 border-green-500 p-8 rounded-[32px] shadow-[0_20px_40px_rgba(34,197,94,0.15)] group transition-all"
                        >
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-4xl font-black italic uppercase tracking-tighter text-white">Pack 10</span>
                                        <span className="bg-green-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full border border-green-400/20">MÁS POPULAR</span>
                                    </div>
                                    <p className="text-gray-400 text-base font-medium">Dominá tu nutrición semanal (Lun-Vie)</p>
                                </div>
                                <div className="bg-green-500/10 p-5 rounded-2xl border border-green-500/20 text-green-400 group-hover:bg-green-400 group-hover:text-black transition-all">
                                    <Zap size={28} />
                                </div>
                            </div>
                            <ul className="space-y-2 text-base text-gray-300 border-t border-gray-800 pt-6 mb-6">
                                <li className="flex items-center gap-3"><Check size={18} className="text-green-400" /> Almuerzo y Cena incluidos.</li>
                                <li className="flex items-center gap-3"><Check size={18} className="text-green-400" /> Menú variable semanal.</li>
                                <li className="flex items-center gap-3 text-green-300 font-semibold"><Check size={18} /> Envío GRATIS al Gym.</li>
                            </ul>
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-green-400 text-black h-14 rounded-xl font-bold uppercase tracking-tight flex items-center justify-center gap-2 hover:bg-white transition-colors">
                                Ver Menú Pack 10 <ArrowRight size={20} />
                            </a>
                        </motion.div>

                        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-900 border border-gray-800 p-8 rounded-[32px] flex items-center justify-between group hover:border-gray-700 transition-colors">
                            <div>
                                <span className="text-3xl font-black italic uppercase tracking-tighter text-white">Pack 5 - Prueba</span>
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-tight">Ideal para probar el poder</p>
                            </div>
                            <div className="bg-gray-800 p-5 rounded-2xl group-hover:bg-white group-hover:text-black transition-all text-gray-400">
                                <ArrowRight size={22} />
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* 3. EL BENEFICIO - Bento Style */}
            <section className="px-6 mb-16">
                <div className="mx-auto max-w-7xl">
                    <div className="bg-gray-900 border-2 border-gray-800 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">

                        <div className="text-center md:text-left">
                            <p className="text-sm font-black uppercase tracking-widest mb-1 text-gray-500">Cupón Exclusivo Socios</p>
                            <h2 className="text-8xl font-black italic leading-none mb-2 tracking-tighter text-white">10% OFF</h2>
                            <p className="text-gray-400 max-w-xs text-sm">Mostrá este código al pedir por WhatsApp para Packs de 5 y 10 viandas.</p>
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={handleCopy}
                                className="flex items-center justify-between w-full md:w-80 bg-gray-800 text-green-300 p-4 rounded-2xl font-bold uppercase tracking-tight active:scale-95 transition-transform"
                            >
                                <span className="pl-3">{copied ? '¡LISTO PARA USAR!' : 'COPIAR CÓDIGO'}</span>
                                <div className="bg-green-400 p-3 rounded-xl text-black">
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={22} strokeWidth={3} /></motion.div>
                                        ) : (
                                            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy size={22} strokeWidth={3} /></motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. TRUST ELEMENTS - Compactos */}
            <footer className="bg-gray-950 border-t border-gray-800 px-6 py-10 mb-20 text-center">
                <div className="flex justify-center gap-12 opacity-40 mb-8 text-gray-400">
                    {[{ icon: <Flame />, text: "PRO" }, { icon: <Clock />, text: "5 MIN" }, { icon: <Award />, text: "NATURAL" }].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            {item.icon}
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.text}</span>
                        </div>
                    ))}
                </div>
                <p className="text-gray-700 text-xs">NPPRO S.A. | Alianza con [Nombre del Gym]</p>
            </footer>

            {/* 5. BOTTOM BAR - Sticky CTA ACTIVO WHATSAPP */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent pt-12 z-50">
                <motion.a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, backgroundColor: '#ffffff', color: '#000000' }}
                    whileTap={{ scale: 0.98 }}
                    // Se agregaron clases para asegurar que se comporte como un flex item
                    className="w-full max-w-lg mx-auto bg-green-400 text-black h-16 rounded-2xl flex items-center justify-center gap-3 font-black uppercase italic tracking-tighter shadow-[0_25px_50px_rgba(0,0,0,0.5)] no-underline"
                >
                    {/* Se cambió ShoppingCart por MessageSquare */}
                    <MessageSquare size={22} />
                    Pedir mi Pack por WhatsApp
                </motion.a>
            </div>
        </div>
    );
};

export default GymLandingV3WhatsApp;