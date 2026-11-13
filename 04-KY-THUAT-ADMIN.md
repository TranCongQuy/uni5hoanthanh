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
Được thiết kế riêng cho **Ban Tư vấn Tuyển sinh ĐH Phú Xuân (`tuyensinh@pxu.edu.vn` / `pxu123`)** gồm 5 phân hệ:
1. **Tổng quan PXU (`overview`):** Thống kê thời gian thực tổng hồ sơ nộp vào PXU, tỷ lệ trúng tuyển sớm, phân bổ hồ sơ theo từng ngành đào tạo mũi nhọn (Công nghệ thông tin, Quản trị kinh doanh, Marketing, Thiết kế đồ họa, Ngôn ngữ Anh/Trung...) và nhật ký xét duyệt gần nhất tại PXU.
2. **Hồ sơ nộp PXU (`applications`):**
   - Thực thi bộ lọc cô lập cứng `applications.filter(a => a.uniCode === 'PXU')`.
   - Hỗ trợ tìm kiếm theo tên/mã hồ sơ, lọc theo ngành và trạng thái, nhập **Ghi chú Hội đồng Tuyển sinh PXU** trước khi bấm các nút nghiệp vụ: *Hồ sơ hợp lệ*, *Duyệt trúng tuyển*, *Báo thiếu hồ sơ*, *Từ chối*.
3. **Ngành học & Cấu hình Tuyển sinh PXU (`programs`):**
   - Quản lý danh mục ngành đào tạo gắn liền mô hình **OJT doanh nghiệp** và chính sách học bổng PXU.
   - Tích hợp bảng **Cập nhật Điểm chuẩn tham chiếu & Học phí tối thiểu độc quyền của PXU**: Khi cán bộ PXU lưu điểm chuẩn mới, hệ thống tự động tịnh tiến điểm chuẩn các ngành của PXU và cập nhật ngay sang thuật toán AI Matching cho thí sinh, trong khi khóa chặt quyền can thiệp vào 29 trường đại học khác.
4. **Lịch tư vấn 1-1 PXU (`bookings`):** Tiếp nhận lịch hẹn thí sinh đăng ký riêng với PXU (hiển thị đầy đủ SĐT, Email, ngành quan tâm, khung giờ và kênh tư vấn `Google Meet` / `Zalo` / `Trực tiếp`), cập nhật tiến độ `Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`.
5. **Tài khoản đơn vị (`account`):** Minh bạch hóa thông tin định danh đơn vị, phạm vi quyền hạn được cấp và các ranh giới bảo mật đang áp dụng.

### 3.2. Cổng Quản trị Hệ thống Toàn quốc (`src/components/admin/AdminApp.tsx`)
Dành riêng cho **Quản trị viên Cấp cao (`admin@unipath.vn` / `admin123`)** gồm 6 phân hệ:
1. **Tổng quan Toàn quốc (`dashboard`):** Thống kê tổng hồ sơ toàn hệ thống, biểu đồ phân bổ theo 3 miền Bắc – Trung – Nam, top trường nhận nhiều nguyện vọng nhất và nhật ký kiểm toán (`processingLog`) toàn hệ thống.
2. **Quản lý Hồ sơ (`applications`):** Tra cứu, lọc kết hợp theo trường/trạng thái, nhập ghi chú xét duyệt chung, hỗ trợ cả **Duyệt từng hồ sơ** lẫn **Thao tác hàng loạt (`batchUpdateApplicationStatus`)** khi tích chọn nhiều hồ sơ cùng lúc.
3. **30 Trường Đại học (`universities`):** Chỉnh sửa trực tiếp điểm chuẩn tham chiếu (`score2024`) và học phí tối thiểu (`tuitionMin`) cho bất kỳ trường nào trong 30 trường đại học trên toàn quốc.
4. **Lịch hẹn 1-1 (`bookings`):** Giám sát và điều phối toàn bộ lịch hẹn tư vấn tuyển sinh trên hệ thống.
5. **Người dùng (`users`):** Quản lý danh sách 3 tài khoản mặc định cùng toàn bộ tài khoản thí sinh đăng ký mới theo thời gian thực (`registeredUsers`).
6. **Hệ thống (`account`):** Thông tin quản trị viên, trạng thái kho dữ liệu và công cụ **Khôi phục dữ liệu gốc Demo** phục vụ kiểm thử nhiều kịch bản liên tiếp.

---

## 4. HƯỚNG DẪN KIỂM THỬ LIÊN THÔNG XUYÊN VAI TRÒ (END-TO-END DEMO)

Để kiểm chứng tính liên thông thực tế khi bảo vệ đồ án:
1. Đăng nhập nhanh **`⚡ Thí sinh (Trần Công Quý)`** → Chọn **Trường Đại học Phú Xuân (PXU)** → Bấm **Nộp hồ sơ** (hoặc **Tư vấn 1-1**) → Đăng xuất.
2. Đăng nhập nhanh **`🏛️ ĐH Phú Xuân (PXU)`** → Mở tab **Hồ sơ nộp PXU** → Thấy ngay hồ sơ vừa nộp → Nhập ghi chú *"Chúc mừng em đủ điều kiện học bổng OJT đợt 1"* và bấm **Duyệt trúng tuyển** (hoặc bấm **Báo thiếu hồ sơ**) → Đăng xuất.
3. Đăng nhập lại **`⚡ Thí sinh (Trần Công Quý)`** → Thấy ngay số đỏ trên **Chuông thông báo** → Mở Tab 4 bấm xem chi tiết hồ sơ để nhận **Giấy báo Trúng tuyển sớm** (hoặc gửi bổ sung minh chứng nếu thiếu hồ sơ). Kể cả khi nhấn `F5` tải lại trình duyệt, mọi trạng thái đều được bảo toàn nguyên vẹn!
