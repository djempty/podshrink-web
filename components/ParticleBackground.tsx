'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  speed: number; // parallax depth factor
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 100;
    const colors = ['#a855f7', '#3b82f6']; // purple and blue

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1, // 1-3px
      opacity: Math.random() * 0.07 + 0.08, // 0.08-0.15
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 0.5 + 0.5, // 0.5-1.0 for parallax depth
    }));

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position with parallax depth
        particle.x += particle.vx * particle.speed;
        particle.y += particle.vy * particle.speed;

        // Wrap around edges
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Add subtle murmuration effect - slight attraction to nearby particles
        particlesRef.current.forEach((other) => {
          if (particle === other) return;
          
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Only affect very nearby particles (within 80px)
          if (dist < 80 && dist > 0) {
            const force = 0.0008 * particle.speed;
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
          }
        });

        // Apply velocity damping to keep movement slow and smooth
        const damping = 0.98;
        particle.vx *= damping;
        particle.vy *= damping;

        // Add slight random turbulence
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;

        // Clamp velocity to keep particles slow
        const maxSpeed = 0.4;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
