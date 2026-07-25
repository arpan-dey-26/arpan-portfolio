import { useEffect, useRef, useState } from 'react';
import { createImageParallax } from '@/animations/gsapUtils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Aspect ratio for the reserved box, e.g. "16/9" — prevents layout shift regardless of the source image's actual ratio. */
  aspectRatio?: string;
  zoomOnHover?: boolean;
  /** Subtle scroll-scrubbed parallax via GSAP ScrollTrigger — Phase 3's one genuine GSAP use case, see animations/gsapUtils.ts. */
  parallax?: boolean;
}

/**
 * Phase 3's "image experience" requirements, consolidated into one
 * component instead of repeating the same classes on every <img> —
 * ProjectCard already had zoom-on-hover written inline; this replaces
 * that copy with a shared primitive and adds the one genuinely missing
 * piece: a load-triggered fade so a lazy image doesn't visibly "pop in"
 * if it finishes downloading after its container is already on screen
 * (a real gap — the card's own entrance animation only covers the
 * container, not the image's own load timing).
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  aspectRatio = '16/9',
  zoomOnHover = true,
  parallax = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!parallax || !imgRef.current || prefersReducedMotion) return;
    const scrollTrigger = createImageParallax(imgRef.current);
    return () => scrollTrigger.kill();
  }, [parallax, prefersReducedMotion]);

  return (
    <div className={cn('overflow-hidden bg-surface-raised', className)} style={{ aspectRatio }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'h-full w-full object-cover object-top transition-[opacity,transform] duration-slow ease-out-expo',
          isLoaded ? 'opacity-100' : 'opacity-0',
          zoomOnHover && 'group-hover:scale-[1.03]'
        )}
      />
    </div>
  );
}
