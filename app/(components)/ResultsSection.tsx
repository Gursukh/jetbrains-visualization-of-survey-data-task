import { useContext } from "react";
import { GeneralContext } from "./MainContext";
import { colorWithOpacity, getSentiment } from "../utils";

interface SentimentDisplayProps {
  score: number;
  color: string;
  text: string;
}

interface MagnitudeDisplayProps {
  magnitude: number;
}

export default function ResultsSection() {
  const { status, sentimentAnalysis } = useContext(GeneralContext);
  const { score = 0, magnitude = 0 } =
    sentimentAnalysis?.documentSentiment || {};

  const sentimentColor = colorWithOpacity(score, 1);
  const sentimentText = getSentiment(score);

  return (
    <section
      className={`
        ${ status === "DISPLAY_RESULTS" ? "opacity-100" : "opacity-0" } 
        relative h-full w-full flex flex-col justify-between transition-all duration-1000`}
    >
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
    </section>
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
