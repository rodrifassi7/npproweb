export interface MacroInfo {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type Category = 'vianda' | 'wrap' | 'postre';

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  isDailySpecial: boolean;
  isSpicy?: boolean;
  packEligible: boolean;
  vacuumAvailable: boolean;
  macros?: MacroInfo;
  ingredients?: string[];
  tags?: string[];
}

export interface DiscountTier {
  min: number;
  max: number;
  discount: number;
}

export interface AppConfig {
  ACCENT_COLOR: string;
  WHATSAPP_NUMBER: string;
  DELIVERY_DAYS: string[];
  PICKUP_ADDRESS: string;
  VACUUM_PRICE_PER_ITEM: number;
  vacuumExtraPrice: number;
  DISCOUNT_TIERS: DiscountTier[];
}

export interface CartItem extends Product {
  quantity: number;
  useVacuum: boolean;
}
