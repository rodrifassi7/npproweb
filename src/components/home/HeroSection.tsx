import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { MENU, PACK_CONFIG, getPackPricePerMeal } from '../../data/data';
import { formatPrice } from '../../utils/format';
import packImg from '../../assets/pack-bolsa.webp';

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
    const sectionRef = useRef<HTMLElement>(null);

    // Al bajar, el texto se va y el pack se aleja un poco. Una sola variable CSS, actualizada por frame.
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

    return (
        <section ref={sectionRef} className="hero relative overflow-hidden bg-[#0B0B0B]">
            {/* Luz suave detrás del pack (gradiente, no blur: es liviano en celulares) */}
            <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="container relative mx-auto grid items-center gap-6 px-6 pb-14 pt-24 md:min-h-[100svh] md:grid-cols-[1.05fr_1fr] md:gap-10 md:pb-10">
                {/* El pack: en el celular es lo primero que se ve; en la compu va a la derecha */}
                <div className="hero-pack relative order-first mx-auto w-full max-w-[300px] sm:max-w-[380px] md:order-last md:max-w-[480px]">
                    <div className="relative aspect-square overflow-hidden rounded-[2rem] ring-1 ring-white/10 md:aspect-[4/5]">
                        <img
                            src={packImg}
                            alt="Bolsa de NPPRO con el pack de comidas de la semana"
                            width={704}
                            height={880}
                            decoding="async"
                            fetchPriority="high"
                            className="h-full w-full object-cover object-[50%_30%]"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent" aria-hidden="true" />
                        <p className="absolute bottom-3.5 left-4 right-4 flex items-center gap-2 text-[13px] font-bold text-white md:bottom-5 md:left-5 md:right-5 md:text-base">
                            <Truck size={17} className="shrink-0 text-nppro-green" />
                            <span className="md:hidden">Envío gratis desde {PACK_CONFIG.BIG_PACK_MEALS} comidas</span>
                            <span className="hidden md:inline">Te lo llevamos. Envío gratis desde {PACK_CONFIG.BIG_PACK_MEALS} comidas.</span>
                        </p>
                    </div>
                </div>

                {/* Texto y entrada al armador */}
                <div className="hero-copy min-w-0 max-w-xl">
                    <h1 className="mb-4 pt-[0.12em] text-[10.5vw] font-black uppercase italic leading-[0.98] tracking-tighter sm:text-[9vw] md:mb-6 md:text-[5.6rem] lg:text-[6.6rem]">
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
            </div>
        </section>
    );
};

export default HeroSection;
