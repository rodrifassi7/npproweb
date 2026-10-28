import React, { useState } from 'react';
import { MENU } from '../../data/data';
import FadeIn from '../common/FadeIn';

const DISH = MENU.find(p => p.id === 'm1')!;

const GOALS = {
    volumen: {
        label: 'Volumen',
        text: 'Porción más grande y más carbohidratos, para ganar masa muscular.',
        macros: DISH.macros!,
    },
    definicion: {
        label: 'Definición',
        text: 'Menos calorías con la proteína alta, para bajar grasa sin perder músculo.',
        macros: DISH.macrosLean ?? DISH.macros!,
    },
} as const;

type Goal = keyof typeof GOALS;

const ROWS: { key: 'kcal' | 'protein' | 'carbs' | 'fat'; label: string; unit: string }[] = [
    { key: 'kcal', label: 'Calorías', unit: '' },
    { key: 'protein', label: 'Proteína', unit: ' g' },
    { key: 'carbs', label: 'Carbohidratos', unit: ' g' },
    { key: 'fat', label: 'Grasas', unit: ' g' },
];

const GoalsSection: React.FC = () => {
    const [goal, setGoal] = useState<Goal>('volumen');
    const g = GOALS[goal];

    return (
        <section className="bg-[#0B0B0B] py-20 md:py-28">
            <div className="container mx-auto px-6">
                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                    <FadeIn>
                        <h2 className="text-4xl font-black uppercase italic leading-[0.95] tracking-tighter md:text-6xl">
                            Mismo plato, dos objetivos
                        </h2>
                        <p className="mt-5 max-w-md text-white/60 md:text-lg">
                            Todos los platos vienen en dos versiones. Elegís la que va con tu entrenamiento.
                        </p>

                        <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1" role="tablist" aria-label="Objetivo">
                            {(Object.keys(GOALS) as Goal[]).map(k => (
                                <button
                                    key={k}
                                    type="button"
                                    role="tab"
                                    aria-selected={goal === k}
                                    onClick={() => setGoal(k)}
                                    className={`rounded-full px-6 py-2.5 text-sm font-black uppercase italic transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green ${goal === k ? 'bg-nppro-green text-black' : 'text-white/60 hover:text-white'}`}
                                >
                                    {GOALS[k].label}
                                </button>
                            ))}
                        </div>
                        <p className="mt-5 min-h-[3rem] max-w-sm text-white/80" aria-live="polite">{g.text}</p>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6 md:p-8">
                            <div className="flex items-center gap-5">
                                <img
                                    src={DISH.image}
                                    alt={DISH.name}
                                    loading="lazy"
                                    decoding="async"
                                    width={640}
                                    height={640}
                                    className={`goal-plate h-28 w-28 object-contain md:h-36 md:w-36 ${goal === 'definicion' ? 'is-small' : ''}`}
                                />
                                <div>
                                    <p className="text-sm text-white/45">Ejemplo</p>
                                    <p className="text-xl font-black uppercase italic">{DISH.name}</p>
                                </div>
                            </div>
                            <dl className="mt-6 divide-y divide-white/5">
                                {ROWS.map(r => (
                                    <div key={r.key} className="flex items-baseline justify-between py-3">
                                        <dt className="text-white/55">{r.label}</dt>
                                        <dd className={`text-2xl font-black tabular-nums ${r.key === 'protein' ? 'text-nppro-green' : ''}`}>
                                            {g.macros[r.key]}{r.unit}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default GoalsSection;
