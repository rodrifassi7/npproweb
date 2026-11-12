import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Snowflake, Package } from 'lucide-react';
import { MENU, PACK_CONFIG, getPackPricePerMeal } from '../../data/data';
import type { PackType } from '../../data/data';
import FadeIn from '../common/FadeIn';
import { formatPrice } from '../../utils/format';

const OPTIONS: { type: PackType; label: string; perks: string[]; featured?: boolean }[] = [
    {
        type: 'frozen',
        label: 'Congelado',
        perks: ['Directo al freezer', 'Entrega lunes o martes', `Envío gratis desde ${PACK_CONFIG.BIG_PACK_MEALS} comidas`],
        featured: true,
    },
    {
        type: 'vacuum',
        label: 'Al vacío',
        perks: ['Fresco, hasta 5 días en heladera', 'El día lo coordinamos por WhatsApp', `Envío gratis desde ${PACK_CONFIG.BIG_PACK_MEALS} comidas`],
    },
];

// Algunos platos para mostrar
const PACK_PLATES = MENU.filter(p => p.packEligible && p.image).slice(0, 5);

const PacksSection: React.FC = () => (
    <section className="relative overflow-hidden bg-[#0B0B0B] py-20 md:py-28">
        <div className="container mx-auto px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <FadeIn>
                    <h2 className="text-4xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl">
                        Comé bien toda la semana
                    </h2>
                    <p className="mt-5 max-w-md text-white/60 md:text-lg">
                        Elegís tu objetivo, si lo querés congelado o al vacío, y las comidas que lleva. Desde {PACK_CONFIG.MIN_MEALS} comidas;
                        llevando {PACK_CONFIG.BIG_PACK_MEALS} o más pagás menos por cada una y el envío es gratis.
                    </p>

                    {/* Platos, superpuestos */}
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
                </FadeIn>

                <div className="grid gap-4 sm:grid-cols-2">
                    {OPTIONS.map(({ type, label, perks, featured }, i) => {
                        const Icon = type === 'frozen' ? Snowflake : Package;
                        return (
                            <FadeIn key={type} delay={i * 0.12}>
                                <article
                                    className={`flex h-full flex-col rounded-[2rem] p-6 md:p-7 ${featured
                                        ? 'bg-nppro-green text-black'
                                        : 'border border-white/10 bg-white/[0.03]'}`}
                                >
                                    <h3 className="flex items-center gap-2 text-2xl font-black uppercase italic tracking-tight">
                                        <Icon size={22} className={featured ? 'text-black' : 'text-nppro-green'} />{label}
                                    </h3>
                                    <p className={`mt-6 text-sm ${featured ? 'text-black/65' : 'text-white/50'}`}>desde</p>
                                    <p className="text-5xl font-black tabular-nums tracking-tight">
                                        {formatPrice(getPackPricePerMeal(PACK_CONFIG.BIG_PACK_MEALS, type))}
                                    </p>
                                    <p className={`mt-1 text-sm ${featured ? 'text-black/65' : 'text-white/50'}`}>
                                        por comida ({formatPrice(getPackPricePerMeal(PACK_CONFIG.MIN_MEALS, type))} de {PACK_CONFIG.MIN_MEALS} a {PACK_CONFIG.BIG_PACK_MEALS - 1})
                                    </p>
                                    <ul className="mt-6 flex-1 space-y-2 text-sm font-medium">
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
