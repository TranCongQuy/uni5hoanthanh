# 🎨 02-GIAO-DIEN-AI.md: THIẾT KẾ GIAO DIỆN RESPONSIVE & TRẢI NGHIỆM TƯƠNG TÁC AI
> **Hệ sinh thái Tuyển sinh & Định hướng nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Phát triển phần mềm & Kỹ sư ứng dụng:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. TRIẾT LÝ THIẾT KẾ ĐA NỀN TẢNG (DUAL-ENGINE ADAPTIVE UI)

UniPath 2.0 ứng dụng kiến trúc **Giao diện thích ứng kép (Dual-Engine Adaptive Interface)**:
1. **Thiết bị Di động & Máy tính bảng (< 1024px):** Trải nghiệm **Mobile-First Native App** với thanh điều hướng 5 tab gắn đáy (Bottom Navigation Bar), các hộp thoại trượt từ đáy (Bottom Sheets), cử chỉ chạm vuốt tối ưu cho một tay.
2. **Laptop & Màn hình máy tính để bàn ($\ge$ 1024px):** Trải nghiệm **Desktop Widescreen Workspace** với container mở rộng tối đa 1380px, lưới dữ liệu đa cột (Multi-column responsive grid), thanh điều hướng sticky topbar, sidebar phân tích cơ hội trúng tuyển thông minh.

### 1.1. Cơ chế Nhận diện Màn hình Tự động (Zero-Notification Auto Detection)
- Không bắt buộc người dùng phải nhấn nút chuyển chế độ thủ công.
- Hệ thống tự động lắng nghe kích thước khung nhìn `window.innerWidth` tại điểm ngắt `1024px` thông qua sự kiện `resize`.
- Quá trình chuyển đổi diễn ra hoàn toàn mượt mà, **không xuất hiện bất kỳ thông báo toast hay popup gây gián đoạn**, mang lại trải nghiệm chuyên nghiệp chuẩn quốc tế.

---

## 2. HỆ THỐNG MÀU SẮC, TYPOGRAPHY & CHỐNG TRÀN GIAO DIỆN (ZERO OVERFLOW)

### 2.1. Bảng màu chủ đạo (Color Palette)
- **Primary Blue (`#2563EB`, `#1D4ED8`):** Đại diện cho tri thức, sự tin cậy và công nghệ tuyển sinh chuẩn quốc gia.
- **Academic Emerald (`#10B981`, `#059669`):** Màu nhận diện thương hiệu của Trường Đại học Phú Xuân (PXU), biểu trưng cho cơ hội phát triển bền vững và mô hình OJT thực chiến.
- **Amber Gold (`#F59E0B`, `#D97706`):** Đại diện cho các chứng nhận xuất sắc, học bổng tài năng và phân loại cơ hội mục tiêu.
- **Crimson Alert (`#EF4444`, `#DC2626`):** Cảnh báo điểm sàn, trạng thái hủy hồ sơ và phiên LIVE phát sóng trực tiếp.
- **Neutral Slate (`#0F172A`, `#334155`, `#64748B`, `#F8FAFC`):** Hệ thống phông nền và độ tương phản văn bản đạt chuẩn tiếp cận WCAG 2.1 AA.

### 2.2. Kỹ thuật Triệt Tiêu Lỗi Tràn Nút Bấm & Khung Viền (Zero Overflow Guarantee)
Toàn bộ các thành phần giao diện trên UniPath 2.0 được áp dụng tiêu chuẩn chống tràn nghiêm ngặt:
- Khung hiển thị cha luôn khai báo `box-sizing: border-box`, `max-width: 100%`.
- Mọi nút bấm văn bản có thuộc tính `white-space: nowrap`, `flex-shrink: 0`, đi kèm padding linh hoạt (`clamp` hoặc rem) đảm bảo không bị cắt chữ trên màn hình nhỏ.
- Tiêu đề và tên trường học sử dụng kỹ thuật `text-overflow: ellipsis`, `overflow: hidden` khi hiển thị trên các khối thẻ thu gọn.

---

## 3. THIẾT KẾ TRẢI NGHIỆM AI MATCHING & LOGIC CHỐT THÔNG SỐ

### 3.1. Giao diện 3 Cột Trực Quan trên Desktop
- **Cột Trái (Bộ lọc & Thanh trượt thông số):**
  - Slider Điểm thi THPT dự kiến: Bước nhảy 0.25đ, dải 10.0đ - 30.0đ, phím chọn nhanh điểm mốc (18đ, 21đ, 24đ, 27đ, 29đ).
  - Slider Ngân sách học phí tối đa: Bước nhảy 1 triệu, dải 10tr - 50tr/năm, phím chọn nhanh (15tr, 25tr, 35tr, 50tr).
  - Nút chọn Vùng miền: `Tất cả` | `Bắc` | `Trung` | `Nam`.
  - Nút kích hoạt: **"⚡ Phân tích cơ hội trúng tuyển ngay"**.
- **Cột Giữa (Thống kê & Nhóm trường trúng tuyển cao):**
  - Bảng báo cáo phân tích thực tế: Hiển thị thời gian phân tích, số trường thỏa mãn điều kiện.
  - Thẻ trường học chi tiết: Logo, mã trường, điểm sàn 2024, học phí dự kiến, xác suất trúng tuyển theo %.
- **Cột Phải (Nhóm trường Vừa sức & Nhóm trường Thử thách):**
  - Phân nhóm màu sắc rõ ràng (Xanh lá, Vàng, Đỏ).
  - Nút Nộp hồ sơ xét tuyển nhanh hoặc Thêm vào danh sách so sánh.

### 3.2. Cơ chế Ngăn Ngừa Phân Tích Tự Động Gây Nhiễu
- Khi người dùng kéo các thanh trượt điểm/học phí, hệ thống **không tự động phân tích tức thì** để tránh gây quá tải CPU và giật khung hình.
- Nút bấm đổi sang trạng thái nổi bật kích hoạt.
- Khi người dùng nhấn nút **"Phân tích cơ hội trúng tuyển ngay"**, hệ thống phát hiệu ứng âm thanh click êm dịu, tiến hành tính toán và render ngay bảng thông báo đã phân tích thành công với đúng dữ liệu vừa chọn.

---

## 4. HỆ THỐNG HIỆU ỨNG TƯƠNG TÁC ĐA GIÁC QUAN (WEB AUDIO API & PARTICLES)

UniPath 2.0 là nền tảng tuyển sinh tiên phong tại Việt Nam tích hợp **Web Audio API** tổng hợp âm thanh thực thời gian thực (Real-time Audio Synthesis) mà không phụ thuộc vào các tệp MP3 ngoài mạng:

### 4.1. Bộ Tổng Hợp Âm Thanh Thuần (SoundFX Synthesizer)
- **Hiệu ứng Vỗ tay (Clap):** Sử dụng bộ dao động sóng tam giác (Triangle Oscillator) ở tần số bổng kết hợp giải thuật làm mờ biên độ (Exponential Decay), mô phỏng tiếng vỗ tay giòn giã tại hội trường.
- **Hiệu ứng Thả tim (Heartbeat):** Sử dụng sóng hình sin (Sine Wave) ở tần số trầm (120Hz $\rightarrow$ 60Hz) tạo cảm giác nhịp tim ấm áp và cảm xúc.
- **Hiệu ứng Thích (Like):** Tổng hợp chuỗi 2 nốt nhạc thăng hoa (Chime C5 $\rightarrow$ G5) mang lại phản hồi tích cực.

### 4.2. Hiệu ứng Hạt Bay Lơ Lửng (Floating Particle System)
- Khi người dùng nhấn các nút cảm xúc trong phiên EduFair LIVE, các hạt icon (👏, ❤️, 👍) được khởi tạo với tọa độ ngang ngẫu nhiên $x \in [-18px, +18px]$ và góc quay ngẫu nhiên $\theta \in [-20^\circ, +20^\circ]$.
- Hạt bay bổng dần lên độ cao 70px theo hàm gia tốc mượt mà `cubic-bezier(0.22, 1, 0.36, 1)` và tự giải phóng bộ nhớ sau 800ms.

---

## 5. HỆ THỐNG BIỂU ĐỒ TRỰC QUAN HÓA DỮ LIỆU ĐỒ HỌA (DATA VISUALIZATION)

1. **Biểu đồ Mạng nhện 6 trục (SVG Radar Chart):**
   - Biểu diễn trực quan kết quả 6 nhóm tính cách Holland RIASEC.
   - Vẽ bằng SVG thuần với đa giác nền phân tầng 25%, 50%, 75%, 100%.
   - Tô màu gradient bán trong suốt giúp thí sinh dễ dàng nhận diện điểm mạnh và thiên hướng nghề nghiệp.
2. **Biểu đồ Tròn Phân bố Học phí (SVG Donut Chart):**
   - Phân khúc mức học phí của 30 trường đại học thành các dải: < 15tr, 15-25tr, 25-35tr, > 35tr/năm.
3. **Biểu đồ Đường Lịch sử Điểm chuẩn (SVG Line Chart):**
   - So sánh diễn biến điểm chuẩn trúng tuyển qua 3 mùa tuyển sinh (2022, 2023, 2024) của từng trường đại học mục tiêu.

---

## 6. ĐƠN VỊ THỰC HIỆN & BẢN QUYỀN GIAO DIỆN

Toàn bộ thiết kế giao diện và trải nghiệm người dùng thuộc bản quyền sở hữu của:
* 🏛️ **Đơn vị chủ quản & Đào tạo:** **Trường Đại học Phú Xuân (PXU)**
* 👥 **Nhóm nghiên cứu & phát triển UP5:**
  * 👑 **Trưởng nhóm:** **Dương Đình Phát**
  * 💻 **Kỹ sư phát triển phần mềm:** **Trần Công Quý**
  * 🤝 **Thành viên:** **Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga**
