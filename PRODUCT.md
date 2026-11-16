# PRODUCT.md — UniPath 2.0 (Hệ Sinh Thái Tuyển Sinh Quốc Gia)

## 1. Tầm Nhìn Sản Phẩm
UniPath 2.0 là nền tảng số hóa quy trình xét tuyển đại học và định hướng nghề nghiệp thông minh, kết nối trực tiếp giữa **Thí sinh 2k8**, **Hội đồng Tuyển sinh Trường Đại học Phú Xuân (PXU)** và **Quản trị viên Hệ thống Tuyển sinh Cấp cao (Admin)**.

Hệ thống được thiết kế hướng tới sự **chuẩn xác, minh bạch, bảo mật phân quyền nghiêm ngặt và đối soát dữ liệu 100%**, vận hành trên ngôn ngữ thiết kế **Aurora Deep Tech & Glassmorphism** giàu chiều sâu thị giác, loại bỏ hoàn toàn các thông số ảo và quy trình thủ công dễ sai sót.

---

## 2. Người Dùng Mục Tiêu & Cổng Tương Tác (Personas & Portals)

### 2.1. Thí sinh 2k8 & Phụ huynh (Cổng Thí sinh — Student Portal)
- **Rào chắn bảo vệ (Auth Gate)**: Bắt buộc đăng nhập hoặc đăng ký tài khoản trước khi vào cổng; hỗ trợ điền nhanh thông tin tài khoản mẫu 1-click hoặc tạo tài khoản mới.
- **Nhu cầu cốt lõi**:
  - Tra cứu thông tin, điểm chuẩn 3 năm và học phí của 30 trường đại học trọng điểm Bắc – Trung – Nam qua ảnh bìa campus thật 100%.
  - Phân tích cơ hội trúng tuyển thực tế bằng **AI Matching 2026** theo tổ hợp môn (A00, A01, D01, B00, C00), ngân sách thực tế và nhóm tính cách Holland.
  - Khám phá thiên hướng nghề nghiệp qua trắc nghiệm tâm lý **Holland RIASEC chuẩn hóa (12 câu hỏi)** và lộ trình năng lực 3 năm THPT.
  - Đặt lịch tư vấn 1-1 với giảng viên/chuyên gia tuyển sinh và nộp hồ sơ xét tuyển sớm trực tuyến an toàn.
  - Tương tác với **Trợ lý AI Tuyển sinh (AI Assistant Dock)** ghim cố định ở góc phải màn hình desktop với bộ nhớ hội thoại đa lượt và dữ liệu 30 trường.
- **Tiêu chuẩn trải nghiệm**: Giao diện trực quan, chiều sâu thị giác Aurora, ảnh khuôn viên trường học chân thực, không có số liệu bịa đặt hay quảng cáo gây xao nhãng.

### 2.2. Ban Tuyển sinh Đại học Phú Xuân — PXU (Cổng PXU CRM — University Portal)
- **Thanh điều hướng cố định (3-Tier Emerald Sidebar)**: Pinned Header giữ logo PXU luôn ở đỉnh, Middle Menu cuộn độc lập mượt mà không che khuất nội dung, Pinned Footer neo thẻ bảo mật phân lập.
- **Nhu cầu cốt lõi**:
  - Quản lý và xử lý hồ sơ thí sinh đăng ký vào 4 ngành đào tạo mũi nhọn: *Công nghệ thông tin, Quản trị kinh doanh, Ngôn ngữ Anh, Thiết kế đồ họa*.
  - **Tự động đối soát Điểm chuẩn ngành PXU & Đề xuất Học bổng OJT (On-the-Job Training)**: Tự động so sánh điểm hồ sơ với điểm chuẩn ngành, phân loại mức chênh lệch $\ge +4.0$đ để gợi ý học bổng doanh nghiệp OJT.
  - Điều phối lịch hẹn tư vấn 1-1 dạng **Kanban 3 cột** (`Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`).
  - Cập nhật chỉ tiêu tuyển sinh, điểm chuẩn tham chiếu và mức học phí tối thiểu của riêng trường PXU theo thời gian thực (đồng bộ tức thì sang AI Matching).
- **Tiêu chuẩn trải nghiệm**: Tối ưu khả năng quét dữ liệu (scanability), bảng biểu cố định tiêu đề (sticky headers), phím tắt nhanh, nhật ký xử lý minh bạch.

### 2.3. Admin Hệ Thống Tuyển Sinh (Cổng Điều Hành Quốc Gia — System Admin Portal)
- **Thanh điều hướng cố định (3-Tier Deep Aurora Sidebar)**: Pinned Header thương hiệu UniPath Admin, Middle Menu cuộn độc lập mượt mà, Pinned Footer hiển thị trạng thái đồng bộ và nút khôi phục dữ liệu mẫu.
- **Nhu cầu cốt lõi**:
  - **Tab Benchmark 30 trường đại học (`benchmark`)**: Biểu đồ phân bố điểm chuẩn 6 phân khoảng (Histogram buckets), tỷ lệ đạt chuẩn ngành, top 3 ngành cạnh tranh nhất và điểm trung bình 3 miền.
  - **Tab Quản trị hệ thống & Audit Log (`system`)**: Giám sát nguồn cấp dữ liệu, kết nối Supabase Cloud Mirroring, dung lượng lưu trữ LocalStorage client-side, và toàn bộ dòng nhật ký kiểm toán hệ thống.
  - **Global Search (`AdminGlobalSearch`)**: Phím tắt `Ctrl + K` hoặc thanh tìm kiếm header tra cứu tức thì thí sinh, trường đại học, ngành học và chức năng quản trị.
  - Giám sát phễu xét tuyển toàn quốc, duyệt hồ sơ hàng loạt hoặc đơn lẻ tuân thủ nghiêm ngặt FSM và yêu cầu giải trình bắt buộc khi duyệt dưới chuẩn ngành.
  - Cập nhật điểm chuẩn và học phí cả 30 trường đại học, đối soát lịch hẹn tư vấn và xuất báo cáo CSV an toàn chống Formula Injection.
- **Tiêu chuẩn trải nghiệm**: Trung tâm điều hành dữ liệu quy mô lớn, thông tin mật độ tối ưu, bảng biểu SaaS chuẩn mực, phân quyền RBAC và bảo vệ an toàn dữ liệu.

---

## 3. Nguyên Tắc Cốt Lõi (Core Principles)
1. **Dữ liệu thật, cam kết thật**: Không hiển thị số liệu ảo, ảnh campus thật 30/30 trường từ `campus_*.jpg`, không dùng testimonial hay thống kê chưa được kiểm chứng.
2. **Một công thức tính toán duy nhất**: Tỷ lệ trúng tuyển % giữa AI Matching, Thẻ trường và Chi tiết trường đại học luôn đồng nhất từ `MatchingService.ts`, giới hạn trần $\le 98\%$.
3. **Bảo mật & Rào quyền Auth Gate**: Xóa bỏ hoàn toàn tài khoản khách vãng lai; mọi phiên làm việc đều có danh tính và mật khẩu băm Salted SHA-256; thí sinh chỉ thấy và quản lý hồ sơ của chính mình.
4. **Kiểm thử tự động 100%**: Duy trì 77 bài kiểm thử Vitest bao phủ FSM, rào quyền, phân tích benchmark, EduFair phase và bắt lỗi an toàn runtime.
5. **Chuẩn mực nền tảng Web**: Tuân thủ hướng dẫn Modern Web Standards (W3C/Baseline), hỗ trợ bộ gõ tiếng Việt hoàn hảo, tiếp cận chuẩn trợ năng WCAG.
