import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

export default function ProblemDetailPage() {
  const { id } = useParams();
  return (
    <div className="detail-layout">
      <section className="card">
        <small>Return to Problems</small>
        <h1>Problem Detail</h1>
        <h2 style={{ marginBottom: 4 }}>{id?.replace(/-/g, " ") ?? "problem"}</h2>
        <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
        <div className="card" style={{ background: "#f8fafc" }}>
          <b>Example 1</b>
          <pre>Input: nums = [2,7,11,15], target = 9{"\n"}Output: [0,1]</pre>
        </div>
      </section>
      <section className="card" style={{ padding: 0, overflow: "hidden" }}>
        <Editor
          height="78vh"
          defaultLanguage="python"
          theme="vs-dark"
          defaultValue={'class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, num in enumerate(nums):\n            d = target - num\n            if d in seen:\n                return [seen[d], i]\n            seen[num] = i\n        return [-1, -1]'}
        />
        <div className="editor-footer">
          <button>Previous</button><button>Next</button>
          <div><button>Run Code</button><button className="btn-primary" style={{ marginLeft: 8 }}>Submit</button></div>
        </div>
      </section>
    </div>
  );
}
