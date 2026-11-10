# 📋 01-NGHIEP-VU.md: TÀI LIỆU PHÂN TÍCH NGHIỆP VỤ HỆ SINH THÁI UNIPATH 2.0
> **Hệ sinh thái Tuyển sinh & Định hướng nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Phát triển phần mềm & Kỹ sư ứng dụng:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. TỔNG QUAN SỨ MỆNH & BỐI CẢNH DỰ ÁN

Trước thềm kỳ thi tốt nghiệp THPT và kỳ tuyển sinh đại học năm 2026, học sinh lớp 12 (đặc biệt là thế hệ 2k8, 2k9) và quý phụ huynh thường xuyên đối mặt với các khó khăn cốt lõi:
1. **Thiếu định hướng nghề nghiệp chuẩn khoa học:** Chọn ngành theo cảm tính, xu hướng đám đông hoặc áp lực gia đình mà chưa thấu hiểu năng khiếu và nét tính cách cốt lõi của bản thân.
2. **Nhiễu loạn thông tin tuyển sinh:** Hàng trăm trường đại học với hàng nghìn phương thức xét tuyển (xét điểm thi tốt nghiệp THPT, xét học bạ 3 kỳ, đánh giá năng lực ĐHQG/ĐHBK, xét chứng chỉ quốc tế...).
3. **Thiếu công cụ đối soát điểm & ngân sách học phí:** Khó khăn trong việc ước lượng cơ hội trúng tuyển dựa trên tổ hợp điểm thi và khả năng tài chính thực tế của gia đình.
4. **Quy trình nộp hồ sơ xét tuyển sớm rời rạc:** Thiếu một cổng số tập trung để thí sinh trải nghiệm nộp hồ sơ thử nghiệm, theo dõi trạng thái hồ sơ trực tiếp theo thời gian thực.

**UniPath 2.0** ra đời như một giải pháp số toàn diện giải quyết triệt để 4 bài toán trên, xây dựng cầu nối số vững chắc giữa thí sinh THPT và các trường đại học trên cả nước, trong đó **Trường Đại học Phú Xuân (PXU)** giữ vai trò hạt nhân đào tạo và tiên phong công nghệ.

---

## 2. NGHIỆP VỤ TRẮC NGHIỆM HƯỚNG NGHIỆP RIASEC (HOLLAND CODES)

### 2.1. Cơ sở lý thuyết khoa học
Mô hình định hướng nghề nghiệp của Giáo sư Tâm lý học người Mỹ **John L. Holland (1919 – 2008)** phân loại sở thích nghề nghiệp và môi trường làm việc thành 6 nhóm tính cách đặc trưng:

| Mã | Nhóm Tính Cách | Tên Tiếng Anh | Đặc Điểm Cốt Lõi | Ngành Học Điển Hình |
| :---: | :--- | :--- | :--- | :--- |
| **R** | **Kỹ thuật (Realistic)** | Doers | Thực tế, logic, thao tác máy móc, công cụ, vận động ngoài trời | Công nghệ thông tin, Cơ điện tử, Kỹ thuật ô tô, Xây dựng |
| **I** | **Nghiên cứu (Investigative)** | Thinkers | Tìm tòi, phân tích, tư duy phản biện, giải quyết bài toán phức tạp | Khoa học máy tính, AI & Data Science, Y đa khoa, Dược học |
| **A** | **Nghệ thuật (Artistic)** | Creators | Sáng tạo, trực giác, giàu trí tưởng tượng, cảm xúc thẩm mỹ | Thiết kế đồ họa, Truyền thông đa phương tiện, Kiến trúc |
| **S** | **Xã hội (Social)** | Helpers | Hướng ngoại, thấu cảm, thích chia sẻ, giảng dạy, hỗ trợ cộng đồng | Sư phạm, Tâm lý học, Công tác xã hội, Quan hệ quốc tế |
| **E** | **Quản lý (Enterprising)** | Persuaders | Quyết đoán, tố chất lãnh đạo, tự tin thuyết phục, đam mê kinh doanh | Quản trị kinh doanh số, Marketing số, Thương mại quốc tế |
| **C** | **Nghiệp vụ (Conventional)** | Organizers | Chu đáo, chi tiết, tôn trọng quy tắc, làm việc chuẩn xác với số liệu | Kế toán, Tài chính - Ngân hàng, Phân tích dữ liệu kinh doanh |

### 2.2. Thuật toán xử lý trắc nghiệm trong UniPath 2.0
1. **Bộ câu hỏi tiêu chuẩn 12 câu:** Phân bổ đều cho cả 6 nhóm tính cách (mỗi nhóm 2 câu hỏi tình huống thực tế đời sống THPT).
2. **Thang đo 4 mức độ trực quan:**
   - `Rất thích / Hoàn toàn đúng` (+3 điểm)
   - `Khá thích / Đúng phần lớn` (+2 điểm)
   - `Phân vân / Bình thường` (+1 điểm)
   - `Không thích / Không đúng` (0 điểm)
3. **Tính toán & Xếp hạng Vector Điểm:**
   $$\vec{S} = \{S_R, S_I, S_A, S_S, S_E, S_C\}$$
   - Nhóm có điểm cao nhất được xác định là **Mã Tính Cách Nổi Trội (Primary Code)**.
   - 3 nhóm dẫn đầu hợp thành **Mã Holland Kết Hợp (Top-3 Holland Code)** (Ví dụ: `IER`, `AES`, `ERC`).
4. **Trực quan hóa Đa chiều:** Biểu đồ mạng nhện SVG Radar Chart 6 trục thể hiện sự phân bổ năng lực và sự cân bằng tâm lý của thí sinh.

---

## 3. NGHIỆP VỤ ĐỐI SOÁT & PHÂN TÍCH TRÚNG TUYỂN AI MATCHING 2026

### 3.1. Ba tham số đầu vào của thí sinh
- **Điểm thi THPT dự kiến (Score):** Dải từ 10.0đ đến 30.0đ (điểm trung bình tổ hợp 3 môn xét tuyển).
- **Ngân sách học phí tối đa (Budget):** Dải từ 10 triệu đến 50 triệu VNĐ/năm.
- **Khu vực ưu tiên (Region):** `Tất cả` | `Bắc` | `Trung` | `Nam`.

### 3.2. Thuật toán Phân Tầng Cơ Hội (Multi-Factor Admission Engine)
Thuật toán phân tích của UniPath 2.0 tính toán chênh lệch điểm số $\Delta = Score_{thí sinh} - Score_{điểm sàn 2024}$ kết hợp điều kiện trần học phí $Tuition_{trường} \le Budget_{thí sinh}$:

1. **Nhóm 1: Cơ hội trúng tuyển Cao (Safe Zone - An toàn tuyệt đối):**
   - Điều kiện: $\Delta \ge +1.5$ điểm VÀ $Tuition_{trường} \le Budget_{thí sinh}$.
   - Tỷ lệ đỗ dự kiến: **85% - 98%**.
   - Khuyến nghị: Đặt làm nguyện vọng dự phòng an toàn hoặc xét tuyển sớm lấy học bổng.

2. **Nhóm 2: Cơ hội trúng tuyển Vừa sức (Target Zone - Trọng tâm mục tiêu):**
   - Điều kiện: $-1.0 \le \Delta < +1.5$ điểm VÀ $Tuition_{trường} \le Budget_{thí sinh} \times 1.15$.
   - Tỷ lệ đỗ dự kiến: **60% - 84%**.
   - Khuyến nghị: Đặt làm nguyện vọng 1 hoặc 2 trong kỳ xét tuyển chính thức.

3. **Nhóm 3: Cơ hội Thử thách / Vượt tầm (Reach Zone - Nguyện vọng mơ ước):**
   - Điều kiện: $\Delta < -1.0$ điểm HOẶC Học phí vượt ngân sách.
   - Tỷ lệ đỗ dự kiến: **25% - 55%**.
   - Khuyến nghị: Cần nỗ lực ôn luyện bứt phá hoặc tìm kiếm các gói học bổng tài năng.

### 3.3. Logic Chốt Dữ Liệu Tương Tác
- Khi thí sinh điều chỉnh thanh trượt điểm số/học phí, hệ thống chuyển sang trạng thái **"Chờ chốt thông số"** để tránh hiện tượng tự động chạy thuật toán gây giật lag.
- Chỉ khi thí sinh nhấn nút **"⚡ Phân tích cơ hội trúng tuyển ngay"**, hệ thống mới tính toán và xuất bản **Bảng Báo Cáo Phân Tích Thực Tế** kèm dấu thời gian và dữ liệu đầu vào cụ thể.
- Khi thí sinh thay đổi dữ liệu trên slider, bảng báo cáo cũ tự động ẩn đi và mời thí sinh phân tích lại.

---

## 4. NGHIỆP VỤ EDUFAIR LIVESTREAM (UNIPATH LIVE)

Hệ sinh thái tích hợp ngày hội tuyển sinh trực tuyến EduFair 2026:
- **Phát trực tiếp (Live Stream Session):** Phiên tư vấn định hướng trực tiếp từ Hội đồng tuyển sinh các trường đại học hàng đầu (Tiêu biểu là Trường Đại học Phú Xuân).
- **Tương tác Đa giác quan qua Web Audio API (SoundFX Synthesizer):**
  - **Nút Vỗ tay (Clap):** Phát hiệu ứng vỗ tay tần số bổng kèm icon 👏 bay lượn ngẫu nhiên rồi tan biến.
  - **Nút Thả tim (Heart):** Phát nhịp tim sinh học trầm ấm kèm icon ❤️ bay lượn.
  - **Nút Thích (Like):** Phát âm thanh thanh thoát kèm icon 👍 bay lượn.
- **Hộp thoại Q&A Trực Tuyến:** Thí sinh gửi câu hỏi thắc mắc về điểm chuẩn, học bổng OJT, cơ hội việc làm và được Ban Cố Vấn giải đáp ngay trong phiên live.

---

## 5. NGHIỆP VỤ NỘP & THEO DÕI HỒ SƠ XÉT TUYỂN SỚM

### 5.1. Vòng đời hồ sơ xét tuyển (Application Lifecycle)
```
[Thí sinh nộp hồ sơ] 
        ↓
[Trạng thái: Đang xét duyệt] (Mã tự sinh: HS-2026-UNIxxxx)
        ↓
┌───────┴───────────────────────┐
↓                               ↓
[Đủ điều kiện & đạt điểm sàn]   [Thiếu giấy tờ / Học bạ]
        ↓                               ↓
[Trạng thái: Đã trúng tuyển]    [Trạng thái: Thiếu hồ sơ]
(Gửi giấy báo trúng tuyển)      (Yêu cầu bổ sung trước hạn)
                                        ↓
                                [Trạng thái: Đã bị hủy]
                                (Không đạt sàn hoặc quá hạn)
```

### 5.2. Các trường thông tin hồ sơ
- Mã hồ sơ (Auto-generated unique code)
- Trường đăng ký (Tên trường, mã trường, logo)
- Ngành đăng ký xét tuyển
- Họ và tên thí sinh, Số điện thoại, Email
- Điểm xét tuyển (Học bạ / Điểm thi THPT)
- Thời gian nộp (Ngày giờ chính xác)
- Trạng thái phê duyệt & Mã màu trực quan:
  - `Đang xét duyệt` (Màu vàng hổ phách `#F59E0B`)
  - `Đã trúng tuyển` (Màu xanh lá emerald `#10B981`)
  - `Thiếu hồ sơ` (Màu xanh dương `#2563EB`)
  - `Đã bị hủy / Từ chối` (Màu đỏ `#EF4444`)
- Lịch sử ghi chú từ Hội đồng tuyển sinh trường

---

## 6. ĐƠN VỊ THỰC HIỆN & BẢN QUYỀN

Toàn bộ tài liệu nghiệp vụ và giải pháp công nghệ thuộc bản quyền sở hữu của:
* 🏛️ **Đơn vị chủ quản & Đào tạo:** **Trường Đại học Phú Xuân (PXU)**
* 👥 **Nhóm nghiên cứu & phát triển UP5:**
  * 👑 **Trưởng nhóm:** **Dương Đình Phát**
  * 💻 **Kỹ sư phát triển phần mềm:** **Trần Công Quý**
  * 🤝 **Thành viên:** **Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga**
