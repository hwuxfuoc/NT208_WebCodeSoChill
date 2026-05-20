import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { chatStream } from "../../services/aiService";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problemTitle: string;
  problemDescription: string;
  problemDifficulty: string;
  userCode: string;
  lastSubmissionStatus: string | null;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export default function ChatPanel({
  isOpen,
  onClose,
  problemId,
  problemTitle,
  problemDescription,
  problemDifficulty,
  userCode,
  lastSubmissionStatus,
  messages,
  setMessages,
}: ChatPanelProps) {
  const [width, setWidth] = useState(30);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const viewport = window.innerWidth;
      const newWidth = ((viewport - e.clientX) / viewport) * 100;
      if (newWidth >= 20 && newWidth <= 80) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsStreaming(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isLoading: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      await chatStream({
        question: input,
        problemId,
        problemTitle,
        problemDescription,
        problemDifficulty,
        userCode,
        lastSubmissionStatus,
        onChunk: (chunk) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            // Tạo object mới thay vì mutate trực tiếp (tránh lỗi Strict Mode)
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + chunk, isLoading: false },
            ];
          });
        },
        onError: (err) => {
          setError(err);
          setIsStreaming(false);
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            return [...prev.slice(0, -1), { ...last, isLoading: false }];
          });
        },
        onComplete: () => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            return [...prev.slice(0, -1), { ...last, isLoading: false }];
          });
          setIsStreaming(false);
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setIsStreaming(false);
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === "assistant") {
          lastMsg.isLoading = false;
        }
        return updated;
      });
    }
  };

  const handleClose = () => {
    setInput("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay — click to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleClose}
        style={{ display: isOpen ? "block" : "none" }}
      />

      {/* Chat Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white shadow-xl border-l border-gray-200 transition-transform"
        style={{
          width: `${width}%`,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: isDragging ? "none" : "transform 0.3s ease-in-out",
        }}
      >
        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors ${
            isDragging ? "bg-blue-500" : "hover:bg-gray-300"
          }`}
          style={{ cursor: "col-resize" }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">AI Assistant</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center">
              <div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2 opacity-40">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <p>Ask me anything about this problem</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.isLoading ? (
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                ) : msg.role === "user" ? (
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                ) : (
                  <div className="markdown-body max-w-none break-words text-sm overflow-x-auto">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus as any}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-md my-2"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-black/10 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask a question (Shift+Enter for newline)..."
              disabled={isStreaming}
              rows={1}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-none max-h-32 overflow-y-auto"
              style={{ minHeight: "40px" }}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isStreaming || !input.trim()}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 12 17 18 17 6" />
                <path d="M1 12h17" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
