/**
 * 🎯 METEORS COMPONENT
 * 
 * Animated meteor shower effect
 */

import React, { useEffect, useState } from 'react';
import { cn } from './utils';

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors: React.FC<MeteorsProps> = ({
  number = 20,
  className
}) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: "-5%",
      left: Math.floor(Math.random() * window.innerWidth) + "px",
      animationDelay: Math.random() * 0.6 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "pointer-events-none absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-1/2",
            "before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-slate-500 before:to-transparent",
            className
          )}
          style={style}
        />
      ))}
    </>
  );
};
