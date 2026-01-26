import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { CONFIG } from '../../data/data';

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "¿Qué días entregan?",
            a: "Entregamos en Trelew todos los días. Una vez que realices tu pedido, nos comunicamos con vos para coordinar la entrega que mejor te quede."
        },
        {
            q: "¿Cómo se pagan los pedidos?",
            a: "Aceptamos transferencia bancaria, Mercado Pago (con link o QR) y efectivo al momento de recibir o retirar tus viandas."
        },
        {
            q: "¿Tienen local físico para retirar?",
            a: "¡Sí! Podés retirar tus pedidos sin costo adicional en nuestro local, ubicado en Paraguay 55, Trelew."
        },
        {
            q: "¿Cuánto duran las viandas?",
            a: "Nuestras viandas frescas duran 24-48 horas en heladera. Si elegís la opción de envasado al vacío, la duración se extiende hasta los 12 días manteniendo la textura y sabor original."
        }
    ];

    return (
        <section className="py-32 bg-[#0B0B0B]">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header de la sección */}
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-nppro-green font-bold uppercase tracking-[0.3em] text-xs mb-4 block"
                    >
                        Soporte & Ayuda
                    </motion.span>
                    <h2 className="text-5xl md:text-7xl font-black italic mb-6 tracking-tighter">
                        RESOLVEMOS <br /> <span className="text-white/20">TUS DUDAS</span>
                    </h2>
                    <div className="w-20 h-1.5 bg-nppro-green mx-auto rounded-full" />
                </div>

                {/* Lista de Acordeones */}
                <div className="space-y-4">
                    {faqs.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`rounded-[32px] border transition-all duration-500 overflow-hidden ${isOpen
                                    ? 'bg-white/[0.05] border-nppro-green/30 shadow-[0_20px_40px_rgba(0,0,0,0.3)]'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full flex justify-between items-center p-8 text-left outline-none"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className={`text-2xl font-black italic transition-colors duration-300 ${isOpen ? 'text-nppro-green' : 'text-white/10'
                                            }`}>
                                            0{i + 1}
                                        </span>
                                        <h3 className="text-xl font-bold tracking-tight text-white/90 italic">
                                            {item.q}
                                        </h3>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen
                                        ? 'bg-nppro-green border-nppro-green text-black rotate-0'
                                        : 'bg-transparent border-white/10 text-white rotate-180'
                                        }`}>
                                        {isOpen ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-8 pb-8 ml-16 md:ml-20">
                                                <div className="h-[1px] w-12 bg-nppro-green/30 mb-6" />
                                                <p className="text-nppro-gray text-lg leading-relaxed font-light max-w-2xl">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Extra por si tienen más dudas */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-16 text-center"
                >
                    <p className="text-nppro-gray mb-6 italic">¿Tenés otra pregunta más específica?</p>
                    <a
                        href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Hola%20NP%20PRO%21`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-nppro-green hover:text-black hover:border-nppro-green transition-all group"
                    >
                        <MessageCircle size={20} className="group-hover:fill-current" />
                        Chateá con nosotros
                    </a>

                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;