import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';
import FadeIn from '../common/FadeIn';
import { formatPrice } from '../../utils/format';

interface DailySpecialSectionProps {
    dailySpecials: {
        lunch: Product;
        dinner: Product;
    };
}

const DailySpecialSection: React.FC<DailySpecialSectionProps> = ({ dailySpecials }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (product: Product, event: React.MouseEvent<HTMLButtonElement>) => {
        addToCart(product, { useVacuum: false });
        const buttonEl = event.currentTarget;
        import('../../utils/flyToCart').then(({ flyToCart }) => {
            flyToCart(buttonEl, '#cart-icon-desktop', '#cart-icon-mobile', product.image);
        });
    };

    const specials = [
        { product: dailySpecials.lunch, shift: 'Almuerzo' },
        { product: dailySpecials.dinner, shift: 'Cena' },
    ];

    return (
        <section className="bg-[#070707] py-20 md:py-28">
            <div className="container mx-auto px-6">
                <FadeIn className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-4xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">El menú de hoy</h2>
                        <p className="mt-3 max-w-md text-white/55">Dos platos frescos por día. Los pedís hoy y te los llevamos.</p>
                    </div>
                    <Link to="/menu" className="text-sm font-bold text-nppro-green hover:underline">
                        Ver el menú completo
                    </Link>
                </FadeIn>

                {/* En celular se desliza de costado; en compu van en dos columnas */}
                <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0">
                    {specials.map(({ product, shift }, i) => (
                        <FadeIn
                            key={product.id}
                            delay={i * 0.12}
                            className="w-[82%] shrink-0 snap-center md:w-auto"
                        >
                            <article className="flex h-full flex-col rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-5 md:flex-row md:items-center md:gap-6 md:p-6">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                    decoding="async"
                                    width={640}
                                    height={640}
                                    className="mx-auto aspect-square w-full max-w-[260px] object-contain md:w-48 md:max-w-none"
                                />
                                <div className="mt-4 flex flex-1 flex-col md:mt-0">
                                    <span className="text-sm font-semibold text-nppro-green">{shift}</span>
                                    <h3 className="mt-1 text-xl font-black uppercase italic leading-tight tracking-tight md:text-2xl">{product.name}</h3>
                                    {product.macros && (
                                        <p className="mt-2 text-sm tabular-nums text-white/55">
                                            {product.macros.protein} g de proteína, {product.macros.kcal} kcal
                                        </p>
                                    )}
                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <span className="text-2xl font-black tabular-nums">{formatPrice(product.price)}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => handleAddToCart(product, e)}
                                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green"
                                        >
                                            <Plus size={16} strokeWidth={3} />
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </article>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DailySpecialSection;
