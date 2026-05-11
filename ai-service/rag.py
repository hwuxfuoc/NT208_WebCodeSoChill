# ai-service/rag.py
"""
rag.py – ChromaDB setup và retrieval cho AI service.

Collections:
  - problems   : đề bài từ MongoDB
  - algorithms : kiến thức thuật toán (chuẩn bị thủ công)
  - hints      : gợi ý từng bài (tuỳ chọn)
"""

import chromadb
from chromadb.utils import embedding_functions

# Dùng embedding mặc định của ChromaDB (all-MiniLM-L6-v2, chạy local, miễn phí)
_DEFAULT_EF = embedding_functions.DefaultEmbeddingFunction()

_client = chromadb.PersistentClient(path="./chroma_db")

# ── Collections ──────────────────────────────────────────────────────────────

def _get_collection(name: str):
    return _client.get_or_create_collection(
        name=name,
        embedding_function=_DEFAULT_EF,
        metadata={"hnsw:space": "cosine"},
    )

problems_col   = _get_collection("problems")
algorithms_col = _get_collection("algorithms")
hints_col      = _get_collection("hints")


# ── Public API ────────────────────────────────────────────────────────────────

def get_relevant_context(question: str, problem_id: str | None = None, top_k: int = 3) -> str:
    """
    Truy xuất tài liệu liên quan từ ChromaDB.
    Trả về string ghép các đoạn tài liệu để nhét vào prompt.
    """
    results = []

    # 1. Luôn tìm trong algorithms
    algo_res = algorithms_col.query(query_texts=[question], n_results=top_k)
    results.extend(_extract_docs(algo_res))

    # 2. Nếu có problem_id → lấy thẳng đề bài đó (chính xác hơn query)
    if problem_id:
        try:
            prob_res = problems_col.get(ids=[problem_id], include=["documents"])
            if prob_res["documents"]:
                results.insert(0, f"[Đề bài]\n{prob_res['documents'][0]}")
        except Exception:
            pass  # Bài chưa được ingest → bỏ qua

    # 3. Tìm hints liên quan
    hint_res = hints_col.query(query_texts=[question], n_results=2)
    results.extend(_extract_docs(hint_res))

    return "\n\n---\n\n".join(results) if results else ""


def _extract_docs(query_result: dict) -> list[str]:
    docs = query_result.get("documents", [[]])[0]
    metas = query_result.get("metadatas", [[]])[0]
    out = []
    for doc, meta in zip(docs, metas):
        if doc:
            label = meta.get("label", "Tài liệu")
            out.append(f"[{label}]\n{doc}")
    return out


# ── Upsert helpers (dùng trong ingest.py) ────────────────────────────────────

def upsert_problem(problem_id: str, title: str, description: str,
                   difficulty: str, tags: list[str]):
    text = f"Title: {title}\nDifficulty: {difficulty}\nTags: {', '.join(tags)}\n\n{description}"
    problems_col.upsert(
        ids=[problem_id],
        documents=[text],
        metadatas=[{"label": f"Đề bài: {title}", "difficulty": difficulty}],
    )


def upsert_algorithm(algo_id: str, name: str, content: str):
    algorithms_col.upsert(
        ids=[algo_id],
        documents=[content],
        metadatas=[{"label": f"Thuật toán: {name}"}],
    )


def upsert_hint(hint_id: str, problem_title: str, content: str):
    hints_col.upsert(
        ids=[hint_id],
        documents=[content],
        metadatas=[{"label": f"Hint: {problem_title}"}],
    )