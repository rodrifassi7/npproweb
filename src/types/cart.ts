export interface CartItem {
    key: string;       // ${productId}_${useVacuum ? "vac" : "std"}
    id: string;        // Compatibility with existing code (productId)
    name: string;
    category: string;
    price: number;
    quantity: number;
    useVacuum: boolean;
    image: string;
    packEligible: boolean;
}
