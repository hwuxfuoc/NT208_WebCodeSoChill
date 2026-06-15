# 💻 Frontend – Web CodeSoChill

> Tài liệu này mô tả toàn bộ kiến trúc frontend của dự án **Web CodeSoChill**, bao gồm cấu trúc thư mục, luồng dữ liệu, vai trò của từng thành phần (components, hooks, services) và thứ tự triển khai. Đọc xong tài liệu này, lập trình viên sẽ nắm vững cách tổ chức code và triển khai tính năng mới trên nền tảng.

---

## 1. Tổng quan kiến trúc

Frontend của CodeSoChill được xây dựng theo mô hình Single Page Application (SPA), sử dụng **Vite + React + TypeScript**. Dữ liệu được fetch từ Backend API và AI Service, sau đó được quản lý trạng thái bằng Context API và custom hooks.

`	ext
[Người dùng tương tác]
        │
        ▼
[React Components (pages, modals)]
        │
        ├── Sử dụng UI Components (components/ui, common)
        ├── Tiêu thụ State (context, hooks)
        │
        ▼
[Services / API Calls (axios)]
        │
        ▼
[Backend / AI Service]
`

**Luồng dữ liệu cơ bản:**
1. Component gọi custom hook (ví dụ: useProblems()).
2. Hook sử dụng service (problemService.ts) để fetch dữ liệu qua axios.
3. Service gọi API từ Backend.
4. Dữ liệu trả về được lưu vào state cục bộ hoặc Context, UI tự động cập nhật.

---

## 2. Cấu trúc thư mục dự án

`
├── frontend/
│   ├── .env.local
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.tsbuildinfo
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── routes.tsx
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── Background.png
│   │   │   │   ├── logo.jpg
│   │   ├── components/
│   │   │   ├── ModalPortal.tsx
│   │   │   ├── animations/
│   │   │   │   ├── PageTransition.tsx
│   │   │   ├── ChatPanel/
│   │   │   │   ├── ChatPanel.tsx
│   │   │   ├── common/
│   │   │   │   ├── ActivityHeatmap.tsx
│   │   │   │   ├── ContestCard.tsx
│   │   │   │   ├── ContestRatingChart.tsx
│   │   │   │   ├── ...
│   │   │   ├── layout/
│   │   │   │   ├── FullscreenLayout.tsx
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── MobileHeader.tsx
│   │   │   │   ├── ...
│   │   │   ├── ui/
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── ...
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ModalContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCodeEditor.ts
│   │   │   ├── useCommunityFeed.ts
│   │   │   ├── useContests.ts
│   │   │   ├── useCountdown.ts
│   │   │   ├── useDailyProblems.ts
│   │   │   ├── useModal.ts
│   │   │   ├── useProblemDetail.ts
│   │   │   ├── useProblems.ts
│   │   │   ├── useProfile.ts
│   │   ├── modals/
│   │   │   ├── MessagesModal/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   ├── index.tsx
│   │   │   ├── NotificationsModal/
│   │   │   │   ├── index.tsx
│   │   │   ├── SettingsModal/
│   │   │   │   ├── AvatarCropModal.tsx
│   │   │   │   ├── index.tsx
│   │   ├── pages/
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── AdminProblemsPage/
│   │   │   │   ├── index.tsx
│   │   │   ├── AdminUsersPage/
│   │   │   │   ├── index.tsx
│   │   │   ├── CommunityPage/
│   │   │   │   ├── CommentModal.tsx
│   │   │   │   ├── CommunityHeader.tsx
│   │   │   │   ├── CreatePostBox.tsx
│   │   │   │   ├── FullLeaderboardModal.tsx
│   │   │   │   ├── ImageModal.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── PostFeed.tsx
│   │   │   │   ├── SeasonalLeaderboard.tsx
│   │   │   │   ├── TrendingPostModal.tsx
│   │   │   │   ├── TrendingPulse.tsx
│   │   │   ├── ContestPage/
│   │   │   │   ├── ContestArchiveModal.tsx
│   │   │   │   ├── ContestRankingsModal.tsx
│   │   │   │   ├── ContestRegisterModal.tsx
│   │   │   │   ├── CurrentContest.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── RecentContestsGrid.tsx
│   │   │   │   ├── UpcomingContestsTable.tsx
│   │   │   │   ├── ViewProblemsModal.tsx
│   │   │   ├── HomePage/
│   │   │   │   ├── BannerPromo.tsx
│   │   │   │   ├── ContestStatisticChart.tsx
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── DailyProblemsChart.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── StatRow.tsx
│   │   │   ├── ProblemDetailPage/
│   │   │   │   ├── CodeEditor.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── ProblemDescription.tsx
│   │   │   ├── ProblemsPage/
│   │   │   │   ├── CalendarStreak.tsx
│   │   │   │   ├── DailyRandomChallenge.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── ProblemSearchBar.tsx
│   │   │   │   ├── ProblemsHeader.tsx
│   │   │   │   ├── ProblemTable.tsx
│   │   │   │   ├── TodayChallengePanel.tsx
│   │   │   │   ├── TopicFilterBar.tsx
│   │   │   ├── ProfilePage/
│   │   │   │   ├── ActivityHeatmap.tsx
│   │   │   │   ├── ContactSocialCard.tsx
│   │   │   │   ├── ContestRating.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   ├── RecentBadges.tsx
│   │   │   │   ├── RecentSubmissions.tsx
│   │   │   │   ├── SolvedProblems.tsx
│   │   │   │   ├── UserProfileCard.tsx
│   │   │   ├── SettingsPage/
│   │   │   │   ├── AccountPage/
│   │   │   │   │   ├── index.tsx
│   │   │   │   ├── AppearancePage/
│   │   │   │   │   ├── index.tsx
│   │   │   │   ├── IntegrationsPage/
│   │   │   │   │   ├── index.tsx
│   │   │   │   ├── SecurityPage/
│   │   │   │   │   ├── index.tsx
│   │   ├── services/
│   │   │   ├── aiService.ts
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── communityService.ts
│   │   │   ├── contestService.ts
│   │   │   ├── messageService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── problemService.ts
│   │   │   ├── profileService.ts
│   │   │   ├── settingService.ts
│   │   │   ├── statService.ts
│   │   │   ├── submissionService.ts
│   │   │   ├── uploadService.ts
│   │   ├── tests/
│   │   │   ├── authService.test.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── community.ts
│   │   │   ├── contest.ts
│   │   │   ├── problem.ts
│   │   │   ├── profile.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── format.ts
│   │   │   ├── helpers.ts
│   │   │   ├── mockData.ts
`

---

## 3. components/ – Các thành phần tái sử dụng

Việc chia nhỏ component giúp dễ bảo trì và tái sử dụng trên toàn hệ thống.

### ui/ – Atomic Components
Chứa các UI thuần túy, không chứa business logic, nhận dữ liệu qua props.
- Button.tsx: Nút bấm có các biến thể (primary, secondary, outline, ghost).
- Badge.tsx: Thẻ tag hiển thị độ khó (Easy, Medium, Hard) hoặc trạng thái.
- Avatar.tsx: Hiển thị ảnh đại diện người dùng.

### common/ – Shared Components
Chứa các component phức tạp hơn, mang tính đặc thù của nền tảng CodeSoChill.
- ContestCard.tsx: Card hiển thị thông tin cuộc thi (thời gian, số lượng tham gia).
- ActivityHeatmap.tsx: Biểu đồ nhiệt hiển thị tần suất nộp bài (giống GitHub contributions).
- ContestRatingChart.tsx: Biểu đồ đường thể hiện lịch sử biến động rank của người dùng.

### layout/ – Layout Components
- MainLayout.tsx: Bọc các trang thông thường, chứa Header và Footer.
- FullscreenLayout.tsx: Dành riêng cho ProblemDetailPage, ẩn Header/Footer để tối đa không gian cho Code Editor.

---

## 4. pages/ – Các màn hình chính

Mỗi thư mục trong pages/ tương ứng với một route trên thanh địa chỉ.

### ProblemDetailPage/ – Giao diện làm bài
Trái tim của hệ thống chấm code.
- ProblemDescription.tsx: Hiển thị đề bài dạng Markdown/HTML, các ví dụ và ràng buộc.
- CodeEditor.tsx: Tích hợp Monaco Editor. Nhận ngôn ngữ lập trình, highlight syntax và bắt sự kiện gõ phím.
- **Tương tác**: Có nút Run Code (chạy thử) và Submit Code (chấm chính thức), hiển thị Console Output.

### CommunityPage/ – Diễn đàn thảo luận
- PostFeed.tsx: Danh sách các bài đăng chia sẻ kinh nghiệm, thuật toán.
- TrendingPulse.tsx: Các chủ đề đang hot.
- SeasonalLeaderboard.tsx: Bảng xếp hạng theo mùa giải.

### ProfilePage/ – Hồ sơ cá nhân
- UserProfileCard.tsx: Thông tin cơ bản, rank, tổng số bài đã giải.
- RecentSubmissions.tsx: Lịch sử nộp bài gần đây kèm kết quả.
- ActivityHeatmap.tsx: Tần suất hoạt động.

---

## 5. hooks/ và services/ – Xử lý Logic & API

Frontend không gọi xios trực tiếp trong component mà tách riêng thành Service và Hook.

### services/
Chứa các file gọi API thuần túy, trả về Promise.
`	ypescript
// services/problemService.ts
import api from './api';

export const getProblems = async (filters) => {
  const response = await api.get('/api/problems', { params: filters });
  return response.data;
};
`

### hooks/
Đóng gói Service vào các custom hook để quản lý trạng thái loading, error, data.
`	ypescript
// hooks/useProblems.ts
import { useState, useEffect } from 'react';
import { getProblems } from '../services/problemService';

export const useProblems = (filters) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProblems(filters).then(data => {
      setProblems(data);
      setLoading(false);
    });
  }, [filters]);

  return { problems, loading };
};
`

---

## 6. modals/ và context/ – Quản lý trạng thái toàn cục

### context/
- AuthContext.tsx: Lưu trữ thông tin người dùng đang đăng nhập và token. Cung cấp hàm login, logout.
- ThemeContext.tsx: Quản lý giao diện Sáng/Tối.
- ModalContext.tsx: Điều khiển việc đóng/mở các cửa sổ Pop-up từ bất kỳ đâu.

### modals/
Các cửa sổ Pop-up (hiển thị đè lên giao diện chính).
- MessagesModal/: Hộp thoại nhắn tin giữa các người dùng.
- NotificationsModal/: Danh sách thông báo (nhắc lịch thi, có người reply...).
- Tích hợp với ModalPortal.tsx để render modal ra ngoài root DOM, tránh lỗi CSS z-index.

---

## 7. Thứ tự code logic và mức độ ưu tiên

Dưới đây là trình tự triển khai tối ưu để đảm bảo không bị nghẽn (block) giữa các tính năng:

1. **Setup & UI Kit (Nền tảng)**
    - Cấu hình Vite, Tailwind, Router.
    - Xây dựng các UI Components cơ bản (Button, Input, Avatar).
    - Setup Layout (MainLayout, MobileHeader).

2. **Auth & API Integration**
    - Cấu hình services/api.ts với Axios Interceptors (tự động gắn Token).
    - Triển khai AuthContext và các trang LoginPage, RegisterPage.

3. **Core Features (Bài tập & Chấm code)**
    - Xây dựng ProblemsPage (danh sách bài tập, bộ lọc).
    - Xây dựng ProblemDetailPage (Code Editor, hiển thị đề bài).
    - Kết nối API Submit Code và xử lý kết quả trả về.

4. **Social & Gamification**
    - Trang ProfilePage và các biểu đồ thống kê (ActivityHeatmap).
    - Hệ thống cuộc thi ContestPage và Diễn đàn CommunityPage.

5. **AI Service & Tiện ích mở rộng**
    - Tích hợp ChatPanel gọi iService.ts để làm trợ lý ảo hỗ trợ giải thích code.
    - Hoàn thiện SettingsPage, NotificationsModal và tính năng nhắn tin MessagesModal.
