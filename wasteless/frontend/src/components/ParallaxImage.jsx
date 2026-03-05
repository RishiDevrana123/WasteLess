import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ParallaxImage Component
 * 
 * Creates a beautiful parallax scrolling effect with any image
 * 
 * Usage:
 * <ParallaxImage 
 *   src="/path/to/image.jpg" 
 *   alt="Description"
 *   speed={0.5}  // 0 = no movement, 1 = full scroll speed, 0.5 = half speed
 *   direction="up" // or "down"
 * />
 */
export default function ParallaxImage({
    src,
    alt = '',
    speed = 0.5,
    direction = 'up',
    className = '',
    overlay = false,
    overlayOpacity = 0.3
}) {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Calculate movement based on direction and speed
    const yRange = direction === 'up' ? [0, -100 * speed] : [0, 100 * speed];
    const y = useTransform(smoothProgress, [0, 1], yRange);
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.1, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div
                style={{ y, scale }}
                className="w-full h-full"
            >
                <motion.img
                    src={src}
                    alt={alt}
                    style={{ opacity }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </motion.div>

            {overlay && (
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"
                    style={{ opacity: overlayOpacity }}
                />
            )}
        </div>
    );
}

/**
 * ParallaxSection Component
 * 
 * Wraps content with parallax effect
 * 
 * Usage:
 * <ParallaxSection speed={0.3}>
 *   <YourContent />
 * </ParallaxSection>
 */
export function ParallaxSection({ children, speed = 0.3, className = '' }) {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

    return (
        <div ref={ref} className={className}>
            <motion.div style={{ y }} className="will-change-transform">
                {children}
            </motion.div>
        </div>
    );
}

/**
 * Parallax3DCard Component
 * 
 * Creates a 3D tilt effect on mouse move
 * Perfect for feature cards with images
 */
export function Parallax3DCard({ children, className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const card = ref.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((centerX - x) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-transform duration-300 ease-out ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
}
