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
  depth: number;
  angle: number;
  angleSpeed: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getSize = () => {
      const parent = canvas.parentElement;
      return {
        w: parent?.offsetWidth || canvas.offsetWidth || window.innerWidth,
        h: parent?.offsetHeight || canvas.offsetHeight || 600,
      };
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const { w: cw, h: ch } = getSize();
      canvas.style.width = cw + 'px';
      canvas.style.height = ch + 'px';
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const w = () => getSize().w;
    const h = () => getSize().h;

    // Create particles — more of them, smaller, for dust-like effect
    const count = 180;
    const colors = ['#a855f7', '#7c3aed', '#3b82f6', '#6366f1', '#8b5cf6'];

    particlesRef.current = Array.from({ length: count }, () => {
      const depth = Math.random() * 0.7 + 0.3; // 0.3-1.0
      return {
        x: Math.random() * w(),
        y: Math.random() * h(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: (Math.random() * 2.5 + 1) * depth,
        opacity: (Math.random() * 0.25 + 0.15) * depth,
        color: colors[Math.floor(Math.random() * colors.length)],
        depth,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02,
      };
    });

    const animate = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;
      const width = w();
      const height = h();

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const len = particles.length;

      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // Global flow field — creates murmuration-like sweeping motion
        const flowX = Math.sin(t * 0.5 + p.y * 0.003) * 0.15;
        const flowY = Math.cos(t * 0.3 + p.x * 0.004) * 0.08;

        // Swirl — gives that organic flock feeling
        p.angle += p.angleSpeed;
        const swirlX = Math.cos(p.angle + t) * 0.06 * p.depth;
        const swirlY = Math.sin(p.angle + t * 0.7) * 0.06 * p.depth;

        // Neighbor attraction (limited to nearby particles for performance)
        let ax = 0, ay = 0;
        let neighbors = 0;
        for (let j = i + 1; j < Math.min(i + 20, len); j++) {
          const other = particles[j];
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = dx * dx + dy * dy;
          if (dist < 4000 && dist > 0) { // ~63px radius
            const d = Math.sqrt(dist);
            const force = (d < 20 ? -0.003 : 0.001) * p.depth; // repel if too close
            ax += (dx / d) * force;
            ay += (dy / d) * force;
            neighbors++;
          }
        }

        // Apply all forces
        p.vx += flowX + swirlX + ax;
        p.vy += flowY + swirlY + ay;

        // Damping — keeps movement smooth and slow
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 0.6 * p.depth;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Move
        p.x += p.vx * p.depth;
        p.y += p.vy * p.depth;

        // Wrap edges with padding
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Pulse opacity slightly
        const pulseOpacity = p.opacity * (0.85 + 0.15 * Math.sin(t * 2 + p.angle));

        // Draw
        ctx.globalAlpha = pulseOpacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
