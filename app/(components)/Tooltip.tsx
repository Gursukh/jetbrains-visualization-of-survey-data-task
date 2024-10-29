import React from "react";

interface TooltipProps {
  tooltip: {
    isVisible: boolean;
    content: string;
    position: { top: number; left: number };
  };
}

function Tooltip({ tooltip }: TooltipProps) {
  if (!tooltip.isVisible) return null;

  const { content, position } = tooltip;

  return (
    <div
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -150%)",
      }}
      className="bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50"
    >
      {content}
    </div>
  );
}

export default Tooltip;
