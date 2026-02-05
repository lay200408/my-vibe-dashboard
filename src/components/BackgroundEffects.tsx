import { useEffect, useRef } from 'react';

interface BackgroundEffectsProps {
  themeHue: number;
}

export default function BackgroundEffects({ themeHue }: BackgroundEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // ✅ 核心修复：如果 canvas 还没挂载，直接返回
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const getWeatherType = () => {
      if (themeHue === 45 || themeHue === 35) return 'sunny';
      if (themeHue === 220) return 'rainy';
      if (themeHue === 280) return 'zen';
      return 'cloudy'; 
    };

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; 
      opacity: number; baseOpacity: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        const type = getWeatherType();
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = type === 'cloudy' ? Math.random() * 200 + 150 : Math.random() * 6 + 2;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.baseOpacity = Math.random() * 0.3 + 0.1;
        this.opacity = this.baseOpacity;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 250) {
          const force = (250 - distance) / 250;
          this.x -= dx * force * 0.02; 
          this.y -= dy * force * 0.02;
          this.opacity = Math.min(this.baseOpacity + force * 0.4, 0.8);
        } else { this.opacity = this.baseOpacity; }
        if (this.y > canvasHeight + 200) this.y = -200;
        if (this.x > canvasWidth + 200) this.x = -200;
        if (this.x < -200) this.x = canvasWidth + 200;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        const gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${themeHue}, 50%, 100%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${themeHue}, 0%, 100%, 0)`);
        context.fillStyle = gradient;
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    const init = () => {
      particles = [];
      const count = getWeatherType() === 'cloudy' ? 15 : 60;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize(); init(); animate();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeHue]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ filter: 'blur(12px)' }} />;
}