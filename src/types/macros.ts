export type Gender = 'male' | 'female';
export type ActivityLevel = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
export type Goal = 'lose' | 'maintain' | 'gain';
export type DietPreference = 'balanced' | 'high_protein' | 'low_carbe';

export interface MacroInput {
    gender: Gender;
    age: number;
    height: number;
    weight: number;
    activity: ActivityLevel;
    goal: Goal;
    dietPreference: DietPreference;
    strengthTraining: boolean;
}

export interface MacroResult {
    bmr: number;
    tdee: number;
    caloriesTarget: number;
    proteinG: number;
    carbsG: number;
    fatsG: number;
}
