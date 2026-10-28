import React from 'react';
import { ShieldCheck, Snowflake, Timer, Leaf } from 'lucide-react';
import FadeIn from '../common/FadeIn';

const FEATURES = [
    { icon: <Leaf size={18} />, title: 'Sin conservantes', text: 'Lo conserva el sellado, no los aditivos.' },
    { icon: <ShieldCheck size={18} />, title: 'Hasta 5 días en heladera', text: 'Validado con pruebas de laboratorio.' },
    { icon: <Snowflake size={18} />, title: 'Va directo al freezer', text: 'Si no la comés a tiempo, la congelás en la misma bolsa.' },
    { icon: <Timer size={18} />, title: 'Lista en minutos', text: 'Al microondas, sin ensuciar nada.' },
];

const VacuumSection: React.FC = () => (
    <section className="bg-nppro-green py-20 text-black md:py-28">
        <div className="container mx-auto px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <FadeIn>
                    <h2 className="text-5xl font-black uppercase italic leading-[0.9] tracking-tighter md:text-7xl">
                        Sellado al vacío
                    </h2>
                    <p className="mt-6 max-w-md text-lg font-medium leading-snug text-black/80 md:text-xl">
                        Cada vianda se sella apenas sale de la cocina. Así mantiene el sabor y la textura,
                        y la podés guardar sin apuro.
                    </p>
                </FadeIn>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {FEATURES.map((f, i) => (
                        <FadeIn key={f.title} delay={i * 0.08}>
                            <div className="flex h-full flex-col rounded-3xl bg-black p-5 text-white md:p-6">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-nppro-green/15 text-nppro-green">{f.icon}</span>
                                <h3 className="mt-6 text-base font-black leading-tight md:text-lg">{f.title}</h3>
                                <p className="mt-1 text-sm leading-snug text-white/55">{f.text}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default VacuumSection;
