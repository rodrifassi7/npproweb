import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MENU, CONFIG } from '../data/data';
import { Minus, Plus, ShoppingCart, Info, ShieldCheck, Flame, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDetailModal from '../components/menu/ProductDetailModal';
import type { Product } from '../types';

const PackBuilder: React.FC = () => {
    const { cart, addToCart, updateQuantity, removeFromCart, currentDiscountTier, subtotal, packDiscount, total } = useCart();

    // States
    const [packType, setPackType] = useState<'volumen' | 'definicion'>('volumen');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const eligibleProducts = MENU.filter(p => p.packEligible);
    const packItems = cart.filter(item => item.packEligible);
    const totalPackQuantity = packItems.reduce((acc, item) => acc + item.quantity, 0);

    // Next tier info
    const nextTier = CONFIG.DISCOUNT_TIERS.find(t => t.min > totalPackQuantity);
    const progress = nextTier
        ? (totalPackQuantity / nextTier.min) * 100
        : 100;

    const handleAdjust = (productId: string, delta: number) => {
        const itemKey = `${productId}_std`;
        const existing = cart.find(item => item.key === itemKey);

        if (!existing) {
            if (delta > 0) {
                const product = MENU.find(p => p.id === productId)!;
                addToCart(product, { useVacuum: false });
            }
            return;
        }

        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
            removeFromCart(itemKey);
        } else {
            updateQuantity(itemKey, newQty);
        }
    };

    const navigate = useNavigate();

    const handleContinueToCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6">

                {/* Header & Pack Type Selector */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">Armador de Packs</h1>
                        <p className="text-nppro-gray max-w-lg">
                            {packType === 'volumen'
                                ? "Maximizá tus ganancias con comidas altas en carbohidratos y proteínas."
                                : "Definí tu cuerpo con opciones bajas en grasas y calorías controladas."}
                        </p>
                    </div>

                    {/* Toggle Pack Type */}
                    <div className="bg-white/5 p-1.5 rounded-2xl flex border border-white/10 shrink-0">
                        <button
                            onClick={() => setPackType('volumen')}
                            className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider flex items-center gap-2 transition-all ${packType === 'volumen' ? 'bg-nppro-green text-black shadow-lg' : 'text-white/40 hover:text-white'
                                }`}
                        >
                            <Scale size={16} /> Volumen
                        </button>
                        <button
                            onClick={() => setPackType('definicion')}
                            className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider flex items-center gap-2 transition-all ${packType === 'definicion' ? 'bg-nppro-green text-black shadow-lg' : 'text-white/40 hover:text-white'
                                }`}
                        >
                            <Flame size={16} /> Definición
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Selection Area */}
                    <div className="flex-1 space-y-4">
                        {eligibleProducts.map((product) => {
                            const cartItem = cart.find(item => item.key === `${product.id}_std`);
                            const qty = cartItem?.quantity || 0;

                            return (
                                <div key={product.id} className="glass p-4 sm:p-6 rounded-3xl flex items-center gap-4 sm:gap-6 group hover:border-nppro-green/30 transition-all">
                                    {/* Clickable Image to open Modal */}
                                    <div
                                        onClick={() => setSelectedProduct(product)}
                                        className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 cursor-pointer shadow-lg hover:scale-105 transition-transform"
                                    >
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3
                                                onClick={() => setSelectedProduct(product)}
                                                className="font-bold text-lg truncate cursor-pointer hover:text-nppro-green transition-colors"
                                            >
                                                {product.name}
                                            </h3>
                                            <button
                                                onClick={() => setSelectedProduct(product)}
                                                className="text-white/30 hover:text-white transition-colors"
                                            >
                                                <Info size={14} />
                                            </button>
                                        </div>

                                        {/* Macros Quick View */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-nppro-green font-black">${product.price}</span>

                                            {product.macros && (
                                                <div className="flex gap-2 text-[10px] text-nppro-gray uppercase font-bold">
                                                    <span>{product.macros.kcal} kcal</span>
                                                    <span className="hidden sm:inline">| P: {product.macros.protein}g</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                                        <button
                                            onClick={() => handleAdjust(product.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-6 text-center font-black">{qty}</span>
                                        <button
                                            onClick={() => handleAdjust(product.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-nppro-green text-white hover:brightness-110 transition-all shadow-lg shadow-nppro-green/20"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Siderbar */}
                    <div className="lg:w-[400px]">
                        <div className="sticky top-32 glass p-8 rounded-[40px] border-white/10">
                            <h2 className="text-2xl font-black mb-8 italic uppercase flex items-center gap-2">
                                <ShoppingCart size={24} className="text-nppro-green" /> Tu Pack
                            </h2>

                            {/* Progress Tracker */}
                            <div className="mb-10">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="text-sm font-bold uppercase tracking-widest text-nppro-gray">
                                        {totalPackQuantity} Viandas elegidas
                                    </div>
                                    {currentDiscountTier && (
                                        <div className="text-nppro-green font-black text-sm">
                                            {currentDiscountTier.discount * 100}% OFF APLICADO
                                        </div>
                                    )}
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-nppro-green shadow-[0_0_15px_rgba(22,163,74,0.5)]"
                                    />
                                </div>
                                {nextTier && (
                                    <div className="bg-white/5 p-4 rounded-2xl text-xs text-nppro-gray leading-relaxed flex items-start gap-3">
                                        <Info size={14} className="shrink-0 mt-0.5 text-nppro-green" />
                                        <span>Llegá a los <strong>{nextTier.min} packs</strong> para desbloquear un <strong>{nextTier.discount * 100}% de descuento</strong>.</span>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-nppro-gray">
                                    <span>Subtotal viandas</span>
                                    <span>${subtotal}</span>
                                </div>
                                {packDiscount > 0 && (
                                    <div className="flex justify-between text-nppro-green font-bold">
                                        <span>Descuento Pack</span>
                                        <span>-${packDiscount}</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                    <div className="font-bold uppercase tracking-tighter">Total aproximado</div>
                                    <div className="text-3xl font-black text-nppro-green">${total}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-nppro-green/10 rounded-2xl border border-nppro-green/20 flex items-center gap-3">
                                    <ShieldCheck size={20} className="text-nppro-green shrink-0" />
                                    <p className="text-xs font-medium">Podés pedir envasado al vacío al confirmar por WhatsApp.</p>
                                </div>

                                <button
                                    onClick={handleContinueToCheckout}
                                    disabled={totalPackQuantity === 0}
                                    className="btn-primary w-full py-4 text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continuar al Pago <ShoppingCart size={18} />
                                </button>

                                <p className="text-[10px] text-nppro-gray text-center uppercase tracking-widest font-bold">
                                    Envío y cupones en el próximo paso
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductDetailModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PackBuilder;
