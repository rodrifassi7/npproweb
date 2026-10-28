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
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 py-24 text-center">
                <Search size={24} className="mb-4 text-white/25" />
                <p className="font-bold">No hay platos con ese nombre</p>
                <p className="mt-1 text-sm text-white/50">Probá con otra palabra, por ejemplo "pollo" o "cerdo".</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
