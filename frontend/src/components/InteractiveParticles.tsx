import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

const InteractiveParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 40 : 80;
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Click handler - create ripple
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 200,
        opacity: 1,
      });
    };

    // Touch handlers for mobile
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        active: true,
      };
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    // Update particle positions
    const updateParticles = () => {
      const mouse = mouseRef.current;
      
      particlesRef.current.forEach((particle) => {
        // Mouse attraction
        if (mouse.active) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Attraction force
          if (distance < 200) {
            const force = (200 - distance) / 200;
            particle.vx += (dx / distance) * force * 0.15;
            particle.vy += (dy / distance) * force * 0.15;
          }
        }

        // Ripple push effect
        ripplesRef.current.forEach((ripple) => {
          const dx = particle.x - ripple.x;
          const dy = particle.y - ripple.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < ripple.radius && distance > ripple.radius - 50) {
            const force = 0.5;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        });

        // Return to base position (elastic effect)
        const baseForceX = (particle.baseX - particle.x) * 0.01;
        const baseForceY = (particle.baseY - particle.y) * 0.01;
        particle.vx += baseForceX;
        particle.vy += baseForceY;

        // Apply friction
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
    };

    // Update ripples
    const updateRipples = () => {
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 4;
        ripple.opacity -= 0.02;
        return ripple.opacity > 0;
      });
    };

    // Draw particles
    const drawParticles = () => {
      const mouse = mouseRef.current;
      
      particlesRef.current.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = mouse.active ? Math.sqrt(dx * dx + dy * dy) : 999;
        
        // Particle glow effect when near cursor
        const glowIntensity = distance < 150 ? (1 - distance / 150) * 0.5 : 0;
        const particleSize = particle.size + glowIntensity * 2;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 180, 26, ${0.6 + glowIntensity})`;
        ctx.fill();

        // Glow effect
        if (glowIntensity > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particleSize + 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(244, 180, 26, ${glowIntensity * 0.2})`;
          ctx.fill();
        }
      });
    };

    // Draw connections between particles
    const drawConnections = () => {
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const opacity = (1 - distance / 120) * 0.15;
            ctx.strokeStyle = `rgba(244, 180, 26, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
    };

    // Draw cursor connections
    const drawCursorConnections = () => {
      const mouse = mouseRef.current;
      if (!mouse.active) return;

      particlesRef.current.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particle.x, particle.y);
          const opacity = (1 - distance / 150) * 0.8;
          const gradient = ctx.createLinearGradient(mouse.x, mouse.y, particle.x, particle.y);
          gradient.addColorStop(0, `rgba(244, 180, 26, ${opacity})`);
          gradient.addColorStop(1, `rgba(244, 180, 26, ${opacity * 0.2})`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    };

    // Draw cursor node
    const drawCursorNode = () => {
      const mouse = mouseRef.current;
      if (!mouse.active) return;

      // Outer glow
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 180, 26, 0.2)';
      ctx.fill();

      // Inner circle
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 180, 26, 0.9)';
      ctx.fill();

      // Pulsing ring
      const pulseRadius = 8 + Math.sin(Date.now() * 0.005) * 2;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(244, 180, 26, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Draw ripples
    const drawRipples = () => {
      ripplesRef.current.forEach((ripple) => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(244, 180, 26, ${ripple.opacity * 0.6})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner ring
        if (ripple.radius > 20) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius - 20, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(244, 180, 26, ${ripple.opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updateParticles();
      updateRipples();
      
      drawConnections();
      drawCursorConnections();
      drawParticles();
      drawRipples();
      drawCursorNode();
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ cursor: 'none' }}
    />
  );
};

export default InteractiveParticles;
