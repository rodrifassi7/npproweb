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
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="NPPRO Logo"
                        className="h-8 md:h-10 w-auto object-contain invert hover:scale-110 transition-all duration-600 "
                    />

                    {/* <span className="text-xl font-bold tracking-tighter">NPPRO</span> */}
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium hover:text-nppro-green transition-colors">Home</Link>
                    <Link to="/menu" className="text-sm font-medium hover:text-nppro-green transition-colors">Menú</Link>
                    <Link to="/packs" className="text-sm font-medium hover:text-nppro-green transition-colors">Armar Pack</Link>
                    <Link to="/macros" className="text-sm font-medium hover:text-nppro-green transition-colors">Macros</Link>
                    <a href="https://www.instagram.com/nppro_/" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">
                        <Instagram size={20} />
                    </a>
                    <Link to="/checkout" className="relative p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-nppro-green text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0B0B0B]">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <Link to="/checkout" className="relative p-2">
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-nppro-green text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-[#0B0B0B] border-b border-white/10 p-6 flex flex-col gap-6 md:hidden"
                    >
                        <Link to="/" className="text-lg font-medium">Home</Link>
                        <Link to="/menu" className="text-lg font-medium">Menú</Link>
                        <Link to="/packs" className="text-lg font-medium">Armar mi Pack</Link>
                        <Link to="/macros" className="text-lg font-medium">Macros</Link>
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-white/50 text-sm">NPPRO Trelew</span>
                            <div className="flex gap-4">
                                <Instagram size={24} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
