import { MENU, TODAY_MENU_IDS } from './data';
import type { Product } from '../types';

// El menú rota cada dos semanas (Semana A / Semana B).
// La rotación y el cálculo de qué día toca están en data.ts (BIWEEKLY_MENU_IDS + getMenuDay).
// Sábado y domingo se muestra el menú del viernes de esa semana.

const getProductById = (id: string): Product | undefined => MENU.find((p) => p.id === id);

/** Devuelve los dos platos de hoy: { lunch, dinner } */
export const getTodayMenu = (): { lunch: Product; dinner: Product } => {
    const lunch = getProductById(TODAY_MENU_IDS[0]);
    const dinner = getProductById(TODAY_MENU_IDS[1]);

    if (!lunch || !dinner) {
        // No debería pasar si los IDs del menú están bien; evitamos que se rompa la web
        return { lunch: MENU[0], dinner: MENU[1] };
    }

    return { lunch, dinner };
};

/** Antes de las 16 h devuelve el almuerzo, después la cena (horario de Argentina) */
export const getTodaySpecialByTime = (): Product => {
    const { lunch, dinner } = getTodayMenu();
    const hour = Number(
        new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: 'numeric',
            hourCycle: 'h23',
        }).format(new Date()),
    );
    return hour < 16 ? lunch : dinner;
};
