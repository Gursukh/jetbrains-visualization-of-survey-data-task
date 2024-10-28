import { useContext } from "react";
import { GeneralContext } from "./MainContext";
import { colorWithOpacity, getSentiment } from "../utils";

export default function ResultsSection() {
  const { sentimentAnalysis } = useContext(GeneralContext);
  const { score = 0, magnitude = 0 } = sentimentAnalysis?.documentSentiment || {};

  return (
    <div className="h-full absolute left-1/2 -translate-x-1/2 flex flex-col justify-between gap-8 transition-all duration-1000">
      <div className="text-4xl text-center">Overall</div>

      <div className="grid grid-cols-2 gap-2 text-center justify-center w-1/2 min-w-[500px] mx-auto">
        <p>Sentiment</p>
        <p>Magnitude</p>
        
        <div>
          <span
            className="text-3xl"
            style={{ color: colorWithOpacity(score, 1) }}
          >
            {getSentiment(score)}
          </span>
          <span className="opacity-50 ml-4">
            ({score.toFixed(2)})
          </span>
        </div>
        
        <p className="text-3xl">{magnitude.toFixed(2)}</p>
      </div>

      <div className="text-2xl text-center">Sentence Breakdown</div>
    </div>
  );
}
