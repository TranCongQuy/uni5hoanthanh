# PRODUCT.md — UniPath 2.0 (Hệ Thống Tuyển Sinh Quốc Gia)

## 1. Tầm Nhìn Sản Phẩm
UniPath 2.0 là nền tảng số hóa quy trình xét tuyển đại học và định hướng nghề nghiệp thông minh, kết nối trực tiếp giữa **Thí sinh 2k8**, **Hội đồng Tuyển sinh Trường Đại học Phú Xuân (PXU)** và **Quản trị viên Hệ thống Tuyển sinh Cấp cao (Admin)**.

Hệ thống được thiết kế hướng tới sự **chuẩn xác, minh bạch, bảo mật phân quyền nghiêm ngặt và đối soát dữ liệu 100%**, loại bỏ hoàn toàn các thông số ảo và quy trình thủ công dễ sai sót.

---

## 2. Người Dùng Mục Tiêu & Chế Độ Sử Dụng (Personas & Modes)

### 2.1. Thí sinh 2k8 & Phụ huynh (Chế độ `Persuade` & `Experience`)
- **Nhu cầu**:
  - Tra cứu thông tin, điểm chuẩn và học phí của 30 trường đại học trọng điểm Bắc – Trung – Nam.
  - Phân tích cơ hội trúng tuyển thực tế bằng AI Matching theo tổ hợp môn (A00, A01, D01, B00, C00) và ngân sách thực tế.
  - Khám phá thiên hướng nghề nghiệp qua trắc nghiệm tâm lý Holland RIASEC chuẩn hóa (12 câu hỏi).
  - Đặt lịch tư vấn 1-1 với giảng viên/chuyên gia tuyển sinh và nộp hồ sơ xét tuyển sớm an toàn.
- **Tiêu chuẩn trải nghiệm**: Giao diện trực quan, tôn trọng thị giác, hình ảnh khuôn viên trường học chân thực, không có số liệu bịa đặt hay quảng cáo gây xao nhãng.

### 2.2. Ban Tuyển sinh Đại học Phú Xuân — PXU (Chế độ `Operate`)
- **Nhu cầu**:
  - Quản lý và xử lý hồ sơ thí sinh đăng ký vào 4 ngành đào tạo mũi nhọn: *Công nghệ thông tin, Quản trị kinh doanh, Ngôn ngữ Anh, Thiết kế đồ họa*.
  - Thẩm định hồ sơ xét tuyển sớm theo chuẩn doanh nghiệp OJT (On-the-Job Training) và cấp học bổng tài trợ.
  - Điều chỉnh chỉ tiêu tuyển sinh và ngưỡng điểm đảm bảo chất lượng đầu vào theo thời gian thực.
- **Tiêu chuẩn trải nghiệm**: Tối ưu khả năng quét dữ liệu (scanability), bảng biểu cố định tiêu đề (sticky headers), phím tắt nhanh, nhật ký xử lý minh bạch.

### 2.3. Admin Hệ Thống Tuyển Sinh (Chế độ `Operate`)
- **Nhu cầu**:
  - Giám sát toàn diện phễu xét tuyển 5 giai đoạn: *Đang chờ xét duyệt -> Hồ sơ hợp lệ -> Đã trúng tuyển sớm -> Chờ bổ sung -> Đã rút / Từ chối*.
  - Duyệt hồ sơ hàng loạt hoặc đơn lẻ tuân thủ nghiêm ngặt Máy trạng thái (FSM) và yêu cầu giải trình bắt buộc khi điểm dưới chuẩn ngành.
  - Cập nhật chuẩn dữ liệu CSDL 30 trường đại học, đối soát lịch hẹn tư vấn và xuất báo cáo CSV an toàn chống Formula Injection.
- **Tiêu chuẩn trải nghiệm**: Độ tin cậy cao, thông tin mật độ vừa phải, màu sắc chỉ thị trạng thái chuẩn xác, bảo mật phân quyền Role-Based Access Control (RBAC).

---

## 3. Nguyên Tắc Cốt Lõi (Core Principles)
1. **Dữ liệu thật, cam kết thật**: Không hiển thị số liệu ảo, không dùng testimonial hay thống kê chưa được kiểm chứng.
2. **Một công thức tính toán duy nhất**: Tỷ lệ trúng tuyển % giữa AI Matching, Thẻ trường và Chi tiết trường đại học luôn đồng nhất, giới hạn trần <= 98%.
3. **Bảo mật & Cô lập dữ liệu**: Mọi thao tác đổi trạng thái hồ sơ phải có actor và căn cứ; thí sinh chỉ thấy và quản lý hồ sơ của chính mình; mật khẩu được băm Salted SHA-256.
4. **Chuẩn mực nền tảng Web**: Tuân thủ hướng dẫn Modern Web Standards (W3C/Baseline), hỗ trợ bộ gõ tiếng Việt hoàn hảo, tiếp cận chuẩn trợ năng WCAG.
