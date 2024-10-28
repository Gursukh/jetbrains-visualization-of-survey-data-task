import { Dispatch, SetStateAction } from "react";

export type APP_STATUS = "WAITING_FOR_INPUT" | "LOADING" | "DISPLAY_RESULTS";

export interface GeneralContextType {
  status: APP_STATUS;
  inputText: string | null;
  lastProcessedText: string | null;
  sentimentAnalysis: AnalyzeSentimentResponse | null;
  setStatus: Dispatch<SetStateAction<APP_STATUS>>;
  setInputText: Dispatch<SetStateAction<string | null>>;
  setLastProcessedText: Dispatch<SetStateAction<string | null>>;
  setSentimentAnalysis: Dispatch<SetStateAction<AnalyzeSentimentResponse | null>>;
}

export interface SentenceSentiment {
  text: {
    content: string;
    beginOffset: number;
  };
  sentiment: {
    magnitude: number;
    score: number;
  };
}

export interface AnalyzeSentimentResponse {
  documentSentiment: {
    magnitude: number;
    score: number;
  };
  language: string;
  sentences: SentenceSentiment[];
}