import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
    value: string | number;
    className?: string;
    duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className, duration = 2000 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const stringValue = value.toString();
    const match = stringValue.match(/([^\d]*)(\d+)([^\d]*)/);
    const prefix = match ? match[1] : "";
    const num = match ? parseInt(match[2]) : 0;
    const suffix = match ? match[3] : "";

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 } // Trigger sooner
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || num === 0) return;

        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out quart
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setDisplayValue(Math.floor(easeOutQuart * num));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, num, duration]);

    if (!match) return <span className={className}>{value}</span>;

    return (
        <span ref={ref} className={className}>
            {prefix}{displayValue}{suffix}
        </span>
    );
};

export default AnimatedNumber;
