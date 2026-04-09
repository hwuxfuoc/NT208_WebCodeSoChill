# 💻 Web CodeSoChill – Học lập trình một cách "chill" nhất!

> **Web CodeSoChill** là một nền tảng học lập trình trực tuyến kết hợp hệ thống Online Judge hiện đại, cho phép người dùng luyện tập kỹ năng lập trình thông qua việc giải bài tập và nộp bài với hệ thống chấm tự động (Automatic Judge). Mọi kết quả được phản hồi tức thì, giúp người học nắm bắt điểm sai và cải thiện nhanh chóng.
> 

Lấy cảm hứng từ các nền tảng uy tín như **LeetCode**, **Codeforces**, **AtCoder** và **VNOJ**, CodeSoChill được xây dựng với triết lý ưu tiên trải nghiệm người dùng: giao diện thân thiện, dễ tiếp cận, phù hợp cho **sinh viên**, **học sinh** và **người mới bắt đầu học lập trình** – những người cần một môi trường luyện tập nhẹ nhàng nhưng đầy đủ tính năng.

---

## ✨ Tính năng chính

### 🔐 Xác thực người dùng

Hệ thống đăng ký và đăng nhập tài khoản được bảo mật bằng JWT (JSON Web Token) kết hợp mã hóa mật khẩu với bcryptjs. Người dùng có thể tạo tài khoản cá nhân, đăng nhập an toàn và duy trì phiên làm việc liên tục mà không lo lộ thông tin.

### 📚 Thư viện bài tập phong phú

Bài tập được phân loại rõ ràng theo từng chủ đề như **Lập trình cơ bản**, **Thuật toán**, **Cấu trúc dữ liệu**, **OOP**, và nhiều chủ đề khác. Cách tổ chức này giúp người học dễ dàng lựa chọn bài tập phù hợp với trình độ hiện tại, đồng thời xây dựng lộ trình học tập có hệ thống từ cơ bản đến nâng cao.

### ⚡ Nộp bài & Chấm tự động thời gian thực

Người dùng viết code trực tiếp trên nền tảng và nhấn Submit để nộp bài. Hệ thống Judge sẽ tự động biên dịch, chạy code qua các testcase được định sẵn và trả về kết quả ngay lập tức – không cần chờ đợi hay thao tác thủ công nào.

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

Hệ thống xếp hạng công khai giúp người dùng theo dõi vị trí của mình so với cộng đồng, từ đó tạo động lực học tập và cạnh tranh lành mạnh.

### 👤 Quản lý Profile cá nhân

Mỗi người dùng có trang cá nhân riêng, hiển thị thông tin tài khoản, danh sách bài đã giải, tỷ lệ thành công và các thành tích đạt được – giúp theo dõi tiến trình học tập một cách trực quan.

### 🎨 Giao diện hiện đại, Responsive

Thiết kế theo chuẩn **responsive**, tương thích trên cả máy tính, máy tính bảng và điện thoại di động. Giao diện sạch sẽ, dễ nhìn, tối ưu hóa trải nghiệm người dùng ở mọi kích thước màn hình.

---

## 🛠 Tech Stack & Kiến trúc

Dự án được xây dựng theo mô hình **MERN Stack** – một trong những stack phổ biến nhất cho ứng dụng web hiện đại:

![image.png](attachment:0a51aebd-e5fc-44e1-a6cf-0d4fafd2fbfb:image.png)

### 🖥 Frontend

Chạy ở port local: `http://localhost:5173`

| Công nghệ | Mục đích sử dụng |
| --- | --- |
| **React.js + Vite** | Framework chính để xây dựng giao diện người dùng theo dạng component, Vite giúp quá trình phát triển nhanh hơn đáng kể so với CRA truyền thống. |
| **HTML5 + CSS3** | Xây dựng cấu trúc trang và viết style cơ bản, làm nền tảng cho toàn bộ giao diện. |
| **Ant Design** | Thư viện UI component chuyên nghiệp, cung cấp sẵn các thành phần như Button, Table, Form, Modal,... giúp đẩy nhanh tốc độ phát triển UI. |
| **Bootstrap + CSS thuần** | Hỗ trợ styling linh hoạt, đặc biệt cho các layout responsive và các tinh chỉnh giao diện tùy biến. |
| **Ace Editor / Monaco Editor** | Trình soạn thảo code trực tuyến với syntax highlighting, line numbering và nhiều tính năng IDE thu gọn. |
| **Axios** | Thư viện HTTP client dùng để gọi các API từ backend một cách gọn gàng, hỗ trợ xử lý lỗi và interceptor. |
| **React Router DOM** | Quản lý điều hướng (routing) giữa các trang trong ứng dụng Single Page Application (SPA). |

### ⚙️ Backend

Chạy ở port local: `http://localhost:5000`

| Công nghệ | Mục đích sử dụng |
| --- | --- |
| **Node.js + Express.js** | Nền tảng server-side, xây dựng RESTful API để xử lý các request từ frontend. |
| **Mongoose** | ODM (Object Document Mapper) giúp định nghĩa schema và tương tác với MongoDB một cách có cấu trúc. |
| **JWT (JSON Web Token)** | Xác thực người dùng sau khi đăng nhập, đảm bảo chỉ những request hợp lệ mới được truy cập tài nguyên bảo mật. |
| **bcryptjs** | Mã hóa mật khẩu người dùng trước khi lưu vào database, bảo vệ dữ liệu ngay cả khi hệ thống bị tấn công. |
| **Judge Engine** | Hệ thống chấm bài tự động chạy code người dùng trong môi trường sandbox an toàn, tránh ảnh hưởng đến hệ thống chính. |

### 🗄 Database

Sử dụng **MongoDB Atlas** (Free Tier) – cơ sở dữ liệu NoSQL dạng document, phù hợp với cấu trúc dữ liệu linh hoạt của ứng dụng.

Các collection chính trong database:

| Collection | Nội dung lưu trữ |
| --- | --- |
| `users` | Thông tin tài khoản người dùng: tên, email, mật khẩu đã mã hóa, avatar, ngày tạo... |
| `problems` | Danh sách bài tập: tiêu đề, mô tả, độ khó, chủ đề, giới hạn thời gian & bộ nhớ... |
| `submissions` | Lịch sử nộp bài: người nộp, bài nộp, code, ngôn ngữ, kết quả, thời gian chấm... |
| `testcases` | Các bộ dữ liệu input/output dùng để chấm bài, liên kết với từng bài tập. |
| `contests` | (Tuỳ chọn) Thông tin về các cuộc thi lập trình nếu tính năng contest được triển khai. |

---

## 📁 Cấu trúc thư mục

```bash
WebCodeSoChill/
├── backend/          # Node.js + Express – toàn bộ logic server, API, xác thực
├── frontend/         # React + Vite – giao diện người dùng
├── judge/            # (Tuỳ chọn) Thư mục chứa sandbox code execution engine
├── README.md         # File bạn đang đọc
├── Setup.md          # Hướng dẫn cài đặt chi tiết
└── .env.example      # Mẫu các biến môi trường cần cấu hình
```

Chi tiết hơn về từng phần được mô tả trong:

- [`Frontend.md`](https://claude.ai/chat/Frontend.md) – Cấu trúc thư mục frontend, danh sách component, flow UI/UX.
- [`Backend.md`](https://claude.ai/chat/Backend.md) – Danh sách API endpoints, cơ chế Judge system, luồng xác thực.

---

## 🚀 Hướng dẫn cài đặt & Chạy local

Hướng dẫn cài đặt chi tiết từng bước (bao gồm cài đặt Node.js, MongoDB, biến môi trường...) vui lòng xem tại file:

👉 [**Setup.md**](https://claude.ai/chat/Setup.md)

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
```

Sau khi khởi động, truy cập ứng dụng tại: [http://localhost:5173](http://localhost:5173/)

---

## ☁️ Deployment (Gợi ý)

Dưới đây là các nền tảng được khuyến nghị để deploy từng thành phần của ứng dụng:

| Thành phần | Nền tảng gợi ý | Lý do |
| --- | --- | --- |
| **Frontend** | [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/) | Hỗ trợ React/Vite tốt, deploy tự động từ GitHub, có free tier. |
| **Backend** | [Render.com](https://render.com/) / [Railway](https://railway.app/) / [Fly.io](https://fly.io/) | Hỗ trợ Node.js, dễ cấu hình biến môi trường, có free tier. |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Dịch vụ cloud MongoDB chính thức, free tier đủ dùng cho dự án nhỏ. |
| **Judge Service** | Docker sandbox (tách riêng service) | Cần môi trường cô lập để chạy code người dùng an toàn, tránh rủi ro bảo mật. |

> ⚠️ **Lưu ý bảo mật**: Judge Engine (hệ thống chạy code người dùng) nên được tách thành một service riêng biệt và chạy trong môi trường sandbox (Docker container) để đảm bảo code độc hại không ảnh hưởng đến server chính.
> 

---

## 🔗 Tài liệu liên quan

| Nội dung | Đường dẫn |
| --- | --- |
| ER Diagram (thiết kế database) | [Xem trên Eraser.io](https://www.notion.so/...) |
| Frontend Local | [http://localhost:5173](http://localhost:5173/) |
| Backend API Local | [http://localhost:5000](http://localhost:5000/) |
| Live Demo | *(Sẽ cập nhật sau khi deploy)* |

---

## 🧰 Tổng hợp công nghệ sử dụng

| Công nghệ | Vai trò |
| --- | --- |
| React.js + Vite | Frontend framework |
| Ant Design | UI Component Library |
| Bootstrap | Responsive & Utility CSS |
| Node.js + Express | Backend API |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Xác thực & Bảo mật |
| Ace / Monaco Editor | Trình soạn thảo code trực tuyến |

---

<div align="center">

**Web CodeSoChill** – Nơi việc học lập trình trở nên nhẹ nhàng và thú vị hơn mỗi ngày. 💻✨

</div>
