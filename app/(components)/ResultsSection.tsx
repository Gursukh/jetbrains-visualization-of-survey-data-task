import { useCallback, useContext } from "react";
import { GeneralContext } from "./MainContext";
import { colorWithOpacity, getSentiment } from "../utils";
import { SentenceSentiment } from "../types";

interface SentimentDisplayProps {
  score: number;
  color: string;
  text: string;
}

interface MagnitudeDisplayProps {
  magnitude: number;
}

export default function ResultsSection() {
  const { sentimentAnalysis } = useContext(GeneralContext);
  const { score = 0, magnitude = 0 } =
    sentimentAnalysis?.documentSentiment || {};

  const sentimentColor = colorWithOpacity(score, 1);
  const sentimentText = getSentiment(score);

  return (
    <div className="h-full w-full absolute left-1/2 -translate-x-1/2 flex flex-col justify-between transition-all duration-1000">
      <h2 className="text-4xl text-center my-4 col-span-2">Overall</h2>

      <div className="flex text-center justify-between w-full mx-auto max-w-[500px]">
        <SentimentDisplay
          score={score}
          color={sentimentColor}
          text={sentimentText}
        />
        <MagnitudeDisplay magnitude={magnitude} />
      </div>

      <h3 className="text-2xl text-center">Sentence Breakdown</h3>
      <SentimentDistribution />
    </div>
  );
}

function SentimentDisplay({ score, color, text }: SentimentDisplayProps) {
  return (
    <div>
      <span className="text-3xl max-md:text-xl" style={{ color }}>
        {text}
      </span>
      <span className="opacity-50 ml-4">({score.toFixed(2)})</span>
      <p>Sentiment</p>
    </div>
  );
}

function MagnitudeDisplay({ magnitude }: MagnitudeDisplayProps) {
  return (
    <div>
      <p className="text-3xl max-md:text-xl">{magnitude.toFixed(2)}</p>
      <p>Magnitude</p>
    </div>
  );
}


  function SentimentDistribution() {
    const { sentimentAnalysis, showTooltip, hideTooltip } =
      useContext(GeneralContext);

    const sentences =
      sentimentAnalysis?.sentences.map((s) => ({
        count: s.text.content.length,
        ...s,
      })) || [];

    sentences.sort((a, b) => a.sentiment.score - b.sentiment.score);

    // This is a denominator to calculate the proportion of each sentence
    // so if undefined, we set it to 1 to avoid division by zero
    const totalWords = sentences.reduce(
      (sum, sentence) => sum + sentence.count,
      0
    );

    const handleMouseEnter = useCallback(
      (
        event: React.MouseEvent<HTMLDivElement>,
        sentence: SentenceSentiment & { count: number }
      ) => {
        const { top, left, width } = event.currentTarget.getBoundingClientRect();
        showTooltip(
          `Score: ${sentence.sentiment.score} (${
            ((sentence.count / totalWords) * 100).toFixed(2)
          }%)`,
          {
            top,
            left: left + width / 2,
          }
        );
      },
      [showTooltip, sentimentAnalysis]
    );

    const handleMouseLeave = useCallback(() => {
      hideTooltip();
    }, [hideTooltip]);

    return (
      <div className="w-full mx-auto flex rounded-full overflow-hidden hover:gap-2 gap-0 group transition-all duration-300">
        {sentences.map((sentence, index) => {
          const proportion = (sentence.count / totalWords) * 100;
          const color = colorWithOpacity(sentence.sentiment.score, 0.8);

          return (
            <div
              key={index}
              className="group-hover:h-8 h-8 transition-transform duration-300 flex flex-col justify-center items-end"
              style={{
                width: `${proportion}%`,
              }}
              onMouseEnter={(event) => handleMouseEnter(event, sentence)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="h-1 w-full group-hover:rounded-full"
                style={{
                  backgroundColor: color,
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
