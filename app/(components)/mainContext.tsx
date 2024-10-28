"use client";

// This file is just to keep code in page.tsx clearer.

import { createContext, useState, ReactNode } from "react";
import { AnalyzeSentimentResponse, GeneralContextType } from "../types";

export const GeneralContext = createContext<GeneralContextType>({
  inputText: null,
  sentimentAnalysis: null,
  setInputText: () => {},
  setSentimentAnalysis: () => {},
});

export default function MainContext({ children }: { children: ReactNode }) {
  const [inputText, setInputText] = useState<string | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<AnalyzeSentimentResponse | null>(null);

  return (
    <GeneralContext.Provider
      value={{ inputText, sentimentAnalysis, setInputText, setSentimentAnalysis }}
    >
      {children}
    </GeneralContext.Provider>
  );
}
