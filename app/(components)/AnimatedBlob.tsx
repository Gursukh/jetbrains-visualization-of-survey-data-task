import React from "react";

interface AnimatedBackgroundBlobProps {
  position: "left" | "right";
  topPosition: string;
  color: string;
  size: string;
  blur: string;
}

/*
  These are the colored spots in the backgroun
*/

export function AnimatedBackgroundBlob({
  position,
  topPosition,
  color,
  size,
  blur,
}: AnimatedBackgroundBlobProps) {
  return (
    <div
      className={`
        absolute 
        rounded-full
        transition-all
        duration-[2000ms]
      `}
      style={{
        top: topPosition,
        backgroundColor: color,
        width: size,
        [position]: "0",
        height: size,
        filter: `blur(${blur})`,
      }}
    />
  );
}
