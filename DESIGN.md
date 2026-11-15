# DESIGN.md — UniPath 2.0 Design System & Tokens

<!-- Hallmark & Impeccable Stamp: 2026-11-15 | Premium Education SaaS Design System | Authority: True -->

## 1. Triết Lý Thiết Kế (Design Philosophy)
Hệ thống giao diện UniPath 2.0 được xây dựng theo phong cách **"Premium Education SaaS"** dựa trên 3 trụ cột: **Điềm tĩnh (Restraint), Chuẩn xác (Precision) và Chân thực (Authenticity)**:
- **Chống AI Slop**: Không dùng card trong card (nested cards), không dùng emoji làm biểu tượng icon, không dùng gradient tím-xanh ảo giác, không dùng chữ in hoa giãn cách nhân tạo, không dùng carousel tự động xoay gây giật cục.
- **Thực tế & Trách nhiệm**: Mọi biểu tượng sử dụng bộ vector SVG nhất quán (Lucide icons); typography phân cấp chặt chẽ bằng font chữ "Be Vietnam Pro" kết hợp `font-variant-numeric: tabular-nums` cho số điểm và học phí.
- **Một Section / Một Màn hình & Nhịp 24px**: Mỗi màn hình truyền tải trọn vẹn một thông điệp với khoảng thở đều đặn và nhịp bố cục 24px.

---

## 2. Hệ Thống Bản Sắc Cổng (Portal Brand Identities)

Mỗi cổng trong UniPath 2.0 sở hữu một màu nhấn định danh duy nhất nhưng tuân theo cùng một ngôn ngữ thiết kế:

| Cổng | Màu chủ đạo | Ý nghĩa | Token chính |
| :--- | :--- | :--- | :--- |
| **Thí sinh (Candidate)** | Indigo / Deep Blue | Tin cậy, công nghệ, tương lai học tập | `--up-student-primary: #4F46E5;` |
| **Tuyển sinh ĐH Phú Xuân (PXU)** | Emerald / Green | Năng động, thực chiến, việc làm bền vững | `--up-pxu-primary: #059669;` |
| **Quản trị viên Hệ thống (Admin)** | Slate / Navy | Nghiêm cẩn, an ninh, quyền lực quản trị | `--up-admin-navy: #0F172A;` |

---

## 3. Hệ Thống Trạng Thái Hồ Sơ Thống Nhất (Unified Application Status)

Màu sắc chip trạng thái hồ sơ phải **THỐNG NHẤT 100%** giữa cả 3 cổng (Thí sinh, PXU và Admin):

| Trạng thái hồ sơ | Màu nền | Màu chữ & Viền | Icon Lucide | Token |
| :--- | :--- | :--- | :--- | :--- |
| **Đang xét duyệt** | Hổ phách nhạt (`#FFFBEB`) | Nâu hổ phách (`#B45309`) | `Clock` | `--up-status-pending-*` |
| **Hồ sơ hợp lệ** | Xanh da trời nhạt (`#F0F9FF`) | Xanh dương (`#0369A1`) | `CheckCircle2` | `--up-status-valid-*` |
| **Thiếu hồ sơ** | Cam nhạt (`#FFF7ED`) | Cam đậm (`#C2410C`) | `FileQuestion` | `--up-status-incomplete-*` |
| **Đã trúng tuyển** | Ngọc lục bảo nhạt (`#ECFDF5`) | Xanh lá đậm (`#047857`) | `CheckCircle2` | `--up-status-admitted-*` |
| **Đã rút / Đã hủy** | Xám Slate nhạt (`#F1F5F9`) | Xám trung tính (`#64748B`) | `XCircle` | `--up-status-cancelled-*` |

---

## 4. Hệ Thống Design Tokens (`src/styles/tokens.css`)

### 4.1. Typography Scale
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
- Điểm số & tiền tệ: bắt buộc dùng lớp `.tabular-nums` (`font-variant-numeric: tabular-nums`).

### 4.2. Thang Đo Khoảng Cách (Spacing Scale - Bội số 4px)
- `--up-space-1`: `4px`
- `--up-space-2`: `8px`
- `--up-space-3`: `12px`
- `--up-space-4`: `16px`
- `--up-space-5`: `20px`
- `--up-space-6`: `24px` (Nhịp section chuẩn)
- `--up-space-8`: `32px`
- `--up-space-10`: `40px`
- `--up-space-12`: `48px`

### 4.3. Bán Kính Bo Góc & Đổ Bóng (Radii & Elevation)
- Thẻ thông thường: bo góc `16px` (`--up-radius-lg`), viền `1px solid var(--up-color-slate-200)`.
- Nút bấm & Ô nhập liệu: bo góc `10–12px` (`--up-radius-md`).
- Hộp thoại Modal: bo góc `24px` (`--up-radius-2xl`).
- Đổ bóng thẻ: `--up-shadow-card: 0 4px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04);`
- Đổ bóng Modal: `--up-shadow-modal: 0 20px 48px -8px rgba(15, 23, 42, 0.2), 0 8px 16px -4px rgba(15, 23, 42, 0.06);`

---

## 5. Quy Chuẩn Bộ Component Dùng Chung (`src/components/common/UI.tsx`)

1. **`Button`**: Hỗ trợ các biến thể `primary`, `secondary`, `outline`, `tonal`, `ghost`, `danger`. Tích hợp trạng thái `loading` (spinner CSS) và `disabled`. Hiệu ứng chuyển động mượt mà 150ms.
2. **`Card`**: Thẻ surface nền trắng chuẩn SaaS, viền mỏng 1px slate-200, tùy chọn `hoverable` nâng nhẹ `translateY(-2px)`.
3. **`StatusChip`**: Hiển thị trạng thái hồ sơ chuẩn hóa với màu sắc và icon cố định.
4. **`Badge`**: Huy hiệu phân loại theo ngữ cảnh (primary, success, warning, danger, info, neutral).
5. **`Input` & `Select`**: Tích hợp nhãn (`label`), thông báo lỗi đỏ (`error`) kèm icon `AlertCircle`, text hỗ trợ (`helper`).
6. **`Tabs`**: Hỗ trợ 2 kiểu giao diện: thanh gạch chân (`underline`) và viên thuốc (`pills`).
7. **`Skeleton`**: Hiệu ứng shimmer thuần CSS phục vụ trạng thái đang tải (Loading state).
8. **`EmptyState`**: Không dùng emoji; dùng icon Lucide (`Search`), tiêu đề rõ ràng, mô tả súc tích và nút hành động khắc phục.
9. **`Modal`**: Hộp thoại responsive, căn giữa trên màn hình desktop, tự chuyển bottom-sheet trên thiết bị di động, backdrop blur, hỗ trợ phím `Escape` và ngăn cuộn tràn nền (`overscroll-behavior: contain`).
10. **`UniversityAvatar`**: Monogram badge xác định màu sắc theo mã trường (deterministic), không dùng ảnh bên ngoài tránh đứt gãy kết nối.
