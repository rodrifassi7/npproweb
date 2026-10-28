import React from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
    product: Product;
    onViewDetail?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
    const { addToCart } = useCart();
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleAddToCart = () => {
        addToCart(product, { useVacuum: false });
        if (buttonRef.current) {
            import('../utils/flyToCart').then(({ flyToCart }) => {
                flyToCart(buttonRef.current!, '#cart-icon-desktop', '#cart-icon-mobile', product.image);
            });
        }
    };

    const m = product.macros;

    return (
        <article className="group relative flex h-full gap-4 rounded-[1.75rem] border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-white/15 sm:flex-col sm:gap-0 sm:p-5">
            {/* Toda la tarjeta abre el detalle; el botón + agrega directo */}
            <button
                type="button"
                onClick={() => onViewDetail?.(product)}
                className="absolute inset-0 z-0 rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green"
                aria-label={`Ver detalle de ${product.name}`}
            />

            <div className="pointer-events-none relative w-28 shrink-0 self-center sm:mx-auto sm:w-full sm:max-w-[260px]">
                {product.image ? (
                    <img
                        src={product.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={640}
                        className="aspect-square w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="aspect-square w-full rounded-full bg-white/5" />
                )}
                {product.isDailySpecial && (
                    <span className="absolute left-0 top-0 rounded-full bg-nppro-green px-2.5 py-1 text-[11px] font-bold text-black">Hoy</span>
                )}
            </div>

            <div className="pointer-events-none relative flex min-w-0 flex-1 flex-col sm:mt-4">
                <h3 className="text-base font-black uppercase italic leading-tight tracking-tight sm:text-lg">{product.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/50">{product.description}</p>

                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    {m ? (
                        <dl className="flex gap-4 tabular-nums">
                            <div>
                                <dt className="text-[11px] text-white/40">Proteína</dt>
                                <dd className="font-black text-nppro-green">{m.protein} g</dd>
                            </div>
                            <div>
                                <dt className="text-[11px] text-white/40">Calorías</dt>
                                <dd className="font-black">{m.kcal}</dd>
                            </div>
                            <div className="hidden min-[400px]:block">
                                <dt className="text-[11px] text-white/40">Carbos</dt>
                                <dd className="font-black">{m.carbs} g</dd>
                            </div>
                        </dl>
                    ) : <span />}
                    <button
                        ref={buttonRef}
                        type="button"
                        onClick={handleAddToCart}
                        aria-label={`Agregar ${product.name} al pedido`}
                        className="pointer-events-auto relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-nppro-green text-black transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <Plus size={22} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
