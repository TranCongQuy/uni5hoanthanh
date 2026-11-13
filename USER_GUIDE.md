# 📖 HƯỚNG DẪN SỬ DỤNG CHI TIẾT - HỆ SINH THÁI TUYỂN SINH UNIPATH 2.0
### Đơn vị phát triển: Nhóm UP5 — Trường Đại học Phú Xuân (PXU)
### Kỹ sư phát triển phần mềm: Trần Công Quý • Trưởng nhóm: Dương Đình Phát

---

## MỤC LỤC
1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Cơ chế hiển thị tự động: Mobile Native & Desktop Widescreen](#2-cơ-chế-hiển-thị-tự-động-mobile-native--desktop-widescreen)
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
- Trải nghiệm ngày hội tuyển sinh trực tuyến **EduFair LIVE** và đặt lịch **Tư vấn 1-1** cùng giảng viên.
- Nộp hồ sơ xét tuyển sớm, bổ sung minh chứng trực tuyến và nhận **Giấy báo Đủ điều kiện Trúng tuyển sớm** ngay trên ứng dụng.

---

## 2. CƠ CHẾ HIỂN THỊ TỰ ĐỘNG: MOBILE NATIVE & DESKTOP WIDESCREEN

UniPath 2.0 tự động nhận diện kích thước màn hình thiết bị theo thời gian thực:
- **Trên Điện thoại / Máy tính bảng dọc (`< 1024px`):** Hiển thị giao diện **Mobile Native** với thanh điều hướng 5 tab dưới đáy màn hình và các hộp thoại trượt lên từ cạnh dưới (Bottom-Sheet).
- **Trên Laptop / Máy tính để bàn (`≥ 1024px`):** Hiển thị giao diện **Desktop Widescreen** rộng rãi với thanh điều hướng gắn cố định trên đầu trang (Sticky Header), bố cục lưới đa cột và các hộp thoại căn giữa màn hình.
- **Trải nghiệm liền mạch tự nhiên:** Hệ thống tự động thích ứng mà **không có nút chuyển giao diện thủ công** và **không hiển thị bất kỳ thông báo chuyển chế độ nào**, đồng thời đảm bảo không tràn nút bấm hay khung viền trên mọi kích thước màn hình.

---

## 3. HƯỚNG DẪN DÀNH CHO THÍ SINH & PHỤ HUYNH (5 PHÂN HỆ CHÍNH)

### 3.1. Tab 0 — Trang chủ & Khám phá 30 Trường Đại học
- **Thanh công cụ trên cùng:**
  - **Chuông thông báo (`Bell`):** Hiển thị huy hiệu đỏ đếm chính xác số thông báo chưa đọc (kết quả duyệt hồ sơ, lịch hẹn 1-1, tin học bổng). Bấm vào từng thông báo để đánh dấu đã đọc và nhảy đến đúng trang liên quan.
  - **Trợ lý AI (`Bot`):** Hỏi đáp 24/7 về điểm chuẩn, học phí, ngành học và chương trình OJT.
  - **Menu Tài khoản & Đổi vai trò nhanh (`AccountRoleMenu` góc phải trên):** Xem tài khoản đang đăng nhập, chuyển đổi 1-Click giữa 3 cổng (`Thí sinh` ↔ `ĐH Phú Xuân` ↔ `Admin`) phục vụ bảo vệ đồ án, mở Cài đặt âm thanh/bản quyền UP5, khôi phục dữ liệu mẫu hoặc đăng xuất ngay lập tức.
- **Lộ trình Chọn Trường 4 Bước trực quan:** Nằm ngay dưới Banner chính, tự động đánh dấu hoàn thành (`✓`) cho từng bước (`① Test Holland` → `② AI Phân tích 30 trường` → `③ Tư vấn 1-1` → `④ Nộp hồ sơ sớm`) và cho phép bấm vào từng bước để thực hiện ngay.
- **Tìm kiếm & Lọc vùng miền:** Nhập tên trường, mã trường (ví dụ: `PXU`, `BKA`, `FTU`), tỉnh/thành phố hoặc tên ngành học (ví dụ: `Công nghệ thông tin`, `Marketing`), kết hợp bộ lọc `Tất cả` / `Bắc` / `Trung` / `Nam`.
- **Thao tác trên thẻ trường:**
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

### 3.4. Tab 3 — Ngày hội Tuyển sinh Trực tuyến EduFair LIVE
- Theo dõi phiên livestream tư vấn cùng chuyên gia, thả cảm xúc **Thích / Thả tim / Vỗ tay** (kèm hiệu ứng âm thanh thực tế) và đặt câu hỏi trực tiếp trên khung bình luận.
- Tại khu vực **Gian hàng ảo các trường**, bấm **Đặt lịch 1-1** ngay trên thẻ trường để hẹn lịch tư vấn riêng với đại diện trường đó.

### 3.5. Tab 4 — Hồ sơ Xét tuyển & Cá nhân
- **Quản lý Hồ sơ Xét tuyển của bạn:** Lọc hồ sơ theo 6 trạng thái (`Tất cả`, `Đang xét duyệt`, `Hồ sơ hợp lệ`, `Đã trúng tuyển`, `Thiếu hồ sơ`, `Đã bị hủy`).
  - Nếu hồ sơ ở trạng thái **`Đã trúng tuyển`**: Bấm **Chi tiết** để xem **Giấy báo Đủ điều kiện Trúng tuyển sớm**.
  - Nếu hồ sơ ở trạng thái **`Thiếu hồ sơ`**: Bấm **Bổ sung hồ sơ**, nhập thông tin minh chứng đã cập nhật và gửi xét duyệt lại ngay lập tức.
  - Nếu hồ sơ đang chờ duyệt: Thí sinh có thể chủ động bấm **Rút hồ sơ** nếu muốn thay đổi nguyện vọng.
- **Lịch hẹn tư vấn 1-1:** Theo dõi trạng thái lịch hẹn (`Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`) hoặc bấm **`+ Đặt lịch mới`**.
- **Trường đã lưu, Kết quả Holland & Gói Hội viên VIP:** Quản lý danh sách trường yêu thích, xem lại lộ trình nghề nghiệp và trải nghiệm nâng cấp tài khoản **UniPath VIP**.

---

## 4. HƯỚNG DẪN DÀNH CHO BAN TUYỂN SINH ĐH PHÚ XUÂN (PXU PORTAL)

Đăng nhập bằng tài khoản **`tuyensinh@pxu.edu.vn`** / mật khẩu **`pxu123`** (hoặc nút chọn nhanh **`🏛️ ĐH Phú Xuân (PXU)`**):
1. **Tổng quan PXU:** Theo dõi số lượng hồ sơ nộp vào ĐH Phú Xuân, tỷ lệ trúng tuyển và biểu đồ phân bổ thí sinh theo từng ngành đào tạo của PXU.
2. **Hồ sơ nộp PXU:** Chỉ hiển thị hồ sơ thí sinh đăng ký vào PXU (bảo mật tuyệt đối, ẩn hoàn toàn 29 trường khác). Nhập **Ghi chú Hội đồng** và bấm chọn *Hồ sơ hợp lệ*, *Duyệt trúng tuyển*, *Báo thiếu hồ sơ* hoặc *Từ chối*.
3. **Ngành học & Cấu hình PXU:** Xem chỉ tiêu OJT & học bổng, đồng thời cập nhật **Điểm chuẩn tham chiếu & Học phí tối thiểu của riêng ĐH Phú Xuân** (tự động đồng bộ sang bộ máy AI Matching).
4. **Lịch tư vấn 1-1:** Liên hệ thí sinh đăng ký tư vấn vào PXU và cập nhật trạng thái sang *Đã liên hệ* hoặc *Hoàn thành*.

---

## 5. HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN PORTAL)

Đăng nhập bằng tài khoản **`admin@unipath.vn`** / mật khẩu **`admin123`** (hoặc nút chọn nhanh **`👑 Admin Hệ Thống`**):
1. **Dashboard Toàn quốc:** Giám sát tổng quan hồ sơ 3 miền Bắc – Trung – Nam và toàn bộ **Nhật ký kiểm toán (`processingLog`)**.
2. **Hồ sơ Xét tuyển (30 trường):** Lọc theo trường/trạng thái, phê duyệt từng hồ sơ hoặc tích chọn nhiều hồ sơ để **Phê duyệt hàng loạt (Batch Action)**.
3. **Quản lý 30 Trường Đại học:** Điều chỉnh điểm chuẩn tham chiếu và mức học phí cho bất kỳ trường nào trong 30 trường trên hệ thống.
4. **Lịch hẹn 1-1 & Người dùng:** Điều phối toàn bộ lịch hẹn tư vấn và tra cứu danh sách tài khoản hệ thống cùng các thí sinh đăng ký mới.
5. **Khôi phục Dữ liệu gốc Demo:** Tại tab *Hệ thống*, nhấn **"Khôi phục dữ liệu gốc Demo"** bất kỳ lúc nào để đưa toàn bộ dữ liệu mẫu về trạng thái ban đầu.

---

## 6. DANH MỤC 13 HỘP THOẠI (MODALS) & QUY TẮC TƯƠNG TÁC

Mọi hộp thoại trong hệ thống (`Onboarding`, `Đăng nhập/Đăng ký`, `Chi tiết trường`, `So sánh trường`, `Nộp hồ sơ`, `Đặt lịch tư vấn 1-1`, `Chi tiết hồ sơ`, `Tất cả hồ sơ`, `Chỉnh sửa hồ sơ`, `Lộ trình THPT`, `ChatBot AI`, `Thông báo`, `Cài đặt`) đều tuân thủ đồng nhất:
- Nhấn nút **`X`** góc phải trên hoặc nhấn ra vùng nền mờ bên ngoài để đóng nhanh.
- Tự động khóa cuộn trang nền khi đang mở hộp thoại, đảm bảo không bị trượt trang ngoài ý muốn.

---

## 7. THÔNG TIN TÀI KHOẢN MẪU & MẸO KIỂM THỬ BẢO VỆ ĐỒ ÁN

| Vai trò | Email | Mật khẩu | Ghi chú kiểm thử nhanh |
| :--- | :--- | :---: | :--- |
| **Thí sinh mẫu** | `quy@unipath.vn` | `123456` | Có sẵn hồ sơ đa trạng thái (gồm cả hồ sơ `Đã trúng tuyển` & `Thiếu hồ sơ`) để trình diễn ngay |
| **ĐH Phú Xuân (PXU)** | `tuyensinh@pxu.edu.vn` | `pxu123` | Quản trị độc quyền tuyển sinh ĐH Phú Xuân (`PXU`) |
| **Admin Hệ thống** | `admin@unipath.vn` | `admin123` | Quản trị toàn diện 30 trường đại học toàn quốc |
| **Tạo thí sinh mới** | *(Đăng ký email bất kỳ)* | *(≥ 6 ký tự)* | Khởi tạo tài khoản thí sinh mới tinh (0 hồ sơ, 0 lịch hẹn) để trình diễn luồng từ con số 0 |
