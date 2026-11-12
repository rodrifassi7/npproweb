import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Minus, Package, Plus, Send, Snowflake, Trash2, Truck } from 'lucide-react';
import { MENU, PACK_CONFIG, getPackPricePerMeal, getPackShipping } from '../data/data';
import type { PackType } from '../data/data';
import type { Product } from '../types';
import type { Variant } from '../types/cart';
import CustomerFields from '../components/order/CustomerFields';
import { formatPrice } from '../utils/format';
import {
    DAYS_ANY, DAYS_FROZEN, PACK_STORAGE_KEY, buildOrderMessage, buildPackOrder, isCustomerReady,
    loadCustomer, openWhatsApp, saveCustomer, saveOrder,
} from '../utils/order';
import type { Customer, SavedPack } from '../utils/order';

const GOALS: Record<Variant, { label: string; tag: string; text: string }> = {
    lean: { label: 'Definición', tag: 'LEAN', text: 'Menos calorías con la proteína alta. Para bajar grasa sin perder músculo.' },
    mass: { label: 'Volumen', tag: 'MASS', text: 'Porciones más grandes y más carbohidratos. Para ganar masa muscular.' },
};

const TYPES: Record<PackType, { label: string; text: string; delivery: string }> = {
    frozen: {
        label: 'Congelado',
        text: 'Va directo al freezer y lo sacás cuando lo vas a comer. Es el más barato.',
        delivery: 'Entrega lunes o martes',
    },
    vacuum: {
        label: 'Al vacío',
        text: 'Fresco, sellado al vacío. Dura hasta 5 días en heladera.',
        delivery: 'El día lo coordinamos por WhatsApp',
    },
};

const STEPS = ['Objetivo', 'Tipo', 'Comidas', 'Datos'];
const PACK_PRODUCTS: Product[] = MENU.filter(p => p.packEligible);
const loadSaved = (): SavedPack => {
    try {
        const raw = sessionStorage.getItem(PACK_STORAGE_KEY);
        if (raw) return { step: 0, goal: null, type: null, qty: {}, ...JSON.parse(raw) };
    } catch { /* sin storage: arrancamos de cero */ }
    return { step: 0, goal: null, type: null, qty: {} };
};

const card = (active: boolean) =>
    `relative flex h-full w-full flex-col rounded-[2rem] border p-6 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green md:p-7 ${active
        ? 'border-nppro-green bg-nppro-green/10'
        : 'border-white/10 bg-white/[0.03] hover:border-white/30'}`;

const PackBuilder: React.FC = () => {
    const [initial] = useState(loadSaved);
    const [goal, setGoal] = useState<Variant | null>(initial.goal);
    const [type, setType] = useState<PackType | null>(initial.type);
    const [qty, setQty] = useState<Record<string, number>>(initial.qty);
    const [wantedStep, setWantedStep] = useState(initial.step);
    const [openDish, setOpenDish] = useState<string | null>(null);
    const [customer, setCustomer] = useState<Customer>(loadCustomer);
    const [sent, setSent] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);

    const selected = PACK_PRODUCTS.filter(p => qty[p.id]).map(p => ({ product: p, qty: qty[p.id] }));
    const meals = selected.reduce((acc, it) => acc + it.qty, 0);

    // No se puede saltear un paso: cada uno se habilita cuando el anterior está completo
    const maxStep = !goal ? 0 : !type ? 1 : meals < PACK_CONFIG.MIN_MEALS ? 2 : 3;
    const step = Math.min(wantedStep, maxStep);

    // Si sale a mirar otra cosa y vuelve, recupera lo que estaba armando
    useEffect(() => {
        try {
            sessionStorage.setItem(PACK_STORAGE_KEY, JSON.stringify({ step, goal, type, qty }));
        } catch { /* sin storage */ }
    }, [step, goal, type, qty]);

    // Cada paso arranca arriba, para que no quede a mitad de pantalla en el celular
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [step]);

    const goTo = (s: number) => {
        setWantedStep(s);
        setSent(false);
    };

    const change = (id: string, delta: number) =>
        setQty(prev => {
            const next = Math.max(0, (prev[id] ?? 0) + delta);
            const copy = { ...prev };
            if (next === 0) delete copy[id];
            else copy[id] = next;
            return copy;
        });

    const updateCustomer = (patch: Partial<Customer>) => setCustomer(prev => ({ ...prev, ...patch }));

    // Congelado se entrega lunes o martes; al vacío, el día que elija o a coordinar
    const days = type === 'frozen' ? DAYS_FROZEN : DAYS_ANY;
    const customerForOrder: Customer = days.includes(customer.deliveryDay) ? customer : { ...customer, deliveryDay: days[0] };

    const order = goal && type && meals > 0
        ? buildPackOrder(selected.map(s => ({ name: s.product.name, quantity: s.qty })), type, goal, customer.deliveryType)
        : null;

    const missing = PACK_CONFIG.MIN_MEALS - meals;
    const toBig = PACK_CONFIG.BIG_PACK_MEALS - meals;
    const mealsHint = !type
        ? ''
        : meals === 0
            ? `Sumá las comidas que quieras. Mínimo ${PACK_CONFIG.MIN_MEALS}.`
            : missing > 0
                ? `Te ${missing === 1 ? 'falta 1 comida' : `faltan ${missing} comidas`} para llegar al mínimo de ${PACK_CONFIG.MIN_MEALS}.`
                : toBig > 0
                    ? `Con ${toBig} más pagás ${formatPrice(getPackPricePerMeal(PACK_CONFIG.BIG_PACK_MEALS, type))} cada una y el envío es gratis.`
                    : 'Tenés el mejor precio por comida y el envío gratis.';

    const canSend = Boolean(order) && step === 3 && isCustomerReady(customer);
    const sendHint = !customer.name.trim()
        ? 'Completá tu nombre para pedir.'
        : customer.deliveryType === 'envio' && !isCustomerReady(customer)
            ? 'Completá la dirección de entrega.'
            : 'Se abre WhatsApp con tu pedido escrito. Solo tenés que enviarlo.';

    const handleSend = () => {
        if (!order || !canSend) return;
        const message = buildOrderMessage(order, customerForOrder);
        saveCustomer(customerForOrder);
        openWhatsApp(message);
        void saveOrder(order, customerForOrder, message);
        setSent(true);
    };

    const startOver = () => {
        setQty({});
        setGoal(null);
        setType(null);
        goTo(0);
    };

    const stepValue = [
        goal ? GOALS[goal].label : '',
        type ? TYPES[type].label : '',
        meals > 0 ? `${meals} ${meals === 1 ? 'comida' : 'comidas'}` : '',
        '',
    ];

    const primary = step === 2
        ? { label: 'Continuar', icon: <ArrowRight size={17} />, disabled: meals < PACK_CONFIG.MIN_MEALS, onClick: () => goTo(3), hint: mealsHint }
        : step === 3
            ? { label: 'Pedir por WhatsApp', icon: <Send size={17} />, disabled: !canSend, onClick: handleSend, hint: sendHint }
            : null;

    return (
        <div className="min-h-screen bg-[#0B0B0B] pb-44 pt-28 text-white lg:pb-24">
            <div className="container mx-auto px-6">
                <header className="max-w-2xl">
                    <h1 className="text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-7xl">Armá tu pack</h1>
                    <p className="mt-5 text-white/60 md:text-lg">
                        Cuatro pasos y lo pedís por WhatsApp. Desde {PACK_CONFIG.MIN_MEALS} comidas; llevando {PACK_CONFIG.BIG_PACK_MEALS} o más
                        pagás menos por cada una y el envío es gratis.
                    </p>
                </header>

                {/* Pasos */}
                <div ref={topRef} className="scroll-mt-24 pt-10">
                    <ol className="grid grid-cols-4 gap-2 md:gap-3">
                        {STEPS.map((label, i) => {
                            const done = i < maxStep && i !== step;
                            const current = i === step;
                            const reachable = i <= maxStep;
                            return (
                                <li key={label}>
                                    <button
                                        type="button"
                                        onClick={() => goTo(i)}
                                        disabled={!reachable}
                                        aria-current={current ? 'step' : undefined}
                                        className={`flex w-full flex-col rounded-2xl border px-2 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green md:px-4 md:py-3 ${current
                                            ? 'border-nppro-green bg-nppro-green/10'
                                            : reachable ? 'border-white/10 hover:border-white/30' : 'border-white/5 opacity-40'}`}
                                    >
                                        <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-white/55 sm:justify-start sm:text-xs">
                                            {done ? <Check size={13} strokeWidth={3} className="text-nppro-green" /> : <span className={current ? 'text-nppro-green' : ''}>{i + 1}</span>}
                                            <span className="truncate">{label}</span>
                                        </span>
                                        <span className="mt-0.5 hidden truncate text-sm font-black sm:block">{stepValue[i] || ' '}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-14">
                    <div className="min-w-0">
                        {/* Paso 1: objetivo */}
                        {step === 0 && (
                            <section aria-labelledby="paso-objetivo" className="page-enter">
                                <h2 id="paso-objetivo" className="text-2xl font-black md:text-3xl">¿Cuál es tu objetivo?</h2>
                                <p className="mt-2 text-white/55">Los platos son los mismos; cambian las porciones y los macros.</p>
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    {(Object.keys(GOALS) as Variant[]).map(g => (
                                        <button key={g} type="button" onClick={() => { setGoal(g); goTo(1); }} className={card(goal === g)}>
                                            <span className="flex items-center justify-between gap-3">
                                                <span className="text-3xl font-black uppercase italic tracking-tight">{GOALS[g].label}</span>
                                                {goal === g && <Check size={20} strokeWidth={3} className="text-nppro-green" />}
                                            </span>
                                            <span className="mt-1 text-sm font-bold text-nppro-green">{GOALS[g].tag}</span>
                                            <span className="mt-4 text-white/70">{GOALS[g].text}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-6 text-sm text-white/50">
                                    ¿No sabés cuál te conviene?{' '}
                                    <Link to="/macros" className="font-bold text-nppro-green hover:underline">Calculá tus macros</Link> y volvé: tu pack queda guardado.
                                </p>
                            </section>
                        )}

                        {/* Paso 2: congelado o al vacío */}
                        {step === 1 && (
                            <section aria-labelledby="paso-tipo" className="page-enter">
                                <h2 id="paso-tipo" className="text-2xl font-black md:text-3xl">¿Cómo lo querés?</h2>
                                <p className="mt-2 text-white/55">Es la misma comida. Cambia cómo la guardás en tu casa.</p>
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    {(Object.keys(TYPES) as PackType[]).map(t => {
                                        const Icon = t === 'frozen' ? Snowflake : Package;
                                        return (
                                            <button key={t} type="button" onClick={() => { setType(t); goTo(2); }} className={card(type === t)}>
                                                <span className="flex items-center justify-between gap-3">
                                                    <span className="flex items-center gap-3 text-3xl font-black uppercase italic tracking-tight">
                                                        <Icon size={24} className="text-nppro-green" />{TYPES[t].label}
                                                    </span>
                                                    {type === t && <Check size={20} strokeWidth={3} className="text-nppro-green" />}
                                                </span>
                                                <span className="mt-4 text-white/70">{TYPES[t].text}</span>
                                                <span className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 tabular-nums">
                                                    <span>
                                                        <span className="block text-xs text-white/50">De {PACK_CONFIG.MIN_MEALS} a {PACK_CONFIG.BIG_PACK_MEALS - 1} comidas</span>
                                                        <span className="block text-xl font-black">{formatPrice(getPackPricePerMeal(PACK_CONFIG.MIN_MEALS, t))}</span>
                                                    </span>
                                                    <span>
                                                        <span className="block text-xs text-white/50">{PACK_CONFIG.BIG_PACK_MEALS} o más</span>
                                                        <span className="block text-xl font-black text-nppro-green">{formatPrice(getPackPricePerMeal(PACK_CONFIG.BIG_PACK_MEALS, t))}</span>
                                                    </span>
                                                </span>
                                                <span className="mt-1 text-xs text-white/45">por comida</span>
                                                <span className="mt-4 flex items-center gap-2 text-sm text-white/55">
                                                    <Truck size={15} className="shrink-0 text-nppro-green" />{TYPES[t].delivery}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="mt-6 text-sm text-white/50">
                                    Envío a domicilio en Trelew: {formatPrice(PACK_CONFIG.SHIPPING)} de {PACK_CONFIG.MIN_MEALS} a {PACK_CONFIG.BIG_PACK_MEALS - 1} comidas,
                                    gratis desde {PACK_CONFIG.BIG_PACK_MEALS}. Retirar en el local no tiene costo.
                                </p>
                            </section>
                        )}

                        {/* Paso 3: comidas */}
                        {step === 2 && goal && (
                            <section aria-labelledby="paso-comidas" className="page-enter">
                                <div className="flex flex-wrap items-end justify-between gap-3">
                                    <h2 id="paso-comidas" className="text-2xl font-black md:text-3xl">Elegí tus comidas</h2>
                                    {meals > 0 && (
                                        <button type="button" onClick={() => setQty({})} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
                                            <Trash2 size={14} /> Vaciar
                                        </button>
                                    )}
                                </div>
                                <p className="mt-2 text-white/55">
                                    Podés repetir las que quieras. Tocá un plato para ver qué trae. Macros en versión {GOALS[goal].label}.
                                </p>
                                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {PACK_PRODUCTS.map(product => {
                                        const m = goal === 'lean' ? (product.macrosLean ?? product.macros) : product.macros;
                                        const q = qty[product.id] ?? 0;
                                        const open = openDish === product.id;
                                        return (
                                            <li
                                                key={product.id}
                                                className={`self-start rounded-2xl border transition-colors ${q > 0 ? 'border-nppro-green/60 bg-nppro-green/[0.06]' : 'border-white/[0.06] bg-white/[0.03]'}`}
                                            >
                                                <div className="flex items-center gap-3 p-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenDish(open ? null : product.id)}
                                                        aria-expanded={open}
                                                        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green"
                                                    >
                                                        {product.image ? (
                                                            <img src={product.image} alt="" loading="lazy" decoding="async" width={640} height={640} className="h-16 w-16 shrink-0 object-contain" />
                                                        ) : (
                                                            <span className="h-16 w-16 shrink-0 rounded-full bg-white/5" aria-hidden="true" />
                                                        )}
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block font-bold leading-tight">{product.name}</span>
                                                            {m && <span className="mt-1 block text-sm tabular-nums text-white/50">{m.protein} g proteína · {m.kcal} kcal</span>}
                                                            <span className="mt-1 flex items-center gap-1 text-xs font-bold text-nppro-green">
                                                                {open ? 'Ocultar' : 'Ver qué trae'}
                                                                <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                                                            </span>
                                                        </span>
                                                    </button>
                                                    <div className="flex shrink-0 items-center gap-1">
                                                        {q > 0 && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => change(product.id, -1)}
                                                                    aria-label={`Sacar una ${product.name}`}
                                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white hover:border-white/40"
                                                                >
                                                                    <Minus size={16} strokeWidth={3} />
                                                                </button>
                                                                <span className="w-6 text-center text-lg font-black tabular-nums" aria-live="polite">{q}</span>
                                                            </>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => change(product.id, 1)}
                                                            aria-label={`Sumar una ${product.name}`}
                                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-nppro-green text-black transition-transform hover:scale-105 active:scale-95"
                                                        >
                                                            <Plus size={18} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {open && (
                                                    <div className="border-t border-white/10 px-4 pb-4 pt-3 text-sm">
                                                        <p className="text-white/70">{product.description}</p>
                                                        {m && (
                                                            <dl className="mt-3 grid grid-cols-4 gap-2 text-center tabular-nums">
                                                                {([['Kcal', m.kcal, ''], ['Proteína', m.protein, ' g'], ['Carbos', m.carbs, ' g'], ['Grasas', m.fat, ' g']] as const).map(([l, v, u]) => (
                                                                    <div key={l} className="rounded-xl bg-white/5 py-2">
                                                                        <dd className="font-black">{v}{u}</dd>
                                                                        <dt className="text-[11px] text-white/45">{l}</dt>
                                                                    </div>
                                                                ))}
                                                            </dl>
                                                        )}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}

                        {/* Paso 4: datos */}
                        {step === 3 && order && type && (
                            <section aria-labelledby="paso-datos" className="page-enter">
                                <h2 id="paso-datos" className="text-2xl font-black md:text-3xl">¿A dónde te lo llevamos?</h2>
                                <p className="mt-2 text-white/55">Con esto el pedido llega completo y no hay que preguntarte nada más.</p>
                                <div className="mt-6">
                                    <CustomerFields
                                        value={customerForOrder}
                                        onChange={updateCustomer}
                                        days={days}
                                        shippingNote={order.shipping === 0
                                            ? 'Tu pack tiene envío gratis.'
                                            : `El envío de este pack sale ${formatPrice(getPackShipping(meals))}. Con ${PACK_CONFIG.BIG_PACK_MEALS} comidas o más es gratis.`}
                                    />
                                </div>
                                {sent && (
                                    <div className="mt-8 rounded-2xl border border-nppro-green/40 bg-nppro-green/10 p-5" role="status">
                                        <p className="font-bold">Te abrimos WhatsApp con el pedido escrito.</p>
                                        <p className="mt-1 text-sm text-white/70">Tocá enviar en WhatsApp para confirmarlo. Si no se abrió, volvé a tocar “Pedir por WhatsApp”.</p>
                                        <button type="button" onClick={startOver} className="mt-3 text-sm font-bold text-nppro-green hover:underline">Armar otro pack</button>
                                    </div>
                                )}
                            </section>
                        )}

                        {step > 0 && (
                            <button type="button" onClick={() => goTo(step - 1)} className="mt-10 flex items-center gap-2 text-sm font-bold text-white/55 hover:text-white">
                                <ArrowLeft size={16} /> Volver al paso anterior
                            </button>
                        )}
                    </div>

                    {/* Resumen: columna en compu */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-28 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
                            <h2 className="text-xl font-black">Tu pack</h2>
                            <dl className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between gap-3"><dt className="text-white/55">Objetivo</dt><dd className="font-bold">{goal ? GOALS[goal].label : '—'}</dd></div>
                                <div className="flex justify-between gap-3"><dt className="text-white/55">Tipo</dt><dd className="font-bold">{type ? TYPES[type].label : '—'}</dd></div>
                                <div className="flex justify-between gap-3"><dt className="text-white/55">Comidas</dt><dd className="font-bold tabular-nums">{meals}</dd></div>
                            </dl>

                            {selected.length > 0 && (
                                <ul className="mt-5 max-h-56 space-y-1.5 overflow-y-auto border-t border-white/10 pt-4 text-sm">
                                    {selected.map(({ product, qty: q }) => (
                                        <li key={product.id} className="flex justify-between gap-3">
                                            <span className="text-white/75">{product.name}</span>
                                            <span className="shrink-0 font-bold tabular-nums">x{q}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {order && (
                                <dl className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
                                    <div className="flex justify-between"><dt className="text-white/55">Por comida</dt><dd className="tabular-nums">{formatPrice(order.perMeal ?? 0)}</dd></div>
                                    <div className="flex justify-between"><dt className="text-white/55">Comidas</dt><dd className="tabular-nums">{formatPrice(order.foodTotal)}</dd></div>
                                    <div className="flex justify-between">
                                        <dt className="text-white/55">{customer.deliveryType === 'retiro' ? 'Retiro en el local' : 'Envío'}</dt>
                                        <dd className={order.shipping === 0 ? 'font-bold text-nppro-green' : 'tabular-nums'}>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping ?? 0)}</dd>
                                    </div>
                                    <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                                        <dt className="font-bold">Total</dt>
                                        <dd className="text-4xl font-black tabular-nums tracking-tight">{formatPrice(order.total)}</dd>
                                    </div>
                                </dl>
                            )}

                            {primary && (
                                <>
                                    <p className={`mt-5 text-sm ${primary.disabled ? 'text-white/55' : 'text-nppro-green'}`}>{primary.hint}</p>
                                    <button
                                        type="button"
                                        onClick={primary.onClick}
                                        disabled={primary.disabled}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-nppro-green py-4 text-sm font-black uppercase italic text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green"
                                    >
                                        {primary.icon} {primary.label}
                                    </button>
                                </>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Resumen: barra fija en celular, desde que hay comidas para elegir */}
            {primary && (
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0B0B] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
                    <p className={`mb-2 text-xs ${primary.disabled ? 'text-white/55' : 'text-nppro-green'}`}>{primary.hint}</p>
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="truncate text-sm text-white/60">
                                {meals} {meals === 1 ? 'comida' : 'comidas'}{type ? ` · ${TYPES[type].label}` : ''}{goal ? ` · ${GOALS[goal].label}` : ''}
                            </p>
                            <p className="text-2xl font-black tabular-nums">{order ? formatPrice(order.total) : '—'}</p>
                        </div>
                        <button
                            type="button"
                            onClick={primary.onClick}
                            disabled={primary.disabled}
                            className="flex shrink-0 items-center gap-2 rounded-full bg-nppro-green px-6 py-3.5 text-sm font-black uppercase italic text-black disabled:opacity-40"
                        >
                            {primary.icon} {step === 3 ? 'Pedir' : primary.label}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackBuilder;
