import type { AppConfig, Product } from '../types';

import bondiolaConPureImg from '../assets/bondiolaconpure.webp';
import carneAsadaImg from '../assets/carneasada.webp';
import carneOrientalImg from '../assets/carneoriental.webp';
import lemonChickenImg from '../assets/lemonchicken.webp';
import npProRiceImg from '../assets/npprorice.webp';
import bulkWrapImg from '../assets/bulkwrap.webp';
import polloNaranjaImg from '../assets/pollonaranja.webp';
import bondiolaPomeloImg from '../assets/bondiolapomelo.webp';
import polloTikkaImg from '../assets/pollotikka.webp';
import carneTexMexImg from '../assets/carnetexmex.webp';
import polloDeshiladoImg from '../assets/pollodeshilado.webp';
import hamburguesaImg from '../assets/hamburguesa.webp';
import polloManiImg from '../assets/pollomani.webp';
import polloPicanteImg from '../assets/pollopicante.webp';
import cerdoGlaseadoImg from '../assets/cerdoglaseado.webp';

export const CONFIG: AppConfig = {
    ACCENT_COLOR: '#16A34A',
    WHATSAPP_NUMBER: '5492804385269',
    DELIVERY_DAYS: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    PICKUP_ADDRESS: 'Paraguay 55, Trelew, Chubut',
    VACUUM_PRICE_PER_ITEM: 500,
    vacuumExtraPrice: 500,
    DISCOUNT_TIERS: [

        { min: 10, max: 999, discount: 0.05 },

    ],
};

export type DayKey = 'LUN' | 'MAR' | 'MIE' | 'JUE' | 'VIE';
export type WeekKey = 'A' | 'B';

/**
 * MENÚ DE LA QUINCENA (se repite cada dos semanas)
 * 2 platos por día: [almuerzo, cena]
 *
 * m1 NPPRO Rice · m2 Carne Oriental · m3 Lemon Chicken · m4 Bondiola con puré de boniato
 * m5 Carne Asada · m6 Cerdo glaseado con batata · m7 Pork Wrap · m8 Pollo a la Naranja
 * m9 Bondiola al Pomelo · m10 Pollo Tikka · m11 Cerdo Deshilado · m12 Carne Tex-Mex
 * m13 Pollo Deshilado · m14 Hamburguesa Casera · m15 Pollo con Salsa de Maní · m16 Pollo Picante
 */
export const BIWEEKLY_MENU_IDS: Record<WeekKey, Record<DayKey, [string, string]>> = {
    A: {
        LUN: ['m10', 'm5'],  // Pollo Tikka · Carne Asada
        MAR: ['m12', 'm3'],  // Carne Desmenuzada Tex-Mex · Lemon Chicken
        MIE: ['m8', 'm4'],   // Pollo a la Naranja · Bondiola con puré de boniato
        JUE: ['m16', 'm7'],  // Pollo Picante con Dip de Yogur · Pork Wrap
        VIE: ['m15', 'm9'],  // Pollo con Salsa de Maní · Bondiola al Pomelo
    },
    B: {
        LUN: ['m16', 'm6'],  // Pollo Picante con Dip de Yogur · Cerdo glaseado con batata
        MAR: ['m11', 'm15'], // Cerdo Deshilado con Arroz · Pollo con Salsa de Maní
        MIE: ['m13', 'm2'],  // Pollo Deshilado con Vegetales · Carne Oriental
        JUE: ['m14', 'm3'],  // Hamburguesa Casera · Lemon Chicken
        VIE: ['m10', 'm1'],  // Pollo Tikka · NPPRO Rice
    },
};

/**
 * Lunes en que arrancó una Semana A (fecha de Argentina).
 * A partir de acá se alterna A / B cada 7 días.
 * Semana A: 26/10/2026 · Semana B: 02/11/2026 · Semana A: 09/11/2026 ...
 */
const WEEK_A_START = { y: 2026, m: 10, d: 26 };

const DAY_KEYS: DayKey[] = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE'];

/** Fecha de hoy en Trelew (horario de Argentina), sin importar dónde esté quien mira la web. */
const getArgentinaToday = () => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    return { y: get('year'), m: get('month'), d: get('day') };
};

/**
 * Qué semana (A/B) y qué día toca hoy.
 * Sábado y domingo devuelven el viernes de esa semana, con isWeekend = true.
 */
export const getMenuDay = (): { week: WeekKey; day: DayKey; isWeekend: boolean } => {
    const today = getArgentinaToday();
    const todayUtc = Date.UTC(today.y, today.m - 1, today.d);
    const startUtc = Date.UTC(WEEK_A_START.y, WEEK_A_START.m - 1, WEEK_A_START.d);
    const daysSince = Math.round((todayUtc - startUtc) / 86400000);
    const weekIndex = Math.floor(daysSince / 7);
    const week: WeekKey = ((weekIndex % 2) + 2) % 2 === 0 ? 'A' : 'B';
    const dayOfWeek = (((daysSince % 7) + 7) % 7); // 0=Lunes ... 6=Domingo
    const isWeekend = dayOfWeek >= 5;
    const day = DAY_KEYS[isWeekend ? 4 : dayOfWeek];
    return { week, day, isWeekend };
};

const menuDay = getMenuDay();

/** Los dos platos de hoy (almuerzo y cena) */
export const TODAY_MENU_IDS: [string, string] = BIWEEKLY_MENU_IDS[menuDay.week][menuDay.day];

const isSpecialToday = (id: string) => {
    // sábado/domingo: en el home repetimos el viernes, pero en la carta no marcamos "Hoy"
    if (menuDay.isWeekend) return false;
    return TODAY_MENU_IDS.includes(id);
};

export const MENU: Product[] = [
    // ✅ Lunes
    {
        id: 'm1',
        name: 'NPPRO Rice',
        category: 'vianda',
        description: 'Pollo salteado con arroz, morrón y cebolla en salsa BBQ, terminado con maní tostado.',
        price: 10800,
        image: npProRiceImg,
        isDailySpecial: isSpecialToday('m1'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 720, protein: 52, carbs: 48, fat: 21 },
        macrosLean: { kcal: 505, protein: 50, carbs: 45, fat: 14 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm2',
        name: 'Carne Oriental',
        category: 'vianda',
        description: 'Carne salteada con arroz yamaní, vegetales crocantes y salsa oriental.',
        price: 10800,
        image: carneOrientalImg,
        isDailySpecial: isSpecialToday('m2'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 680, protein: 50, carbs: 78, fat: 16 },
        macrosLean: { kcal: 490, protein: 48, carbs: 45, fat: 12 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Martes
    {
        id: 'm3',
        name: 'Lemon Chicken',
        category: 'vianda',
        description: 'Pollo en cubos con mostacholes en salsa fresca de limón y ralladura.',
        price: 10800,
        image: lemonChickenImg,
        isDailySpecial: isSpecialToday('m3'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 630, protein: 54, carbs: 65, fat: 14 },
        macrosLean: { kcal: 480, protein: 52, carbs: 42, fat: 10 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm4',
        name: 'Bondiola desmechada con puré de boniato',
        category: 'vianda',
        description: 'Bondiola braseada lentamente con puré cremoso de boniato.',
        price: 10800,
        image: bondiolaConPureImg,
        isDailySpecial: isSpecialToday('m4'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 700, protein: 48, carbs: 72, fat: 22 },
        macrosLean: { kcal: 530, protein: 44, carbs: 55, fat: 16 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Miércoles
    {
        id: 'm5',
        name: 'Carne Asada',
        category: 'vianda',
        description: 'Carne magra a la plancha con mix de verduras asadas al horno.',
        price: 10800,
        image: carneAsadaImg,
        isDailySpecial: isSpecialToday('m5'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 580, protein: 52, carbs: 42, fat: 20 },
        macrosLean: { kcal: 430, protein: 50, carbs: 28, fat: 14 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm6',
        name: 'Cerdo glaseado con batata y chauchas',
        category: 'vianda',
        description: 'Cerdo glaseado con mostaza, miel y limón, con batata asada en cubos y chauchas.',
        price: 10800,
        image: cerdoGlaseadoImg,
        isDailySpecial: isSpecialToday('m6'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 580, protein: 47, carbs: 49, fat: 21 },
        macrosLean: { kcal: 460, protein: 40, carbs: 38, fat: 17 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Jueves
    {
        id: 'm7',
        name: 'Pork Wrap',
        category: 'wrap',
        description: 'Cerdo desmenuzado, arroz, alioli de pimentón, lechuga, cebolla morada y morrón.',
        price: 10800,
        image: bulkWrapImg,
        isDailySpecial: isSpecialToday('m7'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 680, protein: 42, carbs: 65, fat: 30 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm8',
        name: 'Pollo a la Naranja',
        category: 'vianda',
        description: 'Pollo con arroz, zanahoria y chauchas en salsa de naranja, miel y soja, con sésamo.',
        price: 10800,
        image: polloNaranjaImg,
        isDailySpecial: isSpecialToday('m8'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 670, protein: 52, carbs: 81, fat: 14 },
        macrosLean: { kcal: 570, protein: 52, carbs: 59, fat: 14 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Viernes
    {
        id: 'm9',
        name: 'Bondiola al Pomelo',
        category: 'vianda',
        description: 'Bondiola braseada lento en glaseado de pomelo, miel y mostaza, con arroz y zapallitos.',
        price: 10800,
        image: bondiolaPomeloImg,
        isDailySpecial: isSpecialToday('m9'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 820, protein: 48, carbs: 78, fat: 35 },
        macrosLean: { kcal: 710, protein: 46, carbs: 53, fat: 35 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm10',
        name: 'Pollo Tikka',
        category: 'vianda',
        description: 'Pollo marinado en yogur y especias indias, en salsa cremosa de curry con arroz y vegetales.',
        price: 10800,
        image: polloTikkaImg,
        isDailySpecial: isSpecialToday('m10'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 690, protein: 60, carbs: 81, fat: 13 },
        macrosLean: { kcal: 610, protein: 60, carbs: 61, fat: 13 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Platos adicionales vigentes (sin día fijo asignado)
    {
        id: 'm11',
        name: 'Cerdo Deshilado con Arroz y Glaseados',
        category: 'vianda',
        description: 'Cerdo braseado y deshilado con miel y sésamo, arroz, zanahoria y chauchas.',
        price: 10800,
        image: undefined,
        isDailySpecial: isSpecialToday('m11'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 820, protein: 55, carbs: 98, fat: 22 },
        macrosLean: { kcal: 600, protein: 46, carbs: 67, fat: 16 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm12',
        name: 'Carne Desmenuzada Tex-Mex',
        category: 'vianda',
        description: 'Carne braseada con especias tex-mex, arroz, porotos negros, choclo y tomate asado.',
        price: 10800,
        image: carneTexMexImg,
        isDailySpecial: isSpecialToday('m12'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 870, protein: 62, carbs: 99, fat: 26 },
        macrosLean: { kcal: 660, protein: 52, carbs: 69, fat: 21 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm13',
        name: 'Pollo Deshilado con Vegetales Asados y Limón',
        category: 'vianda',
        description: 'Pollo deshilado al limón y cilantro, con arroz, vegetales y sésamo.',
        price: 10800,
        image: polloDeshiladoImg,
        isDailySpecial: isSpecialToday('m13'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 730, protein: 58, carbs: 79, fat: 18 },
        macrosLean: { kcal: 530, protein: 49, carbs: 52, fat: 13 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm14',
        name: 'Hamburguesa Casera con Salsa Especial',
        category: 'vianda',
        description: 'Hamburguesa de carne con batata y vegetales asados. Salsa de yogur y mostaza aparte.',
        price: 10800,
        image: hamburguesaImg,
        isDailySpecial: isSpecialToday('m14'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 650, protein: 44, carbs: 42, fat: 33 },
        macrosLean: { kcal: 560, protein: 39, carbs: 33, fat: 30 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm15',
        name: 'Pollo con Salsa de Maní',
        category: 'vianda',
        description: 'Pollo con arroz y vegetales salteados. Dip de maní, soja y miel aparte.',
        price: 10800,
        image: polloManiImg,
        isDailySpecial: isSpecialToday('m15'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 810, protein: 59, carbs: 90, fat: 23 },
        macrosLean: { kcal: 630, protein: 51, carbs: 60, fat: 20 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm16',
        name: 'Pollo Picante con Dip de Yogur',
        category: 'vianda',
        description: 'Pollo al pimentón picante con batata y zapallitos asados. Dip de yogur y pepino aparte.',
        price: 10800,
        image: polloPicanteImg,
        isDailySpecial: isSpecialToday('m16'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 480, protein: 51, carbs: 40, fat: 13 },
        macrosLean: { kcal: 410, protein: 46, carbs: 30, fat: 12 },
        ingredients: [],
        tags: [],
    },
];

/**
 * PACKS ARMADOS POR EL CLIENTE
 * Elige congelado o al vacío y suma las comidas que quiera (mínimo 5).
 */
export type PackType = 'frozen' | 'vacuum';

export const PACK_CONFIG = {
    MIN_MEALS: 5,
    BIG_PACK_MEALS: 10,            // desde acá baja el precio y el envío es gratis
    PRICE_PER_MEAL: 10500,         // congelado, de 5 a 9 comidas
    PRICE_PER_MEAL_BIG: 10000,     // congelado, 10 comidas o más
    VACUUM_EXTRA_PER_MEAL: 250,    // bolsa de vacío, por comida
    SHIPPING: 3500,                // de 5 a 9 comidas
};

/** Precio por comida según la cantidad y el tipo de pack */
export const getPackPricePerMeal = (meals: number, type: PackType) => {
    const base = meals >= PACK_CONFIG.BIG_PACK_MEALS ? PACK_CONFIG.PRICE_PER_MEAL_BIG : PACK_CONFIG.PRICE_PER_MEAL;
    return base + (type === 'vacuum' ? PACK_CONFIG.VACUUM_EXTRA_PER_MEAL : 0);
};

export const getPackShipping = (meals: number) =>
    meals >= PACK_CONFIG.BIG_PACK_MEALS ? 0 : PACK_CONFIG.SHIPPING;
