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

type DayKey = 'LUN' | 'MAR' | 'MIE' | 'JUE' | 'VIE';

const getTodayKey = (): DayKey | null => {
    // getDay(): 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
    const d = new Date().getDay();

    if (d === 1) return 'LUN';
    if (d === 2) return 'MAR';
    if (d === 3) return 'MIE';
    if (d === 4) return 'JUE';
    if (d === 5) return 'VIE';

    // sábado/domingo = repetimos viernes en el weeklyMenu.ts, acá no marcamos daily special
    return null;
};

const todayKey = getTodayKey();

/**
 * Mapa de "Especial del día"
 * (2 por día: almuerzo y cena)
 */
export const DAILY_SPECIAL_IDS: Record<DayKey, string[]> = {
    LUN: ['m1', 'm2'],
    MAR: ['m3', 'm4'],
    MIE: ['m5', 'm6'],
    JUE: ['m7', 'm8'],
    VIE: ['m9', 'm10'],
};

const isSpecialToday = (id: string) => {
    if (!todayKey) return false;
    return DAILY_SPECIAL_IDS[todayKey].includes(id);
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
        name: 'Bulk Wrap',
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
        isDailySpecial: false,
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
        isDailySpecial: false,
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
        isDailySpecial: false,
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
        isDailySpecial: false,
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
        isDailySpecial: false,
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
        isDailySpecial: false,
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 480, protein: 51, carbs: 40, fat: 13 },
        macrosLean: { kcal: 410, protein: 46, carbs: 30, fat: 12 },
        ingredients: [],
        tags: [],
    },
];

export const PREMADE_PACKS: Record<string, any> = {
    // x5 — misma composición para Lean y Mass
    lean5: {
        name: 'Pack Congelado x5',
        mealsCount: 5,
        price: 52500,
        items: [
            { id: 'm8',  qty: 1, customName: 'Pollo a la Naranja' },
            { id: 'm15', qty: 1, customName: 'Pollo con Salsa de Maní' },
            { id: 'm2',  qty: 1, customName: 'Carne Oriental' },
            { id: 'm12', qty: 1, customName: 'Carne Desmenuzada Tex-Mex' },
            { id: 'm4',  qty: 1, customName: 'Bondiola desmechada con puré de boniato' },
        ]
    },
    mass5: {
        name: 'Pack Congelado x5',
        mealsCount: 5,
        price: 52500,
        items: [
            { id: 'm8',  qty: 1, customName: 'Pollo a la Naranja' },
            { id: 'm15', qty: 1, customName: 'Pollo con Salsa de Maní' },
            { id: 'm2',  qty: 1, customName: 'Carne Oriental' },
            { id: 'm12', qty: 1, customName: 'Carne Desmenuzada Tex-Mex' },
            { id: 'm4',  qty: 1, customName: 'Bondiola desmechada con puré de boniato' },
        ]
    },
    // x10 — misma composición para Lean y Mass
    lean10: {
        name: 'Pack Congelado x10',
        mealsCount: 10,
        isMostPopular: true,
        price: 100000,
        items: [
            { id: 'm8',  qty: 2, customName: 'Pollo a la Naranja' },
            { id: 'm15', qty: 2, customName: 'Pollo con Salsa de Maní' },
            { id: 'm2',  qty: 1, customName: 'Carne Oriental' },
            { id: 'm12', qty: 1, customName: 'Carne Desmenuzada Tex-Mex' },
            { id: 'm4',  qty: 1, customName: 'Bondiola desmechada con puré de boniato' },
            { id: 'm11', qty: 1, customName: 'Cerdo Deshilado con Arroz y Glaseados' },
            { id: 'm9',  qty: 1, customName: 'Bondiola al Pomelo' },
            { id: 'm1',  qty: 1, customName: 'NPPRO Rice' },
        ]
    },
    mass10: {
        name: 'Pack Congelado x10',
        mealsCount: 10,
        isMostPopular: true,
        price: 100000,
        items: [
            { id: 'm8',  qty: 2, customName: 'Pollo a la Naranja' },
            { id: 'm15', qty: 2, customName: 'Pollo con Salsa de Maní' },
            { id: 'm2',  qty: 1, customName: 'Carne Oriental' },
            { id: 'm12', qty: 1, customName: 'Carne Desmenuzada Tex-Mex' },
            { id: 'm4',  qty: 1, customName: 'Bondiola desmechada con puré de boniato' },
            { id: 'm11', qty: 1, customName: 'Cerdo Deshilado con Arroz y Glaseados' },
            { id: 'm9',  qty: 1, customName: 'Bondiola al Pomelo' },
            { id: 'm1',  qty: 1, customName: 'NPPRO Rice' },
        ]
    },
};
