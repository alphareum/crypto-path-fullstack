import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  connections: number[];
}

const InteractiveHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number>();
  const isHoveredRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      initNodes();
    };

    const initNodes = () => {
      const nodeCount = window.innerWidth < 768 ? 30 : 60;
      nodesRef.current = [];

      for (let i = 0; i < nodeCount; i++) {
        const node: Node = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 200 - 100,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          vz: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 3 + 2,
          connections: [],
        };
        nodesRef.current.push(node);
      }
      console.log('Initialized', nodeCount, 'nodes');
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const updateNodes = () => {
      const mouse = mouseRef.current;

      nodesRef.current.forEach((node) => {
        // Mouse interaction - attraction when hovering
        if (isHoveredRef.current) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) {
            // Attraction force - pull towards cursor
            const force = (250 - distance) / 250 * 0.3;
            node.vx += (dx / distance) * force;
            node.vy += (dy / distance) * force;
          }
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Friction
        node.vx *= 0.98;
        node.vy *= 0.98;
        node.vz *= 0.98;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }
        if (node.z < -100 || node.z > 100) {
          node.vz *= -1;
        }
      });
    };

    const drawNodes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Find connections
      nodesRef.current.forEach((node, i) => {
        node.connections = [];
        nodesRef.current.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
              node.connections.push(j);
            }
          }
        });
      });

      // Draw connections
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach((connectedIndex) => {
          const connectedNode = nodesRef.current[connectedIndex];
          if (connectedNode) {
            const dx = node.x - connectedNode.x;
            const dy = node.y - connectedNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const opacity = (1 - distance / 150) * 0.15;

            // Calculate depth-based color
            const avgZ = (node.z + connectedNode.z) / 2;
            const depthFactor = (avgZ + 100) / 200;
            const hue = 43; // Gold color

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);

            const gradient = ctx.createLinearGradient(
              node.x,
              node.y,
              connectedNode.x,
              connectedNode.y
            );
            gradient.addColorStop(0, `hsla(${hue}, 96%, 53%, ${opacity * depthFactor})`);
            gradient.addColorStop(1, `hsla(${hue}, 96%, 53%, ${opacity * depthFactor * 0.5})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const scale = (node.z + 100) / 200;
        const size = node.radius * scale;
        const opacity = 0.4 + scale * 0.4;

        // Node glow
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          size * 3
        );
        gradient.addColorStop(0, `rgba(244, 180, 26, ${opacity * 0.6})`);
        gradient.addColorStop(0.5, `rgba(244, 180, 26, ${opacity * 0.2})`);
        gradient.addColorStop(1, "rgba(244, 180, 26, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = `rgba(244, 180, 26, ${opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw cursor glow
      if (isHoveredRef.current) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          100
        );
        gradient.addColorStop(0, "rgba(244, 180, 26, 0.1)");
        gradient.addColorStop(1, "rgba(244, 180, 26, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 100, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      updateNodes();
      drawNodes();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    container.addEventListener("mousemove", handleMouseMove);

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Fixed: removed isHovered dependency to prevent reset

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      onMouseEnter={() => {
        setIsHovered(true);
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        isHoveredRef.current = false;
      }}
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-background -z-10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-1/4 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Interactive canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1]"
        style={{ cursor: "default" }}
      />

      {/* Minimal heading at top - ONLY name */}
      <div className="absolute top-32 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-7xl md:text-9xl font-bold leading-tight">
              <span className="inline-block transition-all duration-300">
                Crypto
              </span>{" "}
              <span className="inline-block text-primary transition-all duration-300">
                Path
              </span>
            </h1>
          </div>
        </div>
      </div>


      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full p-1">
          <div className="w-1.5 h-3 bg-primary/60 rounded-full mx-auto animate-scroll" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default InteractiveHero;
