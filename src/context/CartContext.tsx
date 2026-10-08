import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, DiscountTier } from '../types';
import type { CartItem } from '../types/cart';
import { CONFIG, PREMADE_PACKS } from '../data/data';

// Costo de envío por tipo de pack. x10 = gratis.
const PACK_SHIPPING: Record<string, number> = {
    lean5:  3500,
    mass5:  3500,
    lean10: 0,
    mass10: 0,
};

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, options: { useVacuum: boolean }) => void;
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
    selectedPremadePack: string | null;
    setSelectedPremadePack: (pack: string | null) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'nppro_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedPremadePack, setSelectedPremadePack] = useState<string | null>(null);
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

    const addToCart = (product: Product, options: { useVacuum: boolean }) => {
        const { useVacuum } = options;
        const itemKey = `${product.id}_${useVacuum ? "vac" : "std"}`;

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
                name: product.name,
                category: product.category,
                price: product.price,
                quantity: 1,
                useVacuum: useVacuum,
                image: product.image,
                packEligible: product.packEligible
            };
            return [...prev, newItem];
        });
    };

    // Cuando el usuario modifica el carrito manualmente, deseleccionamos el pack
    const removeFromCart = (itemKey: string) => {
        setSelectedPremadePack(null);
        setCart((prev) => {
            const existing = prev.find(item => item.key === itemKey);
            if (existing && existing.quantity > 1) {
                return prev.map(item => item.key === itemKey ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter((item) => item.key !== itemKey);
        });
    };

    const updateQuantity = (itemKey: string, quantity: number) => {
        setSelectedPremadePack(null);
        setCart((prev) =>
            prev.map((item) => (item.key === itemKey ? { ...item, quantity } : item)).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
        setSelectedPremadePack(null);
    };

    // ─── CALCULATIONS ──────────────────────────────────────────────
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const packEligibleCount = cart.reduce((acc, item) =>
        item.packEligible ? acc + item.quantity : acc, 0
    );

    const currentDiscountTier = CONFIG.DISCOUNT_TIERS
        .filter((tier) => packEligibleCount >= tier.min)
        .sort((a, b) => b.discount - a.discount)[0] || null;

    // Suma bruta de los ítems del carrito (se muestra como referencia, no como precio final cuando hay pack)
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const eligibleSubtotal = cart.reduce((acc, item) =>
        item.packEligible ? acc + item.price * item.quantity : acc, 0
    );

    // Descuento por volumen — solo aplica si NO hay pack predefinido seleccionado
    const packDiscount = selectedPremadePack ? 0 : (!currentDiscountTier ? 0 : eligibleSubtotal * currentDiscountTier.discount);

    const vacuumTotal = cart.reduce((acc, item) =>
        item.useVacuum ? acc + (CONFIG.vacuumExtraPrice || 200) * item.quantity : acc, 0
    );

    // Envío: $3.500 para x5, gratis para x10. Sin pack seleccionado = sin envío automático.
    const shippingCost = selectedPremadePack ? (PACK_SHIPPING[selectedPremadePack] ?? 0) : 0;

    let total: number;
    if (selectedPremadePack && PREMADE_PACKS[selectedPremadePack]) {
        // Precio fijo del pack + envío correspondiente (sin sumar precios individuales ni aplicar descuentos)
        total = PREMADE_PACKS[selectedPremadePack].price + shippingCost + vacuumTotal;
    } else {
        // Compra suelta: suma de ítems - descuento por volumen + vacuum
        total = subtotal - packDiscount + vacuumTotal;
    }

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
                selectedPremadePack,
                setSelectedPremadePack,
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
