"use client";
import { useContext, useState, useCallback } from "react";
import { GeneralContext } from "./MainContext";
import { AnalyzeSentimentResponse } from "../types";
import TextArea from "./TextArea";

const BUTTON_TEXT = {
  WAITING_FOR_INPUT: "Check",
  LOADING: "Loading...",
  DISPLAY_RESULTS: "Back",
} as const;

type StatusType = keyof typeof BUTTON_TEXT;

export default function InputSection() {
  const {
    status,
    lastProcessedText,
    setLastProcessedText,
    setStatus,
    inputText: text,
    setSentimentAnalysis,
  } = useContext(GeneralContext);

  const [error, setError] = useState<string | null>(null);

  const fetchSentimentData = useCallback(async () => {
    setStatus("LOADING");
    try {
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(typeof result.error == 'string' ? result.error : "An unexpected error occurred.");
      }

      const data = result as AnalyzeSentimentResponse;
      setSentimentAnalysis(data);
      setLastProcessedText(text);
      setStatus("DISPLAY_RESULTS");
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setStatus("WAITING_FOR_INPUT");
    }
  }, [
    setStatus,
    text,
    setSentimentAnalysis,
    setLastProcessedText,
  ]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "DISPLAY_RESULTS") {
      setStatus("WAITING_FOR_INPUT");
    } else if (text && text === lastProcessedText) {
      setStatus("DISPLAY_RESULTS");
    } else {
      fetchSentimentData();
    }
  };

  const getButtonClassName = () => {
    const baseClasses =
      "rounded-lg text-xl py-2 mx-auto w-40 px-4 flex-shrink-0 border-2 my-8 transition-colors duration-300";

    const statusClasses: Record<StatusType, string> = {
      WAITING_FOR_INPUT: "cursor-pointer",
      LOADING: "",
      DISPLAY_RESULTS: "!border-1 hover:bg-foreground-tint cursor-pointer",
    };

    return `${baseClasses} ${statusClasses[status as StatusType]}`;
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="transition-all duration-1000 w-full h-full flex flex-col justify-center py-5"
    >
      <TextArea />

      <button
        type="submit"
        disabled={status === "LOADING"}
        className={getButtonClassName()}
      >
        {BUTTON_TEXT[status as StatusType]}
      </button>

      {error && status === "WAITING_FOR_INPUT" && (
        <p className="absolute bottom-10 left-1/2 transform -translate-x-1/2 border-red-500 border-2 text-center px-4 transition-opacity duration-300 mt-4 w-auto whitespace-nowrap text-red-500 rounded-full pointer-events-none">
          {"Error: " + error}
        </p>
      )}
    </form>
  );
}
