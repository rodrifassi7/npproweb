import type { AppConfig, Product } from '../types';

import bondiolaConPureImg from '../assets/bondiolaconpure.webp';
import carneAsadaImg from '../assets/carneasada.webp';
import carneOrientalImg from '../assets/carneoriental.png';
import cerdoConColImg from '../assets/cerdoconcol.webp';
import lemonChickenImg from '../assets/lemonchicken.webp';
import npProRiceImg from '../assets/npprorice.webp';
import bulkWrapImg from '../assets/bulkwrap.webp';

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
        description: '',
        price: 10800,
        image: npProRiceImg,
        isDailySpecial: isSpecialToday('m1'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 667, protein: 58, carbs: 69, fat: 22 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm2',
        name: 'Carne Oriental',
        category: 'vianda',
        description: '',
        price: 10800,
        image: carneOrientalImg,
        isDailySpecial: isSpecialToday('m2'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 710, protein: 45, carbs: 85, fat: 22 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Martes
    {
        id: 'm3',
        name: 'Lemon Chicken',
        category: 'vianda',
        description: '',
        price: 10800,
        image: lemonChickenImg,
        isDailySpecial: isSpecialToday('m3'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 680, protein: 60, carbs: 80, fat: 18 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm4',
        name: 'Bondiola desmechada con puré de boniato',
        category: 'vianda',
        description: '',
        price: 10800,
        image: bondiolaConPureImg,
        isDailySpecial: isSpecialToday('m4'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 704, protein: 39, carbs: 70, fat: 34 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Miércoles
    {
        id: 'm5',
        name: 'Carne Asada',
        category: 'vianda',
        description: '',
        price: 10800,
        image: carneAsadaImg,
        isDailySpecial: isSpecialToday('m5'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 540, protein: 41, carbs: 38, fat: 22 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm6',
        name: 'Cerdo con batata',
        category: 'vianda',
        description: '',
        price: 10800,
        image: cerdoConColImg,
        isDailySpecial: isSpecialToday('m6'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 570, protein: 46, carbs: 34, fat: 19 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Jueves
    {
        id: 'm7',
        name: 'Bulk Wrap',
        category: 'wrap',
        description: '',
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
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: isSpecialToday('m8'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Viernes
    {
        id: 'm9',
        name: 'Bondiola al Pomelo',
        category: 'vianda',
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: isSpecialToday('m9'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm10',
        name: 'Pollo Tikka',
        category: 'vianda',
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: isSpecialToday('m10'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Platos adicionales vigentes (sin día fijo asignado)
    {
        id: 'm11',
        name: 'Cerdo Deshilado con Arroz y Glaseados',
        category: 'vianda',
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: false,
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm12',
        name: 'Carne Desmenuzada Tex-Mex',
        category: 'vianda',
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: false,
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm13',
        name: 'Pollo Deshilado con Vegetales Asados y Limón',
        category: 'vianda',
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: false,
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm14',
        name: 'Hamburguesa Casera con Salsa Especial',
        category: 'vianda',
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: false,
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm15',
        name: 'Pollo con Salsa de Maní',
        category: 'vianda',
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: false,
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        ingredients: [],
        tags: [],
    },
    {
        id: 'm16',
        name: 'Pollo Picante con Dip de Yogur',
        category: 'vianda',
        description: '',
        price: 10800,
        image: undefined,
        isDailySpecial: false,
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
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
