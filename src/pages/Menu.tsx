import React, { useState } from 'react';
import { MENU } from '../data/data';
import type { Category, Product } from '../types';
import MenuHeader from '../components/menu/MenuHeader';
import MenuToolbar from '../components/menu/MenuToolbar';
import ProductGrid from '../components/menu/ProductGrid';
import ProductDetailModal from '../components/menu/ProductDetailModal';

const Menu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category | 'todos'>('todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filteredProducts = MENU.filter((product) => {
        const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="pt-32 pb-24 min-h-screen bg-[#050505]">
            <div className="container mx-auto px-6">
                <MenuHeader />

                <MenuToolbar
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <ProductGrid
                    products={filteredProducts}
                    onViewDetail={setSelectedProduct}
                />
            </div>

            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};

export default Menu;