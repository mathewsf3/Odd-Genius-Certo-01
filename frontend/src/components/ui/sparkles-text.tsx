import React from "react";
import { cn } from "./utils";

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
}

export const SparklesText: React.FC<SparklesTextProps> = ({
  children,
  className,
  sparklesCount = 5,
}) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      {/* Sparkles */}
      {Array.from({ length: sparklesCount }).map((_, i) => (
        <span
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
          }}
        >
          ✨
        </span>
      ))}
    </div>
  );
};
