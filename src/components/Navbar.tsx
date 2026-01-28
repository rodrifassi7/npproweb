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

    // 1. Control de scroll para el estilo del header
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. BLOQUEO DE SCROLL: Evita que el usuario scrollee la web cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // Cerrar menú al navegar
    useEffect(() => setIsOpen(false), [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menú', path: '/menu' },
        { name: 'Packs', path: '/packs' },
        { name: 'Macros', path: '/macros' },
    ];

    return (
        <>
            {/* Main Header Container */}
            <header
                className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-300 ${scrolled || isOpen
                        ? 'bg-[#0B0B0B]/95 backdrop-blur-md py-4 border-b border-white/5'
                        : 'bg-transparent py-7'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">

                    {/* Logo - Siempre encima (z-130) */}
                    <Link to="/" className="relative z-[130] group">
                        <img
                            src={logo}
                            alt="NPPRO Logo"
                            className="h-8 md:h-10 w-auto object-contain invert transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative text-[11px] uppercase tracking-[0.2em] font-bold transition-colors ${location.pathname === link.path ? 'text-[#00FF00]' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div layoutId="underline" className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#00FF00]" />
                                )}
                            </Link>
                        ))}

                        <div className="h-4 w-[1px] bg-white/20 mx-2" />

                        <Link to="/checkout" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:bg-[#00FF00] hover:text-black transition-all group">
                            <ShoppingCart size={16} className="text-[#00FF00] group-hover:text-black" />
                            <span className="text-[10px] font-black uppercase">Carrito ({totalItems})</span>
                        </Link>
                    </nav>

                    {/* Mobile Toggle & Cart - Siempre encima (z-130) */}
                    <div className="md:hidden flex items-center gap-6 relative z-[130]">
                        <Link to="/checkout" className="relative">
                            <ShoppingCart size={24} className="text-white" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#00FF00] text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white focus:outline-none"
                        >
                            {isOpen ? <X size={30} /> : <Menu size={30} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Fullscreen Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-[#0B0B0B] z-[110] md:hidden flex flex-col pt-32 px-10"
                    >
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        className={`text-5xl font-black uppercase tracking-tighter ${location.pathname === link.path ? 'text-[#00FF00]' : 'text-white'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-auto mb-12 flex justify-between items-end border-t border-white/10 pt-8"
                        >
                            <div>
                                <p className="text-[#00FF00] font-black text-xl tracking-tighter">NP PRO</p>
                                <p className="text-gray-500 text-xs uppercase tracking-widest">Fuel for performance</p>
                            </div>
                            <a href="https://instagram.com/nppro_" target="_blank" rel="noreferrer">
                                <Instagram size={32} className="text-white hover:text-[#00FF00] transition-colors" />
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;