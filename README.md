# NT208_WebCodeSoChill

# **Web CodeSoChill** 

**Web CodeSoChill** là nền tảng học lập trình và Online Judge hiện đại, giúp người dùng rèn luyện kỹ năng lập trình qua việc giải bài tập và nộp bài với hệ thống chấm bài tự động (Automatic Judge).

Lấy cảm hứng từ các nền tảng uy tín như LeetCode, Codeforces, AtCoder và VNOJ, CodeSoChill tập trung vào trải nghiệm thân thiện, dễ sử dụng, phù hợp cho sinh viên, học sinh và người mới bắt đầu học lập trình.

### Tính năng chính

- Đăng ký / Đăng nhập tài khoản an toàn
- Thư viện bài tập phong phú theo chủ đề (Cơ bản, Thuật toán, Cấu trúc dữ liệu, OOP, …)
- **Nộp bài (Submit)** và **chạy testcase tự động** thời gian thực
- Hiển thị kết quả chi tiết: Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error, …
- Editor code trực tuyến với syntax highlighting
- Xem lịch sử nộp bài và phân tích kết quả
- Xem bảng xếp hạng (Leaderboard)
- Quản lý profile và danh sách bài đã giải
- Giao diện hiện đại, responsive, dễ sử dụng

---

## **Tech Stack & Kiến Trúc**

Dự án được xây dựng bằng **MERN Stack** (MongoDB - Express.js - React.js - Node.js).

### Frontend
- **React.js** + Vite
- **Ant Design** (thiết kế component chính)
- **Bootstrap** + CSS thuần (hỗ trợ styling linh hoạt)
- **Ace Editor** hoặc **Monaco Editor** (code editor)
- **Axios** – gọi API
- **React Router DOM** – điều hướng

**Port local**: `5173`

### Backend
- **Node.js** + **Express.js**
- **Mongoose** – kết nối MongoDB
- **JWT** – xác thực
- **bcryptjs** – mã hóa mật khẩu
- Hệ thống Judge (Code Execution Engine) sử dụng sandbox an toàn

**Port local**: `5000`

### Database
- **MongoDB Atlas** (Free tier)
- Các collection chính:
  - `users`
  - `problems` (bài tập)
  - `submissions` (bài nộp)
  - `testcases`
  - `contests` (nếu có)

---

## Hướng dẫn cài đặt & chạy local

Chi tiết hướng dẫn cài đặt vui lòng xem tại:  
**[Setup.md](https://github.com/hwuxfuoc/.../Setup.md)** (bạn thay link sau khi tạo)

### Cấu trúc thư mục

```bash
WebCodeSoChill/
├── backend/          # Node.js + Express
├── frontend/         # React + Vite
├── judge/            # (tùy chọn) thư mục sandbox code execution
├── README.md
├── Setup.md
└── .env.example
```

---

## Chi tiết các phần

- **[Frontend.md](https://github.com/hwuxfuoc/.../Frontend.md)** – Cấu trúc thư mục, component, flow UI
- **[Backend.md](https://github.com/hwuxfuoc/.../Backend.md)** – API endpoints, Judge system, authentication

---

## Deployment (Gợi ý)

- **Frontend**: Vercel / Netlify
- **Backend**: Render.com / Railway / Fly.io
- **Database**: MongoDB Atlas
- **Judge Service** (Code Execution): Có thể tách riêng service dùng Docker sandbox

---

## Công nghệ & Công cụ chính

| Công nghệ          | Mục đích                     |
|--------------------|------------------------------|
| React.js + Vite    | Frontend framework           |
| Ant Design         | UI Component Library         |
| Bootstrap          | Responsive & Utility CSS     |
| Node.js + Express  | Backend API                  |
| MongoDB + Mongoose | Database                     |
| JWT + bcryptjs     | Authentication & Security    |
| Ace/Monaco Editor  | Code Editor                  |

---

## Liên kết

| Nội dung              | Link |
|-----------------------|------|
| **ER Diagram**        | [Eraser.io](...) |
| **Frontend Local**    | http://localhost:5173 |
| **Backend API Local** | http://localhost:5000 |
| **Live Demo**         | (sẽ cập nhật sau khi deploy) |

---

**Web CodeSoChill** – Học lập trình một cách “chill” nhất! 💻

---

---

Bạn có thể copy nguyên bản trên vào file `README.md`. 

Bạn muốn tôi chỉnh thêm gì không? Ví dụ:
- Thêm logo hoặc badge (Tech stack badges)
- Làm phiên bản ngắn hơn
- Thêm phần "Tính năng sắp ra mắt"
- Thay đổi giọng văn (thân thiện hơn hoặc chuyên nghiệp hơn)

Cứ nói nhé, mình chỉnh ngay!
