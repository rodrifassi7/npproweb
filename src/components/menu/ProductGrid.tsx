import React from 'react';
import { Search } from 'lucide-react';
import type { Product } from '../../types';
import ProductCard from '../ProductCard';

interface ProductGridProps {
    products: Product[];
    onViewDetail: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onViewDetail }) => {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[40px] bg-white/[0.02]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} className="text-white/20" />
                </div>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Sin resultados en la búsqueda</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetail={onViewDetail}
                />
            ))}
        </div>
    );
};

export default ProductGrid;
