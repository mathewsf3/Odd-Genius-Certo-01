import React from "react";
import "./magicui-animations.css";

interface NeonGradientCardProps {
  children: React.ReactNode;
  className?: string;
  neonColors?: {
    firstColor: string;
    secondColor: string;
  };
  borderSize?: number;
  borderRadius?: number;
}

export const NeonGradientCard: React.FC<NeonGradientCardProps> = ({
  children,
  className = "",
  neonColors = {
    firstColor: "#ff00aa",
    secondColor: "#00FFF1",
  },
  borderSize = 2,
  borderRadius = 20,
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        padding: `${borderSize}px`,
        background: `linear-gradient(45deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
      }}
    >
      <div
        className="relative h-full w-full bg-gray-950"
        style={{
          borderRadius: `${borderRadius - borderSize}px`,
        }}
      >
        {children}
      </div>
      
      {/* Animated border glow */}
      <div
        className="absolute inset-0 opacity-50 blur-md animate-neon-pulse"
        style={{
          background: `linear-gradient(45deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
          borderRadius: `${borderRadius}px`,
        }}
      />
    </div>
  );
};

export default NeonGradientCard;
