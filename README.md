# NT208_WebUrbanTech

**WebUrbanTech** là một nền tảng bất động sản hiện đại được xây dựng hoàn toàn bằng JavaScript, lấy cảm hứng từ các trang web uy tín tại Việt Nam như [**batdongsan.com.vn**](http://batdongsan.com.vn/) — nền tảng hàng đầu về mua bán, cho thuê nhà đất với cơ sở dữ liệu lớn, bộ lọc tìm kiếm chi tiết và các công cụ hỗ trợ người dùng đưa ra quyết định thông minh.

Dự án cung cấp trải nghiệm toàn diện cho cả người mua/thuê và người bán/cho thuê bất động sản, bao gồm:

- Đăng ký / đăng nhập tài khoản an toàn.
- Đăng tin bán hoặc cho thuê nhà đất với thông tin chi tiết: hình ảnh đa góc, giá cả, vị trí địa lý, diện tích, số phòng ngủ/phòng tắm, tiện ích kèm theo.
- Tìm kiếm, lọc và xem chi tiết các tin đăng từ cộng đồng người dùng.
- Lưu tin yêu thích và quản lý danh sách cá nhân.
- Kết bạn với người dùng khác và chat trực tiếp thời gian thực để trao đổi thông tin nhanh chóng.
- Tích hợp tính năng tư vấn bất động sản thông minh bằng AI, hỗ trợ người dùng nhận gợi ý về giá thị trường, xu hướng hoặc lựa chọn phù hợp.

Dự án được thiết kế với trọng tâm vào tính thân thiện, bảo mật và khả năng mở rộng, phù hợp cho việc học tập, phát triển cá nhân hoặc làm nền tảng khởi đầu cho sản phẩm thực tế.

## Tech Stack & Kiến Trúc Dự Án

Dự án sử dụng **MERN Stack** — một trong những bộ công nghệ phổ biến nhất cho ứng dụng full-stack JavaScript:

- **MongoDB** — Cơ sở dữ liệu NoSQL linh hoạt.
- **Express.js** — Framework backend tối ưu cho API.
- **React.js** — Thư viện xây dựng giao diện người dùng động.
- **Node.js** — Môi trường runtime cho server-side JavaScript.

Toàn bộ codebase được viết bằng JavaScript (và JSX cho frontend), giúp duy trì tính nhất quán, dễ bảo trì và phát triển nhanh.

**Hướng Dẫn Cài Đặt & Chạy Local xem chi tiết tại: [Setup](https://github.com/hwuxfuoc/NT208_WebUrbanTech/blob/main/Setup.md)**

### Frontend

Frontend chịu trách nhiệm xây dựng giao diện người dùng hiện đại, responsive và tương tác mượt mà. Các trang chính bao gồm: Trang chủ, Đăng tin bất động sản, Danh sách tin đăng (listings), Trang chi tiết bất động sản, Profile cá nhân, Chat, Đăng ký/Đăng nhập.

**Công nghệ sử dụng**:

- React (với JSX) — Xây dựng component-based UI.
- Vite — Công cụ build và dev server cực nhanh.
- Bootstrap — Styling utility-first, giúp thiết kế nhanh và tùy chỉnh dễ dàng.
- Material UI (MUI) — Thư viện component đẹp, sẵn dùng cho form, button, dialog, v.v.
- Axios — Xử lý các yêu cầu HTTP đến backend.
- React Router DOM — Quản lý routing và navigation.

**Port local**: 5173 (mặc định của Vite).

Chi tiết về cấu trúc thư mục Frontend và thứ tự code xem chi tiết [tại đây](https://github.com/hwuxfuoc/NT208_WebUrbanTech/blob/main/Frontend.md)

### Backend

Backend xử lý toàn bộ logic nghiệp vụ, API, xác thực và kết nối cơ sở dữ liệu. Hỗ trợ các endpoint CRUD cho bất động sản, người dùng, tin nhắn chat; quản lý authentication và authorization.

**Công nghệ sử dụng**:

- Node.js — Runtime chính.
- Express.js — Xây dựng server và định tuyến API.
- Mongoose — ODM cho MongoDB, giúp định nghĩa schema và query dễ dàng.
- JWT (JSON Web Tokens) — Xác thực stateless an toàn.
- bcryptjs — Mã hóa mật khẩu người dùng.
- cors — Cho phép cross-origin requests từ frontend.
- dotenv — Quản lý biến môi trường (ví dụ: database URI, JWT secret).

**Port local**: 5000.

Chi tiết về cấu trúc thư mục Backend, các API và giải thích xem chi tiết [tại đây](https://github.com/hwuxfuoc/NT208_WebUrbanTech/blob/main/Backend.md)

### Database

Dữ liệu được lưu trữ trên **MongoDB Atlas** (free tier M0) — dịch vụ cloud NoSQL của MongoDB, không cần quản lý server thủ công.

Các collection chính theo thiết kế schema (dựa trên ERD):

- **Users**: Thông tin tài khoản, profile, mật khẩu đã hash.
- **Properties**: Chi tiết bất động sản (giá, vị trí, hình ảnh, mô tả, loại hình, v.v.).
- **Messages** & **Conversations**: Lưu trữ tin nhắn và cuộc trò chuyện chat.
- **Favorites**: Danh sách bất động sản yêu thích của từng user.

Thiết kế schema đảm bảo tính linh hoạt, hỗ trợ mở rộng tính năng sau này (ví dụ: thêm review, rating, báo cáo tin đăng).

**Connection String**: `mongodb+srv://hwuxfuoc19it_db_user:e76NQ2jZaEZEzvXN@clusterurbantech.97zwxie.mongodb.net?retryWrites=true&w=majority`

## Deployment

Dự án được thiết kế để deploy miễn phí hoặc chi phí thấp:

- **Frontend** (React/Vite static build): Deploy dễ dàng trên **Vercel** hoặc **Netlify** — hai nền tảng hàng đầu cho ứng dụng frontend, hỗ trợ auto-deploy từ GitHub, custom domain miễn phí và CDN toàn cầu.
- **Backend** (Node/Express): Deploy trên [**Render.com**](http://render.com/) — hỗ trợ free tier cho web services, tự động build và restart, phù hợp cho API server.
- **Database**: Tiếp tục sử dụng **MongoDB Atlas** free tier.

Sau khi deploy, cập nhật biến môi trường (ví dụ: API base URL) trong frontend để kết nối với backend production.

## Cấu trúc thư mục chính:

```
weburbantech/
├── backend/
├── frontend/
└── README.md
```

## Các Liên Kết

| Nội dung | Link |
| --- | --- |
| **Database ER Diagram** | [Eraser.io Workspace](https://app.eraser.io/workspace/MibBxluYc33hORCIUomJ?origin=share) |
| **MongoDB Atlas** | [MongoDB](https://cloud.mongodb.com/v2/695fce2ae63f673f55aaf2d2#/overview) |
| **Frontend (Local)** | [http://localhost:5173](http://localhost:5173/) |
| **Backend API (Local)** | [http://localhost:5000](http://localhost:5000/) |
| **Deploy Live** | (Render) |
