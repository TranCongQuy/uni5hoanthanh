# 🎓 UNIPATH 2.0 - HỆ SINH THÁI HƯỚNG NGHIỆP & TUYỂN SINH ĐẠI HỌC THÔNG MINH
### 📱 Mobile-First Native Experience & 💻 Desktop Widescreen Mode (1-Click Toggle)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://uni5hoanthanh.vercel.app)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> 🌐 **Trang web chính thức:** [https://uni5hoanthanh.vercel.app](https://uni5hoanthanh.vercel.app)  
> **UniPath 2.0** là nền tảng số toàn diện hỗ trợ học sinh THPT (đặc biệt là 2k8, 2k9) và quý phụ huynh trên hành trình chọn ngành, chọn trường và kiến tạo tương lai nghề nghiệp vững chắc với công nghệ AI đối soát chuẩn xác, mô hình hướng nghiệp quốc tế RIASEC và dữ liệu điểm chuẩn 30 trường đại học hàng đầu 3 miền Bắc - Trung - Nam.

---

## 👥 ĐƠN VỊ PHÁT TRIỂN & BẢN QUYỀN DỰ ÁN

Dự án được nghiên cứu, thiết kế và phát triển độc quyền bởi **Nhóm UP5** thuộc **Trường Đại học Phú Xuân (PXU)**:

* 👑 **Trưởng nhóm UP5:** **Dương Đình Phát**
* 💻 **Kỹ sư phát triển phần mềm (Phát triển App):** **Trần Công Quý**
* 🤝 **Thành viên nhóm UP5:**
  * **Trần Thị Nhung**
  * **Nguyễn Thị Lý Trà My**
  * **Thái Thị Nga**
* 🏛️ **Đơn vị chủ quản & Đào tạo:** **Trường Đại học Phú Xuân (PXU)**

> **© Bản quyền dự án thuộc về Nhóm UP5 — Trường Đại học Phú Xuân (PXU). Phát triển app bởi Trần Công Quý.**

---

## 🗺️ BẢNG ÁNH XẠ CHỨC NĂNG & LUỒNG NÚT BẤM (BUTTON CLICK & ACTION MATRIX)

Nhằm đảm bảo tính logic tuyệt đối: **"Bấm nút này thì ra cái gì / trang nào"**, dưới đây là bảng đối soát chi tiết toàn bộ các nút bấm và hành động tương tác trong hệ thống:

| Vị trí / Nút bấm | Hành vi khi nhấn (Action) | Đích đến / Trạng thái hiển thị |
| :--- | :--- | :--- |
| **Nút Chuyển Giao Diện (Floating Pill)** | Chuyển đổi qua lại giữa Mobile & Desktop với 1 click | Chuyển ngay giao diện sang `Desktop Widescreen` hoặc `Mobile Native` |
| **Logo UniPath (Góc trên)** | Đưa người dùng về màn hình Trang chủ | Chuyển về **Tab 0 (Trang chủ)** và cuộn mượt lên đỉnh trang |
| **Thanh Điều Hướng 5 Tabs** | Chuyển đổi giữa 5 phân hệ tính năng | **Tab 0:** Trang chủ • **Tab 1:** Khảo sát Holland • **Tab 2:** AI Matching • **Tab 3:** EduFair LIVE • **Tab 4:** Hồ sơ |
| **Chuông Thông Báo (Bell Icon)** | Mở trung tâm thông báo tuyển sinh | Mở modal **`NotificationsModal`** (Căn giữa trên Desktop, Bottom-sheet trên Mobile) |
| **Trợ Lý AI (Robot Icon)** | Mở hộp thoại chat AI 24/7 | Mở modal **`ChatBotModal`** với các câu hỏi gợi ý thông minh |
| **Nút "⚡ Đăng nhập Demo" (Khi chưa đăng nhập)** | Kích hoạt phiên trải nghiệm nhanh | Đăng nhập tài khoản thí sinh **Trần Công Quý** với dữ liệu mẫu hoàn chỉnh |
| **Nút "Đăng nhập / Đăng ký"** | Mở form xác thực tài khoản | Mở modal **`AuthModal`** (Chuyển đổi đăng nhập/đăng ký/khách) |
| **Hero Slide 1: "Làm bài test RIASEC"** | Điều hướng đến trắc nghiệm tính cách | Chuyển sang **Tab 1 (Khảo sát Holland)** |
| **Hero Slide 2: "Tham gia EduFair Live"** | Điều hướng vào ngày hội tuyển sinh ảo | Chuyển sang **Tab 3 (Unipath LIVE)** |
| **Hero Slide 3: "Hỏi Trợ lý AI ngay" / "Gói VIP"** | Tư vấn lộ trình THPT hoặc mở bot | Mở **`ChatBotModal`** hoặc chuyển sang **Tab 4** |
| **Khung Tìm Kiếm Trường Đại Học** | Nhập tên trường, mã trường, khu vực | Gợi ý tức thì 3 trường phù hợp nhất kèm nút **"Xem tất cả {n} trường"** |
| **Nhấn Vào Thẻ Trường Đại Học** | Mở hồ sơ chi tiết trường | Mở modal **`UniversityDetailModal`** (Tổng quan, Điểm chuẩn, Học phí, Review) |
| **Nút Trái Tim (Yêu thích)** | Thêm hoặc xóa trường khỏi danh sách yêu thích | Lưu trạng thái vào `favoriteIds` (Xem lại tại Tab 4) |
| **Nút Checkbox / Nút "So sánh"** | Chọn từ 1 đến 3 trường để đối soát | Thêm vào `compareIds` và làm xuất hiện thanh nổi **"So sánh (n/3)"** |
| **Thanh Nổi "So sánh ({n}/3)"** | Mở bảng đối chiếu đa tiêu chí | Mở modal **`CompareModal`** (Điểm chuẩn, Học phí, Việc làm, Vị trí) |
| **Nút "Nộp hồ sơ" trong chi tiết trường** | Khởi tạo đơn xét tuyển sớm | Mở modal **`ApplyDemoModal`** chọn ngành & phương thức xét tuyển |
| **Tab 1: "Bắt đầu làm bài trắc nghiệm"** | Khởi chạy 12 câu hỏi chuẩn Hoa Kỳ | Bắt đầu bài test RIASEC với thanh tiến trình trực quan |
| **Tab 1: "Đối soát cơ hội trúng tuyển cùng AI"** | Chuyển kết quả Holland sang AI Matching | Chuyển sang **Tab 2 (AI Matching)** mang theo mã tính cách vừa đạt được |
| **Tab 1: "Xem lộ trình nghề nghiệp chi tiết"** | Tra cứu hướng phát triển ngành học | Mở modal **`CareerPathModal`** tương ứng mã RIASEC của thí sinh |
| **Tab 2: Thanh Trượt Điểm Thi & Học Phí** | Thay đổi tiêu chí điểm THPT và ngân sách | Đưa trạng thái về chưa phân tích để chống tự nhảy kết quả |
| **Tab 2: "Phân tích cơ hội trúng tuyển ngay"** | AI kích hoạt thuật toán đối soát 30 trường | Hiển thị thẻ xác nhận ✅ và phân 3 nhóm: **An toàn - Vừa sức - Thách thức** |
| **Tab 3: Tương Tác Thích, Thả Tim, Vỗ Tay** | Kích hoạt hiệu ứng âm thanh & hình ảnh | Phát âm thanh vỗ tay/tim/pop qua **Web Audio API** kèm emoji bay bổng |
| **Tab 3: Gửi Bình Luận Trực Tiếp** | Gửi câu hỏi vào khung chat phòng live | Đẩy tin nhắn lên khung chat và nhận phản hồi tự động từ ban tư vấn |
| **Tab 4: "Chỉnh sửa thông tin hồ sơ"** | Cập nhật điểm thi dự kiến, trường THPT | Mở modal **`EditProfileModal`** |
| **Tab 4: "Xem tất cả hồ sơ ({n})"** | Quản lý toàn bộ đơn đăng ký xét tuyển | Mở modal **`AllApplicationsModal`** phân loại theo 5 trạng thái |
| **Tab 4: "Chi tiết hồ sơ"** | Xem thông tin chi tiết đơn đăng ký | Mở modal **`ViewApplicationModal`** kèm mã hồ sơ và biên nhận |
| **Tab 4: "Hủy hồ sơ"** | Hủy đơn đăng ký đang xét duyệt | Hộp thoại xác nhận an toàn, chuyển trạng thái thành **Đã hủy** |
| **Tab 4: "Cài đặt & Bản quyền nhóm UP5"** | Xem giới thiệu, đổi giao diện, khôi phục | Mở modal **`SettingsModal`** |
| **Tab 4: "Đăng xuất tài khoản"** | Thoát phiên làm việc hiện tại | Mở xác nhận đăng xuất và đưa về trạng thái khách an toàn |

---

## 🌟 CÁC PHÂN HỆ TÍNH NĂNG NỔI BẬT

### 1. 🧭 Trắc nghiệm Tính cách Nghề nghiệp RIASEC (Holland Code)
- Chuẩn hóa theo mô hình tâm lý học hướng nghiệp Holland 6 nhóm tính cách: **Realistic, Investigative, Artistic, Social, Enterprising, Conventional**.
- Trực quan hóa kết quả bằng **Biểu đồ Radar SVG đa chiều**, phân tích điểm mạnh - điểm yếu và đề xuất danh mục các chuyên ngành đại học phù hợp nhất.

### 2. 🤖 AI Matching 2026 - Dự đoán Xác suất Trúng tuyển
- Thuật toán AI phân tích tương quan giữa điểm thi THPT dự kiến, ngân sách học phí gia đình và khu vực ưu tiên (Bắc, Trung, Nam).
- Quy trình phân tích chuẩn xác theo ý người dùng: Chỉ tính toán khi người dùng bấm nút **"Phân tích cơ hội trúng tuyển ngay"**; khi kéo thanh điểm hoặc ngân sách, kết quả cũ sẽ tự động ẩn đi và yêu cầu bấm phân tích lại để đảm bảo tính thời điểm.
- Phân loại thông minh 30 trường đại học thành 3 nhóm cơ hội trúng tuyển:
  - 🟢 **Nhóm An Toàn (> 85%):** Vùng điểm đệm vững chắc.
  - 🟡 **Nhóm Vừa Sức (65% - 85%):** Mục tiêu trọng tâm vừa vặn năng lực.
  - 🔴 **Nhóm Thử Thách (< 65%):** Khát vọng vươn tầm và bứt phá.

### 3. 🏛️ Cơ sở Dữ liệu 30 Trường Đại học & Công cụ So sánh
- Dữ liệu chuẩn xác của 30 trường đại học danh tiếng tại Việt Nam: mã trường, học phí/năm, phổ điểm chuẩn 3 năm liên tiếp (2022, 2023, 2024), tỷ lệ sinh viên có việc làm sau tốt nghiệp.
- **Biểu đồ cột (Bar Chart) trực quan:** So sánh trực tiếp mức điểm chuẩn từng năm và mức điểm của thí sinh.
- **Tính năng So sánh Trường:** Cho phép ghim và đối chiếu từ 2 đến 3 trường cùng lúc theo từng tiêu chí với thanh nổi cố định trên màn hình.

### 4. 🔴 Unipath LIVE - Virtual EduFair Trực tuyến
- Không gian giao lưu trực tuyến Virtual EduFair kết nối trực tiếp học sinh với ban tuyển sinh.
- **Bộ tổng hợp âm thanh Web Audio API độc quyền:** Nút Vỗ tay phát tiếng vỗ tay chân thực, nút Thả tim phát hợp âm chuông ngân ngọt ngào kèm pháo hoa confetti, nút Thích phát tiếng pop sôi động kèm các icon cảm xúc bay lượn trên màn hình.
- Khung chat trực tiếp tự động cuộn mượt mà với 8 bình luận mới nhất, chống rò rỉ bộ nhớ.

### 5. 📄 Cổng Nộp Hồ sơ Xét tuyển Sớm & Quản trị 360°
- Biểu mẫu nộp hồ sơ trực tuyến tinh gọn: Điền thông tin cá nhân ➔ Chọn ngành & phương thức xét tuyển ➔ Xác nhận nộp thành công.
- Theo dõi tiến độ hồ sơ theo 5 trạng thái phân định: **Đang xét duyệt**, **Hồ sơ hợp lệ**, **Thiếu hồ sơ**, **Đã hủy**, **Đã bị hủy**.

### 6. 📱 Chế độ Kép: Mobile Native & Desktop Widescreen
- **Chuyển đổi tức thì:** Nút bấm nổi thông minh đặt ở vị trí khoa học, không đè lên các nút thao tác khác.
- **Trên Mobile:** Giao diện một tay, bottom navigation bar, modal dạng ngăn kéo vuốt công thái học.
- **Trên Desktop:** Giao diện toàn màn hình, topbar cố định, bố cục 3-4 cột rộng rãi, các modal tự động căn giữa màn hình thành dạng dialog sang trọng với hiệu ứng kính mờ (backdrop blur).

---

## 🛠️ KIẾN TRÚC CÔNG NGHỆ (TECH STACK)

| Phân hệ | Công nghệ / Thư viện | Vai trò & Ưu điểm |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript | Hiệu năng cao, strict-typing an toàn tuyệt đối |
| **Bundler** | Vite 6 | Thời gian khởi động dev server tính bằng mili-giây, build tối ưu |
| **Styling** | Modern CSS + Tailwind | Tối ưu hóa hiển thị responsive trên cả smartphone và laptop |
| **Iconography** | Lucide React | Bộ icon hiện đại, sắc nét chuẩn giao diện phẳng |
| **Audio Synthesis**| Web Audio API (Native) | Tự tổng hợp âm thanh vỗ tay/tim/pop mà không cần tải file MP3 nặng |
| **Particle FX** | Canvas Confetti + CSS Keyframes | Hiệu ứng chúc mừng, thả tim và emoji bay lượn sinh động |
| **State Management**| React Context + Local Storage | Lưu phiên phân tích AI và đồng bộ dữ liệu người dùng |
| **Hosting & CI/CD**| Vercel Cloud Platform | Tự động build và deploy liên tục mỗi khi cập nhật GitHub |

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN (LOCAL DEVELOPMENT)

### Yêu cầu:
- [Node.js](https://nodejs.org/) $\ge$ 18.x
- Quản lý gói `npm` hoặc `pnpm` / `yarn`

### Các bước thực hiện:
```bash
# 1. Clone mã nguồn từ GitHub
git clone https://github.com/TranCongQuy/uni5hoanthanh.git

# 2. Di chuyển vào thư mục dự án
cd uni5hoanthanh

# 3. Cài đặt các gói phụ thuộc
npm install

# 4. Chạy máy chủ phát triển cục bộ
npm run dev
```

Mở trình duyệt và truy cập: **`http://localhost:5173`**

### Kiểm tra cú pháp và build sản xuất:
```bash
# Kiểm tra linting (Đảm bảo 0 lỗi)
npm run lint

# Build bản tối ưu hóa cho Production
npm run build
```

---

## 📂 CẤU TRÚC THƯ MỤC NGUỒN

```
unipath-web/
├── public/
│   ├── images/              # Logo UniPath, campus 30 trường, banner EduFair, avatar
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/            # AuthScreen (Màn hình đăng nhập mobile)
│   │   ├── charts/          # RadarChart (RIASEC), BarChart (Điểm chuẩn 3 năm)
│   │   ├── common/          # ViewModeToggle, UI Components (Button, Avatar, Badge)
│   │   ├── desktop/         # DesktopView.tsx (Giao diện Desktop Widescreen hoàn chỉnh)
│   │   ├── mobile/          # MobileView.tsx (Giao diện Mobile First chuẩn app)
│   │   ├── modals/          # 12 Modal: Chi tiết trường, So sánh, ChatBot, Lộ trình THPT...
│   │   ├── navigation/      # BottomNavigation.tsx (Thanh điều hướng dưới mobile)
│   │   └── tabs/            # HomeTab, QuizTab, MatchingTab, LiveTab, ProfileTab
│   ├── context/             # AppContext.tsx (Quản lý toàn bộ State toàn cục)
│   ├── data/                # MockData.ts (30 trường ĐH, 12 câu hỏi RIASEC, ngành đào tạo)
│   ├── utils/               # sound.ts (Bộ tổng hợp âm thanh Web Audio API độc quyền)
│   ├── types/               # Type definitions (University, Application, HollandCode...)
│   ├── App.tsx              # Root Router & Modal Controller
│   ├── main.tsx             # React DOM Entrypoint
│   └── index.css            # Responsive resets & animation keyframes
├── package.json
└── README.md
```

---

## 🌟 THÔNG ĐIỆP DỰ ÁN

> *"Chọn đúng trường - Đi đúng đường - Vững tương lai cùng Unipath!"*  
> Hệ sinh thái Tuyển sinh Unipath 2.0 cam kết đồng hành cùng học sinh và phụ huynh Việt Nam với sự chuẩn xác, tiện lợi và nhân văn nhất.

---
**Trường Đại học Phú Xuân (PXU) • Nhóm UP5 • 2026**
