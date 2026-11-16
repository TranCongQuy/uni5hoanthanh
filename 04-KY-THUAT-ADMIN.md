# 🛡️ 04-KY-THUAT-ADMIN.md: TÀI LIỆU KỸ THUẬT PHÂN QUYỀN RBAC & QUẢN TRỊ TUYỂN SINH
> **Hệ sinh thái Tuyển sinh & Định hướng Nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Kỹ sư phát triển phần mềm:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. KIẾN TRÚC ĐỊNH TUYẾN ĐA CỔNG & RÀO QUYỀN AUTH GATE

Trong `src/App.tsx`, hệ thống thực thi rào chắn **Auth Gate**: Người dùng bắt buộc phải đăng nhập/đăng ký tài khoản trước khi vào app. Sau khi xác thực, hệ thống kiểm tra `user.role` để định tuyến vào **3 không gian ứng dụng hoàn toàn tách biệt**:

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
│   chứng khi 'Thiếu hồ sơ'     │  │ • Phê duyệt 4 trạng thái + ghi │  │   (Batch Update) kèm FSM     │
│ • Chủ động rút hồ sơ cá nhân  │  │   chú hội đồng tuyển sinh PXU  │  │ • Chỉnh sửa điểm chuẩn & học │
│ • Đặt lịch tư vấn 1-1         │  │ • Tự động đối soát chuẩn ngành │  │   phí toàn bộ 30 trường ĐH   │
│ • Chặn 100% quyền xem hồ sơ   │  │   PXU & gợi ý học bổng OJT     │  │ • Benchmark 30 trường 6 cụm  │
│   người khác hoặc duyệt đơn   │  │ • Cập nhật điểm chuẩn của PXU  │  │ • Quản trị hệ thống & Audit  │
│ • Dock Cố vấn AI đa lượt      │  │ • Chặn 100% 29 trường còn lại  │  │ • Global Search (Ctrl + K)   │
└───────────────────────────────┘  └────────────────────────────────┘  └──────────────────────────────┘
```

---

## 2. MA TRẬN PHÂN QUYỀN & GIỚI HẠN BẢO MẬT CHI TIẾT (RBAC MATRIX)

> **Lưu ý bảo mật:** Hệ thống **đã bãi bỏ hoàn toàn chế độ Khách vãng lai (`Guest`)**. Mọi hành vi truy cập đều phải được định danh và xác thực bằng mật khẩu băm một chiều Salted SHA-256 (`src/utils/security.ts`).

| Nghiệp vụ / Quyền thao tác | Thí sinh (`student`) | ĐH Phú Xuân (`university_pxu`) | Admin (`admin`) |
| :--- | :---: | :---: | :---: |
| **Tra cứu, lọc & so sánh 30 trường ĐH** | ✅ Toàn quyền | 🏛️ Cổng riêng PXU | 🛡️ Cổng quản trị 30 trường |
| **Làm trắc nghiệm Holland RIASEC & AI Matching** | ✅ Lưu theo tài khoản | — | — |
| **Nộp hồ sơ xét tuyển trực tuyến (`addApplication`)** | ✅ Toàn quyền (tối đa 5 NV) | ❌ Chặn bởi RBAC Guard | ❌ Chặn bởi RBAC Guard |
| **Đặt lịch tư vấn 1-1 (`addBooking`)** | ✅ Toàn quyền | ❌ Chặn bởi RBAC Guard | ❌ Chặn bởi RBAC Guard |
| **Xem danh sách hồ sơ xét tuyển** | 🔒 Chỉ hồ sơ của chính mình | 🔒 Chỉ hồ sơ nộp vào `PXU` | ✅ Toàn bộ 30 trường toàn quốc |
| **Rút / Hủy hồ sơ cá nhân (`cancelApplication`)** | 🔒 Chỉ hồ sơ của chính mình | ❌ Không (dùng chức năng Từ chối) | ❌ Không (dùng chức năng Từ chối) |
| **Gửi bổ sung minh chứng khi `Thiếu hồ sơ`** | 🔒 Chỉ chủ sở hữu hồ sơ | ❌ Không | ❌ Không |
| **Xác nhận `Hồ sơ hợp lệ` / `Đã trúng tuyển`** | ❌ Nghiêm cấm | 🔒 Chỉ hồ sơ nộp `PXU` | ✅ Toàn bộ 30 trường (+ Duyệt hàng loạt) |
| **Yêu cầu bổ sung (`Thiếu hồ sơ`) / Từ chối (`Đã bị hủy`)** | ❌ Nghiêm cấm | 🔒 Chỉ hồ sơ nộp `PXU` | ✅ Toàn bộ 30 trường (+ Duyệt hàng loạt) |
| **Cập nhật trạng thái lịch hẹn tư vấn 1-1** | 👁️ Chỉ xem tiến độ của mình | 🔒 Chỉ lịch hẹn của `PXU` | ✅ Toàn bộ lịch hẹn hệ thống |
| **Chỉnh sửa Điểm chuẩn & Học phí (`updateUniversityMetrics`)** | ❌ Nghiêm cấm | 🔒 **Chỉ riêng trường `PXU` (`id: 11`)** | ✅ Toàn bộ 30 trường đại học |
| **Xem Benchmark 30 trường & Phân bố 6 phân khoảng** | ❌ Không | ❌ Không | ✅ Toàn quyền phân tích |
| **Giám sát Nguồn dữ liệu Supabase, LocalStorage & Audit Log** | ❌ Không | ❌ Không | ✅ Toàn quyền giám sát |
| **Tìm kiếm Toàn diện bằng phím tắt (`Ctrl + K`)** | ❌ Không | ❌ Không | ✅ Tra cứu tức thì thí sinh, trường, ngành |
| **Xem danh sách tài khoản thí sinh đăng ký** | ❌ Nghiêm cấm | ❌ Không | ✅ Toàn quyền tra cứu |
| **Xem Toàn bộ Nhật ký kiểm toán (`processingLog`)** | ❌ Không | 🔒 Chỉ nhật ký hồ sơ `PXU` | ✅ Toàn bộ nhật ký hệ thống |

---

## 3. ĐẶC TẢ KỸ THUẬT 2 CỔNG QUẢN TRỊ CHUYÊN BIỆT

### 3.1. Cổng Tuyển sinh Trường Đại học Phú Xuân (`src/components/university/UniversityApp.tsx`)
Được thiết kế theo chuẩn **Emerald Aurora CRM (`#022C22` → `#0F766E`)** dành riêng cho **Ban Tư vấn Tuyển sinh ĐH Phú Xuân (`tuyensinh@pxu.edu.vn` / `pxu123`)**:
1. **Kiến trúc Sidebar 3 Tầng Cố Định:**
   - Pinned Header giữ logo PXU luôn ở đỉnh (`top: 0`).
   - Middle Menu cuộn độc lập với class `.up-sidebar-scroll` lướt mượt mà không che khuất đầu hay chân trang.
   - Pinned Footer neo thẻ bảo mật phân lập dữ liệu.
2. **Tổng quan PXU (`overview`):** Banner nhận diện ĐH Phú Xuân (OJT 3 năm, 96% việc làm), 4 thẻ KPI tương tác, biểu đồ phân bổ thí sinh theo ngành đào tạo mũi nhọn và danh sách hồ sơ ưu tiên chờ duyệt.
3. **Hồ sơ nộp PXU (`applications`):**
   - Thực thi bộ lọc cô lập cứng `applications.filter(a => a.uniCode === 'PXU')`.
   - **Tự động đối soát Điểm chuẩn PXU & Đề xuất Học bổng OJT:** So sánh điểm hồ sơ với điểm chuẩn ngành tại PXU (`≥ +4.0đ` gợi ý trao Học bổng Doanh nghiệp OJT 50–100%, `≥ 0đ` đủ điều kiện trúng tuyển sớm, `< 0đ` gợi ý xét học bạ THPT kèm giải trình bắt buộc).
   - Trang bị **Chip ghi chú mẫu 1-Click** của Hội đồng Tuyển sinh PXU và hệ thống nút phê duyệt phân cấp thị giác rõ ràng.
4. **Lịch tư vấn 1-1 PXU (`bookings`):** Bảng **Kanban 3 cột trực quan** (`Chờ liên hệ` → `Đã liên hệ` → `Hoàn thành`).
5. **Ngành & Điểm chuẩn PXU (`programs`):** Bảng cập nhật **Điểm chuẩn tham chiếu & Học phí tối thiểu của riêng PXU** (đồng bộ tức thì sang AI Matching, khóa 100% quyền can thiệp vào 29 trường khác).

### 3.2. Cổng Quản trị Hệ thống Toàn quốc (`src/components/admin/AdminApp.tsx`)
Được thiết kế theo chuẩn **Deep Aurora Control Center (`#050B14` → `#1C2541`)** dành cho **Quản trị viên Cấp cao (`admin@unipath.vn` / `admin123`)**:
1. **Kiến trúc Sidebar 3 Tầng Cố Định:** Pinned Top Header (UniPath Admin), Scrollable Middle Nav (`.up-sidebar-scroll`) và Pinned Bottom Footer (Trạng thái đồng bộ + Nút khôi phục dữ liệu mẫu).
2. **Global Search (`Ctrl + K`):** Thanh tìm kiếm và phím tắt mở modal `AdminGlobalSearch` tra cứu tức thì mã hồ sơ, tên thí sinh, trường đại học, ngành học và thao tác nhanh.
3. **Tổng quan Toàn quốc (`dashboard`):** 4 thẻ KPI điều hướng nhanh, phễu tiến trình xét tuyển 4 giai đoạn (*Chờ xét duyệt* → *Hợp lệ / Bổ sung* → *Đã trúng tuyển* → *Từ chối / Hủy*), hàng đợi hồ sơ mới nhất cần xử lý, và thống kê 3 miền Bắc – Trung – Nam.
4. **Benchmark 30 Trường ĐH (`benchmark`):**
   - Biểu đồ cột phân bố điểm chuẩn 6 phân khoảng chuẩn hóa (`BenchmarkHistogram`).
   - Thống kê tỷ lệ thí sinh đạt chuẩn ngành, top 3 ngành cạnh tranh nhất và điểm chuẩn trung bình phân chia theo 3 miền.
5. **Quản trị Hệ thống & Audit Log (`system`):**
   - Giám sát trạng thái kết nối đám mây Supabase (Hybrid LocalFirst + Cloud Mirroring).
   - Giám sát số bản ghi và dung lượng lưu trữ cục bộ LocalStorage (đảm bảo an toàn dưới hạn mức 5MB).
   - Xem toàn bộ dòng lịch sử kiểm toán hồ sơ (`processingLog`) có lọc theo mã hồ sơ, người duyệt và vai trò.
6. **Hồ sơ Xét tuyển (`applications`):** Duyệt đơn lẻ hoặc hàng loạt (`batchUpdateApplicationStatus`) kết hợp **Smart Inspector** bên phải (Stepper 3 bước, thanh đối chiếu điểm chuẩn, chip ghi chú 1-Click).
7. **Lịch tư vấn 1-1 (`bookings`):** Bảng **Kanban 3 cột toàn quốc** điều phối toàn bộ lịch hẹn tư vấn.
8. **30 Trường Đại học (`universities`):** Chỉnh sửa trực tiếp trên dòng (Inline Edit) điểm chuẩn tham chiếu `score2024` & học phí `tuitionMin`.
9. **Tài khoản & Người dùng (`users`):** Quản lý danh sách tài khoản phân quyền RBAC cùng toàn bộ tài khoản thí sinh đăng ký mới.

---

## 4. HƯỚNG DẪN KIỂM THỬ LIÊN THÔNG XUYÊN VAI TRÒ (END-TO-END DEMO)

Để kiểm chứng tính liên thông thực tế khi bảo vệ đồ án:
1. Đăng nhập nhanh **`⚡ Thí sinh (Trần Công Quý)`** → Chọn **Trường Đại học Phú Xuân (PXU)** → Bấm **Nộp hồ sơ** (hoặc **Tư vấn 1-1**) → Đăng xuất.
2. Đăng nhập nhanh **`🏛️ ĐH Phú Xuân (PXU)`** → Mở tab **Hồ sơ nộp PXU** → Thấy ngay hồ sơ vừa nộp → Nhập ghi chú *"Chúc mừng em đủ điều kiện học bổng OJT đợt 1"* và bấm **Duyệt trúng tuyển** (hoặc bấm **Báo thiếu hồ sơ**) → Đăng xuất.
3. Đăng nhập lại **`⚡ Thí sinh (Trần Công Quý)`** → Thấy ngay số đỏ trên **Chuông thông báo** → Mở Tab 4 bấm xem chi tiết hồ sơ để nhận **Giấy báo Trúng tuyển sớm** (hoặc gửi bổ sung minh chứng nếu thiếu hồ sơ). Kể cả khi nhấn `F5` tải lại trình duyệt, mọi trạng thái đều được bảo toàn nguyên vẹn!
