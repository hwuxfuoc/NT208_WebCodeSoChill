# 💻 Web CodeSoChill – Học lập trình một cách "chill" nhất!

> **Web CodeSoChill** là một nền tảng học lập trình trực tuyến kết hợp hệ thống Online Judge hiện đại, cho phép người dùng luyện tập kỹ năng lập trình thông qua việc giải bài tập và nộp bài với hệ thống chấm tự động (Automatic Judge). Mọi kết quả được phản hồi tức thì, giúp người học nắm bắt điểm sai và cải thiện nhanh chóng.
> 

Lấy cảm hứng từ các nền tảng uy tín như **LeetCode**, **Codeforces**, **AtCoder**, **VNOJ** và **WeCode**, CodeSoChill được xây dựng với triết lý ưu tiên trải nghiệm người dùng: giao diện thân thiện, dễ tiếp cận, phù hợp cho **sinh viên**, **học sinh** và **người mới bắt đầu học lập trình** – những người cần một môi trường luyện tập nhẹ nhàng nhưng đầy đủ tính năng.

---

## ✨ Tính năng chính

### 🔐 Xác thực người dùng

Hệ thống đăng ký và đăng nhập tài khoản được bảo mật bằng JWT (JSON Web Token) kết hợp mã hóa mật khẩu với bcryptjs. Người dùng có thể tạo tài khoản cá nhân, đăng nhập an toàn và duy trì phiên làm việc liên tục mà không lo lộ thông tin.

### 📚 Thư viện bài tập phong phú

Bài tập được phân loại rõ ràng theo từng chủ đề như **Lập trình cơ bản**, **Thuật toán**, **Cấu trúc dữ liệu**, **OOP**, và nhiều chủ đề khác. Cách tổ chức này giúp người học dễ dàng lựa chọn bài tập phù hợp với trình độ hiện tại, đồng thời xây dựng lộ trình học tập có hệ thống từ cơ bản đến nâng cao.

### ⚡ Nộp bài & Chấm tự động thời gian thực

Người dùng viết code trực tiếp trên nền tảng và nhấn Submit để nộp bài. Hệ thống chấm bài tự động sẽ sử dụng và đánh giá code dựa trên các testcase được lấy trực tiếp từ **LeetCode**, sau đó trả về kết quả ngay lập tức – không cần chờ đợi hay thao tác thủ công nào.

### 📊 Kết quả chấm chi tiết

Sau mỗi lần nộp, người dùng nhận được phản hồi cụ thể về trạng thái bài làm, bao gồm:

- **Accepted (AC)** – Code đúng, vượt qua toàn bộ testcase.
- **Wrong Answer (WA)** – Code chạy được nhưng cho kết quả sai.
- **Time Limit Exceeded (TLE)** – Code chạy quá thời gian cho phép, cần tối ưu thuật toán.
- **Runtime Error (RE)** – Code bị lỗi trong lúc chạy (ví dụ: tràn bộ nhớ, chia cho 0).
- Và nhiều trạng thái khác giúp người dùng hiểu chính xác vấn đề cần khắc phục.

### 🖊️ Code Editor trực tuyến

Tích hợp **Ace Editor** hoặc **Monaco Editor** (cùng engine với VS Code) với tính năng **syntax highlighting** theo ngôn ngữ lập trình, giúp người dùng viết code thoải mái ngay trên trình duyệt mà không cần cài đặt bất kỳ phần mềm nào.

### 🕓 Lịch sử nộp bài & Phân tích kết quả

Toàn bộ lịch sử các lần nộp bài được lưu lại, cho phép người dùng xem lại từng submission, so sánh các lần thử, và phân tích sự tiến bộ của bản thân theo thời gian.

### 🏆 Bảng xếp hạng (Leaderboard)

Hệ thống xếp hạng công khai giúp người dùng theo dõi vị trí cá nhân so với cộng đồng, từ đó tạo động lực học tập và cạnh tranh lành mạnh.

### 👤 Quản lý Profile cá nhân

Mỗi người dùng có trang cá nhân riêng, hiển thị thông tin tài khoản, danh sách bài đã giải, tỷ lệ thành công và các thành tích đạt được – giúp theo dõi tiến trình học tập một cách trực quan.

### 🎨 Giao diện hiện đại, Responsive

Thiết kế theo chuẩn **responsive**, tương thích trên cả máy tính, máy tính bảng và điện thoại di động. Giao diện sạch sẽ, dễ nhìn, tối ưu hóa trải nghiệm người dùng ở mọi kích thước màn hình.

---

## 🛠 Tech Stack & Kiến trúc

Dự án được xây dựng theo mô hình **MERN Stack** – một trong những stack phổ biến nhất cho ứng dụng web hiện đại:
<img width="1158" height="271" alt="image" src="https://github.com/user-attachments/assets/89144649-020d-424f-9b9c-97b6c685d974" />

### 🖥 Frontend

Chạy ở port local: `http://localhost:5173`

| Công nghệ | Mục đích sử dụng |
| --- | --- |
| **React.js + Vite + TypeScript** | Framework chính để xây dựng giao diện người dùng, Vite giúp phát triển nhanh, TypeScript đảm bảo an toàn kiểu dữ liệu. |
| **TailwindCSS** | Utility-first CSS framework giúp xây dựng UI nhanh chóng, linh hoạt và dễ dàng tùy biến. |
| **Framer Motion** | Thư viện animation mạnh mẽ dành cho React, tạo các hiệu ứng chuyển động mượt mà cho UI. |
| **Monaco Editor** | Trình soạn thảo code trực tuyến với syntax highlighting, line numbering và nhiều tính năng IDE thu gọn (cùng engine với VS Code). |
| **React Query + Axios** | Quản lý state của server, caching dữ liệu và gọi API từ backend một cách tối ưu. |
| **React Router DOM** | Quản lý điều hướng (routing) giữa các trang trong ứng dụng Single Page Application (SPA). |

### ⚙️ Backend

Chạy ở port local: `http://localhost:5000`

| Công nghệ | Mục đích sử dụng |
| --- | --- |
| **Node.js + Express.js** | Nền tảng server-side, xây dựng RESTful API để xử lý các request từ frontend. |
| **Mongoose** | ODM (Object Document Mapper) giúp định nghĩa schema và tương tác với MongoDB một cách có cấu trúc. |
| **JWT (JSON Web Token)** | Xác thực người dùng sau khi đăng nhập, đảm bảo chỉ những request hợp lệ mới được truy cập tài nguyên bảo mật. |
| **bcryptjs** | Mã hóa mật khẩu người dùng trước khi lưu vào database, bảo vệ dữ liệu ngay cả khi hệ thống bị tấn công. |
| **Judge Engine (LeetCode Testcases)** | Hệ thống chấm bài tự động thực hiện đánh giá code người dùng thông qua việc chạy qua các testcase chuẩn được lấy từ LeetCode, thay vì tự host môi trường sandbox cục bộ. |

### 🤖 AI Service

Chạy ở port local: `http://localhost:8000`

| Công nghệ | Mục đích sử dụng |
| --- | --- |
| **FastAPI + Uvicorn** | Framework Python hiện đại, hiệu năng cao để xây dựng RESTful API cho dịch vụ AI. |
| **ChromaDB** | Vector Database dùng để lưu trữ và truy vấn embeddings cho hệ thống RAG (Retrieval-Augmented Generation). |
| **Sentence Transformers** | Mô hình AI dùng để chuyển đổi văn bản thành vector embeddings, phục vụ cho tìm kiếm ngữ nghĩa. |
| **Ollama** | Khởi chạy và giao tiếp với các mô hình ngôn ngữ lớn (LLM) cục bộ để sinh câu trả lời tự động. |

### 🗄 Database

Sử dụng **MongoDB Atlas** (Free Tier) – cơ sở dữ liệu NoSQL dạng document, phù hợp với cấu trúc dữ liệu linh hoạt của ứng dụng.

Các collection chính trong database:

| Collection | Nội dung lưu trữ |
| --- | --- |
| `users` | Thông tin tài khoản người dùng: tên, email, mật khẩu đã mã hóa, avatar, ngày tạo... |
| `problems` | Danh sách bài tập: tiêu đề, mô tả, độ khó, chủ đề, giới hạn thời gian & bộ nhớ... |
| `submissions` | Lịch sử nộp bài: người nộp, bài nộp, code, ngôn ngữ, kết quả, thời gian chấm... |
| `testcases` | Các bộ dữ liệu input/output dùng để chấm bài, liên kết với từng bài tập. *(👉 [Xem cơ chế Testcase](document/Testcases.md))* |
| `contests` | (Tuỳ chọn) Thông tin về các cuộc thi lập trình nếu tính năng contest được triển khai. |

---

## 📁 Cấu trúc thư mục

```bash
WebCodeSoChill/
├── backend/          # Node.js + Express – toàn bộ logic server, API, xác thực
├── frontend/         # React + Vite + TypeScript – giao diện người dùng
├── ai-service/       # FastAPI + ChromaDB – Dịch vụ AI/RAG hỗ trợ học tập
├── document/         # Thư mục chứa các tài liệu chi tiết (Frontend, Backend, Setup...)
├── README.md         # File tài liệu chính
└── .env.example      # Mẫu các biến môi trường cần cấu hình
```

Chi tiết hơn về từng phần được mô tả trong:

| Tài liệu | Nội dung / Mô tả chi tiết |
| --- | --- |
| 💻 [`Frontend.md`](document/Frontend.md) | Cấu trúc thư mục frontend, danh sách component, flow UI/UX. |
| ⚙️ [`Backend.md`](document/Backend.md) | Danh sách API endpoints, cơ chế Judge system, luồng xác thực. |
| 🧪 [`Testcases.md`](document/Testcases.md) | Cơ chế hoạt động của testcase và công cụ lấy dữ liệu từ LeetCode. |
| 🤖 [`AI-Service.md`](document/AI-Service.md) | Kiến trúc RAG, cấu hình Vector Database và tích hợp LLM. |
| 🔄 [`Workflow.md`](document/Workflow.md) | Kiến trúc CI/CD Pipeline tự động hóa Test và Deploy trên GitHub Actions. |
| 🚀 [`Deploy.md`](document/Deploy.md) | Hướng dẫn lấy Token và cấu hình triển khai lên Vercel & Render. |

---

## 🚀 Hướng dẫn cài đặt & Chạy local

Bạn có thể chạy dự án bằng **Docker** (nhanh chóng, khuyên dùng) hoặc **Cài đặt thủ công** (dành cho phát triển).

### 🐳 Cách 1: Chạy dự án bằng Docker (Cách nhanh nhất)

Dự án CodeSoChill được cấu hình sẵn Docker, không yêu cầu cài đặt phức tạp bất kỳ môi trường nào (Node.js, Python, MongoDB). Chỉ cần chạy một lệnh duy nhất.

**Yêu cầu hệ thống:** Đã cài đặt **Docker Desktop** (hoặc Docker Engine + Docker Compose). Không cần cài đặt thêm Node.js hay Python.

**Các bước thực hiện:**

1. Mở Terminal (hoặc Command Prompt / PowerShell) tại thư mục gốc của dự án (nơi chứa file `docker-compose.yml`).
2. Chạy lệnh sau:
   ```bash
   docker-compose up --build
   ```
   *(Lưu ý: Lần chạy đầu tiên sẽ mất vài phút để Docker tải và cài đặt các thư viện cần thiết. Những lần sau sẽ khởi động ngay lập tức.)*

3. Truy cập ứng dụng:
   - **Frontend (Giao diện chính)**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)
   - **AI Service API**: [http://localhost:8000](http://localhost:8000)

**Chú thích về dữ liệu và AI:**
- **Database**: Hệ thống mặc định kết nối lên MongoDB Atlas (Cloud) bằng cấu hình đã được cung cấp sẵn trong mã nguồn. Nhờ vậy, hệ thống có thể được truy cập ngay với đầy đủ dữ liệu (tài khoản test, câu hỏi, testcase) mà không cần seed lại dữ liệu.
- **Trợ lý ảo AI (Ollama)**: Để tiết kiệm dung lượng và thời gian build Docker (tránh tải model 5GB), tính năng AI sẽ gọi qua một Ollama instance chạy trên máy tính (host).
  - *Nếu muốn test tính năng AI*, vui lòng tải và chạy Ollama trên máy: `ollama run qwen2.5-coder:7b` (hoặc `llama3`).
  - *Nếu không chạy Ollama*, mọi tính năng cốt lõi khác của hệ thống (nộp bài, chấm tự động, bảng xếp hạng) vẫn **hoạt động hoàn hảo 100%**.

**Cách dừng dự án:**
Để tắt toàn bộ hệ thống, nhấn `Ctrl + C` tại Terminal đang chạy lệnh `docker-compose up`, sau đó gõ thêm:
```bash
docker-compose down
```

### 💻 Cách 2: Cài đặt thủ công (Local Development)

Hướng dẫn cài đặt chi tiết từng bước (bao gồm cài đặt Node.js, MongoDB, biến môi trường...) vui lòng xem tại file: 👉 [**Setup.md**](document/Setup.md)

Tóm tắt nhanh các bước chính:

```bash
# 1. Clone repository về máy
git clone https://github.com/hwuxfuoc/NT208_WebCodeSoChill.git
cd NT208_WebCodeSoChill

# 2. Cài đặt dependencies cho backend
cd backend
npm install

# 3. Cài đặt dependencies cho frontend
cd ../frontend
npm install

# 4. Cấu hình biến môi trường
cp .env.example .env
# Điền các thông tin: MONGO_URI, JWT_SECRET, PORT,...

# 5. Chạy backend (port 5000)
cd backend
npm run dev

# 6. Chạy frontend (port 5173)
cd frontend
npm run dev

# 7. Cài đặt và chạy AI Service (port 8000)
cd ../ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

Sau khi khởi động, truy cập ứng dụng tại: [http://localhost:5173](http://localhost:5173/)

---

## ☁️ Deployment

Dự án hiện đã được deploy và đang chạy thực tế trên các nền tảng sau:

| Thành phần | Nền tảng | Đường dẫn (URL) | Dashboard Quản lý |
| --- | --- | --- | --- |
| **Website Chính** | Domain Tùy chỉnh | [https://www.codesochill.io.vn](https://www.codesochill.io.vn) | - |
| **Frontend** | Vercel | [Vercel App URL](https://nt-208-web-code-so-chill-frontend-eenx-a9ywf1jqb.vercel.app) | [Vercel Project](https://vercel.com/hwuxfuocs-projects/nt-208-web-code-so-chill-frontend-eenx) |
| **Backend API** | Render | [Render Web Service](https://nt208-webcodesochill-tpqh.onrender.com) | [Render Dashboard](https://dashboard.render.com/web/srv-d877719s16ns738qc280) |
| **AI Service** | Render | [Render AI Service](https://nt208-webcodesochill-ai.onrender.com) | [Render Dashboard](https://dashboard.render.com/web/srv-d877b0h9rddc7386e6hg) |
| **Database** | MongoDB Atlas | Cluster của dự án | [MongoDB Dashboard](https://cloud.mongodb.com/v2/69d9a481ccc1bd04de725e02#/overview) |
| **Media Storage** | Cloudinary | Lưu trữ Avatar User | [Cloudinary Dashboard](https://console.cloudinary.com/app/c-292e5a00e212a4aeeba56df65e8ccb/home/dashboard) |

---

## 🔗 Tài liệu liên quan

| Nội dung | Đường dẫn |
| --- | --- |
| ER Diagram (thiết kế database) | [Xem trên Eraser.io](https://app.eraser.io/workspace/MibBxluYc33hORCIUomJ?origin=share) |
| Frontend Local | [http://localhost:5173](http://localhost:5173/) |
| Backend API Local | [http://localhost:5000](http://localhost:5000/) |
| Live Demo | [https://www.codesochill.io.vn](https://www.codesochill.io.vn) |

---

## 🧰 Tổng hợp công nghệ sử dụng

| Công nghệ | Vai trò |
| --- | --- |
| React.js + Vite + TypeScript | Frontend framework |
| TailwindCSS + Framer Motion | UI & Animation |
| Node.js + Express | Backend API |
| FastAPI + ChromaDB | AI / RAG Service |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Xác thực & Bảo mật |
| Monaco Editor | Trình soạn thảo code trực tuyến |

---

<div align="center">

**Web CodeSoChill** – Nơi việc học lập trình trở nên nhẹ nhàng và thú vị hơn mỗi ngày. 💻✨

</div>
