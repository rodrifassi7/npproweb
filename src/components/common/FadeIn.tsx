import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    direction = 'up',
    className = ''
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
            y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;