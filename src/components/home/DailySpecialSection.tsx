import React from 'react';
import { motion } from 'framer-motion';
import { BicepsFlexed, Flame, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';

interface DailySpecialSectionProps {
    dailySpecial: Product;
}

const DailySpecialSection: React.FC<DailySpecialSectionProps> = ({ dailySpecial }) => {
    const { addToCart } = useCart();
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleAddToCart = () => {
        addToCart(dailySpecial, { useVacuum: false });
        if (buttonRef.current) {
            import('../../utils/flyToCart').then(({ flyToCart }) => {
                flyToCart(
                    buttonRef.current!,
                    '#cart-icon-desktop',
                    '#cart-icon-mobile',
                    dailySpecial.image
                );
            });
        }
    };

    return (
        <section className="py-32 md:py-48 relative overflow-hidden bg-[#070707]">
            <div className="container mx-auto px-6 relative z-10">

                {/* Header más minimalista */}
                <div className="mb-12 md:mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-nppro-green font-black uppercase tracking-[0.5em] text-[10px]">
                            Daily Selection
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none uppercase">
                        Nuestro <span className="text-white/20 italic">Menú</span> de hoy
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">

                        {/* Imagen: Corregida para mostrar el círculo completo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="md:col-span-5 relative group flex justify-center"
                        >
                            {/* 1. aspect-square asegura que el contenedor sea un círculo/cuadrado perfecto.
                                2. overflow-hidden se mantiene por si la imagen original es cuadrada.
                                3. object-contain asegura que NADA se corte.
                            */}
                            <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-full border border-white/5 shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
                                <img
                                    src={dailySpecial.image}
                                    alt={dailySpecial.name}
                                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>

                            {/* Decoración flotante sutil ajustada al círculo */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-nppro-green/5 blur-3xl rounded-full -z-10" />
                        </motion.div>

                        {/* Información */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="md:col-span-7 flex flex-col justify-center"
                        >
                            <div className="inline-flex items-center gap-2 mb-6 text-nppro-green">
                                <Zap size={14} fill="currentColor" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Recomendado</span>
                            </div>

                            <h3 className="text-3xl md:text-5xl font-black italic mb-6 leading-tight uppercase tracking-tight text-white">
                                {dailySpecial.name}
                            </h3>

                            <p className="text-nppro-gray text-base md:text-lg font-light leading-relaxed mb-8 max-w-md">
                                {dailySpecial.description}
                            </p>

                            {/* Macros compactos */}
                            {dailySpecial.macros && (
                                <div className="flex gap-8 mb-10 pb-8 border-b border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1 flex items-center gap-2">
                                            <Flame size={12} /> Energía
                                        </span>
                                        <span className="text-xl font-black italic text-white">{dailySpecial.macros.kcal} kcal</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1 flex items-center gap-2">
                                            <BicepsFlexed size={12} /> Proteina
                                        </span>
                                        <span className="text-xl font-black italic text-white uppercase">{dailySpecial.macros.protein}g</span>
                                    </div>
                                </div>
                            )}

                            {/* Botón CTA */}
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <button
                                    ref={buttonRef}
                                    onClick={handleAddToCart}
                                    className="group relative px-10 py-4 bg-white text-black font-black italic rounded-full text-sm transition-all hover:bg-nppro-green hover:scale-105"
                                >
                                    AGREGAR AL PEDIDO
                                </button>
                                <span className="text-2xl font-black italic text-white/80">${dailySpecial.price}</span>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default DailySpecialSection;