import React from 'react';
import { Link } from 'react-router-dom';

const MenuHeader: React.FC = () => (
    <header className="mb-10 md:mb-14">
        <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter md:text-7xl">El menú</h1>
        <p className="mt-5 max-w-xl text-white/60 md:text-lg">
            Todos los platos vienen en Volumen o Definición: lo elegís al abrir cada uno.
            Si pedís para toda la semana, <Link to="/packs" className="font-bold text-nppro-green hover:underline">con un pack pagás menos por comida</Link>.
        </p>
    </header>
);

export default MenuHeader;
