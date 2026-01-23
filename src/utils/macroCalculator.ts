import type { MacroInput, MacroResult } from '../types/macros';

export function calculateMacros(input: MacroInput): MacroResult {
    const { gender, age, height, weight, activity, goal, dietPreference, strengthTraining } = input;

    // 1. Calculate BMR using Mifflin-St Jeor
    let bmr: number;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // 2. Calculate TDEE
    const tdee = bmr * activity;

    // 3. Adjust by Goal
    let caloriesTarget: number;
    if (goal === 'lose') {
        caloriesTarget = tdee * 0.80; // 20% deficit
    } else if (goal === 'gain') {
        caloriesTarget = tdee * 1.10; // 10% surplus
    } else {
        caloriesTarget = tdee;
    }

    // 4. Calculate Protein (g/kg)
    let proteinPerKg: number;
    if (strengthTraining) {
        proteinPerKg = 2.0;
    } else if (goal === 'lose' || goal === 'gain') {
        proteinPerKg = 2.0;
    } else {
        proteinPerKg = 1.8;
    }

    let proteinG = weight * proteinPerKg;

    // 5. Calculate Fats (g/kg)
    const fatsPerKg = 0.8;
    let fatsG = weight * fatsPerKg;

    // 6. Preference Overrides (Initial)
    if (dietPreference === 'high_protein') {
        proteinG *= 1.1; // +10%
    }

    // 7. Calculate Remaining Carbs
    const proteinCal = proteinG * 4;
    const fatsCal = fatsG * 9;
    let remainingCal = caloriesTarget - proteinCal - fatsCal;

    let carbsG = remainingCal / 4;

    // 8. Low Carb Constraint
    if (dietPreference === 'low_carbe') {
        const maxCarbsG = weight * 2;
        if (carbsG > maxCarbsG) {
            const extraCarbsCal = (carbsG - maxCarbsG) * 4;
            carbsG = maxCarbsG;
            fatsG += extraCarbsCal / 9;
        }
    }

    // 9. Ensure no negative values
    return {
        bmr: Math.round(Math.max(0, bmr)),
        tdee: Math.round(Math.max(0, tdee)),
        caloriesTarget: Math.round(Math.max(0, caloriesTarget)),
        proteinG: Math.round(Math.max(0, proteinG)),
        carbsG: Math.round(Math.max(0, carbsG)),
        fatsG: Math.round(Math.max(0, fatsG))
    };
}
