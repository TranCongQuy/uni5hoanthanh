# 💻 03-KY-THUAT-FRONTEND.md: KIẾN TRÚC KỸ THUẬT LẬP TRÌNH FRONTEND UNIPATH 2.0
> **Hệ sinh thái Tuyển sinh & Định hướng Nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Kỹ sư phát triển phần mềm:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. NGĂN XẾP CÔNG NGHỆ CỐT LÕI (TECH STACK SPECIFICATIONS)

| Thành phần | Công nghệ | Phiên bản | Vai trò & Giá trị kỹ thuật |
| :--- | :--- | :---: | :--- |
| **Core UI Library** | **React** | **19.3.x** | Kiến trúc component hướng hàm (Functional Components & Hooks), tối ưu cập nhật trạng thái đồng thời |
| **Static Typing** | **TypeScript** | **5.9.x** | Kiểm tra kiểu tĩnh nghiêm ngặt (`tsc -b` Strict Mode), đảm bảo an toàn kiểu dữ liệu xuyên suốt 100% module |
| **Build Tool & Bundler** | **Vite (Rolldown)** | **8.3.x** | Khởi động máy chủ phát triển tức thì, đóng gói bản Production dưới 1 giây |
| **Code Quality** | **ESLint + TS-ESLint** | **10.x / 8.x** | Kiểm soát chất lượng mã nguồn chuẩn mực (0 lỗi, 0 cảnh báo) |
| **Iconography** | **Lucide React** | **1.62.x** | Hệ thống biểu tượng vector sắc nét, đồng nhất độ dày nét vẽ |
| **Celebration FX** | **Canvas Confetti** | **1.9.4** | Hiệu ứng pháo hoa chúc mừng khi hoàn thành bài test RIASEC và tương tác sự kiện |
| **Audio Engine** | **Web Audio API** | **Native** | Tổng hợp sóng âm trực tiếp trên trình duyệt, độ trễ ~0ms, không phụ thuộc tệp âm thanh ngoài |
| **Cloud Hosting** | **Vercel Edge** | **CI/CD** | Tự động đóng gói và phân phối CDN toàn cầu từ nhánh `main` trên GitHub |

---

## 2. CẤU TRÚC THƯ MỤC MÃ NGUỒN (PROJECT ARCHITECTURE)

```text
d:/VSCODE PXU K22/unipath-web/
├── public/
│   └── images/                         # Tài nguyên tĩnh (Logo & Campus 30 trường, Banner EduFair, Avatar)
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminApp.tsx            # Cổng Quản trị Hệ thống Toàn quốc (Dashboard, Hồ sơ, 30 Trường, Lịch 1-1, User)
│   │   ├── auth/
│   │   │   └── AuthScreen.tsx          # Màn hình Đăng nhập / Đăng ký / Chọn nhanh vai trò Demo trên Mobile
│   │   ├── charts/
│   │   │   ├── RadarChart.tsx          # Biểu đồ mạng nhện 6 trục Holland RIASEC (SVG thuần)
│   │   │   ├── DonutChart.tsx          # Biểu đồ vòng tròn xác suất trúng tuyển (SVG thuần)
│   │   │   └── LineChart.tsx           # Biểu đồ đường xu hướng điểm chuẩn 3 năm (SVG thuần)
│   │   ├── common/
│   │   │   └── UI.tsx                  # Thư viện UI dùng chung (Button, UniversityAvatar, ImageSafe, Toast, EmptyState)
│   │   ├── desktop/
│   │   │   └── DesktopView.tsx         # Không gian làm việc Thí sinh trên màn hình rộng (≥ 1024px)
│   │   ├── layout/
│   │   │   └── BottomNav.tsx           # Thanh điều hướng 5 tab cố định đáy trên Mobile (< 1024px)
│   │   ├── modals/                     # Hệ thống 13 Hộp thoại tương tác chuyên biệt (Chi tiết bên dưới)
│   │   ├── tabs/                       # 5 Phân hệ Thí sinh trên Mobile (HomeTab, QuizTab, MatchTab, LiveTab, ProfileTab)
│   │   └── university/
│   │       └── UniversityApp.tsx       # Cổng Tuyển sinh độc quyền Trường Đại học Phú Xuân (PXU)
│   ├── context/
│   │   └── AppContext.tsx              # Trung tâm điều phối State toàn cục, RBAC & Lưu trữ bền vững 2 tầng
│   ├── data/
│   │   └── MockData.ts                 # CSDL chuẩn hóa 30 trường ĐH Bắc - Trung - Nam & 12 câu hỏi RIASEC
│   ├── services/
│   │   └── MatchingService.ts          # Động cơ tính toán xác suất trúng tuyển & chọn ngành tham chiếu thống nhất
│   ├── types/
│   │   └── index.ts                    # Định nghĩa toàn bộ Interface, Type, RBAC Account & getStatusMeta()
│   ├── utils/
│   │   └── sound.ts                    # Bộ tổng hợp âm thanh Web Audio API (SoundFX)
│   ├── App.tsx                         # Bộ định tuyến cổng vai trò (Role Router), Quản lý Modal & Body Scroll Lock
│   ├── index.css                       # Hệ thống biến thiết kế CSS, chống tràn ngang (overflow-x: clip) & Keyframes
│   └── main.tsx                        # Điểm khởi tạo React 19 Root
├── README.md                           # Tổng quan dự án, ma trận RBAC & bảng ánh xạ luồng nút bấm
├── USER_GUIDE.md                       # Hướng dẫn sử dụng chi tiết cho từng đối tượng người dùng
├── 01-NGHIEP-VU.md                     # Tài liệu phân tích nghiệp vụ tuyển sinh & công thức AI Matching
├── 02-GIAO-DIEN-AI.md                  # Tài liệu thiết kế giao diện thích ứng kép & trải nghiệm AI
├── 03-KY-THUAT-FRONTEND.md             # Tài liệu kiến trúc kỹ thuật Frontend (Tài liệu hiện tại)
└── 04-KY-THUAT-ADMIN.md                # Tài liệu kỹ thuật phân quyền RBAC & quản trị tuyển sinh
```

---

## 3. KIẾN TRÚC LƯU TRỮ BỀN VỮNG HAI TẦNG (TWO-TIER PERSISTENCE ENGINE)

Một điểm nhấn kỹ thuật quan trọng trong `src/context/AppContext.tsx` là việc tách bạch rõ ràng giữa **Kho Dữ liệu Liên thông Toàn Hệ thống** và **Kho Dữ liệu Cá nhân Từng Người dùng** trên `localStorage`, giúp toàn bộ luồng nghiệp vụ **Thí sinh ↔ ĐH Phú Xuân ↔ Admin** hoạt động bền vững ngay cả khi đăng xuất, chuyển đổi tài khoản hoặc tải lại trang (`F5`):

### 3.1. Tầng 1: Kho Dữ liệu Liên thông Hệ thống (`Shared Institutional Store`)
| Khóa lưu trữ (`localStorage`) | Nội dung quản lý | Tính liên thông nghiệp vụ |
| :--- | :--- | :--- |
| `unipath_v2_shared_applications` | Danh sách toàn bộ hồ sơ xét tuyển trực tuyến | Thí sinh nộp mới / bổ sung / rút hồ sơ ↔ PXU & Admin duyệt trạng thái theo thời gian thực |
| `unipath_v2_shared_bookings` | Danh sách lịch hẹn tư vấn 1-1 | Thí sinh đặt lịch mới ↔ PXU & Admin tiếp nhận điều phối |
| `unipath_v2_shared_booking_states` | Trạng thái xử lý từng lịch hẹn (`pending` / `contacted` / `done`) | PXU & Admin cập nhật tiến độ ↔ Thí sinh theo dõi trực tiếp tại Tab 4 |
| `unipath_v2_shared_universities` | CSDL 30 trường đại học (gồm `score2024`, `tuitionMin`, `cutoffScores`) | Admin (30 trường) & PXU (riêng trường PXU) cập nhật điểm chuẩn ↔ Đồng bộ tức thì sang AI Matching |
| `unipath_v2_shared_processing_log` | Nhật ký kiểm toán xử lý hồ sơ (`ProcessingLogEntry[]`) | Ghi vết người duyệt, vai trò, thời gian, trạng thái cũ → mới và ghi chú hội đồng |
| `unipath_v2_shared_notifications` | Hệ thống thông báo đa chiều (`NotificationItem[]`) | Tự động phân phối thông báo theo `targetRole` và `targetEmail` kèm bộ đếm chưa đọc |

### 3.2. Tầng 2: Kho Dữ liệu Cá nhân Cô lập theo Email (`Per-User Personal Store`)
- Khóa lưu trữ: `unipath_v2_user_${email}` và lịch sử hội thoại AI `unipath_chat_history_${email}`.
- Lưu trữ độc lập cho từng tài khoản thí sinh: Hồ sơ học tập (`profile`), Danh sách trường yêu thích (`favoriteIds`), Kết quả trắc nghiệm Holland (`hollandResult`), Cấu hình đối soát gần nhất (`aiMatchState`) và Cờ bật/tắt âm thanh (`soundEnabled`).
- Khi một thí sinh mới đăng ký tài khoản (`register`), hệ thống khởi tạo hồ sơ sạch 100% của chính thí sinh đó, không bao giờ rò rỉ dữ liệu mẫu của tài khoản khác.
- Hỗ trợ nút **"Khôi phục dữ liệu gốc Demo"** trong `SettingsModal` và `AdminApp` để đưa toàn bộ kho dữ liệu về trạng thái chuẩn ban đầu chỉ với 1 cú nhấp chuột khi bảo vệ đồ án.

---

## 4. HỆ THỐNG 13 HỘP THOẠI TƯƠNG TÁC (`src/components/modals/`)

1. **`OnboardingModal.tsx`:** Giới thiệu 3 bước mở đầu trên thiết bị di động cho người dùng lần đầu truy cập.
2. **`AuthModal.tsx`:** Cổng đăng nhập, đăng ký tài khoản thí sinh mới và chuyển nhanh 3 vai trò Demo.
3. **`UniversityDetailModal.tsx`:** Hồ sơ chi tiết từng trường đại học (Điểm chuẩn 3 năm, ngành đào tạo, học bổng, OJT, nút *Hỏi AI*, *Tư vấn 1-1*, *Nộp hồ sơ*).
4. **`CompareModal.tsx`:** Bảng đối chiếu trực diện tối đa 3 trường đại học trên cùng màn hình.
5. **`ApplyDemoModal.tsx`:** Quy trình 3 bước nộp hồ sơ xét tuyển trực tuyến tạo mã định danh tự động `HS-2026-UNIxxxx`.
6. **`BookConsultationModal.tsx`:** Biểu mẫu đặt lịch tư vấn 1-1 chọn trường, ngành, ngày giờ và kênh kết nối (`Google Meet 1-1`, `Gọi điện / Zalo`, `Trực tiếp`).
7. **`ViewApplicationModal.tsx`:** Xem chi tiết hồ sơ, tiến độ 3 bước, **Giấy báo Trúng tuyển sớm**, form **Bổ sung minh chứng** cho thí sinh và bảng **Phê duyệt nhanh** cho Admin/PXU.
8. **`AllApplicationsModal.tsx`:** Quản lý toàn bộ hồ sơ cá nhân của thí sinh phân nhóm theo từng trạng thái.
9. **`EditProfileModal.tsx`:** Cập nhật thông tin học lực, trường THPT, điểm dự kiến và nguyện vọng mục tiêu của thí sinh.
10. **`CareerPathModal.tsx`:** Lộ trình định hướng nghề nghiệp 3 năm cấp 3 (Lớp 10 – 11 – 12) theo từng nhóm tính cách Holland.
11. **`ChatBotModal.tsx`:** Trợ lý AI tư vấn tuyển sinh 24/7 với các thẻ gợi ý câu hỏi ngữ cảnh.
12. **`NotificationsModal.tsx`:** Trung tâm thông báo thời gian thực lọc riêng theo vai trò và email người dùng.
13. **`SettingsModal.tsx`:** Cài đặt hiệu ứng âm thanh, thông tin nhóm phát triển UP5 – ĐH Phú Xuân và khôi phục dữ liệu gốc Demo.

---

## 5. KỸ THUẬT KHÓA CUỘN NỀN & KIỂM SOÁT CHẤT LƯỢNG ĐÓNG GÓI

- **Khóa cuộn nền thông minh (`Body Scroll Lock` trong `App.tsx`):** Khi bất kỳ modal nào trong 13 modal mở ra (`isAnyModalOpen`), hệ thống tự động khóa cuộn `document.body` và `document.documentElement`, ngăn triệt để lỗi cuộn chồng chéo trên màn hình cảm ứng di động.
- **Chất lượng đóng gói kiểm chứng thực tế:**
  - `npm run lint`: **0 errors, 0 warnings** trên toàn bộ dự án.
  - `npm run build` (`tsc -b && vite build`): Biên dịch thành công 100% dưới 1 giây, tối ưu hóa tài nguyên CSS & JS nén gzip siêu nhẹ sẵn sàng triển khai trên Vercel Edge.
