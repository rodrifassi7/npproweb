import React from 'react';
import { Link } from 'react-router-dom';
import MacrosCalculator from '../components/MacrosCalculator/MacrosCalculator';
import FadeIn from '../components/common/FadeIn';

const MacrosPage: React.FC = () => (
    <div className="min-h-screen bg-[#0B0B0B] pt-28">
        <div className="container mx-auto px-6">
            <FadeIn className="mx-auto mb-10 max-w-5xl md:mb-14">
                <h1 className="text-5xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-7xl">Calculadora de macros</h1>
                <p className="mt-5 max-w-xl text-white/60 md:text-lg">
                    Completá tus datos y te decimos cuántas calorías, proteína, carbohidratos y grasas necesitás por día
                    según tu objetivo. Es gratis y no te pedimos el mail.
                </p>
            </FadeIn>
        </div>

        <MacrosCalculator />

        <section className="border-t border-white/5 py-16 md:py-20">
            <div className="container mx-auto px-6">
                <FadeIn className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter md:text-4xl">¿Y ahora qué como?</h2>
                        <p className="mt-2 max-w-md text-white/60">
                            Si querés subir, elegí Volumen. Si querés bajar, Definición. Todos nuestros platos vienen en las dos versiones.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/packs" className="inline-flex items-center justify-center rounded-full bg-nppro-green px-6 py-3.5 text-sm font-black uppercase italic text-black transition-transform hover:scale-[1.03]">
                            Armar mi pack
                        </Link>
                        <Link to="/menu" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white/80 hover:text-white">
                            Ver el menú
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    </div>
);

export default MacrosPage;
