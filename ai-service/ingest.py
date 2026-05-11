# ai-service/ingest.py
"""
ingest.py – Hai nhiệm vụ song song:
  1. Import dữ liệu vào ChromaDB (phục vụ RAG)
  2. Export dataset.jsonl từ MongoDB (phục vụ fine-tuning)

Chạy:
    python ingest.py                # cả 2 nhiệm vụ
    python ingest.py --rag-only     # chỉ ChromaDB
    python ingest.py --dataset-only # chỉ export dataset

Cần cài: pip install pymongo chromadb sentence-transformers
"""

import os
import sys
import json
from rag import upsert_problem, upsert_algorithm, upsert_hint

# ─────────────────────────────────────────────────────────────
# PHẦN 1: Import đề bài từ MongoDB
# ─────────────────────────────────────────────────────────────

def ingest_problems_from_mongo():
    """Đọc tất cả problems từ MongoDB và upsert vào ChromaDB."""
    try:
        from pymongo import MongoClient
    except ImportError:
        print("⚠️  pymongo chưa cài. Chạy: pip install pymongo")
        return

    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME   = os.getenv("DB_NAME", "codesochwill")  # đổi tên DB của bạn

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    # Đổi "problems" thành tên collection của bạn nếu khác
    problems = list(db["problems"].find({}))
    print(f"📦 Tìm thấy {len(problems)} bài trong MongoDB")

    for p in problems:
        problem_id = str(p["_id"])
        title       = p.get("title", "")
        description = p.get("description", "")
        difficulty  = p.get("difficulty", "unknown")
        tags        = p.get("tags", [])

        upsert_problem(problem_id, title, description, difficulty, tags)
        print(f"  ✅ {title} ({difficulty})")

    client.close()
    print(f"✅ Ingest xong {len(problems)} bài\n")


# ─────────────────────────────────────────────────────────────
# PHẦN 2: Algorithm knowledge base (viết thủ công)
# ─────────────────────────────────────────────────────────────

ALGORITHMS = [
    {
        "id": "two-pointers",
        "name": "Two Pointers",
        "content": """
Kỹ thuật Two Pointers (hai con trỏ):

KHI NÀO DÙNG:
- Mảng/string đã sắp xếp
- Tìm cặp/bộ số thoả điều kiện tổng
- Loại bỏ phần tử trùng (remove duplicates)
- Bài toán container with most water

NGUYÊN LÝ:
Dùng 2 con trỏ left và right, di chuyển về phía nhau (hoặc cùng chiều).
Thường giảm từ O(n²) brute-force xuống O(n).

TEMPLATE:
left, right = 0, len(arr) - 1
while left < right:
    if điều_kiện_thoả(arr[left], arr[right]):
        # xử lý kết quả
        left += 1
        right -= 1
    elif cần_tăng_tổng:
        left += 1
    else:
        right -= 1

ĐỘ PHỨC TẠP: O(n) time, O(1) space
""".strip()
    },
    {
        "id": "sliding-window",
        "name": "Sliding Window",
        "content": """
Kỹ thuật Sliding Window (cửa sổ trượt):

KHI NÀO DÙNG:
- Subarray/substring liên tiếp thoả điều kiện
- Tìm max/min trong window kích thước k
- Longest substring without repeating characters

NGUYÊN LÝ:
Duy trì một "cửa sổ" [left, right], mở rộng right khi cần, thu hẹp left khi vi phạm điều kiện.

TEMPLATE (variable window):
left = 0
window = {}
for right in range(len(s)):
    # thêm s[right] vào window
    while vi_phạm_điều_kiện(window):
        # xóa s[left] khỏi window
        left += 1
    # cập nhật kết quả

ĐỘ PHỨC TẠP: O(n) time, O(k) space (k = kích thước window)
""".strip()
    },
    {
        "id": "hashmap",
        "name": "HashMap / HashSet",
        "content": """
HashMap và HashSet trong thuật toán:

KHI NÀO DÙNG:
- Đếm tần suất phần tử
- Kiểm tra tồn tại O(1)
- Two Sum và các biến thể
- Group anagrams

NGUYÊN LÝ:
Dùng dictionary/set để tra cứu O(1) thay vì O(n) với array.

PATTERN – Two Sum:
seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        return [seen[complement], i]
    seen[num] = i

ĐỘ PHỨC TẠP: O(n) time, O(n) space
""".strip()
    },
    {
        "id": "binary-search",
        "name": "Binary Search",
        "content": """
Binary Search (tìm kiếm nhị phân):

KHI NÀO DÙNG:
- Mảng đã sắp xếp
- Tìm vị trí chèn (bisect)
- Bài toán "tìm giá trị nhỏ nhất thoả X" → binary search trên đáp án

TEMPLATE:
left, right = 0, len(arr) - 1
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
return -1

ĐỘ PHỨC TẠP: O(log n) time, O(1) space
""".strip()
    },
    {
        "id": "bfs",
        "name": "BFS (Breadth-First Search)",
        "content": """
BFS – Tìm kiếm theo chiều rộng:

KHI NÀO DÙNG:
- Tìm đường đi ngắn nhất trên đồ thị không trọng số
- Level-order traversal cây
- 0-1 BFS, Multi-source BFS

TEMPLATE:
from collections import deque
queue = deque([start])
visited = {start}
level = 0

while queue:
    for _ in range(len(queue)):
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    level += 1

ĐỘ PHỨC TẠP: O(V + E) time và space
""".strip()
    },
    {
        "id": "dfs",
        "name": "DFS (Depth-First Search)",
        "content": """
DFS – Tìm kiếm theo chiều sâu:

KHI NÀO DÙNG:
- Liệt kê tất cả đường đi
- Phát hiện chu trình
- Topological sort
- Connected components

TEMPLATE (đệ quy):
visited = set()

def dfs(node):
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor)

ĐỘ PHỨC TẠP: O(V + E) time, O(V) space (call stack)
""".strip()
    },
    {
        "id": "dynamic-programming",
        "name": "Dynamic Programming",
        "content": """
Dynamic Programming (quy hoạch động):

KHI NÀO DÙNG:
- Bài toán có subproblems chồng lấp
- Có optimal substructure
- Keywords: tối đa, tối thiểu, số cách, có thể hay không

CÁC DẠNG PHỔ BIẾN:
1. 1D DP: Fibonacci, Climbing Stairs, House Robber
2. 2D DP: Longest Common Subsequence, Edit Distance
3. Knapsack: 0/1 Knapsack, Unbounded Knapsack

QUY TRÌNH:
1. Định nghĩa dp[i] là gì
2. Tìm công thức chuyển trạng thái (transition)
3. Base case
4. Thứ tự tính

ĐỘ PHỨC TẠP: thường O(n²) hoặc O(n×m), space O(n) hoặc O(n×m)
""".strip()
    },
    {
        "id": "prefix-sum",
        "name": "Prefix Sum",
        "content": """
Prefix Sum (tổng tiền tố):

KHI NÀO DÙNG:
- Truy vấn tổng đoạn [l, r] nhiều lần
- Subarray sum equals k
- Kết hợp với HashMap để tìm subarray

TEMPLATE:
prefix = [0] * (n + 1)
for i in range(n):
    prefix[i+1] = prefix[i] + arr[i]

# Tổng đoạn [l, r] (0-indexed):
range_sum = prefix[r+1] - prefix[l]

TRICK – Subarray sum = k (dùng HashMap):
count = 0
curr_sum = 0
seen = {0: 1}
for num in nums:
    curr_sum += num
    count += seen.get(curr_sum - k, 0)
    seen[curr_sum] = seen.get(curr_sum, 0) + 1

ĐỘ PHỨC TẠP: O(n) build, O(1) query
""".strip()
    },
]

def ingest_algorithms():
    print("📚 Ingest algorithm knowledge base...")
    for algo in ALGORITHMS:
        upsert_algorithm(algo["id"], algo["name"], algo["content"])
        print(f"  ✅ {algo['name']}")
    print(f"✅ Ingest xong {len(ALGORITHMS)} thuật toán\n")


# ─────────────────────────────────────────────────────────────
# PHẦN 3: Hints mẫu (tuỳ chọn, thêm dần)
# ─────────────────────────────────────────────────────────────

HINTS = [
    {
        "id": "hint-two-sum",
        "problem_title": "Two Sum",
        "content": """
Hint cho bài Two Sum:

Bước 1: Nghĩ về brute-force O(n²) – duyệt mọi cặp (i, j). Tại sao chậm?
Bước 2: Với mỗi phần tử, bạn cần tìm "complement = target - num" trong O(1).
Bước 3: Cấu trúc dữ liệu nào hỗ trợ lookup O(1)? → HashMap
Bước 4: Lưu {giá_trị: index} khi duyệt qua. Trước khi thêm num vào map, kiểm tra xem complement đã có chưa.
""".strip()
    },
    {
        "id": "hint-longest-substring",
        "problem_title": "Longest Substring Without Repeating Characters",
        "content": """
Hint cho bài Longest Substring Without Repeating Characters:

Bước 1: Brute-force kiểm tra mọi substring – O(n²) hoặc O(n³).
Bước 2: Nhận xét: nếu [left, right] là substring hợp lệ, ta chỉ cần mở rộng right.
Bước 3: Khi thêm s[right] mà bị trùng → cần dịch left sang phải.
Bước 4: Dùng HashSet để track ký tự hiện có trong window.
Kỹ thuật này gọi là Sliding Window.
""".strip()
    },
]

def ingest_hints():
    print("💡 Ingest hints...")
    for hint in HINTS:
        upsert_hint(hint["id"], hint["problem_title"], hint["content"])
        print(f"  ✅ Hint: {hint['problem_title']}")
    print(f"✅ Ingest xong {len(HINTS)} hints\n")


# ─────────────────────────────────────────────────────────────
# PHẦN 4: Export dataset.jsonl cho fine-tuning
# ─────────────────────────────────────────────────────────────

# Template prompt để sinh Q&A — sẽ dùng với Claude/GPT-4 API ở bước sau.
# File này chỉ export raw problems ra JSONL để script sinh dataset đọc vào.

def export_problems_for_dataset(output_path: str = "problems_raw.jsonl"):
    """
    Export toàn bộ problems từ MongoDB ra file JSONL.
    Script sinh dataset (generate_dataset.py) sẽ đọc file này
    và gọi Claude/GPT-4 API để sinh Q&A pairs.
    """
    try:
        from pymongo import MongoClient
    except ImportError:
        print("⚠️  pymongo chưa cài. Chạy: pip install pymongo")
        return

    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME   = os.getenv("DB_NAME", "codesochwill")  # đổi tên DB của bạn

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    problems = list(db["problems"].find({}))
    client.close()

    print(f"📦 Tìm thấy {len(problems)} bài → export ra {output_path}")

    with open(output_path, "w", encoding="utf-8") as f:
        for p in problems:
            record = {
                "id":          str(p["_id"]),
                "title":       p.get("title", ""),
                "description": p.get("description", ""),
                "difficulty":  p.get("difficulty", "unknown"),
                "tags":        p.get("tags", []),
            }
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

    print(f"✅ Đã export {len(problems)} bài → {output_path}\n")
    print("👉 Bước tiếp: chạy generate_dataset.py để sinh Q&A pairs\n")


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args = sys.argv[1:]

    if "--rag-only" in args:
        print("🚀 Chế độ: RAG only\n")
        ingest_algorithms()
        ingest_hints()
        ingest_problems_from_mongo()

    elif "--dataset-only" in args:
        print("🚀 Chế độ: Dataset export only\n")
        export_problems_for_dataset()

    else:
        print("🚀 Chế độ: Tất cả (RAG + Dataset export)\n")
        ingest_algorithms()
        ingest_hints()
        ingest_problems_from_mongo()
        export_problems_for_dataset()

    print("🎉 Hoàn thành!")