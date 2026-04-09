# ⚙️ Backend – Web CodeSoChill

> Tài liệu này mô tả toàn bộ kiến trúc backend của dự án **Web CodeSoChill**: cấu trúc thư mục, vai trò từng thành phần, danh sách API endpoints cần xây dựng, và cách hệ thống Judge hoạt động. Đây là tài liệu nền – đọc xong bạn sẽ biết cần làm gì trước khi bắt tay viết code.
> 

---

## 1. Tổng quan kiến trúc

Backend của CodeSoChill đóng vai trò là **trung tâm xử lý toàn bộ logic** của ứng dụng. Frontend (React) sẽ không trực tiếp chạm vào database – mọi thao tác đều phải đi qua backend thông qua các API endpoint.

```
[Frontend React - port 5173]
        │
        │  HTTP Request (Axios)
        ▼
[Backend Express - port 5000]
        │
        ├── Middleware (Auth, CORS, Validator)
        ├── Router → Controller → Service
        │
        ├── MongoDB (Mongoose)        ← Lưu dữ liệu
        └── Judge Engine (Sandbox)   ← Chạy & chấm code
```

**Luồng xử lý một request điển hình:**

1. Frontend gửi request kèm JWT token trong header.
2. Middleware `auth` xác thực token, gắn thông tin user vào `req.user`.
3. Router chuyển request đến đúng controller.
4. Controller xử lý logic, gọi Mongoose query vào MongoDB.
5. Trả về JSON response cho frontend.

---

## 2. Cấu trúc thư mục backend

```
backend/
├── server.js               # Entry point – khởi động Express server
├── .env                    # Biến môi trường (không commit lên Git)
├── package.json
│
├── config/
│   └── db.js               # Kết nối MongoDB Atlas
│
├── models/                 # Schema Mongoose – định nghĩa cấu trúc dữ liệu
│   ├── User.js
│   ├── Problem.js
│   ├── Submission.js
│   ├── TestCase.js
│   ├── Contest.js
│   ├── ContestProblem.js
│   ├── CommunityPost.js
│   ├── Comment.js
│   └── Notification.js
│
├── api/                    # Toàn bộ route + controller, tổ chức theo domain
│   ├── auth/
│   │   ├── auth.routes.js
│   │   └── auth.controller.js
│   ├── users/
│   │   ├── users.routes.js
│   │   └── users.controller.js
│   ├── problems/
│   │   ├── problems.routes.js
│   │   └── problems.controller.js
│   ├── submissions/
│   │   ├── submissions.routes.js
│   │   └── submissions.controller.js
│   ├── contests/
│   │   ├── contests.routes.js
│   │   └── contests.controller.js
│   ├── community/
│   │   ├── community.routes.js
│   │   └── community.controller.js
│   ├── notifications/
│   │   ├── notifications.routes.js
│   │   └── notifications.controller.js
│   └── settings/
│       ├── settings.routes.js
│       └── settings.controller.js
│
├── middleware/
│   ├── auth.js             # Xác thực JWT
│   └── validate.js         # Validate dữ liệu đầu vào
│
└── judge/
    └── runner.js           # Chạy code trong sandbox và trả kết quả
```

---

## 3. models/ – Định nghĩa dữ liệu

MongoDB là **schema-less** – không cần định nghĩa cấu trúc cũng lưu được. Nhưng khi dự án có 8–10 collection, không ai nhớ nổi trường nào bắt buộc, trường nào unique, ref với collection nào. **models/** giải quyết vấn đề này bằng cách ép buộc cấu trúc dữ liệu, tự validate trước khi lưu, và định nghĩa mối quan hệ giữa các collection.

---

### `User.js`

Lưu thông tin tài khoản người dùng. Nhìn vào màn hình **Profile** và **Settings → Account**, các trường cần có bao gồm: username, display name, avatar, bio, rank, experience points, ngôn ngữ lập trình ưa thích và liên kết mạng xã hội.

```jsx
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:        { type: String, required: true, unique: true, trim: true },
  hashedPassword:  { type: String, required: true },
  displayname:     { type: String, required: true },
  email:           { type: String, required: true, unique: true },
  avatarUrl:       { type: String, default: '' },
  bio:             { type: String, default: '' },
  country:         { type: String, default: '' },
  phone:           { type: String, default: '' },

  // Coding preferences (Settings → Account)
  preferredLanguage: { type: String, default: 'python' },
  experienceLevel:   { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },

  // Social links (Settings → Account)
  socialLinks: {
    github:   { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website:  { type: String, default: '' },
  },

  // Appearance settings (Settings → Appearance)
  appearance: {
    theme:       { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    editorTheme: { type: String, default: 'monokai' },
    fontFamily:  { type: String, default: 'JetBrains Mono' },
    fontSize:    { type: Number, default: 14 },
    ligatures:   { type: Boolean, default: true },
  },

  // Stats (hiển thị ở Profile)
  rank:            { type: String, default: 'Newbie' },  // Newbie → Expert → Master → Grandmaster
  contestRating:   { type: Number, default: 0 },
  experiencePoints:{ type: Number, default: 0 },
  totalSolved:     { type: Number, default: 0 },
  streak:          { type: Number, default: 0 },           // Số ngày streak hiện tại
  lastActiveDate:  { type: Date },

  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

---

### `Problem.js`

Lưu đề bài. Nhìn màn hình **Problems** và **Problem Detail**, mỗi bài cần có: tiêu đề, mô tả HTML (vì đề có format), độ khó, chủ đề (tag), tỷ lệ accepted, giới hạn thời gian & bộ nhớ, và các ví dụ input/output hiển thị trong đề.

```jsx
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  problemId:   { type: String, required: true, unique: true }, // Ví dụ: "001-A"
  title:       { type: String, required: true },
  description: { type: String, required: true }, // HTML hoặc Markdown
  difficulty:  { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  tags:        [{ type: String }], // ['Array', 'Hash Table', ...]

  // Ràng buộc kỹ thuật
  timeLimit:   { type: Number, default: 1000 },  // ms
  memoryLimit: { type: Number, default: 256 },   // MB

  // Ví dụ hiển thị trong đề (không dùng để chấm)
  examples: [{
    input:       { type: String },
    output:      { type: String },
    explanation: { type: String },
  }],

  // Constraints hiển thị (ví dụ: "2 ≤ nums.length ≤ 10⁵")
  constraints: [{ type: String }],

  // Gợi ý time complexity
  timeComplexityHint: { type: String },

  // Stats
  totalSubmissions: { type: Number, default: 0 },
  totalAccepted:    { type: Number, default: 0 },
  acceptanceRate:   { type: Number, default: 0 }, // % tự tính hoặc cập nhật khi submit

  // Video tutorial (Problem Detail → VIDEO TUTORIAL section)
  videoUrl:   { type: String, default: '' },
  videoTitle: { type: String, default: '' },

  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
```

---

### `TestCase.js`

Lưu các bộ input/output dùng để chấm bài tự động. Tách riêng khỏi Problem vì: số lượng testcase có thể rất lớn (20–100 testcase/bài), và không bao giờ trả về cho frontend (bảo mật đáp án).

```jsx
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  input:     { type: String, required: true },
  output:    { type: String, required: true },
  isSample:  { type: Boolean, default: false }, // true = testcase ví dụ (hiển thị), false = ẩn
  order:     { type: Number, default: 0 },       // Thứ tự chạy
}, { timestamps: true });

module.exports = mongoose.model('TestCase', testCaseSchema);
```

---

### `Submission.js`

Lưu mỗi lần người dùng nộp bài. Nhìn màn hình **Profile → Recent Submissions**, cần lưu: bài nào, ai nộp, ngôn ngữ, code, kết quả, thời gian chạy và bộ nhớ tiêu thụ.

```jsx
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', default: null }, // null nếu không trong contest

  language: { type: String, required: true }, // 'python', 'javascript', 'cpp', 'java'
  code:     { type: String, required: true },

  // Kết quả chấm
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compile_error', 'memory_limit_exceeded'],
    default: 'pending'
  },

  // Chi tiết kết quả từng testcase
  testResults: [{
    testCaseOrder: Number,
    status:        String,
    timeUsed:      Number, // ms
    memoryUsed:    Number, // KB
    output:        String, // output thực tế (chỉ lưu khi WA để debug)
  }],

  // Tổng hợp
  timeUsed:   { type: Number, default: 0 }, // ms – testcase chậm nhất
  memoryUsed: { type: Number, default: 0 }, // KB – testcase tốn nhất
  passedTests:{ type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
```

---

### `Contest.js`

Lưu thông tin cuộc thi. Nhìn màn hình **Contest**, cần có: tên, mô tả, thời gian bắt đầu/kết thúc, trạng thái (upcoming/live/finished), và danh sách bài trong contest.

```jsx
const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  startTime:   { type: Date, required: true },
  endTime:     { type: Date, required: true },
  duration:    { type: Number }, // phút – tự tính từ start/end hoặc nhập thủ công
  status:      { type: String, enum: ['upcoming', 'live', 'finished'], default: 'upcoming' },

  problems:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  participants:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  ratedFor:    { type: String, default: '' }, // Ví dụ: "Div. 2 only"
  isRated:     { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);
```

---

### `CommunityPost.js` & `Comment.js`

Lưu bài đăng trong trang **Community** (feed). Mỗi post có thể chứa text, code block, hoặc ảnh. Comment là reply của người dùng khác.

```jsx
// CommunityPost.js
const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:  { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  tags:        [{ type: String }], // ['Architecture', 'Technology', ...]
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likeCount:   { type: Number, default: 0 },
  commentCount:{ type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
```

```jsx
// Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId:   { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:  { type: String, required: true },
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
```

---

### `Notification.js`

Lưu thông báo cho từng user. Nhìn modal **Notifications**, có các loại thông báo: nhắc contest sắp bắt đầu, submission được accepted, có reply trong community, thách thức hàng tuần mới.

```jsx
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:    {
    type: String,
    enum: ['contest_reminder', 'submission_accepted', 'community_reply', 'weekly_challenge', 'system'],
    required: true
  },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  link:    { type: String, default: '' }, // URL dẫn đến nội dung liên quan
  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
```

---

## 4. api/ – Các nhóm API

Toàn bộ logic xử lý HTTP được tổ chức theo từng **domain** (nhóm tính năng). Mỗi domain có file routes (định nghĩa endpoint và middleware) và file controller (viết logic xử lý thực tế).

Ví dụ cách đăng ký routes trong `server.js`:

```jsx
app.use('/api/auth',          require('./api/auth/auth.routes'));
app.use('/api/users',         require('./api/users/users.routes'));
app.use('/api/problems',      require('./api/problems/problems.routes'));
app.use('/api/submissions',   require('./api/submissions/submissions.routes'));
app.use('/api/contests',      require('./api/contests/contests.routes'));
app.use('/api/community',     require('./api/community/community.routes'));
app.use('/api/notifications', require('./api/notifications/notifications.routes'));
app.use('/api/settings',      require('./api/settings/settings.routes'));
```

---

## 5. config/ – Cấu hình hệ thống

`config/` chứa các file thiết lập hệ thống, giúp cùng một codebase chạy được ở môi trường `dev`, `staging`, và `production` mà không cần sửa code, chỉ cần thay đổi biến môi trường trong `.env`.

### `db.js` – Kết nối MongoDB

```jsx
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Thoát nếu không kết nối được DB
  }
};

module.exports = connectDB;
```

---

## 6. middleware/ – Xử lý trung gian

Middleware là các hàm chạy **giữa** khi nhận request và trước khi controller xử lý. Có hai middleware cốt lõi:

### `auth.js` – Xác thực JWT

Mọi route cần đăng nhập (xem profile, nộp bài, đăng bài community...) đều phải đi qua middleware này. Nó đọc token từ header `Authorization: Bearer <token>`, verify token, và gắn thông tin user vào `req.user` để controller dùng.

```jsx
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user._id }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = auth;
```

### `validate.js` – Kiểm tra dữ liệu đầu vào

Dùng `express-validator` để validate body request trước khi chạy vào controller. Ví dụ: kiểm tra email đúng định dạng, password đủ dài, các trường bắt buộc không được bỏ trống.

---

## 7. Judge System – Hệ thống chấm bài

Đây là phần **khác biệt nhất** của CodeSoChill so với các ứng dụng web thông thường. Khi người dùng nhấn **Submit** trên màn hình Problem Detail, hệ thống phải:

1. Nhận code từ frontend.
2. Chạy code đó trong môi trường **cô lập và an toàn** (sandbox).
3. So sánh output với đáp án của từng testcase.
4. Trả về kết quả: AC / WA / TLE / RE / CE.

### Luồng xử lý Submit:

```
Frontend gửi { problemId, language, code }
        │
        ▼
POST /api/submissions
        │
        ├── Tạo Submission document với status = "pending"
        ├── Gọi judge/runner.js (chạy code)
        │       ├── Lấy tất cả TestCase của problemId
        │       ├── Với mỗi testcase: chạy code → so sánh output
        │       └── Tổng hợp kết quả
        │
        ├── Cập nhật Submission với kết quả thực tế
        ├── Nếu AC: cập nhật User.totalSolved, Problem.totalAccepted
        └── Trả về kết quả đầy đủ cho frontend
```

### Các trạng thái kết quả:

| Status | Ý nghĩa |
| --- | --- |
| `accepted` | Code đúng, vượt qua tất cả testcase |
| `wrong_answer` | Code chạy được nhưng output sai |
| `time_limit_exceeded` | Code chạy quá `timeLimit` ms |
| `runtime_error` | Code bị crash trong lúc chạy |
| `compile_error` | Code không biên dịch được |
| `memory_limit_exceeded` | Code dùng quá `memoryLimit` MB |

> ⚠️ **Bảo mật**: Code người dùng nộp lên phải được chạy trong môi trường sandbox (Docker container hoặc tương đương), **tuyệt đối không** chạy trực tiếp trên server chính. Giai đoạn đầu có thể dùng thư viện như `vm2` hoặc tích hợp Judge0 API để đơn giản hóa.
> 

---

## 8. Danh sách API Endpoints đầy đủ

### 🔐 Auth – `/api/auth`

| Method | Endpoint | Mô tả | Auth? |
| --- | --- | --- | --- |
| POST | `/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/login` | Đăng nhập, trả về JWT token | ❌ |
| GET | `/me` | Lấy thông tin user đang đăng nhập | ✅ |

---

### 👤 Users – `/api/users`

| Method | Endpoint | Mô tả | Auth? |
| --- | --- | --- | --- |
| GET | `/:username` | Xem profile công khai của user | ❌ |
| GET | `/:userId/submissions` | Lịch sử nộp bài của user (Profile → Recent Submissions) | ❌ |
| GET | `/:userId/stats` | Thống kê: totalSolved, streak, contestRating (Profile) | ❌ |
| GET | `/leaderboard` | Bảng xếp hạng toàn hệ thống (Community → Seasonal Leaderboard) | ❌ |

---

### 📚 Problems – `/api/problems`

| Method | Endpoint | Mô tả | Auth? |
| --- | --- | --- | --- |
| GET | `/` | Danh sách bài tập (có filter tag, difficulty, search, pagination) | ❌ |
| GET | `/:id` | Chi tiết một bài tập (đề bài, ví dụ, constraints) | ❌ |
| GET | `/daily` | Bài tập hàng ngày (Homepage → Today's Challenge) | ❌ |
| POST | `/` | Tạo bài tập mới (Admin only) | ✅ Admin |
| PUT | `/:id` | Chỉnh sửa bài tập (Admin only) | ✅ Admin |

---

### 📝 Submissions – `/api/submissions`

| Method | Endpoint | Mô tả | Auth? |
| --- | --- | --- | --- |
| POST | `/` | Nộp bài (Submit code) | ✅ |
| GET | `/:id` | Xem kết quả một submission cụ thể | ✅ |
| GET | `/my` | Lịch sử tất cả submission của mình | ✅ |
| POST | `/run` | Chạy thử code với testcase mẫu (Run Code – không lưu) | ✅ |

---

### 🏆 Contests – `/api/contests`

| Method | Endpoint | Mô tả | Auth? |
| --- | --- | --- | --- |
| GET | `/` | Danh sách contest (current + upcoming + recent) | ❌ |
| GET | `/:id` | Chi tiết một contest | ❌ |
| GET | `/:id/problems` | Danh sách bài trong contest | ✅ (đã đăng ký) |
| GET | `/:id/leaderboard` | Bảng xếp hạng của contest | ❌ |
| POST | `/:id/register` | Đăng ký tham gia contest | ✅ |
| POST | `/` | Tạo contest mới (Admin only) | ✅ Admin |

---

### 🌐 Community – `/api/community`

| Method | Endpoint | Mô tả | Auth? |
| --- | --- | --- | --- |
| GET | `/posts` | Danh sách bài đăng (feed) | ❌ |
| POST | `/posts` | Đăng bài mới | ✅ |
| POST | `/posts/:id/like` | Like/unlike bài đăng | ✅ |
| GET | `/posts/:id/comments` | Danh sách comment của một bài | ❌ |
| POST | `/posts/:id/comments` | Thêm comment | ✅ |
| GET | `/trending` | Trending topics (Community → Trending Pulse) | ❌ |

---

### 🔔 Notifications – `/api/notifications`

| Method | Endpoint | Mô tả | Auth? |
| --- | --- | --- | --- |
| GET | `/` | Lấy danh sách thông báo của mình | ✅ |
| PUT | `/:id/read` | Đánh dấu một thông báo đã đọc | ✅ |
| PUT | `/read-all` | Đánh dấu tất cả đã đọc | ✅ |
| DELETE | `/` | Xóa tất cả thông báo | ✅ |

---

### ⚙️ Settings – `/api/settings`

| Method | Endpoint | Mô tả | Auth? |
| --- | --- | --- | --- |
| PUT | `/account` | Cập nhật profile: username, bio, avatar, social links, coding preferences | ✅ |
| PUT | `/appearance` | Cập nhật theme, editor settings | ✅ |
| PUT | `/security/password` | Đổi mật khẩu | ✅ |
| GET | `/security/sessions` | Danh sách session đang hoạt động | ✅ |
| DELETE | `/security/sessions/:id` | Đăng xuất một session cụ thể | ✅ |

---

## 9. Tóm tắt mức độ ưu tiên

Dưới đây là thứ tự nên xây dựng backend theo từng giai đoạn, từ nền tảng đến tính năng nâng cao:

| Giai đoạn | Việc cần làm | Lý do |
| --- | --- | --- |
| **Phase 1 – Nền tảng** | `config/db.js`, `middleware/auth.js`, `models/User.js`, API Auth (register/login/me) | Mọi thứ khác đều phụ thuộc vào Auth |
| **Phase 2 – Core** | `models/Problem.js`, `models/TestCase.js`, API Problems (GET list, GET detail) | Frontend cần có danh sách bài để phát triển |
| **Phase 3 – Judge** | `models/Submission.js`, `judge/runner.js`, API Submissions (submit + run) | Tính năng cốt lõi của nền tảng |
| **Phase 4 – Social** | `models/CommunityPost.js`, `models/Comment.js`, API Community | Trang Community |
| **Phase 5 – Contest** | `models/Contest.js`, API Contests | Tính năng contest |
| **Phase 6 – UX** | `models/Notification.js`, API Notifications, API Settings | Hoàn thiện trải nghiệm người dùng |

> 💡 **Gợi ý**: Hãy bắt đầu từ Phase 1, test kỹ từng API bằng **Postman** hoặc **Thunder Client** (VS Code extension) trước khi chuyển sang Phase tiếp theo. Đừng cố build tất cả cùng một lúc.
>
