# Kịch Bản Trình Diễn Đồ Án 5 Phút (Demo Script)
> **Dự án:** UniPath 2.0 — Hệ Thống Tuyển Sinh & Định Hướng Nghề Nghiệp Thông Minh  
> **Thời lượng chuẩn:** Đúng 5 phút (300 giây)  
> **Trình diễn viên:** Kỹ sư phát triển phần mềm & Nhóm UP5  
> **Môi trường:** Production Web (`https://uni5hoanthanh.vercel.app`)

---

## Bảng Phân Bổ Thời Gian Chi Tiết (5-Minute Timeline)

```
00:00 ───[ Phút 1: Auth Gate, Aurora Hero & Trắc nghiệm Holland RIASEC ]─── 01:00
01:00 ───[ Phút 2: AI Matching & Dock Trợ Lý AI Tuyển Sinh 24/7 ]───────── 02:00
02:00 ───[ Phút 3: Nộp Hồ Sơ Xét Tuyển Sớm Trực Tuyến & EduFair ]──────── 03:00
03:00 ───[ Phút 4: Cổng Thẩm Định PXU: Sidebar 3 Tầng & Học Bổng OJT ]───── 04:00
04:00 ───[ Phút 5: Admin Điều Hành: Benchmark 6 Cụm, Audit Log & Ctrl+K ]─ 05:00
```

---

### PHÚT 1 (00:00 – 01:00): AUTH GATE, AURORA HERO & ĐỊNH HƯỚNG HOLLAND
- **Màn hình hiển thị:** Cổng Auth Gate (`AuthScreen`) → Đăng nhập Thí sinh → Tab 0 (Trang chủ) → Tab 1 (Trắc nghiệm Holland).
- **Thao tác thực hiện:**
  1. Mở trang web: Hệ thống hiển thị rào chắn **Auth Gate** an toàn (loại bỏ hoàn toàn tài khoản khách). Bấm nút **"⚡ Thí sinh (Trần Công Quý)"** để điền nhanh và đăng nhập 1-Click.
  2. Trang chủ mở ra với diện mạo **Aurora Deep Tech**: Hero banner sắc nét, thanh hành trình chọn trường 4 bước, thẻ trường học hiển thị **ảnh campus thật 30/30 trường** và logo badge tròn vẹn.
  3. Chuyển sang Tab 1: Trả lời nhanh 12 câu hỏi trắc nghiệm tâm lý nghề nghiệp Holland RIASEC chuẩn hóa.
  4. Hoàn thành và kích hoạt pháo hoa chúc mừng; xem biểu đồ **Radar SVG 6 trục** hiển thị nhóm tính cách nổi trội (ví dụ: `E - Quản lý` hoặc `I - Nghiên cứu`).
- **Lời thoại mẫu (Spoken Script):**
  > *"Kính thưa Hội đồng, em xin bắt đầu buổi demo với UniPath 2.0. Để bảo đảm an toàn dữ liệu, hệ thống triển khai rào chắn Auth Gate bắt buộc xác thực, loại bỏ hoàn toàn chế độ khách vãng lai. Em đăng nhập nhanh bằng tài khoản Thí sinh lớp 12. Giao diện mở ra trên nền thẩm mỹ Aurora Deep Tech giàu chiều sâu thị giác với ảnh khuôn viên thật 100% của 30 trường đại học. Thay vì chọn ngành cảm tính, em làm trắc nghiệm Holland RIASEC 12 câu hỏi chuẩn hóa. Hệ thống trực quan hóa năng lực ngay trên biểu đồ mạng nhện SVG 6 trục, xác định nhóm năng khiếu nổi trội của em là nhóm E - Quản lý và I - Nghiên cứu."*

---

### PHÚT 2 (01:00 – 02:00): ĐỘNG CƠ AI MATCHING & TRỢ LÝ AI DOCK CỐ ĐỊNH
- **Màn hình hiển thị:** Tab 2 (AI Matching) & Dock Trợ lý AI ở góc phải màn hình desktop.
- **Thao tác thực hiện:**
  1. Nhập điểm thi dự kiến: `24.5` điểm, chọn tổ hợp khối `A00`, đặt ngân sách học phí `<= 25 triệu/năm`.
  2. Bấm *"Phân tích cơ hội trúng tuyển"*.
  3. Quan sát kết quả đối soát tức thì: 30 trường được phân thành 3 nhóm rõ rệt: **An toàn (>= 80%)**, **Vừa sức (45% - 79%)**, và **Thách thức (< 45%)**. Công thức tiệm cận mượt từ `MatchingService.ts` trần tối đa 98%.
  4. Mở **Dock Trợ lý AI** ở góc dưới bên phải: Gõ câu hỏi *"Trường Đại học Phú Xuân có ngành nào đào tạo OJT và học phí bao nhiêu?"* → AI trả lời chính xác dựa trên context 30 trường và nhớ mạch hội thoại đa lượt.
- **Lời thoại mẫu (Spoken Script):**
  > *"Sang phân hệ AI Matching, với điểm thi 24.5đ khối A00 và ngân sách gia đình dưới 25 triệu/năm, động cơ khớp điểm chuẩn từng ngành cụ thể, trần tối đa 98% và tự động loại trừ các trường vượt ngân sách. Đồng thời, ở góc phải màn hình có Dock Trợ lý AI cố định với bộ nhớ hội thoại đa lượt, trả lời chuẩn xác thông tin học bổng OJT tại Đại học Phú Xuân mà không hề ảo tưởng dữ liệu."*

---

### PHÚT 3 (02:00 – 03:00): NỘP HỒ SƠ XÉT TUYỂN SỚM TRỰC TUYẾN & EDUFAIR
- **Màn hình hiển thị:** Mở Modal Chi tiết Trường ĐH Phú Xuân (PXU) → Bấm *"Nộp hồ sơ xét tuyển"* → Chuyển sang Tab 3 (EduFair).
- **Thao tác thực hiện:**
  1. Bấm vào thẻ trường **Đại học Phú Xuân (PXU)**, chọn ngành **Công nghệ thông tin** (chuẩn ngành `24.5đ`).
  2. Bấm *"Nộp hồ sơ xét tuyển"*: Form nộp hồ sơ kiểm tra tính hợp lệ bằng Zod Schema, sinh mã tự động `HS-2026-PXUxxxx`, ràng buộc tối đa 5 nguyện vọng và chống nộp trùng.
  3. Sang Tab 3 (EduFair): Chỉ ra đồng hồ đếm ngược thời gian thực chuẩn xác đến EduFair Finale (20/12/2026 08:00 GMT+7) và sân khấu ở pha `upcoming` với lời mời đặt lịch tư vấn 1-1.
- **Lời thoại mẫu (Spoken Script):**
  > *"Thấy ngành CNTT của ĐH Phú Xuân nằm trong nhóm Vừa sức, em nộp hồ sơ xét tuyển sớm trực tuyến. Máy trạng thái FSM kiểm soát chặt chẽ: mã hồ sơ được sinh tự động, giới hạn tối đa 5 nguyện vọng và chặn nộp trùng một ngành. Tiếp theo tại phân hệ EduFair, hệ thống đồng bộ pha sự kiện thời gian thực: hiện tại đang đếm ngược đến ngày hội 20/12/2026 nên sân khấu chuyển sang giao diện Sắp diễn ra, mời thí sinh đặt lịch tư vấn 1-1 thay vì phát trực tiếp giả tạo."*

---

### PHÚT 4 (03:00 – 04:00): CỔNG THẨM ĐỊNH PXU — SIDEBAR 3 TẦNG & HỌC BỔNG OJT
- **Màn hình hiển thị:** Menu tài khoản → Bấm chuyển nhanh **`🏛️ ĐH Phú Xuân (PXU)`** → Cổng **UniversityApp**.
- **Thao tác thực hiện:**
  1. Chuyển sang Cổng PXU: Quan sát **Thanh điều hướng 3 tầng cố định (3-Tier Emerald Sidebar)**: Logo PXU luôn neo ở đỉnh, danh mục ở giữa cuộn độc lập mượt mà không bao giờ bị khuất.
  2. Mở tab *"Hồ sơ nộp PXU"*: Thấy hồ sơ vừa nộp xuất hiện ngay đầu danh sách.
  3. Hệ thống **tự động đối soát chuẩn ngành PXU & đề xuất Học bổng OJT**: Điểm đạt chuẩn, gợi ý trao học bổng OJT.
  4. Nhập ghi chú hội đồng: *"Đủ điều kiện xét tuyển sớm OJT"* và bấm *"Duyệt trúng tuyển"*.
- **Lời thoại mẫu (Spoken Script):**
  > *"Em chuyển sang Cổng Tuyển sinh Đại học Phú Xuân. Nhờ kiến trúc Lazy Loading và RBAC, Cổng PXU vận hành hoàn toàn phân lập với màu ngọc lục bảo. Thanh điều hướng bên trái được thiết kế 3 tầng cố định, giúp cán bộ cuộn xem danh mục mượt mà mà logo và chân trang luôn hiển thị rõ ràng. Hệ thống tự động so sánh điểm hồ sơ với chuẩn ngành PXU và đề xuất học bổng OJT. Em duyệt trúng tuyển hồ sơ kèm ghi chú hội đồng được lưu vào vết kiểm toán."*

---

### PHÚT 5 (04:00 – 05:00): ADMIN TOÀN QUỐC — BENCHMARK 6 CỤM, AUDIT LOG & CTRL+K
- **Màn hình hiển thị:** Menu tài khoản → Bấm chuyển sang **`👑 Admin Hệ Thống`** → Cổng **AdminApp**.
- **Thao tác thực hiện:**
  1. Quan sát thanh điều hướng 3 tầng Deep Aurora của Admin. Nhấn phím tắt `Ctrl + K` mở **Global Search**: Gõ tìm nhanh mã hồ sơ hoặc trường đại học.
  2. Mở tab *"Benchmark 30 Trường"*: Chỉ ra biểu đồ cột phân bố điểm chuẩn 6 phân khoảng (Histogram SVG), tỷ lệ đạt chuẩn ngành và điểm trung bình 3 miền Bắc – Trung – Nam.
  3. Mở tab *"Quản trị hệ thống"*: Giám sát trạng thái kết nối Supabase Cloud Mirroring, dung lượng LocalStorage dưới 5MB và toàn bộ dòng nhật ký kiểm toán Audit Log.
  4. Đăng nhập lại Thí sinh: Thấy chuông thông báo đỏ và mở Giấy báo Trúng tuyển sớm điện tử!
- **Lời thoại mẫu (Spoken Script):**
  > *"Cuối cùng là Cổng Quản trị Admin Hệ thống Quốc gia. Em bấm phím tắt Ctrl+K để tra cứu toàn diện hồ sơ và trường học tức thì. Tại phân hệ Benchmark, biểu đồ cột phân bố 6 phân khoảng và thống kê 3 miền cung cấp bức tranh tuyển sinh vĩ mô. Tab Quản trị hệ thống giám sát kết nối đám mây Supabase và bộ nhớ cục bộ, bảo đảm hệ thống vận hành bền vững. Khi đăng nhập lại tài khoản thí sinh, chuông thông báo báo tin trúng tuyển và hiển thị Giấy báo trúng tuyển sớm điện tử. Em xin kết thúc phần demo và sẵn sàng trả lời câu hỏi của Hội đồng."*
