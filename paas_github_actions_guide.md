# Hướng Dẫn Chi Tiết: Cấu Hình GitHub Actions Để Deploy Lên Vercel & Render (PaaS)

Mặc dù Vercel và Render hỗ trợ tự động deploy trực tiếp từ GitHub, việc cấu hình qua **GitHub Actions** giúp bạn kiểm soát hoàn toàn quy trình CI/CD:
*   Đảm bảo toàn bộ test case phải pass trước khi deploy.
*   Kiểm soát thứ tự deploy (ví dụ: Deploy Backend thành công mới bắt đầu deploy Frontend).
*   Chỉ sử dụng một nguồn quản lý CI/CD duy nhất (GitHub Actions).

Dưới đây là các bước thao tác chi tiết và file `.github/workflows/deploy-paas.yml`.

---

## 🔑 BƯỚC 1: Lấy Thông Tin Cần Thiết Từ Vercel & Render

### 1. Phía Vercel (Cho Frontend)
Để GitHub Actions thay mặt bạn đẩy code lên Vercel, bạn cần 3 thông tin:

*   **Vercel Token (Mã bảo mật cá nhân):**
    1. Truy cập [Vercel Account Tokens](https://vercel.com/account/tokens).
    2. Bấm **Create**, đặt tên là `github-actions-token`, chọn scope thích hợp rồi copy Token này.
*   **Vercel Org ID & Project ID:**
    1. Cài đặt Vercel CLI trên máy của bạn (nếu chưa có): `npm install -g vercel`.
    2. Mở Terminal tại thư mục `frontend` của dự án và gõ: `vercel link`.
    3. Đăng nhập và liên kết với project Vercel của bạn.
    4. Sau khi liên kết thành công, một thư mục ẩn `.vercel` sẽ được tạo ra chứa file `project.json`. Mở file đó ra để lấy `orgId` và `projectId`.

### 2. Phía Render (Cho Backend & AI Service)
Render cung cấp một giải pháp cực kỳ đơn giản gọi là **Deploy Hook** (Đường dẫn kích hoạt deploy). Mỗi khi có một request gọi đến link này, Render sẽ tự kéo code mới về deploy.

1. Truy cập trang quản trị [Render Dashboard](https://dashboard.render.com/).
2. Chọn Web Service của **Backend (Node.js)** -> Vào mục **Settings**.
3. Cuộn xuống phần **Deploy Hook**, copy đường dẫn URL đó (Dạng: `https://api.render.com/deploy/srv-xxxxxxxxxxxx`).
4. Làm tương tự với Web Service của **AI Service (Python)** để lấy link Deploy Hook thứ hai.

---

## 🔒 BƯỚC 2: Cấu Hình Secrets Trên GitHub

Để bảo mật thông tin, bạn tuyệt đối không được viết trực tiếp Token hay URL vào code. Hãy lưu chúng vào GitHub Secrets:

1. Truy cập vào Repository của bạn trên GitHub.
2. Chọn **Settings** -> **Secrets and variables** -> **Actions** -> Chọn **New repository secret**.
3. Thêm lần lượt 5 Secret sau:
   *   `VERCEL_TOKEN`: Dán Token lấy từ Vercel.
   *   `VERCEL_ORG_ID`: Dán `orgId` trong file `.vercel/project.json`.
   *   `VERCEL_PROJECT_ID`: Dán `projectId` trong file `.vercel/project.json`.
   *   `RENDER_BACKEND_HOOK`: Dán link Deploy Hook của Backend Node.js.
   *   `RENDER_AI_HOOK`: Dán link Deploy Hook của AI Service Python.

---

## 📝 BƯỚC 3: Tạo File Cấu Hình GitHub Actions `.yml`

Tạo file `.github/workflows/deploy-paas.yml` ở root dự án để định nghĩa quy trình tự động hóa. 

Quy trình hoạt động:
1. Khi push code lên nhánh `main`, Actions sẽ kích hoạt.
2. Chạy job kiểm tra chất lượng (Linter/Test nếu có).
3. Gửi tín hiệu deploy đồng thời đến Render để cập nhật Backend và AI Service.
4. Deploy Frontend lên Vercel bằng công cụ CLI chính thức của Vercel.

Dưới đây là nội dung file `.yml`:

```yaml
name: CI/CD Deploy to PaaS (Vercel & Render)

on:
  push:
    branches:
      - main # Kích hoạt tự động khi push code hoặc merge PR vào nhánh main

jobs:
  # Job 1: Build & Test (Đảm bảo code chạy ổn định trước khi deploy)
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: './frontend/package-lock.json'

      - name: Install Frontend Dependencies
        run: |
          cd frontend
          npm install

      - name: Build Frontend Test
        run: |
          cd frontend
          npm run build # Kiểm tra xem code Frontend có lỗi build/type gì không

  # Job 2: Triển khai các dịch vụ
  deploy:
    needs: build-and-test # Chỉ chạy deploy khi Job 1 hoàn thành xuất sắc
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      # 1. Kích hoạt deploy AI Service trên Render
      - name: Trigger Render AI Service Deploy
        run: |
          echo "Sending deploy signal to Render for AI Service..."
          curl -f -s "${{ secrets.RENDER_AI_HOOK }}" > /dev/null
          echo "AI Service deployment triggered successfully!"

      # 2. Kích hoạt deploy Backend Node.js trên Render
      - name: Trigger Render Backend Deploy
        run: |
          echo "Sending deploy signal to Render for Backend..."
          curl -f -s "${{ secrets.RENDER_BACKEND_HOOK }}" > /dev/null
          echo "Backend deployment triggered successfully!"

      # 3. Deploy Frontend lên Vercel
      - name: Deploy Frontend to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          # Chỉ định deploy thư mục frontend
          working-directory: ./frontend
          # Đánh dấu đây là bản Production Deploy chính thức
          vercel-args: '--prod'
```

---

## 🚀 BƯỚC 4: Tắt Tính Năng Auto-Deploy Mặc Định (Quan trọng)

Để tránh việc cả Vercel/Render lẫn GitHub Actions cùng tranh nhau build khi bạn push code (gây lãng phí tài nguyên và khó quản lý lỗi):

1. **Trên Vercel:** 
   *   Vào Vercel Project -> **Settings** -> **Git**.
   *   Tìm mục **Ignored Build Step**.
   *   Chọn lệnh custom hoặc tắt tính năng tự động build khi có commit mới từ nhánh chính (Bạn có thể điền lệnh `exit 0` để Vercel bỏ qua việc tự động build từ Git).
2. **Trên Render:**
   *   Vào Dashboard Render -> Chọn Web Service của bạn -> **Settings**.
   *   Tìm mục **Auto-Deploy** -> Chuyển từ **Yes** thành **No**.

---

## 📈 Cách Theo Dõi Trạng Thái
Mỗi khi bạn push code mới lên GitHub:
1. Vào tab **Actions** trên GitHub repository của bạn.
2. Bạn sẽ thấy một workflow đang chạy. Click vào đó để xem logs chi tiết từng bước.
3. Nếu màu xanh ✅ hiện lên, nghĩa là mọi dịch vụ đã được kích hoạt deploy thành công!
