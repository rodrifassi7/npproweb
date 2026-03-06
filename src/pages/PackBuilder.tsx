import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MENU, CONFIG, PREMADE_PACKS } from '../data/data';
import { Minus, Plus, ShoppingCart, Info, ShieldCheck, Flame, Scale, Send, Sparkles, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDetailModal from '../components/menu/ProductDetailModal';
import PremadePackCard from '../components/menu/PremadePackCard';
import { createWhatsAppLink } from '../utils/whatsapp';
import type { Product } from '../types';

const PackBuilder: React.FC = () => {
    const {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        currentDiscountTier,
        subtotal,
        packDiscount,
        total,
        selectedPremadePack,
        setSelectedPremadePack
    } = useCart();

    const [packType, setPackType] = useState<'volumen' | 'definicion'>('volumen');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const eligibleProducts = MENU.filter(p => p.packEligible);
    const packItems = cart.filter(item => item.packEligible);
    const totalPackQuantity = packItems.reduce((acc, item) => acc + item.quantity, 0);

    const nextTier = CONFIG.DISCOUNT_TIERS.find(t => t.min > totalPackQuantity);
    const progress = nextTier ? (totalPackQuantity / nextTier.min) * 100 : 100;

    const handleAdjust = (productId: string, delta: number) => {
        if (selectedPremadePack) setSelectedPremadePack(null);
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

    const handleAddPremadePack = (type: 'starter' | 'elite') => {
        clearCart();
        const pack = PREMADE_PACKS[type];
        pack.items.forEach(item => {
            const product = MENU.find(p => p.id === item.id);
            if (product) {
                for (let i = 0; i < item.qty; i++) {
                    addToCart(product, { useVacuum: false });
                }
            }
        });
        setSelectedPremadePack(type);
        if (window.innerWidth < 1024) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    };

    const handleWhatsAppOrder = () => {
        const items = packItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            vacuum: item.useVacuum
        }));

        // PHONE NUMBER: Using config
        const PHONE = CONFIG.WHATSAPP_NUMBER;

        const link = createWhatsAppLink(
            PHONE,
            packType,
            items,
            total,
            currentDiscountTier?.discount
        );
        window.open(link, '_blank');
    };

    return (
        <div className="pt-24 pb-24 min-h-screen bg-[#050505] text-white">
            <div className="container mx-auto px-6">

                {/* Header Estilo Editorial */}
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-12">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-nppro-green mb-4">
                            <span className="h-px w-8 bg-nppro-green"></span>
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Build Your Performance</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                            Elegí tu <span className="text-nppro-green">Pack</span>
                        </h1>
                        <p className="text-white/50 mt-6 text-lg md:text-xl font-medium leading-relaxed">
                            Diseñado para atletas. Seleccioná una configuración predeterminada o personalizá cada caloría de tu semana.
                        </p>
                    </div>
                </header>

                {/* 1. PREMADE PACKS - Tarjetas más limpias */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
                    <PremadePackCard
                        type="starter"
                        {...PREMADE_PACKS.starter}
                        onAdd={() => handleAddPremadePack('starter')}
                    />
                    <PremadePackCard
                        type="elite"
                        {...PREMADE_PACKS.elite}
                        onAdd={() => handleAddPremadePack('elite')}
                    />
                </section>

                {/* Sub-header con Selector de Objetivo */}
                <div id="builder-section" className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tight">Armado Personalizado</h2>
                        <p className="text-nppro-gray text-sm uppercase font-bold tracking-widest mt-1">Selección individual de viandas</p>
                    </div>

                    <div className="bg-white/5 p-1 rounded-2xl flex border border-white/10 backdrop-blur-md">
                        {[
                            { id: 'volumen', icon: Scale, label: 'Volumen' },
                            { id: 'definicion', icon: Flame, label: 'Definición' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setPackType(t.id as any)}
                                className={`px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all duration-300 ${packType === t.id ? 'bg-nppro-green text-black shadow-[0_0_20px_rgba(22,163,74,0.3)]' : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                <t.icon size={16} /> {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Lista de Productos - Estilo Minimalista */}
                    <div className="flex-1 space-y-3">
                        {eligibleProducts.map((product) => {
                            const qty = cart.find(item => item.key === `${product.id}_std`)?.quantity || 0;
                            return (
                                <motion.div
                                    layout
                                    key={product.id}
                                    className={`group flex items-center gap-4 p-3 rounded-3xl transition-all duration-500 border ${qty > 0 ? 'bg-white/[0.03] border-nppro-green/30' : 'bg-transparent border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div
                                        onClick={() => setSelectedProduct(product)}
                                        className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-2xl"
                                    >
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        {qty > 0 && (
                                            <div className="absolute inset-0 bg-nppro-green/20 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="text-black bg-nppro-green w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">{qty}</span>
                                            </div>
                                        )}
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
                                            {/* Price hidden/commented as per general requirement, verify if needed here. 
                                                User said "Remove/hide the price on the menu cards". 
                                                Here it is a list. I will keep price small or hide it? 
                                                The previous code showed price. I will keep it for now as it's a builder 
                                                but make it consistent. 
                                                WAIT: "Remove/hide the price on the menu cards". 
                                                This is a "builder card". I'll keep the price as it's crucial for totals, 
                                                but I can make it subtle. Actually, the total relies on it. 
                                                I'll leave it but maybe make it less prominent if requested, 
                                                but functionality-wise it's needed for the $Subtotal logic.
                                                However, user said "until costs/pricing are ready". 
                                                IF costs are not ready, maybe I should hide it here too?
                                                "Show macros on each card". I will emphasize macros.
                                             */}
                                            {/* Re-evaluating: If price is hidden on cards, user implies pricing is not final. 
                                                But the cart calculates totals. 
                                                The user asked to hide price on "Menu cards". 
                                                I will hide unit price here too to be consistent, OR show "Consultar".
                                                BUT, the cart works with prices. 
                                                For now I'll keep the price here because the Cart Sidebar SHOWS totals. 
                                                If I hide it here, totals become magical. 
                                                User goal: "Replace any broken checkout flow with WhatsApp ordering". 
                                                WhatsApp order includes "Total items", checking plan... "Valor aprox". 
                                                So prices ARE used. 
                                                I will keep the price here but maybe emphasize macros more.
                                             */}
                                            {/* <span className="text-nppro-green font-black">${product.price}</span> */}
                                            {/* I will keep it visible as the logic uses it. */}
                                            <span className="text-nppro-green font-black">${product.price}</span>

                                            {product.macros && (
                                                <div className="flex gap-3 text-[10px] text-white/30 uppercase font-bold tracking-tighter">
                                                    <span>{product.macros.kcal} kcal</span>
                                                    <span>P: {product.macros.protein}g</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center bg-black/40 rounded-2xl border border-white/5 p-1">
                                        <button
                                            onClick={() => handleAdjust(product.id, -1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className={`w-8 text-center font-black ${qty > 0 ? 'text-nppro-green' : 'text-white/20'}`}>{qty}</span>
                                        <button
                                            onClick={() => handleAdjust(product.id, 1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-nppro-green text-black hover:scale-105 transition-all shadow-lg"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Checkout Sidebar - Estilo Floating Card */}
                    <aside className="lg:w-[420px]">
                        <div className="sticky top-28 bg-[#0D0D0D] border border-white/10 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-nppro-green/5 blur-[80px] rounded-full pointer-events-none" />

                            <h2 className="text-xl font-black mb-8 italic uppercase flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <ShoppingCart size={20} className="text-nppro-green" />
                                    Tu Selección
                                </span>
                                {totalPackQuantity > 0 && (
                                    <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-nppro-gray not-italic font-bold tracking-widest">
                                        {totalPackQuantity} ITEMS
                                    </span>
                                )}
                            </h2>

                            {selectedPremadePack ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 rounded-3xl bg-nppro-green text-black relative">
                                    <Sparkles size={40} className="absolute right-4 top-4 opacity-20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pack Inteligente</span>
                                    <h3 className="text-2xl font-black italic uppercase leading-none mt-1">
                                        {selectedPremadePack === 'starter' ? 'Pro Starter' : 'Pro Elite'}
                                    </h3>
                                    <p className="text-xs font-bold mt-2 flex items-center gap-1">
                                        <ShieldCheck size={14} /> LISTO PARA ENVIAR
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="mb-10">
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Progreso del Pack</span>
                                        {currentDiscountTier && (
                                            <span className="text-nppro-green font-black text-[10px] px-2 py-1 bg-nppro-green/10 rounded-md animate-pulse">
                                                {currentDiscountTier.discount * 100}% OFF ACTIVADO
                                            </span>
                                        )}
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-nppro-green shadow-[0_0_20px_rgba(22,163,74,0.6)]"
                                        />
                                    </div>
                                    {nextTier && (
                                        <p className="text-[11px] text-white/40 font-medium leading-relaxed italic">
                                            Agregá <span className="text-white font-bold">{nextTier.min - totalPackQuantity}</span> más para el <span className="text-nppro-green font-bold">{nextTier.discount * 100}% OFF</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Totales */}
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="font-mono">${subtotal.toLocaleString('es-AR')}</span>
                                </div>
                                {packDiscount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-nppro-green font-bold uppercase tracking-widest text-[10px]">Descuento Aplicado</span>
                                        <span className="text-nppro-green font-mono">-${packDiscount.toLocaleString('es-AR')}</span>
                                    </div>
                                )}
                                {selectedPremadePack === 'elite' && (
                                    <div className="flex justify-between text-sm items-center bg-nppro-green/5 p-2 rounded-xl border border-nppro-green/10">
                                        <span className="text-nppro-green font-bold text-[10px] uppercase flex items-center gap-2"><Truck size={14} /> Envío Bonificado</span>
                                        <span className="text-nppro-green text-[10px] font-black">FREE</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                    <span className="font-black uppercase italic text-lg">Total</span>
                                    <div className="text-right">
                                        <span className="block text-4xl font-black text-white tracking-tighter">
                                            ${total.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleWhatsAppOrder}
                                disabled={totalPackQuantity === 0}
                                className="btn-primary w-full py-4 text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} /> Pedir por WhatsApp
                            </button>

                            <p className="text-[10px] text-nppro-gray text-center uppercase tracking-widest font-bold">
                                Sin pago online • Coordinación directa
                            </p>
                        </div>
                        <p className="text-[9px] text-center text-white/30 uppercase font-black tracking-[0.2em] mt-4">
                            Pago seguro al recibir o coordinar
                        </p>
            </aside>
        </div>
            </div >

    <AnimatePresence>
        {selectedProduct && (
            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        )}
    </AnimatePresence>
        </div >
    );
};

export default PackBuilder;