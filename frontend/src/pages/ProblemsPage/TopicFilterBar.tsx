// ─── Figma: Topics with counts shown inline in pill ─────────────────────────
const TOPIC_COUNTS: Record<string, number> = {
  "All Topics": 0,
  "Array": 462,
  "String": 300,
  "Hash Table": 182,
  "Math": 46,
  "Dynamic Programming": 150,
};

interface TopicFilterBarProps {
  topic: string;
  setTopic: (t: string) => void;
  setPage: (p: number) => void;
}

export default function TopicFilterBar({ topic, setTopic, setPage }: TopicFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {Object.entries(TOPIC_COUNTS).map(([item, count]) => {
        const isActive = topic === item;
        return (
          <button
            key={item}
            onClick={() => { setTopic(item); setPage(1); }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all"
            style={
              isActive
                ? { backgroundColor: "var(--main-orange-color)", color: "#fff" }
                : { backgroundColor: "#f4f6f8", color: "#667085" }
            }
          >
            {/* Icon for "All Topics" */}
            {item === "All Topics" && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>
            )}
            {item}
            {item !== "All Topics" && (
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--main-orange-color)",
                  color: "#fff",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
