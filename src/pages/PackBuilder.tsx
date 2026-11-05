import React, { useEffect, useState } from 'react';
import { Check, Send, Snowflake, Package, Minus, Plus, Truck, Trash2 } from 'lucide-react';
import { MENU, CONFIG, PACK_CONFIG, getPackPricePerMeal, getPackShipping } from '../data/data';
import type { PackType } from '../data/data';
import type { Product } from '../types';
import FadeIn from '../components/common/FadeIn';
import { formatPrice } from '../utils/format';

type Goal = 'mass' | 'lean';

const TYPES: Record<PackType, { label: string; text: string; delivery: string }> = {
    frozen: {
        label: 'Congelado',
        text: 'Va directo al freezer y lo sacás cuando lo vas a comer.',
        delivery: 'Entrega lunes o martes',
    },
    vacuum: {
        label: 'Al vacío',
        text: `Fresco, sellado al vacío: dura hasta 5 días en heladera. Suma ${formatPrice(PACK_CONFIG.VACUUM_EXTRA_PER_MEAL)} por comida por la bolsa.`,
        delivery: 'Coordinamos el día de entrega por WhatsApp',
    },
};

const GOALS: Record<Goal, { label: string; text: string }> = {
    mass: { label: 'Volumen', text: 'Porciones más grandes y más carbohidratos, para ganar masa muscular.' },
    lean: { label: 'Definición', text: 'Menos calorías con la proteína alta, para bajar grasa sin perder músculo.' },
};

const PACK_PRODUCTS: Product[] = MENU.filter(p => p.packEligible);
const STORAGE_KEY = 'nppro_pack_v2';

type Saved = { type: PackType | null; goal: Goal; qty: Record<string, number> };

const loadSaved = (): Saved => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Saved;
    } catch { /* sin storage: arrancamos de cero */ }
    return { type: null, goal: 'mass', qty: {} };
};

const PackBuilder: React.FC = () => {
    const [initial] = useState(loadSaved);
    const [type, setType] = useState<PackType | null>(initial.type);
    const [goal, setGoal] = useState<Goal>(initial.goal);
    const [qty, setQty] = useState<Record<string, number>>(initial.qty);

    // Si vuelve a la página (por ejemplo, después de mirar la carta), recupera lo que estaba armando
    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ type, goal, qty }));
        } catch { /* sin storage */ }
    }, [type, goal, qty]);

    const change = (id: string, delta: number) =>
        setQty(prev => {
            const next = Math.max(0, (prev[id] ?? 0) + delta);
            const copy = { ...prev };
            if (next === 0) delete copy[id];
            else copy[id] = next;
            return copy;
        });

    const selected = PACK_PRODUCTS
        .filter(p => qty[p.id])
        .map(p => ({ product: p, qty: qty[p.id] }));
    const meals = selected.reduce((acc, it) => acc + it.qty, 0);

    const packType: PackType = type ?? 'frozen';
    const perMeal = getPackPricePerMeal(meals, packType);
    const shipping = getPackShipping(meals);
    const subtotal = perMeal * meals;
    const total = subtotal + shipping;
    const ready = Boolean(type) && meals >= PACK_CONFIG.MIN_MEALS;

    // Mensaje que guía al cliente
    const missing = PACK_CONFIG.MIN_MEALS - meals;
    const toBig = PACK_CONFIG.BIG_PACK_MEALS - meals;
    const hint = !type
        ? 'Elegí si lo querés congelado o al vacío.'
        : meals === 0
            ? `Sumá las comidas que quieras. Mínimo ${PACK_CONFIG.MIN_MEALS}.`
            : missing > 0
                ? `Te ${missing === 1 ? 'falta 1 comida' : `faltan ${missing} comidas`} para armar el pack.`
                : toBig > 0
                    ? `Sumá ${toBig} más y pagás ${formatPrice(getPackPricePerMeal(PACK_CONFIG.BIG_PACK_MEALS, packType))} cada una, con envío gratis.`
                    : 'Tenés el mejor precio por comida y el envío gratis.';

    const handleWhatsAppOrder = () => {
        if (!ready || !type) return;
        const platos = selected.map(({ product, qty: q }) => `- ${product.name} x${q}`).join('\n');
        const envio = shipping === 0 ? 'gratis' : formatPrice(shipping);
        const message =
            `Hola! Quiero armar un pack ${TYPES[type].label.toLowerCase()} de ${meals} comidas - ${GOALS[goal].label}.\n` +
            `${platos}\n` +
            `Precio por comida: ${formatPrice(perMeal)}\n` +
            `Envío: ${envio}\n` +
            `Total: ${formatPrice(total)}\n` +
            (type === 'frozen' ? 'Entrega: lunes o martes' : 'Entrega: a coordinar');
        const link = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        const w = window.open(link, '_blank');
        if (!w || w.closed || typeof w.closed === 'undefined') window.location.assign(link);
    };

    const stepClass = (active: boolean) =>
        `relative flex flex-col rounded-[2rem] border p-6 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green md:p-7 ${active
            ? 'border-nppro-green bg-nppro-green/10'
            : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`;

    return (
        <div className="min-h-screen bg-[#0B0B0B] pb-40 pt-28 text-white lg:pb-24">
            <div className="container mx-auto px-6">
                {/* Encabezado */}
                <FadeIn className="max-w-2xl">
                    <h1 className="text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-7xl">Armá tu pack</h1>
                    <p className="mt-5 text-white/60 md:text-lg">
                        Elegís cómo lo querés y qué comidas lleva. Desde {PACK_CONFIG.MIN_MEALS} comidas pagás menos por cada una,
                        y desde {PACK_CONFIG.BIG_PACK_MEALS} el envío es gratis.
                    </p>
                </FadeIn>

                <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-14">
                    <div className="space-y-14">
                        {/* Paso 1: congelado o al vacío */}
                        <FadeIn>
                            <section aria-labelledby="paso-tipo">
                                <h2 id="paso-tipo" className="text-2xl font-black md:text-3xl">
                                    <span className="mr-3 text-nppro-green">1</span>Cómo lo querés
                                </h2>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Tipo de pack">
                                    {(Object.keys(TYPES) as PackType[]).map(t => {
                                        const active = type === t;
                                        const Icon = t === 'frozen' ? Snowflake : Package;
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                role="radio"
                                                aria-checked={active}
                                                onClick={() => setType(t)}
                                                className={stepClass(active)}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tight">
                                                        <Icon size={22} className="text-nppro-green" />{TYPES[t].label}
                                                    </span>
                                                    {active && <Check size={20} strokeWidth={3} className="text-nppro-green" />}
                                                </div>
                                                <span className="mt-5 text-4xl font-black tabular-nums tracking-tight">
                                                    {formatPrice(getPackPricePerMeal(PACK_CONFIG.BIG_PACK_MEALS, t))}
                                                </span>
                                                <span className="mt-1 text-sm text-white/50">
                                                    por comida desde {PACK_CONFIG.BIG_PACK_MEALS} ({formatPrice(getPackPricePerMeal(PACK_CONFIG.MIN_MEALS, t))} de {PACK_CONFIG.MIN_MEALS} a {PACK_CONFIG.BIG_PACK_MEALS - 1})
                                                </span>
                                                <p className="mt-4 text-sm text-white/70">{TYPES[t].text}</p>
                                                <p className="mt-3 flex items-center gap-2 text-sm text-white/50">
                                                    <Truck size={15} className="text-nppro-green" />{TYPES[t].delivery}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </FadeIn>

                        {/* Paso 2: objetivo */}
                        <FadeIn>
                            <section aria-labelledby="paso-objetivo">
                                <h2 id="paso-objetivo" className="text-2xl font-black md:text-3xl">
                                    <span className="mr-3 text-nppro-green">2</span>Tu objetivo
                                </h2>
                                <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1" role="radiogroup" aria-label="Objetivo">
                                    {(Object.keys(GOALS) as Goal[]).map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            role="radio"
                                            aria-checked={goal === g}
                                            onClick={() => setGoal(g)}
                                            className={`rounded-full px-7 py-3 text-sm font-black uppercase italic transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green ${goal === g ? 'bg-nppro-green text-black' : 'text-white/60 hover:text-white'}`}
                                        >
                                            {GOALS[g].label}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-4 max-w-md text-white/70">{GOALS[goal].text}</p>
                            </section>
                        </FadeIn>

                        {/* Paso 3: comidas */}
                        <FadeIn>
                            <section aria-labelledby="paso-comidas">
                                <div className="flex flex-wrap items-end justify-between gap-3">
                                    <h2 id="paso-comidas" className="text-2xl font-black md:text-3xl">
                                        <span className="mr-3 text-nppro-green">3</span>Elegí tus comidas
                                    </h2>
                                    {meals > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setQty({})}
                                            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
                                        >
                                            <Trash2 size={14} /> Vaciar
                                        </button>
                                    )}
                                </div>
                                <p className="mt-2 text-white/55">Podés repetir las que quieras.</p>
                                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {PACK_PRODUCTS.map(product => {
                                        const m = goal === 'lean' ? (product.macrosLean ?? product.macros) : product.macros;
                                        const q = qty[product.id] ?? 0;
                                        return (
                                            <li
                                                key={product.id}
                                                className={`flex items-center gap-4 rounded-2xl border p-3 pr-3 transition-colors ${q > 0 ? 'border-nppro-green/60 bg-nppro-green/[0.06]' : 'border-white/[0.06] bg-white/[0.03]'}`}
                                            >
                                                {product.image ? (
                                                    <img src={product.image} alt="" loading="lazy" decoding="async" width={640} height={640} className="h-16 w-16 shrink-0 object-contain" />
                                                ) : (
                                                    <span className="h-16 w-16 shrink-0 rounded-full bg-white/5" aria-hidden="true" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold leading-tight">{product.name}</p>
                                                    {m && <p className="mt-1 text-sm tabular-nums text-white/50">{m.protein} g de proteína, {m.kcal} kcal</p>}
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1">
                                                    {q > 0 && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => change(product.id, -1)}
                                                                aria-label={`Sacar una ${product.name}`}
                                                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white hover:border-white/40"
                                                            >
                                                                <Minus size={16} strokeWidth={3} />
                                                            </button>
                                                            <span className="w-7 text-center text-lg font-black tabular-nums" aria-live="polite">{q}</span>
                                                        </>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => change(product.id, 1)}
                                                        aria-label={`Agregar una ${product.name}`}
                                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95"
                                                    >
                                                        <Plus size={16} strokeWidth={3} />
                                                    </button>
                                                </div>
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
                            <h2 className="text-xl font-black">Tu pack</h2>
                            <p className="mt-4 text-2xl font-black uppercase italic leading-tight">
                                {meals} {meals === 1 ? 'comida' : 'comidas'}
                                {type && <span className="text-nppro-green"> · {TYPES[type].label}</span>}
                            </p>
                            <p className="mt-1 text-sm text-white/55">{GOALS[goal].label}</p>

                            {selected.length > 0 && (
                                <ul className="mt-5 max-h-56 space-y-1.5 overflow-y-auto text-sm">
                                    {selected.map(({ product, qty: q }) => (
                                        <li key={product.id} className="flex justify-between gap-3">
                                            <span className="text-white/75">{product.name}</span>
                                            <span className="shrink-0 font-bold tabular-nums">x{q}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {meals > 0 && type && (
                                <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                                    <div className="flex justify-between"><dt className="text-white/55">Por comida</dt><dd className="tabular-nums">{formatPrice(perMeal)}</dd></div>
                                    <div className="flex justify-between"><dt className="text-white/55">Comidas</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
                                    <div className="flex justify-between">
                                        <dt className="text-white/55">Envío</dt>
                                        <dd className={shipping === 0 ? 'font-bold text-nppro-green' : 'tabular-nums'}>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd>
                                    </div>
                                    <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                                        <dt className="font-bold">Total</dt>
                                        <dd className="text-4xl font-black tabular-nums tracking-tight">{formatPrice(total)}</dd>
                                    </div>
                                </dl>
                            )}

                            <p className={`mt-5 text-sm ${ready ? 'text-nppro-green' : 'text-white/55'}`}>{hint}</p>

                            <button
                                type="button"
                                onClick={handleWhatsAppOrder}
                                disabled={!ready}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-nppro-green py-4 text-sm font-black uppercase italic text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green"
                            >
                                <Send size={17} /> Pedir por WhatsApp
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Resumen: barra fija en celular */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0B0B] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
                <p className={`mb-2 text-xs ${ready ? 'text-nppro-green' : 'text-white/55'}`}>{hint}</p>
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <p className="truncate text-sm text-white/60">
                            {meals} {meals === 1 ? 'comida' : 'comidas'}{type ? ` · ${TYPES[type].label}` : ''}{meals > 0 && type && shipping === 0 ? ' · envío gratis' : ''}
                        </p>
                        <p className="text-2xl font-black tabular-nums">{meals > 0 && type ? formatPrice(total) : '—'}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleWhatsAppOrder}
                        disabled={!ready}
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
