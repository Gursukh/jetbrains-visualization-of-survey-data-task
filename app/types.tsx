import { Dispatch, SetStateAction } from "react";

export interface GeneralContextType {
  inputText: string | null;
  sentimentAnalysis: AnalyzeSentimentResponse | null;
  setInputText: Dispatch<SetStateAction<string | null>>;
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