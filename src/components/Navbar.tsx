import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
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

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }, [isOpen]);

    const [isAnimating, setIsAnimating] = useState(false);
    useEffect(() => {
        if (totalItems > 0) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [totalItems]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menú', path: '/menu' },
        { name: 'Packs', path: '/packs' },
        { name: 'Macros', path: '/macros' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-500 ${scrolled || isOpen
                    ? 'bg-[#0B0B0B]/90 backdrop-blur-xl py-4 border-b border-white/5'
                    : 'bg-transparent py-7'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">

                    <Link to="/" className="relative z-[130] group">
                        <img
                            src={logo}
                            alt="NPPRO Logo"
                            className="h-8 md:h-10 w-auto object-contain invert transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
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

                        <div className="h-4 w-[1px] bg-white/10 mx-2" />


                        <Link
                            to="/checkout"
                            className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-[#00FF00] hover:text-black transition-all group ${isAnimating ? 'animate-bounce' : ''}`}
                        >
                            <ShoppingCart size={15} className="text-[#00FF00] group-hover:text-black" />
                            <span className="text-[10px] font-black uppercase">({totalItems})</span>
                        </Link>
                    </nav>

                    <div className="md:hidden flex items-center gap-5 relative z-[130]">
                        <Link to="/checkout" className="relative group">
                            <ShoppingCart size={24} className="text-white transition-colors" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#00FF00] text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-1">
                            {isOpen ? <X size={30} /> : <Menu size={30} />}
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-[#0B0B0B] z-[110] md:hidden flex flex-col pt-32 px-10"
                    >
                        <nav className="flex flex-col gap-8 text-right">
                            {navLinks.map((link, i) => (
                                <motion.div key={link.path} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                                    <Link to={link.path} onClick={() => setIsOpen(false)} className={`text-5xl font-black uppercase tracking-tighter ${location.pathname === link.path ? 'text-[#00FF00]' : 'text-white'}`}>
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-150%) skewX(-20deg); }
                    100% { transform: translateX(150%) skewX(-20deg); }
                }
                .group:hover .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; filter: brightness(1); }
                    50% { opacity: .7; filter: brightness(1.5); }
                }
            `}</style>
        </>
    );
};

export default Navbar;