import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProblemDetail } from "../../hooks/useProblemDetail";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { problem, loading, error } = useProblemDetail(id);
  const [currentCode, setCurrentCode] = useState("");
  const [lastStatus, setLastStatus] = useState<string | null>(null);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!problem) return <div className="flex items-center justify-center h-screen">Problem not found</div>;

  return (
    <div className="flex gap-3 h-full overflow-hidden bg-white" style={{ padding: "12px" }}>
      <div className="w-[420px] flex-shrink-0 h-full overflow-hidden">
        <ProblemDescription
          id={problem.slug ?? problem._id}
          problemId={problem._id}
          title={problem.title}
          difficulty={problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) as "Easy" | "Medium" | "Hard"}
          description={problem.description}
          constraints={problem.constraints}
          samples={problem.samples}
          tags={problem.tags}
          topics={problem.topics}
          timeLimit={problem.timeLimit}
          memoryLimit={problem.memoryLimit}
          currentCode={currentCode}
          lastSubmissionStatus={lastStatus}
        />
      </div>

      <div className="flex-1 h-full min-w-0">
        <CodeEditor
          problemId={problem._id}
          timeLimit={problem.timeLimit}
          memoryLimit={problem.memoryLimit}
          onCodeChange={setCurrentCode}
          onStatusChange={setLastStatus}
        />
      </div>
    </div>
  );
}
