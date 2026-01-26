import React from 'react';
import { Instagram, MessageCircle, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { CONFIG } from '../data/data';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#0B0B0B] border-t border-white/5 pt-24 pb-12 overflow-hidden">
            {/* Elemento decorativo de fondo: Branding masivo sutil */}
            <div className="absolute -bottom-10 -right-10 text-[15rem] font-black italic text-white/[0.02] select-none pointer-events-none">
                NPPRO
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

                    {/* Columna Branding: Ocupa más espacio para impacto */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-8 group cursor-default">
                                <span className="text-4xl font-black italic tracking-tighter text-nppro-green transition-transform duration-300 group-hover:-skew-x-12">
                                    NPPRO
                                </span>
                                <div className="h-2 w-2 rounded-full bg-nppro-green animate-pulse" />
                            </div>
                            <p className="text-lg text-nppro-gray max-w-md leading-relaxed">
                                Elevamos tu nutrición al siguiente nivel.
                                <span className="text-white"> Comida real</span> diseñada para atletas y personas que no se detienen.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-10">
                            {[
                                {
                                    icon: <Instagram size={20} />,
                                    label: 'Instagram',
                                    href: 'https://www.instagram.com/nppro_/',
                                },
                                {
                                    icon: <MessageCircle size={20} />,
                                    label: 'WhatsApp',
                                    href: `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Hola%20NP%20PRO%21`,
                                },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 hover:border-nppro-green/50 hover:bg-nppro-green/5 transition-all duration-300"
                                >
                                    <span className="text-nppro-gray group-hover:text-nppro-green transition-colors">
                                        {social.icon}
                                    </span>
                                    <span className="text-sm font-medium text-white/80 group-hover:text-white">
                                        {social.label}
                                    </span>
                                </a>
                            ))}
                        </div>

                    </div>

                    {/* Columna Navegación */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-nppro-green"></span>
                            Navegación
                        </h4>
                        <ul className="space-y-4">
                            {['Inicio', 'Menú semanal', 'Packs con descuento', 'Finalizar pedido'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="group flex items-center text-nppro-gray hover:text-white transition-colors">
                                        <ArrowUpRight size={14} className="mr-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-nppro-green" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna Info Operativa */}
                    <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-nppro-green"></span>
                            Contacto & Entregas
                        </h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-nppro-green/10 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-nppro-green" />
                                </div>
                                <div>
                                    <p className="text-xs text-nppro-gray uppercase font-semibold mb-1">Punto de retiro</p>
                                    <p className="text-white/90 text-sm leading-snug">{CONFIG.PICKUP_ADDRESS}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-nppro-green/10 flex items-center justify-center shrink-0">
                                    <Clock size={18} className="text-nppro-green" />
                                </div>
                                <div>
                                    <p className="text-xs text-nppro-gray uppercase font-semibold mb-1">Días de entrega</p>
                                    <p className="text-white/90 text-sm">{CONFIG.DELIVERY_DAYS.join(' y ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6">
                    <div className="text-sm text-nppro-gray">
                        © Desde {currentYear} <span className="text-white font-medium">NPPRO</span>. Trelew, Chubut.
                    </div>

                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-nppro-gray/60 font-bold">
                        <span>High Performance</span>
                        <span className="w-1 h-1 rounded-full bg-nppro-green"></span>
                        <span>Real Food</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;