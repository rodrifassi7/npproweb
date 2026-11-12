import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Package, Send, ShoppingCart, Snowflake, Ticket, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CONFIG, MENU, PACK_CONFIG, getPackPricePerMeal } from '../data/data';
import type { PackType } from '../data/data';
import type { Variant } from '../types/cart';
import CustomerFields from '../components/order/CustomerFields';
import { formatPrice } from '../utils/format';
import {
    DAYS_ANY, DAYS_FROZEN, PACK_STORAGE_KEY, buildCartOrder, buildOrderMessage, countPackMeals,
    isCustomerReady, loadCustomer, openWhatsApp, saveCustomer, saveOrder,
} from '../utils/order';
import type { Customer, SavedPack } from '../utils/order';

const getSupabase = () => import('../lib/supabase').then(m => m.supabase);

const SINGLE_PRICE = MENU[0]?.price ?? 0;

const option = (active: boolean) =>
    `flex flex-col rounded-2xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green ${active
        ? 'border-nppro-green bg-nppro-green/10'
        : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`;

const Checkout: React.FC = () => {
    const { cart, removeFromCart, setItemVariant, clearCart } = useCart();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer>(loadCustomer);
    const [packType, setPackType] = useState<PackType | null>(null);
    const [allVacuum, setAllVacuum] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    // Cupón
    const [couponCode, setCouponCode] = useState('');
    const [couponStatus, setCouponStatus] = useState<'idle' | 'validating' | 'error'>('idle');
    const [couponMessage, setCouponMessage] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);

    const meals = cart.reduce((acc, item) => acc + item.quantity, 0);
    const packMeals = countPackMeals(cart);
    // Desde 10 comidas es un pack: mismo precio que armándolo en /packs
    const isPack = packMeals >= PACK_CONFIG.BIG_PACK_MEALS;
    const canBePack = !isPack && packMeals >= PACK_CONFIG.MIN_MEALS;

    const order = buildCartOrder(cart, {
        packType,
        allVacuum,
        deliveryType: customer.deliveryType,
        couponPercent: appliedCoupon?.percent,
        couponCode: appliedCoupon?.code,
    });

    const days = isPack && packType === 'frozen' ? DAYS_FROZEN : DAYS_ANY;
    const customerForOrder: Customer = days.includes(customer.deliveryDay) ? customer : { ...customer, deliveryDay: days[0] };
    const updateCustomer = (patch: Partial<Customer>) => setCustomer(prev => ({ ...prev, ...patch }));

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponStatus('validating');
        setCouponMessage('');
        try {
            const supabase = await getSupabase();
            const { data, error } = await supabase.rpc('validate_coupon', {
                input_code: couponCode,
                input_phone: customer.phone || null,
            });
            if (error) throw error;
            if (data.valid) {
                setAppliedCoupon({ code: data.code, percent: data.percent });
                setCouponStatus('idle');
            } else {
                setAppliedCoupon(null);
                setCouponStatus('error');
                setCouponMessage(data.message);
            }
        } catch (err) {
            console.error('Coupon error:', err);
            setAppliedCoupon(null);
            setCouponStatus('error');
            setCouponMessage('No pudimos validar el cupón. Probá de nuevo.');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponStatus('idle');
        setCouponMessage('');
    };

    const canSend = Boolean(order) && isCustomerReady(customer) && !isSubmitting;
    const hint = isPack && !packType
        ? 'Elegí si el pack va congelado o al vacío.'
        : !customer.name.trim()
            ? 'Completá tu nombre para pedir.'
            : !isCustomerReady(customer)
                ? 'Completá la dirección de entrega.'
                : 'Se abre WhatsApp con tu pedido escrito. Solo tenés que enviarlo.';

    const handleCheckout = async () => {
        if (!order || !canSend) return;
        setIsSubmitting(true);
        const message = buildOrderMessage(order, customerForOrder);
        saveCustomer(customerForOrder);
        // WhatsApp primero: si se abre después de esperar al guardado, el celular lo bloquea como ventana emergente
        openWhatsApp(message);
        await saveOrder(order, customerForOrder, message);
        setIsSubmitting(false);
        setSent(true);
    };

    /** De 5 a 9 comidas: las pasa al armador de packs para que elija congelado o al vacío */
    const moveToPack = () => {
        const qty: Record<string, number> = {};
        let lean = 0;
        cart.filter(i => i.packEligible).forEach(i => {
            qty[i.id] = (qty[i.id] ?? 0) + i.quantity;
            if (i.variant === 'lean') lean += i.quantity;
        });
        const goal: Variant = lean > packMeals / 2 ? 'lean' : 'mass';
        const saved: SavedPack = { step: 1, goal, type: null, qty };
        try {
            sessionStorage.setItem(PACK_STORAGE_KEY, JSON.stringify(saved));
        } catch { /* sin storage */ }
        clearCart();
        navigate('/packs');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] pb-24 pt-40 text-center text-white">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.03] p-10">
                        <ShoppingCart size={32} className="mx-auto text-white/40" />
                        <h1 className="mt-6 text-3xl font-black uppercase italic">Tu pedido está vacío</h1>
                        <p className="mt-3 text-white/60">Armá un pack desde {PACK_CONFIG.MIN_MEALS} comidas o sumá platos sueltos desde el menú.</p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link to="/packs" className="rounded-full bg-nppro-green px-7 py-3.5 text-sm font-black uppercase italic text-black">Armar mi pack</Link>
                            <Link to="/menu" className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white/80">Ver el menú</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0B0B] pb-24 pt-28 text-white">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter md:text-7xl">Tu pedido</h1>

                <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-14">
                    <div className="min-w-0 space-y-12">
                        {/* Comidas */}
                        <section aria-labelledby="co-comidas">
                            <div className="flex items-end justify-between gap-3">
                                <h2 id="co-comidas" className="text-2xl font-black">{meals} {meals === 1 ? 'comida' : 'comidas'}</h2>
                                <button type="button" onClick={clearCart} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
                                    <Trash2 size={14} /> Vaciar
                                </button>
                            </div>
                            <ul className="mt-5 space-y-3">
                                {cart.map(item => (
                                    <li key={item.key} className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                                        {item.image
                                            ? <img src={item.image} alt="" loading="lazy" width={640} height={640} className="h-14 w-14 shrink-0 object-contain" />
                                            : <span className="h-14 w-14 shrink-0 rounded-full bg-white/5" aria-hidden="true" />}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold leading-tight">
                                                {item.quantity}x {item.name}
                                                {!isPack && item.useVacuum && !allVacuum && <span className="ml-2 text-xs font-bold text-nppro-green">al vacío</span>}
                                            </p>
                                            {item.variant && (
                                                <div className="mt-2 inline-flex rounded-full border border-white/10 p-0.5 text-xs font-bold" role="radiogroup" aria-label={`Versión de ${item.name}`}>
                                                    {(['mass', 'lean'] as Variant[]).map(v => (
                                                        <button
                                                            key={v}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={item.variant === v}
                                                            onClick={() => setItemVariant(item.key, v)}
                                                            className={`rounded-full px-3 py-1.5 transition-colors ${item.variant === v ? 'bg-nppro-green text-black' : 'text-white/55 hover:text-white'}`}
                                                        >
                                                            {v === 'mass' ? 'Volumen' : 'Definición'}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.key)}
                                            aria-label={`Sacar una ${item.name}`}
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/menu" className="mt-4 inline-block text-sm font-bold text-nppro-green hover:underline">Sumar más comidas</Link>
                        </section>

                        {/* Cómo las quiere */}
                        <section aria-labelledby="co-tipo">
                            {isPack ? (
                                <>
                                    <h2 id="co-tipo" className="text-2xl font-black">Llevás {packMeals} comidas: es un pack</h2>
                                    <p className="mt-2 text-white/55">Tenés precio de pack y envío gratis. Elegí cómo lo querés.</p>
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Tipo de pack">
                                        {(['frozen', 'vacuum'] as PackType[]).map(t => {
                                            const Icon = t === 'frozen' ? Snowflake : Package;
                                            return (
                                                <button key={t} type="button" role="radio" aria-checked={packType === t} onClick={() => setPackType(t)} className={option(packType === t)}>
                                                    <span className="flex items-center gap-2 text-lg font-black uppercase italic"><Icon size={18} className="text-nppro-green" />{t === 'frozen' ? 'Congelado' : 'Al vacío'}</span>
                                                    <span className="mt-1 text-2xl font-black tabular-nums">{formatPrice(getPackPricePerMeal(packMeals, t))} <span className="text-sm font-normal text-white/50">por comida</span></span>
                                                    <span className="mt-1 text-sm text-white/60">{t === 'frozen' ? 'Directo al freezer. Entrega lunes o martes.' : 'Fresco, dura más tiempo en la heladera.'}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 id="co-tipo" className="text-2xl font-black">¿Cómo las querés?</h2>
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Envasado">
                                        <button type="button" role="radio" aria-checked={!allVacuum} onClick={() => setAllVacuum(false)} className={option(!allVacuum)}>
                                            <span className="text-lg font-black uppercase italic">Frescas del día</span>
                                            <span className="mt-1 text-2xl font-black tabular-nums">{formatPrice(SINGLE_PRICE)} <span className="text-sm font-normal text-white/50">por comida</span></span>
                                            <span className="mt-1 text-sm text-white/60">Para comer en 24 a 48 horas.</span>
                                        </button>
                                        <button type="button" role="radio" aria-checked={allVacuum} onClick={() => setAllVacuum(true)} className={option(allVacuum)}>
                                            <span className="text-lg font-black uppercase italic">Al vacío</span>
                                            <span className="mt-1 text-2xl font-black tabular-nums">{formatPrice(SINGLE_PRICE + CONFIG.vacuumExtraPrice)} <span className="text-sm font-normal text-white/50">por comida</span></span>
                                            <span className="mt-1 text-sm text-white/60">Selladas, duran más tiempo frescas en la heladera.</span>
                                        </button>
                                    </div>
                                    {canBePack && (
                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-nppro-green/40 bg-nppro-green/10 p-4">
                                            <p className="text-sm">
                                                Sumá {PACK_CONFIG.BIG_PACK_MEALS - packMeals} más y llegás a {PACK_CONFIG.BIG_PACK_MEALS}: pagás{' '}
                                                <strong>{formatPrice(getPackPricePerMeal(PACK_CONFIG.BIG_PACK_MEALS, 'frozen'))}</strong> cada una y el envío es gratis.
                                            </p>
                                            <button type="button" onClick={moveToPack} className="rounded-full bg-nppro-green px-5 py-2.5 text-sm font-black uppercase italic text-black">Pasarlo a pack</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>

                        {/* Datos */}
                        <section aria-labelledby="co-datos">
                            <h2 id="co-datos" className="text-2xl font-black">¿A dónde te lo llevamos?</h2>
                            <div className="mt-5">
                                <CustomerFields
                                    value={customerForOrder}
                                    onChange={updateCustomer}
                                    days={days}
                                    shippingNote={isPack ? 'Tu pack tiene envío gratis.' : 'El envío de comidas sueltas lo coordinamos por WhatsApp.'}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Resumen */}
                    <aside>
                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 lg:sticky lg:top-28">
                            <h2 className="text-xl font-black">Resumen</h2>
                            {order ? (
                                <dl className="mt-5 space-y-3 text-sm">
                                    {order.perMeal !== null && (
                                        <div className="flex justify-between"><dt className="text-white/55">Por comida (pack)</dt><dd className="tabular-nums">{formatPrice(order.perMeal)}</dd></div>
                                    )}
                                    <div className="flex justify-between"><dt className="text-white/55">{meals} {meals === 1 ? 'comida' : 'comidas'}</dt><dd className="tabular-nums">{formatPrice(order.foodTotal)}</dd></div>
                                    {order.vacuumExtra > 0 && (
                                        <div className="flex justify-between"><dt className="text-white/55">Envasado al vacío</dt><dd className="tabular-nums">+{formatPrice(order.vacuumExtra)}</dd></div>
                                    )}
                                    {order.coupon && (
                                        <div className="flex justify-between font-bold text-nppro-green"><dt>Cupón {order.coupon.code}</dt><dd className="tabular-nums">-{formatPrice(order.coupon.amount)}</dd></div>
                                    )}
                                    {order.shipping !== null && (
                                        <div className="flex justify-between">
                                            <dt className="text-white/55">{customer.deliveryType === 'retiro' ? 'Retiro en el local' : 'Envío'}</dt>
                                            <dd className={order.shipping === 0 ? 'font-bold text-nppro-green' : 'tabular-nums'}>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</dd>
                                        </div>
                                    )}
                                    <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                                        <dt className="font-bold">Total</dt>
                                        <dd className="text-4xl font-black tabular-nums tracking-tight">{formatPrice(order.total)}</dd>
                                    </div>
                                </dl>
                            ) : (
                                <p className="mt-5 text-sm text-white/55">Elegí congelado o al vacío para ver el total.</p>
                            )}

                            {/* Cupón */}
                            <div className="mt-6 border-t border-white/10 pt-5">
                                {!appliedCoupon ? (
                                    <>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={e => setCouponCode(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                                    placeholder="Código de descuento"
                                                    aria-label="Código de descuento"
                                                    className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-3 text-sm focus:border-nppro-green focus:outline-none"
                                                />
                                            </div>
                                            <button type="button" onClick={handleApplyCoupon} disabled={!couponCode || couponStatus === 'validating'} className="rounded-xl bg-white/10 px-4 text-sm font-bold hover:bg-white/20 disabled:opacity-50">
                                                {couponStatus === 'validating' ? <Loader2 className="animate-spin" size={16} /> : 'Aplicar'}
                                            </button>
                                        </div>
                                        {couponStatus === 'error' && <p className="mt-2 text-xs font-bold text-red-400">{couponMessage}</p>}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-between rounded-xl border border-nppro-green/30 bg-nppro-green/10 p-3 text-sm">
                                        <span className="flex items-center gap-2 font-bold text-nppro-green"><Ticket size={14} /> {appliedCoupon.code}: {appliedCoupon.percent}% menos</span>
                                        <button type="button" onClick={removeCoupon} aria-label="Quitar cupón" className="text-nppro-green/70 hover:text-nppro-green"><X size={16} /></button>
                                    </div>
                                )}
                            </div>

                            <p className={`mt-5 text-sm ${canSend ? 'text-nppro-green' : 'text-white/55'}`}>{hint}</p>
                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={!canSend}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-nppro-green py-4 text-sm font-black uppercase italic text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={17} />} Pedir por WhatsApp
                            </button>
                            {sent && (
                                <p className="mt-4 rounded-2xl border border-nppro-green/40 bg-nppro-green/10 p-4 text-sm" role="status">
                                    Te abrimos WhatsApp con el pedido escrito. Tocá enviar para confirmarlo.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
