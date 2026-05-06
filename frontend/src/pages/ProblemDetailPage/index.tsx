import { useParams } from "react-router-dom";
import { useProblemDetail } from "../../hooks/useProblemDetail";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { problem, loading, error } = useProblemDetail(id);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!problem) return <div className="flex items-center justify-center h-screen">Problem not found</div>;

  return (
    <div className="flex gap-4 h-screen p-4 bg-[#eef1f4]">
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
        />
      </div>

      <div className="flex-1 h-full min-w-0">
        <CodeEditor />
      </div>
    </div>
  );
}
