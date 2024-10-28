"use client";

// This file is just to keep code in page.tsx clearer.

import { createContext, useState, ReactNode } from "react";
import {
  AnalyzeSentimentResponse,
  APP_STATUS,
  GeneralContextType,
} from "../types";

export const GeneralContext = createContext<GeneralContextType>({
  status: "WAITING_FOR_INPUT",
  inputText: null,
  lastProcessedText: null,
  sentimentAnalysis: null,
  setStatus: () => {},
  setInputText: () => {},
  setLastProcessedText: () => {},
  setSentimentAnalysis: () => {},
});

export default function MainContext({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<APP_STATUS>("WAITING_FOR_INPUT");
  const [inputText, setInputText] = useState<string | null>(null);
  const [lastProcessedText, setLastProcessedText] = useState<string | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] =
    useState<AnalyzeSentimentResponse | null>(null);

  return (
    <GeneralContext.Provider
      value={{
        status,
        inputText,
        lastProcessedText,
        sentimentAnalysis,
        setStatus,
        setInputText,
        setLastProcessedText,
        setSentimentAnalysis,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
}
