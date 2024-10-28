"use client";
import { useContext } from "react";
import { GeneralContext } from "./(components)/mainContext";
import InputSection from "./(components)/userInputSection";

export default function Home() {
  const { sentimentAnalysis } = useContext(GeneralContext);

  return (
    <>
      {/* Define "safe" area */}
      <div className="mx-auto w-4/5 max-w-[1200px] relative">
        {/* Allow the input section to initially occupy the full screen */}
        <div
          className={` ${
            sentimentAnalysis && "hidden"
          } absolute top-0 left-0 w-full h-[100dvh] gap-5 flex flex-col justify-center`}
        >
          {/* Allow the header to be set relative to the postition of the Input form */}
          <div className="relative">
            <h1 className="absolute left-1/2 -translate-x-1/2 bottom-[100%] font-medium -translate-y-full text-4xl text-center">
              Sentement Analysis
            </h1>
            <InputSection />
          </div>
        </div>
        {/* Display the result of the prompt */}
        {sentimentAnalysis && (
          <div>
            {sentimentAnalysis.documentSentiment.score +
              " " +
              sentimentAnalysis.documentSentiment.magnitude}
          </div>
        )}
      </div>
    </>
  );
}
