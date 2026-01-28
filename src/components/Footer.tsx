import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../data/data';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050505] pt-24 pb-8 overflow-hidden">
            {/* Luces de ambiente sutiles */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-nppro-green/50 to-transparent" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-nppro-green/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Ticker de Marca Infinito (Opcional, da un toque muy pro) */}
            <div className="absolute top-10 flex whitespace-nowrap opacity-[0.03] select-none pointer-events-none border-y border-white py-4 overflow-hidden">
                {Array(10).fill("NP PRO • HIGH PERFORMANCE • ").map((text, i) => (
                    <span key={i} className="text-6xl font-black italic tracking-tighter uppercase ml-4">
                        {text}
                    </span>
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 mb-20">

                    {/* Columna Branding: Fuerte y Minimalista */}
                    <div className="lg:col-span-5 flex flex-col justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-3 mb-8 group cursor-pointer">
                                <div className="relative">
                                    <span className="text-5xl font-black italic tracking-tighter text-white transition-all duration-500 group-hover:text-nppro-green">
                                        NPPRO
                                    </span>
                                    <span className="absolute -bottom-1 left-0 w-0 h-1 bg-nppro-green transition-all duration-500 group-hover:w-full" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-nppro-green leading-none tracking-[0.3em]">EST.</span>
                                    <span className="text-[10px] font-bold text-nppro-green leading-none tracking-[0.3em]">2025</span>
                                </div>
                            </div>
                            <p className="text-xl text-white/50 max-w-sm leading-relaxed mb-8">
                                No solo es comida. Es <span className="text-white font-medium">ingeniería nutricional</span> para quienes buscan el máximo rendimiento.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {[
                                    { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://www.instagram.com/nppro_/' },
                                    { icon: <MessageCircle size={18} />, label: 'WhatsApp', href: `https://wa.me/${CONFIG.WHATSAPP_NUMBER}` },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="group relative flex items-center gap-3 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-nppro-green/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <span className="relative z-10 text-white group-hover:text-nppro-green transition-colors">{social.icon}</span>
                                        <span className="relative z-10 text-sm font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">{social.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Navegación: Links con Hover Magnético sutil */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-black uppercase tracking-tighter text-lg mb-8 flex items-center gap-3">
                            Explorar
                            <span className="h-px flex-1 bg-gradient-to-r from-nppro-green/50 to-transparent"></span>
                        </h4>
                        <ul className="grid grid-cols-1 gap-y-4">
                            {[
                                { label: 'Inicio', path: '/' },
                                { label: 'Menú semanal', path: '/menu' },
                                { label: 'Packs con descuento', path: '/packs' },
                                { label: 'Finalizar pedido', path: '/checkout' }
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link to={item.path} className="group flex items-center text-white/40 hover:text-white transition-all duration-300">
                                        <div className="w-0 group-hover:w-6 h-[1px] bg-nppro-green transition-all duration-300" />
                                        <span className="group-hover:translate-x-2 transition-transform duration-300 font-medium">
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna Info Operativa: Card Flotante */}
                    <div className="lg:col-span-4">
                        <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 backdrop-blur-sm overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                <ShieldCheck size={60} className="text-nppro-green" />
                            </div>

                            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-nppro-green animate-pulse"></span>
                                Info Operativa
                            </h4>

                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-2xl">
                                        <MapPin size={20} className="text-nppro-green" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-nppro-green uppercase font-black tracking-[0.2em] mb-1">Pick up point</p>
                                        <p className="text-white text-base font-medium leading-snug">{CONFIG.PICKUP_ADDRESS}</p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-2xl">
                                        <Clock size={20} className="text-nppro-green" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-nppro-green uppercase font-black tracking-[0.2em] mb-1">Entregas</p>
                                        <p className="text-white text-base font-medium">Lunes - Viernes 8:00 - 18:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Clean & Tech */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs font-bold tracking-widest text-white/30">
                        <p>© {currentYear} NPPRO by Nutrición Profesional</p>
                        <span className="hidden md:block w-1 h-1 rounded-full bg-white/10"></span>
                        <p>TRELEW, CHUBUT, AR</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-2 rounded-full border border-white/5">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Powered by</span>
                        <span className="text-[10px] font-black italic text-white hover:text-nppro-green cursor-default transition-colors">HIGH PERFORMANCE FOOD</span>
                    </div>
                </div>
            </div>

            {/* Elemento decorativo: Branding masivo */}
            <div className="absolute -bottom-20 -left-10 text-[20rem] font-black italic text-white/[0.01] select-none pointer-events-none tracking-tighter">
                NPPRO
            </div>
        </footer>
    );
};

export default Footer;