import React, { useState } from 'react';
import { Check, Send, Snowflake, Clock, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MENU, CONFIG, PREMADE_PACKS } from '../data/data';
import FadeIn from '../components/common/FadeIn';
import { formatPrice } from '../utils/format';

type Goal = 'mass' | 'lean';
type Size = 5 | 10;

const GOALS: Record<Goal, { label: string; text: string }> = {
    mass: { label: 'Volumen', text: 'Porciones más grandes y más carbohidratos, para ganar masa muscular.' },
    lean: { label: 'Definición', text: 'Menos calorías con la proteína alta, para bajar grasa sin perder músculo.' },
};

// Envío del pack (igual que en el carrito)
const SHIPPING: Record<Size, number> = { 5: 3500, 10: 0 };
// Precio de cada vianda fresca envasada al vacío, para calcular el ahorro
const FRESH_PRICE = 10800 + CONFIG.vacuumExtraPrice;

const packKey = (goal: Goal, size: Size) => `${goal}${size}`;

const PackBuilder: React.FC = () => {
    const { addToCart, clearCart, selectedPremadePack, setSelectedPremadePack } = useCart();

    // Si ya había un pack elegido (por ejemplo, volviendo del carrito), lo retomamos
    const initialGoal: Goal = selectedPremadePack?.startsWith('lean') ? 'lean' : 'mass';
    const initialSize: Size | null = selectedPremadePack ? (selectedPremadePack.endsWith('10') ? 10 : 5) : null;
    const [goal, setGoal] = useState<Goal>(initialGoal);
    const [size, setSize] = useState<Size | null>(initialSize);

    const selectPack = (g: Goal, s: Size) => {
        const key = packKey(g, s);
        const pack = PREMADE_PACKS[key];
        if (!pack) return;
        clearCart();
        (pack.items as { id: string; qty: number }[]).forEach(item => {
            const product = MENU.find(p => p.id === item.id);
            if (!product) return;
            for (let i = 0; i < item.qty; i++) addToCart(product, { useVacuum: false, variant: g });
        });
        setSelectedPremadePack(key);
        setGoal(g);
        setSize(s);
    };

    const changeGoal = (g: Goal) => {
        if (size) selectPack(g, size);
        else setGoal(g);
    };

    const pack = size ? PREMADE_PACKS[packKey(goal, size)] : null;
    const shipping = size ? SHIPPING[size] : 0;
    const total = pack ? pack.price + shipping : 0;

    // Contenido del pack elegido (o del x10 como vista previa)
    const previewItems = (PREMADE_PACKS[packKey(goal, size ?? 10)].items as { id: string; qty: number }[])
        .map(it => ({ qty: it.qty, product: MENU.find(p => p.id === it.id) }))
        .filter((it): it is { qty: number; product: NonNullable<typeof it.product> } => Boolean(it.product));

    const handleWhatsAppOrder = () => {
        if (!pack || !size) return;
        const platos = previewItems
            .map(({ product, qty }) => `${product.name}${qty > 1 ? ` x${qty}` : ''}`)
            .join(', ');
        const envio = shipping === 0 ? ' (envío gratis)' : ` (incluye envío ${formatPrice(shipping)})`;
        const message =
            `Hola! Quiero el Pack Congelado x${size} - ${GOALS[goal].label}.\n` +
            `Platos: ${platos}\n` +
            `Total: ${formatPrice(total)}${envio}\n` +
            `Entrega: lunes o martes`;
        const link = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        const w = window.open(link, '_blank');
        if (!w || w.closed || typeof w.closed === 'undefined') window.location.assign(link);
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] pb-40 pt-28 text-white lg:pb-24">
            <div className="container mx-auto px-6">
                {/* Encabezado */}
                <FadeIn className="max-w-2xl">
                    <h1 className="text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-7xl">Packs congelados</h1>
                    <p className="mt-5 text-white/60 md:text-lg">
                        Elegí tu objetivo y el tamaño del pack. Lo pedís por WhatsApp y te llega listo para el freezer.
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
                        <li className="flex items-center gap-2"><Snowflake size={15} className="text-nppro-green" />Cocinado y congelado en el día</li>
                        <li className="flex items-center gap-2"><Clock size={15} className="text-nppro-green" />Pedidos hasta el viernes</li>
                        <li className="flex items-center gap-2"><Truck size={15} className="text-nppro-green" />Entrega lunes o martes</li>
                    </ul>
                </FadeIn>

                <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-14">
                    <div className="space-y-14">
                        {/* Paso 1: objetivo */}
                        <FadeIn>
                            <section aria-labelledby="paso-objetivo">
                                <h2 id="paso-objetivo" className="text-2xl font-black md:text-3xl">
                                    <span className="mr-3 text-nppro-green">1</span>Tu objetivo
                                </h2>
                                <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1" role="radiogroup" aria-label="Objetivo">
                                    {(Object.keys(GOALS) as Goal[]).map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            role="radio"
                                            aria-checked={goal === g}
                                            onClick={() => changeGoal(g)}
                                            className={`rounded-full px-7 py-3 text-sm font-black uppercase italic transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green ${goal === g ? 'bg-nppro-green text-black' : 'text-white/60 hover:text-white'}`}
                                        >
                                            {GOALS[g].label}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-4 max-w-md text-white/70">{GOALS[goal].text}</p>
                            </section>
                        </FadeIn>

                        {/* Paso 2: tamaño */}
                        <FadeIn>
                            <section aria-labelledby="paso-tamano">
                                <h2 id="paso-tamano" className="text-2xl font-black md:text-3xl">
                                    <span className="mr-3 text-nppro-green">2</span>El tamaño
                                </h2>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Tamaño del pack">
                                    {([5, 10] as Size[]).map(s => {
                                        const p = PREMADE_PACKS[packKey(goal, s)];
                                        const selected = size === s;
                                        const savings = FRESH_PRICE * p.mealsCount - p.price;
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                onClick={() => selectPack(goal, s)}
                                                className={`relative flex flex-col rounded-[2rem] border p-6 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green md:p-7 ${selected
                                                    ? 'border-nppro-green bg-nppro-green/10'
                                                    : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-2xl font-black uppercase italic tracking-tight">Pack x{s}</span>
                                                    {s === 10 && (
                                                        <span className="rounded-full bg-nppro-green px-3 py-1 text-xs font-bold text-black">El más elegido</span>
                                                    )}
                                                </div>
                                                <span className="mt-6 text-5xl font-black tabular-nums tracking-tight">{formatPrice(p.price / p.mealsCount)}</span>
                                                <span className="mt-1 text-sm text-white/50">por comida ({formatPrice(p.price)} el pack)</span>
                                                <ul className="mt-5 space-y-1.5 text-sm">
                                                    <li className="flex items-center gap-2">
                                                        <Check size={15} strokeWidth={3} className="text-nppro-green" />
                                                        {SHIPPING[s] === 0 ? 'Envío gratis en Trelew' : `Envío ${formatPrice(SHIPPING[s])}`}
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <Check size={15} strokeWidth={3} className="text-nppro-green" />
                                                        Ahorrás {formatPrice(savings)} contra la vianda fresca
                                                    </li>
                                                </ul>
                                                <span className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black uppercase italic ${selected ? 'bg-nppro-green text-black' : 'bg-white text-black'}`}>
                                                    {selected ? <><Check size={16} strokeWidth={3} /> Elegido</> : 'Elegir este pack'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </FadeIn>

                        {/* Qué trae */}
                        <FadeIn>
                            <section aria-labelledby="que-trae">
                                <h2 id="que-trae" className="text-2xl font-black md:text-3xl">
                                    Qué trae el pack x{size ?? 10}
                                </h2>
                                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {previewItems.map(({ product, qty }) => {
                                        const m = goal === 'lean' ? (product.macrosLean ?? product.macros) : product.macros;
                                        return (
                                            <li key={product.id} className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 pr-4">
                                                {product.image ? (
                                                    <img src={product.image} alt="" loading="lazy" decoding="async" width={640} height={640} className="h-16 w-16 shrink-0 object-contain" />
                                                ) : (
                                                    <span className="h-16 w-16 shrink-0 rounded-full bg-white/5" aria-hidden="true" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold leading-tight">{product.name}</p>
                                                    {m && <p className="mt-1 text-sm tabular-nums text-white/50">{m.protein} g de proteína, {m.kcal} kcal</p>}
                                                </div>
                                                {qty > 1 && <span className="shrink-0 text-lg font-black text-nppro-green">x{qty}</span>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        </FadeIn>
                    </div>

                    {/* Resumen: columna en compu */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-28 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
                            <h2 className="text-xl font-black">Tu pedido</h2>
                            {pack && size ? (
                                <>
                                    <p className="mt-4 text-2xl font-black uppercase italic leading-tight">Pack x{size} {GOALS[goal].label}</p>
                                    <dl className="mt-6 space-y-3 text-sm">
                                        <div className="flex justify-between"><dt className="text-white/55">Pack</dt><dd className="tabular-nums">{formatPrice(pack.price)}</dd></div>
                                        <div className="flex justify-between">
                                            <dt className="text-white/55">Envío</dt>
                                            <dd className={shipping === 0 ? 'font-bold text-nppro-green' : 'tabular-nums'}>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd>
                                        </div>
                                        <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                                            <dt className="font-bold">Total</dt>
                                            <dd className="text-4xl font-black tabular-nums tracking-tight">{formatPrice(total)}</dd>
                                        </div>
                                    </dl>
                                </>
                            ) : (
                                <p className="mt-4 text-white/50">Elegí un tamaño de pack para ver el total.</p>
                            )}
                            <button
                                type="button"
                                onClick={handleWhatsAppOrder}
                                disabled={!pack}
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-nppro-green py-4 text-sm font-black uppercase italic text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green"
                            >
                                <Send size={17} /> Pedir por WhatsApp
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Resumen: barra fija en celular */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0B0B] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 lg:hidden">
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        {pack && size ? (
                            <>
                                <p className="truncate text-sm text-white/60">Pack x{size} {GOALS[goal].label}{shipping === 0 ? ', envío gratis' : ''}</p>
                                <p className="text-2xl font-black tabular-nums">{formatPrice(total)}</p>
                            </>
                        ) : (
                            <p className="text-sm text-white/60">Elegí un tamaño de pack</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleWhatsAppOrder}
                        disabled={!pack}
                        className="flex shrink-0 items-center gap-2 rounded-full bg-nppro-green px-6 py-3.5 text-sm font-black uppercase italic text-black disabled:opacity-40"
                    >
                        <Send size={16} /> Pedir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackBuilder;
