import type { AppConfig, Product } from '../types';

import bondiolaConPureImg from '../assets/bondiolaconpure.webp';
import carneAsadaImg from '../assets/carneasada.webp';
import carneOrientalImg from '../assets/carneoriental.png';
import cerdoConColImg from '../assets/cerdoconcol.webp';
import langostinosImg from '../assets/langostinos.webp';
import lemonChickenImg from '../assets/lemonchicken.webp';
import npProRiceImg from '../assets/npprorice.webp';
import pechugaRellenaImg from '../assets/pechugarellena.webp';
import polloAlfredoImg from '../assets/polloalfredo.png';
import bulkWrapImg from '../assets/bulkwrap.webp';

export const CONFIG: AppConfig = {
    ACCENT_COLOR: '#16A34A',
    WHATSAPP_NUMBER: '5492804385269',
    DELIVERY_DAYS: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    PICKUP_ADDRESS: 'Paraguay 55, Trelew, Chubut',
    VACUUM_PRICE_PER_ITEM: 200,
    vacuumExtraPrice: 200,
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
 * Mapa de “Especial del día”
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
        name: 'Pollo Alfredo con brócoli',
        category: 'vianda',
        description: '',
        price: 9800,
        image: polloAlfredoImg,
        isDailySpecial: isSpecialToday('m1'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 705, protein: 68, carbs: 88, fat: 20 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm2',
        name: 'Carne salteada estilo oriental',
        category: 'vianda',
        description: '',
        price: 9800,
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
        name: 'Lemon chicken',
        category: 'vianda',
        description: '',
        price: 9800,
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
        name: 'Bondiola braseada con puré de boniato',
        category: 'vianda',
        description: '',
        price: 9800,
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
        name: 'Bulk wrap',
        category: 'wrap',
        description: '',
        price: 9800,
        image: bulkWrapImg,
        isDailySpecial: isSpecialToday('m5'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 680, protein: 42, carbs: 65, fat: 30 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm6',
        name: 'Carne asada con verduras asadas',
        category: 'vianda',
        description: '',
        price: 9800,
        image: carneAsadaImg,
        isDailySpecial: isSpecialToday('m6'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 540, protein: 41, carbs: 38, fat: 22 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Jueves
    {
        id: 'm7',
        name: 'NP PRO Rice',
        category: 'vianda',
        description: '',
        price: 9800,
        image: npProRiceImg,
        isDailySpecial: isSpecialToday('m7'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 667, protein: 58, carbs: 69, fat: 22 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm8',
        name: 'Cerdo con batata, repollo y zanahorias glaseadas',
        category: 'vianda',
        description: '',
        price: 9800,
        image: cerdoConColImg,
        isDailySpecial: isSpecialToday('m8'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 570, protein: 46, carbs: 34, fat: 19 },
        ingredients: [],
        tags: ['Cena'],
    },

    // ✅ Viernes
    {
        id: 'm9',
        name: 'Pollo relleno de espinaca y ricota',
        category: 'vianda',
        description: '',
        price: 9800,
        image: pechugaRellenaImg,
        isDailySpecial: isSpecialToday('m9'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 560, protein: 47, carbs: 34, fat: 18 },
        ingredients: [],
        tags: ['Almuerzo'],
    },
    {
        id: 'm10',
        name: 'Langostinos al limón y ajo con arroz yamani',
        category: 'vianda',
        description: '',
        price: 9800,
        image: langostinosImg,
        isDailySpecial: isSpecialToday('m10'),
        packEligible: true,
        vacuumAvailable: true,
        macros: { kcal: 550, protein: 45, carbs: 60, fat: 13 },
        ingredients: [],
        tags: ['Cena'],
    },
];

export const PREMADE_PACKS: Record<string, any> = {
    mass5: {
        name: 'Pack Mass x5',
        mealsCount: 5,
        price: 49000,
        items: [
            { id: 'm7', qty: 1, customName: 'NPPRO Rice — 720 kcal · 52g prot' },
            { id: 'm2', qty: 1, customName: 'Carne Estilo Oriental — 680 kcal · 50g prot ⭐' },
            { id: 'm4', qty: 1, customName: 'Bondiola Braseada — 700 kcal · 48g prot' },
            { id: 'm8', qty: 1, customName: 'Cerdo con Batata y Repollo — 670 kcal · 48g prot' },
            { id: 'm3', qty: 1, customName: 'Lemon Chicken — 630 kcal · 54g prot' }
        ]
    },
    mass10: {
        name: 'Pack Mass x10',
        mealsCount: 10,
        price: 98000,
        isMostPopular: true,
        items: [
            { id: 'm7', qty: 2, customName: 'NPPRO Rice — 720 kcal · 52g prot' },
            { id: 'm2', qty: 2, customName: 'Carne Estilo Oriental — 680 kcal · 50g prot ⭐' },
            { id: 'm4', qty: 2, customName: 'Bondiola Braseada — 700 kcal · 48g prot' },
            { id: 'm8', qty: 2, customName: 'Cerdo con Batata y Repollo — 670 kcal · 48g prot' },
            { id: 'm3', qty: 1, customName: 'Lemon Chicken — 630 kcal · 54g prot' },
            { id: 'm6', qty: 1, customName: 'Carne Asada con Verduras — 580 kcal · 52g prot' }
        ]
    },
    lean5: {
        name: 'Pack Lean x5',
        mealsCount: 5,
        price: 45000,
        items: [
            { id: 'm2', qty: 1, customName: 'Carne Estilo Oriental — 490 kcal · 48g prot ⭐' },
            { id: 'm6', qty: 1, customName: 'Carne Asada con Verduras — 430 kcal · 50g prot' },
            { id: 'm7', qty: 1, customName: 'NPPRO Rice — 505 kcal · 50g prot' },
            { id: 'm3', qty: 1, customName: 'Lemon Chicken — 480 kcal · 52g prot' },
            { id: 'm8', qty: 1, customName: 'Cerdo con Batata y Repollo — 490 kcal · 46g prot' }
        ]
    },
    lean10: {
        name: 'Pack Lean x10',
        mealsCount: 10,
        price: 90000,
        items: [
            { id: 'm2', qty: 2, customName: 'Carne Estilo Oriental — 490 kcal · 48g prot ⭐' },
            { id: 'm6', qty: 2, customName: 'Carne Asada con Verduras — 430 kcal · 50g prot' },
            { id: 'm7', qty: 2, customName: 'NPPRO Rice — 505 kcal · 50g prot' },
            { id: 'm3', qty: 2, customName: 'Lemon Chicken — 480 kcal · 52g prot' },
            { id: 'm8', qty: 1, customName: 'Cerdo con Batata y Repollo — 490 kcal · 46g prot' },
            { id: 'm4', qty: 1, customName: 'Bondiola Braseada — 530 kcal · 44g prot' }
        ]
    }
};
