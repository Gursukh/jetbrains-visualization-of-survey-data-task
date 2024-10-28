"use client";
import { useContext } from "react";
import { GeneralContext } from "./MainContext";
import { AnalyzeSentimentResponse } from "../types";
import TextArea from "./TextArea";

const BUTTON_TEXT = {
  WAITING_FOR_INPUT: "Analyse",
  LOADING: "Loading...",
  DISPLAY_RESULTS: "Back",
};

export default function InputSection() {
  const {
    status,
    lastProcessedText,
    setLastProcessedText,
    setStatus,
    inputText: text,
    setSentimentAnalysis,
  } = useContext(GeneralContext);

  const fetchSentimentData = async () => {
    setStatus("LOADING");
    try {
      const response = await fetch("./api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to fetch sentiment data");

      const data = (await response.json()) as AnalyzeSentimentResponse;
      setSentimentAnalysis(data);
      setLastProcessedText(text);
      setStatus("DISPLAY_RESULTS");
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
      setStatus("WAITING_FOR_INPUT");
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "DISPLAY_RESULTS") {
      setStatus("WAITING_FOR_INPUT");
    } else if (text === lastProcessedText) {
      setStatus("DISPLAY_RESULTS");
    } else {
      fetchSentimentData();
    }
  };

  const getButtonClassName = () => 
    `${status !== "LOADING" ? "cursor-pointer" : ""} ${
      status === "DISPLAY_RESULTS" ? "border-transparent hover:bg-foreground-tint" : ""
    } rounded-lg text-xl py-2 mx-auto px-4 flex-shrink-0 border-2`;

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`absolute pb-4 left-0 ${status === "DISPLAY_RESULTS" ? "top-0" : "top-1/2 -translate-y-1/2"} transition-all duration-1000 w-full h-full flex flex-col justify-center`}
    >
      <TextArea />

      <input
        type="submit"
        value={BUTTON_TEXT[status]}
        disabled={status === "LOADING"}
        className={getButtonClassName()}
      />
    </form>
  );
}
