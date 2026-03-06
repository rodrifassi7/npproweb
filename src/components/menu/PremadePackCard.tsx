import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingCart, Truck, Star } from 'lucide-react';
import { MENU } from '../../data/data';

interface PremadePackCardProps {
    type: 'starter' | 'elite';
    name: string;
    mealsCount: number;
    price: number;
    items: { id: string, qty: number }[];
    isMostPopular?: boolean;
    freeShipping?: boolean;
    onAdd: () => void;
}

const PremadePackCard: React.FC<PremadePackCardProps> = ({
    type,
    name,
    mealsCount,
    price,
    items,
    isMostPopular,
    freeShipping,
    onAdd
}) => {
    // Resolve product names from MENU
    const resolvedItems = items.map(item => {
        const product = MENU.find(p => p.id === item.id);
        return {
            name: product?.name || 'Producto desconocido',
            qty: item.qty
        };
    });

    const isElite = type === 'elite';

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={`relative glass p-8 rounded-[2.5rem] border ${isElite ? 'border-nppro-green/30 shadow-[0_0_40px_rgba(22,163,74,0.15)] bg-nppro-green/5' : 'border-white/10'
                } flex flex-col h-full group transition-all duration-500`}
        >
            {isMostPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-nppro-green text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 whitespace-nowrap z-10">
                    <Star size={12} fill="currentColor" /> Más elegido
                </div>
            )}

            <div className="mb-8">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-nppro-green transition-colors">
                        {name}
                    </h3>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-nppro-green">
                        ${price.toLocaleString('es-AR')}
                    </span>
                    <span className="text-nppro-gray font-bold text-sm uppercase tracking-widest">
                        Total
                    </span>
                </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-nppro-gray uppercase tracking-widest mb-4">
                    <span className="w-8 h-px bg-white/10" />
                    Incluye {mealsCount} comidas
                    <span className="w-8 h-px bg-white/10" />
                </div>
                <ul className="space-y-3">
                    {resolvedItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-white/70">
                            <Check size={16} className="text-nppro-green shrink-0 mt-0.5" />
                            <span>
                                <strong className="text-white">{item.qty}x</strong> {item.name}
                            </span>
                        </li>
                    ))}
                    {freeShipping && (
                        <li className="flex items-start gap-3 text-sm text-nppro-green font-bold bg-nppro-green/10 p-2 rounded-xl border border-nppro-green/20">
                            <Truck size={16} className="shrink-0 mt-0.5" />
                            <span>Envío GRATIS incluido</span>
                        </li>
                    )}
                </ul>
            </div>

            <button
                onClick={onAdd}
                className={`w-full py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all ${isElite
                    ? 'bg-nppro-green text-black hover:brightness-110 shadow-[0_10px_20px_rgba(22,163,74,0.3)]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
            >
                <ShoppingCart size={18} />
                Agregar {name.split(' ')[2]}
            </button>

            {isElite && (
                <div className="mt-4 text-center">
                    <p className="text-[10px] text-nppro-green font-bold uppercase tracking-widest animate-pulse">
                        Mejor precio por unidad
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default PremadePackCard;
