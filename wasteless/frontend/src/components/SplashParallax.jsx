import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * SplashParallax Component (Ultra-Smooth Version)
 * 
 * Uses a dedicated requestAnimationFrame loop to decouple rendering from scroll events.
 * This ensures 60fps smoothness even if scroll inputs are jerky.
 */
export default function SplashParallax({ children }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const frameCount = 200;
    const images = useRef([]);
    const currentFrameRef = useRef(0); // Use ref for performance, not state

    // Scroll progress starts exactly 80px from top (accounting for Navbar)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80px', 'end 80px'],
    });

    // SMOOTH PHYSICS:
    // Mass: 0.2 (Lightweight, moves faster)
    // Stiffness: 150 (Responsive)
    // Damping: 20 (Smooth stop)
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 150,
        damping: 20,
        mass: 0.2,
        restDelta: 0.0001,
    });

    // Transforms for content overlay
    const contentOpacity = useTransform(smoothProgress, [0.85, 1], [1, 0]);
    const canvasScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);

    // Draw function - efficiently draws the frame
    const drawFrame = (index, canvas) => {
        const ctx = canvas.getContext('2d');
        const img = images.current[index];

        if (img && img.complete) {
            // Only resize if necessary (expensive operation)
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            // Cover logic
            const scale = Math.max(width / img.width, height / img.height);
            const x = (width / 2) - (img.width / 2) * scale;
            const y = (height / 2) - (img.height / 2) * scale;

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
    };

    // 1. Preload Images
    useEffect(() => {
        const loadImages = async () => {
            const imagePromises = [];

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                const frameNumber = String(i).padStart(3, '0');
                img.src = `/splash-frames/ezgif-frame-${frameNumber}.jpg`;
                imagePromises.push(
                    new Promise((resolve) => {
                        img.onload = () => resolve(img);
                        img.onerror = () => resolve(null);
                    })
                );
                images.current[i - 1] = img;
            }

            await Promise.all(imagePromises);
            setImagesLoaded(true);

            // Draw first frame immediately
            if (canvasRef.current) {
                drawFrame(0, canvasRef.current);
            }
        };

        loadImages();
    }, []);

    // 2. Render Loop (The Secret to Smoothness)
    useEffect(() => {
        if (!imagesLoaded) return;

        let animationFrameId;

        // Listen to the SPRING value, not the raw scroll
        const unsubscribe = smoothProgress.on('change', (latest) => {
            // Convert 0-1 progress to frame index 0-199
            const targetIndex = Math.min(
                Math.max(Math.round(latest * (frameCount - 1)), 0),
                frameCount - 1
            );

            // Only draw if frame changed
            if (currentFrameRef.current !== targetIndex && canvasRef.current) {
                currentFrameRef.current = targetIndex;
                requestAnimationFrame(() => drawFrame(targetIndex, canvasRef.current));
            }
        });

        return () => {
            unsubscribe();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [imagesLoaded, smoothProgress]);

    // 3. Handle Resize efficiently
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && imagesLoaded) {
                requestAnimationFrame(() => drawFrame(currentFrameRef.current, canvasRef.current));
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [imagesLoaded]);

    return (
        <div
            ref={containerRef}
            className="relative h-[500vh] bg-black" // Longer scroll for smoother playback
            style={{ zIndex: 50 }}
        >
            <div className="sticky top-20 h-[calc(100vh-80px)] w-full overflow-hidden">
                {/* Canvas Layer */}
                <motion.div
                    style={{ scale: canvasScale }}
                    className="absolute inset-0 z-0 w-full h-full"
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full block object-cover"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                </motion.div>

                {/* Content Layer */}
                <motion.div
                    style={{ opacity: contentOpacity }}
                    className="relative z-20 h-full flex flex-col items-center justify-center pointer-events-none"
                >
                    <div className="pointer-events-auto">
                        {children}
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    style={{ opacity: useTransform(smoothProgress, [0, 0.05], [1, 0]) }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2"
                >
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-medium">Scroll to Begin</span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent"></div>
                </motion.div>
            </div>
        </div>
    );
}
