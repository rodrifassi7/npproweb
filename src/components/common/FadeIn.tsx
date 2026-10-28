import { useEffect, useRef, useState } from 'react';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
}

const OFFSET: Record<NonNullable<FadeInProps['direction']>, string> = {
    up: 'translateY(28px)',
    down: 'translateY(-28px)',
    left: 'translateX(-28px)',
    right: 'translateX(28px)',
    none: 'none',
};

/**
 * Aparece cuando entra en pantalla. Usa CSS + IntersectionObserver
 * (sin librerías de animación), así no carga el celular.
 */
const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, direction = 'up', className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { rootMargin: '0px 0px -60px 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
            style={{
                '--reveal-delay': `${Math.round(delay * 1000)}ms`,
                transform: visible ? undefined : OFFSET[direction],
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
};

export default FadeIn;
