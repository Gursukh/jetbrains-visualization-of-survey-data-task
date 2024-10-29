"use client";

import { createContext, useState, ReactNode, useCallback } from "react";
import { AnalyzeSentimentResponse, APP_STATUS, GeneralContextType } from "../types";

export const GeneralContext = createContext<GeneralContextType>({
  status: "WAITING_FOR_INPUT",
  inputText: null,
  lastProcessedText: null,
  sentimentAnalysis: null,
  tooltip: { isVisible: false, content: "", position: { top: 0, left: 0 } },
  setStatus: () => {},
  setInputText: () => {},
  setLastProcessedText: () => {},
  setSentimentAnalysis: () => {},
  showTooltip: () => {},
  hideTooltip: () => {},
});

export default function MainContext({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<APP_STATUS>("WAITING_FOR_INPUT");
  const [inputText, setInputText] = useState<string | null>(null);
  const [lastProcessedText, setLastProcessedText] = useState<string | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<AnalyzeSentimentResponse | null>(null);
  const [tooltip, setTooltip] = useState({
    isVisible: false,
    content: "",
    position: { top: 0, left: 0 },
  });

  const showTooltip = useCallback((content: string, position: { top: number; left: number }) => {
    setTooltip({ isVisible: true, content, position });
  }, []);

  const hideTooltip = useCallback(() => setTooltip((tooltip) => ({ ...tooltip, isVisible: false })), []);

  const contextValue = {
    status,
    inputText,
    lastProcessedText,
    sentimentAnalysis,
    tooltip,
    setStatus,
    setInputText,
    setLastProcessedText,
    setSentimentAnalysis,
    showTooltip,
    hideTooltip,
  };

  return <GeneralContext.Provider value={contextValue}>{children}</GeneralContext.Provider>;
}
