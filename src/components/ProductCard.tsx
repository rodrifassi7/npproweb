import React from 'react';
import { Plus, Info, Zap } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
    onViewDetail?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl overflow-hidden group flex flex-col h-full border border-white/5"
        >
            {/* Contenedor de Imagen: Ajustado para platos redondos */}
            <div className="relative aspect-square p-6 flex items-center justify-center overflow-hidden">
                {/* Fondo decorativo detrás del plato */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Badges: Reposicionados para no tapar el plato */}
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-10">
                    {product.isDailySpecial && (
                        <span className="bg-nppro-green text-black text-[9px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Zap size={10} fill="currentColor" /> Menú
                        </span>
                    )}


                </div>
            </div>

            <div className="p-6 pt-0 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold group-hover:text-nppro-green transition-colors leading-tight uppercase italic tracking-tight">
                        {product.name}
                    </h3>
                </div>

                <p className="text-nppro-gray text-xs line-clamp-2 mb-6 flex-1">
                    {product.description}
                </p>

                <div className="flex items-center justify-between gap-4 mt-auto">
                    <div className="flex flex-col">
                        {/* Removed Price Display */}
                        {/* <span className="text-[10px] text-white/30 uppercase font-bold">Precio</span>
                        <span className="text-xl font-black text-white italic">${product.price}</span> */}

                        {/* Show Macros if available */}
                        {product.macros && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-white/40 uppercase font-bold">Macros / Porción</span>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-nppro-gray">
                                    <span className="flex items-center gap-1"><Zap size={10} className="text-nppro-green" /> {product.macros.kcal} kcal</span>
                                    <span>P: {product.macros.protein}g</span>
                                    <span>C: {product.macros.carbs}g</span>
                                    <span>G: {product.macros.fat}g</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => onViewDetail?.(product)}
                            className="h-12 px-4 rounded-2xl bg-white/5 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors text-white/70 hover:text-white font-bold text-[10px] uppercase tracking-wider"
                            title="Ver detalles"
                        >
                            <Info size={16} /> Más info
                        </button>
                        <button
                            onClick={() => addToCart(product, { useVacuum: false })}
                            className="w-12 h-12 bg-nppro-green rounded-2xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all text-black shadow-[0_0_20px_rgba(0,255,157,0.2)]"
                        >
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;