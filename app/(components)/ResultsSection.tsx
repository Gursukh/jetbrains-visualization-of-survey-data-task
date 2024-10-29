import { useContext } from "react";
import { GeneralContext } from "./MainContext";
import { colorWithOpacity, getSentiment } from "../utils";

export default function ResultsSection() {
  const { sentimentAnalysis } = useContext(GeneralContext);
  const { score = 0, magnitude = 0 } =
    sentimentAnalysis?.documentSentiment || {};

  return (
    <div className="h-full w-full absolute left-1/2 -translate-x-1/2 flex flex-col justify-between transition-all duration-1000">
      <div className="text-4xl text-center my-4 col-span-2">Overall</div>
      <div className="flex  text-center justify-between w-full mx-auto max-w-[500px]">
        <div>
          <div>
            <span
              className="text-3xl max-md:text-xl"
              style={{ color: colorWithOpacity(score, 1) }}
            >
              {getSentiment(score)}
            </span>
            <span className="opacity-50 ml-4">({score.toFixed(2)})</span>
            <p>Sentiment</p>
          </div>
        </div>

        <div>
          <p className="text-3xl max-md:text-xl">{magnitude.toFixed(2)}</p>
          <p>Magnitude</p>
        </div>
      </div>

      <div className="text-2xl text-center ">Sentence Breakdown</div>
    </div>
  );
}
