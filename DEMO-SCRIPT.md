# Kịch Bản Trình Diễn Đồ Án 5 Phút (Demo Script)
> **Dự án:** UniPath 2.0 — Hệ Thống Tuyển Sinh & Định Hướng Nghề Nghiệp Thông Minh  
> **Thời lượng chuẩn:** Đúng 5 phút (300 giây)  
> **Trình diễn viên:** Kỹ sư phát triển phần mềm & Nhóm UP5  
> **Môi trường:** Production Web (`https://uni5hoanthanh.vercel.app`)

---

## Bảng Phân Bổ Thời Gian Chi Tiết (5-Minute Timeline)

```
00:00 ───[ Phút 1: Khởi động & Trắc nghiệm Holland RIASEC ]─── 01:00
01:00 ───[ Phút 2: AI Matching Xác Suất Trúng Tuyển 30 ĐH ]── 02:00
02:00 ───[ Phút 3: Nộp Hồ Sơ Xét Tuyển Sớm Trực Tuyến ]─────── 03:00
03:00 ───[ Phút 4: Cổng Thẩm Định Hồ Sơ ĐH Phú Xuân (PXU) ]─── 04:00
04:00 ───[ Phút 5: Bảng Điều Khiển Quản Trị Cấp Cao (Admin) ]─ 05:00
```

---

### PHÚT 1 (00:00 – 01:00): KHỞI ĐỘNG & ĐỊNH HƯỚNG HOLLAND RIASEC
- **Màn hình hiển thị:** Tab 1 (Trang chủ) → Chuyển sang Tab 2 (Trắc nghiệm Holland).
- **Thao tác thực hiện:**
  1. Mở trang chủ UniPath 2.0 ở chế độ Thí sinh. Nhấn vào mục *"Trắc nghiệm Holland"*.
  2. Trả lời nhanh 12 câu hỏi trắc nghiệm tâm lý nghề nghiệp đã chuẩn hóa.
  3. Hoàn thành và kích hoạt pháo hoa ăn mừng; xem biểu đồ Radar Chart 6 trục SVG hiển thị nhóm tính cách nổi trội (ví dụ: `E - Quản lý` hoặc `R - Kỹ thuật`).
- **Lời thoại mẫu (Spoken Script):**
  > *"Kính thưa Hội đồng, em xin bắt đầu buổi demo với vai trò một thí sinh lớp 12 chuẩn bị xét tuyển đại học năm 2026. Thay vì chọn ngành theo cảm tính, em bắt đầu với bài trắc nghiệm tâm lý nghề nghiệp Holland RIASEC gồm 12 câu hỏi chuẩn hóa. Hệ thống xử lý đồng điểm thông minh và trực quan hóa ngay trên biểu đồ mạng nhện SVG 6 trục, xác định nhóm năng khiếu nổi trội của em là nhóm E - Quản lý và I - Nghiên cứu."*

---

### PHÚT 2 (01:00 – 02:00): ĐỘNG CƠ AI MATCHING XÁC SUẤT TRÚNG TUYỂN
- **Màn hình hiển thị:** Tab 3 (AI Matching).
- **Thao tác thực hiện:**
  1. Nhập điểm thi dự kiến: `24.5` điểm, chọn tổ hợp khối `A00`, đặt ngân sách học phí `<= 25 triệu/năm`.
  2. Bấm *"Phân tích AI"*.
  3. Quan sát kết quả đối soát tức thì: 30 trường đại học được phân thành 3 nhóm rõ rệt: **An toàn (>= 80%)**, **Vừa sức (50% - 79%)**, và **Thách thức (< 50%)**.
  4. Chỉ ra bộ lọc ngân sách đã loại trừ chính xác các trường có học phí vượt 25tr (như UET, UIT, UEH) và hiển thị số lượng trường đã lọc.
- **Lời thoại mẫu (Spoken Script):**
  > *"Sau khi có nhóm nghề nghiệp, em sang phân hệ AI Matching. Với điểm thi dự kiến 24.5đ khối A00 và ngân sách gia đình dưới 25 triệu/năm, AI Matching không chấm điểm chung chung cho cả trường mà tự động khớp theo điểm chuẩn từng ngành cụ thể. Động cơ áp dụng công thức tiệm cận mượt, trần tối đa 98%, đồng thời bộ lọc ngân sách loại bỏ hoàn toàn các trường học phí cao, giúp thí sinh xây dựng chiến lược đặt nguyện vọng thực tế."*

---

### PHÚT 3 (02:00 – 03:00): NỘP HỒ SƠ XÉT TUYỂN SỚM TRỰC TUYẾN
- **Màn hình hiển thị:** Mở Modal Chi tiết Trường ĐH Phú Xuân (PXU) → Bấm *"Nộp hồ sơ xét tuyển"*.
- **Thao tác thực hiện:**
  1. Bấm vào thẻ trường **Đại học Phú Xuân (PXU)**, chọn ngành **Công nghệ thông tin** (chuẩn ngành `24.5đ`).
  2. Điền thông tin thí sinh: Họ tên, số điện thoại Việt Nam, điểm xét tuyển.
  3. Bấm *"Xác nhận nộp hồ sơ"*.
  4. Hệ thống sinh mã hồ sơ tự động `HS-2026-PXUxxxx`, kích hoạt kiểm tra FSM (chặn nộp trùng cùng ngành, giới hạn tối đa 5 nguyện vọng đang hoạt động). Chuyển sang Tab Cá nhân để xem hồ sơ đang ở bước *"Đang xét duyệt"*.
- **Lời thoại mẫu (Spoken Script):**
  > *"Thấy ngành Công nghệ thông tin của Đại học Phú Xuân nằm trong nhóm Vừa sức với tỷ lệ 80%, em chọn Nộp hồ sơ xét tuyển sớm trực tuyến. Form nộp hồ sơ kiểm tra tính hợp lệ bằng Zod Schema, tự động sinh mã định danh duy nhất và ràng buộc quy tắc nghiệp vụ: mỗi thí sinh giữ tối đa 5 nguyện vọng cùng lúc và không thể nộp trùng một ngành. Hồ sơ lập tức được đẩy vào hàng đợi thẩm định của nhà trường."*

---

### PHÚT 4 (03:00 – 04:00): CỔNG THẨM ĐỊNH HỒ SƠ ĐH PHÚ XUÂN (PXU)
- **Màn hình hiển thị:** Đăng xuất → Đăng nhập tài khoản `tuyensinh@pxu.edu.vn` (Mật khẩu: `pxu123`).
- **Thao tác thực hiện:**
  1. Hệ thống chuyển hướng tức thì sang Portal riêng **UniversityApp**.
  2. Mở tab *"Hàng đợi Xử lý Hồ sơ"*, thấy ngay hồ sơ vừa nộp của thí sinh ở đầu danh sách (sắp xếp theo timestamp thực).
  3. Đối chiếu điểm `24.5 / 24.5 Đạt chuẩn`. Bấm *"Xác nhận Hợp lệ"* (chuyển sang bước 2).
  4. Thử duyệt một hồ sơ điểm thấp hơn chuẩn (`23.8đ`): Hệ thống bắt buộc nhập căn cứ giải trình xét tuyển học bạ OJT tối thiểu 8 ký tự trước khi phê duyệt.
- **Lời thoại mẫu (Spoken Script):**
  > *"Bây giờ em chuyển sang vai trò Cán bộ Tuyển sinh Đại học Phú Xuân. Nhờ kiến trúc Lazy Loading và RBAC, em được đưa vào Portal làm việc chuyên biệt. Tại hàng đợi, hồ sơ vừa nộp xuất hiện tức thì ở vị trí đầu tiên. Em kiểm tra minh chứng và xác nhận 'Hồ sơ hợp lệ'. Đặc biệt, Máy trạng thái FSM kiểm soát chặt chẽ: nếu hồ sơ dưới chuẩn ngành, hội đồng bắt buộc phải nhập căn cứ giải trình học bạ OJT mới được phép phê duyệt, loại bỏ hoàn toàn việc duyệt sai quy chế."*

---

### PHÚT 5 (04:00 – 05:00): BẢNG ĐIỀU KHIỂN QUẢN TRỊ CẤP CAO (ADMIN) & TỔNG KẾT
- **Màn hình hiển thị:** Chuyển sang tài khoản `admin@unipath.vn` (Mật khẩu: `admin123`) → Giao diện **AdminApp**.
- **Thao tác thực hiện:**
  1. Xem **Phễu xét tuyển toàn quốc 5 giai đoạn** đối soát chính xác 100% tổng số hồ sơ.
  2. Bảng dữ liệu có **Sticky Header** cố định khi cuộn qua danh sách hồ sơ.
  3. Bấm vào tab *"CSDL 30 Trường"*, chỉnh sửa điểm chuẩn ngành hoặc học phí, toast thông báo đồng bộ sang AI Matching.
  4. Bấm *"Xuất CSV"* báo cáo tuyển sinh an toàn (đã bọc chống CSV Formula Injection).
- **Lời thoại mẫu (Spoken Script):**
  > *"Cuối cùng là Cổng Quản trị Admin Hệ thống Tuyển sinh Quốc gia. Bảng điều khiển đối soát 100% hồ sơ qua phễu 5 bước, loại trừ hoàn toàn việc thất thoát dữ liệu. Bảng dữ liệu hỗ trợ tiêu đề cố định Sticky Header đạt chuẩn Modern Web, giúp Admin duyệt hàng trăm hồ sơ không bị mất dấu cột. Mọi cập nhật điểm chuẩn từ Admin đều phản ánh thời gian thực sang AI Matching của thí sinh, và tính năng xuất CSV đã được phòng vệ mã độc Injection. Em xin kết thúc phần demo và sẵn sàng lắng nghe câu hỏi từ Hội đồng."*
