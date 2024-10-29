"use client";
import { useContext } from "react";
import { GeneralContext } from "./(components)/MainContext";
import InputSection from "./(components)/UserInputSection";
import ResultsSection from "./(components)/ResultsSection";
import { colorWithOpacity } from "./utils";
import { AnimatedBackgroundBlob } from "./(components)/AnimatedBlob";
import Tooltip from "./(components)/Tooltip";

export default function Home() {
  const { status, tooltip, sentimentAnalysis } = useContext(GeneralContext);

  const isDisplayingResults = status === "DISPLAY_RESULTS";
  const gridRows = isDisplayingResults
    ? "grid-rows-[5%_35%_60%]"
    : "grid-rows-[5%_0%_95%]";
  const resultsOpacity = isDisplayingResults ? "opacity-100" : "opacity-0";
  const sentimentColor = isDisplayingResults
    ? colorWithOpacity(
        sentimentAnalysis?.documentSentiment.score ?? 0,
        sentimentAnalysis?.documentSentiment.magnitude ?? 0
      )
    : "#8b0fff";

  return (
    <>
      <div
        className={`mx-auto w-4/5 max-md:w-full max-md:px-8 max-w-[1200px] relative py-10 h-[100dvh] overflow-hidden px-2 max-h-[100dvh] grid ${gridRows} transition-all duration-1000`}
      >
        <h1
          className={`font-medium ${
            status == "DISPLAY_RESULTS"
              ? "text-xl opacity-20 top-2"
              : "text-4xl top-10 "
          } transition-all text-center duration-1000 `}
        >
          Sentement Analysis
        </h1>
        <div
          className={`relative h-full transition-all duration-1000 ${resultsOpacity}`}
        >
          <ResultsSection />
        </div>
          <InputSection />
      </div>

      <div className="z-[-100] fixed top-0 left-0 w-full h-full noise-layer overflow-hidden">
        <AnimatedBackgroundBlob
          position="right"
          topPosition={isDisplayingResults ? "95%" : "5%"}
          color={sentimentColor}
          size="200px"
          blur="140px"
        />
        <AnimatedBackgroundBlob
          position="left"
          topPosition={isDisplayingResults ? "5%" : "95%"}
          color={sentimentColor}
          size="300px"
          blur="200px"
        />
      </div>
      
      <Tooltip tooltip={tooltip} />
    </>
  );
}
