import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import FadeIn from '../common/FadeIn';

const MacrosTeaser: React.FC = () => (
    <section className="bg-[#0B0B0B] pb-20 md:pb-28">
        <div className="container mx-auto px-6">
            <FadeIn>
                <Link
                    to="/macros"
                    className="group flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-nppro-green/50 md:flex-row md:items-center md:justify-between md:p-8"
                >
                    <div className="flex items-center gap-5">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nppro-green/15 text-nppro-green">
                            <Calculator size={22} />
                        </span>
                        <div>
                            <p className="text-xl font-black md:text-2xl">¿No sabés cuánto comer?</p>
                            <p className="text-white/55">Calculá tus calorías y macros en un minuto, gratis.</p>
                        </div>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-black transition-transform group-hover:scale-[1.03]">
                        Calcular mis macros
                    </span>
                </Link>
            </FadeIn>
        </div>
    </section>
);

export default MacrosTeaser;
