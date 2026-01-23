import { MENU, DAILY_SPECIAL_IDS } from './data';
import type { Product } from '../types';

// Re-export constants/types if needed, or just helpers.

// 1. Mapping: Day -> [lunchId, dinnerId]
// We can just reuse what's in data.ts, but user asked to export WEEKLY_MENU_IDS specifically.
// We'll map the English keys or existing keys to the IDs.
// The user asked for "WEEKLY_MENU_IDS (mapping day -> lunchId + dinnerId)"

// We can make it easier to consume based on Day name if needed, 
// but sticking to the DAILY_SPECIAL_IDS keys might be cleaner if allowed.
// However, the internal keys in data.ts are LUN, MAR, etc.
// Let's expose nice English keys if that helps, or just expose the map.

// Let's follow Requirement 2: "WEEKLY_MENU_IDS (mapping day -> lunchId + dinnerId)"
// We have `DAILY_SPECIAL_IDS` with 'LUN', 'MAR'...
// I will create a mapping that might be easier to use or just re-export with clear typing.



// If the user wants specific structure, I'll follow that. 
// "mapping day -> lunchId + dinnerId"
export const WEEKLY_MENU_IDS = {
    monday: { lunch: DAILY_SPECIAL_IDS.LUN[0], dinner: DAILY_SPECIAL_IDS.LUN[1] },
    tuesday: { lunch: DAILY_SPECIAL_IDS.MAR[0], dinner: DAILY_SPECIAL_IDS.MAR[1] },
    wednesday: { lunch: DAILY_SPECIAL_IDS.MIE[0], dinner: DAILY_SPECIAL_IDS.MIE[1] },
    thursday: { lunch: DAILY_SPECIAL_IDS.JUE[0], dinner: DAILY_SPECIAL_IDS.JUE[1] },
    friday: { lunch: DAILY_SPECIAL_IDS.VIE[0], dinner: DAILY_SPECIAL_IDS.VIE[1] },
};

// Helper to find a product by ID safely
const getProductById = (id: string): Product | undefined => {
    return MENU.find((p) => p.id === id);
};

// 2. getTodayMenu(): returns { lunch: Product, dinner: Product }
export const getTodayMenu = (): { lunch: Product; dinner: Product } => {
    const dayIndex = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Requirement: "Weekend behavior: Saturday and Sunday should show the SAME menu as Friday."
    // 0=Sun (use Fri), 6=Sat (use Fri), 5=Fri (use Fri)
    // 1..4 = Mon..Thu

    let dayData = WEEKLY_MENU_IDS.friday; // Default to Friday (covers Fri, Sat, Sun)

    if (dayIndex === 1) dayData = WEEKLY_MENU_IDS.monday;
    if (dayIndex === 2) dayData = WEEKLY_MENU_IDS.tuesday;
    if (dayIndex === 3) dayData = WEEKLY_MENU_IDS.wednesday;
    if (dayIndex === 4) dayData = WEEKLY_MENU_IDS.thursday;

    // Retrieve products
    const lunch = getProductById(dayData.lunch);
    const dinner = getProductById(dayData.dinner);

    if (!lunch || !dinner) {
        // Fallback or error - strictly shouldn't happen if data integrity is kept.
        // Returning the first items in MENU or handling error. 
        // For now, assume data integrity.
        // If not found, let's return a safe fallback from MENU to avoid crash.
        return { lunch: MENU[0], dinner: MENU[1] };
    }

    return { lunch, dinner };
};

// 3. getTodaySpecialByTime(): returns Product (before 16:00 lunch, after 16:00 dinner)
export const getTodaySpecialByTime = (): Product => {
    const { lunch, dinner } = getTodayMenu();
    const currentHour = new Date().getHours();

    // "before 16:00 lunch" -> < 16
    if (currentHour < 16) {
        return lunch;
    }
    return dinner;
};
