/**
 * 🎯 SPARKLES COMPONENT
 * 
 * Animated sparkle effects for cards
 */

import React, { useEffect, useState } from 'react';
import { cn } from './utils';

interface SparklesProps {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  minSize?: number;
  density?: number;
  speed?: number;
  color?: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

export const Sparkles: React.FC<SparklesProps> = ({
  children,
  className,
  size = 16,
  minSize = 8,
  density = 0.5,
  speed = 1,
  color = "#FFC700",
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const sparkleCount = Math.floor(density * 50);
      const newSparkles: Sparkle[] = [];

      for (let i = 0; i < sparkleCount; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (size - minSize) + minSize,
          opacity: Math.random() * 0.8 + 0.2,
          delay: Math.random() * 2,
        });
      }

      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 3000 / speed);

    return () => clearInterval(interval);
  }, [density, size, minSize, speed]);

  return (
    <div className={cn("relative inline-block", className)}>
      {children}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-sparkle"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
              opacity: sparkle.opacity,
              animationDelay: `${sparkle.delay}s`,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
