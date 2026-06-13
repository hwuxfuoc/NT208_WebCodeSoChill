# 🛠 Hướng dẫn Cài đặt & Chạy Local – Web CodeSoChill

---

## 1. Chuẩn Bị Môi Trường Chung

Đây là những công cụ bắt buộc cần có trước khi làm bất cứ điều gì khác. Cả frontend lẫn backend đều phụ thuộc vào các phần mềm này.

### Bước 1: Cài đặt Node.js

Node.js là nền tảng để chạy JavaScript ở phía server và là công cụ quản lý package (`npm`) cho cả frontend lẫn backend.

1. Truy cập trang chính thức: [https://nodejs.org](https://nodejs.org/)
2. Tải phiên bản **LTS** (Long Term Support) – phiên bản ổn định, được khuyến nghị cho môi trường phát triển.
3. Cài đặt như phần mềm bình thường (Next → Next → Finish).
4. Kiểm tra cài đặt thành công bằng cách mở terminal và chạy:

```bash
node -v
npm -v
```

Nếu thấy kết quả dạng `v20.10.0` và `10.2.3` (phiên bản có thể khác nhau) là đã cài thành công.

> ⚠️ Nếu terminal báo lỗi "command not found", hãy thử **khởi động lại máy** rồi chạy lại lệnh trên.
> 

---

### Bước 2: Cài đặt Git

Git là công cụ quản lý phiên bản, dùng để clone source code từ GitHub về máy và theo dõi lịch sử thay đổi của dự án.

1. Truy cập: https://git-scm.com/downloads
2. Tải phiên bản phù hợp với hệ điều hành và cài đặt (Next → Next → Finish).
3. Kiểm tra cài đặt:

```bash
git --version
```

---

### Bước 3: Cài đặt VS Code

VS Code (Visual Studio Code) là trình soạn thảo code được khuyến nghị cho dự án này. Sau khi cài, cần cài thêm một số extension hữu ích.

1. Truy cập: [https://code.visualstudio.com](https://code.visualstudio.com/)
2. Tải và cài đặt.
3. Mở VS Code, vào phần **Extensions** (Ctrl+Shift+X) và cài các extension sau:
    - **ESLint** – Phát hiện lỗi cú pháp JavaScript/React trong lúc code.
    - **Prettier** – Tự động format code theo chuẩn, giúp code nhất quán trong cả nhóm.
    - **MongoDB for VS Code** – Xem và quản lý database MongoDB trực tiếp trong VS Code.

---

## 2. Chuẩn Bị MongoDB Atlas (Database)

Dự án sử dụng **MongoDB Atlas** – dịch vụ database trên cloud của MongoDB, miễn phí ở tier cơ bản và không cần cài đặt gì thêm trên máy.

### Bước 1: Đăng ký tài khoản MongoDB Atlas

1. Truy cập: https://www.mongodb.com/atlas/database
2. Click **"Sign Up"** và đăng ký bằng email hoặc tài khoản Google.

---

### Bước 2: Tạo Cluster (Database Server)

Cluster là nơi chứa toàn bộ dữ liệu của ứng dụng. chỉ cần tạo một lần duy nhất.

1. Sau khi đăng nhập, click **"Build a Database"** hoặc **"Create"** ở dashboard.
2. Chọn gói **Shared (M0)** – hoàn toàn miễn phí, đủ dùng cho mục đích học tập và phát triển.
3. Cấu hình cluster:
    - **Provider**: AWS (mặc định)
    - **Region**: `Asia Pacific - Singapore (ap-southeast-1)` – chọn vùng gần Việt Nam để tốc độ kết nối nhanh hơn.
    - **Cluster Name**: `ClusterCodeSoChill` (hoặc tên tuỳ ý)
4. Click **"Create Cluster"** và chờ khoảng 2–5 phút để hệ thống khởi tạo.

---

### Bước 3: Tạo User Database

Database User là tài khoản để ứng dụng (backend) kết nối và thực hiện các thao tác đọc/ghi dữ liệu trên MongoDB. Tài khoản này khác với tài khoản đăng nhập MongoDB Atlas.

> Khi tạo Cluster, MongoDB Atlas có thể tự động đề xuất một Database User (username & password). Có thể sử dụng tài khoản này hoặc tạo mới.
> 
1. Trong menu bên trái, vào **"Database Access"**.
2. Click **"Add New Database User"**.
3. Điền thông tin:
    - **Username**: `codesochill_user` (hoặc tên tuỳ ý)
    - **Password**: Đặt mật khẩu mạnh và **ghi lại** vì sẽ cần dùng trong bước sau.
    - **Role**: `Atlas Admin` – cấp toàn quyền, phù hợp cho môi trường phát triển.
4. Click **"Add User"**.

---

### Bước 4: Cấu hình Network Access

Theo mặc định, Atlas chặn tất cả kết nối từ bên ngoài. Cần mở quyền truy cập để backend có thể kết nối vào database.

1. Trong menu bên trái, vào **"Network Access"**.
2. Click **"Add IP Address"**.
3. Chọn **"Allow Access from Anywhere"** (IP: `0.0.0.0/0`) → Confirm.

> ⚠️ Cài đặt này phù hợp cho giai đoạn phát triển. Khi deploy lên production, nên giới hạn lại chỉ cho phép IP của server.
> 

---

### Bước 5: Lấy Connection String

Connection String là chuỗi ký tự chứa đủ thông tin để Node.js kết nối vào MongoDB Atlas.

1. Vào tab **"Database"** → Click **"Connect"** cạnh tên cluster.
2. Chọn **"Drivers"** (hoặc **"Connect your application"**).
3. Chọn **Driver: Node.js**, **Version: 4.0 or later**.
4. Sao chép Connection String hiển thị, có dạng:

User Database mặc định

```
mongodb+srv://hwuxfuoc19it_db_user:<password>@clustercodesochill.p7ngkyb.mongodb.net/
```

User Database tự tạo

```
mongodb+srv://codesochill_user:<password>@clustercodesochill.p7ngkyb.mongodb.net/
```

---

### Bước 6: Kiểm tra kết nối

Nếu muốn xác nhận kết nối hoạt động trước khi bắt đầu code, có thể dùng **MongoDB Compass** – ứng dụng GUI để xem và quản lý database.

1. Tải Compass tại: https://www.mongodb.com/products/tools/compass
2. Mở Compass, paste Connection String vào ô nhập liệu → Click **"Connect"**.
3. Nếu thấy danh sách database hiện ra (bao gồm `admin`) là kết nối thành công.
4. Tạo database mới cho dự án: Click **"Create Database"** → Đặt tên `clustercodesochill_user`.

---

## 3. Cài Đặt & Chạy Backend

Backend là phần xử lý logic phía server: nhận request từ frontend, xử lý dữ liệu, kết nối database và trả về response.

### Bước 1: Clone repository & di chuyển vào thư mục backend

```bash
git clone https://github.com/hwuxfuoc/NT208_WebCodeSoChill.git
cd NT208_WebCodeSoChill/backend
```

---

### Bước 2: Cài đặt các package cần thiết

Chạy lệnh sau để cài tất cả dependencies được khai báo trong `package.json`:

```bash
npm install
```

Nếu đang khởi tạo backend từ đầu (chưa có `package.json`), chạy lần lượt:

```bash
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install nodemon --save-dev
```

Vai trò từng package:

| Package | Vai trò |
| --- | --- |
| `express` | Framework để xây dựng server và định nghĩa các API route. |
| `mongoose` | Kết nối và thao tác với MongoDB thông qua schema có cấu trúc. |
| `dotenv` | Đọc các biến môi trường từ file `.env`, giúp bảo mật thông tin nhạy cảm. |
| `cors` | Cho phép frontend (chạy ở port khác) gửi request đến backend. |
| `bcryptjs` | Mã hóa mật khẩu người dùng trước khi lưu vào database. |
| `jsonwebtoken` | Tạo và xác thực JWT token để xác thực người dùng. |
| `nodemon` | Tự động khởi động lại server khi phát hiện thay đổi trong code (chỉ dùng khi phát triển). |

---

### Bước 3: Tạo file cấu hình môi trường

Tạo file `.env` trong thư mục `backend/` với nội dung sau. File này chứa các thông tin nhạy cảm và **không được commit lên GitHub**.

```
MONGOOSE_DB_URL=mongodb+srv://hwuxfuoc19it_db_user:<password>@clustercodesochill.mongodb.net/codesochill?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=<optional_secret_key>
```

> 💡 File `.env.example` trong repo là mẫu tham khảo. Hãy sao chép nó và đặt tên lại thành `.env`, sau đó điền thông tin thực vào.
> 

---

### Bước 4: Tạo git ignore

Tạo file `.gitignore`trong thư mục root với nội dung sau. File này nhằm chặn các file chứa thông tin nhạy cảm và ngăn **không được commit lên GitHub**.

```
# node
backend/node_modules/
frontend/node_modules/

# env
backend/.env
backend/.env.*

# build
dist/
build/

# logs
npm-debug.log*
```

---

### Bước 5: Tạo file server

Tạo file `server.js` trong thư mục `backend/`. Đây là file chính để khởi chạy server.

Nội dung cơ bản:

```jsx
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### Bước 6: Cấu hình scripts trong package.json

Mở file `package.json` và thêm vào phần `"scripts"`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

- `npm start` – Chạy server bình thường (dùng cho production).
- `npm run dev` – Chạy với nodemon, tự reload khi có thay đổi (dùng khi phát triển).

---

### Bước 7: Khởi động backend

```bash
npm run dev
```

Mở trình duyệt và truy cập [http://localhost:5000](http://localhost:5000/). Nếu thấy dòng chữ `"Backend running!"` hiển thị là backend đã hoạt động thành công.

Nếu có lỗi kết nối database, kiểm tra lại `MONGOOSE_DB_URL` trong file `.env` đã đúng chưa.

---

## 4. Cài Đặt & Chạy Frontend

Frontend là phần giao diện người dùng: nơi người dùng nhìn thấy và tương tác với ứng dụng. Frontend giao tiếp với backend thông qua các API call.

### Bước 1: Di chuyển vào thư mục frontend

Mở terminal mới (giữ terminal backend vẫn chạy), sau đó:

```bash
cd NT208_WebCodeSoChill/frontend
```

---

### Bước 2: Cài đặt dependencies

```bash
npm install
```

Nếu đang tạo project mới từ đầu với Vite:

```bash
# Tạo project React + Vite mới
npm create vite@latest frontend
# Chọn: React → TypeScript
cd frontend
npm install
```

---

### Bước 3: Cài đặt Tailwind CSS

Dự án sử dụng **Tailwind CSS** làm framework CSS chính để xây dựng giao diện.

**Cài đặt:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Cấu hình Tailwind:** Mở file `tailwind.config.ts` và thiết lập đường dẫn tới các file template. Thêm directives của Tailwind vào `src/index.css`.

---

### Bước 4: Cài đặt các package bổ sung

```bash
# Axios để gọi API backend, React Router DOM để điều hướng giữa các trang
npm install axios react-router-dom
```



---

### Bước 5: Khởi động frontend

```bash
npm run dev
```

Mở trình duyệt và truy cập [http://localhost:5173](http://localhost:5173/). Nếu thấy giao diện React hiển thị là frontend đã hoạt động.

Để kiểm tra kết nối với backend, có thể thêm đoạn code sau vào một component bất kỳ:

```jsx
import axios from 'axios';

axios.get('<http://localhost:5000/>').then(res => console.log(res.data));
// Kết quả mong đợi in ra console: "Backend running!"
```

---

## 5. Cài Đặt & Chạy AI Service

AI Service cung cấp tính năng trợ lý ảo hỗ trợ giải thích code và giải thuật, sử dụng FastAPI, Ollama và ChromaDB.

### Bước 1: Chuẩn bị môi trường Python

Di chuyển vào thư mục `ai-service`:
```bash
cd NT208_WebCodeSoChill/ai-service
```

Tạo và kích hoạt môi trường ảo (Virtual Environment):
```bash
python -m venv venv
# Kích hoạt trên Windows:
venv\Scripts\activate
# Kích hoạt trên Mac/Linux:
source venv/bin/activate
```

### Bước 2: Cài đặt thư viện

```bash
pip install -r requirements.txt
```

### Bước 3: Cài đặt Ollama

1. Tải và cài đặt Ollama từ [https://ollama.com](https://ollama.com).
2. Tải model LLM cục bộ (ví dụ: `llama3` hoặc `mistral`):
```bash
ollama run llama3
```

### Bước 4: Khởi động AI Service

```bash
uvicorn rag:app --reload --port 8000
```
API sẽ chạy tại `http://localhost:8000`.

---

## 6. Khởi Tạo Dữ Liệu (Seed Testcases)

Hệ thống Judge cần các testcase để chấm bài. Thay vì tự tạo dữ liệu thủ công, hệ thống sử dụng script cào dữ liệu từ LeetCode.

### Bước 1: Di chuyển vào thư mục testcase

Mở terminal mới:
```bash
cd NT208_WebCodeSoChill/backend/seed/testcase
```

### Bước 2: Chạy script lấy dữ liệu

Đảm bảo đã cài đặt Python và các thư viện cần thiết (`requests`, `beautifulsoup4` nếu có).
```bash
python get_testcases.py
```

Script này sẽ:
1. Gửi GraphQL requests tới LeetCode.
2. Tải về thông tin bài tập (metadata) và các testcase.
3. Chuyển đổi và lưu dưới dạng file `.json` trong `data/json/` để Judge Engine sử dụng khi chạy nội bộ qua `child_process`.

---

## ✅ Kiểm Tra Toàn Bộ Hệ Thống

Sau khi hoàn thành các bước trên, cần có:

| Thành phần | Địa chỉ | Trạng thái mong đợi |
| --- | --- | --- |
| **Frontend** | [http://localhost:5173](http://localhost:5173/) | Hiển thị giao diện React |
| **Backend API** | [http://localhost:5000](http://localhost:5000/) | Trả về `"Backend running!"` |
| **AI Service** | [http://localhost:8000](http://localhost:8000/) | Trả về cấu trúc API FastAPI |
| **Database** | MongoDB Atlas Dashboard | Cluster ở trạng thái `Active` |

---
