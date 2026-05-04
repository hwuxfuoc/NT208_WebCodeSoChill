import { useParams } from "react-router-dom";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";

export default function ProblemDetailPage() {
  const { id } = useParams();

  return (
    <div className="flex gap-4 h-screen p-4 bg-[#eef1f4]">
      <div className="w-[420px] flex-shrink-0 h-full overflow-hidden">
        <ProblemDescription id="ID-001A" title="Two Sum Re-imagined" difficulty="Easy" />
      </div>

      <div className="flex-1 h-full min-w-0">
        <CodeEditor />
      </div>
    </div>
  );
}
