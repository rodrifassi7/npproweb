export type Variant = 'mass' | 'lean';

export interface CartItem {
    key: string;              // ${productId}_${variant}_${useVacuum ? "vac" : "std"}
    id: string;               // id del producto
    name: string;             // nombre del plato, sin la versión
    variant: Variant | null;  // Volumen (mass) o Definición (lean); null si el plato no tiene versiones
    category: string;
    quantity: number;
    useVacuum: boolean;
    image: string;
    packEligible: boolean;
}
