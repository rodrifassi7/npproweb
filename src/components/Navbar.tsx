import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Instagram } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { totalItems } = useCart();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => setIsOpen(false), [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menú', path: '/menu' },
        { name: 'Packs', path: '/packs' },
        { name: 'Macros', path: '/macros' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
            ? 'bg-[#0B0B0B]/90 backdrop-blur-md py-3 border-b border-nppro-green/10'
            : 'bg-transparent py-7'
            }`}>
            <div className="container mx-auto px-6 flex justify-between items-center">

                {/* Logo con Hover de Brillo */}
                <Link to="/" className="group relative">
                    <img
                        src={logo}
                        alt="NPPRO Logo"
                        className="h-8 md:h-10 w-auto object-contain invert transition-all duration-500 group-hover:brightness-125 group-hover:drop-shadow-[0_0_8px_rgba(var(--nppro-green-rgb),0.5)]"
                    />
                </Link>

                {/* Desktop Navigation - Estilo Underline & Green Hover */}
                <div className="hidden md:flex items-center gap-10">
                    <ul className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`relative py-2 text-xs uppercase tracking-[0.2em] font-bold transition-colors duration-300 group ${location.pathname === link.path ? 'text-nppro-green' : 'text-gray-400 hover:text-nppro-green'
                                        }`}
                                >
                                    {link.name}
                                    {/* Línea animada de hover */}
                                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-nppro-green transition-transform duration-300 origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`} />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Separador Vertical */}
                    <div className="h-4 w-[1px] bg-white/10" />

                    <div className="flex items-center gap-6">
                        <a
                            href="https://www.instagram.com/nppro_/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 hover:text-nppro-green transition-all transform hover:rotate-12"
                        >
                            <Instagram size={18} />
                        </a>

                        {/* Cart Button Estilizado */}
                        <Link to="/checkout" className="relative group">
                            <div className="flex items-center gap-2 px-4 py-2 bg-nppro-green/5 border border-nppro-green/20 rounded-sm group-hover:bg-nppro-green group-hover:border-nppro-green transition-all duration-300">
                                <ShoppingCart size={18} className="text-nppro-green group-hover:text-black transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-tighter text-white group-hover:text-black">
                                    Carrito ({totalItems})
                                </span>
                            </div>
                            {/* Glow effect en el cart */}
                            <div className="absolute inset-0 bg-nppro-green blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                        </Link>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="md:hidden flex items-center gap-5">
                    <Link to="/checkout" className="relative">
                        <ShoppingCart size={22} className="text-white hover:text-nppro-green transition-colors" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-nppro-green text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu con Slide lateral */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 top-0 right-0 bottom-0 left-0 bg-[#0B0B0B] z-[90] flex flex-col p-10 md:hidden"
                    >
                        <div className="flex flex-col gap-8 mt-20">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-4xl font-black uppercase tracking-tighter ${location.pathname === link.path ? 'text-nppro-green' : 'text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto flex justify-between items-end">
                            <div>
                                <p className="text-nppro-green font-bold text-lg">NP PRO</p>
                                <p className="text-gray-500 text-sm">Fuel for performance.</p>
                            </div>
                            <Instagram size={32} className="text-white" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;