import { useRef, useLayoutEffect, useContext, useState } from "react";
import { GeneralContext } from "./mainContext";
import { formatText } from "../utils";

const MAX_CHARACTER_LENGTH = 1000;

export default function TextArea() {
  const { status, inputText, setInputText, sentimentAnalysis } =
    useContext(GeneralContext);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const formattedTextRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  const [thumbHeightPercent, setThumbHeightPercent] = useState(0);
  const [thumbTopPercent, setThumbTopPercent] = useState(0);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);

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
    Synchronize the scroll position of the text area and the formatted text area,
    and calculate scroll percentage for the custom scrollbar.
  */
  useLayoutEffect(() => {
    if (!textAreaRef.current || !formattedTextRef.current) return;

    const syncScroll = (
      source: HTMLDivElement | HTMLTextAreaElement,
      target: HTMLDivElement | HTMLTextAreaElement
    ) => {
      target.scrollTop =
        target.scrollHeight * (source.scrollTop / source.scrollHeight);

      if (isDraggingThumb) return;

      const { clientHeight, scrollHeight, scrollTop } = source;
      const maxScrollTop = scrollHeight - clientHeight;
      const scrollPercent = (scrollTop / maxScrollTop) * 100;
      const thumbHeightPercent = (clientHeight / scrollHeight) * 100;

      setThumbHeightPercent(thumbHeightPercent);
      setThumbTopPercent((scrollPercent * (100 - thumbHeightPercent)) / 100);
    };

    const handleTextAreaScroll = () => {
      syncScroll(textAreaRef.current!, formattedTextRef.current!);
    };

    const handleFormattedTextScroll = () => {
      syncScroll(formattedTextRef.current!, textAreaRef.current!);
    };

    // Initialise position
    if (status === "DISPLAY_RESULTS") handleFormattedTextScroll();
    else handleTextAreaScroll();

    textAreaRef.current.addEventListener("scroll", handleTextAreaScroll);
    formattedTextRef.current.addEventListener(
      "scroll",
      handleFormattedTextScroll
    );

    return () => {
      textAreaRef.current!.removeEventListener("scroll", handleTextAreaScroll);
      formattedTextRef.current!.removeEventListener(
        "scroll",
        handleFormattedTextScroll
      );
    };
  }, [isDraggingThumb, status]);

  // Handle dragging of the custom scrollbar thumb.
  useLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingThumb || !containerRef.current || !thumbRef.current)
        return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const target: HTMLDivElement | HTMLTextAreaElement =
        status === "DISPLAY_RESULTS"
          ? formattedTextRef.current!
          : textAreaRef.current!;

      let newThumbTop =
        event.clientY - containerRect.top - thumbRef.current.offsetHeight / 2;
      const maxThumbTop = containerRect.height * (1 - thumbHeightPercent / 100);
      newThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));

      setThumbTopPercent((newThumbTop / containerRect.height) * 100);

      const scrollableHeight = target.scrollHeight - target.clientHeight;
      target.scrollTop =
        (thumbTopPercent / (100 - thumbHeightPercent)) * scrollableHeight;
    };

    const handleMouseUp = () => isDraggingThumb && setIsDraggingThumb(false);

    if (isDraggingThumb) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (isDraggingThumb) {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isDraggingThumb, status, thumbHeightPercent, thumbTopPercent]);

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
    backdrop-blur-sm p-4 pr-5 text-xl resize-none text-foreground no-scrollbar overflow-scroll transition-all duration-1000
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

      <div
        ref={containerRef}
        className={textAreaContainerClass}
        style={{ position: "relative" }}
      >
        <textarea
          ref={textAreaRef}
          rows={1}
          maxLength={MAX_CHARACTER_LENGTH}
          disabled={status !== "WAITING_FOR_INPUT"}
          onChange={(event) => setInputText(event.target.value)}
          onPaste={() => setInputText(textAreaRef.current!.value)}
          className={`${textAreaClass} relative z-10 bg-foreground-tint ${
            status === "DISPLAY_RESULTS"
              ? "opacity-0 pointer-events-none select-none"
              : ""
          }`}
          placeholder="Enter your text here..."
          style={{ paddingRight: "15px" }}
        />

        <div
          ref={formattedTextRef}
          className={`${textAreaClass} absolute top-0 left-0 whitespace-pre-line min-h-14 z-50 ${
            status !== "DISPLAY_RESULTS"
              ? "opacity-0 pointer-events-none select-none"
              : ""
          }`}
          style={{ color: "black", paddingRight: "15px" }}
        >
          {formatText(inputText || "", sentimentAnalysis)}
        </div>

        {/* Custom Scrollbar 
            The 95 is a threadshold for when the scrollbar should be hidden 
            i.e when less than 5% of the height is scrollable.
        */}
        {thumbHeightPercent < 95 && (
          <div className="absolute top-2 right-2 bottom-2 w-[10px] z-[100]">
            <div
              ref={thumbRef}
              onMouseDown={() => setIsDraggingThumb(true)}
              className={`absolute w-full bg-foreground rounded-[5px] ${
                !isDraggingThumb && "transi tion-all durat ion-50"
              }`}
              style={{
                height: `${thumbHeightPercent}%`,
                top: `${thumbTopPercent}%`,
                cursor: isDraggingThumb ? "grabbing" : "grab",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
