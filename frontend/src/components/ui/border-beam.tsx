import React from "react";
import "./magicui-animations.css";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = "",
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(${borderWidth}*1px)_solid_transparent] [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] ${className}`}
      style={{
        background: `linear-gradient(${anchor}deg,transparent,${colorFrom},${colorTo},transparent) border-box`,
        animation: `border-beam ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      } as React.CSSProperties & { "--size": string }}
    >
      <style>{`
        @keyframes border-beam {
          0% {
            background: linear-gradient(${anchor}deg, transparent, ${colorFrom}, ${colorTo}, transparent) border-box;
          }
          25% {
            background: linear-gradient(${anchor + 90}deg, transparent, ${colorFrom}, ${colorTo}, transparent) border-box;
          }
          50% {
            background: linear-gradient(${anchor + 180}deg, transparent, ${colorFrom}, ${colorTo}, transparent) border-box;
          }
          75% {
            background: linear-gradient(${anchor + 270}deg, transparent, ${colorFrom}, ${colorTo}, transparent) border-box;
          }
          100% {
            background: linear-gradient(${anchor + 360}deg, transparent, ${colorFrom}, ${colorTo}, transparent) border-box;
          }
        }
      `}</style>
    </div>
  );
};

export default BorderBeam;
