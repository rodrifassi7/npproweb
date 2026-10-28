import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PREMADE_PACKS, MENU } from '../../data/data';
import FadeIn from '../common/FadeIn';
import { formatPrice } from '../../utils/format';

const PACKS = [
    { key: 'mass5', perks: ['5 platos distintos', 'Volumen o Definición'] },
    { key: 'mass10', perks: ['8 platos distintos', 'Volumen o Definición', 'Envío gratis en Trelew'], featured: true },
] as const;

// Platos del pack de 10, para mostrar qué trae
const PACK_PLATES = (PREMADE_PACKS.mass10.items as { id: string }[])
    .map(it => MENU.find(p => p.id === it.id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.image))
    .slice(0, 5);

const PacksSection: React.FC = () => (
    <section className="relative overflow-hidden bg-[#0B0B0B] py-20 md:py-28">
        <div className="container mx-auto px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <FadeIn>
                    <h2 className="text-4xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl">
                        Comé bien toda la semana
                    </h2>
                    <p className="mt-5 max-w-md text-white/60 md:text-lg">
                        Los packs congelados vienen listos para el freezer. Sacás uno, lo calentás y listo:
                        cuanto más grande el pack, menos pagás por comida.
                    </p>

                    {/* Platos del pack, superpuestos */}
                    <div className="mt-8 flex" aria-hidden="true">
                        {PACK_PLATES.map((p, i) => (
                            <img
                                key={p.id}
                                src={p.image}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                width={640}
                                height={640}
                                className="pack-plate -ml-6 h-20 w-20 rounded-full first:ml-0 md:-ml-8 md:h-28 md:w-28"
                                style={{ '--i': i } as React.CSSProperties}
                            />
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-white/45">Pedidos hasta el viernes. Los packs se entregan lunes o martes.</p>
                </FadeIn>

                <div className="grid gap-4 sm:grid-cols-2">
                    {PACKS.map(({ key, perks, ...rest }, i) => {
                        const pack = PREMADE_PACKS[key];
                        const featured = 'featured' in rest && rest.featured;
                        const perMeal = pack.price / pack.mealsCount;
                        return (
                            <FadeIn key={key} delay={i * 0.12}>
                                <article
                                    className={`flex h-full flex-col rounded-[2rem] p-6 md:p-7 ${featured
                                        ? 'bg-nppro-green text-black'
                                        : 'border border-white/10 bg-white/[0.03]'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black uppercase italic tracking-tight">Pack x{pack.mealsCount}</h3>
                                        {featured && (
                                            <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-nppro-green">El más elegido</span>
                                        )}
                                    </div>
                                    <p className="mt-6 text-5xl font-black tabular-nums tracking-tight">{formatPrice(perMeal)}</p>
                                    <p className={`mt-1 text-sm ${featured ? 'text-black/65' : 'text-white/50'}`}>
                                        por comida ({formatPrice(pack.price)} el pack)
                                    </p>
                                    <ul className="mt-6 space-y-2 text-sm font-medium">
                                        {perks.map(perk => (
                                            <li key={perk} className="flex items-center gap-2">
                                                <Check size={16} strokeWidth={3} className={featured ? 'text-black' : 'text-nppro-green'} />
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to="/packs"
                                        className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-black uppercase italic transition-transform hover:scale-[1.02] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${featured
                                            ? 'bg-black text-white focus-visible:outline-black'
                                            : 'bg-white text-black focus-visible:outline-white'}`}
                                    >
                                        Armar mi pack
                                    </Link>
                                </article>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
);

export default PacksSection;
