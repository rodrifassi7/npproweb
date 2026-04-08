import React from 'react';
import { useCart } from '../context/CartContext';
import { MENU, CONFIG, PREMADE_PACKS } from '../data/data';
import { ShoppingCart, ShieldCheck, Flame, Send, Sparkles, Truck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import PremadePackCard from '../components/menu/PremadePackCard';
import { createWhatsAppLink } from '../utils/whatsapp';

const PackBuilder: React.FC = () => {
    const {
        cart,
        addToCart,
        clearCart,
        subtotal,
        packDiscount,
        total,
        selectedPremadePack,
        setSelectedPremadePack
    } = useCart();

    const packItems = cart.filter((item: any) => item.packEligible);

    const handleAddPremadePack = (type: string) => {
        clearCart();
        const pack = PREMADE_PACKS[type];
        if (!pack) return;

        pack.items.forEach((item: { id: string, qty: number }) => {
            const product = MENU.find(p => p.id === item.id);
            if (product) {
                for (let i = 0; i < item.qty; i++) {
                    addToCart(product, { useVacuum: false });
                }
            }
        });
        setSelectedPremadePack(type);
    };

    const handleWhatsAppOrder = () => {
        const items = packItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            vacuum: item.useVacuum
        }));

        const PHONE = CONFIG.WHATSAPP_NUMBER;
        const objective = selectedPremadePack?.includes('mass') ? 'volumen' : 'definicion';
        const link = createWhatsAppLink(PHONE, objective, items, total, packDiscount > 0 ? (packDiscount / subtotal) : 0);

        window.open(link, '_blank');
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Espacio para el navbar fijo si tienes uno
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const packTitles: Record<string, string> = {
        'mass5': 'Pack Mass x5',
        'mass10': 'Pack Mass x10',
        'lean5': 'Pack Lean x5',
        'lean10': 'Pack Lean x10'
    };

    return (
        <div className="pt-24 pb-24 min-h-screen bg-[#050505] text-white font-sans">
            <div className="container mx-auto px-6">

                {/* Header Principal */}
                <header className="mb-10 border-b border-white/5 pb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-nppro-green mb-4">
                                <span className="h-px w-8 bg-nppro-green"></span>
                                <span className="text-xs font-black uppercase tracking-[0.3em]">Performance Meal Prep</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                                Elegí tu <span className="text-nppro-green">Pack</span>
                            </h1>
                        </div>

                        {/* Quick Nav para evitar la "Falsa Base" */}
                        <div className="flex gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                            <button
                                onClick={() => scrollToSection('lean-section')}
                                className="px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors text-white"
                            >
                                <Flame size={16} /> Definición
                            </button>
                            <button
                                onClick={() => scrollToSection('mass-section')}
                                className="px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors text-nppro-green"
                            >
                                <Zap size={16} /> Volumen
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* SECCIÓN DE PACKS PREDEFINIDOS */}
                    <div className="flex-1 space-y-20">

                        {/* Fila Lean */}
                        <div id="lean-section" className="scroll-mt-24">
                            {/* Títulos Centrados */}
                            <div className="flex flex-col items-center justify-center text-center mb-10">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 shadow-lg">
                                    <Flame size={32} />
                                </div>
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Objetivo: Definición</h2>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-2">Déficit calórico • Retención muscular</p>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <PremadePackCard
                                    variant="lean"
                                    type="lean5"
                                    name="Pack Lean x5"
                                    description="Corte y definición"
                                    price={49000}
                                    onAdd={() => handleAddPremadePack('lean5')}
                                    totalKcal="~2.395"
                                    totalProt="~246g"
                                    items={[
                                        { name: "Carne Estilo Oriental", kcal: 490, prot: 48 },
                                        { name: "Carne Asada con Verduras", kcal: 430, prot: 50 },
                                        { name: "NPPRO Rice", kcal: 505, prot: 50 },
                                        { name: "Lemon Chicken", kcal: 480, prot: 52 },
                                        { name: "Cerdo con Batata y Repollo", kcal: 490, prot: 46 },
                                    ]}
                                />
                                <PremadePackCard
                                    variant="lean"
                                    type="lean10"
                                    name="Pack Lean x10"
                                    description="Plan semanal extremo"
                                    price={95000}
                                    onAdd={() => handleAddPremadePack('lean10')}
                                    totalKcal="~4.830"
                                    totalProt="~480g"
                                    items={[
                                        { name: "Carne Oriental", qty: 2, kcal: 980, prot: 96 },
                                        { name: "Carne Asada", qty: 2, kcal: 860, prot: 100 },
                                        { name: "NPPRO Rice", qty: 2, kcal: 1010, prot: 100 },
                                        { name: "Lemon Chicken", qty: 2, kcal: 960, prot: 104 },
                                        { name: "Mix Cerdo & Bondiola", qty: 2, kcal: 1020, prot: 90 },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Divisor Visual */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Fila Mass */}
                        <div id="mass-section" className="scroll-mt-24">
                            {/* Títulos Centrados */}
                            <div className="flex flex-col items-center justify-center text-center mb-10">
                                <div className="w-16 h-16 rounded-full bg-nppro-green/10 border border-nppro-green/20 flex items-center justify-center text-nppro-green mb-4 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                                    <Zap size={32} />
                                </div>
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Objetivo: Volumen</h2>
                                <p className="text-nppro-green/60 text-xs font-bold uppercase tracking-[0.2em] mt-2">Superávit calórico • Fuerza</p>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <PremadePackCard
                                    variant="mass"
                                    type="mass5"
                                    name="Pack Mass x5"
                                    description="Aumento de masa y fuerza"
                                    price={55000}
                                    onAdd={() => handleAddPremadePack('mass5')}
                                    totalKcal="~3.400"
                                    totalProt="~254g"
                                    items={[
                                        { name: "NPPRO Rice", kcal: 720, prot: 52 },
                                        { name: "Carne Estilo Oriental", kcal: 680, prot: 50 },
                                        { name: "Bondiola Braseada", kcal: 700, prot: 48 },
                                        { name: "Cerdo con Batata y Repollo", kcal: 670, prot: 48 },
                                        { name: "Lemon Chicken", kcal: 630, prot: 54 },
                                    ]}
                                />
                                <PremadePackCard
                                    variant="mass"
                                    type="mass10"
                                    name="Pack Mass x10"
                                    description="Alta densidad semanal"
                                    price={105000}
                                    onAdd={() => handleAddPremadePack('mass10')}
                                    totalKcal="~6.740"
                                    totalProt="~508g"
                                    items={[
                                        { name: "NPPRO Rice", qty: 2, kcal: 1440, prot: 104 },
                                        { name: "Carne Oriental", qty: 2, kcal: 1360, prot: 100 },
                                        { name: "Bondiola Braseada", qty: 2, kcal: 1400, prot: 96 },
                                        { name: "Cerdo con Batata", qty: 2, kcal: 1340, prot: 96 },
                                        { name: "Mix Lemon & Asada", qty: 2, kcal: 1210, prot: 106 },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Checkout Sidebar - Fijo */}
                    <aside className="lg:w-[400px]">
                        <div className="sticky top-28 bg-[#0D0D0D] border border-white/10 rounded-[40px] p-8 shadow-2xl">
                            <h2 className="text-xl font-black mb-8 italic uppercase flex items-center gap-2">
                                <ShoppingCart size={20} className="text-nppro-green" /> Tu Selección
                            </h2>

                            {selectedPremadePack ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-6 rounded-3xl bg-nppro-green text-black relative overflow-hidden shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                                    <Sparkles size={80} className="absolute -right-6 -top-6 opacity-10" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pack Listo</span>
                                    <h3 className="text-3xl font-black italic uppercase leading-none mt-1">
                                        {packTitles[selectedPremadePack]}
                                    </h3>
                                    <p className="text-xs font-bold mt-4 flex items-center gap-1 bg-black/10 w-fit px-3 py-1.5 rounded-full">
                                        <ShieldCheck size={14} /> LISTO PARA PREPARAR
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="mb-8 p-8 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center gap-4 bg-white/[0.02]">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                        <ShoppingCart size={24} className="text-white/20" />
                                    </div>
                                    <p className="text-xs text-white/40 uppercase font-bold tracking-widest leading-relaxed">
                                        Seleccioná un pack <br /> para comenzar
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-white/40">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-white">${subtotal.toLocaleString('es-AR')}</span>
                                </div>
                                {packDiscount > 0 && (
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-nppro-green">
                                        <span>Descuento</span>
                                        <span className="font-mono">-${packDiscount.toLocaleString('es-AR')}</span>
                                    </div>
                                )}
                                {(selectedPremadePack === 'mass10' || selectedPremadePack === 'lean10') && (
                                    <div className="flex justify-between text-[10px] items-center bg-nppro-green/5 p-3 rounded-xl border border-nppro-green/20">
                                        <span className="text-nppro-green font-bold uppercase flex items-center gap-2"><Truck size={14} /> Envío Bonificado</span>
                                        <span className="text-nppro-green font-black">FREE</span>
                                    </div>
                                )}
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <span className="font-black uppercase italic text-lg text-white">Total</span>
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        ${total.toLocaleString('es-AR')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleWhatsAppOrder}
                                disabled={!selectedPremadePack}
                                className="w-full bg-nppro-green text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
                            >
                                <Send size={18} /> Coordinar Pedido
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default PackBuilder;