import { MutableRefObject, useRef, useLayoutEffect, useContext } from "react";
import { GeneralContext } from "./MainContext";
import { formatText } from "../utils";

const MAX_CHARACTER_LENGTH = 1000;

export default function TextArea() {
  const { status, inputText, setInputText, sentimentAnalysis } =
    useContext(GeneralContext);
  const textAreaRef: MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);
  const formattedTextRef: MutableRefObject<HTMLDivElement | null> =
    useRef(null);

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      if (formattedTextRef.current) {
        formattedTextRef.current.style.height = "auto";
        formattedTextRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
    }
  }, [inputText]);

  useLayoutEffect(() => {
    if (textAreaRef.current && formattedTextRef.current) {
      const handleScroll = () => {
        formattedTextRef.current!.scrollTop = textAreaRef.current!.scrollTop;
      };

      textAreaRef.current.addEventListener("scroll", handleScroll);

      return () => {
        textAreaRef.current!.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const characterCountClass =
    inputText?.length === MAX_CHARACTER_LENGTH
      ? "text-red-500"
      : inputText?.length === 0 || status === "DISPLAY_RESULTS"
      ? "opacity-0"
      : "";

  const textAreaContainerClass = `
          relative w-full no-scrollbar max-h-[75%] transition-all duration-1000 box-border
          ${status === "DISPLAY_RESULTS" ? " flex-grow" : ""}
        `;

  const textAreaClass = `
    border border-solid w-full font-light max-h-full tracking-wide rounded-lg bg-foreground-tint 
    backdrop-blur-sm p-4 text-xl resize-none text-foreground no-scrollbar overflow-scroll  transition-all duration-1000
    ${
      status === "DISPLAY_RESULTS"
        ? "border-transparent flex-grow backdrop-blur-md !text-lg "
        : ""
    }
  `;

  return (
    <>
      <p
        className={`transition-all duration-300 h-fit ml-auto bottom-full overflow-hidden mb-1 ${characterCountClass}`}
      >
        {`${inputText?.length ?? 0} / ${MAX_CHARACTER_LENGTH}`}
      </p>

      <div className={textAreaContainerClass}>
        <textarea
          ref={textAreaRef}
          rows={1}
          maxLength={MAX_CHARACTER_LENGTH}
          disabled={status !== "WAITING_FOR_INPUT"}
          onChange={(event) => setInputText(event.target.value)}
          className={
            textAreaClass +
            " relative z-10 bg-foreground-tint" +
            (status === "DISPLAY_RESULTS" && " opacity-0 pointer-events-none select-none  ")
          }
          placeholder="Enter your text here..."
        />

        <div
          ref={formattedTextRef}
          className={
            textAreaClass +
            " absolute top-0 left-0  whitespace-pre-line min-h-14 z-50 " +
            (status !== "DISPLAY_RESULTS" && " opacity-0 pointer-events-none select-none ")
          }
          style={{ color: "black" }}
        >
          {formatText(inputText || "", sentimentAnalysis)}
        </div>
      </div>
    </>
  );
}
