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

VS Code (Visual Studio Code) là trình soạn thảo code được khuyến nghị cho dự án này. Sau khi cài, bạn nên cài thêm một số extension hữu ích.

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

Cluster là nơi chứa toàn bộ dữ liệu của ứng dụng. Bạn chỉ cần tạo một lần duy nhất.

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
mongodb+srv://hwuxfuoc19it_db_user:hO7SLTmr1vngQHP1@clustercodesochill.p7ngkyb.mongodb.net/
```

User Database tự tạo
```
mongodb+srv://codesochill_user:wZffB55Q6cdAPVeB@clustercodesochill.p7ngkyb.mongodb.net/
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
MONGOOSE_DB_URL=mongodb+srv://hwuxfuoc19it_db_user:hO7SLTmr1vngQHP1@clustercodesochill.mongodb.net/codesochill?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=webcodesochill
```

> 💡 File `.env.example` trong repo là mẫu tham khảo. Hãy sao chép nó và đặt tên lại thành `.env`, sau đó điền thông tin thực vào.
> 

---

### Bước 4: Cấu hình scripts trong package.json

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

### Bước 5: Khởi động backend

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
# Chọn: React → JavaScript
cd frontend
npm install
```

---

### Bước 3: Cài đặt Bootstrap

Dự án sử dụng **Bootstrap** làm framework CSS chính để xây dựng giao diện responsive. Bootstrap cung cấp sẵn hệ thống grid, các component UI phổ biến (Button, Card, Modal, Navbar,...) và các class tiện ích, giúp tiết kiệm thời gian viết CSS thủ công.

**Cài đặt:**

```bash
npm install bootstrap
```

**Import Bootstrap vào dự án:** Mở file `src/main.jsx` (hoặc `src/index.js`) và thêm dòng import ở đầu file, trước khi render app:

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Import `bootstrap.bundle.min.js` giúp các component cần JavaScript như Dropdown, Modal, Tooltip hoạt động đúng mà không cần cài thêm Popper.js riêng (đã được bundle sẵn).

Nếu muốn tuỳ chỉnh style riêng cho từng component, tạo file `src/index.css` và viết CSS đè lên Bootstrap ở đó – đây là cách linh hoạt hơn so với sửa trực tiếp vào file của Bootstrap.

---

### Bước 4: Cài đặt các package bổ sung

```bash
# Axios để gọi API backend, React Router DOM để điều hướng giữa các trang
npm install axios react-router-dom
```

Nếu dự án sử dụng thêm Ant Design làm thư viện UI component:

```bash
npm install antd
```

---

### Bước 5: Khởi động frontend

```bash
npm run dev
```

Mở trình duyệt và truy cập [http://localhost:5173](http://localhost:5173/). Nếu thấy giao diện React hiển thị là frontend đã hoạt động.

Để kiểm tra kết nối với backend, bạn có thể thêm đoạn code sau vào một component bất kỳ:

```jsx
import axios from 'axios';

axios.get('http://localhost:5000/').then(res => console.log(res.data));
// Kết quả mong đợi in ra console: "Backend running!"
```

---

## ✅ Kiểm Tra Toàn Bộ Hệ Thống

Sau khi hoàn thành các bước trên, bạn nên có:

| Thành phần | Địa chỉ | Trạng thái mong đợi |
| --- | --- | --- |
| **Frontend** | [http://localhost:5173](http://localhost:5173/) | Hiển thị giao diện React |
| **Backend API** | [http://localhost:5000](http://localhost:5000/) | Trả về `"Backend running!"` |
| **Database** | MongoDB Atlas Dashboard | Cluster ở trạng thái `Active` |

---
