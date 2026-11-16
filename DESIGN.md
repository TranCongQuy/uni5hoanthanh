# DESIGN.md — UniPath 2.0 Design System & Tokens

<!-- Aurora Deep Tech & Glassmorphism Design System | Modern Web & WCAG Compliant -->

## 1. Triết Lý Thiết Kế (Design Philosophy)
Hệ thống giao diện UniPath 2.0 được xây dựng theo phong cách **"Aurora Deep Tech & Glassmorphism"** kết hợp các tiêu chuẩn nghiêm ngặt của **"Premium Education SaaS"** dựa trên 3 trụ cột: **Điềm tĩnh (Restraint), Chuẩn xác (Precision) và Chân thực (Authenticity)**:
- **Chống AI Slop**: Không dùng card trong card (nested cards), không dùng emoji làm biểu tượng icon, không dùng gradient tím-xanh ảo giác, không dùng chữ in hoa giãn cách nhân tạo, không dùng carousel tự động xoay gây giật cục.
- **Thực tế & Trách nhiệm**: Mọi biểu tượng sử dụng bộ vector SVG nhất quán (Lucide icons); hình ảnh khuôn viên trường học là **ảnh thật 30/30 trường đại học** (`campus_*.jpg`); typography phân cấp chặt chẽ bằng font chữ "Be Vietnam Pro" kết hợp `font-variant-numeric: tabular-nums` cho số điểm và học phí.
- **Một Section / Một Màn hình & Nhịp 24px**: Mỗi màn hình truyền tải trọn vẹn một thông điệp với khoảng thở đều đặn và nhịp bố cục 24px.

---

## 2. Hệ Thống Bản Sắc Cổng (Portal Brand Identities)

Mỗi cổng trong UniPath 2.0 sở hữu một bảng màu Aurora định danh giàu chiều sâu thị giác nhưng tuân theo cùng một ngôn ngữ thiết kế:

| Cổng | Màu chủ đạo | Nền gradient Aurora | Ý nghĩa | Token chính |
| :--- | :--- | :--- | :--- | :--- |
| **Thí sinh (Candidate)** | Indigo / Sky Blue | `linear-gradient(135deg, #0A1128 0%, #101F42 40%, #1A2E63 100%)` | Tin cậy, công nghệ, tương lai học tập | `--up-student-primary: #4F46E5;` |
| **Tuyển sinh ĐH Phú Xuân (PXU)** | Emerald / Teal | `linear-gradient(180deg, #022C22 0%, #064E3B 45%, #0F766E 100%)` | Năng động, thực chiến OJT, việc làm bền vững | `--up-pxu-primary: #059669;` |
| **Quản trị viên Hệ thống (Admin)** | Deep Navy / Slate | `linear-gradient(180deg, #050B14 0%, #0B132B 45%, #1C2541 100%)` | Nghiêm cẩn, an ninh, trung tâm điều hành | `--up-admin-navy: #0F172A;` |

---

## 3. Kiến Trúc Thanh Điều Hướng Cố Định 3 Tầng (3-Tier Fixed Sidebar)

Thanh điều hướng bên trái trên Cổng Admin (`AdminApp.tsx`) và Cổng PXU (`UniversityApp.tsx`) được thiết kế theo kiến trúc 3 tầng độc lập để ngăn ngừa triệt để lỗi che khuất nội dung:

1. **Khối Đầu Trang Thương Hiệu (Pinned Top Header - `flexShrink: 0`)**:
   - Vị trí: Cố định ở đỉnh thanh điều hướng (`top: 0`).
   - Thành phần: Logo trường / Logo Admin, tên cổng và phân hiệu, ngăn cách bằng đường kẻ mờ `borderBottom: 1px solid rgba(255, 255, 255, 0.08)`. Luôn hiển thị 100%, không bao giờ bị cuộn mất.
2. **Khối Danh Mục Điều Hướng Ở Giữa (Scrollable Middle Nav - `flex: 1; minHeight: 0; overflowY: 'auto'`)**:
   - Sử dụng class `.up-sidebar-scroll` với thanh cuộn mỏng (5px), màu bán trong suốt, bo tròn 999px.
   - Cho phép người dùng lướt lên / lướt xuống mượt mà giữa các phân nhóm chức năng mà không làm xê dịch đầu trang hay chân trang.
   - Thuộc tính `overscroll-behavior: contain` ngăn chặn việc kích hoạt cuộn lan truyền ra toàn bộ trang.
3. **Khối Chân Trang Cố Định (Pinned Bottom Footer - `flexShrink: 0`)**:
   - Vị trí: Ghim cố định ở đáy thanh điều hướng (`bottom: 0`).
   - Nền: Bán trong suốt `backgroundColor: rgba(..., 0.75)` kết hợp `backdropFilter: blur(8px)`.
   - Thành phần: Khối trạng thái đồng bộ & nút khôi phục dữ liệu mẫu (Admin) hoặc Thẻ bảo mật phân lập dữ liệu (PXU).

---

## 4. Quy Chuẩn Thẻ Trường Học & Ảnh Bìa Campus Thật (`UniversityCard`)

Thẻ trường đại học được thiết kế sắc sảo tại `src/components/common/AuroraEffects.tsx`:
1. **Ảnh bìa Campus thật 100%**:
   - Nguồn ảnh: `/images/campus_<code thường>.jpg` (ví dụ `/images/campus_pxu.jpg`, `/images/campus_bka.jpg`), đủ 30/30 trường.
   - Cơ chế fallback: Nếu ảnh lỗi hoặc chưa tải xong, tự động fallback sang `/images/campus_default.png`.
   - Kích thước: Chiều cao `140px`, `object-fit: cover`, bo góc trên `16px`.
2. **Huy hiệu Logo Trường (Logo Badge)**:
   - Đặt tại vị trí ranh giới giữa ảnh bìa và thân thẻ, nền trắng bo góc `12px`, bóng đổ nhẹ `0 4px 12px rgba(0,0,0,0.12)`.
   - **Ranh giới an toàn**: Nằm bên ngoài container có `overflow: hidden` của ảnh bìa để loại bỏ hoàn toàn hiện tượng logo bị cắt cụt 16px ở cạnh đáy.
3. **Thông tin đối soát & Điểm chuẩn 3 năm**:
   - Hiển thị điểm chuẩn 3 năm liên tiếp (`2022`, `2023`, `2024`) dưới dạng số liệu dạng bảng (`.tabular-nums`).
   - Chip vùng miền (Bắc/Trung/Nam) và tỷ lệ việc làm OJT nổi bật.

---

## 5. Hệ Thống Trạng Thái Hồ Sơ Thống Nhất (Unified Application Status)

Màu sắc chip trạng thái hồ sơ phải **THỐNG NHẤT 100%** giữa cả 3 cổng (Thí sinh, PXU và Admin):

| Trạng thái hồ sơ | Màu nền | Màu chữ & Viền | Icon Lucide | Token |
| :--- | :--- | :--- | :--- | :--- |
| **Đang xét duyệt** | Hổ phách nhạt (`#FFFBEB`) | Nâu hổ phách (`#B45309`) | `Clock` | `--up-status-pending-*` |
| **Hồ sơ hợp lệ** | Xanh da trời nhạt (`#F0F9FF`) | Xanh dương (`#0369A1`) | `CheckCircle2` | `--up-status-valid-*` |
| **Thiếu hồ sơ** | Cam nhạt (`#FFF7ED`) | Cam đậm (`#C2410C`) | `FileQuestion` | `--up-status-incomplete-*` |
| **Đã trúng tuyển** | Ngọc lục bảo nhạt (`#ECFDF5`) | Xanh lá đậm (`#047857`) | `CheckCircle2` | `--up-status-admitted-*` |
| **Đã rút / Đã hủy** | Xám Slate nhạt (`#F1F5F9`) | Xám trung tính (`#64748B`) | `XCircle` | `--up-status-cancelled-*` |

---

## 6. Hệ Thống Biểu Đồ Trực Quan Hóa Dữ Liệu (Zero Heavy Chart Libraries)

1. **`BenchmarkHistogram.tsx` (Phân bố Điểm chuẩn 6 Phân khoảng)**:
   - 6 phân khoảng chuẩn hóa: `< 20đ`, `20 - 21.9đ`, `22 - 23.9đ`, `24 - 25.9đ`, `26 - 27.9đ`, `≥ 28đ`.
   - Cột SVG tương tác hiển thị số lượng trường trong khoảng, nhãn khoảng điểm và tỷ lệ phần trăm.
2. **`RadarChart.tsx` (Mạng nhện Holland RIASEC)**:
   - 6 trục vector biểu diễn điểm số nhóm tính cách R, I, A, S, E, C với lưới tỷ lệ đồng tâm.
3. **`DonutChart.tsx` (Vòng tròn phần trăm)**:
   - Biểu thị xác suất trúng tuyển theo ngưỡng màu An toàn (Xanh lá) – Vừa sức (Hổ phách) – Thử thách (Đỏ).
4. **`LineChart.tsx` (Đường xu hướng điểm 3 năm)**:
   - Thể hiện sự biến động điểm sàn tuyển sinh của trường qua các mùa thi.

---

## 7. Hệ Thống Design Tokens (`src/styles/tokens.css` & `src/index.css`)

### 7.1. Typography Scale
- Font chính: `'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`
- Font đơn cách: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;`
- Cỡ chữ:
  - Display: `32px` (weight 800)
  - H1: `24px` (weight 800)
  - H2: `20px` (weight 700)
  - H3: `16px` (weight 700)
  - Body: `14px` (weight 400/500)
  - Caption: `12px` (weight 500/600)
  - Tiny: `11px` (weight 700)
- Điểm số & tiền tệ: bắt buộc dùng lớp `.tabular-nums` (`font-variant-numeric: tabular-nums; font-feature-settings: 'tnum';`).

### 7.2. Thang Đo Khoảng Cách (Spacing Scale - Bội số 4px)
- `--up-space-1`: `4px`
- `--up-space-2`: `8px`
- `--up-space-3`: `12px`
- `--up-space-4`: `16px`
- `--up-space-5`: `20px`
- `--up-space-6`: `24px` (Nhịp section chuẩn)
- `--up-space-8`: `32px`
- `--up-space-10`: `40px`
- `--up-space-12`: `48px`

### 7.3. Bán Kính Bo Góc & Đổ Bóng (Radii & Elevation)
- Thẻ thông thường: bo góc `16px` (`--up-radius-lg`), viền `1px solid var(--up-color-slate-200)`.
- Nút bấm & Ô nhập liệu: bo góc `10–12px` (`--up-radius-md`).
- Hộp thoại Modal: bo góc `24px` (`--up-radius-2xl`).
- Đổ bóng thẻ: `--up-shadow-card: 0 4px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04);`
- Đổ bóng Modal: `--up-shadow-modal: 0 20px 48px -8px rgba(15, 23, 42, 0.2), 0 8px 16px -4px rgba(15, 23, 42, 0.06);`

---

## 8. Quy Chuẩn Bộ Component Dùng Chung (`src/components/common/UI.tsx` & `AuroraEffects.tsx`)

1. **`Button`**: Hỗ trợ các biến thể `primary`, `secondary`, `outline`, `tonal`, `ghost`, `danger`. Tích hợp trạng thái `loading` (spinner CSS) và `disabled`. Hiệu ứng chuyển động mượt mà 150ms.
2. **`Card`**: Thẻ surface nền trắng chuẩn SaaS, viền mỏng 1px slate-200, tùy chọn `hoverable` nâng nhẹ `translateY(-2px)`.
3. **`StatusChip`**: Hiển thị trạng thái hồ sơ chuẩn hóa với màu sắc và icon cố định; luôn giữ nguyên trên 1 dòng duy nhất (`white-space: nowrap`, `display: inline-flex`), chống gãy dòng trên cả 1440px và 390px.
4. **`Badge`**: Huy hiệu phân loại theo ngữ cảnh (primary, success, warning, danger, info, neutral).
5. **`Input` & `Select`**: Tích hợp nhãn (`label`), thông báo lỗi đỏ (`error`) kèm icon `AlertCircle`, text hỗ trợ (`helper`).
6. **`Tabs`**: Hỗ trợ 2 kiểu giao diện: thanh gạch chân (`underline`) và viên thuốc (`pills`).
7. **`Skeleton`**: Hiệu ứng shimmer thuần CSS phục vụ trạng thái đang tải (Loading state).
8. **`EmptyState`**: Không dùng emoji; dùng icon Lucide (`Search`), tiêu đề rõ ràng, mô tả súc tích và nút hành động khắc phục.
9. **`Modal`**: Hộp thoại responsive, căn giữa trên màn hình desktop, tự chuyển bottom-sheet trên thiết bị di động, backdrop blur, hỗ trợ phím `Escape` và ngăn cuộn tràn nền (`overscroll-behavior: contain`).
10. **`UniversityCard`**: Thẻ trường chuẩn Aurora kết hợp ảnh campus thật 30/30 trường, logo monogram bo tròn an toàn, xếp hạng và thông tin điểm chuẩn 3 năm.
