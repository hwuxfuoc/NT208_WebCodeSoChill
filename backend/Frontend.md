### Cấu trúc cho project

```
frontend/
├── src/
│   ├── assets/                 
│   │   ├── images/             # Ảnh tĩnh (logo, placeholder nhà đất, icons map)
│   │   │   └── logo.svg
│   │   ├── icons/              # SVG icons (tìm kiếm, yêu thích, chat, map pin,...)
│   │   └── fonts/              # Nếu dùng custom font
│   ├── components/             # Components tái sử dụng toàn app (chung)
│   │   ├── ui/                 # Atomic nhỏ, reusable
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Badge.jsx       # Ví dụ: "Mới", "Hot", "Hết hạn"
│   │   │   └── Select.jsx      # Dropdown filter
│   │   ├── layout/             # Layout lớn
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx     # Nếu có filter sidebar trên mobile
│   │   │   └── MainLayout.jsx  # Wrapper cho các page (header + footer)
│   │   └── common/             # Components đặc thù bất động sản, dùng nhiều nơi
│   │       ├── PropertyCard.jsx     # Card listing (ảnh, giá, địa chỉ,...)
│   │       ├── PriceTag.jsx         # Format giá + đơn vị (tỷ, triệu)
│   │       ├── SearchBar.jsx        # Thanh tìm kiếm + autocomplete
│   │       ├── FilterTags.jsx       # Tags filter (giá, diện tích, loại nhà)
│   │       └── ContactForm.jsx      # Form liên hệ chủ nhà
│   ├── pages/                  # Mỗi trang/route chính (colocate components con nếu cần)
│   │   ├── Home/
│   │   │   ├── HomePage.jsx
│   │   │   └── HeroSection.jsx     # Banner + search lớn (nếu riêng)
│   │   ├── Property/
│   │   │   ├── PropertyListPage.jsx     # Danh sách mua/thuê + filter + pagination/infinite scroll
│   │   │   ├── PropertyDetailPage.jsx   # Chi tiết nhà
│   │   │   ├── PropertyGallery.jsx      # Slide ảnh chi tiết
│   │   │   ├── PropertyFeatures.jsx     # Đặc điểm (phòng ngủ, WC, nội thất)
│   │   │   └── MapView.jsx              # Bản đồ chi tiết (Google Maps)
│   │   ├── Chat/
│   │   │   ├── ChatPage.jsx             # Danh sách chat rooms
│   │   │   ├── ChatRoom.jsx             # Phòng chat realtime
│   │   │   └── MessageBubble.jsx
│   │   ├── Favorites/
│   │   │   └── FavoritesPage.jsx        # Danh sách nhà yêu thích
│   │   ├── AIAdvisor/
│   │   │   └── AIAdvisorPage.jsx        # Chatbox tư vấn AI
│   │   ├── Auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPassword.jsx
│   │   └── NotFoundPage.jsx             # 404
│   ├── features/               # (Tùy chọn - chỉ dùng khi tính năng lớn, hiện tại có thể bỏ nếu muốn gọn)
│   │   ├── auth/               # Nếu tách auth phức tạp (login, register, forgot, profile)
│   │   ├── property/           # Quản lý property (add/edit nếu có sau)
│   │   └── chat/               # Realtime chat logic
│   ├── hooks/                  # Custom hooks (rất quan trọng cho project bạn)
│   │   ├── useProperties.js         # Fetch/filter listings
│   │   ├── useProperty.js           # Chi tiết 1 property
│   │   ├── useAuth.js               # Auth state (login/logout)
│   │   ├── useChat.js               # Realtime chat (socket.io hoặc firebase)
│   │   ├── useMap.js                # Google Maps hook
│   │   ├── useFavorites.js          # Quản lý yêu thích (localStorage + DB sync)
│   │   └── useAIAdvisor.js          # Call API AI (OpenAI/Grok)
│   ├── services/               # API calls (axios/fetch)
│   │   ├── api.js                   # Base axios instance + interceptors
│   │   ├── propertyService.js       # getProperties, getPropertyById, searchProperties,...
│   │   ├── authService.js           # login, register, getUser
│   │   ├── chatService.js           # sendMessage, getMessages
│   │   └── aiService.js             # call AI tư vấn
│   ├── utils/                  # Helpers thuần JS
│   │   ├── format.js                # formatPrice, formatDate, truncateText
│   │   ├── validators.js            # validateEmail, validatePhone
│   │   ├── constants.js             # LOAI_NHA = ['chung-cu', 'nha-dat', 'dat-nen',...]
│   │   └── helpers.js               # debounce, throttle,...
│   ├── context/                # Context API nếu dùng (thay Redux/Zustand)
│   │   ├── AuthContext.jsx
│   │   ├── FilterContext.jsx        # Filter search chung
│   │   └── ChatContext.jsx
│		├── App.jsx                 # Root component + Router
│		├── index.css
│		├── routes.js               # (Tùy chọn) Define routes nếu dùng React Router
│		└── main.jsx
├── index.html
├── taiwind.config.js
├── vite.config.js
├── package-lock.json
└── package.json
```

### Thứ tự code logic

1. **Setup cơ bản & Routing – Nền tảng quan trọng**
    - Tạo project nếu chưa: `npx create-vite@latest frontend --template react` (Vite nhanh hơn CRA, recommend 2026) hoặc giữ CRA nếu bạn quen.
    - Cài đặt dependencies cơ bản (chạy trong terminal src/):
    (Tailwind cho style nhanh, responsive, đẹp hơn batdongsan nhiều).
    - Config **Tailwind** trong `tailwind.config.js` và `index.css`.
    - Setup **React Router** trong `App.jsx`:
        - Import `BrowserRouter`, `Routes`, `Route`.
        - Wrap app với `<MainLayout />` (header + footer).
        - Define các route cơ bản: `/` → Home, `/properties` → PropertyList, `/properties/:id` → PropertyDetail, `/chat`, `/favorites`, `/ai-advisor`, `/login`, `/register`,  → NotFound.
    - Tạo file `routes.js` (nếu muốn tách) hoặc viết trực tiếp trong App.
    
    **Mục tiêu**: Chạy app, thấy navigation hoạt động, trang trắng với header/footer.
    
2. **Xây dựng Layout & Components chung**
    - Bắt đầu từ `components/layout/` → `Header.jsx`, `Footer.jsx`, `Navbar.jsx`, `MainLayout.jsx`.
    - Sau đó `components/ui/` → `Button.jsx`, `Card.jsx`, `Input.jsx`, `LoadingSpinner.jsx`, `Modal.jsx`, `Select.jsx`.
    - Tiếp `components/common/` → `PropertyCard.jsx` (rất quan trọng, dùng ở home/list/favorites), `PriceTag.jsx`, `SearchBar.jsx`.
    - Style với Tailwind + responsive (mobile-first).
    
    **Mục tiêu**: Có các block reusable đẹp, sẵn sàng dùng ở mọi page.
    
3. **Trang Home (Hero + Featured) – Trang đầu tiên thấy "đẹp"** 
    - `pages/Home/HomePage.jsx` + `HeroSection.jsx`.
    - Hero: Banner lớn (ảnh từ assets), search bar lớn (dùng `SearchBar.jsx`), slogan "Tìm nhà mơ ước tại Việt Nam".
    - Section featured listings: 4-6 `PropertyCard` mock data (JSON hardcode trước).
    - Thêm carousel nếu muốn (cài `swiper`).
    
    **Tại sao bắt đầu Home?** Nó là "landing page", giúp bạn visualize site đẹp hơn batdongsan ngay, tạo động lực.
    
4. **Trang Property List & Filter** 
    - `pages/Property/PropertyListPage.jsx`.
    - Dùng mock data (array objects: {id, title, price, location, type, images, ...}).
    - Implement filter: Giá, diện tích, loại nhà (chung cư/nhà đất/đất nền), phòng ngủ → dùng state + `useEffect`.
    - Grid/list view, pagination/infinite scroll (dùng `react-infinite-scroll-component` nếu muốn).
    - Search & FilterTags.
    
    **Mục tiêu**: Trang listings giống batdongsan nhưng đẹp hơn (card hover effect, responsive).
    
5. **Trang Property Detail** 
    - `pages/Property/PropertyDetailPage.jsx` + `PropertyGallery.jsx` + `PropertyFeatures.jsx` + `MapView.jsx`.
    - Gallery: Dùng Swiper hoặc carousel.
    - Map: Tích hợp Google Maps (cài `@react-google-maps/api`, cần API key free).
    - Features: List phòng ngủ, WC, nội thất, mô tả.
    - ContactForm + PriceTag.
    
    **Mục tiêu**: Trang chi tiết chuyên nghiệp, có map interactive.
    
6. **Auth & User features** 
    - `pages/Auth/LoginPage.jsx`, `RegisterPage.jsx`.
    - Dùng `useAuth.js` hook + Context.
    - Favorites: Lưu localStorage trước, sau sync DB.
7. **Chat & AI** 
    - Chat: [Socket.io](http://socket.io/) hoặc Firebase cho realtime.
    - AI: Call API Grok/OpenAI từ `aiService.js`.
8. **Connect backend & data thật**
    - Thay mock bằng `useProperties.js` + `propertyService.js` → fetch từ server/DB.
    - Thêm auth JWT.
