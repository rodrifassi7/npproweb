import React from 'react';
import FadeIn from '../common/FadeIn';

const STEPS = [
    { title: 'Elegí tus platos', text: 'Del menú del día o en pack. Cada plato viene en Volumen o Definición.' },
    { title: 'Pedí por la web', text: 'Confirmás por WhatsApp con una persona, no con un bot. Pagás con Mercado Pago, transferencia o efectivo.' },
    { title: 'Recibilo o retiralo', text: 'Entregamos todos los días en Trelew. También podés retirar en Paraguay 55.' },
];

const HowItWorksSection: React.FC = () => (
    <section className="border-y border-white/5 bg-[#070707] py-20 md:py-24">
        <div className="container mx-auto px-6">
            <FadeIn>
                <h2 className="text-4xl font-black uppercase italic leading-none tracking-tighter md:text-5xl">Cómo pedir</h2>
            </FadeIn>
            <ol className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
                {STEPS.map((step, i) => (
                    <FadeIn key={step.title} delay={i * 0.12}>
                        <li className="relative border-t border-white/15 pt-6">
                            <span className="text-5xl font-black italic tabular-nums text-nppro-green">{i + 1}</span>
                            <h3 className="mt-3 text-xl font-black">{step.title}</h3>
                            <p className="mt-2 max-w-xs leading-relaxed text-white/55">{step.text}</p>
                        </li>
                    </FadeIn>
                ))}
            </ol>
        </div>
    </section>
);

export default HowItWorksSection;
