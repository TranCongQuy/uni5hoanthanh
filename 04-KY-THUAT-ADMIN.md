# 🛡️ 04-KY-THUAT-ADMIN.md: TÀI LIỆU KỸ THUẬT PHÂN QUYỀN RBAC & QUẢN TRỊ TUYỂN SINH
> **Hệ sinh thái Tuyển sinh & Định hướng Nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Kỹ sư phát triển phần mềm:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. KIẾN TRÚC ĐỊNH TUYẾN ĐA CỔNG THEO VAI TRÒ (ROLE-BASED PORTAL ROUTING)

Trong `src/App.tsx`, hệ thống kiểm tra trực tiếp phiên xác thực (`isLoggedIn`, `user.role`) để định tuyến người dùng vào **3 không gian ứng dụng hoàn toàn tách biệt**, kết hợp cùng chế độ **Khách trải nghiệm (`Guest`)**:

```text
                        ┌──────────────────────────────────────────────┐
                        │     KHO DỮ LIỆU LIÊN THÔNG UNIPATH 2.0       │
                        │ (Hồ sơ Xét tuyển • Lịch 1-1 • 30 Trường ĐH)  │
                        └──────────────────────┬───────────────────────┘
                                               │
        ┌──────────────────────────────────────┼──────────────────────────────────────┐
        ▼                                      ▼                                      ▼
┌───────────────────────────────┐  ┌────────────────────────────────┐  ┌──────────────────────────────┐
│    CỔNG THÍ SINH (STUDENT)    │  │   CỔNG ĐH PHÚ XUÂN (PXU)       │  │   CỔNG QUẢN TRỊ (ADMIN)      │
│  MobileView / DesktopView     │  │   UniversityApp.tsx            │  │   AdminApp.tsx               │
│  Email: quy@unipath.vn        │  │   Email: tuyensinh@pxu.edu.vn  │  │   Email: admin@unipath.vn    │
├───────────────────────────────┤  ├────────────────────────────────┤  ├──────────────────────────────┤
│ • Chỉ đọc myApplications &    │  │ • CÔ LẬP DỮ LIỆU CẤP TRƯỜNG:   │  │ • Toàn quyền giám sát 100%   │
│   myBookings của chính mình   │  │   Chỉ xem & xử lý hồ sơ/lịch   │  │   hồ sơ & lịch hẹn 30 trường │
│ • Nộp hồ sơ mới, bổ sung minh │  │   hẹn có uniCode === 'PXU'     │  │ • Duyệt đơn lẻ & hàng loạt   │
│   chứng khi 'Thiếu hồ sơ'     │  │ • Phê duyệt 4 trạng thái + ghi │  │   (Batch Update) kèm ghi chú │
│ • Chủ động rút hồ sơ cá nhân  │  │   chú hội đồng tuyển sinh PXU  │  │ • Chỉnh sửa điểm chuẩn & học │
│ • Đặt lịch tư vấn 1-1         │  │ • Cập nhật điểm chuẩn & học    │  │   phí toàn bộ 30 trường ĐH   │
│ • Chặn 100% quyền xem hồ sơ   │  │   phí của riêng trường PXU     │  │ • Quản lý tài khoản & Nhật   │
│   người khác hoặc duyệt đơn   │  │ • Chặn 100% 29 trường còn lại  │  │   ký kiểm toán hệ thống      │
└───────────────────────────────┘  └────────────────────────────────┘  └──────────────────────────────┘
```

---

## 2. MA TRẬN PHÂN QUYỀN & GIỚI HẠN BẢO MẬT CHI TIẾT (RBAC MATRIX)

| Nghiệp vụ / Quyền thao tác | Khách (`Guest`) | Thí sinh (`student`) | ĐH Phú Xuân (`university_pxu`) | Admin (`admin`) |
| :--- | :---: | :---: | :---: | :---: |
| **Tra cứu, lọc & so sánh 30 trường ĐH** | ✅ Có | ✅ Có | 🏛️ Cổng riêng PXU | 🛡️ Cổng quản trị 30 trường |
| **Làm trắc nghiệm Holland RIASEC & AI Matching** | ✅ Dùng thử | ✅ Lưu theo tài khoản | — | — |
| **Nộp hồ sơ xét tuyển trực tuyến (`addApplication`)** | 🔒 Yêu cầu đăng nhập | ✅ Toàn quyền | ❌ Chặn bởi RBAC Guard | ❌ Chặn bởi RBAC Guard |
| **Đặt lịch tư vấn 1-1 (`addBooking`)** | 🔒 Yêu cầu đăng nhập | ✅ Toàn quyền | ❌ Chặn bởi RBAC Guard | ❌ Chặn bởi RBAC Guard |
| **Xem danh sách hồ sơ xét tuyển** | ❌ Trống (`0`) | 🔒 Chỉ hồ sơ của mình | 🔒 Chỉ hồ sơ nộp `PXU` | ✅ Toàn bộ 30 trường |
| **Rút / Hủy hồ sơ cá nhân (`cancelApplication`)** | ❌ Không | 🔒 Chỉ hồ sơ của mình | ❌ Không (dùng chức năng Từ chối) | ❌ Không (dùng chức năng Từ chối) |
| **Gửi bổ sung minh chứng khi `Thiếu hồ sơ`** | ❌ Không | 🔒 Chỉ chủ sở hữu hồ sơ | ❌ Không | ❌ Không |
| **Xác nhận `Hồ sơ hợp lệ` / `Đã trúng tuyển`** | ❌ Không | ❌ Nghiêm cấm | 🔒 Chỉ hồ sơ nộp `PXU` | ✅ Toàn bộ 30 trường (+ Duyệt hàng loạt) |
| **Yêu cầu bổ sung (`Thiếu hồ sơ`) / Từ chối (`Đã bị hủy`)** | ❌ Không | ❌ Nghiêm cấm | 🔒 Chỉ hồ sơ nộp `PXU` | ✅ Toàn bộ 30 trường (+ Duyệt hàng loạt) |
| **Cập nhật trạng thái lịch hẹn tư vấn 1-1** | ❌ Không | 👁️ Chỉ xem tiến độ của mình | 🔒 Chỉ lịch hẹn của `PXU` | ✅ Toàn bộ lịch hẹn hệ thống |
| **Chỉnh sửa Điểm chuẩn & Học phí (`updateUniversityMetrics`)** | ❌ Không | ❌ Nghiêm cấm | 🔒 **Chỉ riêng trường `PXU` (`id: 11`)** | ✅ Toàn bộ 30 trường đại học |
| **Xem danh sách tài khoản thí sinh đăng ký** | ❌ Không | ❌ Nghiêm cấm | ❌ Không | ✅ Toàn quyền tra cứu |
| **Xem Nhật ký kiểm toán (`processingLog`)** | ❌ Không | ❌ Không | 🔒 Chỉ nhật ký hồ sơ `PXU` | ✅ Toàn bộ nhật ký hệ thống |

---

## 3. ĐẶC TẢ KỸ THUẬT 2 CỔNG QUẢN TRỊ CHUYÊN BIỆT

### 3.1. Cổng Tuyển sinh Trường Đại học Phú Xuân (`src/components/university/UniversityApp.tsx`)
Được thiết kế theo chuẩn **Executive Emerald CRM (`#064E3B` + `#F8FAFC`)** dành riêng cho **Ban Tư vấn Tuyển sinh ĐH Phú Xuân (`tuyensinh@pxu.edu.vn` / `pxu123`)**:
1. **Tổng quan PXU (`overview`):** Banner nhận diện ĐH Phú Xuân (OJT 3 năm, 96% việc làm), 4 thẻ KPI tương tác (bấm nhảy thẳng sang bộ lọc tương ứng), biểu đồ phân bổ thí sinh theo ngành đào tạo mũi nhọn và danh sách hồ sơ ưu tiên chờ duyệt.
2. **Hồ sơ nộp PXU (`applications`):**
   - Thực thi bộ lọc cô lập cứng `applications.filter(a => a.uniCode === 'PXU')` trên bảng dữ liệu SaaS kết hợp **Smart Inspector Panel**.
   - **Tự động đối soát Điểm chuẩn PXU & Đề xuất Học bổng OJT:** Hệ thống tự động so sánh điểm hồ sơ với điểm chuẩn ngành tại PXU (`≥ +4.0đ` gợi ý trao Học bổng Tài năng OJT 50–100%, `≥ 0đ` đủ điều kiện trúng tuyển sớm, `< 0đ` gợi ý xét học bạ THPT).
   - Trang bị **Chip ghi chú mẫu 1-Click** của Hội đồng Tuyển sinh PXU và hệ thống nút phê duyệt phân cấp thị giác rõ ràng (*Duyệt Trúng tuyển sớm*, *Xác nhận Hợp lệ*, *Yêu cầu Bổ sung*, *Từ chối*).
3. **Lịch tư vấn 1-1 PXU (`bookings`):** Bảng **Kanban 3 cột trực quan** (`Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`) trên Desktop và bộ chuyển 3 tab gọn gàng trên Mobile, hỗ trợ gọi điện/gửi email 1 chạm và chuyển trạng thái tức thì.
4. **Ngành & Điểm chuẩn PXU (`programs`):** Thẻ chỉ tiêu các ngành đào tạo OJT (bấm xem ngay hồ sơ nộp vào ngành đó) và bảng cập nhật **Điểm chuẩn tham chiếu & Học phí tối thiểu của riêng PXU** (đồng bộ tức thì sang AI Matching, khóa 100% quyền can thiệp vào 29 trường khác).

### 3.2. Cổng Quản trị Hệ thống Toàn quốc (`src/components/admin/AdminApp.tsx`)
Được thiết kế theo chuẩn **SaaS Control Center (`#0F172A` + `#4F46E5`)** dành cho **Quản trị viên Cấp cao (`admin@unipath.vn` / `admin123`)**:
1. **Tổng quan Toàn quốc (`dashboard`):** 4 thẻ KPI điều hướng nhanh, **Phễu tiến trình xét tuyển 4 giai đoạn** (*Chờ xét duyệt* → *Hợp lệ / Bổ sung* → *Đã trúng tuyển* → *Từ chối / Hủy*), hàng đợi hồ sơ mới nhất cần xử lý, thống kê 3 miền Bắc – Trung – Nam và Nhật ký kiểm toán (`processingLog`).
2. **Hồ sơ Xét tuyển (`applications`):** Thanh công cụ lọc gọn 1 hàng (Tìm kiếm + Dropdown Trường + Xuất CSV + Segmented Status Tabs), duyệt hàng loạt (`batchUpdateApplicationStatus`) và **Smart Inspector** bên phải (Stepper 3 bước, thanh đối chiếu điểm chuẩn tự động, chip ghi chú nhanh 1-Click).
3. **Lịch tư vấn 1-1 (`bookings`):** Bảng **Kanban 3 cột toàn quốc** điều phối toàn bộ lịch hẹn tư vấn giữa thí sinh và 30 trường đại học.
4. **30 Trường Đại học (`universities`):** Bảng dữ liệu 30 trường hỗ trợ lọc miền, tìm kiếm nhanh và **chỉnh sửa trực tiếp trên dòng (Inline Edit)** điểm chuẩn tham chiếu `score2024` & học phí `tuitionMin`.
5. **Tài khoản & Hệ thống (`users`):** Quản lý danh sách tài khoản phân quyền RBAC cùng toàn bộ tài khoản thí sinh đăng ký mới (`registeredUsers`) và công cụ **Khôi phục dữ liệu gốc Demo**.

---

## 4. HƯỚNG DẪN KIỂM THỬ LIÊN THÔNG XUYÊN VAI TRÒ (END-TO-END DEMO)

Để kiểm chứng tính liên thông thực tế khi bảo vệ đồ án:
1. Đăng nhập nhanh **`⚡ Thí sinh (Trần Công Quý)`** → Chọn **Trường Đại học Phú Xuân (PXU)** → Bấm **Nộp hồ sơ** (hoặc **Tư vấn 1-1**) → Đăng xuất.
2. Đăng nhập nhanh **`🏛️ ĐH Phú Xuân (PXU)`** → Mở tab **Hồ sơ nộp PXU** → Thấy ngay hồ sơ vừa nộp → Nhập ghi chú *"Chúc mừng em đủ điều kiện học bổng OJT đợt 1"* và bấm **Duyệt trúng tuyển** (hoặc bấm **Báo thiếu hồ sơ**) → Đăng xuất.
3. Đăng nhập lại **`⚡ Thí sinh (Trần Công Quý)`** → Thấy ngay số đỏ trên **Chuông thông báo** → Mở Tab 4 bấm xem chi tiết hồ sơ để nhận **Giấy báo Trúng tuyển sớm** (hoặc gửi bổ sung minh chứng nếu thiếu hồ sơ). Kể cả khi nhấn `F5` tải lại trình duyệt, mọi trạng thái đều được bảo toàn nguyên vẹn!
