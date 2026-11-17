import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MENU, PACK_CONFIG, getPackPricePerMeal } from '../../data/data';
import { formatPrice } from '../../utils/format';

// Platos que van girando en la portada (se leen del menú, así los macros siempre coinciden).
const HERO_IDS = ['m10', 'm6', 'm15', 'm12', 'm1'];
const HERO_DISHES = HERO_IDS
    .map(id => MENU.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p && p.image && p.macros));

const ROTATE_MS = 4200;

// Precios para la comparación suelta contra pack (salen de data.ts: si cambian, cambia solo)
const SINGLE_PRICE = MENU.find(p => p.packEligible)?.price ?? 0;
const BIG_PACK_PRICE = getPackPricePerMeal(PACK_CONFIG.BIG_PACK_MEALS, 'frozen');
const PACK_SAVING = (SINGLE_PRICE - BIG_PACK_PRICE) * PACK_CONFIG.BIG_PACK_MEALS;

// Los dos botones de la portada entran al armador con el objetivo ya elegido
const GOAL_LINKS = [
    { param: 'definicion', label: 'Definición', hint: 'Bajar grasa' },
    { param: 'volumen', label: 'Volumen', hint: 'Ganar masa' },
];

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const HeroSection: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [extrasReady, setExtrasReady] = useState(false);
    const [paused, setPaused] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // El primer plato carga ya; el resto, un rato después (no compiten con la carga inicial).
    useEffect(() => {
        const t = setTimeout(() => setExtrasReady(true), 1200);
        return () => clearTimeout(t);
    }, []);

    // Rotación automática de platos.
    useEffect(() => {
        if (!extrasReady || paused || prefersReducedMotion()) return;
        const t = setInterval(() => {
            if (document.visibilityState === 'visible') setIndex(i => (i + 1) % HERO_DISHES.length);
        }, ROTATE_MS);
        return () => clearInterval(t);
    }, [extrasReady, paused]);

    // Al bajar, el plato gira y se aleja. Una sola variable CSS, actualizada por frame.
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || prefersReducedMotion()) return;
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const p = Math.min(Math.max(window.scrollY / el.offsetHeight, 0), 1);
                el.style.setProperty('--hero-p', p.toFixed(3));
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const current = HERO_DISHES[index];

    return (
        <section ref={sectionRef} className="hero relative overflow-hidden bg-[#0B0B0B]">
            {/* Luz suave detrás del plato (gradiente, no blur: es liviano en celulares) */}
            <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="container relative mx-auto grid items-center gap-8 px-6 pb-14 pt-28 md:min-h-[100svh] md:grid-cols-[1.05fr_1fr] md:gap-6 md:pb-10 md:pt-24">
                {/* Texto */}
                <div className="hero-copy min-w-0 max-w-xl">
                    <h1 className="mb-5 pt-[0.12em] text-[13.5vw] font-black uppercase italic leading-[0.98] tracking-tighter sm:text-[10vw] md:mb-6 md:text-[5.6rem] lg:text-[6.6rem]">
                        <span className="hero-line block" style={{ '--d': '0ms' } as React.CSSProperties}>Calentás.</span>
                        <span className="hero-line block" style={{ '--d': '140ms' } as React.CSSProperties}>Comés.</span>
                        <span className="hero-line block" style={{ '--d': '280ms' } as React.CSSProperties}>Rendís.</span>
                    </h1>

                    <p className="hero-fade mb-6 max-w-md text-[15px] leading-relaxed text-white/60 md:mb-8 md:text-lg" style={{ '--d': '420ms' } as React.CSSProperties}>
                        Tu semana de comida, resuelta. Armá tu pack de comidas altas en proteína,
                        congeladas o al vacío, y te lo llevamos.
                    </p>

                    {/* Entrada directa al armador de packs, con el objetivo ya elegido */}
                    <div className="hero-fade" style={{ '--d': '520ms' } as React.CSSProperties}>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                            Armá tu pack · ¿Cuál es tu objetivo?
                        </p>
                        <div className="grid max-w-md grid-cols-2 gap-3">
                            {GOAL_LINKS.map(g => (
                                <Link
                                    key={g.param}
                                    to={`/packs?objetivo=${g.param}`}
                                    className="flex flex-col rounded-2xl bg-nppro-green px-4 py-3.5 text-black transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nppro-green md:px-5 md:py-4"
                                >
                                    <span className="text-base font-black uppercase italic leading-tight md:text-xl">{g.label}</span>
                                    <span className="text-xs font-semibold text-black/65 md:text-sm">{g.hint}</span>
                                </Link>
                            ))}
                        </div>
                        <Link
                            to="/menu"
                            className="mt-4 inline-block text-sm font-bold text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        >
                            Prefiero ver el menú
                        </Link>
                    </div>

                    <p className="hero-fade mt-6 max-w-md text-sm leading-relaxed text-white/45" style={{ '--d': '620ms' } as React.CSSProperties}>
                        Suelta {formatPrice(SINGLE_PRICE)}. En pack de {PACK_CONFIG.BIG_PACK_MEALS}:{' '}
                        <span className="font-semibold text-white/80">{formatPrice(BIG_PACK_PRICE)} por comida y envío gratis</span>.{' '}
                        Ahorrás {formatPrice(PACK_SAVING)} en {PACK_CONFIG.BIG_PACK_MEALS} comidas.
                    </p>
                </div>

                {/* Plato */}
                <div
                    className="relative mx-auto w-full min-w-0 max-w-[340px] md:max-w-[520px]"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="hero-plate relative aspect-square">
                        {HERO_DISHES.map((dish, i) =>
                            i === 0 || extrasReady ? (
                                <img
                                    key={dish.id}
                                    src={dish.image}
                                    alt={i === index ? dish.name : ''}
                                    aria-hidden={i !== index}
                                    width={640}
                                    height={640}
                                    decoding="async"
                                    {...(i === 0 ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
                                    className={`hero-dish absolute inset-0 h-full w-full object-contain ${i === index ? 'is-active' : ''}`}
                                />
                            ) : null
                        )}
                    </div>

                    {/* Plato actual y sus macros */}
                    <div className="hero-fade mt-4 text-center" style={{ '--d': '700ms' } as React.CSSProperties} aria-live="polite">
                        <Link to="/menu" className="text-sm font-bold text-white hover:text-nppro-green md:text-base">
                            {current.name}
                        </Link>
                        <dl className="mt-3 flex justify-center gap-6 tabular-nums">
                            <div>
                                <dt className="text-xs text-white/45">Proteína</dt>
                                <dd className="text-xl font-black text-nppro-green">{current.macros?.protein} g</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-white/45">Calorías</dt>
                                <dd className="text-xl font-black">{current.macros?.kcal}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-white/45">Carbohidratos</dt>
                                <dd className="text-xl font-black">{current.macros?.carbs} g</dd>
                            </div>
                        </dl>

                        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Elegir plato">
                            {HERO_DISHES.map((dish, i) => (
                                <button
                                    key={dish.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={i === index}
                                    aria-label={dish.name}
                                    onClick={() => { setIndex(i); setExtrasReady(true); setPaused(true); }}
                                    className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${i === index ? 'w-6 bg-nppro-green' : 'w-1.5 bg-white/25 hover:bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
