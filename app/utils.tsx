import HoverableText from "./(components)/HoverableText";
import { AnalyzeSentimentResponse } from "./types";

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

  const hex = (n: number) => n.toString(16).padStart(2, "0");

  return `#${hex(r)}${hex(g)}${hex(b)}${hex(a)}`;
}

export function getSentiment(value: number) {
  if (value > 0.15) {
    return "Positive";
  } else if (value < -0.15) {
    return "Negative";
  } else {
    return "Neutral";
  }
}

export function formatText(
  text: string,
  sentimentData: AnalyzeSentimentResponse | null
) {
  if (sentimentData == null) return;

  const result = [];
  let currentIndex = 0;

  sentimentData.sentences.forEach((sentence) => {
    const { content } = sentence.text;
    const { score, magnitude } = sentence.sentiment;
    const color = colorWithOpacity(score, 1);
    const sentenceStart = sentence.text.beginOffset;

    // Add any text between the current index and the sentence start
    if (currentIndex < sentenceStart) {
      result.push(text.slice(currentIndex, sentenceStart));
    }

    // Add the colored sentence with tooltip
    result.push(
      <HoverableText
        key={sentenceStart}
        text={content}
        score={score}
        magnitude={magnitude}
        color={color}
      />
    );

    // Update current index to end of the current sentence
    currentIndex = sentenceStart + content.length;
  });

  // Append remaining text if any
  if (currentIndex < text.length) {
    result.push(
      <span key={currentIndex} className="text-foreground ">
        {text.slice(currentIndex)}
      </span>
    );
  }

  return result;
}
