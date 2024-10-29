import React, { useContext, useRef } from "react";
import { GeneralContext } from "./MainContext";

interface HoverableTextProps {
  text: string;
  score: number;
  magnitude: number;
  color: string;
}

export default function HoverableText({
  text,
  score,
  magnitude,
  color,
}: HoverableTextProps) {
  const { showTooltip, hideTooltip } = useContext(GeneralContext);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      showTooltip(`Score: ${score}, Magnitude: ${magnitude}`, {
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleMouseLeave = () => hideTooltip();

  return (
    <span
      ref={textRef}
      className="relative hover:bg-background"
      style={{ color }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </span>
  );
}
