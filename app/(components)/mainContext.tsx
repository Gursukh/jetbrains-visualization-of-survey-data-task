"use client";

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface GeneralContextType {
  inputText: string | null;
  sentimentAnalysis: string | null;
  setInputText: Dispatch<SetStateAction<string | null>>;
  setSentimentAnalysis: Dispatch<SetStateAction<string | null>>;
}

export const GeneralContext = createContext<GeneralContextType>({
  inputText: null,
  sentimentAnalysis: null,
  setInputText: () => {},
  setSentimentAnalysis: () => {},
});

export default function MainContext({ children }: { children: ReactNode }) {
  const [inputText, setInputText] = useState<string | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<string | null>(null);

  return (
    <GeneralContext.Provider
      value={{ inputText, sentimentAnalysis, setInputText, setSentimentAnalysis }}
    >
      {children}
    </GeneralContext.Provider>
  );
}
