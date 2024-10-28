export function colorWithOpacity(value: number, opacity: number): string {
  value = Math.max(-1, Math.min(1, value));
  opacity = Math.max(0, Math.min(1, opacity));

  let r: number, g: number;
  if (value < 0) {
      r = 255;
      g = Math.round(255 * (1 + value));
  } else {
      r = Math.round(255 * (1 - value));
      g = 255;
  }

  const b = 0;
  const a = Math.round(opacity * 100) + 100;

  const hex = (n: number) => n.toString(16).padStart(2, '0');
  
  return `#${hex(r)}${hex(g)}${hex(b)}${hex(a)}`;
}


export function getSentiment(value: number) {
  if (value > 0.5) {
    return "Positive";
  } else if (value < -0.5) {
    return "Negative";
  } else {
    return "Neutral";
  }
}