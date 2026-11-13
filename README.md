# 🎓 UNIPATH 2.0 - HỆ SINH THÁI HƯỚNG NGHIỆP & TUYỂN SINH ĐẠI HỌC THÔNG MINH
### 📱 Mobile-First Native (< 1024px) & 💻 Desktop Widescreen (≥ 1024px) Tự Động Thích Ứng 100%

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://uni5hoanthanh.vercel.app)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

> 🌐 **Trang web chính thức:** [https://uni5hoanthanh.vercel.app](https://uni5hoanthanh.vercel.app)  
> **UniPath 2.0** là hệ sinh thái số toàn diện đồng hành cùng học sinh THPT (đặc biệt là 2k8, 2k9) và quý phụ huynh trên hành trình khám phá bản thân, chọn ngành, chọn trường và nộp hồ sơ xét tuyển đại học trực tuyến. Hệ thống tích hợp trắc nghiệm hướng nghiệp quốc tế **Holland RIASEC (12 câu hỏi chuẩn hóa)**, thuật toán đối soát **AI Matching 2026** trên cơ sở dữ liệu **30 trường đại học hàng đầu 3 miền Bắc – Trung – Nam**, ngày hội tuyển sinh ảo **EduFair LIVE**, đặt lịch **Tư vấn 1-1** theo thời gian thực và kiến trúc phân quyền đa cổng **RBAC 3 vai trò độc lập**.

---

## 👥 ĐƠN VỊ PHÁT TRIỂN & BẢN QUYỀN DỰ ÁN

Dự án được nghiên cứu, thiết kế và phát triển bởi **Nhóm UP5** thuộc **Trường Đại học Phú Xuân (PXU)**:

* 👑 **Trưởng nhóm UP5:** **Dương Đình Phát**
* 💻 **Kỹ sư phát triển phần mềm (Phát triển App):** **Trần Công Quý**
* 🤝 **Thành viên nhóm UP5:**
  * **Trần Thị Nhung**
  * **Nguyễn Thị Lý Trà My**
  * **Thái Thị Nga**
* 🏛️ **Đơn vị chủ quản & Đào tạo:** **Trường Đại học Phú Xuân (PXU)**

> **© Bản quyền dự án thuộc về Nhóm UP5 — Trường Đại học Phú Xuân (PXU). Phát triển ứng dụng bởi Trần Công Quý.**

---

## 📚 BỘ HỒ SƠ TÀI LIỆU NGHIỆP VỤ & KỸ THUẬT CHÍNH THỨC

Toàn bộ hệ thống được tài liệu hóa đồng bộ 100% với mã nguồn thực tế qua 5 văn bản chuyên sâu:

1. 📖 **[USER_GUIDE.md](USER_GUIDE.md):** Cẩm nang hướng dẫn sử dụng chi tiết từng màn hình, từng luồng thao tác cho Thí sinh, Ban Tuyển sinh ĐH Phú Xuân (PXU), Admin Hệ thống và Khách trải nghiệm.
2. 📋 **[01-NGHIEP-VU.md](01-NGHIEP-VU.md):** Phân tích nghiệp vụ tuyển sinh đại học 2026, cơ sở khoa học trắc nghiệm Holland RIASEC (12 câu hỏi / 6 nhóm), công thức định lượng `MatchingService.ts`, vòng đời 6 trạng thái hồ sơ xét tuyển và quy trình đặt lịch tư vấn 1-1.
3. 🎨 **[02-GIAO-DIEN-AI.md](02-GIAO-DIEN-AI.md):** Kiến trúc giao diện thích ứng kép tự động (`Mobile < 1024px` & `Desktop ≥ 1024px`, không nút chuyển thủ công, không thông báo làm phiền), tiêu chuẩn chống tràn khung viền (`overflow-x: clip`), hệ thống biểu đồ SVG thuần và tổng hợp âm thanh Web Audio API.
4. 💻 **[03-KY-THUAT-FRONTEND.md](03-KY-THUAT-FRONTEND.md):** Kiến trúc kỹ thuật React 19 + TypeScript 5.9 + Vite 8, kiến trúc lưu trữ hai tầng (**Shared Institutional Store** & **Per-User Personal Store**), danh mục 13 Modal tương tác và quy trình CI/CD.
5. 🛡️ **[04-KY-THUAT-ADMIN.md](04-KY-THUAT-ADMIN.md):** Đặc tả kiến trúc phân quyền truy cập **RBAC** (`student`, `university_pxu`, `admin` & `guest`), cơ chế cô lập dữ liệu cá nhân/trường học, quản trị điểm chuẩn thời gian thực và quy trình xét duyệt hồ sơ liên thông.

---

## 🔐 MA TRẬN TÀI KHOẢN & PHÂN QUYỀN HỆ THỐNG (RBAC)

UniPath 2.0 trang bị 3 tài khoản mẫu định cấu hình sẵn (hỗ trợ đăng nhập bằng Email/Mật khẩu hoặc nút **Đăng nhập nhanh 1-Click** tại màn hình Đăng nhập & Cổng Hồ sơ) cùng chế độ Khách trải nghiệm:

| Vai trò (Role) | Email đăng nhập | Mật khẩu | Cổng giao diện & Quyền hạn cốt lõi | Ranh giới bảo mật (Data Isolation) |
| :--- | :--- | :---: | :--- | :--- |
| **Thí sinh 2k8**<br>*(Trần Công Quý)* | `quy@unipath.vn` | `123456` | **Student Portal (`MobileView` / `DesktopView`):** Làm trắc nghiệm RIASEC, chạy AI Matching, xem EduFair LIVE, nộp hồ sơ xét tuyển, bổ sung minh chứng khi thiếu hồ sơ, rút hồ sơ cá nhân, đặt lịch tư vấn 1-1, nâng cấp VIP. | **Bảo mật cá nhân tuyệt đối:** Chỉ xem được hồ sơ (`myApplications`), lịch hẹn (`myBookings`) và thông báo của chính email mình; không xem được dữ liệu thí sinh khác; không có quyền duyệt hồ sơ hay sửa CSDL trường. |
| **ĐH Phú Xuân**<br>*(Ban Tuyển Sinh PXU)* | `tuyensinh@pxu.edu.vn` | `pxu123` | **PXU Admissions Portal (`UniversityApp.tsx`):** Dashboard KPI tuyển sinh PXU, duyệt hồ sơ nộp vào PXU (`Hồ sơ hợp lệ`, `Đã trúng tuyển`, `Thiếu hồ sơ`, `Đã bị hủy` kèm ghi chú hội đồng), xử lý lịch hẹn tư vấn 1-1 của PXU, cập nhật điểm chuẩn tham chiếu & học phí tối thiểu của riêng PXU. | **Phân lập cấp cơ sở đào tạo:** Chỉ truy cập dữ liệu có `uniCode === 'PXU'` (`id === 11`); chặn hoàn toàn quyền xem/duyệt hồ sơ hoặc chỉnh sửa điểm chuẩn của 29 trường đại học còn lại; không nộp hồ sơ như thí sinh. |
| **Admin Hệ Thống**<br>*(Quản trị Cấp cao)* | `admin@unipath.vn` | `admin123` | **System Admin Portal (`AdminApp.tsx`):** Toàn quyền giám sát 30 trường ĐH Bắc – Trung – Nam, duyệt đơn lẻ hoặc duyệt hàng loạt (Batch Action) hồ sơ toàn quốc, điều phối toàn bộ lịch hẹn tư vấn 1-1, chỉnh sửa điểm chuẩn & học phí của cả 30 trường (đồng bộ tức thì sang AI Matching), quản lý danh sách tài khoản, xem nhật ký kiểm toán. | Không thực hiện các hành vi cá nhân của thí sinh (nộp hồ sơ xét tuyển, đặt lịch tư vấn hay nâng cấp VIP thí sinh). |
| **Khách trải nghiệm**<br>*(Guest / Visitor)* | *(Không cần đăng nhập)* | — | Khám phá tự do 30 trường ĐH, so sánh tối đa 3 trường, làm thử trắc nghiệm Holland RIASEC, chạy thử AI Matching 2026 và xem EduFair LIVE. | Khi bấm các tác vụ ghi dữ liệu cá nhân (*Nộp hồ sơ*, *Đặt lịch tư vấn 1-1*, *Sửa hồ sơ*, *Nâng cấp VIP*), hệ thống tự động mở `AuthModal` yêu cầu đăng nhập/đăng ký tài khoản thí sinh. |

---

## 🗺️ BẢNG ÁNH XẠ CHỨC NĂNG & LUỒNG NÚT BẤM (BUTTON & FLOW MATRIX)

Mọi nút bấm trên hệ thống đều được kết nối đúng chức năng thực tế, liên thông dữ liệu xuyên suốt giữa các vai trò:

| Vị trí / Nút bấm | Hành vi xử lý (Action) | Đích đến / Kết quả hiển thị |
| :--- | :--- | :--- |
| **Tự động nhận diện thiết bị** | Mở web trên điện thoại/tablet (`< 1024px`) hoặc laptop/PC (`≥ 1024px`) | Tự động render `MobileView` hoặc `DesktopView` mượt mà, **không có nút chuyển giao diện thủ công và không hiện thông báo toast** |
| **Logo UniPath (Header Desktop)** | Đưa người dùng về màn hình chính | Chuyển về **Tab 0 (Trang chủ)** và cuộn mượt lên đầu trang |
| **Thanh Điều Hướng 5 Tabs** | Chuyển đổi giữa 5 phân hệ của Cổng Thí sinh | **Tab 0:** Trang chủ • **Tab 1:** Trắc nghiệm Holland • **Tab 2:** Gợi ý AI • **Tab 3:** EduFair LIVE • **Tab 4:** Hồ sơ & Cá nhân |
| **Chuông Thông Báo (`Bell`)** | Mở trung tâm thông báo theo đúng vai trò/email | Mở **`NotificationsModal`** hiển thị số tin chưa đọc thực tế (`unreadNotificationCount`), đánh dấu đã đọc & điều hướng nhanh |
| **Menu Tài Khoản & Đổi Vai Trò (`AccountRoleMenu`)** | Mở menu tài khoản góc phải trên ở cả 3 cổng | Hiển thị danh tính hiện tại, **chuyển nhanh 1-Click giữa 3 cổng (`Thí sinh` ↔ `ĐH Phú Xuân` ↔ `Admin`)**, mở Cài đặt, Khôi phục dữ liệu gốc hoặc Đăng xuất ngay |
| **Thanh Hành Trình 4 Bước (Tab 0)** | Theo dõi tiến độ cá nhân `0/4 → 4/4` & điều hướng 1 chạm | `① Test Holland` → `② AI Phân tích` → `③ Tư vấn 1-1` → `④ Nộp hồ sơ sớm` (tự động đánh dấu `✓` khi hoàn tất) |
| **Trợ Lý AI (`Bot`)** | Mở cố vấn tuyển sinh ảo 24/7 | Mở **`ChatBotModal`** lưu lịch sử trò chuyện riêng biệt theo từng tài khoản |
| **Khung Tìm Kiếm & Bộ Lọc Miền** | Tìm theo tên trường, mã trường, tỉnh/thành hoặc tên ngành đào tạo | Gợi ý tức thì (Autocomplete) và lọc danh sách 30 trường theo `Tất cả` / `Bắc` / `Trung` / `Nam` |
| **Nhấn vào Thẻ Trường Đại Học** | Xem hồ sơ tuyển sinh toàn diện của trường | Mở **`UniversityDetailModal`** (Điểm chuẩn 3 năm, danh sách ngành, học phí, học bổng, OJT, nút *Hỏi AI*, *Tư vấn 1-1*, *Nộp hồ sơ*) |
| **Nút Trái Tim (`Heart`)** | Lưu / bỏ lưu trường đại học yêu thích | Cập nhật `favoriteIds` trong kho dữ liệu riêng của người dùng, đồng bộ sang Tab 4 |
| **Nút So Sánh (`Scale`) & Thanh Nổi** | Chọn tối đa 3 trường để đối chiếu song song | Hiển thị thanh nổi **`So sánh (n/3)`** → Bấm mở **`CompareModal`** đối chiếu điểm chuẩn, học phí, việc làm |
| **Nút "Nộp hồ sơ xét tuyển"** | Khởi tạo hồ sơ xét tuyển sớm (yêu cầu đăng nhập thí sinh) | Mở **`ApplyDemoModal`** 3 bước → Tạo mã hồ sơ `HS-2026-UNIxxxx` đẩy thẳng sang cổng Admin & cổng trường (nếu nộp PXU) |
| **Nút "Tư vấn 1-1" / "Đặt lịch 1-1"** | Đặt lịch gặp trực tiếp giảng viên / ban tuyển sinh | Mở **`BookConsultationModal`** chọn trường, ngành, ngày giờ, hình thức (`Google Meet 1-1`, `Zalo`, `Trực tiếp`) → Đồng bộ sang Tab 4, Admin & PXU |
| **Tab 1: Trắc nghiệm Holland RIASEC** | Hoàn thành 12 câu hỏi tình huống (thang điểm 0–3) | Vẽ biểu đồ **Radar SVG 6 trục**, xác định mã Holland chủ đạo, mở **`CareerPathModal`** hoặc chuyển thẳng sang AI Matching |
| **Tab 2: "Phân tích cơ hội trúng tuyển"** | Chốt Điểm dự kiến, Ngân sách học phí & Khu vực | Thực thi `evaluateMatching()` phân 3 nhóm: **An Toàn (`≥ 80%`)**, **Vừa Sức (`45% – 79%`)**, **Thử Thách (`< 45%`)** |
| **Tab 3: EduFair LIVE Reactions & Chat** | Bấm *Thích*, *Thả tim*, *Vỗ tay* hoặc gửi câu hỏi trực tiếp | Tổng hợp âm thanh thực qua **Web Audio API**, hạt cảm xúc bay lên và tự động phản hồi từ cố vấn tuyển sinh |
| **Tab 4 (Thí sinh): "Chi tiết / Bổ sung"** | Xem tiến độ duyệt, giấy báo trúng tuyển hoặc nộp bổ sung minh chứng | Mở **`ViewApplicationModal`**: Hiển thị **Giấy báo Đủ điều kiện Trúng tuyển sớm** (khi `Đã trúng tuyển`) hoặc form **Bổ sung minh chứng** (khi `Thiếu hồ sơ`) |
| **Cổng PXU / Admin: Phê duyệt hồ sơ** | Bấm *Hồ sơ hợp lệ*, *Duyệt trúng tuyển*, *Yêu cầu bổ sung* hoặc *Từ chối* | Cập nhật trạng thái hồ sơ tức thì, lưu nhật ký kiểm toán (`processingLog`) và bắn thông báo trực tiếp về chuông của thí sinh (bền vững sau khi tải lại trang `F5`) |
| **Cổng PXU / Admin: Cập nhật Điểm chuẩn** | Chỉnh sửa điểm chuẩn tham chiếu & học phí tối thiểu | Dịch chuyển đồng bộ điểm chuẩn các ngành (`cutoffScores`) → Cập nhật ngay kết quả tính toán trên **AI Matching 2026** |

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY DỰ ÁN (LOCAL DEVELOPMENT)

### Yêu cầu môi trường
* **Node.js:** Phiên bản `18.x` trở lên (khuyến nghị `Node.js 20 LTS` hoặc mới hơn).
* **Trình quản lý gói:** `npm`.

### Các bước thực thi chuẩn:
```bash
# 1. Di chuyển vào thư mục dự án
cd "d:\VSCODE PXU K22\unipath-web"

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển (Vite Dev Server)
npm run dev

# 4. Kiểm tra chất lượng mã nguồn (ESLint - 0 lỗi, 0 cảnh báo)
npm run lint

# 5. Kiểm tra kiểu tĩnh TypeScript & Đóng gói bản Production
npm run build
```

---

## 🌟 THÔNG TIN BẢN QUYỀN

* **Dự án:** Hệ sinh thái Hướng nghiệp & Tuyển sinh Đại học Thông minh **UniPath 2.0**
* **Đơn vị đào tạo:** **Trường Đại học Phú Xuân (PXU)** — Thành phố Huế
* **Nhóm thực hiện:** **Nhóm UP5** (*Dương Đình Phát, Trần Công Quý, Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga*)
