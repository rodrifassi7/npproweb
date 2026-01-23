import React from 'react';

const MenuHeader: React.FC = () => {
    return (
        <header className="mb-16 md:mb-20">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-12 bg-nppro-green"></div>
                <span className="text-nppro-green font-black uppercase tracking-[0.4em] text-[10px]">Catálogo v2.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none mb-6">
                Nuestro <span className="text-white/20">Combustible</span>
            </h1>
            <p className="text-white/40 max-w-xl text-sm md:text-base font-light leading-relaxed">
                Seleccioná tus platos individuales o armá tu estructura semanal.
                Los descuentos se aplican automáticamente según el volumen de carga.
            </p>
        </header>
    );
};

export default MenuHeader;
