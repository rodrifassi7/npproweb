import { CONFIG, MENU, PACK_CONFIG, getPackPricePerMeal, getPackShipping } from '../data/data';
import type { PackType } from '../data/data';
import type { CartItem, Variant } from '../types/cart';
import { formatPrice } from './format';

/**
 * Todo lo que arma un pedido pasa por acá: precios, mensaje de WhatsApp y guardado.
 * Lo usan las dos formas de pedir (armar pack y carrito de la carta), así nunca dicen cosas distintas.
 */

export const GOAL_LABEL: Record<Variant, string> = {
    mass: 'Volumen (MASS)',
    lean: 'Definición (LEAN)',
};

export const TYPE_LABEL: Record<PackType, string> = {
    frozen: 'Congelado',
    vacuum: 'Envasado al vacío',
};

/** Pack a medio armar (queda guardado mientras la pestaña esté abierta) */
export const PACK_STORAGE_KEY = 'nppro_pack_v3';
export type SavedPack = { step: number; goal: Variant | null; type: PackType | null; qty: Record<string, number> };

// ─── Datos del cliente ─────────────────────────────────────────────

export interface Customer {
    name: string;
    phone: string;
    deliveryType: 'envio' | 'retiro';
    address: string;
    references: string;
    deliveryDay: string;
    paymentMethod: string;
    notes: string;
}

export const PAYMENT_METHODS = ['Transferencia', 'Mercado Pago', 'Efectivo'];
export const DAY_TO_COORDINATE = 'A coordinar';
export const DAYS_ANY = [DAY_TO_COORDINATE, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const DAYS_FROZEN = ['Lunes', 'Martes'];

const CUSTOMER_KEY = 'nppro_customer_v1';
const EMPTY_CUSTOMER: Customer = {
    name: '',
    phone: '',
    deliveryType: 'envio',
    address: '',
    references: '',
    deliveryDay: DAY_TO_COORDINATE,
    paymentMethod: PAYMENT_METHODS[0],
    notes: '',
};

/** Recuerda nombre, teléfono y dirección en el celular del cliente para el próximo pedido */
export const loadCustomer = (): Customer => {
    try {
        const raw = localStorage.getItem(CUSTOMER_KEY);
        if (raw) return { ...EMPTY_CUSTOMER, ...JSON.parse(raw), notes: '' };
    } catch { /* sin storage */ }
    return EMPTY_CUSTOMER;
};

export const saveCustomer = (c: Customer) => {
    try {
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c));
    } catch { /* sin storage */ }
};

export const isCustomerReady = (c: Customer) =>
    c.name.trim().length > 1 && (c.deliveryType === 'retiro' || c.address.trim().length > 3);

// ─── Pedido ────────────────────────────────────────────────────────

export interface OrderLine {
    name: string;
    quantity: number;
    goal: Variant | null;
    vacuum: boolean;
}

export interface Order {
    kind: 'pack' | 'sueltas';
    packType: PackType | null;       // solo en packs
    lines: OrderLine[];
    meals: number;
    perMeal: number | null;          // solo en packs
    foodTotal: number;               // comidas, sin extras ni envío
    vacuumExtra: number;             // solo en comidas sueltas
    shipping: number | null;         // null: no se cobra por la web (se coordina)
    coupon: { code: string; amount: number } | null;
    total: number;
}

const unitPrice = (productId: string) => MENU.find(p => p.id === productId)?.price ?? 0;

/** Pack armado en /packs: todas las comidas del mismo tipo y objetivo */
export const buildPackOrder = (
    items: { name: string; quantity: number }[],
    type: PackType,
    goal: Variant,
    deliveryType: Customer['deliveryType'],
): Order => {
    const meals = items.reduce((acc, it) => acc + it.quantity, 0);
    const perMeal = getPackPricePerMeal(meals, type);
    const foodTotal = perMeal * meals;
    const shipping = deliveryType === 'retiro' ? 0 : getPackShipping(meals);
    return {
        kind: 'pack',
        packType: type,
        lines: items.map(it => ({ name: it.name, quantity: it.quantity, goal, vacuum: type === 'vacuum' })),
        meals,
        perMeal,
        foodTotal,
        vacuumExtra: 0,
        shipping,
        coupon: null,
        total: foodTotal + shipping,
    };
};

/** Cuántas comidas del carrito cuentan para pack */
export const countPackMeals = (cart: CartItem[]) =>
    cart.reduce((acc, it) => (it.packEligible ? acc + it.quantity : acc), 0);

/**
 * Carrito de la carta.
 * Hasta 9 comidas son sueltas ($10.800, +$500 al vacío).
 * Desde 10 es un pack: precio de pack según congelado o al vacío, y envío gratis.
 * Devuelve null si es pack y todavía no eligió el tipo.
 */
export const buildCartOrder = (
    cart: CartItem[],
    opts: { packType: PackType | null; allVacuum: boolean; deliveryType: Customer['deliveryType']; couponPercent?: number; couponCode?: string },
): Order | null => {
    const meals = cart.reduce((acc, it) => acc + it.quantity, 0);
    const packMeals = countPackMeals(cart);
    const isPack = packMeals >= PACK_CONFIG.BIG_PACK_MEALS;
    if (isPack && !opts.packType) return null;

    let foodTotal = 0;
    let vacuumExtra = 0;
    let perMeal: number | null = null;
    let shipping: number | null = null;

    const lines: OrderLine[] = cart.map(it => {
        const vacuum = isPack && it.packEligible ? opts.packType === 'vacuum' : it.useVacuum || opts.allVacuum;
        return { name: it.name, quantity: it.quantity, goal: it.variant, vacuum };
    });

    if (isPack && opts.packType) {
        perMeal = getPackPricePerMeal(packMeals, opts.packType);
        foodTotal = perMeal * packMeals;
        // Lo que no entra en pack (si algún día hay postres, por ejemplo) va a su precio
        cart.filter(it => !it.packEligible).forEach(it => { foodTotal += unitPrice(it.id) * it.quantity; });
        shipping = opts.deliveryType === 'retiro' ? 0 : getPackShipping(packMeals);
    } else {
        cart.forEach((it, i) => {
            foodTotal += unitPrice(it.id) * it.quantity;
            if (lines[i].vacuum) vacuumExtra += CONFIG.vacuumExtraPrice * it.quantity;
        });
    }

    const couponAmount = opts.couponPercent ? Math.round(foodTotal * (opts.couponPercent / 100)) : 0;
    const coupon = opts.couponCode && couponAmount > 0 ? { code: opts.couponCode, amount: couponAmount } : null;

    return {
        kind: isPack ? 'pack' : 'sueltas',
        packType: isPack ? opts.packType : null,
        lines,
        meals,
        perMeal,
        foodTotal,
        vacuumExtra,
        shipping,
        coupon,
        total: foodTotal + vacuumExtra + (shipping ?? 0) - couponAmount,
    };
};

const describeGoal = (lines: OrderLine[]) => {
    const goals = new Set(lines.map(l => l.goal).filter(Boolean) as Variant[]);
    if (goals.size === 1) return GOAL_LABEL[[...goals][0]];
    if (goals.size > 1) return 'Mixto (ver cada comida)';
    return null;
};

const describeStorage = (order: Order) => {
    if (order.kind === 'pack' && order.packType) {
        return order.packType === 'frozen' ? 'CONGELADO (va al freezer)' : 'ENVASADO AL VACÍO (fresco, heladera)';
    }
    const vac = order.lines.filter(l => l.vacuum).length;
    if (vac === 0) return 'Frescas del día (sin vacío)';
    if (vac === order.lines.length) return 'ENVASADAS AL VACÍO';
    return 'Mixto (ver cada comida)';
};

/** El mensaje que llega al WhatsApp de NPPRO. Solo texto y asteriscos: se lee igual en cualquier celular. */
export const buildOrderMessage = (order: Order, customer: Customer): string => {
    const goal = describeGoal(order.lines);
    const mixedGoal = new Set(order.lines.map(l => l.goal)).size > 1;
    const mixedVacuum = order.kind === 'sueltas' && new Set(order.lines.map(l => l.vacuum)).size > 1;
    const comidas = `${order.meals} ${order.meals === 1 ? 'comida' : 'comidas'}`;

    const out: string[] = ['*NUEVO PEDIDO NPPRO*', ''];

    out.push(order.kind === 'pack' && order.packType
        ? `*PACK ${order.packType === 'frozen' ? 'CONGELADO' : 'AL VACÍO'} de ${comidas}*`
        : `*COMIDAS SUELTAS: ${comidas}*`);
    out.push(`Conservación: ${describeStorage(order)}`);
    if (goal) out.push(`Objetivo: ${goal}`);

    out.push('', '*COMIDAS*');
    order.lines.forEach(l => {
        const tags: string[] = [];
        if (mixedGoal && l.goal) tags.push(l.goal === 'mass' ? 'Volumen' : 'Definición');
        if (mixedVacuum && l.vacuum) tags.push('al vacío');
        out.push(`- ${l.quantity}x ${l.name}${tags.length ? ` (${tags.join(', ')})` : ''}`);
    });

    out.push('', '*PRECIO*');
    if (order.perMeal !== null) out.push(`Por comida: ${formatPrice(order.perMeal)}`);
    out.push(`Comidas: ${formatPrice(order.foodTotal)}`);
    if (order.vacuumExtra > 0) out.push(`Envasado al vacío: +${formatPrice(order.vacuumExtra)}`);
    if (order.coupon) out.push(`Cupón ${order.coupon.code}: -${formatPrice(order.coupon.amount)}`);
    if (order.shipping !== null && customer.deliveryType === 'envio') {
        out.push(`Envío: ${order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}`);
    }
    out.push(`*TOTAL: ${formatPrice(order.total)}*`);

    out.push('', '*DATOS*');
    out.push(`Nombre: ${customer.name.trim()}`);
    if (customer.phone.trim()) out.push(`Teléfono: ${customer.phone.trim()}`);
    if (customer.deliveryType === 'envio') {
        out.push('Entrega: Envío a domicilio');
        out.push(`Dirección: ${customer.address.trim()}`);
        if (customer.references.trim()) out.push(`Referencias: ${customer.references.trim()}`);
    } else {
        out.push(`Entrega: Retiro en el local (${CONFIG.PICKUP_ADDRESS})`);
    }
    out.push(`Día: ${customer.deliveryDay}`);
    out.push(`Pago: ${customer.paymentMethod}`);
    if (customer.notes.trim()) out.push(`Notas: ${customer.notes.trim()}`);

    return out.join('\n');
};

export const openWhatsApp = (message: string) => {
    const link = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const w = window.open(link, '_blank');
    if (!w || w.closed || typeof w.closed === 'undefined') window.location.assign(link);
};

/** Guarda el pedido en el sistema (NP Admin). Si falla, el pedido por WhatsApp sigue igual. */
export const saveOrder = async (order: Order, customer: Customer, message: string) => {
    try {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase.from('orders').insert([{
            customer_name: customer.name.trim(),
            phone: customer.phone.trim(),
            delivery: customer.deliveryType === 'envio',
            status: 'nuevo',
            subtotal: order.foodTotal + order.vacuumExtra,
            total: order.total,
            notes: message,
            channel: 'web',
            cantidad_viandas: order.meals,
            coupon_code: order.coupon?.code ?? null,
            discount_amount: order.coupon?.amount ?? 0,
            discount_percent: 0,
        }]);
        if (error) console.error('Order save error:', error);
    } catch (e) {
        console.error(e);
    }
};
