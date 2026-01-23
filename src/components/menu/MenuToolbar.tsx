import React from 'react';
import { Search } from 'lucide-react';
import type { Category } from '../../types';

interface MenuToolbarProps {
    activeCategory: Category | 'todos';
    setActiveCategory: (category: Category | 'todos') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const MenuToolbar: React.FC<MenuToolbarProps> = ({
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery
}) => {
    const categories: { id: Category | 'todos'; label: string }[] = [
        { id: 'todos', label: 'Todo el Menú' },
        { id: 'vianda', label: 'Viandas' },
        { id: 'wrap', label: 'Wraps' },
        { id: 'postre', label: 'Postres' },
    ];

    return (
        <div className="sticky top-24 z-40 mb-12">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2 md:p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl">
                {/* Categorías */}
                <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto w-full md:w-auto scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat.id
                                ? 'bg-nppro-green text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Buscador */}
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-nppro-green transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="BUSCAR PLATO..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-nppro-green/50 transition-all placeholder:text-white/20"
                    />
                </div>
            </div>
        </div>
    );
};

export default MenuToolbar;
