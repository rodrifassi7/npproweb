import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const ParticleCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        const N = 60;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        };

        resize();

        const dpr = window.devicePixelRatio;
        const particles = Array.from({ length: N }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5 * dpr,
            vy: (Math.random() - 0.5) * 0.5 * dpr,
            r: (Math.random() * 1.5 + 0.8) * dpr,
        }));

        const DIST = 100 * dpr;

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;

            ctx.clearRect(0, 0, W, H);

            for (let i = 0; i < N; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;

                for (let j = i + 1; j < N; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < DIST) {
                        const alpha = 0.18 * (1 - d / DIST);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
                        ctx.lineWidth = 0.5 * dpr;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 0, 0.55)';
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            resize();
            particles.forEach(p => {
                p.x = Math.min(p.x, canvas.width);
                p.y = Math.min(p.y, canvas.height);
            });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const HeroSection: React.FC = () => {
    const { scrollY } = useScroll();
    const yContent = useTransform(scrollY, [0, 600], [0, 80]);
    const opacityContent = useTransform(scrollY, [0, 500], [1, 0]);
    const canvasOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    return (
        <section className="relative min-h-[100svh] overflow-hidden bg-[#050505]">

            {/* PARTÍCULAS */}
            <motion.div
                style={{ opacity: canvasOpacity }}
                className="absolute inset-0 z-0"
            >
                <ParticleCanvas />
            </motion.div>

            {/* GLOWS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-nppro-green/5 blur-[140px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-nppro-green/[0.03] blur-[100px] rounded-full" />
            </div>

            {/* CONTENIDO */}
            <div className="container mx-auto px-6 relative z-10 min-h-[100svh] flex items-center justify-center pt-24 md:pt-0">
                <motion.div
                    style={{ y: yContent, opacity: opacityContent }}
                    className="max-w-5xl mx-auto flex flex-col items-center text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-8"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-nppro-green animate-pulse" />
                        <span className="text-white/60 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
                            Viandas proteicas · Trelew, Chubut
                        </span>
                    </motion.div>

                    {/* Título */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-[11vw] sm:text-[8vw] md:text-[6.5rem] lg:text-[7.5rem] font-black leading-[0.9] italic tracking-tighter uppercase mb-6"
                    >
                        Hecho acá.{' '}
                        <span
                            className="text-nppro-green"
                            style={{ textShadow: '0 0 60px rgba(0,255,0,0.25)' }}
                        >
                            Pensado para vos.
                        </span>
                    </motion.h1>

                    {/* Subtítulo */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-base md:text-xl text-white/50 font-light max-w-md leading-relaxed mb-10 md:mb-14"
                    >
                        Meal prep de alto rendimiento. Viandas listas,
                        selladas al vacío, entregadas en tu puerta.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
                    >
                        <Link to="/menu" className="w-full sm:w-auto">
                            <button
                                className="w-full px-8 py-4 bg-nppro-green text-black font-black italic rounded-full flex items-center justify-center gap-3 text-sm md:text-base transition-all hover:scale-105 active:scale-95"
                                style={{ boxShadow: '0 0 40px rgba(0,255,0,0.2)' }}
                            >
                                VER MENÚ SEMANAL
                                <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </Link>

                        <Link
                            to="/packs"
                            className="flex items-center gap-2 text-white/40 hover:text-white font-bold tracking-[0.15em] text-[11px] md:text-xs py-3 group transition-colors"
                        >
                            <Target size={15} className="group-hover:text-nppro-green transition-colors" />
                            VER PACKS CON DESCUENTO
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* SCROLL INDICATOR */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >

                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-[1px] h-8 bg-gradient-to-b from-nppro-green/50 to-transparent"
                />
            </motion.div>

        </section>
    );
};

export default HeroSection;