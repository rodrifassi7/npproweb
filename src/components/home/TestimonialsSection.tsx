import React from 'react';
import FadeIn from '../common/FadeIn';

/**
 * Opiniones REALES de clientes (copiadas de WhatsApp o Instagram, con permiso).
 * Mientras la lista esté vacía, la sección no se muestra.
 */
const TESTIMONIALS: { quote: string; name: string; detail?: string }[] = [];

const TestimonialsSection: React.FC = () => {
    if (TESTIMONIALS.length === 0) return null;
    return (
        <section className="bg-[#070707] py-20 md:py-28">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <h2 className="text-4xl font-black uppercase italic leading-none tracking-tighter md:text-5xl">Lo que dicen</h2>
                </FadeIn>
                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {TESTIMONIALS.map((t, i) => (
                        <FadeIn key={t.name + i} delay={i * 0.1}>
                            <figure className="h-full rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6">
                                <blockquote className="text-lg leading-relaxed text-white/85">“{t.quote}”</blockquote>
                                <figcaption className="mt-5 text-sm text-white/50">
                                    <span className="font-bold text-white">{t.name}</span>
                                    {t.detail ? `, ${t.detail}` : ''}
                                </figcaption>
                            </figure>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
