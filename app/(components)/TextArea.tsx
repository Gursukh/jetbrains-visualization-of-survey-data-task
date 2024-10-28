import {
  MutableRefObject,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";
import { GeneralContext } from "./MainContext";

const MAX_CHARACTER_LENGTH = 1000;

export default function TextArea() {
  const { status, inputText, setInputText } = useContext(GeneralContext);
  const textAreaRef: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  const characterCountClass = inputText?.length === MAX_CHARACTER_LENGTH
    ? "text-red-500"
    : inputText?.length === 0 || status === "DISPLAY_RESULTS"
    ? "opacity-0"
    : "";

  const textAreaClass = `
    border border-solid w-full mb-8 font-light tracking-wide rounded-lg bg-foreground-tint 
    backdrop-blur-sm p-4 text-lg resize-none text-foreground no-scrollbar max-h-[50vh] transition-all duration-1000
    ${status === "DISPLAY_RESULTS" ? 
      "border-transparent bg-foreground-tint flex-grow backdrop-blur-md opacity-70 !text-sm !overflow-scroll !mb-4" 
      : ""
    }
  `;

  return (
    <>
      <p
        className={`transition-all duration-300 ml-auto bottom-full h-0 -translate-y-[2rem] ${characterCountClass}`}
      >
        {`${inputText?.length ?? 0} / ${MAX_CHARACTER_LENGTH}`}
      </p>
      <textarea
        ref={textAreaRef}
        rows={1}
        maxLength={MAX_CHARACTER_LENGTH}
        disabled={status !== "WAITING_FOR_INPUT"}
        onChange={(event) => setInputText(event.target.value)}
        className={textAreaClass}
        placeholder="Enter your text here..."
      />
    </>
  );
}
