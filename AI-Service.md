# 🤖 AI Service & RAG (Retrieval-Augmented Generation)

AI Service là một module độc lập trong hệ thống **Web CodeSoChill**, đóng vai trò như một trợ giảng ảo giúp giải đáp thắc mắc, gợi ý thuật toán và hướng dẫn người dùng giải quyết các bài tập lập trình. Dịch vụ này được xây dựng trên nền tảng Python (FastAPI) kết hợp cùng kỹ thuật RAG (Retrieval-Augmented Generation) và mô hình ngôn ngữ lớn (LLM) thông qua Ollama.

## 🛠 Tech Stack

| Công nghệ | Vai trò |
| --- | --- |
| **FastAPI + Uvicorn** | Framework xử lý HTTP request hiệu suất cao, cung cấp API (REST và Server-Sent Events cho streaming). |
| **Ollama** | Engine cục bộ dùng để chạy mô hình ngôn ngữ lớn (LLM). Mặc định cấu hình sử dụng model `qwen2.5-coder:7b`. |
| **ChromaDB** | Vector Database lưu trữ kiến thức thuật toán, đề bài và gợi ý để truy xuất ngữ nghĩa (semantic search). |
| **Sentence Transformers** | Tạo vector nhúng (embeddings) từ văn bản (sử dụng model `all-MiniLM-L6-v2`). |
| **PyMongo** | Kết nối trực tiếp với cơ sở dữ liệu MongoDB để trích xuất đề bài và bài nộp mẫu. |

## ⚙️ Kiến trúc hệ thống RAG

Hệ thống RAG giúp LLM trả lời chính xác và thực tế hơn bằng cách cung cấp thêm ngữ cảnh (context) từ cơ sở dữ liệu nội bộ thay vì chỉ dựa vào kiến thức có sẵn của mô hình.

### 1. Quá trình Ingest Dữ liệu (`ingest.py`)
Script `ingest.py` chịu trách nhiệm thu thập và đồng bộ dữ liệu vào ChromaDB. Dữ liệu được chia làm 4 collection chính:
- **Problems**: Trích xuất tiêu đề, độ khó, và mô tả của các bài tập từ MongoDB.
- **Solutions**: Tìm kiếm các bài nộp đã được hệ thống chấp nhận (`status: accepted`) từ MongoDB để làm code tham khảo (reference solution).
- **Algorithms**: Cơ sở tri thức (knowledge base) chứa các khái niệm, giải thích và template code của các thuật toán phổ biến (Two Pointers, Sliding Window, BFS, DFS, DP, v.v.).
- **Hints**: Các gợi ý và hướng tiếp cận tối ưu cho từng bài tập cụ thể.

Các lệnh thực thi ingest dữ liệu:
```bash
python ingest.py                # Cập nhật toàn bộ (RAG + Export dataset)
python ingest.py --rag-only     # Chỉ cập nhật nội dung cho ChromaDB
python ingest.py --dataset-only # Chỉ export dữ liệu ra định dạng JSONL để phục vụ quá trình fine-tuning
```

### 2. Quá trình Truy xuất (`rag.py`)
Khi có yêu cầu từ phía Frontend, hàm `get_relevant_context` sẽ xử lý:
- Sử dụng tìm kiếm vector (Cosine Similarity) để quét và lấy ra top các thuật toán và gợi ý liên quan nhất đến câu hỏi của người dùng.
- Dựa vào tham số `problem_id` để lấy chính xác thông tin đề bài và code tham khảo tương ứng.
- Tổng hợp và ghép nối các dữ liệu trên thành một khối văn bản ngữ cảnh hợp nhất.

### 3. Sinh phản hồi (`main.py`)
- Hệ thống thiết lập System Prompt nhằm định hướng LLM đóng vai trò là một trợ giảng: chỉ hướng dẫn tư duy, không viết toàn bộ code thay cho người dùng, và bắt buộc trả lời bằng tiếng Việt.
- Khối văn bản ngữ cảnh lấy từ RAG cùng mã nguồn hiện tại của người dùng (nếu có) được nhúng (embed) vào Prompt để gửi tới Ollama.
- Ollama tiến hành xử lý câu lệnh và trả kết quả dưới dạng Streaming API (`/chat/stream`) giúp giao diện Frontend hiển thị nội dung phản hồi mượt mà từng phần tử, hoặc Standard API (`/chat`) để trả về phản hồi toàn vẹn một lần.

## 🚀 Hướng dẫn khởi động AI Service

Yêu cầu môi trường đã cài đặt Python 3, thư viện đi kèm và Ollama đang chạy dịch vụ ngầm với mô hình LLM tương ứng.

```bash
# Di chuyển vào thư mục dịch vụ AI
cd ai-service

# Cài đặt các dependencies cần thiết
pip install -r requirements.txt

# Khởi chạy server FastAPI (mặc định chạy trên cổng 8000)
uvicorn main:app --reload
```

Sau khi khởi động hoàn tất, Frontend sẽ có thể gọi dịch vụ AI thông qua các endpoint cung cấp (ví dụ: `http://localhost:8000/chat/stream`).
