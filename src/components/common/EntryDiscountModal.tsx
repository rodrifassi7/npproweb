import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, MessageCircle, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'nppro_discount_modal_seen';

const EntryDiscountModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        localStorage.setItem(STORAGE_KEY, 'true');
        document.body.style.overflow = 'unset';
    }, []);

    useEffect(() => {
        const hasSeen = localStorage.getItem(STORAGE_KEY);
        if (!hasSeen) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                // Bloquear scroll cuando se abre
                document.body.style.overflow = 'hidden';
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Cerrar con la tecla Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [handleClose]);

    const handleClaim = () => {
        const message = encodeURIComponent("¡Hola! Vengo por mi descuento de bienvenida en la web 🎁");
        window.open(`https://wa.me/5491112345678?text=${message}`, '_blank');
        handleClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
                    {/* Backdrop con desenfoque profundo */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { type: "spring", damping: 25, stiffness: 300 }
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="relative max-w-sm w-full"
                    >
                        {/* Efecto de Resplandor Trasero (Glow) */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-nppro-green to-emerald-400 rounded-[34px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                        <div className="relative bg-[#0a0a0a] border border-white/10 p-8 rounded-[32px] shadow-2xl text-center overflow-hidden">

                            {/* Decoración de fondo */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nppro-green to-transparent" />

                            <button
                                onClick={handleClose}
                                className="absolute top-5 right-5 text-white/20 hover:text-white hover:rotate-90 transition-all duration-300"
                            >
                                <X size={24} />
                            </button>

                            {/* Icono Principal Animado */}
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                                className="w-20 h-20 bg-nppro-green/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-nppro-green relative"
                            >
                                <Gift size={40} />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute -top-2 -right-2 text-yellow-400"
                                >
                                    <Sparkles size={20} />
                                </motion.div>
                            </motion.div>

                            <h2 className="text-3xl font-black italic uppercase text-white mb-2 leading-tight">
                                Regalo de <br />
                                <span className="text-nppro-green">Bienvenida</span>
                            </h2>

                            <p className="text-gray-400 text-sm mb-8 leading-relaxed px-2">
                                Unite a la comunidad NPPRO. Canjeá tu beneficio por WhatsApp.
                            </p>

                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClaim}
                                    className="w-full bg-nppro-green text-black font-black italic py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(var(--nppro-green-rgb),0.4)] transition-all text-sm uppercase tracking-wider"
                                >
                                    <MessageCircle size={18} fill="currentColor" />
                                    Reclamar por WhatsApp
                                </motion.button>

                                <button
                                    onClick={handleClose}
                                    className="w-full text-white/40 hover:text-white/80 text-[11px] font-bold uppercase tracking-[0.2em] py-2 transition-colors"
                                >
                                    Quizás en otro momento
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EntryDiscountModal;