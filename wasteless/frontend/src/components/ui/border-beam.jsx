import { useEffect, useRef } from 'react';

  /**
   * BorderBeam – a subtle orbiting-light border effect.
   * Uses a conic-gradient that rotates around the card border via CSS.
   * Props:
   *   size       – beam thickness in px (default 1.5)
   *   colorFrom  – beam start colour (default '#22c55e' – green-500)
   *   colorTo    – beam end colour (default '#86efac' – green-300)
   *   duration   – rotation duration in seconds (default 4)
   *   className  – extra classes for the host wrapper
   */
  export default function BorderBeam({
    size = 1.5,
    colorFrom = '#22c55e',
    colorTo = '#86efac',
    duration = 4,
    className = '',
  }) {
    const ref = useRef(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      // Inject a unique keyframe animation so multiple instances don't collide
      const id = `bb-${Math.random().toString(36).slice(2)}`;
      const style = document.createElement('style');
      style.textContent = `
      @keyframes ${id} { to { --${id}-angle: 360deg; } }
      @property --${id}-angle {
        syntax: '<angle>';
        inherits: false;
        initial-value: 0deg;
      }
      .${id} {
        --${id}-angle: 0deg;
        animation: ${id} ${duration}s linear infinite;
        background: conic-gradient(
          from var(--${id}-angle),
          transparent 0deg 300deg,
          ${colorFrom} 330deg,
          ${colorTo} 355deg,
          transparent 360deg
        );
      }
    `;
      document.head.appendChild(style);
      el.classList.add(id);
      return () => {
        document.head.removeChild(style);
        el.classList.remove(id);
      };
    }, [colorFrom, colorTo, duration]);

    return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 z-0 rounded-[inherit] ${className}`}
      style={{
        padding: `${size}px`,
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    />
    );
  }
