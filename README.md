# 🎓 UNIPATH 2.0 - HỆ SINH THÁI HƯỚNG NGHIỆP & TUYỂN SINH ĐẠI HỌC THÔNG MINH
### 📱 Mobile-First Native (< 1024px) & 💻 Desktop Widescreen (≥ 1024px) Tự Động Thích Ứng

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://uni5hoanthanh.vercel.app)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> 🌐 **Trang web chính thức:** [https://uni5hoanthanh.vercel.app](https://uni5hoanthanh.vercel.app)  
> **UniPath 2.0** là nền tảng số toàn diện hỗ trợ học sinh THPT (đặc biệt là 2k8, 2k9) và quý phụ huynh trên hành trình chọn ngành, chọn trường và kiến tạo tương lai nghề nghiệp vững chắc với công nghệ AI đối soát chuẩn xác, mô hình hướng nghiệp quốc tế RIASEC, dữ liệu điểm chuẩn 30 trường đại học hàng đầu 3 miền Bắc - Trung - Nam, cùng hệ thống phân quyền quản trị xét tuyển tuyển sinh thông minh (RBAC).

---

## 👥 ĐƠN VỊ PHÁT TRIỂN & BẢN QUYỀN DỰ ÁN

Dự án được nghiên cứu, thiết kế và phát triển độc quyền bởi **Nhóm UP5** thuộc **Trường Đại học Phú Xuân (PXU)**:

* 👑 **Trưởng nhóm UP5:** **Dương Đình Phát**
* 💻 **Kỹ sư phát triển phần mềm (Phát triển App):** **Trần Công Quý**
* 🤝 **Thành viên nhóm UP5:**
  * **Trần Thị Nhung**
  * **Nguyễn Thị Lý Trà My**
  * **Thái Thị Nga**
* 🏛️ **Đơn vị chủ quản & Đào tạo:** **Trường Đại học Phú Xuân (PXU)**

> **© Bản quyền dự án thuộc về Nhóm UP5 — Trường Đại học Phú Xuân (PXU). Phát triển app bởi Trần Công Quý.**

---

## 📚 BỘ HỒ SƠ TÀI LIỆU KỸ THUẬT & NGHIỆP VỤ CHÍNH THỨC

Để phục vụ công tác đánh giá, nghiệm thu và chấm đồ án, toàn bộ hệ thống được tài liệu hóa chi tiết qua 4 văn bản chuyên sâu:

1. 📋 **[01-NGHIEP-VU.md](01-NGHIEP-VU.md):** Phân tích nghiệp vụ tuyển sinh, lý thuyết hướng nghiệp quốc tế John Holland (RIASEC 6 nhóm tính cách), thuật toán phân tích trúng tuyển AI Matching 2026, ngày hội ảo EduFair LIVE và quy trình xét tuyển học bạ THPT.
2. 🎨 **[02-GIAO-DIEN-AI.md](02-GIAO-DIEN-AI.md):** Kiến trúc giao diện thích ứng kép (Dual-Engine Adaptive UI: Mobile View < 1024px & Desktop Widescreen $\ge$ 1024px tự động nhận diện mượt mà không thông báo phiền toái), thiết kế trực quan chống tràn (Zero Overflow), hệ thống biểu đồ SVG thuần (Radar, Donut, Line) và bộ tổng hợp âm thanh Web Audio API (SoundFX Synthesizer).
3. 💻 **[03-KY-THUAT-FRONTEND.md](03-KY-THUAT-FRONTEND.md):** Kiến trúc kỹ thuật lập trình Frontend với React 19, TypeScript 5, Vite 6, quản trị trạng thái toàn cục qua `AppContext`, kỹ thuật khóa cuộn màn hình chống cuộn kép (Body Scroll Lock), và quy trình đóng gói tối ưu hóa asset.
4. 🛡️ **[04-KY-THUAT-ADMIN.md](04-KY-THUAT-ADMIN.md):** Ma trận phân quyền vai trò người dùng (RBAC), quy trình phê duyệt hồ sơ tuyển sinh (Approval Workflow), cơ chế phân lập dữ liệu độc quyền cho Trường Đại học Phú Xuân (PXU), và hướng dẫn sử dụng bộ chuyển vai trò kiểm thử 1-click.

---

## 🔐 MA TRẬN TÀI KHOẢN & PHÂN QUYỀN HỆ THỐNG (RBAC)

UniPath 2.0 cung cấp 3 tài khoản mẫu được định cấu hình sẵn, cho phép kiểm thử tức thì qua nút bấm **1-Click**:

| Vai trò (Role) | Email đăng nhập | Mật khẩu mẫu | Quyền hạn cốt lõi | Giới hạn bảo mật |
| :--- | :--- | :---: | :--- | :--- |
| **Thí sinh 2k8**<br>(Trần Công Quý) | `quy@unipath.vn` | `123456` | Khảo sát Holland RIASEC, AI Matching 2026, tương tác LIVE, nộp đơn xét tuyển, quản lý hồ sơ cá nhân. | Không xem được hồ sơ thí sinh khác; không được phê duyệt hồ sơ; không chỉnh sửa CSDL trường. |
| **Admin Hệ Thống**<br>(Quản trị UniPath 2.0) | `admin@unipath.vn` | `admin123` | Toàn quyền quản trị hệ thống, xem và duyệt hồ sơ toàn quốc của 30 trường ĐH, điều chỉnh điểm sàn & học phí CSDL. | Không nộp hồ sơ xét tuyển dưới danh nghĩa thí sinh. |
| **ĐH Phú Xuân**<br>(Ban Tuyển Sinh PXU) | `tuyensinh@pxu.edu.vn` | `pxu123` | Cổng tuyển sinh chuyên biệt của ĐH Phú Xuân: Xem và duyệt hồ sơ nộp vào PXU, quản lý chỉ tiêu OJT & học bổng 2026. | **Phân lập bảo mật tuyệt đối:** Chỉ xem và xử lý hồ sơ thí sinh nộp vào PXU (`uniCode === 'PXU'`), ẩn hoàn toàn 29 trường khác. |

> 💡 **Tính năng Kiểm Thử Nhanh (Role Switcher Bar):** Tại **Tab 4 (Hồ sơ xét tuyển / Quản trị)** trên cả giao diện Desktop và Mobile, thanh công cụ chuyển đổi vai trò cho phép bạn chuyển đổi giữa Thí sinh, Admin và ĐH Phú Xuân chỉ với 1 click chuột!

---

## 🗺️ BẢNG ÁNH XẠ CHỨC NĂNG & LUỒNG NÚT BẤM (BUTTON CLICK & ACTION MATRIX)

Nhằm đảm bảo tính logic tuyệt đối: **"Bấm nút này thì ra cái gì / trang nào"**, dưới đây là bảng đối soát chi tiết toàn bộ các nút bấm và hành động tương tác trong hệ thống:

| Vị trí / Nút bấm | Hành vi khi nhấn (Action) | Đích đến / Trạng thái hiển thị |
| :--- | :--- | :--- |
| **Chuyển đổi màn hình tự động** | Thay đổi kích thước trình duyệt hoặc mở trên thiết bị khác | Tự động chuyển `Desktop Widescreen` ($\ge$ 1024px) hoặc `Mobile Native` (< 1024px) không có thông báo gây phiền toái |
| **Logo UniPath (Góc trên)** | Đưa người dùng về màn hình Trang chủ | Chuyển về **Tab 0 (Trang chủ)** và cuộn mượt lên đỉnh trang |
| **Thanh Điều Hướng 5 Tabs** | Chuyển đổi giữa 5 phân hệ tính năng | **Tab 0:** Trang chủ • **Tab 1:** Khảo sát Holland • **Tab 2:** AI Matching • **Tab 3:** EduFair LIVE • **Tab 4:** Hồ sơ & Quản trị |
| **Chuông Thông Báo (Bell Icon)** | Mở trung tâm thông báo tuyển sinh | Mở modal **`NotificationsModal`** (Căn giữa trên Desktop, Bottom-sheet trên Mobile) |
| **Trợ Lý AI (Robot Icon)** | Mở hộp thoại chat AI 24/7 | Mở modal **`ChatBotModal`** với các câu hỏi gợi ý thông minh |
| **Nút "⚡ Thí sinh (Trần Công Quý)"** | Đăng nhập tài khoản thí sinh 2k8 | Kích hoạt phiên làm việc thí sinh Trần Công Quý với dữ liệu mẫu hoàn chỉnh |
| **Nút "👑 Admin Hệ Thống"** | Đăng nhập Quản trị viên cấp cao | Mở ngay **Bảng Điều Khiển Tuyển Sinh Toàn Quốc** (xét duyệt 30 trường, sửa CSDL điểm chuẩn) |
| **Nút "🏛️ ĐH Phú Xuân (PXU)"** | Đăng nhập Ban Tuyển Sinh PXU | Mở ngay **Cổng Tuyển Sinh ĐH Phú Xuân** (xét duyệt hồ sơ nộp PXU, xem chỉ tiêu OJT) |
| **Thanh RoleSwitcherBar (Tab 4)** | Chuyển đổi vai trò kiểm thử 1-click | Chuyển đổi trạng thái tài khoản và render giao diện tương ứng ngay lập tức |
| **Hero Slide 1: "Làm bài test RIASEC"** | Điều hướng đến trắc nghiệm tính cách | Chuyển sang **Tab 1 (Khảo sát Holland)** |
| **Hero Slide 2: "Tham gia EduFair Live"** | Điều hướng vào ngày hội tuyển sinh ảo | Chuyển sang **Tab 3 (Unipath LIVE)** |
| **Hero Slide 3: "Hỏi Trợ lý AI ngay"** | Tư vấn lộ trình THPT hoặc mở bot | Mở modal **`ChatBotModal`** |
| **Khung Tìm Kiếm Trường Đại Học** | Nhập tên trường, mã trường, khu vực | Gợi ý tức thì danh sách trường phù hợp kèm bộ lọc 3 miền |
| **Nhấn Vào Thẻ Trường Đại Học** | Mở hồ sơ chi tiết trường | Mở modal **`UniversityDetailModal`** (Tổng quan, Điểm chuẩn, Học phí, Review) |
| **Nút Trái Tim (Yêu thích)** | Thêm hoặc xóa trường khỏi danh sách yêu thích | Lưu trạng thái vào `favoriteIds` (Xem lại tại Tab 4) |
| **Nút Checkbox / Nút "So sánh"** | Chọn từ 1 đến 3 trường để đối soát | Thêm vào `compareIds` và làm xuất hiện thanh nổi **"So sánh (n/3)"** |
| **Thanh Nổi "So sánh ({n}/3)"** | Mở bảng đối chiếu đa tiêu chí | Mở modal **`CompareModal`** (Điểm chuẩn, Học phí, Việc làm, Vị trí) |
| **Nút "Nộp hồ sơ" trong chi tiết trường** | Khởi tạo đơn xét tuyển sớm | Mở modal **`ApplyDemoModal`** chọn ngành & phương thức xét tuyển |
| **Tab 1: "Bắt đầu làm bài trắc nghiệm"** | Khởi chạy 12 câu hỏi chuẩn Hoa Kỳ | Bắt đầu bài test RIASEC với thanh tiến trình trực quan |
| **Tab 1: "Đối soát cơ hội trúng tuyển cùng AI"** | Chuyển kết quả Holland sang AI Matching | Chuyển sang **Tab 2 (AI Matching)** mang theo mã tính cách vừa đạt được |
| **Tab 1: "Xem lộ trình nghề nghiệp chi tiết"** | Tra cứu hướng phát triển ngành học | Mở modal **`CareerPathModal`** tương ứng mã RIASEC của thí sinh |
| **Tab 2: Thanh Trượt Điểm Thi & Học Phí** | Thay đổi tiêu chí điểm THPT và ngân sách | Chuyển trạng thái sang chờ chốt thông số, ẩn bảng cũ để chống tự nhảy kết quả |
| **Tab 2: "Phân tích cơ hội trúng tuyển ngay"** | AI kích hoạt thuật toán đối soát 30 trường | Hiển thị thẻ xác nhận ✅ và phân 3 nhóm: **An toàn - Vừa sức - Thách thức** |
| **Tab 3: Tương Tác Thích, Thả Tim, Vỗ Tay** | Kích hoạt hiệu ứng âm thanh & hình ảnh | Phát âm thanh vỗ tay/tim/pop qua **Web Audio API** kèm emoji bay bổng |
| **Tab 3: Gửi Bình Luận Trực Tiếp** | Gửi câu hỏi vào khung chat phòng live | Đẩy tin nhắn lên khung chat và nhận phản hồi tự động từ ban tư vấn |
| **Tab 4 (Admin): "Duyệt trúng tuyển"** | Phê duyệt hồ sơ thí sinh | Chuyển trạng thái sang `Đã trúng tuyển` (Màu xanh emerald `#10B981`) |
| **Tab 4 (Admin): "Yêu cầu bổ sung"** | Gửi yêu cầu hoàn thiện giấy tờ | Chuyển trạng thái sang `Thiếu hồ sơ` (Màu xanh dương `#2563EB`) |
| **Tab 4 (Admin): "Từ chối hồ sơ"** | Từ chối do không đủ điểm sàn | Chuyển trạng thái sang `Đã bị hủy` (Màu đỏ `#EF4444`) |
| **Tab 4 (Admin): "Sửa / Lưu CSDL"** | Tinh chỉnh điểm chuẩn & học phí trường | Cập nhật trực tiếp số liệu trường vào CSDL chuẩn và lưu vào State |
| **Tab 4 (PXU): "Duyệt trúng tuyển PXU"** | Phê duyệt trúng tuyển sớm ĐH Phú Xuân | Gửi giấy báo trúng tuyển sớm ĐH Phú Xuân cho thí sinh |

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCAL (DEVELOPMENT SETUP)

### Yêu cầu môi trường
* **Node.js:** Phiên bản 18.x trở lên (khuyên dùng Node 20 LTS).
* **Trình quản lý gói:** `npm` (đi kèm Node.js).

### Các bước khởi chạy dự án:
```bash
# 1. Di chuyển vào thư mục dự án
cd "d:\VSCODE PXU K22\unipath-web"

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển (Vite Dev Server)
npm run dev

# 4. Kiểm tra chất lượng mã nguồn (ESLint - 0 lỗi)
npm run lint

# 5. Đóng gói bản phát hành sản phẩm (Production Build)
npm run build
```

---

## 🌟 ĐƠN VỊ THỰC HIỆN & BẢN QUYỀN

Dự án được thực hiện phục vụ công tác tuyển sinh đại học số và hướng nghiệp THPT toàn quốc:
* 🏛️ **Đơn vị chủ quản & Đào tạo:** **Trường Đại học Phú Xuân (PXU)**
* 👥 **Nhóm nghiên cứu & phát triển UP5:**
  * 👑 **Trưởng nhóm:** **Dương Đình Phát**
  * 💻 **Kỹ sư phát triển phần mềm:** **Trần Công Quý**
  * 🤝 **Thành viên:** **Trần Thị Nhung, Nguyễn Thị Lý Trà My, Thái Thị Nga**
