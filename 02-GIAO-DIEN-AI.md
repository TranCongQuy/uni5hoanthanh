# 🎨 02-GIAO-DIEN-AI.md: THIẾT KẾ GIAO DIỆN THÍCH ỨNG KÉP & TRẢI NGHIỆM TƯƠNG TÁC AI
> **Hệ sinh thái Tuyển sinh & Định hướng Nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Kỹ sư phát triển phần mềm:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. KIẾN TRÚC GIAO DIỆN THÍCH ỨNG KÉP TỰ ĐỘNG (DUAL-ENGINE ADAPTIVE UI)

UniPath 2.0 được thiết kế với triết lý **nhận diện ngữ cảnh thiết bị tự động 100%** tại ngưỡng điểm ngắt chuẩn `1024px`:

1. **Giao diện Di động & Máy tính bảng dọc (`< 1024px` — `MobileView`):**
   - Khung ứng dụng tối ưu cho thao tác chạm một tay, thanh điều hướng đáy 5 phân hệ (**Bottom Navigation Bar**), các hộp thoại trượt mượt từ cạnh dưới màn hình (**Bottom-Sheet Modals**).
   - Khi chưa đăng nhập trên thiết bị di động, người dùng được dẫn dắt qua màn hình chào mừng `OnboardingModal` (3 bước giới thiệu giá trị cốt lõi) và `AuthScreen` (hỗ trợ cả chế độ Khách trải nghiệm).
2. **Giao diện Máy tính & Màn hình rộng (`≥ 1024px` — `DesktopView`):**
   - Bố cục không gian làm việc rộng tối đa `1380px`, thanh điều hướng cố định đỉnh trang (**Sticky Header**), lưới thẻ trường đại học đa cột, bảng điều khiển AI Matching 2 cột song song và các hộp thoại căn giữa màn hình (**Centered Dialogs**) với nền kính mờ `backdrop-filter: blur(8px)`.
   - Người dùng truy cập từ máy tính vào thẳng không gian khám phá chung mà không bị chặn bởi màn hình khóa, chỉ yêu cầu xác thực qua `AuthModal` khi thực hiện các thao tác ghi dữ liệu cá nhân.
3. **Không nút chuyển chế độ thủ công – Không thông báo gây nhiễu:**
   - Hệ thống lắng nghe trực tiếp sự kiện thay đổi kích thước khung nhìn (`window.innerWidth < 1024`) để chuyển đổi bố cục tự nhiên trên cả 3 cổng (`Student`, `University PXU`, `Admin`).
   - Hoàn toàn **loại bỏ các nút bấm chuyển đổi Mobile/Desktop thủ công** và **không hiển thị bất kỳ thông báo toast chuyển giao diện nào**, đảm bảo trải nghiệm chuẩn ứng dụng thương mại thực tế.

---

## 2. HỆ THỐNG MÀU SẮC, TYPOGRAPHY & CAM KẾT CHỐNG TRÀN (ZERO OVERFLOW)

### 2.1. Hệ thống Nhận diện 3 Cổng Độc lập ("Nhìn 3 Giây Hiểu Ngay" — UI/UX 3.0)
- **Cổng Thí sinh (`MobileView` / `DesktopView` — Clean White & Royal Blue `#2563EB`):** Không gian học thuật sáng thoáng, tích hợp **Thanh Hành trình Chọn Trường 4 Bước** trên Trang chủ, băng chuyền trường nổi bật điều khiển chủ động (không tự nhảy gây rối mắt), và Trung tâm Hồ sơ Tab 4 phân tách rõ **3 tab con** (`Hồ sơ xét tuyển` | `Lịch tư vấn 1-1` | `Trường đã lưu`) kèm **Banner cảnh báo ưu tiên** khi trúng tuyển sớm hoặc thiếu minh chứng.
- **Cổng ĐH Phú Xuân (`UniversityApp.tsx` — Executive Emerald `#064E3B` & `#059669` trên nền `#F8FAFC`):** Giao diện CRM Tuyển sinh hiện đại với Sidebar trái cố định, **Bộ đối soát Điểm thí sinh vs Điểm chuẩn ngành PXU & Gợi ý Học bổng OJT tự động**, chip phản hồi nhanh 1-Click và bảng điều phối lịch hẹn 1-1 dạng **Kanban 3 cột** (`Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`).
- **Cổng Quản trị Hệ thống (`AdminApp.tsx` — Deep Slate Navy `#0F172A` & Indigo `#4F46E5`):** Trung tâm điều hành SaaS toàn quốc với 4 thẻ KPI bấm lọc tức thì, phễu xét tuyển 4 giai đoạn, bảng dữ liệu chuẩn SaaS (`.up-table`) kết hợp **Smart Inspector Panel** (tiến trình 3 bước, thanh so sánh điểm chuẩn, chip ghi chú nhanh) và bảng 30 trường sửa trực tiếp trên dòng.
- **Menu Tài khoản & Chuyển vai trò 1-Click (`AccountRoleMenu.tsx`):** Đồng bộ ở góc phải trên cùng của cả 3 cổng, hiển thị rõ vai trò hiện tại và cho phép chuyển nhanh giữa `Thí sinh` ↔ `ĐH Phú Xuân` ↔ `Admin` hoặc đăng xuất chỉ với 1 cú nhấp chuột.

### 2.2. Kỹ thuật chống tràn ngang tuyệt đối (`360px` → `1920px`)
- Sử dụng `overflow-x: clip` trên `html, body` và `#root` thay vì `overflow-x: hidden`, vừa triệt tiêu 100% thanh cuộn ngang ngoài ý muốn vừa bảo toàn hoạt động chuẩn xác của các thanh tiêu đề `position: sticky`.
- Toàn bộ thanh Header trên Desktop (`1024px+`) và Mobile (`360px+`) được tính toán ngân sách chiều rộng chi tiết: sử dụng `min-width: 0` cho khối flex con, `text-overflow: ellipsis` cho tên người dùng/tên trường dài, và `flex-shrink: 0` cùng `white-space: nowrap` cho các nút hành động quan trọng.
- Các bảng dữ liệu quản trị trên `AdminApp` và `UniversityApp` tự động chuyển đổi giữa dạng bảng đa cột trên Desktop và dạng danh sách thẻ gọn gàng trên màn hình di động nhỏ.

---

## 3. TRẢI NGHIỆM TƯƠNG TÁC AI MATCHING & CỐ VẤN ẢO 24/7

### 3.1. Cơ chế "Chốt thông số chủ động" trên AI Matching 2026
- Khi thí sinh kéo thanh trượt *Điểm dự kiến* hoặc *Ngân sách học phí*, giao diện chuyển sang trạng thái chờ xác nhận thay vì tự động nhảy kết quả liên tục, giúp học sinh chủ động kiểm soát từng kịch bản đối soát.
- Ngay khi nhấn **"Phân tích cơ hội trúng tuyển"**, hệ thống hiển thị thẻ xác nhận thông số kèm dấu thời gian phân tích, biểu đồ tròn tiến độ (`DonutChart`), tên ngành tham chiếu phù hợp nhất (`matchedMajor`), mức điểm chuẩn ngành (`majorCutoff`) và bộ đôi nút hành động **Tư vấn 1-1** + **Chi tiết**.

### 3.2. Trợ lý AI Tuyển sinh 24/7 (`ChatBotModal`)
- Tích hợp bộ nhận diện ngữ cảnh thông minh về điểm chuẩn 30 trường, tư vấn khối thi, học bổng doanh nghiệp OJT tại ĐH Phú Xuân, so sánh ngành CNTT – Kinh tế – Ngôn ngữ và hướng dẫn quy trình xét tuyển sớm.
- Lưu trữ lịch sử hội thoại tách biệt theo từng tài khoản người dùng (`unipath_chat_history_${email}`), đảm bảo quyền riêng tư khi nhiều thí sinh dùng chung một thiết bị.

---

## 4. ĐỒ HỌA DỮ LIỆU SVG THUẦN & ÂM THANH TỔNG HỢP WEB AUDIO API

### 4.1. Bộ 3 Biểu đồ SVG Thuần (Zero Heavy Chart Libraries)
1. **`RadarChart.tsx`:** Biểu đồ mạng nhện đa giác 6 trục biểu diễn kết quả Holland RIASEC với lưới tỷ lệ đồng tâm và vùng phủ bán trong suốt trực quan.
2. **`DonutChart.tsx`:** Biểu đồ vòng tròn phần trăm thể hiện xác suất trúng tuyển của từng trường đại học với màu sắc tự động thích ứng theo ngưỡng điểm.
3. **`LineChart.tsx`:** Biểu đồ xu hướng biến động điểm chuẩn 3 năm liên tiếp (`2022 – 2023 – 2024`), hỗ trợ học sinh đánh giá độ ổn định đầu vào của từng trường.

### 4.2. Bộ Tổng hợp Âm thanh Không Độ Trễ (`src/utils/sound.ts`)
- Sử dụng trực tiếp **Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`)** để tạo âm thanh tương tác thời gian thực (*click*, *hoàn thành bài trắc nghiệm*, *vỗ tay*, *thả tim*, *nộp hồ sơ thành công*) mà không cần tải bất kỳ tệp âm thanh `.mp3` ngoài nào, hoạt động mượt mà ngay cả khi mất kết nối mạng.
- Người dùng có thể bật/tắt hiệu ứng âm thanh bất kỳ lúc nào trong hộp thoại **`SettingsModal`**.
