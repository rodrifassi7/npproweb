import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MENU } from '../../data/data';

// Platos que van girando en la portada (se leen del menú, así los macros siempre coinciden).
const HERO_IDS = ['m10', 'm6', 'm15', 'm12', 'm1'];
const HERO_DISHES = HERO_IDS
    .map(id => MENU.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p && p.image && p.macros));

const ROTATE_MS = 4200;

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

                    <p className="hero-fade mb-7 max-w-md text-[15px] leading-relaxed text-white/60 md:mb-9 md:text-lg" style={{ '--d': '420ms' } as React.CSSProperties}>
                        Viandas altas en proteína, hechas en Trelew. Elegí Volumen o Definición,
                        armá tu pack y lo tenés listo en 3 minutos de microondas.
                    </p>

                    <div className="hero-fade flex flex-row gap-3" style={{ '--d': '520ms' } as React.CSSProperties}>
                        <Link
                            to="/packs"
                            className="inline-flex flex-1 items-center justify-center rounded-full bg-nppro-green px-5 py-3.5 text-sm sm:flex-none sm:px-8 md:py-4 font-black uppercase italic text-black transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nppro-green md:text-base"
                        >
                            Armar mi pack
                        </Link>
                        <Link
                            to="/menu"
                            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 px-5 py-3.5 text-sm sm:flex-none sm:px-8 md:py-4 font-bold text-white/80 transition-colors hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:text-base"
                        >
                            Ver el menú
                        </Link>
                    </div>

                    <p className="hero-fade mt-6 text-sm text-white/45" style={{ '--d': '620ms' } as React.CSSProperties}>
                        Pack de 10: <span className="font-semibold text-white/80">$10.000 por comida</span>, con envío gratis en Trelew.
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
