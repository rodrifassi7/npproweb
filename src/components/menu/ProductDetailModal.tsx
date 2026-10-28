import React, { useState } from 'react';
import { X, ShoppingBag, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MacroInfo, Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { CONFIG } from '../../data/data';
import AnimatedNumber from '../common/AnimatedNumber';

type Variant = 'mass' | 'lean';

const VARIANTS: { id: Variant; label: string; hint: string }[] = [
    { id: 'mass', label: 'MASS', hint: 'Volumen' },
    { id: 'lean', label: 'LEAN', hint: 'Definición' },
];

const MACRO_LABELS: { key: keyof MacroInfo; label: string; unit: string }[] = [
    { key: 'kcal', label: 'Kcal', unit: '' },
    { key: 'protein', label: 'Proteína', unit: 'g' },
    { key: 'carbs', label: 'Carbos', unit: 'g' },
    { key: 'fat', label: 'Grasas', unit: 'g' },
];

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const [useVacuum, setUseVacuum] = useState(false);
    const [variant, setVariant] = useState<Variant>('mass');

    // Cada vez que se abre otro plato, vuelve a MASS y sin vacío
    const [lastProductId, setLastProductId] = useState(product?.id);
    if (product?.id !== lastProductId) {
        setLastProductId(product?.id);
        setVariant('mass');
        setUseVacuum(false);
    }

    const hasLean = !!product?.macrosLean;
    const activeMacros = variant === 'lean' && product?.macrosLean ? product.macrosLean : product?.macros;
    const showMacros = !!activeMacros && activeMacros.kcal > 0;

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, { useVacuum, variant: hasLean ? variant : undefined });
        onClose();
    };

    return (
        <AnimatePresence>
            {product && (
                <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-4xl max-h-[95vh] rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(0,0,0,1)]"
                    >
                        {/* Cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-nppro-green hover:text-black transition-all"
                        >
                            <X size={20} />
                        </button>

                        {/* Área de Imagen (Izquierda/Arriba) — se oculta si el plato todavía no tiene foto */}
                        {product.image && (
                        <div className="md:w-1/2 p-6 md:p-12 flex items-center justify-center relative bg-gradient-to-br from-white/[0.03] to-transparent">
                            <div className="relative w-full aspect-square max-w-[200px] md:max-w-[350px]">
                                {/* Efecto de resplandor bajo el plato */}
                                <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(22,163,74,0.15),transparent)]" />

                                <motion.img
                                    initial={{ rotate: -10, scale: 0.8 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
                                />
                            </div>
                        </div>
                        )}

                        {/* Información (Derecha) */}
                        <div className={`${product.image ? 'md:w-1/2' : 'w-full md:max-w-xl md:mx-auto'} p-8 md:p-12 flex flex-col h-full overflow-y-auto`}>
                            <div className="mb-8">
                                <div className="flex items-center gap-2 text-nppro-green mb-2">
                                    <Zap size={12} fill="currentColor" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Detalle de Producto</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-[0.9]">
                                    {product.name}
                                </h2>
                            </div>

                            {/* Switch MASS / LEAN */}
                            {hasLean && (
                                <div className="mb-4">
                                    <div className="relative grid grid-cols-2 p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
                                        {VARIANTS.map((v) => {
                                            const active = variant === v.id;
                                            return (
                                                <button
                                                    key={v.id}
                                                    onClick={() => setVariant(v.id)}
                                                    aria-pressed={active}
                                                    className={`relative z-10 py-3 rounded-xl flex flex-col items-center leading-none transition-colors ${active ? 'text-black' : 'text-white/50 hover:text-white'}`}
                                                >
                                                    {active && (
                                                        <motion.span
                                                            layoutId="variant-pill"
                                                            className="absolute inset-0 -z-10 bg-nppro-green rounded-xl"
                                                            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                                        />
                                                    )}
                                                    <span className="text-sm font-black italic tracking-wider">{v.label}</span>
                                                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-1 ${active ? 'text-black/60' : 'text-white/30'}`}>{v.hint}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Macros con estilo de "Dashboard" */}
                            {showMacros && activeMacros && (
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    {MACRO_LABELS.map(({ key, label, unit }) => (
                                        <div key={key} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                                            <div className="text-[10px] uppercase text-white/30 font-bold mb-1">{label}</div>
                                            <div className="text-xl font-black italic text-nppro-green">
                                                <AnimatedNumber value={`${activeMacros[key]}${unit}`} duration={600} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Qué lleva el plato */}
                            {product.description && (
                                <p className="text-white/50 text-sm font-light leading-relaxed mb-8">
                                    {product.description}
                                </p>
                            )}

                            {/* Opciones de compra */}
                            <div className="mt-auto space-y-6">
                                {product.vacuumAvailable && (
                                    <button
                                        onClick={() => setUseVacuum(!useVacuum)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${useVacuum
                                            ? 'bg-nppro-green/10 border-nppro-green text-white'
                                            : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${useVacuum ? 'border-nppro-green' : 'border-white/20'}`}>
                                                {useVacuum && <div className="w-2.5 h-2.5 bg-nppro-green rounded-full" />}
                                            </div>
                                            <span className="text-sm font-bold">Envasado al vacío</span>
                                        </div>
                                        <span className="text-xs font-black">+${CONFIG.vacuumExtraPrice}</span>
                                    </button>
                                )}

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Total</span>
                                        <span className="text-3xl font-black text-white italic">
                                            ${product.price + (useVacuum ? CONFIG.vacuumExtraPrice : 0)}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-nppro-green text-black font-black italic py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,255,157,0.2)] uppercase text-sm"
                                    >
                                        <ShoppingBag size={18} strokeWidth={3} />
                                        Agregar al Pedido
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailModal;