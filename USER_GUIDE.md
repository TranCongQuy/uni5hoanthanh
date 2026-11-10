# 📖 HƯỚNG DẪN SỬ DỤNG CHI TIẾT - HỆ SINH THÁI TUYỂN SINH UNIPATH 2.0
### Đơn vị phát triển: Nhóm UP5 — Trường Đại học Phú Xuân (PXU)
### Kỹ sư phát triển phần mềm: Trần Công Quý • Trưởng nhóm: Dương Đình Phát

---

## MỤC LỤC
1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Chế độ hiển thị: Mobile Native & Desktop Widescreen](#2-chế-độ-hiển-thị-mobile-native--desktop-widescreen)
3. [Luồng thao tác Tab 0: Trang chủ & Tra cứu trường](#3-luồng-thao-tác-tab-0-trang-chủ--tra-cứu-trường)
4. [Luồng thao tác Tab 1: Khảo sát Hướng nghiệp RIASEC (Holland Code)](#4-luồng-thao-tác-tab-1-khảo-sát-hướng-nghiệp-riasec-holland-code)
5. [Luồng thao tác Tab 2: AI Matching 2026 - Đối soát trúng tuyển 30 trường](#5-luồng-thao-tác-tab-2-ai-matching-2026---đối-soát-trúng-tuyển-30-trường)
6. [Luồng thao tác Tab 3: Unipath LIVE - Virtual EduFair trực tuyến](#6-luồng-thao-tác-tab-3-unipath-live---virtual-edufair-trực-tuyến)
7. [Luồng thao tác Tab 4: Hồ sơ xét tuyển sớm & Quản lý thông tin thí sinh](#7-luồng-thao-tác-tab-4-hồ-sơ-xét-tuyển-sớm--quản-lý-thông-tin-thí-sinh)
8. [Hệ thống 12 Hộp thoại (Modals) & Hành vi tương tác](#8-hệ-thống-12-hộp-thoại-modals--hành-vi-tương-tác)
9. [Cơ chế Phân quyền & Tài khoản thử nghiệm](#9-cơ-chế-phân-quyền--tài-khoản-thử-nghiệm)

---

## 1. GIỚI THIỆU TỔNG QUAN

**UniPath 2.0** là nền tảng ứng dụng hướng nghiệp và dự đoán trúng tuyển đại học thông minh, đồng hành cùng học sinh THPT trên toàn quốc trong việc:
- Khám phá thiên hướng bản thân theo bài trắc nghiệm chuẩn Hoa Kỳ **Holland RIASEC**.
- Đối soát điểm thi tốt nghiệp THPT và ngân sách học phí với **30 trường đại học hàng đầu 3 miền**.
- Tham gia ngày hội tuyển sinh ảo **Virtual EduFair** với hiệu ứng âm thanh và cảm xúc tương tác trực tiếp.
- Nộp hồ sơ xét tuyển sớm trực tuyến và quản lý trạng thái hồ sơ theo thời gian thực.

---

## 2. CHẾ ĐỘ HIỂN THỊ: MOBILE NATIVE & DESKTOP WIDESCREEN

UniPath 2.0 hỗ trợ cơ chế hiển thị thích ứng kép (Dual-Engine Adaptive Interface) tự động 100%:
- **Giao diện Điện thoại (Mobile Native - khi màn hình < 1024px):** Bố cục dọc tối ưu cho thao tác 1 tay trên smartphone, thanh điều hướng đáy (Bottom Navigation 5 tabs), các modal dạng ngăn kéo vuốt (Bottom-sheet) mềm mại, chạm vuốt mượt mà.
- **Giao diện Máy tính (Desktop Widescreen - khi màn hình ≥ 1024px):** Bố cục ngang rộng rãi với độ rộng tối đa 1380px, thanh menu đỉnh cố định (Sticky Topbar), lưới hiển thị 3-4 cột thẻ trường đại học, sidebar phân tích cơ hội trúng tuyển đa năng, các modal tự động căn giữa màn hình (Centered Dialog) sang trọng với hiệu ứng kính mờ (Backdrop Blur).
- **Tự động nhận diện khung hình (Zero-Notification Auto Detection):**
  - Hệ thống tự động nhận diện thiết bị và kích thước màn hình theo thời gian thực mà không cần bấm nút chuyển chế độ.
  - Chuyển đổi hoàn toàn êm ái, **không xuất hiện bất kỳ thông báo toast hay popup gây gián đoạn**, mang lại trải nghiệm tự nhiên, liền mạch.

---

## 3. LUỒNG THAO TÁC TAB 0: TRANG CHỦ & TRA CỨU TRƯỜNG

### 3.1. Header & Công cụ tiện ích
- **Chuông thông báo (Bell):** Nhấn để xem tin tức tuyển sinh, thông báo học bổng và cập nhật đề thi thử.
- **Trợ lý AI (Robot):** Nhấn để mở Trợ lý AI Tuyển sinh 24/7.
- **Thẻ người dùng:** Nhấn để chuyển nhanh sang Tab Hồ sơ cá nhân. Khi chưa đăng nhập, nút `⚡ Đăng nhập Demo` và `Đăng nhập / Đăng ký` sẽ hiển thị rõ ràng.

### 3.2. Banner Slider chuyển động
- **Slide 1 (Khám phá RIASEC):** Bấm `Làm bài test RIASEC ngay` ➔ Chuyển sang Tab 1.
- **Slide 2 (Virtual EduFair):** Bấm `Tham gia Live ngay` ➔ Chuyển sang Tab 3.
- **Slide 3 (Lộ trình THPT):** Bấm `Kích hoạt Gói VIP` ➔ Chuyển sang Tab 4 để quản lý quyền lợi.

### 3.3. 4 Phím tắt tính năng nhanh
- **Khảo sát RIASEC:** Chuyển ngay đến bài trắc nghiệm tính cách.
- **AI Matching 2026:** Mở bảng đối soát điểm trúng tuyển.
- **Unipath LIVE:** Kết nối trực tiếp vào phòng livestream tư vấn.
- **Lộ trình THPT:** Mở modal định hướng nghề nghiệp 3 năm cấp 3.

### 3.4. Tìm kiếm trường học thông minh (Autocomplete)
- Nhập từ khóa bất kỳ (ví dụ: *Bách Khoa*, *PXU*, *Kinh Tế*, *Đà Nẵng*...):
  - Hộp gợi ý hiển thị tối đa **3 trường phù hợp nhất**.
  - Nếu có trên 3 trường, nút **"Xem tất cả {n} trường phù hợp bên dưới"** sẽ xuất hiện giúp cuộn đến danh sách mà không làm tràn khung hình.
  - Bấm vào một trường bất kỳ trong gợi ý ➔ Mở ngay bảng thông tin chi tiết trường.

### 3.5. Danh mục 30 trường Đại học & Thao tác thẻ trường
- **Lọc theo vùng miền:** Chọn `Tất cả`, `Bắc`, `Trung`, `Nam`.
- **Nút Trái Tim (Yêu thích):** Lưu trường vào danh sách nguyện vọng yêu thích (xem lại tại Tab 4).
- **Nút So Sánh (Scale/Compare):** Chọn tối đa 3 trường. Khi có ít nhất 1 trường được chọn, thanh nổi `So sánh (n/3)` sẽ xuất hiện để mở bảng đối chiếu bất kỳ lúc nào.
- **Xem chi tiết trường:** Mở hộp thoại đầy đủ thông tin: Điểm chuẩn 3 năm (Bar Chart), học phí, tỷ lệ việc làm, học bổng và nút **Nộp hồ sơ xét tuyển**.

---

## 4. LUỒNG THAO TÁC TAB 1: KHẢO SÁT HƯỚNG NGHIỆP RIASEC (HOLLAND CODE)

1. **Màn hình giới thiệu:** Xem 3 thông số bài thi (12 câu hỏi, 5 phút, 6 nhóm tính cách). Bấm **"Bắt đầu làm bài trắc nghiệm ngay →"**.
2. **Làm bài khảo sát:**
   - Chọn mức độ phù hợp với bản thân theo thang điểm 1 đến 4 sao.
   - Nút **Quay lại** giúp xem lại câu trước.
   - Nút **Thoát** có hộp thoại xác nhận an toàn giúp tránh bấm nhầm.
3. **Màn hình kết quả:**
   - Hiển thị **Mã tính cách RIASEC** nổi trội nhất (ví dụ: *E - Quản lý / Khởi nghiệp*, *I - Nghiên cứu*...).
   - **Biểu đồ Radar SVG đa chiều** biểu diễn trực quan mức độ tương thích trên cả 6 trục.
   - Danh sách top ngành nghề gợi ý và các kỹ năng cần phát triển.
   - Nút **"Đối soát cơ hội trúng tuyển cùng AI →"**: Tự động chuyển sang Tab 2 mang theo mã tính cách vừa phân tích.
   - Nút **"Xem lộ trình nghề nghiệp chi tiết"**: Mở modal lộ trình THPT theo từng năm lớp 10, 11, 12.
   - Nút **"Làm lại bài khảo sát"**: Đặt lại câu hỏi từ đầu.

---

## 5. LUỒNG THAO TÁC TAB 2: AI MATCHING 2026 - ĐỐI SOÁT TRÚNG TUYỂN 30 TRƯỜNG

1. **Thiết lập thông số đầu vào:**
   - **Điểm thi THPT dự kiến:** Kéo thanh trượt hoặc bấm chọn phím tắt (18đ, 21đ, 24đ, 27đ, 29đ).
   - **Ngân sách học phí tối đa:** Kéo thanh trượt hoặc chọn phím tắt (15tr, 25tr, 35tr, 50tr).
   - **Khu vực ưu tiên:** Chọn `Tất cả`, `Bắc`, `Trung`, `Nam`.
2. **Kích hoạt phân tích:**
   - **Quy tắc chuẩn mực:** Kết quả chỉ xuất hiện khi bấm nút **"Phân tích cơ hội trúng tuyển ngay"**.
   - Khi người dùng kéo thay đổi bất kỳ thanh trượt nào, kết quả cũ sẽ lập tức ẩn đi và yêu cầu bấm lại để tránh tự động nhảy số liệu ngoài ý muốn.
3. **Hiển thị kết quả phân tích:**
   - Thẻ xác nhận màu xanh lá: **"✅ Đã phân tích cơ hội trúng tuyển theo thông số của bạn!"** ghi rõ mức điểm, ngân sách và thời gian phân tích.
   - Phân loại rõ ràng 30 trường thành 3 nhóm:
     - 🟢 **Nhóm An Toàn (> 85%):** Khả năng đỗ cao, điểm chuẩn các năm thấp hơn điểm dự kiến.
     - 🟡 **Nhóm Vừa Sức (65% - 85%):** Vùng cạnh tranh tích cực, cơ hội đỗ khả quan.
     - 🔴 **Nhóm Thách Thức (< 65%):** Vùng điểm cao hơn, cần nỗ lực bứt phá.
   - Có thể sắp xếp kết quả theo: *Tỷ lệ trúng tuyển cao nhất*, *Học phí thấp nhất*, hoặc *Khu vực*.
   - Mỗi trường đều có nút **Chi tiết trường** để mở modal hồ sơ và nộp đơn xét tuyển.

---

## 6. LUỒNG THAO TÁC TAB 3: UNIPATH LIVE - VIRTUAL EDUFAIR TRỰC TUYẾN

1. **Khung phát trực tiếp:** Hiển thị video mô phỏng chuyên gia tư vấn đang phát sóng cùng số lượng người đang xem.
2. **Bộ nút cảm xúc tương tác độc quyền (Web Audio API):**
   - **👍 Thích:** Phát âm thanh pop sôi động, tăng số lượt thích, emoji ngón tay cái và lửa bay lên.
   - **❤️ Thả tim:** Phát hợp âm chuông ngân vang, kích hoạt pháo hoa confetti rực rỡ và bầy tim bay bổng.
   - **👏 Vỗ tay:** Phát âm thanh tiếng vỗ tay thật chân thực kèm các biểu tượng vỗ tay và tiệc tùng bay lên.
3. **Nút Chia sẻ:** Sao chép liên kết phòng live vào clipboard và hiển thị thông báo toast.
4. **Khung bình luận trực tuyến:**
   - Hiển thị 8 bình luận mới nhất, tự động cuộn xuống mượt mà.
   - Người dùng nhập câu hỏi vào ô và bấm nút gửi ➔ Ban tư vấn tự động phản hồi sau 2 giây.
5. **Gian hàng trực tuyến các trường:** Bấm vào logo trường bất kỳ để xem thông tin chi tiết của trường đó.

---

## 7. LUỒNG THAO TÁC TAB 4: HỒ SƠ XÉT TUYỂN SỚM & QUẢN LÝ THÔNG TIN THÍ SINH

### 7.1. Khi chưa đăng nhập
- Giao diện hiển thị hộp thông báo bảo mật lịch sự: **"Đăng nhập để theo dõi hồ sơ xét tuyển"**.
- Có 2 nút lựa chọn:
  - `⚡ Trải nghiệm ngay với Demo Trần Công Quý`: Đăng nhập tức thì chỉ với 1 click.
  - `Đăng nhập / Đăng ký tài khoản`: Mở form nhập email/mật khẩu cá nhân.

### 7.2. Khi đã đăng nhập
- **Thẻ thông tin thí sinh:** Ảnh đại diện, họ tên, trường THPT, tỉnh thành, số lượng hồ sơ đã nộp, trường yêu thích và điểm thi dự kiến.
- **Nút "Chỉnh sửa thông tin hồ sơ":** Mở modal cập nhật thông tin cá nhân.
- **Nút "Cài đặt & Bản quyền nhóm UP5":** Mở modal cài đặt hệ thống.
- **Nút "Đăng xuất tài khoản":** Thoát phiên làm việc (có hộp xác nhận chống bấm nhầm).
- **Bộ lọc trạng thái hồ sơ:** Lọc theo các danh mục:
  - `Tất cả`
  - `Đang xét duyệt`
  - `Hồ sơ hợp lệ`
  - `Thiếu hồ sơ`
  - `Đã bị hủy`
- **Thao tác trên từng hồ sơ:**
  - Bấm **Chi tiết** ➔ Xem thông tin xét tuyển đầy đủ.
  - Với hồ sơ *Đang xét duyệt*: Có nút **Hủy hồ sơ** giúp thí sinh chủ động rút hồ sơ xét tuyển an toàn.

---

## 8. HỆ THỐNG 12 HỘP THOẠI (MODALS) & HÀNH VI TƯƠNG TÁC

| Tên Modal | Kích hoạt từ đâu? | Chức năng chính |
| :--- | :--- | :--- |
| **`UniversityDetailModal`** | Bấm vào bất kỳ thẻ trường nào | Xem điểm chuẩn 3 năm, học phí, ngành học, nút Nộp hồ sơ và Hỏi AI |
| **`CompareModal`** | Bấm nút So sánh trường (thanh nổi hoặc thẻ) | Bảng đối chiếu song song 2-3 trường theo mọi tiêu chí |
| **`ChatBotModal`** | Icon Robot hoặc nút "Hỏi AI" | Chat hỏi đáp 24/7 với Trợ lý AI tuyển sinh |
| **`CareerPathModal`** | Nút Lộ trình THPT (Tab 0, Tab 1, Tab 4) | Lộ trình định hướng 3 năm cấp 3 theo từng mã RIASEC |
| **`ApplyDemoModal`** | Nút "Nộp hồ sơ" trong chi tiết trường | Đơn đăng ký xét tuyển sớm trực tuyến 3 bước |
| **`AllApplicationsModal`** | Nút "Xem tất cả hồ sơ" ở Tab 4 | Quản lý toàn bộ danh sách hồ sơ xét tuyển |
| **`ViewApplicationModal`** | Nút "Chi tiết" trên thẻ hồ sơ | Biên nhận nộp hồ sơ, mã đăng ký và tiến trình xét duyệt |
| **`EditProfileModal`** | Nút "Chỉnh sửa" thông tin cá nhân | Cập nhật họ tên, số điện thoại, trường THPT, điểm dự kiến |
| **`SettingsModal`** | Icon Cài đặt (Tab 0 hoặc Tab 4) | Hướng dẫn sử dụng, bản quyền nhóm UP5, khôi phục dữ liệu |
| **`NotificationsModal`** | Icon Chuông trên thanh tiêu đề | Xem thông báo tuyển sinh, học bổng và sự kiện |
| **`AuthModal`** | Nút Đăng nhập/Đăng ký | Biểu mẫu xác thực tài khoản và nút dùng thử Demo |
| **`OnboardingModal`** | Khi mới mở app trên điện thoại | 3 slide giới thiệu tính năng chính của Unipath |

---

## 9. CƠ CHẾ PHÂN QUYỀN RBAC & BỘ 3 TÀI KHOẢN KIỂM THỬ

Hệ thống hỗ trợ 3 vai trò phân quyền (Role-Based Access Control) rõ ràng:

1. **⚡ Vai trò Thí sinh (Student) — Đại diện mẫu: Trần Công Quý**
   - **Email:** `quy@unipath.vn` | **Mật khẩu:** `123456`
   - **Quyền hạn:** Làm bài test RIASEC, chạy thuật toán AI Matching 2026, tương tác Livestream EduFair, nộp hồ sơ xét tuyển sớm và theo dõi trạng thái hồ sơ cá nhân.
   - **Giới hạn:** Không thể xem hồ sơ của thí sinh khác, không thể duyệt hồ sơ, không thể sửa CSDL trường.

2. **👑 Vai trò Quản trị viên Hệ thống (System Admin) — UniPath 2.0**
   - **Email:** `admin@unipath.vn` | **Mật khẩu:** `admin123`
   - **Quyền hạn:** Toàn quyền quản trị hệ thống, xem toàn bộ hồ sơ của cả 30 trường đại học trên toàn quốc, phê duyệt trúng tuyển, yêu cầu thí sinh bổ sung giấy tờ, từ chối hồ sơ, và điều chỉnh điểm chuẩn THPT & học phí trong CSDL chuẩn.

3. **🏛️ Vai trò Đại diện Tuyển sinh Trường Đại học Phú Xuân (PXU)**
   - **Email:** `tuyensinh@pxu.edu.vn` | **Mật khẩu:** `pxu123`
   - **Quyền hạn:** Cổng xét tuyển độc quyền của Trường Đại học Phú Xuân: Xem và xét duyệt các hồ sơ nộp vào PXU, quản lý chỉ tiêu tuyển sinh OJT và gói học bổng tài năng 2026.
   - **Giới hạn bảo mật phân lập:** Chỉ xem và xử lý các hồ sơ đăng ký vào Đại học Phú Xuân (`uniCode === 'PXU'`). Toàn bộ hồ sơ của 29 trường đại học khác được ẩn và bảo mật tuyệt đối.

> 💡 **Thanh chuyển vai trò kiểm thử 1-click (Role Switcher Bar):**  
> Xuất hiện tại **Tab 4 (Hồ sơ xét tuyển / Quản trị)** trên cả giao diện Desktop và Mobile, cho phép hội đồng chấm thi và người kiểm thử chuyển đổi nhanh giữa 3 vai trò chỉ bằng 1 nút nhấn!

---

## 10. TÀI LIỆU CHUYÊN SÂU DỰ ÁN
Để nghiên cứu chi tiết từng khía cạnh kỹ thuật và nghiệp vụ, vui lòng tham khảo 4 tài liệu sau trong thư mục gốc:
- 📋 **[01-NGHIEP-VU.md](01-NGHIEP-VU.md):** Nghiệp vụ RIASEC, AI Matching và quy trình tuyển sinh.
- 🎨 **[02-GIAO-DIEN-AI.md](02-GIAO-DIEN-AI.md):** Thiết kế Responsive Adaptive UI, âm thanh Web Audio API và biểu đồ SVG.
- 💻 **[03-KY-THUAT-FRONTEND.md](03-KY-THUAT-FRONTEND.md):** Kỹ thuật React 19, TypeScript 5, Vite 6, Context API và chống tràn layout.
- 🛡️ **[04-KY-THUAT-ADMIN.md](04-KY-THUAT-ADMIN.md):** Ma trận RBAC, luồng duyệt hồ sơ và bảo mật phân lập cho ĐH Phú Xuân.

---

**© 2026 UniPath Vietnam — Bản quyền thuộc về Nhóm UP5, Trường Đại học Phú Xuân (PXU). Phát triển app bởi Trần Công Quý.**
