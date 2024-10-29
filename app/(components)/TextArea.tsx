import { useRef, useLayoutEffect, useContext } from "react";
import { GeneralContext } from "./MainContext";
import { formatText } from "../utils";

const MAX_CHARACTER_LENGTH = 1000;

export default function TextArea() {
  const { status, inputText, setInputText, sentimentAnalysis } =
    useContext(GeneralContext);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const formattedTextRef = useRef<HTMLDivElement | null>(null);

  /*
    Adjust the height of the text area and the formatted text area to match the content.
    The formatted text area is hidden by default and only shown when the results are displayed.
  */
  useLayoutEffect(() => {
    const adjustHeight = (
      element: HTMLElement | null,
      height: number | null = null
    ) => {
      if (!element) return;
      element.style.height = "auto";
      element.style.height =
        height !== null ? `${height}px` : `${element.scrollHeight}px`;
    };

    if (!textAreaRef.current || !formattedTextRef.current) return;

    adjustHeight(textAreaRef.current);
    adjustHeight(formattedTextRef.current, textAreaRef.current.scrollHeight);
  }, [inputText]);

  /*
    Synchronize the scroll position of the text area and the formatted text area
  */
  useLayoutEffect(() => {
    if (textAreaRef.current && formattedTextRef.current) {
      const syncScroll = () => {
        formattedTextRef.current!.scrollTop = textAreaRef.current!.scrollTop;
      };

      textAreaRef.current.addEventListener("scroll", syncScroll);
      return () =>
        textAreaRef.current!.removeEventListener("scroll", syncScroll);
    }
  }, []);

  const characterCountClass = (() => {
    if (inputText?.length === MAX_CHARACTER_LENGTH) return "text-red-500";
    if (inputText?.length === 0 || status === "DISPLAY_RESULTS")
      return "opacity-0";
    return "";
  })();

  const textAreaContainerClass = `
    relative w-full no-scrollbar max-h-[75%] transition-all duration-1000 box-border
    ${status === "DISPLAY_RESULTS" ? "flex-grow" : ""}
  `;

  const textAreaClass = `
    border border-solid w-full font-light max-h-full tracking-wide rounded-lg bg-foreground-tint 
    backdrop-blur-sm p-4 text-xl resize-none text-foreground no-scrollbar overflow-scroll transition-all duration-1000
    ${
      status === "DISPLAY_RESULTS"
        ? "border-transparent flex-grow backdrop-blur-md !text-lg"
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
          className={`${textAreaClass} relative z-10 bg-foreground-tint ${
            status === "DISPLAY_RESULTS"
              ? "opacity-0 pointer-events-none select-none"
              : ""
          }`}
          placeholder="Enter your text here..."
        />

        <div
          ref={formattedTextRef}
          className={`${textAreaClass} absolute top-0 left-0 whitespace-pre-line min-h-14 z-50 ${
            status !== "DISPLAY_RESULTS"
              ? "opacity-0 pointer-events-none select-none"
              : ""
          }`}
          style={{ color: "black" }}
        >
          {formatText(inputText || "", sentimentAnalysis)}
        </div>
      </div>
    </>
  );
}
