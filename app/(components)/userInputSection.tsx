"use client";
import { useContext, useState } from "react";
import { GeneralContext } from "./MainContext";
import { AnalyzeSentimentResponse } from "../types";
import TextArea from "./TextArea";

const BUTTON_TEXT = {
  WAITING_FOR_INPUT: "Check",
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

  const [error, setError] = useState<string | null>(null);

  const fetchSentimentData = async () => {
    try {
      setStatus("LOADING");
      const response = await fetch("./api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error((await response.json()).error);

      const data = (await response.json()) as AnalyzeSentimentResponse;
      setSentimentAnalysis(data);
      setLastProcessedText(text);
      setStatus("DISPLAY_RESULTS");
      setError(null);
    } catch (error: unknown) {
      setError(error as string);
      setStatus("WAITING_FOR_INPUT");
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "DISPLAY_RESULTS") {
      setStatus("WAITING_FOR_INPUT");
    } else if (text === lastProcessedText && text != null) {
      setStatus("DISPLAY_RESULTS");
    } else {
      fetchSentimentData();
    }
  };

  const getButtonClassName = () =>
    `${status !== "LOADING" ? "cursor-pointer" : ""} ${
      status === "DISPLAY_RESULTS" ? "!border-1 hover:bg-foreground-tint" : ""
    } rounded-lg text-xl py-2 mx-auto w-[10rem] px-4 flex-shrink-0 border-2 my-8`;

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`${
        status === "DISPLAY_RESULTS" ? "" : ""
      } transition-all duration-1000 w-full h-full flex flex-col justify-center py-5`}
    >
      <TextArea />

      <input
        type="submit"
        value={BUTTON_TEXT[status]}
        disabled={status === "LOADING"}
        className={getButtonClassName()}
      />

      <p
        className="absolute pointer-events-none bottom-[10%] left-1/2 -translate-x-1/2 border-red-500 border-2 text-center mx-auto px-4 transition-all duration-300 mt-4 w-auto whitespace-nowrap text-red-500 rounded-full"
        style={{
          opacity: error && status == "WAITING_FOR_INPUT" ? "100%" : "0%",
        }}
      >
        {`${error}`}
      </p>
    </form>
  );
}
