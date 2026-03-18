import React from 'react';
import { useCart } from '../../context/CartContext';
import { Zap, Flame, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PackItem {
    name: string;
    qty?: number;
    kcal: number;
    prot: number;
}

interface PremadePackCardProps {
    type: string;
    name: string;
    description: string;
    price: number;
    onAdd: () => void;
    items: PackItem[];
    totalKcal: string;
    totalProt: string;
    variant: 'lean' | 'mass'; // <-- Nueva prop para diferenciar visualmente
}

const PremadePackCard: React.FC<PremadePackCardProps> = ({
    type, name, description, price, onAdd, items, totalKcal, totalProt, variant
}) => {
    const { selectedPremadePack } = useCart();
    const isSelected = selectedPremadePack === type;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`relative flex flex-col h-full overflow-hidden rounded-[32px] p-6 transition-all duration-500 border z-10 ${isSelected
                    ? 'bg-nppro-green/10 border-nppro-green shadow-[0_0_40px_rgba(22,163,74,0.15)]'
                    : 'bg-[#0D0D0D] border-white/5 hover:border-white/10'
                }`}
        >
            {/* Marca de agua gigante en el fondo para diferenciar Lean vs Mass */}
            <div className={`absolute -bottom-4 -right-2 font-black italic select-none pointer-events-none z-0 transition-opacity duration-500 ${variant === 'mass' ? 'text-white/[0.03] text-8xl' : 'text-nppro-green/[0.03] text-8xl'
                }`}>
                {variant === 'mass' ? 'MASS' : 'LEAN'}
            </div>

            {/* Acento superior de color */}
            {variant === 'lean' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
            )}
            {variant === 'mass' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nppro-green/50 to-transparent opacity-50" />
            )}

            {/* Header de la Tarjeta */}
            <div className="mb-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${variant === 'mass' ? 'bg-nppro-green/10 text-nppro-green' : 'bg-white/10 text-white'
                        }`}>
                        {variant === 'mass' ? <Zap size={24} /> : <Flame size={24} />}
                    </div>
                    {type.includes('10') && (
                        <span className="bg-nppro-green text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(22,163,74,0.4)]">
                            Mejor Valor
                        </span>
                    )}
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-tight">
                    {name}
                </h3>
                <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${variant === 'mass' ? 'text-nppro-green opacity-80' : 'text-white/50'
                    }`}>
                    {description}
                </p>
            </div>

            {/* Lista de Contenido */}
            <div className="flex-1 space-y-3 mb-6 relative z-10">
                <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-2">Incluye (Al Vacío):</p>
                {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col border-b border-white/5 pb-2 last:border-0">
                        <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-white/90 leading-tight">
                                {item.qty && item.qty > 1 && <span className="text-nppro-green mr-1">{item.qty}x</span>}
                                {item.name}
                            </span>
                        </div>
                        <div className="flex gap-2 mt-1 text-[9px] font-black uppercase tracking-widest text-white/40">
                            <span>{item.kcal} kcal</span>
                            <span className="text-white/10">•</span>
                            <span>{item.prot}g prot</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totales del Pack */}
            <div className="bg-black/50 rounded-2xl p-4 mb-6 flex justify-between items-center border border-white/5 relative z-10 backdrop-blur-sm">
                <div className="text-center flex-1">
                    <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Total Kcal</p>
                    <p className="text-sm font-black text-white">{totalKcal}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center flex-1">
                    <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Total Prot</p>
                    <p className="text-sm font-black text-nppro-green">{totalProt}</p>
                </div>
            </div>

            {/* Footer con Precio y Acción */}
            <div className="mt-auto space-y-4 relative z-10">
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-black tracking-tighter text-white">${price.toLocaleString('es-AR')}</span>
                </div>

                <button
                    onClick={onAdd}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${isSelected
                            ? 'bg-nppro-green text-black shadow-[0_0_20px_rgba(22,163,74,0.3)]'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/5 hover:border-white/20'
                        }`}
                >
                    {isSelected ? (
                        <><CheckCircle2 size={16} /> Seleccionado</>
                    ) : (
                        'Elegir Pack'
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default PremadePackCard;