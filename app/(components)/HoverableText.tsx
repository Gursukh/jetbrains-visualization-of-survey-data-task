import React, { useContext, useRef, useCallback } from "react";
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

  const handleMouseEnter = useCallback(() => {
    if (textRef.current) {
      const { top, left, width } = textRef.current.getBoundingClientRect();
      showTooltip(`Score: ${score}, Magnitude: ${magnitude}`, {
        top,
        left: left + width / 2,
      });
    }
  }, [showTooltip, score, magnitude]);

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

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