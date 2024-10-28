interface AnimatedBackgroundBlobProps {
  position: "left" | "right";
  topPosition: string;
  color: string;
  size: string;
  blur: string;
};

export function AnimatedBackgroundBlob({ position, topPosition, color, size, blur }: AnimatedBackgroundBlobProps) {
  return (
    <div
      style={{
        position: "absolute",
        [position]: "0",
        top: topPosition,
        transition: "all 2000ms",
        borderRadius: "9999px", // rounded-full
        backgroundColor: color,
        width: size,
        height: size,
        filter: `blur(${blur})`,
      }}
    />
  );
}
