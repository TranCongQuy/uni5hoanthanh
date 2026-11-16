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
| **Build Tool & Bundler** | **Vite (Rolldown)** | **8.3.x** | Khởi động máy chủ phát triển tức thì, đóng gói bản Production dưới 1 giây (~630ms) |
| **Unit Testing Engine** | **Vitest** | **5.1.x** | **77 bài kiểm thử tự động đạt 100%** qua 6 file kiểm thử chuyên sâu, thực thi trong ~450ms |
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
│   │   │   ├── AdminApp.tsx            # Cổng Quản trị Hệ thống Toàn quốc (Overview, Benchmark, CSDL, Lịch, User)
│   │   │   ├── BenchmarkHistogram.tsx  # Biểu đồ cột phân bố điểm chuẩn 6 phân khoảng (SVG thuần)
│   │   │   ├── AdminGlobalSearch.tsx   # Tìm kiếm toàn diện đa năng kích hoạt bằng phím tắt Ctrl + K
│   │   │   └── SystemSection.tsx       # Quản trị nguồn cấp dữ liệu, Supabase Cloud, LocalStorage & Audit Log
│   │   ├── auth/
│   │   │   └── AuthScreen.tsx          # Cổng Auth Gate bắt buộc Đăng nhập / Đăng ký & Điền sẵn vai trò Demo
│   │   ├── charts/
│   │   │   ├── RadarChart.tsx          # Biểu đồ mạng nhện 6 trục Holland RIASEC (SVG thuần)
│   │   │   ├── DonutChart.tsx          # Biểu đồ vòng tròn xác suất trúng tuyển (SVG thuần)
│   │   │   └── LineChart.tsx           # Biểu đồ đường xu hướng điểm chuẩn 3 năm (SVG thuần)
│   │   ├── common/
│   │   │   ├── UI.tsx                  # Thư viện UI chuẩn SaaS (Button, Card, StatusChip, Toast, EmptyState)
│   │   │   ├── AuroraEffects.tsx       # Hệ thống Design Tokens Aurora, UniversityCard, Mesh, Pulse Ring
│   │   │   ├── AppLoadingScreen.tsx    # Màn hình chờ loader sang trọng loại bỏ màn hình trắng khi tải lazy chunk
│   │   │   └── ErrorBoundary.tsx       # Bộ chặn lỗi runtime an toàn cấp ứng dụng và cấp portal kèm khôi phục
│   │   ├── desktop/
│   │   │   ├── DesktopView.tsx         # Không gian làm việc Thí sinh trên màn hình rộng (≥ 1024px)
│   │   │   └── AIAssistantDock.tsx     # Dock Trợ lý AI cố định góc phải màn hình desktop với bộ nhớ đa lượt
│   │   ├── layout/
│   │   │   └── BottomNav.tsx           # Thanh điều hướng 5 tab cố định đáy trên Mobile (< 1024px)
│   │   ├── modals/                     # Hệ thống 13 Hộp thoại tương tác chuyên biệt (Chi tiết bên dưới)
│   │   ├── tabs/                       # 5 Phân hệ Thí sinh trên Mobile (HomeTab, QuizTab, MatchTab, LiveTab, ProfileTab)
│   │   └── university/
│   │       └── UniversityApp.tsx       # Cổng Tuyển sinh độc quyền Trường Đại học Phú Xuân (PXU)
│   ├── context/
│   │   └── AppContext.tsx              # Trung tâm điều phối State toàn cục, Auth Gate, RBAC & Lưu trữ 2 tầng
│   ├── data/
│   │   └── MockData.ts                 # CSDL chuẩn hóa 30 trường ĐH Bắc - Trung - Nam & 12 câu hỏi RIASEC
│   ├── services/
│   │   ├── MatchingService.ts          # Động cơ tính toán xác suất trúng tuyển & chọn ngành tham chiếu thống nhất
│   │   ├── ApplicationWorkflow.ts      # Máy trạng thái hữu hạn FSM hồ sơ xét tuyển & kiểm tra giải trình
│   │   └── aiChatService.ts            # Dịch vụ gọi Edge Function Gemini Flash, multi-turn memory & offline fallback
│   ├── types/
│   │   └── index.ts                    # Định nghĩa toàn bộ Interface, Type, RBAC Account & getStatusMeta()
│   ├── utils/
│   │   ├── edufair.ts                  # Bộ phân loại pha sự kiện (upcoming/live/ended) & đếm ngược chính xác
│   │   ├── security.ts                 # Thuật toán băm mật khẩu Salted SHA-256 một chiều an toàn
│   │   ├── sound.ts                    # Bộ tổng hợp âm thanh Web Audio API (SoundFX)
│   │   └── validation.ts               # Bộ xác thực dữ liệu đầu vào & phòng chống CSV Formula Injection (OWASP)
│   ├── __tests__/                      # 77 bài kiểm thử đơn vị tự động (Vitest)
│   │   ├── businessRules.test.ts       # 42 tests: FSM hồ sơ, giới hạn 5 nguyện vọng, chặn nộp trùng, CSV escape
│   │   ├── adminAnalytics.test.ts      # 16 tests: Thống kê KPI, histogram 6 bucket, điểm TB 3 miền, top ngành
│   │   ├── authGateAndPanel.test.ts    # 5 tests: Rào quyền Auth Gate, xóa tài khoản khách, AI dock minimized
│   │   ├── errorBoundary.test.tsx      # 5 tests: Cơ chế bắt lỗi React Error Boundary & fallback UI
│   │   ├── aiChatService.test.ts       # 5 tests: Gọi Edge Function, multi-turn memory & fallback offline
│   │   └── edufair.test.ts             # 4 tests: Logic phân pha sự kiện upcoming / live / ended & countdown
│   ├── App.tsx                         # Bộ định tuyến cổng vai trò (Role Router), Quản lý Modal & Body Scroll Lock
│   ├── index.css                       # Hệ thống biến CSS, class .up-sidebar-scroll, chống tràn ngang (overflow-x: clip)
│   └── main.tsx                        # Điểm khởi tạo React 19 Root
```

---

## 3. KIẾN TRÚC LƯU TRỮ BỀN VỮNG HAI TẦNG (TWO-TIER PERSISTENCE ENGINE)

Trong `src/context/AppContext.tsx`, hệ thống tách bạch rõ ràng giữa **Kho Dữ liệu Liên thông Toàn Hệ thống** và **Kho Dữ liệu Cá nhân Từng Người dùng** trên `localStorage`, giúp toàn bộ luồng nghiệp vụ **Thí sinh ↔ ĐH Phú Xuân ↔ Admin** hoạt động bền vững ngay cả khi đăng xuất, chuyển đổi tài khoản hoặc tải lại trang (`F5`):

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

## 5. CƠ CHẾ AN TOÀN FRONTEND: ERROR BOUNDARY & APP LOADING SCREEN

1. **`AppLoadingScreen.tsx` (Màn hình Chờ Tải Chunk):**
   - Giải quyết triệt để lỗi màn hình trắng (Blank Screen) trong vài giây khi trình duyệt nạp các bundle mã nguồn được tách nhỏ bằng `React.lazy` (`AdminApp`, `UniversityApp`, `DesktopView`, `MobileView`).
   - Thiết kế Aurora loader đồng bộ với logo UniPath phát sáng, vòng xoay nhịp nhàng và thông báo trạng thái khởi động chuyên nghiệp.
2. **`ErrorBoundary.tsx` (Bộ Chặn Lỗi Runtime):**
   - Triển khai React Error Boundary theo chuẩn W3C ở cả cấp toàn ứng dụng (`App.tsx`) và bao quanh từng cổng ứng dụng.
   - Khi phát sinh lỗi JavaScript bất ngờ (Uncaught Exception), Error Boundary ngăn chặn hoàn toàn việc sập ứng dụng (Crash to White), hiển thị UI dự phòng thân thiện giải thích nguyên nhân và cung cấp 2 nút hành động: **Thử tải lại trang** hoặc **Khôi phục dữ liệu mẫu**.

---

## 6. PHÂN TÍCH NGUYÊN TẮC THIẾT KẾ SOLID & DESIGN PATTERNS TRONG MÃ NGUỒN

### 6.1. Áp dụng Nguyên tắc Đơn Trách Nhiệm (Single Responsibility Principle - SRP)
Kiến trúc mã nguồn của UniPath 2.0 phân tách rõ ràng trách nhiệm của từng tầng module, đảm bảo mỗi tệp mã nguồn chỉ có một lý do duy nhất để thay đổi:

1. **Quản lý Trạng thái Nghiệp vụ (`src/context/AppContext.tsx`):**
   - Đảm nhận duy nhất việc điều phối trạng thái toàn cục (State Orchestration), lưu trữ bền vững (Persistence Engine) và phân quyền vai trò người dùng (RBAC).
   - Tuyệt đối không chứa logic tính toán xác suất trúng tuyển hay quy tắc chuyển đổi trạng thái hồ sơ chuyên sâu.
2. **Thuần toán học & Dự báo Tuyển sinh (`src/services/MatchingService.ts`):**
   - Đóng gói toàn bộ thuật toán khớp nguyện vọng AI Matching dưới dạng các hàm thuần túy (**Pure Functions**): `calculateSingleMatch`, `evaluateMatching`, `pickReferenceCutoff`.
   - Đầu vào là điểm số và thông số trường; đầu ra là kết quả đối soát. Module này hoàn toàn độc lập với React DOM, không gọi `useState` hay phụ thuộc UI.
3. **Máy Trạng Thái Hồ Sơ Tuyển Sinh (`src/services/ApplicationWorkflow.ts`):**
   - Chịu trách nhiệm duy nhất về máy trạng thái hữu hạn (**FSM - Finite State Machine**) cho hội đồng thẩm định: xác thực bước chuyển hợp lệ, bắt buộc giải trình khi điểm dưới chuẩn ngành, ngăn chặn hồi sinh hồ sơ đã kết thúc.
4. **Tầng Giao diện Người dùng (Presentation Layer - `src/components/`):**
   - Các components như `AdminApp.tsx`, `UniversityApp.tsx`, `DesktopView.tsx` chỉ tập trung vào việc hiển thị dữ liệu, bắt cử chỉ người dùng và ánh xạ giao diện theo các Design Tokens chuẩn hóa.
5. **Bộ Chuyển Đổi Tích Hợp Đám Mây (`src/lib/supabase.ts`):**
   - Đóng vai trò lớp đồng bộ dữ liệu (Sync Adapter), bảo bọc các lệnh gọi REST API tới Supabase Backend và tự động fallback về bộ nhớ cục bộ khi mất kết nối mạng.

### 6.2. Các Mẫu Thiết Kế Thực Tế Đã Sử Dụng (Real-World Design Patterns)
- **Context / Provider Pattern (`React.createContext` & `AppProvider`):**  
  Giải quyết triệt để vấn đề *Prop Drilling*, cho phép mọi thành phần trong cây DOM đều có thể truy xuất dữ liệu dùng chung và các hàm cập nhật trạng thái một cách phản ứng (Reactive).
- **Service Layer Pattern:**  
  Toàn bộ logic nghiệp vụ cốt lõi tập trung tại thư mục `src/services/`. Nhờ đó, logic tính điểm và xét duyệt hồ sơ được kiểm thử độc lập 100% bằng 77 bài Unit Tests tự động.
- **Adapter Pattern (`src/lib/supabase.ts`):**  
  Cung cấp giao diện đồng nhất (`SupabaseDataService`) bao bọc phía trên Supabase PostgREST API, hỗ trợ chuyển đổi snake_case sang camelCase và tự động fallback về Mock Store an toàn.
- **Strategy Pattern (Thuật toán Chọn Ngành Tham Chiếu Tuyển Sinh):**  
  Hàm `pickReferenceCutoff` trong `MatchingService.ts` linh hoạt thay đổi chiến lược chọn ngành tham chiếu theo Khối thi, mã Holland RIASEC, hoặc độ lệch điểm số tiệm cận gần nhất.
