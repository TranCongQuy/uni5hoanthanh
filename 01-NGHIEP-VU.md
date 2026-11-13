# 📋 01-NGHIEP-VU.md: TÀI LIỆU PHÂN TÍCH NGHIỆP VỤ HỆ SINH THÁI UNIPATH 2.0
> **Hệ sinh thái Tuyển sinh & Định hướng Nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Kỹ sư phát triển phần mềm:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. BỐI CẢNH THỰC TIỄN & MỤC TIÊU NGHIỆP VỤ

Trong bối cảnh đổi mới toàn diện kỳ thi tốt nghiệp THPT và tuyển sinh đại học năm 2026, học sinh cấp 3 (đặc biệt là khóa 2k8, 2k9) cùng phụ huynh gặp phải 4 rào cản lớn:
1. **Định hướng ngành nghề thiếu cơ sở khoa học:** Lựa chọn ngành học theo xu hướng đám đông thay vì dựa trên trắc nghiệm năng lực và thiên hướng tính cách chuẩn hóa.
2. **Phân mảnh dữ liệu tuyển sinh:** Thông tin điểm chuẩn nhiều năm, học phí, học bổng và tỷ lệ việc làm nằm rải rác ở hàng chục website khác nhau.
3. **Thiếu công cụ định lượng xác suất trúng tuyển & tài chính:** Học sinh khó tự cân đối giữa *Điểm dự kiến*, *Ngân sách học phí gia đình* và *Khu vực địa lý* để phân bổ nguyện vọng an toàn – vừa sức – thử thách.
4. **Quy trình xét tuyển sớm & tư vấn 1-1 thiếu tính liên thông:** Thiếu một nền tảng kết nối xuyên suốt từ bước nộp hồ sơ trực tuyến, đặt lịch gặp gỡ ban tuyển sinh đến bước nhận phản hồi xét duyệt và bổ sung minh chứng theo thời gian thực.

**UniPath 2.0** giải quyết trọn vẹn 4 bài toán trên trong một hệ sinh thái khép kín, lấy **Trường Đại học Phú Xuân (PXU)** với mô hình đào tạo thực chiến **OJT (On-the-Job Training)** làm điểm nhấn tiêu biểu bên cạnh 29 trường đại học trọng điểm khắp 3 miền Bắc – Trung – Nam.

---

## 2. NGHIỆP VỤ TRẮC NGHIỆM HƯỚNG NGHIỆP HOLLAND RIASEC

### 2.1. Mô hình 6 nhóm tính cách nghề nghiệp của John L. Holland
Hệ thống áp dụng khung phân loại chuẩn quốc tế **RIASEC** gồm 6 nhóm thiên hướng:

| Mã | Nhóm Tính Cách | Đặc trưng cốt lõi | Nhóm ngành đào tạo tiêu biểu trong UniPath 2.0 |
| :---: | :--- | :--- | :--- |
| **R** | **Kỹ thuật (Realistic)** | Thực tế, tư duy kỹ thuật, thích thao tác công cụ, máy móc, hệ thống | Kỹ thuật Ô tô, Cơ điện tử, Điện – Điện tử, Công nghệ thông tin ứng dụng |
| **I** | **Nghiên cứu (Investigative)** | Phân tích sâu, tư duy logic – toán học, khám phá học thuật & công nghệ lõi | Khoa học máy tính, Trí tuệ nhân tạo (AI), Khoa học dữ liệu, Y khoa, Dược học |
| **A** | **Nghệ thuật (Artistic)** | Sáng tạo thị giác, nhạy cảm thẩm mỹ, truyền thông & biểu đạt nội dung | Thiết kế đồ họa, Truyền thông đa phương tiện, Kiến trúc, Quan hệ công chúng |
| **S** | **Xã hội (Social)** | Thấu cảm, giao tiếp tốt, yêu thích giảng dạy, chăm sóc & kết nối cộng đồng | Sư phạm, Tâm lý học, Ngôn ngữ Anh/Trung/Nhật, Điều dưỡng, Du lịch |
| **E** | **Quản lý (Enterprising)** | Quyết đoán, dẫn dắt đội nhóm, nhạy bén kinh doanh, thương mại & khởi nghiệp | Quản trị kinh doanh số, Marketing số, Thương mại điện tử, Kinh doanh quốc tế |
| **C** | **Nghiệp vụ (Conventional)** | Cẩn trọng, quy củ, làm việc chính xác với quy trình, kế toán & dữ liệu số | Tài chính – Ngân hàng, Kế toán – Kiểm toán, Logistics & Quản lý chuỗi cung ứng |

### 2.2. Cấu trúc đề thi & Công thức chấm điểm trong hệ thống
1. **Bộ câu hỏi chuẩn hóa (`QUIZ_QUESTIONS`):** Gồm **12 câu hỏi tình huống thực tế** tại trường THPT, phân bổ đồng đều **2 câu cho mỗi nhóm** (`R, I, A, S, E, C`).
2. **Thang đo 4 mức độ phản hồi:**
   - *Rất thích / Hoàn toàn đúng:* `+3 điểm`
   - *Khá thích / Đúng phần lớn:* `+2 điểm`
   - *Phân vân / Bình thường:* `+1 điểm`
   - *Không thích / Không đúng:* `0 điểm`
   - Điểm tối đa của mỗi trục tính cách là **6 điểm** (`2 câu × 3 điểm`).
3. **Xác định kết quả & Lộ trình THPT 3 năm:**
   - Hệ thống tính vector điểm 6 chiều $\vec{S} = (S_R, S_I, S_A, S_S, S_E, S_C)$, sắp xếp giảm dần để tìm **Mã chủ đạo (`primaryCode`)** và **Tổ hợp Top 3 (`topCodes`)**.
   - Kết quả được biểu diễn trên **Biểu đồ Mạng nhện SVG 6 trục (`RadarChart`)**, đi kèm gợi ý lộ trình chuẩn bị năng lực từ Lớp 10 → Lớp 11 → Lớp 12 trong `CareerPathModal` và tự động liên kết sang thuật toán **AI Matching 2026**.

---

## 3. NGHIỆP VỤ ĐỐI SOÁT TRÚNG TUYỂN AI MATCHING 2026 (`MatchingService.ts`)

### 3.1. Đầu vào đối soát đa tiêu chí
- **Điểm thi dự kiến (`score`):** Thang `10.0` – `30.0` điểm (tổ hợp 3 môn xét tuyển).
- **Ngân sách học phí tối đa (`budget`):** Thang `10` – `60+` triệu VNĐ/năm (lọc các trường có `tuitionMin <= budget`).
- **Vùng miền ưu tiên (`region`):** `Tất cả` | `Bắc` | `Trung` | `Nam`.
- **Mã tính cách Holland (`hollandCode` - tùy chọn):** Tự động đồng bộ từ bài khảo sát ở Tab 1 để ưu tiên ngành học đúng đam mê.

### 3.2. Thuật toán chọn ngành tham chiếu & Tính xác suất trúng tuyển
Toàn bộ thẻ trường ở Trang chủ, trang Chi tiết trường và bảng AI Matching đều dùng **duy nhất một nguồn công thức** tại `src/services/MatchingService.ts`:
1. **Chọn ngành tham chiếu (`pickReferenceCutoff`):**
   - Nếu thí sinh đã có `hollandCode` và trường có đào tạo ngành thuộc nhóm Holland đó (`HOLLAND_MAJOR_KEYWORDS`), hệ thống ưu tiên chọn ngành đúng định hướng có điểm chuẩn gần sát năng lực thí sinh nhất (`isHolland = true`).
   - Nếu chưa có mã Holland hoặc trường không có ngành trùng khớp, hệ thống chọn ngành có độ lệch $|\text{Điểm thí sinh} - \text{Điểm chuẩn ngành}|$ nhỏ nhất.
2. **Quy đổi độ chênh lệch điểm $\Delta = \text{score} - \text{cutoff}$ sang xác suất cơ sở (`admissionPercent`):**
   - $\Delta \ge +3.0$: **96%** | $\Delta \ge +2.0$: **91%** | $\Delta \ge +1.0$: **85%** | $\Delta \ge +0.5$: **80%**
   - $\Delta \ge 0.0$: **73%** | $\Delta \ge -0.5$: **64%** | $\Delta \ge -1.0$: **54%** | $\Delta \ge -1.5$: **45%**
   - $\Delta \ge -2.5$: **30%** | $\Delta \ge -3.5$: **18%** | $\Delta < -3.5$: **9%**
3. **Điểm cộng tương thích hướng nghiệp:** Cộng thêm **`+5%`** (tối đa `100%`) nếu ngành tham chiếu khớp với nhóm tính cách Holland của thí sinh.
4. **Phân tầng 3 nhóm chiến lược nguyện vọng:**
   - 🟢 **Nhóm An Toàn (`matchingPercent ≥ 80%`):** Khả năng trúng tuyển rất cao, phù hợp làm nguyện vọng chắc chắn hoặc săn học bổng đầu vào.
   - 🟡 **Nhóm Vừa Sức (`45% ≤ matchingPercent ≤ 79%`):** Vùng cạnh tranh trọng tâm, khuyến nghị đặt làm Nguyện vọng 1 – 2.
   - 🔴 **Nhóm Thử Thách (`matchingPercent < 45%`):** Nguyện vọng bứt phá, cần cải thiện điểm thi hoặc kết hợp phương thức xét tuyển học bạ / đánh giá năng lực.

### 3.3. Đồng bộ Điểm chuẩn Thời gian thực từ Cổng Quản trị
Khi **Admin Hệ thống** (đối với cả 30 trường) hoặc **Ban Tuyển sinh ĐH Phú Xuân** (đối với riêng trường `PXU`) điều chỉnh điểm chuẩn tham chiếu (`score2024`), hệ thống tự động tịnh tiến toàn bộ bảng điểm chuẩn từng ngành (`cutoffScores`) của trường đó theo đúng độ lệch $\Delta$, giúp kết quả dự đoán của **AI Matching 2026** cập nhật tức thì theo chính sách tuyển sinh mới nhất.

---

## 4. NGHIỆP VỤ XÉT TUYỂN TRỰC TUYẾN & ĐẶT LỊCH TƯ VẤN 1-1 LIÊN THÔNG

### 4.1. Vòng đời 6 trạng thái của Hồ sơ Xét tuyển (`ApplicationStatus`)
```
[Thí sinh nộp hồ sơ trực tuyến qua ApplyDemoModal]
                        │
                        ▼
           (1) ĐANG XÉT DUYỆT (Mặc định) ──────► (5) ĐÃ HỦY (Thí sinh chủ động rút hồ sơ)
                        │
        ┌───────────────┼───────────────────────┬────────────────────────┐
        ▼               ▼                       ▼                        ▼
(2) HỒ SƠ HỢP LỆ   (3) ĐÃ TRÚNG TUYỂN    (4) THIẾU HỒ SƠ         (6) ĐÃ BỊ HỦY
(Đủ điều kiện       (Cấp Giấy báo Đủ      (Cần bổ sung học bạ/    (Từ chối do không
 hợp lệ vòng sơ     điều kiện trúng       CCCD kèm ghi chú cụ     đạt điều kiện xét
 duyệt)             tuyển sớm trực tuyến)  thể từ Hội đồng)        tuyển của trường)
                                                │
                                                ▼
                                  [Thí sinh gửi bổ sung minh chứng]
                                                │
                                                ▼
                                  Quay lại (1) ĐANG XÉT DUYỆT
```

- **Khép kín luồng bổ sung hồ sơ:** Khi Hội đồng tuyển sinh chuyển hồ sơ sang `Thiếu hồ sơ` kèm lời nhắn (ví dụ: *"Bổ sung ảnh chụp học bạ HK1 lớp 12"*), thí sinh nhận được thông báo ngay trên chuông, mở chi tiết hồ sơ để nhập nội dung xác nhận minh chứng và gửi xét duyệt lại.
- **Giấy báo Trúng tuyển sớm điện tử:** Khi hồ sơ được duyệt `Đã trúng tuyển`, thí sinh mở `ViewApplicationModal` sẽ thấy thẻ chứng nhận chúc mừng trúng tuyển sớm trang trọng cùng hướng dẫn xác nhận nhập học.

### 4.2. Quy trình Đặt lịch & Điều phối Tư vấn Tuyển sinh 1-1
1. **Thí sinh đặt lịch (`BookConsultationModal`):** Khởi tạo từ trang Chi tiết trường, kết quả AI Matching, gian hàng ảo EduFair LIVE hoặc trang Cá nhân. Thí sinh chọn trường, ngành quan tâm, ngày & khung giờ, hình thức tư vấn (`Google Meet 1-1`, `Gọi điện / Zalo`, `Tư vấn trực tiếp tại cơ sở`) và câu hỏi gửi trước.
2. **Nhà trường / Admin tiếp nhận & xử lý:** Lịch hẹn xuất hiện ngay tại Cổng Tuyển sinh PXU (nếu đặt lịch với ĐH Phú Xuân) và Cổng Admin Toàn quốc. Cán bộ tư vấn chuyển trạng thái tuần tự:
   - `Chờ liên hệ` (`pending`) → `Đã liên hệ` (`contacted`) → `Hoàn thành` (`done`).
3. **Phản hồi ngược về thí sinh:** Mọi thay đổi trạng thái lịch hẹn đều tự động gửi thông báo về tài khoản thí sinh và cập nhật trực tiếp tại mục **Lịch hẹn tư vấn 1-1** trên Tab 4.

---

## 5. NGÀY HỘI TUYỂN SINH TRỰC TUYẾN EDUFAIR LIVE
- **Gian hàng ảo các trường đại học:** Hiển thị trạng thái phát sóng trực tiếp (`LIVE`), số người đang theo dõi, cho phép xem hồ sơ trường hoặc bấm **Đặt lịch 1-1** ngay trên từng gian hàng.
- **Phòng Livestream Tư vấn Chuyên gia:** Hỗ trợ thả cảm xúc đa giác quan (*Thích*, *Thả tim*, *Vỗ tay*) với âm thanh tổng hợp trực tiếp qua **Web Audio API**, đếm ngược sự kiện và khung hỏi đáp trực tuyến tự động phản hồi từ Ban Tư vấn Tuyển sinh.
