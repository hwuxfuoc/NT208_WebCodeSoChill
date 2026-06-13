# 🔄 Kiến trúc CI/CD Workflow

Dự án CodeSoChill sử dụng **GitHub Actions** làm hệ thống CI/CD chính thống (.github/workflows/ci-cd.yml). Hệ thống này được thiết kế theo quy trình chuẩn mực: **Test Parallel (Chạy test song song) -> Deploy (Triển khai)**.

Mục tiêu cốt lõi: Ngăn chặn tuyệt đối code lỗi được đưa lên môi trường Production.

---

## 1. Trigger (Kích hoạt)

Quy trình sẽ tự động kích hoạt khi:
- Push code trực tiếp lên nhánh main.
- Tạo hoặc cập nhật Pull Request (PR) hướng vào nhánh main.

> **Lưu ý**: Bước Deploy (triển khai) chỉ chạy khi merge/push vào main. Với Pull Request, hệ thống chỉ chạy Test để kiểm tra lỗi, tuyệt đối không deploy để tránh ghi đè môi trường thực tế.

---

## 2. Các Jobs trong Workflow

Workflow được chia thành 4 Jobs chính. Ba Job test đầu tiên chạy hoàn toàn **song song (parallel)** để tiết kiệm thời gian chờ. Job Deploy cuối cùng chỉ chạy khi cả 3 Job test trước đó đã **Pass 100%**.

### 🧪 Job 1: Backend Tests (	est-backend)
- **Môi trường**: Node.js 20.
- **Nhiệm vụ**: Chạy các unit/integration test bằng Jest và Supertest.
- **Đặc biệt**: Sử dụng mongodb-memory-server chạy local trên RAM để giả lập Database mà không cần kết nối tới MongoDB Atlas. Binary của in-memory DB được lưu Cache lại để tối ưu hóa thời gian chạy.

### 🤖 Job 2: AI Service Tests (	est-ai-service)
- **Môi trường**: Python 3.11.
- **Nhiệm vụ**: Cài đặt thư viện qua 
equirements.txt và chạy test tự động bằng pytest kết hợp FastAPI TestClient.
- **Biến môi trường**: Thiết lập mock URL cho Ollama model (qwen2.5-coder:7b) để giả lập logic suy luận AI.

### ⚛️ Job 3: Frontend Tests (	est-frontend)
- **Môi trường**: Node.js 20.
- **Nhiệm vụ**:
  1. Chạy unit test giao diện bằng Vitest và jsdom.
  2. Chạy Build Check (
pm run build) để đảm bảo code TypeScript không bị lỗi Type Error và đóng gói (bundle) thành công.

---

### 🚀 Job 4: Deploy All Services (deploy)
- **Điều kiện chạy**: 
  - Chỉ chạy nếu cả 3 Job trên hoàn thành không có lỗi (
eeds: [test-backend, test-ai-service, test-frontend]).
  - Chỉ chạy nếu trigger từ nhánh main.
- **Quy trình Deploy**:
  1. **Backend**: Gắn trigger HTTP POST tới Deploy Hook của Render. Render sẽ tự động kéo code mới nhất về và khởi động lại container.
  2. **AI Service**: Tương tự Backend, kích hoạt Deploy Hook của Render.
  3. **Frontend**: Cài đặt Vercel CLI toàn cục, đăng nhập qua Vercel Token và thực hiện pull/deploy trực tiếp cấu hình production lên Vercel.

---

## 3. Quản lý Secrets (Bảo mật)

Để Workflow hoạt động được, các khóa bảo mật sau được lưu trong GitHub Secrets:
- JWT_SECRET: Mock secret để chạy test backend.
- VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID: Quyền truy cập để CLI đẩy code lên Vercel.
- VITE_API_URL: Gắn cứng domain backend vào frontend lúc build tĩnh.
- RENDER_BACKEND_HOOK, RENDER_AI_HOOK: URL bí mật do Render cung cấp để kích hoạt lệnh Pull code.

👉 Để biết chi tiết cách lấy và thiết lập các Secret này, vui lòng tham khảo file [**Deploy.md**](Deploy.md).
