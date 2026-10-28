import React from 'react';
import { Search } from 'lucide-react';
import type { Category } from '../../types';
import { MENU } from '../../data/data';

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
        { id: 'todos', label: 'Todo' },
        { id: 'vianda', label: 'Viandas' },
        { id: 'wrap', label: 'Wraps' },
        { id: 'postre', label: 'Postres' },
    ].filter(c => c.id === 'todos' || MENU.some(p => p.category === c.id)) as { id: Category | 'todos'; label: string }[];

    return (
        <div className="z-40 mb-8 flex flex-col gap-3 md:sticky md:top-24 md:mb-12 md:flex-row md:items-center md:justify-between md:rounded-full md:border md:border-white/10 md:bg-[#0B0B0B]/95 md:p-2">
            {/* Categorías */}
            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 scrollbar-hide md:mx-0 md:px-0" role="tablist" aria-label="Categorías">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        role="tab"
                        aria-selected={activeCategory === cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nppro-green ${activeCategory === cat.id
                            ? 'bg-nppro-green text-black'
                            : 'border border-white/10 text-white/60 hover:text-white md:border-transparent'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Buscador */}
            <div className="relative w-full md:w-72">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                <input
                    type="search"
                    placeholder="Buscar plato"
                    aria-label="Buscar plato"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-nppro-green/60 focus:outline-none"
                />
            </div>
        </div>
    );
};

export default MenuToolbar;
