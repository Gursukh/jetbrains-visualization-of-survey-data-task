"use client";
import { useContext } from "react";
import { GeneralContext } from "./(components)/MainContext";
import InputSection from "./(components)/UserInputSection";
import ResultsSection from "./(components)/ResultsSection";
import { colorWithOpacity } from "./utils";
import { AnimatedBackgroundBlob } from "./(components)/AnimatedBlob";

export default function Home() {
  const { status, sentimentAnalysis } = useContext(GeneralContext);

  const isDisplayingResults = status === "DISPLAY_RESULTS";
  const gridRows = isDisplayingResults ? "grid-rows-[1fr_2fr]" : "grid-rows-[0fr_1fr]";
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
        className={`mx-auto w-4/5 max-w-[1200px] relative pt-10 h-[100dvh] overflow-hidden px-2 max-h-[100dvh] grid ${gridRows} transition-all duration-1000`}
      >
        <div className={`relative h-full ${resultsOpacity}`}>
          <ResultsSection />
        </div>
        <div className="relative">
          <InputSection />
        </div>
      </div>

      <div className="z-[-100] fixed top-0 left-0 w-full h-full noise-layer overflow-hidden">
        <AnimatedBackgroundBlob position="right" topPosition={isDisplayingResults ? "95%" : "5%"} color={sentimentColor} size="200px" blur="140px" />
        <AnimatedBackgroundBlob position="left" topPosition={isDisplayingResults ? "5%" : "95%"} color={sentimentColor} size="300px" blur="200px" />
      </div>
    </>
  );
}