# 🎨 02-GIAO-DIEN-AI.md: THIẾT KẾ GIAO DIỆN THÍCH ỨNG KÉP & TRẢI NGHIỆM TƯƠNG TÁC AI
> **Hệ sinh thái Tuyển sinh & Định hướng Nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Kỹ sư phát triển phần mềm:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. KIẾN TRÚC GIAO DIỆN THÍCH ỨNG KÉP & RÀO CHẮN AUTH GATE

UniPath 2.0 được thiết kế với triết lý **nhận diện ngữ cảnh thiết bị tự động 100%** tại ngưỡng điểm ngắt chuẩn `1024px`, đồng thời bảo đảm an toàn dữ liệu qua cơ chế **Auth Gate**:

1. **Rào chắn Xác thực Auth Gate (Áp dụng đồng bộ trên cả Mobile & Desktop):**
   - Người dùng chưa đăng nhập bắt buộc phải xác thực danh tính qua `AuthScreen` trước khi truy cập bất kỳ phân hệ nào.
   - Hỗ trợ 2 tab chuyên nghiệp: **Đăng nhập** và **Tạo tài khoản thí sinh mới**.
   - Trang bị 3 thẻ tài khoản mẫu định cấu hình sẵn (**Điền nhanh 1-Click** cho Thí sinh, Ban Tuyển sinh PXU, và Admin Hệ thống) phục vụ kiểm thử và đánh giá của Hội đồng chấm thi.
   - **Xóa bỏ hoàn toàn chế độ Khách vãng lai** để loại trừ mọi nguy cơ rò rỉ phiên làm việc hoặc xung đột dữ liệu.
2. **Giao diện Di động & Máy tính bảng dọc (`< 1024px` — `MobileView`):**
   - Khung ứng dụng tối ưu cho thao tác chạm một tay, thanh điều hướng đáy 5 phân hệ (**Bottom Navigation Bar**), các hộp thoại trượt mượt từ cạnh dưới màn hình (**Bottom-Sheet Modals**).
3. **Giao diện Máy tính & Màn hình rộng (`≥ 1024px` — `DesktopView`):**
   - Bố cục không gian làm việc rộng tối đa `1380px`, thanh điều hướng cố định đỉnh trang (**Sticky Header**), lưới thẻ trường đại học đa cột, bảng điều khiển AI Matching 2 cột song song và các hộp thoại căn giữa màn hình (**Centered Dialogs**) với nền kính mờ `backdrop-filter: blur(8px)`.
4. **Không nút chuyển chế độ thủ công – Không thông báo gây nhiễu:**
   - Hệ thống lắng nghe trực tiếp sự kiện thay đổi kích thước khung nhìn (`window.innerWidth < 1024`) để chuyển đổi bố cục tự nhiên trên cả 3 cổng (`Student`, `University PXU`, `Admin`).
   - Hoàn toàn **loại bỏ các nút bấm chuyển đổi Mobile/Desktop thủ công** và **không hiển thị bất kỳ thông báo toast chuyển giao diện nào**, đảm bảo trải nghiệm chuẩn ứng dụng thương mại thực tế.

---

## 2. HỆ THỐNG MÀU SẮC AURORA, TYPOGRAPHY & KIẾN TRÚC SIDEBAR 3 TẦNG

### 2.1. Hệ thống Nhận diện 3 Cổng Độc lập (Aurora Deep Tech Language)
- **Cổng Thí sinh (`MobileView` / `DesktopView` — Aurora Blue `#0A1128` & Indigo `#4F46E5`):** Không gian học thuật chiều sâu với mesh gradient, tích hợp **Thanh Hành trình Chọn Trường 4 Bước**, thẻ trường `UniversityCard` hiển thị ảnh campus thật 30/30 trường, dock Trợ lý AI cố định góc phải màn hình, và Trung tâm Hồ sơ Tab 4 phân tách rõ 3 tab con (`Hồ sơ xét tuyển` | `Lịch tư vấn 1-1` | `Trường đã lưu`).
- **Cổng ĐH Phú Xuân (`UniversityApp.tsx` — Emerald Aurora `#022C22` → `#0F766E`):** Giao diện CRM Tuyển sinh hiện đại với thanh điều hướng 3 tầng cố định bên trái, **Bộ tự động đối soát Điểm thí sinh vs Điểm chuẩn ngành PXU & Gợi ý Học bổng OJT**, chip phản hồi nhanh 1-Click và bảng điều phối lịch hẹn 1-1 dạng **Kanban 3 cột** (`Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`).
- **Cổng Quản trị Hệ thống (`AdminApp.tsx` — Deep Aurora Navy `#050B14` → `#1C2541`):** Trung tâm điều hành SaaS toàn quốc với thanh điều hướng 3 tầng cố định, **Tab Benchmark 30 trường** (biểu đồ cột phân bố điểm 6 phân khoảng, điểm TB 3 miền, top ngành), **Tab Quản trị hệ thống** (giám sát Supabase Cloud, LocalStorage, Audit Log), **Global Search (`Ctrl + K`)**, và bảng 30 trường sửa trực tiếp trên dòng.
- **Menu Tài khoản & Chuyển vai trò 1-Click (`AccountRoleMenu.tsx`):** Đồng bộ ở góc phải trên cùng của cả 3 cổng, hiển thị rõ vai trò hiện tại và cho phép chuyển nhanh giữa `Thí sinh` ↔ `ĐH Phú Xuân` ↔ `Admin` hoặc đăng xuất chỉ với 1 cú nhấp chuột.

### 2.2. Kiến Trúc Thanh Điều Hướng Cố Định 3 Tầng (3-Tier Fixed Sidebar)
Thanh điều hướng bên trái trên Cổng Admin và PXU được tái cấu trúc thành 3 khối chuyên biệt:
1. **Pinned Top Header (`flexShrink: 0`)**: Ghim logo và thương hiệu cổng luôn nằm ở đỉnh (`top: 0`), không bao giờ bị cuộn mất.
2. **Scrollable Middle Nav (`flex: 1; minHeight: 0; overflowY: 'auto'`)**: Sử dụng class `.up-sidebar-scroll` với thanh cuộn mỏng (5px), mượt mà, cho phép lướt lên / lướt xuống độc lập mà không che khuất header hay footer.
3. **Pinned Bottom Footer (`flexShrink: 0`)**: Neo trạng thái đồng bộ & nút khôi phục (Admin) hoặc Thẻ bảo mật phân lập dữ liệu (PXU) luôn ở đáy màn hình (`bottom: 0`) với hiệu ứng `backdrop-filter: blur(8px)`.
4. **Vùng nội dung bên phải**: Đặt `marginLeft: 260px` (Admin) và `marginLeft: 256px` (PXU) chống đè layout.

### 2.3. Kỹ thuật chống tràn ngang tuyệt đối (`360px` → `1920px`)
- Sử dụng `overflow-x: clip` trên `html, body` và `#root` thay vì `overflow-x: hidden`, vừa triệt tiêu 100% thanh cuộn ngang ngoài ý muốn vừa bảo toàn hoạt động chuẩn xác của các thanh tiêu đề `position: sticky`.
- Toàn bộ thanh Header trên Desktop (`1024px+`) và Mobile (`360px+`) được tính toán ngân sách chiều rộng chi tiết: sử dụng `min-width: 0` cho khối flex con, `text-overflow: ellipsis` cho tên người dùng/tên trường dài, và `flex-shrink: 0` cùng `white-space: nowrap` cho các nút hành động quan trọng.

---

## 3. TRẢI NGHIỆM TƯƠNG TÁC AI MATCHING & CỐ VẤN DOCK 24/7

### 3.1. Cơ chế "Chốt thông số chủ động" trên AI Matching 2026
- Khi thí sinh kéo thanh trượt *Điểm dự kiến* hoặc *Ngân sách học phí*, giao diện chuyển sang trạng thái chờ xác nhận thay vì tự động nhảy kết quả liên tục, giúp học sinh chủ động kiểm soát từng kịch bản đối soát.
- Ngay khi nhấn **"Phân tích cơ hội trúng tuyển"**, hệ thống hiển thị thẻ xác nhận thông số kèm dấu thời gian phân tích, biểu đồ tròn tiến độ (`DonutChart`), tên ngành tham chiếu phù hợp nhất (`matchedMajor`), mức điểm chuẩn ngành (`majorCutoff`) và bộ đôi nút hành động **Tư vấn 1-1** + **Chi tiết**.

### 3.2. Trợ lý Tuyển sinh Dock Cố Định (`AIAssistantDock.tsx`)
- Tích hợp dock cố định ở góc dưới bên phải màn hình desktop, mặc định ở trạng thái thu nhỏ gọn gàng, hỗ trợ mở rộng trò chuyện linh hoạt.
- Tích hợp bộ nhận diện ngữ cảnh thông minh về điểm chuẩn 30 trường đại học và chương trình đào tạo thực chiến OJT tại ĐH Phú Xuân.
- Trang bị **bộ nhớ hội thoại đa lượt (Multi-turn Context Memory)** giúp AI duy trì mạch tư vấn liên tục, kết nối với Edge Function Gemini Flash an toàn và tự động chuyển đổi sang bộ dự phòng offline khi mất kết nối mạng.

---

## 4. ĐỒ HỌA DỮ LIỆU SVG THUẦN & ÂM THANH TỔNG HỢP WEB AUDIO API

### 4.1. Bộ Biểu đồ SVG Thuần (Zero Heavy Chart Libraries)
1. **`BenchmarkHistogram.tsx`:** Biểu đồ cột phân bố điểm chuẩn 6 phân khoảng chuẩn hóa (`< 20đ`, `20 - 21.9đ`, `22 - 23.9đ`, `24 - 25.9đ`, `26 - 27.9đ`, `≥ 28đ`) trên Cổng Admin.
2. **`RadarChart.tsx`:** Biểu đồ mạng nhện đa giác 6 trục biểu diễn kết quả Holland RIASEC với lưới tỷ lệ đồng tâm và vùng phủ bán trong suốt trực quan.
3. **`DonutChart.tsx`:** Biểu đồ vòng tròn phần trăm thể hiện xác suất trúng tuyển của từng trường đại học với màu sắc tự động thích ứng theo ngưỡng điểm.
4. **`LineChart.tsx`:** Biểu đồ xu hướng biến động điểm chuẩn 3 năm liên tiếp (`2022 – 2023 – 2024`), hỗ trợ học sinh đánh giá độ ổn định đầu vào của từng trường.

### 4.2. Bộ Tổng hợp Âm thanh Không Độ Trễ (`src/utils/sound.ts`)
- Sử dụng trực tiếp **Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`)** để tạo âm thanh tương tác thời gian thực (*click*, *hoàn thành bài trắc nghiệm*, *vỗ tay*, *thả tim*, *nộp hồ sơ thành công*) mà không cần tải bất kỳ tệp âm thanh `.mp3` ngoài nào, hoạt động mượt mà ngay cả khi mất kết nối mạng.
- Người dùng có thể bật/tắt hiệu ứng âm thanh bất kỳ lúc nào trong hộp thoại **`SettingsModal`**.
