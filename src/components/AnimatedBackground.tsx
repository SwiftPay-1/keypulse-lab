import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: "dot" | "chip" | "code";
  char?: string;
}

const codeChars = ["0", "1", "{", "}", "<", ">", "/", "=", ";", "(", ")"];

export function AnimatedBackground({ subtle = false }: { subtle?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = subtle ? 40 : 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + (subtle ? 0.1 : 0.2),
      type: ["dot", "chip", "code"][Math.floor(Math.random() * 3)] as Particle["type"],
      char: codeChars[Math.floor(Math.random() * codeChars.length)],
    }));

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction
        const mdx = p.x - mouseRef.current.x;
        const mdy = p.y - mouseRef.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          p.x += mdx * 0.02;
          p.y += mdy * 0.02;
        }

        if (p.type === "code") {
          ctx.font = `${10 + p.size * 2}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
          ctx.fillText(p.char!, p.x, p.y);
        } else if (p.type === "chip") {
          ctx.strokeStyle = `rgba(139, 92, 246, ${p.opacity})`;
          ctx.lineWidth = 0.5;
          const s = p.size * 4;
          ctx.strokeRect(p.x - s / 2, p.y - s / 2, s, s);
          // chip legs
          for (let l = 0; l < 3; l++) {
            const lx = p.x - s / 2 + (s / 4) * (l + 1);
            ctx.beginPath();
            ctx.moveTo(lx, p.y - s / 2);
            ctx.lineTo(lx, p.y - s / 2 - 3);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(lx, p.y + s / 2);
            ctx.lineTo(lx, p.y + s / 2 + 3);
            ctx.stroke();
          }
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [subtle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: subtle ? 0.5 : 1 }}
    />
  );
}
