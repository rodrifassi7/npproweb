import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, RotateCcw, ArrowRight, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MacroInput, MacroResult } from '../../types/macros';
import { calculateMacros } from '../../utils/macroCalculator';

const STORAGE_KEY = 'nppro_macros_v1';

const INITIAL_INPUT: MacroInput = {
    gender: 'male',
    age: 30,
    height: 175,
    weight: 75,
    activity: 1.2,
    goal: 'maintain',
    dietPreference: 'balanced',
    strengthTraining: false
};

const MacrosCalculator: React.FC = () => {
    const [input, setInput] = useState<MacroInput>(INITIAL_INPUT);
    const [result, setResult] = useState<MacroResult | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setInput(parsed.input);
                setResult(parsed.result);
            } catch (e) { console.error(e); }
        }
    }, []);

    const handleCalculate = () => {
        const newResult = calculateMacros(input);
        setResult(newResult);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ input, result: newResult }));
    };

    const handleReset = () => {
        setInput(INITIAL_INPUT);
        setResult(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const handleChange = (key: keyof MacroInput, value: any) => {
        setInput(prev => ({ ...prev, [key]: value }));
    };

    const MacroBar = ({ label, value, unit, color, percentage }: { label: string, value: number, unit: string, color: string, percentage: number }) => (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black uppercase tracking-widest text-black/70">{label}</span>
                <span className="text-lg font-black italic text-black">
                    {value}<span className="text-[10px] ml-1 opacity-60 not-italic">{unit}</span>
                </span>
            </div>
            <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, percentage)}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );

    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">

                    <div className="mb-12 text-center md:text-left">
                        <span className="text-nppro-green font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Herramienta Gratuita</span>
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
                            Calculadora <span className="text-white/30">de Macros</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                        {/* ================= FORMULARIO ================= */}
                        <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[32px]">

                            {/* Sexo */}
                            <div className="mb-8">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Seleccioná tu sexo</label>
                                <div className="flex bg-black rounded-xl p-1 border border-white/10">
                                    {(['male', 'female'] as const).map(g => (
                                        <button
                                            key={g}
                                            onClick={() => handleChange('gender', g)}
                                            className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${input.gender === g ? 'bg-nppro-green text-black' : 'text-white/40 hover:text-white'}`}
                                        >
                                            {g === 'male' ? 'Hombre' : 'Mujer'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grid Biometría - Diseño Nuevo "Cajas" */}
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[
                                    { label: 'Edad', key: 'age', unit: 'AÑOS' },
                                    { label: 'Altura', key: 'height', unit: 'CM' },
                                    { label: 'Peso', key: 'weight', unit: 'KG' }
                                ].map((field) => (
                                    <div key={field.key} className="bg-black border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center relative group focus-within:border-nppro-green transition-colors">
                                        <span className="text-[9px] text-white/30 uppercase font-bold mb-1">{field.label}</span>
                                        <input
                                            type="number"
                                            value={input[field.key as keyof MacroInput] as number}
                                            onChange={(e) => handleChange(field.key as keyof MacroInput, parseInt(e.target.value) || 0)}
                                            className="w-full bg-transparent text-center text-white font-black italic text-2xl focus:outline-none"
                                        />
                                        <span className="text-[8px] text-nppro-green uppercase tracking-widest mt-1">{field.unit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Selects: Actividad y Objetivo */}
                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">
                                        Nivel de Actividad Física
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={input.activity}
                                            onChange={(e) => handleChange('activity', parseFloat(e.target.value))}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-nppro-green focus:ring-1 focus:ring-nppro-green appearance-none"
                                        >
                                            <option value={1.2} className="bg-zinc-900">Sedentario (Oficina / Sin ejercicio)</option>
                                            <option value={1.375} className="bg-zinc-900">Ligero (1-3 días por semana)</option>
                                            <option value={1.55} className="bg-zinc-900">Moderado (3-5 días por semana)</option>
                                            <option value={1.725} className="bg-zinc-900">Intenso (6-7 días por semana)</option>
                                            <option value={1.9} className="bg-zinc-900">Atleta (Doble turno)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Activity size={14} className="text-nppro-green" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">
                                        Objetivo Nutricional
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={input.goal}
                                            onChange={(e) => handleChange('goal', e.target.value)}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-nppro-green focus:ring-1 focus:ring-nppro-green appearance-none"
                                        >
                                            <option value="lose" className="bg-zinc-900">Perder Grasa (Déficit Calórico)</option>
                                            <option value="maintain" className="bg-zinc-900">Mantenimiento (Mantener peso)</option>
                                            <option value="gain" className="bg-zinc-900">Ganar Músculo (Superávit)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Zap size={14} className="text-nppro-green" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCalculate}
                                    className="flex-1 bg-white text-black font-black italic py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-nppro-green transition-all hover:scale-[1.02] active:scale-95 text-xs tracking-widest uppercase"
                                >
                                    Calcular
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-4 border border-white/10 text-white/40 hover:text-white rounded-xl flex items-center justify-center transition-all hover:bg-white/5"
                                    title="Reiniciar"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                        </div>

                        {/* ================= RESULTADOS ================= */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {result ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        // Padding reducido y proporciones ajustadas
                                        className="bg-nppro-green text-black p-8 rounded-[32px] shadow-[0_20px_40px_-10px_rgba(34,197,94,0.2)]"
                                    >
                                        <div className="text-center mb-8 pb-8 border-b border-black/10">
                                            <span className="text-[10px] font-black uppercase tracking-widest mb-2 block opacity-60">Objetivo Diario</span>
                                            {/* Tamaño reducido de 8xl a 6xl */}
                                            <div className="text-6xl font-black italic tracking-tighter leading-none mb-1">
                                                {result.caloriesTarget}
                                            </div>
                                            <span className="text-sm font-bold uppercase opacity-50">Kcal / Día</span>
                                        </div>

                                        <div className="space-y-5 mb-8">
                                            <MacroBar
                                                label="Proteína"
                                                value={result.proteinG} unit="g" color="bg-black"
                                                percentage={(result.proteinG * 4 / result.caloriesTarget) * 200}
                                            />
                                            <MacroBar
                                                label="Carbohidratos"
                                                value={result.carbsG} unit="g" color="bg-black/40"
                                                percentage={(result.carbsG * 4 / result.caloriesTarget) * 100}
                                            />
                                            <MacroBar
                                                label="Grasas"
                                                value={result.fatsG} unit="g" color="bg-black/20"
                                                percentage={(result.fatsG * 9 / result.caloriesTarget) * 100}
                                            />
                                        </div>

                                        <Link
                                            to="/menu"
                                            className="w-full bg-black text-white font-bold italic py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-80 transition-opacity text-[10px] tracking-[0.2em] uppercase"
                                        >
                                            Ver menú <ArrowRight size={14} />
                                        </Link>
                                    </motion.div>
                                ) : (
                                    // Placeholder del mismo tamaño que la tarjeta
                                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[32px] p-8 text-center bg-white/[0.01]">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <Calculator size={24} className="text-white/20" />
                                        </div>
                                        <p className="text-xs font-medium text-white/30 uppercase tracking-widest max-w-[200px]">
                                            Completá tus datos para calcular tu plan ideal.
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MacrosCalculator;