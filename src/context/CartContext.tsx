import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, DiscountTier } from '../types';
import type { CartItem } from '../types/cart';
import { CONFIG } from '../data/data';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, options: { useVacuum: boolean; variant?: 'mass' | 'lean' }) => void;
    removeFromCart: (itemKey: string) => void;
    updateQuantity: (itemKey: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    packDiscount: number;
    shippingCost: number;
    vacuumTotal: number;
    total: number;
    currentDiscountTier: DiscountTier | null;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'nppro_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error loading cart", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, options: { useVacuum: boolean; variant?: 'mass' | 'lean' }) => {
        const { useVacuum, variant } = options;
        // La versión elegida (MASS/LEAN) separa líneas en el carrito y viaja en el nombre al pedido de WhatsApp.
        const itemKey = `${product.id}_${variant ?? "na"}_${useVacuum ? "vac" : "std"}`;
        const itemName = variant ? `${product.name} (${variant.toUpperCase()})` : product.name;

        setCart((prev) => {
            const existing = prev.find((item) => item.key === itemKey);
            if (existing) {
                return prev.map((item) =>
                    item.key === itemKey
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            const newItem: CartItem = {
                key: itemKey,
                id: product.id,
                name: itemName,
                category: product.category,
                price: product.price,
                quantity: 1,
                useVacuum: useVacuum,
                image: product.image || '',
                packEligible: product.packEligible
            };
            return [...prev, newItem];
        });
    };

    const removeFromCart = (itemKey: string) => {
        setCart((prev) => {
            const existing = prev.find(item => item.key === itemKey);
            if (existing && existing.quantity > 1) {
                return prev.map(item => item.key === itemKey ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter((item) => item.key !== itemKey);
        });
    };

    const updateQuantity = (itemKey: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) => (item.key === itemKey ? { ...item, quantity } : item)).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    // ─── CALCULATIONS ──────────────────────────────────────────────
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const packEligibleCount = cart.reduce((acc, item) =>
        item.packEligible ? acc + item.quantity : acc, 0
    );

    const currentDiscountTier = CONFIG.DISCOUNT_TIERS
        .filter((tier) => packEligibleCount >= tier.min)
        .sort((a, b) => b.discount - a.discount)[0] || null;

    // Suma bruta de los ítems del carrito
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const eligibleSubtotal = cart.reduce((acc, item) =>
        item.packEligible ? acc + item.price * item.quantity : acc, 0
    );

    // Descuento por volumen
    const packDiscount = !currentDiscountTier ? 0 : eligibleSubtotal * currentDiscountTier.discount;

    const vacuumTotal = cart.reduce((acc, item) =>
        item.useVacuum ? acc + (CONFIG.vacuumExtraPrice || 200) * item.quantity : acc, 0
    );

    // El envío de los packs se calcula en la página de packs (no pasan por el carrito)
    const shippingCost = 0;

    // Compra suelta: suma de ítems - descuento por volumen + vacío
    const total = subtotal - packDiscount + vacuumTotal;

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
                packDiscount,
                shippingCost,
                vacuumTotal,
                total,
                currentDiscountTier,
            }}
        >
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
