import HoverableText from "./(components)/HoverableText";
import { AnalyzeSentimentResponse } from "./types";

// Utility function to ensure a value is within a specified range
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Converts sentiment score and opacity to an RGBA color code
export function colorWithOpacity(value: number, opacity: number): string {
  value = clamp(value, -1, 1);
  opacity = clamp(opacity, 0, 1);

  const r = value < 0 ? 255 : Math.round(255 * (1 - value));
  const g = value < 0 ? Math.round(255 * (1 + value)) : 255;
  const b = 0;
  const a = Math.round(opacity * 100) + 100;

  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

// Determines sentiment based on score
export function getSentiment(value: number): string {
  if (value > 0.15) return "Positive";
  if (value < -0.15) return "Negative";
  return "Neutral";
}

// Formats text with sentiment analysis data, applying colors and tooltips
export function formatText(
  text: string,
  sentimentData: AnalyzeSentimentResponse | null
) {
  if (!sentimentData) return null;

  const result = [];
  let currentIndex = 0;

  sentimentData.sentences.forEach((sentence) => {
    const { content, beginOffset } = sentence.text;
    const { score, magnitude } = sentence.sentiment;
    const color = colorWithOpacity(score, 1);

    // Add non-sentiment text between sentences
    if (currentIndex < beginOffset) {
      result.push(text.slice(currentIndex, beginOffset));
    }

    // Add sentiment-colored text with tooltip
    result.push(
      <HoverableText
        key={beginOffset}
        text={content}
        score={score}
        magnitude={magnitude}
        color={color}
      />
    );

    currentIndex = beginOffset + content.length;
  });

  // Add remaining text if any
  if (currentIndex < text.length) {
    result.push(
      <span key={currentIndex} className="text-foreground">
        {text.slice(currentIndex)}
      </span>
    );
  }

  return result;
}
