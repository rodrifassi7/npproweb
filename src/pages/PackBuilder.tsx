import React from 'react';
import { useCart } from '../context/CartContext';
import { MENU, CONFIG, PREMADE_PACKS } from '../data/data';
import { ShoppingCart, ShieldCheck, Flame, Send, Sparkles, Truck, Zap, Snowflake, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import PremadePackCard from '../components/menu/PremadePackCard';

const PackBuilder: React.FC = () => {
    const {
        cart,
        addToCart,
        clearCart,
        subtotal,
        shippingCost,
        total,
        selectedPremadePack,
        setSelectedPremadePack
    } = useCart();

    // Precio base del pack seleccionado (desde PREMADE_PACKS, no de los ítems del carrito)
    const packPrice = selectedPremadePack ? (PREMADE_PACKS[selectedPremadePack]?.price ?? 0) : null;

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
        if (!selectedPremadePack) return;

        const packName = packTitles[selectedPremadePack];
        const platosStr = packItems.map(item => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`).join(', ');
        
        const envioStr = shippingCost === 0 ? ' (envío gratis)' : ` (+ envío $${shippingCost.toLocaleString('es-AR')})`;
        
        const message = `Hola! Quiero el ${packName}.\nPlatos: ${platosStr}\nTotal: $${total.toLocaleString('es-AR')}${envioStr}\nEntrega: lunes / jueves`;

        const link = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        const newWindow = window.open(link, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            window.location.href = link;
        }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
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
        'mass5': 'Pack Congelado x5',
        'mass10': 'Pack Congelado x10',
        'lean5': 'Pack Congelado x5',
        'lean10': 'Pack Congelado x10',
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
                            <div className="flex items-end gap-4 flex-wrap">
                                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                                    Elegí tu <span className="text-nppro-green">Pack</span>
                                </h1>
                                <span className="mb-1 flex items-center gap-1.5 bg-white/10 border border-white/15 text-white text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                                    <Snowflake size={12} className="text-cyan-300" />
                                    Congelados
                                </span>
                            </div>

                            {/* Franja informativa */}
                            <div className="mt-5 flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                                    <Snowflake size={13} className="text-cyan-300 shrink-0" />
                                    <span className="text-[11px] font-bold text-white/70">Cocinado y congelado en el día</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                                    <Truck size={13} className="text-nppro-green shrink-0" />
                                    <span className="text-[11px] font-bold text-white/70">Entregas lunes y jueves</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                                    <Clock size={13} className="text-white/50 shrink-0" />
                                    <span className="text-[11px] font-bold text-white/70">Pedidos hasta viernes 14 hs (entrega lunes) · martes 14 hs (entrega jueves)</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Nav */}
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

                    {/* SECCIÓN DE PACKS */}
                    <div className="flex-1 space-y-20">

                        {/* Fila Lean */}
                        <div id="lean-section" className="scroll-mt-24">
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
                                    name="Pack Congelado x5"
                                    description="Definición semanal"
                                    price={52500}
                                    pricePerUnit={10500}
                                    onAdd={() => handleAddPremadePack('lean5')}
                                    items={[
                                        { name: "Pollo a la Naranja" },
                                        { name: "Pollo con Salsa de Maní" },
                                        { name: "Carne Oriental" },
                                        { name: "Carne Desmenuzada Tex-Mex" },
                                        { name: "Bondiola desmechada con puré de boniato" },
                                    ]}
                                />
                                <PremadePackCard
                                    variant="lean"
                                    type="lean10"
                                    name="Pack Congelado x10"
                                    description="Plan semanal completo"
                                    price={100000}
                                    pricePerUnit={10000}
                                    onAdd={() => handleAddPremadePack('lean10')}
                                    isBestValue={true}
                                    savings="$13.000"
                                    freeShipping={true}
                                    items={[
                                        { name: "Pollo a la Naranja", qty: 2 },
                                        { name: "Pollo con Salsa de Maní", qty: 2 },
                                        { name: "Carne Oriental" },
                                        { name: "Carne Desmenuzada Tex-Mex" },
                                        { name: "Bondiola desmechada con puré de boniato" },
                                        { name: "Cerdo Deshilado con Arroz y Glaseados" },
                                        { name: "Bondiola al Pomelo" },
                                        { name: "NPPRO Rice" },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Divisor Visual */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Fila Mass */}
                        <div id="mass-section" className="scroll-mt-24">
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
                                    name="Pack Congelado x5"
                                    description="Volumen semanal"
                                    price={52500}
                                    pricePerUnit={10500}
                                    onAdd={() => handleAddPremadePack('mass5')}
                                    items={[
                                        { name: "Pollo a la Naranja" },
                                        { name: "Pollo con Salsa de Maní" },
                                        { name: "Carne Oriental" },
                                        { name: "Carne Desmenuzada Tex-Mex" },
                                        { name: "Bondiola desmechada con puré de boniato" },
                                    ]}
                                />
                                <PremadePackCard
                                    variant="mass"
                                    type="mass10"
                                    name="Pack Congelado x10"
                                    description="Alta densidad semanal"
                                    price={100000}
                                    pricePerUnit={10000}
                                    onAdd={() => handleAddPremadePack('mass10')}
                                    isBestValue={true}
                                    savings="$13.000"
                                    freeShipping={true}
                                    items={[
                                        { name: "Pollo a la Naranja", qty: 2 },
                                        { name: "Pollo con Salsa de Maní", qty: 2 },
                                        { name: "Carne Oriental" },
                                        { name: "Carne Desmenuzada Tex-Mex" },
                                        { name: "Bondiola desmechada con puré de boniato" },
                                        { name: "Cerdo Deshilado con Arroz y Glaseados" },
                                        { name: "Bondiola al Pomelo" },
                                        { name: "NPPRO Rice" },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Checkout Sidebar */}
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
                                        <ShieldCheck size={14} /> PACK CONGELADO
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
                                {selectedPremadePack && packPrice !== null ? (
                                    // ── Modo pack: muestra precio fijo del pack + envío
                                    <>
                                        <div className="flex justify-between text-[10px] font-bold uppercase text-white/40">
                                            <span>Precio pack</span>
                                            <span className="font-mono text-white">${packPrice.toLocaleString('es-AR')}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] items-center">
                                            {shippingCost === 0 ? (
                                                <>
                                                    <span className="text-nppro-green font-bold uppercase flex items-center gap-2"><Truck size={14} /> Envío</span>
                                                    <span className="text-nppro-green font-black bg-nppro-green/10 border border-nppro-green/20 px-3 py-1 rounded-xl">GRATIS</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-white/40 font-bold uppercase flex items-center gap-2"><Truck size={14} /> Envío</span>
                                                    <span className="font-mono text-white">${shippingCost.toLocaleString('es-AR')}</span>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    // ── Modo suelto: muestra subtotal
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-white/40">
                                        <span>Subtotal</span>
                                        <span className="font-mono text-white">${subtotal.toLocaleString('es-AR')}</span>
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
