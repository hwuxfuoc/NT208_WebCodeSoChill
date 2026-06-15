# 🧪 Testcases & Cơ chế chấm điểm (Judge Engine)

Trong hệ thống **Web CodeSoChill**, việc chấm điểm bài tập (Judge Engine) không sử dụng môi trường sandbox cục bộ truyền thống (ví dụ Docker container). Thay vào đó, nền tảng sử dụng script để tự động lấy trực tiếp các testcase chuẩn từ **LeetCode** để đánh giá code của người dùng. Cách tiếp cận này giúp giảm tải việc phải thiết lập môi trường sandbox phức tạp, đồng thời đảm bảo testcase luôn chuẩn xác và bám sát các bài tập thực tế.

## ⚙️ Cơ chế hoạt động

Để đồng bộ dữ liệu testcase từ LeetCode về hệ thống, một kịch bản (script) bằng Python được cung cấp tại: `backend/seed/testcase/get_testcases.py`.

Quy trình hoạt động của script diễn ra theo các bước sau:

1. **Mapping dữ liệu**: Script đọc danh sách bài tập từ file `problem_data.csv` để lấy ra mã bài (number), tiêu đề và `titleSlug` (đường dẫn rút gọn trên LeetCode) tương ứng.
2. **Fetch API LeetCode**: Gửi yêu cầu truy vấn GraphQL trực tiếp đến API của LeetCode (`https://leetcode.com/graphql`) để kéo dữ liệu về bài toán (bao gồm định dạng hàm trong `metaData` và các testcase mẫu `exampleTestcases`).
3. **Phân tích (Parsing)**: Dựa trên metadata thu được, script trích xuất danh sách các tham số đầu vào (input) và kiểu dữ liệu tương ứng để chuyển đổi chuỗi văn bản thành các giá trị cấu trúc.
4. **Kết hợp Output (Kết quả mong muốn)**: Đọc các file mô tả bài tập JSON ở thư mục cục bộ (nếu có) để lấy các Expected Output cho từng testcase tương ứng.
5. **Sinh file dữ liệu**: Script tự động tạo ra hai loại file và lưu trữ trong thư mục `data/`:
   - **File `.json`** (`data/json/`): Chứa định dạng chuẩn của các testcase bao gồm Input và Expected Output. Dữ liệu này dùng để lưu vào database (collection `testcases`) và phục vụ việc chấm điểm sau này.
   - **File `.py`** (`data/python/`): Sinh ra một class `Solution` mẫu (stub solution) với các khối lệnh `if` kiểm tra input và trả về output dự kiến, đóng vai trò như một bài giải tham khảo cơ bản.

## 🚀 Cách lấy Testcase tự động (Sử dụng Script)

Để sử dụng công cụ lấy testcase, hãy mở terminal và chạy script `get_testcases.py` kèm theo số thứ tự của bài tập (hoặc một khoảng bài tập). Yêu cầu đã cài đặt Python và các thư viện cần thiết.

### 1. Lấy testcase của một bài cụ thể
Ví dụ lấy bài số 1:
```bash
cd backend/seed/testcase
python get_testcases.py 1
```

### 2. Lấy testcase của nhiều bài cùng lúc
Có thể truyền nhiều mã bài cách nhau bởi dấu cách:
```bash
python get_testcases.py 1 2 3
```

### 3. Lấy testcase theo một khoảng (Range)
Sử dụng dấu gạch ngang (`-`) để tải hàng loạt testcase trong một khoảng chỉ định:
```bash
python get_testcases.py 21-100
```

> **Kết quả**: Sau khi chạy lệnh thành công, dữ liệu testcase sẽ được sinh ra và lưu trữ tự động tại thư mục `backend/seed/testcase/data/json` và các file solution mẫu sẽ nằm tại `backend/seed/testcase/data/python`. Từ các file JSON này, hệ thống sẽ chèn (seed) vào database MongoDB để sử dụng cho chức năng nộp bài tự động.
