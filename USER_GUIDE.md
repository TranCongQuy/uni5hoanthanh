# 📖 HƯỚNG DẪN SỬ DỤNG CHI TIẾT - HỆ SINH THÁI TUYỂN SINH UNIPATH 2.0
### Đơn vị phát triển: Nhóm UP5 — Trường Đại học Phú Xuân (PXU)
### Kỹ sư phát triển phần mềm: Trần Công Quý • Trưởng nhóm: Dương Đình Phát

---

## MỤC LỤC
1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Cơ chế hiển thị tự động & Rào chắn Auth Gate](#2-cơ-chế-hiển-thị-tự-động--rào-chắn-auth-gate)
3. [Hướng dẫn dành cho Thí sinh & Phụ huynh (5 Phân hệ chính)](#3-hướng-dẫn-dành-cho-thí-sinh--phụ-huynh-5-phân-hệ-chính)
4. [Hướng dẫn dành cho Ban Tuyển sinh ĐH Phú Xuân (PXU Portal)](#4-hướng-dẫn-dành-cho-ban-tuyển-sinh-đh-phú-xuân-pxu-portal)
5. [Hướng dẫn dành cho Quản trị viên Hệ thống (Admin Portal)](#5-hướng-dẫn-dành-cho-quản-trị-viên-hệ-thống-admin-portal)
6. [Danh mục 13 Hộp thoại (Modals) & Quy tắc tương tác](#6-danh-mục-13-hộp-thoại-modals--quy-tắc-tương-tác)
7. [Thông tin tài khoản mẫu & Mẹo kiểm thử bảo vệ đồ án](#7-thông-tin-tài-khoản-mẫu--mẹo-kiểm-thử-bảo-vệ-đồ-án)

---

## 1. GIỚI THIỆU TỔNG QUAN

**UniPath 2.0** là nền tảng hướng nghiệp, đối soát cơ hội trúng tuyển và quản trị xét tuyển đại học trực tuyến toàn diện, kết nối trực tiếp **Học sinh THPT – Trường Đại học Phú Xuân (PXU) – Hệ thống 30 trường đại học hàng đầu Việt Nam**:
- Trắc nghiệm hướng nghiệp quốc tế **Holland RIASEC (12 câu hỏi tình huống chuẩn hóa)**.
- Phân tích xác suất trúng tuyển **AI Matching 2026** dựa trên Điểm thi dự kiến, Ngân sách học phí, Khu vực và Mã tính cách Holland.
- Trải nghiệm ngày hội tuyển sinh trực tuyến **EduFair** đồng bộ pha sự kiện và đặt lịch **Tư vấn 1-1** cùng ban tuyển sinh.
- Nộp hồ sơ xét tuyển sớm, bổ sung minh chứng trực tuyến và nhận **Giấy báo Đủ điều kiện Trúng tuyển sớm** ngay trên ứng dụng.
- Vận hành trên ngôn ngữ thiết kế **Aurora Deep Tech & Glassmorphism** giàu chiều sâu thị giác.

---

## 2. CƠ CHẾ HIỂN THỊ TỰ ĐỘNG & RÀO CHẮN AUTH GATE

1. **Rào chắn Xác thực Auth Gate (Bắt buộc Đăng nhập / Đăng ký):**
   - Khi truy cập ứng dụng, người dùng được chào đón tại màn hình `AuthScreen`.
   - Cung cấp 2 tab: **Đăng nhập** và **Tạo tài khoản thí sinh mới**.
   - Hỗ trợ các nút **Điền sẵn thông tin 1-Click** cho 3 vai trò mẫu (Thí sinh, Ban Tuyển sinh PXU, Admin Hệ thống) giúp hội đồng kiểm thử nhanh mà không cần gõ phím.
   - **Xóa bỏ hoàn toàn tài khoản Khách vãng lai** để đảm bảo tính bảo mật và toàn vẹn dữ liệu cá nhân.
2. **Tự động nhận diện thiết bị theo thời gian thực:**
   - **Trên Điện thoại / Máy tính bảng dọc (`< 1024px`):** Hiển thị giao diện **Mobile Native** với thanh điều hướng 5 tab dưới đáy màn hình và các hộp thoại trượt lên từ cạnh dưới (Bottom-Sheet).
   - **Trên Laptop / Máy tính để bàn (`≥ 1024px`):** Hiển thị giao diện **Desktop Widescreen** rộng rãi với thanh điều hướng gắn cố định trên đầu trang (Sticky Header), bố cục lưới đa cột và các hộp thoại căn giữa màn hình.
   - **Trải nghiệm liền mạch tự nhiên:** Hệ thống tự động thích ứng mà **không có nút chuyển giao diện thủ công** và **không hiển thị bất kỳ thông báo chuyển chế độ nào**.

---

## 3. HƯỚNG DẪN DÀNH CHO THÍ SINH & PHỤ HUYNH (5 PHÂN HỆ CHÍNH)

### 3.1. Tab 0 — Trang chủ & Khám phá 30 Trường Đại học
- **Thanh công cụ trên cùng:**
   - **Chuông thông báo (`Bell`):** Hiển thị huy hiệu đỏ đếm chính xác số thông báo chưa đọc. Bấm vào từng thông báo để đánh dấu đã đọc và chuyển đến trang liên quan.
   - **Menu Tài khoản & Đổi vai trò nhanh (`AccountRoleMenu` góc phải trên):** Xem tài khoản đang đăng nhập, chuyển đổi 1-Click giữa 3 cổng (`Thí sinh` ↔ `ĐH Phú Xuân` ↔ `Admin`), mở Cài đặt, khôi phục dữ liệu mẫu hoặc đăng xuất.
- **Trợ lý AI Tuyển sinh Cố định (`AIAssistantDock`):** Ghim cố định ở góc dưới bên phải màn hình desktop. Mặc định ở trạng thái thu nhỏ thanh lịch; bấm mở rộng để trò chuyện đa lượt (Multi-turn Memory) về điểm chuẩn 30 trường, học phí, học bổng OJT tại ĐH Phú Xuân.
- **Lộ trình Chọn Trường 4 Bước trực quan:** Nằm ngay dưới Hero Banner Aurora, tự động đánh dấu hoàn thành (`✓`) cho từng bước (`① Test Holland` → `② AI Phân tích 30 trường` → `③ Tư vấn 1-1` → `④ Nộp hồ sơ sớm`).
- **Tìm kiếm & Lọc vùng miền:** Nhập tên trường, mã trường (`PXU`, `BKA`, `FTU`), tỉnh/thành hoặc tên ngành học (`Công nghệ thông tin`, `Marketing`), kết hợp bộ lọc `Tất cả` / `Bắc` / `Trung` / `Nam`.
- **Thao tác trên thẻ trường (`UniversityCard`):**
   - Thẻ trường hiển thị ảnh campus thật 30/30 trường và logo badge sắc nét.
   - Bấm biểu tượng **Trái tim** để lưu trường yêu thích.
   - Bấm biểu tượng **Cân đối chiếu (`So sánh`)** trên tối đa 3 trường → Thanh nổi **`So sánh (n/3)`** xuất hiện giúp mở bảng so sánh trực diện.
   - Bấm vào thẻ trường để mở **Hồ sơ chi tiết trường**, xem biểu đồ điểm chuẩn 3 năm, bấm **Tư vấn 1-1** hoặc **Nộp hồ sơ xét tuyển**.

### 3.2. Tab 1 — Trắc nghiệm Hướng nghiệp Holland RIASEC
1. Bấm **"Bắt đầu làm bài trắc nghiệm"** để trả lời **12 câu hỏi** thực tế theo 4 mức độ phù hợp (`0` đến `+3` điểm).
2. Sau khi hoàn thành, hệ thống vẽ **Biểu đồ Radar 6 trục**, chỉ ra **Nhóm tính cách chủ đạo** cùng danh sách ngành nghề phù hợp.
3. Bấm **"Xem lộ trình nghề nghiệp THPT"** để xem kế hoạch rèn luyện Lớp 10 – 11 – 12, hoặc bấm **"Đối soát cơ hội trúng tuyển cùng AI"** để chuyển thẳng sang Tab 2.

### 3.3. Tab 2 — Gợi ý Trường AI Matching 2026
1. Điều chỉnh **Điểm thi dự kiến** (`10.0đ – 30.0đ`), **Ngân sách học phí tối đa** (`triệu/năm`) và **Khu vực ưu tiên**.
2. Nhấn nút **"Phân tích cơ hội trúng tuyển"** để chốt thông số.
3. Hệ thống phân loại các trường phù hợp ngân sách thành 3 nhóm rõ ràng:
   - 🟢 **Nhóm An Toàn (`≥ 80%`):** Khả năng trúng tuyển rất cao.
   - 🟡 **Nhóm Vừa Sức (`45% – 79%`):** Nguyện vọng mục tiêu trọng tâm.
   - 🔴 **Nhóm Thử Thách (`< 45%`):** Nguyện vọng bứt phá.
4. Trên từng thẻ kết quả đều hiển thị **Ngành tham chiếu phù hợp nhất**, mức điểm chuẩn ngành cùng nút **Tư vấn 1-1** và **Chi tiết**.

### 3.4. Tab 3 — Ngày hội Tuyển sinh Trực tuyến EduFair
- Đồng hồ đếm ngược thời gian thực chuẩn xác đến ngày hội tuyển sinh **EduFair Finale: 20/12/2026 08:00 GMT+7**.
- Ở pha hiện tại (`upcoming`): Sân khấu hiển thị panel *"Sắp diễn ra"*, diễn giả chính, và nút hành động trọng tâm: **Đặt lịch tư vấn 1-1** với ban tuyển sinh các trường.
- Khung trao đổi câu hỏi gửi trực tiếp thắc mắc tới ban tư vấn.

### 3.5. Tab 4 — Hồ sơ Xét tuyển & Cá nhân
- **Quản lý Hồ sơ Xét tuyển của bạn:** Lọc hồ sơ theo 6 trạng thái (`Tất cả`, `Đang xét duyệt`, `Hồ sơ hợp lệ`, `Đã trúng tuyển`, `Thiếu hồ sơ`, `Đã bị hủy`).
  - Nếu hồ sơ ở trạng thái **`Đã trúng tuyển`**: Bấm **Chi tiết** để xem **Giấy báo Đủ điều kiện Trúng tuyển sớm**.
  - Nếu hồ sơ ở trạng thái **`Thiếu hồ sơ`**: Bấm **Bổ sung hồ sơ**, nhập thông tin minh chứng đã cập nhật và gửi xét duyệt lại ngay lập tức.
  - Nếu hồ sơ đang chờ duyệt: Thí sinh có thể chủ động bấm **Rút hồ sơ** nếu muốn thay đổi nguyện vọng.
- **Lịch hẹn tư vấn 1-1:** Theo dõi trạng thái lịch hẹn (`Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`) hoặc bấm **`+ Đặt lịch mới`**.
- **Trường đã lưu & Kết quả Holland:** Quản lý danh sách trường yêu thích và xem lại lộ trình nghề nghiệp.

---

## 4. HƯỚNG DẪN DÀNH CHO BAN TUYỂN SINH ĐH PHÚ XUÂN (PXU PORTAL)

Đăng nhập bằng tài khoản **`tuyensinh@pxu.edu.vn`** / mật khẩu **`pxu123`** (hoặc nút chọn nhanh **`🏛️ ĐH Phú Xuân (PXU)`**):
1. **Thanh điều hướng 3 tầng Emerald Aurora:**
   - Cố định bên trái màn hình (`position: fixed`).
   - Logo ĐH Phú Xuân (PXU) luôn neo chắc chắn ở đỉnh (`top: 0`).
   - Danh mục nghiệp vụ ở giữa cuộn mượt mà với thanh cuộn tinh tế `.up-sidebar-scroll`.
   - Chân trang neo thẻ bảo mật phân lập dữ liệu.
2. **Tổng quan PXU:** Theo dõi số lượng hồ sơ nộp vào ĐH Phú Xuân, tỷ lệ trúng tuyển và biểu đồ phân bổ thí sinh theo từng ngành đào tạo của PXU.
3. **Hồ sơ nộp PXU:** Chỉ hiển thị hồ sơ thí sinh đăng ký vào PXU (bảo mật tuyệt đối, ẩn hoàn toàn 29 trường khác).
   - **Tự động đối soát Điểm chuẩn PXU & Đề xuất Học bổng OJT:** So sánh điểm hồ sơ với chuẩn ngành, phân loại chênh lệch $\ge +4.0$đ để gợi ý trao Học bổng Doanh nghiệp OJT 50–100%.
   - Nhập **Ghi chú Hội đồng** và bấm chọn *Hồ sơ hợp lệ*, *Duyệt trúng tuyển*, *Báo thiếu hồ sơ* hoặc *Từ chối*.
4. **Ngành học & Cấu hình PXU:** Xem chỉ tiêu OJT & học bổng, đồng thời cập nhật **Điểm chuẩn tham chiếu & Học phí tối thiểu của riêng ĐH Phú Xuân** (tự động đồng bộ sang bộ máy AI Matching).
5. **Lịch tư vấn 1-1:** Điều phối lịch hẹn tư vấn theo bảng **Kanban 3 cột** (`Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`).

---

## 5. HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN PORTAL)

Đăng nhập bằng tài khoản **`admin@unipath.vn`** / mật khẩu **`admin123`** (hoặc nút chọn nhanh **`👑 Admin Hệ Thống`**):
1. **Thanh điều hướng 3 tầng Deep Aurora:**
   - Cố định bên trái màn hình (`position: fixed`).
   - Logo UniPath Admin luôn neo ở đỉnh (`top: 0`).
   - Danh mục điều hướng cuộn độc lập lướt lên/xuống mượt mà không bao giờ bị khuất.
   - Chân trang ghim trạng thái đồng bộ dữ liệu và nút **Khôi phục dữ liệu mẫu**.
2. **Tìm kiếm Toàn diện (`Ctrl + K`):** Nhấn phím tắt `Ctrl + K` hoặc bấm vào thanh tìm kiếm ở đầu trang để tra cứu nhanh mã hồ sơ, tên thí sinh, trường đại học, ngành học hoặc nhảy nhanh tới chức năng.
3. **Tab Benchmark 30 Trường ĐH (`benchmark`):**
   - Biểu đồ phân bố điểm chuẩn 6 phân khoảng chuẩn hóa (`< 20đ`, `20 - 21.9đ`, `22 - 23.9đ`, `24 - 25.9đ`, `26 - 27.9đ`, `≥ 28đ`).
   - Thống kê tỷ lệ đạt chuẩn ngành, top 3 ngành cạnh tranh nhất và điểm chuẩn trung bình phân chia theo 3 miền.
4. **Tab Quản trị Hệ thống & Audit Log (`system`):**
   - Giám sát trạng thái kết nối đám mây Supabase Cloud Mirroring.
   - Giám sát dung lượng lưu trữ bộ nhớ cục bộ LocalStorage.
   - Tra cứu dòng lịch sử kiểm toán hồ sơ toàn hệ thống (`processingLog`).
5. **Hồ sơ Xét tuyển (30 trường):** Lọc theo trường/trạng thái, phê duyệt từng hồ sơ hoặc tích chọn nhiều hồ sơ để **Phê duyệt hàng loạt (Batch Action)** kết hợp Smart Inspector bên phải.
6. **Quản lý 30 Trường Đại học:** Chỉnh sửa trực tiếp trên dòng (Inline Edit) điểm chuẩn tham chiếu và mức học phí cho bất kỳ trường nào trong 30 trường.
7. **Lịch hẹn 1-1 & Người dùng:** Điều phối toàn bộ lịch hẹn tư vấn và tra cứu danh sách tài khoản thí sinh đăng ký mới.

---

## 6. DANH MỤC 13 HỘP THOẠI (MODALS) & QUY TẮC TƯƠNG TÁC

Mọi hộp thoại trong hệ thống (`Onboarding`, `Đăng nhập/Đăng ký`, `Chi tiết trường`, `So sánh trường`, `Nộp hồ sơ`, `Đặt lịch tư vấn 1-1`, `Chi tiết hồ sơ`, `Tất cả hồ sơ`, `Chỉnh sửa hồ sơ`, `Lộ trình THPT`, `ChatBot AI`, `Thông báo`, `Cài đặt`) đều tuân thủ đồng nhất:
- Nhấn nút **`X`** góc phải trên, nhấn phím `Escape` hoặc nhấn ra vùng nền mờ bên ngoài để đóng nhanh.
- Tự động khóa cuộn trang nền khi đang mở hộp thoại, đảm bảo không bị trượt trang ngoài ý muốn.

---

## 7. THÔNG TIN TÀI KHOẢN MẪU & MẸO KIỂM THỬ BẢO VỆ ĐỒ ÁN

| Vai trò | Email | Mật khẩu | Ghi chú kiểm thử nhanh |
| :--- | :--- | :---: | :--- |
| **Thí sinh mẫu** | `quy@unipath.vn` | `123456` | Có sẵn hồ sơ đa trạng thái (gồm cả hồ sơ `Đã trúng tuyển` & `Thiếu hồ sơ`) để trình diễn ngay |
| **ĐH Phú Xuân (PXU)** | `tuyensinh@pxu.edu.vn` | `pxu123` | Quản trị độc quyền tuyển sinh ĐH Phú Xuân (`PXU`) với thanh điều hướng Emerald Aurora |
| **Admin Hệ thống** | `admin@unipath.vn` | `admin123` | Trung tâm điều hành toàn diện 30 trường, Benchmark 6 cụm, Quản trị hệ thống, Global Search `Ctrl + K` |
| **Tạo thí sinh mới** | *(Đăng ký email bất kỳ)* | *(≥ 6 ký tự)* | Khởi tạo tài khoản thí sinh mới tinh (0 hồ sơ, 0 lịch hẹn) để trình diễn luồng từ con số 0 |
