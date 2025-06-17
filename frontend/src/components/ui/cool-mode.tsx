import React, { useState } from "react";
import { cn } from "./utils";

interface CoolModeProps {
  children: React.ReactNode;
  className?: string;
  options?: {
    particle?: string;
    size?: number;
    speedHorz?: number;
    speedUp?: number;
    gravity?: number;
    wind?: number;
    life?: number;
    colors?: string[];
    shape?: "mix" | "circle" | "square";
    zIndex?: number;
  };
}

export const CoolMode: React.FC<CoolModeProps> = ({
  children,
  className,
  options = {},
}) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      life: number;
      velocityX: number;
      velocityY: number;
    }>
  >([]);

  const createParticles = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: options.colors?.[Math.floor(Math.random() * options.colors.length)] || "#3b82f6",
      life: options.life || 1000,
      velocityX: (Math.random() - 0.5) * (options.speedHorz || 10),
      velocityY: -Math.random() * (options.speedUp || 15),
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after their life ends
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, options.life || 1000);
  };

  return (
    <div className={cn("relative", className)} onClick={createParticles}>
      {children}
      
      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              animation: `particle-float ${particle.life}ms ease-out forwards`,
              transform: `translate(${particle.velocityX}px, ${particle.velocityY}px)`,
            }}
          />        ))}
      </div>
    </div>
  );
};
