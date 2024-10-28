"use client";
import { useContext } from "react";
import { GeneralContext } from "./mainContext";

export default function InputSection() {
  const {setSentimentAnalysis} = useContext(GeneralContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission behavior
    event.preventDefault(); 

    try {
      const response = await fetch("./api/sentiment");
      if (!response.ok) throw new Error("Failed to fetch sentiment data");

      const data = await response.json();
      console.log("Sentiment data:", data);
      setSentimentAnalysis(data);   
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <textarea
        className="w-full border-2 rounded-lg p-4 text-lg resize-none h-auto overflow-hidden"
        placeholder="Enter your text here..."
        rows={1}
      />
      <input
        type="submit"
        className="border-2 rounded-lg text-xl py-2 mx-auto px-4 cursor-pointer"
      />
    </form>
  );
}
