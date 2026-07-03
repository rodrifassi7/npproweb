import React from 'react';
import { motion } from 'framer-motion';
import { BicepsFlexed, Flame, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';

interface DailySpecialSectionProps {
    dailySpecials: {
        lunch: Product;
        dinner: Product;
    };
}

const DailySpecialSection: React.FC<DailySpecialSectionProps> = ({ dailySpecials }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (product: Product, event: React.MouseEvent<HTMLButtonElement>) => {
        addToCart(product, { useVacuum: false });
        const buttonEl = event.currentTarget;
        import('../../utils/flyToCart').then(({ flyToCart }) => {
            flyToCart(
                buttonEl,
                '#cart-icon-desktop',
                '#cart-icon-mobile',
                product.image
            );
        });
    };

    const specials = [
        { product: dailySpecials.lunch, shift: 'Almuerzo' },
        { product: dailySpecials.dinner, shift: 'Cena' }
    ];

    return (
        <section className="min-h-[100svh] flex flex-col justify-center py-20 md:py-24 relative overflow-hidden bg-[#070707]">
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">

                {/* Header */}
                <div className="mb-12 md:mb-16 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-nppro-green font-black uppercase tracking-[0.5em] text-[9px] md:text-[10px]">
                            Daily Selection
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-none uppercase">
                        Nuestro <span className="text-white/20 italic">Menú</span> de hoy
                    </h2>
                </div>

                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 xl:gap-20">
                    {specials.map(({ product, shift }, index) => {
                        return (
                            <div key={product.id} className="flex flex-col items-center text-center">
                                
                                {/* Imagen */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative group flex justify-center mb-6 md:mb-8 w-full max-w-[220px] md:max-w-[280px]"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden rounded-full border border-white/5 shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>
                                    {/* Decoración flotante sutil */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-nppro-green/5 blur-3xl rounded-full -z-10" />
                                </motion.div>

                                {/* Información */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="inline-flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 bg-nppro-green/10 text-nppro-green rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-nppro-green/20">
                                            {shift}
                                        </span>
                                        <div className="flex items-center gap-1 text-nppro-green">
                                            <Zap size={12} fill="currentColor" />
                                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Recomendado</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black italic mb-4 leading-tight uppercase tracking-tight text-white max-w-sm">
                                        {product.name}
                                    </h3>

                                    <p className="text-nppro-gray text-sm md:text-base font-light leading-relaxed mb-6 max-w-sm">
                                        {product.description}
                                    </p>

                                    {/* Macros compactos */}
                                    {product.macros && (
                                        <div className="flex gap-6 mb-8 pb-6 border-b border-white/5">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                                                    <Flame size={10} /> Energía
                                                </span>
                                                <span className="text-lg md:text-xl font-black italic text-white">{product.macros.kcal} kcal</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                                                    <BicepsFlexed size={10} /> Proteína
                                                </span>
                                                <span className="text-lg md:text-xl font-black italic text-white uppercase">{product.macros.protein}g</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Botón CTA */}
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={(e) => handleAddToCart(product, e)}
                                            className="group relative px-6 md:px-8 py-3 bg-white text-black font-black italic rounded-full text-xs md:text-sm transition-all hover:bg-nppro-green hover:scale-105"
                                        >
                                            AGREGAR AL PEDIDO
                                        </button>
                                        <span className="text-xl md:text-2xl font-black italic text-white/80">${product.price}</span>
                                    </div>
                                </motion.div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default DailySpecialSection;