import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import type { CartItem, Variant } from '../types/cart';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, options: { useVacuum: boolean; variant?: Variant }) => void;
    removeFromCart: (itemKey: string) => void;
    setItemVariant: (itemKey: string, variant: Variant) => void;
    clearCart: () => void;
    totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
// v2: cada comida guarda su versión (Volumen/Definición) y el precio se toma siempre de la carta actual
const STORAGE_KEY = 'nppro_cart_v2';

const makeKey = (id: string, variant: Variant | null, useVacuum: boolean) =>
    `${id}_${variant ?? 'na'}_${useVacuum ? 'vac' : 'std'}`;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading cart', e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch { /* sin storage */ }
    }, [cart]);

    const addToCart = (product: Product, options: { useVacuum: boolean; variant?: Variant }) => {
        // Si el plato viene en Volumen y Definición y no eligió, va Volumen (lo puede cambiar en el pedido)
        const variant: Variant | null = product.macrosLean ? (options.variant ?? 'mass') : null;
        const key = makeKey(product.id, variant, options.useVacuum);

        setCart(prev => {
            if (prev.some(item => item.key === key)) {
                return prev.map(item => (item.key === key ? { ...item, quantity: item.quantity + 1 } : item));
            }
            return [...prev, {
                key,
                id: product.id,
                name: product.name,
                variant,
                category: product.category,
                quantity: 1,
                useVacuum: options.useVacuum,
                image: product.image || '',
                packEligible: product.packEligible,
            }];
        });
    };

    /** Saca una unidad; si era la última, saca la línea */
    const removeFromCart = (itemKey: string) => {
        setCart(prev => prev
            .map(item => (item.key === itemKey ? { ...item, quantity: item.quantity - 1 } : item))
            .filter(item => item.quantity > 0));
    };

    /** Cambia una línea entre Volumen y Definición (y la junta con otra igual si ya existía) */
    const setItemVariant = (itemKey: string, variant: Variant) => {
        setCart(prev => {
            const item = prev.find(i => i.key === itemKey);
            if (!item || item.variant === null || item.variant === variant) return prev;
            const newKey = makeKey(item.id, variant, item.useVacuum);
            const twin = prev.find(i => i.key === newKey);
            if (twin) {
                return prev
                    .filter(i => i.key !== itemKey)
                    .map(i => (i.key === newKey ? { ...i, quantity: i.quantity + item.quantity } : i));
            }
            return prev.map(i => (i.key === itemKey ? { ...i, key: newKey, variant } : i));
        });
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, setItemVariant, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
