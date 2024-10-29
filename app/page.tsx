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

  // Define grid layout and opacity based on result display status
  const gridRows = `grid-rows-[5%_${
    isDisplayingResults ? "35%_60%" : "0%_95%"
  }]`;

  const sentimentColor = isDisplayingResults
    ? colorWithOpacity(
        sentimentAnalysis?.documentSentiment.score ?? 0,
        sentimentAnalysis?.documentSentiment.magnitude ?? 0
      )
    : "#8b0fff";

  return (
    <>
      <main
        className={`mx-auto w-4/5 max-md:w-full max-md:px-8 max-w-[1200px] relative py-10 h-[100dvh] overflow-hidden px-2 max-h-[100dvh] grid ${gridRows} transition-all duration-1000`}
      >
        <Header isDisplayingResults={isDisplayingResults} />
        <ResultsSection />
        <InputSection />
      </main>

      <BackgroundBlobs
        isDisplayingResults={isDisplayingResults}
        color={sentimentColor}
      />

      <Tooltip tooltip={tooltip} />
    </>
  );
}

// Header component with prop typing
type HeaderProps = {
  isDisplayingResults: boolean;
};

function Header({ isDisplayingResults }: HeaderProps) {
  return (
    <h1
      className={`font-medium ${
        isDisplayingResults ? "text-xl opacity-20 top-2" : "text-4xl top-10"
      } transition-all text-center duration-1000`}
    >
      Sentiment Analysis
    </h1>
  );
}

// BackgroundBlobs component with prop typing
type BackgroundBlobsProps = {
  isDisplayingResults: boolean;
  color: string;
};

function BackgroundBlobs({ isDisplayingResults, color }: BackgroundBlobsProps) {
  return (
    <div className="z-[-100] fixed top-0 left-0 w-full h-full noise-layer overflow-hidden">
      <AnimatedBackgroundBlob
        position="right"
        topPosition={isDisplayingResults ? "95%" : "5%"}
        color={color}
        size="200px"
        blur="140px"
      />
      <AnimatedBackgroundBlob
        position="left"
        topPosition={isDisplayingResults ? "5%" : "95%"}
        color={color}
        size="300px"
        blur="200px"
      />
    </div>
  );
}
