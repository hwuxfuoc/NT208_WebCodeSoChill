import { useState, useRef } from "react";

const LANGS = ["JavaScript", "Python 3", "Java", "C++", "Go", "Rust"];
const DEFAULT_CODE: Record<string, string> = {
  "JavaScript": "// Your code here\n",
  "Python 3":   "# Your code here\n",
  "Java":       "// Your code here\n",
  "C++":        "// Your code here\n",
  "Go":         "// Your code here\n",
  "Rust":       "// Your code here\n",
};

export default function CreatePostBox() {
  const [showCode, setShowCode] = useState(false);
  const [lang, setLang] = useState("JavaScript");
  const [code, setCode] = useState(DEFAULT_CODE["JavaScript"]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCode = () => {
    if (!showCode) setCode(DEFAULT_CODE[lang]);
    setShowCode(prev => !prev);
  };

  const handleLangChange = (l: string) => {
    setLang(l);
    setCode(DEFAULT_CODE[l]);
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageUrl(URL.createObjectURL(file));
  };

  return (
    <div className="card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      <div className="flex items-center gap-4 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-100 focus-within:border-orange-400 transition-colors">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" className="w-10 h-10 rounded-full" />
        <input className="bg-transparent border-none outline-none w-full text-sm text-gray-700" placeholder="What's the architecture today?" />
      </div>

      {imageUrl && !showCode && (
        <div className="mb-3 rounded-2xl overflow-hidden relative group">
          <img src={imageUrl} alt="preview" className="w-full h-44 object-cover" />
          <button
            onClick={() => setImageUrl(null)}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}

      {showCode && (
        <div className="mb-3 rounded-2xl overflow-hidden border border-[#2a2a3e]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#161625] border-b border-[#2a2a3e]">
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Code Snippet</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={lang}
                onChange={e => handleLangChange(e.target.value)}
                className="bg-[#2a2a3e] text-[11px] font-bold text-gray-300 rounded-lg px-3 py-1 outline-none border border-gray-700 focus:border-orange-400 cursor-pointer"
              >
                {LANGS.map(l => <option key={l}>{l}</option>)}
              </select>
              <button onClick={() => setShowCode(false)} className="text-gray-600 hover:text-gray-300 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full block bg-[#1e1e2e] text-gray-200 text-[13px] font-mono p-4 outline-none resize-none"
            style={{ lineHeight: "1.6" }}
            rows={7}
            spellCheck={false}
          />
          {imageUrl && (
            <div className="relative group">
              <img src={imageUrl} alt="preview" className="w-full h-40 object-cover" />
              <button
                onClick={() => setImageUrl(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center px-2">
        <div className="flex gap-4 text-gray-400">
          <button onClick={handleImageClick} className={`transition-colors ${imageUrl ? "text-orange-500" : "hover:text-gray-600"}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </button>
          <button onClick={toggleCode} className={`transition-colors ${showCode ? "text-orange-500" : "hover:text-gray-600"}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          </button>
          <button className="hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          </button>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full text-sm shadow-md transition-all">Post Pulse</button>
      </div>
    </div>
  );
}
