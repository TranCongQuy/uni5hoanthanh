# 🛡️ 04-KY-THUAT-ADMIN.md: TÀI LIỆU KỸ THUẬT PHÂN QUYỀN RBAC & QUẢN TRỊ TUYỂN SINH
> **Hệ sinh thái Tuyển sinh & Định hướng nghề nghiệp Thông minh 2026**  
> **Đơn vị chủ quản & Đào tạo:** Trường Đại học Phú Xuân (PXU)  
> **Nhóm thực hiện:** Nhóm UP5  
> **Trưởng nhóm:** Dương Đình Phát | **Phát triển phần mềm & Kỹ sư ứng dụng:** Trần Công Quý  
> **Thành viên:** Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga

---

## 1. MÔ HÌNH PHÂN QUYỀN TRUY CẬP (ROLE-BASED ACCESS CONTROL - RBAC)

UniPath 2.0 thiết lập kiến trúc phân quyền 3 tầng nghiêm ngặt nhằm đáp ứng yêu cầu bảo mật thông tin thí sinh và phân định rõ ràng trách nhiệm giữa **Thí sinh**, **Quản trị viên Hệ thống Toàn quốc** và **Đại diện Tuyển sinh từng Trường Đại học (Tiêu biểu là Trường ĐH Phú Xuân - PXU)**:

```
                      ┌────────────────────────────────────────┐
                      │        CƠ SỞ DỮ LIỆU UNIPATH 2.0       │
                      │  (30 Trường ĐH & Toàn bộ Hồ sơ Xét)   │
                      └───────────────────┬────────────────────┘
                                          │
            ┌─────────────────────────────┼────────────────────────────┐
            ↓                             ↓                            ↓
┌───────────────────────┐   ┌──────────────────────────┐   ┌───────────────────────────┐
│     ROLE: STUDENT     │   │       ROLE: ADMIN        │   │   ROLE: UNIVERSITY_PXU    │
│  (Thí sinh 2k8 - Quý) │   │ (Admin Hệ Thống UniPath) │   │ (Ban Tuyển Sinh ĐH Phú    │
│                       │   │                          │   │          Xuân)            │
│ • Làm Quiz RIASEC     │   │ • Toàn quyền xem 100%    │   │ • BẢO MẬT PHÂN LẬP:       │
│ • Chạy AI Matching    │   │   hồ sơ 30 trường        │   │   Chỉ xem & duyệt hồ sơ   │
│ • Nộp hồ sơ xét tuyển │   │ • Phê duyệt / Từ chối /  │   │   nộp vào ĐH Phú Xuân     │
│ • Hủy hồ sơ cá nhân   │   │   Yêu cầu bổ sung hồ sơ  │   │ • Quản lý chỉ tiêu PXU    │
│ • Giới hạn: Không xem │   │ • Cấu hình điểm chuẩn &  │   │ • Giới hạn: Không được    │
│   được hồ sơ người    │   │   học phí 30 trường      │   │   xem hay sửa dữ liệu     │
│   khác, không duyệt   │   │ • Giới hạn: Không nộp    │   │   của 29 trường khác      │
│   được hồ sơ          │   │   hồ sơ với vai thí sinh │   │                           │
└───────────────────────┘   └──────────────────────────┘   └───────────────────────────┘
```

---

## 2. MA TRẬN PHÂN QUYỀN CHI TIẾT (RBAC CAPABILITIES & RESTRICTIONS MATRIX)

| Quyền hạn & Chức năng | Thí sinh (Student) | Admin Hệ Thống (Admin) | ĐH Phú Xuân (University PXU) |
| :--- | :---: | :---: | :---: |
| **Email đăng nhập mẫu** | `quy@unipath.vn` | `admin@unipath.vn` | `tuyensinh@pxu.edu.vn` |
| **Mật khẩu đăng nhập** | `123456` | `admin123` (hoặc 1-click) | `pxu123` (hoặc 1-click) |
| **Thực hiện khảo sát Holland RIASEC** | ✅ Có | ✅ Có (để kiểm thử) | ✅ Có (để kiểm thử) |
| **Sử dụng bộ đối soát AI Matching 2026** | ✅ Có | ✅ Có | ✅ Có |
| **Tương tác EduFair LIVE (Vỗ tay, thả tim)** | ✅ Có | ✅ Có | ✅ Có |
| **Nộp hồ sơ xét tuyển mới** | ✅ Toàn quyền | ❌ Bị giới hạn | ❌ Bị giới hạn |
| **Xem hồ sơ cá nhân do chính mình nộp** | ✅ Xem hồ sơ của mình | ✅ Xem toàn bộ | ✅ Chỉ xem hồ sơ nộp PXU |
| **Xem hồ sơ của các thí sinh khác** | ❌ Nghiêm cấm | ✅ Xem toàn quốc | ❌ Chỉ xem thí sinh nộp PXU |
| **Duyệt hồ sơ trúng tuyển (Đã trúng tuyển)** | ❌ Không có quyền | ✅ Toàn bộ 30 trường | ✅ Chỉ duyệt thí sinh nộp PXU |
| **Yêu cầu bổ sung giấy tờ (Thiếu hồ sơ)** | ❌ Không có quyền | ✅ Toàn bộ 30 trường | ✅ Chỉ duyệt thí sinh nộp PXU |
| **Từ chối / Hủy hồ sơ xét tuyển** | ✅ Chỉ hủy hồ sơ của mình | ✅ Từ chối mọi trường | ✅ Chỉ từ chối hồ sơ PXU |
| **Điều chỉnh điểm chuẩn & học phí sàn CSDL** | ❌ Không có quyền | ✅ Sửa cả 30 trường | ❌ Không có quyền sửa trường khác |
| **Xem báo cáo chỉ tiêu tuyển sinh PXU** | ℹ️ Xem dạng tham khảo | ✅ Xem tổng quan | ✅ Quản lý chuyên sâu |

---

## 3. ĐẶC TẢ CHI TIẾT CÁC TÀI KHOẢN VÀ HÀNH VI HỆ THỐNG

### 3.1. Tài khoản Thí sinh (Student)
- **Đại diện mẫu:** **Trần Công Quý** (Thí sinh thế hệ 2k8 – THPT Chuyên Quốc Học Huế).
- **Mục tiêu sử dụng:** Tìm trường, đo lường điểm thi, xác định ngành học phù hợp theo mã tính cách RIASEC, nộp hồ sơ xét tuyển sớm và theo dõi thông báo trúng tuyển từ nhà trường.
- **Ranh giới an toàn:** Thí sinh chỉ được xem hồ sơ do chính mình gửi đi, không thể can thiệp vào tiến trình xét duyệt của Hội đồng tuyển sinh.

### 3.2. Tài khoản Admin Hệ Thống (System Admin)
- **Đại diện mẫu:** **Admin Hệ Thống UniPath 2.0** (`admin@unipath.vn`).
- **Mục tiêu sử dụng:** Giám sát toàn bộ dữ liệu tuyển sinh liên trường, đảm bảo các trường đại học thực hiện đối soát hồ sơ đúng quy chế, cập nhật kịp thời điểm chuẩn trúng tuyển của 30 trường đại học năm 2026.
- **Tính năng nổi bật:**
  - Bảng tổng kết số lượng hồ sơ toàn quốc: Tổng số hồ sơ, số lượng đã trúng tuyển, số lượng đang duyệt, số lượng thiếu giấy tờ học bạ.
  - Bộ lọc kết hợp thông minh theo trường và theo trạng thái xét tuyển.
  - Bảng chỉnh sửa thông số CSDL chuẩn: Cho phép nhập điểm chuẩn và học phí mới cho từng trường đại học, kết quả cập nhật ngay lập tức vào thuật toán AI Matching.

### 3.3. Tài khoản Đại diện Tuyển sinh Trường Đại học Phú Xuân (PXU)
- **Đại diện mẫu:** **Ban Tuyển sinh ĐH Phú Xuân** (`tuyensinh@pxu.edu.vn`).
- **Mục tiêu sử dụng:** Đơn vị chủ quản của hệ sinh thái UniPath, phụ trách công tác tuyển sinh trực tiếp cho Trường Đại học Phú Xuân tại thành phố Huế.
- **Cơ chế Phân lập Dữ liệu (Data Isolation Boundary):**
  - Hệ thống tự động kích hoạt bộ lọc bảo mật:
    ```typescript
    const pxuApps = applications.filter((app) => app.uniCode === 'PXU');
    ```
  - Cổng tuyển sinh PXU chỉ render các hồ sơ thí sinh đăng ký vào ĐH Phú Xuân (như hồ sơ ngành CNTT, Thiết kế đồ họa, Quản trị kinh doanh số...).
  - Dữ liệu hồ sơ của các trường bạn (Bách Khoa, Ngoại Thương, Y Hà Nội...) được ẩn hoàn toàn để đảm bảo tính bảo mật và công bằng trong tuyển sinh đại học.
- **Thao tác nghiệp vụ:**
  - `✅ Duyệt trúng tuyển PXU`: Gửi thông báo trúng tuyển sớm kèm hướng dẫn làm thủ tục nhập học.
  - `⚠️ Yêu cầu bổ sung`: Gửi yêu cầu thí sinh bổ sung học bạ THPT kỳ 1 lớp 12 hoặc bản chụp CCCD công chứng.
  - `❌ Từ chối hồ sơ`: Thông báo từ chối kèm lý do chưa đạt ngưỡng điểm sàn nhận hồ sơ của trường.

---

## 4. BỘ ĐIỀU KHIỂN CHUYỂN ĐỔI VAI TRÒ KIỂM THỬ (ROLE SWITCHER BAR)

Nhằm phục vụ công tác nghiệm thu, đánh giá đồ án và kiểm thử thực tế của quý thầy cô và hội đồng chấm thi:
- Hệ thống trang bị thanh công cụ **"RoleSwitcherBar"** xuất hiện nổi bật tại **Tab 4 (Hồ sơ & Quản trị)** trên cả giao diện Desktop và giao diện Mobile.
- Cho phép người kiểm thử chuyển đổi qua lại giữa 3 vai trò chỉ với **1 cú nhấp chuột (1-Click)** mà không cần phải đăng xuất rồi nhập lại mật khẩu:
  1. `⚡ Thí sinh (Trần Công Quý)`
  2. `👑 Admin Hệ Thống UniPath`
  3. `🏛️ ĐH Phú Xuân (PXU)`
- Mỗi khi chuyển vai trò, giao diện tự động thích ứng ngay lập tức với đúng quyền hạn, giao diện quản trị và dữ liệu tương ứng.

---

## 5. ĐƠN VỊ THỰC HIỆN & BẢN QUYỀN HỆ THỐNG

Toàn bộ kiến trúc phân quyền và nghiệp vụ quản trị tuyển sinh thuộc bản quyền sở hữu của:
* 🏛️ **Đơn vị chủ quản & Đào tạo:** **Trường Đại học Phú Xuân (PXU)**
* 👥 **Nhóm nghiên cứu & phát triển UP5:**
  * 👑 **Trưởng nhóm:** **Dương Đình Phát**
  * 💻 **Kỹ sư phát triển phần mềm:** **Trần Công Quý**
  * 🤝 **Thành viên:** **Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga**
