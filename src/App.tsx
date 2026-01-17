import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type Message = { id: number; text: string; sender: "user" | "assistant" };

function App() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInput, setShowInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [typed, setTyped] = useState("");
  const typingIntervalRef = useRef<number | null>(null);
  const TYPING_SPEED = 30; // ms per char

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function submitText(text?: string) {
    const t = (text ?? value).trim();
    if (t === "") return;
    setMessages((m) => [...m, { id: Date.now(), text: t, sender: "user" }]);
    setValue("");
    // small UX: simulate assistant echo after a short delay
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, text: `Got it: ${t}`, sender: "assistant" },
      ]);
    }, 400);
  }

  function finishTypingImmediately() {
    if (!typing) return;
    if (typingIntervalRef.current) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setTyped(typingText);
    setTyping(false);
    // commit typed text as a message
    setMessages((m) => [
      ...m,
      { id: Date.now(), text: typingText, sender: "user" },
    ]);
    // simulate assistant reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          text: `Got it: ${typingText}`,
          sender: "assistant",
        },
      ]);
    }, 400);
  }

  function startTypingAnimation(text: string) {
    // initialize typing state
    setTypingText(text);
    setTyped("");
    setTyping(true);
    // clear any existing interval
    if (typingIntervalRef.current) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    let i = 0;
    typingIntervalRef.current = window.setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        if (typingIntervalRef.current) {
          window.clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setTyping(false);
        // commit final message
        setMessages((m) => [...m, { id: Date.now(), text, sender: "user" }]);
        // assistant echo
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            {
              id: Date.now() + 1,
              text: `Got it: ${text}`,
              sender: "assistant",
            },
          ]);
        }, 400);
      }
    }, TYPING_SPEED);
  }

  useEffect(() => {
    if (showInput) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
    return () => {
      if (typingIntervalRef.current) {
        window.clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [showInput]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submitText();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitText();
    }
  }

  function handleInput() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }

  return (
    <div className="app-root relative min-h-screen flex items-center justify-center p-6">
      <div className="gradient-bg" aria-hidden="true" />
      <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Type something and press Enter to send (Shift+Enter for newline)
          </p>
          {messages.length === 0 && !showInput && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  setShowInput(true);
                  startTypingAnimation("Compare AI model performance!");
                }}
                className="inline-flex items-center justify-center text-xl px-6 py-3 rounded-full bg-indigo-600 text-white shadow-lg transform transition hover:scale-105 animate-pulse"
                aria-label="Compare AI model performance"
              >
                Compare AI model performance!
              </button>
            </div>
          )}

          {/* show messages and input once user clicks the quick option or there are messages */}
        </div>

        {(showInput || messages.length > 0) && (
          <>
            <div className="h-96 p-4 overflow-y-auto" ref={listRef}>
              <div className="flex flex-col gap-3">
                {typing && (
                  <div className={`flex justify-end`}>
                    <div
                      onClick={() => finishTypingImmediately()}
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap bg-indigo-600 text-white rounded-br-none cursor-pointer`}
                    >
                      <span>{typed}</span>
                      <span className="typing-cursor" />
                    </div>
                  </div>
                )}
                {messages.length === 0 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    No messages yet — try typing below.
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                        m.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-4 py-4 border-t border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-end gap-3">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  rows={1}
                  placeholder="Send a message..."
                  className="flex-1 resize-none max-h-40 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <button
                  type="submit"
                  aria-label="Send"
                  className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      d="M22 2L11 13"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22l-4-9-9-4 20-7z"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
