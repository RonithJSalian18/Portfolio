"use client";

import { useEffect, useRef } from "react";

export default function MouseWaterEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    const mouse = { x: width / 2, y: height / 2, vx: 0, vy: 0 };
    const prevMouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.vx = mouse.x - prevMouse.x;
      mouse.vy = mouse.y - prevMouse.y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    class DigitalParticle {
      x: number;
      y: number;
      size: number;
      life: number;
      maxLife: number;
      type: number;
      hue: number;
      rotation: number;
      rotSpeed: number;

      constructor(x: number, y: number) {
        // Tight clustering around the mouse
        this.x = x + (Math.random() - 0.5) * 15;
        this.y = y + (Math.random() - 0.5) * 15;
        this.size = Math.random() * 3 + 1;
        this.life = 0;
        this.maxLife = Math.random() * 40 + 20; // Smooth fade
        this.type = Math.floor(Math.random() * 3); // 0: dot, 1: cross, 2: square
        this.hue = Math.random() > 0.6 ? 190 : 270; // Cyan bias, some purple
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
      }

      update() {
        this.life++;
        // Very slow drift upwards to mimic data evaporating
        this.y -= 0.3;
        this.rotation += this.rotSpeed;
      }

      draw() {
        if (!ctx) return;
        const opacity = Math.max(0, 1 - (this.life / this.maxLife));
        const color = `hsla(${this.hue}, 100%, 70%, ${opacity})`;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        if (this.type === 0) {
          // Dot
          ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === 1) {
          // Cross (+)
          ctx.moveTo(-this.size, 0);
          ctx.lineTo(this.size, 0);
          ctx.moveTo(0, -this.size);
          ctx.lineTo(0, this.size);
          ctx.stroke();
        } else {
          // Wireframe Square
          ctx.rect(-this.size, -this.size, this.size * 2, this.size * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }

    const particles: DigitalParticle[] = [];

    const animate = () => {
      // Clear with trail effect
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.globalCompositeOperation = 'lighter';

      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      
      // Spawn data nodes based on speed, but keep intensity low
      if (speed > 1) {
        // Max 2 particles per frame to keep it clean and subtle
        const count = Math.min(Math.floor(speed * 0.15), 2);
        for (let i = 0; i < count; i++) {
          particles.push(new DigitalParticle(mouse.x, mouse.y));
        }
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life >= particles[i].maxLife) {
          particles.splice(i, 1);
          i--;
        }
      }

      // Soft HUD scanner glow under cursor
      ctx.beginPath();
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
      grad.addColorStop(0, "rgba(0, 229, 255, 0.08)"); // Very subtle cyan core
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
      ctx.fill();

      // Smooth out velocity
      mouse.vx *= 0.7;
      mouse.vy *= 0.7;

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5] mix-blend-screen opacity-90"
    />
  );
}
