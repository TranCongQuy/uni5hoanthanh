# 💻 03-KY-THUAT-FRONTEND.md: KIẾN TRÚC KỸ THUẬT LẬP TRÌNH FRONTEND UNIPATH 2.0
> **Hệ sinh thái Tuyển sinh & Định hướng nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Phát triển phần mềm & Kỹ sư ứng dụng:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. NGĂN XẾP CÔNG NGHỆ CỐT LÕI (TECH STACK SPECIFICATIONS)

| Thành phần | Công nghệ | Phiên bản | Vai trò & Mục đích sử dụng |
| :--- | :--- | :---: | :--- |
| **Core Framework** | **React** | **19.x** | Thư viện giao diện chính, tận dụng các cải tiến mới về hiệu năng và render đồng thời |
| **Language** | **TypeScript** | **5.x** | Định kiểu tĩnh chặt chẽ (Strict Mode), loại trừ triệt để lỗi runtime |
| **Build Tool & Bundler** | **Vite** | **6.x** | Đóng gói siêu tốc (HMR < 50ms, thời gian build production dưới 1 giây) |
| **Iconography** | **Lucide React** | **0.475+** | Hệ thống icon vector tối giản, nhẹ và chuẩn ngữ nghĩa tiếp cận |
| **Visual Effects** | **Canvas Confetti** | **1.9.4** | Hiệu ứng pháo hoa chúc mừng khi hoàn thành trắc nghiệm và trúng tuyển |
| **Sound Synthesis** | **Web Audio API** | **Native** | Bộ phát thanh tổng hợp thuần trình duyệt, không phụ thuộc file âm thanh mạng |
| **Deployment** | **Vercel** | **Edge** | Nền tảng phân phối CDN toàn cầu, kết nối tự động Git CI/CD |

---

## 2. KIẾN TRÚC THƯ MỤC DỰ ÁN (PROJECT REPOSITORY STRUCTURE)

```
d:/VSCODE PXU K22/unipath-web/
├── public/                     # Tài nguyên tĩnh (ảnh trường, banner, logo PXU, sound)
│   └── images/                 # Ảnh logo 30 trường, banner sự kiện, avatar thí sinh
├── src/
│   ├── components/             # Các khối giao diện người dùng
│   │   ├── auth/               # Cổng đăng nhập phân quyền (AuthScreen.tsx)
│   │   ├── charts/             # Biểu đồ SVG thuần (RadarChart, DonutChart, LineChart)
│   │   ├── common/             # UI primitives dùng chung (UI.tsx: Button, UniversityAvatar...)
│   │   ├── desktop/            # Giao diện Laptop / Desktop Widescreen (DesktopView.tsx)
│   │   ├── mobile/             # Giao diện Di động Native Mobile (MobileView.tsx)
│   │   ├── modals/             # Hệ thống 10 modal tương tác độc lập (So sánh, Chi tiết trường...)
│   │   ├── portal/             # Phân hệ quản trị vai trò (RolePortalViews.tsx: Admin, PXU)
│   │   └── tabs/               # 5 phân hệ tính năng chính trên Mobile (Home, Quiz, Match, Live, Profile)
│   ├── context/                # Trạng thái toàn cục (AppContext.tsx)
│   ├── data/                   # Cơ sở dữ liệu mẫu chuẩn hóa 30 trường ĐH (MockData.ts)
│   ├── services/               # Dịch vụ nghiệp vụ (MatchingService.ts)
│   ├── types/                  # Định nghĩa kiểu dữ liệu TypeScript (index.ts)
│   ├── utils/                  # Tiện ích bổ trợ (sound.ts: Web Audio API Synthesizer)
│   ├── App.tsx                 # Điều phối giao diện đa nền tảng và kiểm soát modal
│   ├── App.css                 # Phong cách định dạng bổ trợ và hiệu ứng animation
│   └── main.tsx                # Điểm khởi tạo ứng dụng React 19
├── 01-NGHIEP-VU.md             # Tài liệu Nghiệp vụ & Hướng nghiệp
├── 02-GIAO-DIEN-AI.md          # Tài liệu Thiết kế Giao diện & Trải nghiệm AI
├── 03-KY-THUAT-FRONTEND.md     # Tài liệu Kỹ thuật Lập trình Frontend
├── 04-KY-THUAT-ADMIN.md        # Tài liệu Kỹ thuật Phân Quyền & Quản trị Tuyển sinh
├── README.md                   # Tổng quan dự án, bản quyền nhóm UP5 & bảng ánh xạ nút bấm
└── package.json                # Cấu hình dependency và script build
```

---

## 3. QUẢN TRỊ TRẠNG THÁI TOÀN CỤC (GLOBAL STATE MANAGEMENT - APPCONTEXT)

Toàn bộ ứng dụng sử dụng React Context API chuẩn hóa qua `AppContext.tsx` nhằm cung cấp dữ liệu tức thì cho mọi thành phần mà không gặp hiện tượng prop drilling:

### 3.1. Phân nhóm State chính
1. **Auth & Phân quyền (RBAC State):**
   - `isLoggedIn`: Trạng thái đăng nhập (mặc định bắt đầu từ `false` tại Onboarding).
   - `isGuest`: Chế độ trải nghiệm khách.
   - `user`: Thông tin người dùng hiện tại (`CurrentUser`: `email`, `name`, `role`, `organization`).
   - `loginDemo()`, `loginAdmin()`, `loginPXU()`, `switchRole()`, `logout()`.
2. **Cơ sở dữ liệu 30 Trường Đại học:**
   - `universitiesList`: Danh sách 30 trường đại học Bắc - Trung - Nam.
   - `updateUniversityMetrics(id, score, tuition)`: Quyền Admin điều chỉnh điểm sàn & học phí.
3. **Quản lý Hồ sơ Xét tuyển (Applications State):**
   - `applications`: Mảng hồ sơ xét tuyển trực tuyến.
   - `addApplication()`: Thêm hồ sơ mới với mã định danh tự sinh dạng `HS-2026-UNIxxxx`.
   - `updateApplicationStatus()`: Chuyển đổi trạng thái hồ sơ (`Đã trúng tuyển`, `Thiếu hồ sơ`, `Đã bị hủy`).
   - `cancelApplication()`: Thí sinh chủ động hủy hồ sơ.
4. **AI Matching & Holland Quiz State:**
   - `hollandResult`: Kết quả làm bài trắc nghiệm RIASEC.
   - `aiMatchState`: Trạng thái phân tích 3 tham số (Điểm thi, Ngân sách học phí, Khu vực).
5. **View Mode State:**
   - `viewMode`: Thích ứng tự động `desktop` hoặc `mobile` theo kích thước màn hình.

---

## 4. KỸ THUẬT TỐI ƯU HIỆU NĂNG & AN TOÀN TRUY CẬP

### 4.1. Cơ chế Khóa Cuộn Màn Hình (Body Scroll Lock)
Khi bất kỳ modal hoặc drawer nào được mở (như Modal chi tiết trường, Modal so sánh, ChatBot...), ứng dụng tự động áp dụng lớp bảo vệ cuộn:
```typescript
document.body.style.overflow = 'hidden';
document.body.style.touchAction = 'none';
document.documentElement.style.overflow = 'hidden';
```
Kỹ thuật này ngăn chặn hoàn toàn hiện tượng "cuộn nền lồng nhau" (background double-scroll), giữ vị trí cuộn trang ổn định khi đóng modal.

### 4.2. Giải Thuật Tổng Hợp Âm Thanh Không Tải Tệp (Zero-Network Audio)
Thay vì sử dụng các tệp âm thanh tĩnh `.mp3` hoặc `.wav` nặng hàng trăm kilobytes và dễ gặp lỗi tải chậm qua mạng, UniPath 2.0 triển khai lớp `SoundFX` thuần JavaScript:
- Khởi tạo singleton `AudioContext` khi có tương tác đầu tiên của người dùng.
- Tạo sóng âm với `OscillatorNode` và điều khiển biên độ qua `GainNode`.
- Thời gian trễ phát âm thanh (Audio latency) xấp xỉ 0ms, hoạt động ổn định cả khi ngoại tuyến (offline).

---

## 5. QUY TRÌNH BUILD & TRIỂN KHAI LIÊN TỤC (CI/CD)

1. **Kiểm thử tĩnh (Linting & Type-checking):**
   - Lệnh `npm run lint`: Thực thi ESLint 9 với cấu hình TypeScript ESLint nghiêm ngặt (0 lỗi, 0 cảnh báo).
   - Lệnh `npm run build`: Thực thi `tsc -b && vite build`.
2. **Đóng gói tối ưu hóa (Production Asset Optimization):**
   - Phân đoạn mã (Code-splitting) thông minh.
   - Kích thước tệp CSS sau nén gzip chỉ **1.17 kB**.
   - Kích thước gói JavaScript sau nén gzip chỉ **160 kB** cho toàn bộ hệ sinh thái tính năng đồ sộ.
3. **Triển khai tự động:** Đẩy mã nguồn lên kho Git chính thức (`https://github.com/TranCongQuy/uni5hoanthanh.git`), hệ thống tự động kích hoạt Vercel Deploy Hook cập nhật trang sản phẩm: `https://uni5hoanthanh.vercel.app`.

---

## 6. ĐƠN VỊ THỰC HIỆN & BẢN QUYỀN KỸ THUẬT

Toàn bộ kiến trúc kỹ thuật và mã nguồn ứng dụng thuộc bản quyền sở hữu của:
* 🏛️ **Đơn vị chủ quản & Đào tạo:** **Trường Đại học Phú Xuân (PXU)**
* 👥 **Nhóm nghiên cứu & phát triển UP5:**
  * 👑 **Trưởng nhóm:** **Dương Đình Phát**
  * 💻 **Kỹ sư phát triển phần mềm:** **Trần Công Quý**
  * 🤝 **Thành viên:** **Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga**
