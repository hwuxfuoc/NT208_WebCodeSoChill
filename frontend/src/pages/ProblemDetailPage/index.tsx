import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProblemDetail } from "../../hooks/useProblemDetail";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import ChatPanel from "../../components/ChatPanel/ChatPanel";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { problem, loading, error } = useProblemDetail(id);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setChatMessages([]);
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!problem) return <div className="flex items-center justify-center h-screen">Problem not found</div>;

  return (
    <div className="flex gap-4 h-screen p-4 bg-[#eef1f4] overflow-hidden">
      <div className="w-[420px] flex-shrink-0 h-full overflow-hidden">
        <ProblemDescription
          id={problem.slug ?? problem._id}
          title={problem.title}
          difficulty={problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) as "Easy" | "Medium" | "Hard"}
          description={problem.description}
          constraints={problem.constraints}
          samples={problem.samples}
          tags={problem.tags}
          topics={problem.topics}
          timeLimit={problem.timeLimit}
          memoryLimit={problem.memoryLimit}
          onAskAI={() => setIsChatOpen(true)}
        />
      </div>

      <div className="flex-1 h-full min-w-0">
        <CodeEditor
          problemId={problem._id}
          timeLimit={problem.timeLimit}
          memoryLimit={problem.memoryLimit}
          onOpenChat={() => setIsChatOpen(true)}
          onCodeChange={setCurrentCode}
          onStatusChange={setLastStatus}
        />
      </div>

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        problemId={problem._id}
        problemTitle={problem.title}
        problemDescription={problem.description}
        problemDifficulty={problem.difficulty}
        userCode={currentCode}
        lastSubmissionStatus={lastStatus}
        messages={chatMessages}
        setMessages={setChatMessages}
      />
    </div>
  );
}
