# DESIGN.md — UniPath 2.0 Design System & Tokens

<!-- Hallmark Stamp: 2026-11-14 | Mode: Persuade (Student) & Operate (Admin/PXU) | Authority: True -->

## 1. Triết Lý Thiết Kế (Design Philosophy)
Hệ thống giao diện UniPath 2.0 được xây dựng dựa trên nguyên tắc **Điềm tĩnh (Restraint), Chuẩn xác (Precision) và Chân thực (Authenticity)**:
- **Chống AI Slop**: Không dùng card trong card (nested cards), không dùng emoji làm biểu tượng icon, không dùng gradient màu tím-xanh, không dùng chữ in hoa giãn cách (tracked capitals) nhân tạo, không dùng carousels tự động xoay.
- **Thực tế & Trách nhiệm**: Mọi hình ảnh là khuôn viên trường học thật; biểu tượng sử dụng bộ vector SVG nhất quán (Lucide icons); typography phân cấp chặt chẽ theo tỷ lệ vàng.
- **Một Section / Một Màn hình**: Mỗi màn hình truyền tải trọn vẹn một thông điệp hoặc giải quyết dứt điểm một nhiệm vụ cụ thể.

---

## 2. Hệ Thống Design Tokens (Tokens as Source of Truth)

Tất cả các thành phần giao diện bắt buộc phải truy xuất màu sắc, khoảng cách, bo góc và đổ bóng thông qua các biến CSS được khai báo tại `:root` trong `src/styles/tokens.css`.

### 2.1. Bảng Màu Ngữ Nghĩa (Semantic Palette)
```css
:root {
  /* Brand Primary: Deep Navy & Tech Sky */
  --up-color-primary: #0284C7;
  --up-color-primary-hover: #0369A1;
  --up-color-primary-active: #075985;
  --up-color-primary-light: #F0F9FF;
  --up-color-primary-subtle: #E0F2FE;

  /* Semantic Feedback */
  --up-color-success: #059669;
  --up-color-success-light: #ECFDF5;
  --up-color-success-border: #A7F3D0;

  --up-color-warning: #D97706;
  --up-color-warning-light: #FFFBEB;
  --up-color-warning-border: #FDE68A;

  --up-color-danger: #DC2626;
  --up-color-danger-light: #FEF2F2;
  --up-color-danger-border: #FECACA;

  --up-color-info: #2563EB;
  --up-color-info-light: #EFF6FF;
  --up-color-info-border: #BFDBFE;

  /* Surfaces & Backgrounds */
  --up-color-bg-page: #F8FAFC;
  --up-color-surface: #FFFFFF;
  --up-color-surface-subtle: #F1F5F9;
  --up-color-surface-hover: #F8FAFC;

  /* Typography Colors (Độ tương phản >= 4.5:1 đạt chuẩn WCAG AA) */
  --up-color-text-primary: #0F172A;
  --up-color-text-secondary: #475569;
  --up-color-text-tertiary: #64748B;
  --up-color-text-inverse: #FFFFFF;

  /* Borders & Dividers */
  --up-color-border-subtle: #E2E8F0;
  --up-color-border-strong: #CBD5E1;
}
```

### 2.2. Thang Đo Khoảng Cách (Spacing Scale - Bội số 4px)
- `--up-space-1`: `4px`
- `--up-space-2`: `8px`
- `--up-space-3`: `12px`
- `--up-space-4`: `16px`
- `--up-space-5`: `20px`
- `--up-space-6`: `24px`
- `--up-space-8`: `32px`
- `--up-space-10`: `40px`
- `--up-space-12`: `48px`

### 2.3. Bán Kính Bo Góc & Đổ Bóng (Radii & Elevation)
- `--up-radius-sm`: `6px`
- `--up-radius-md`: `10px`
- `--up-radius-lg`: `16px`
- `--up-radius-xl`: `20px`
- `--up-radius-full`: `9999px`
- `--up-shadow-sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`
- `--up-shadow-card`: `0 4px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`
- `--up-shadow-lg`: `0 12px 32px -4px rgba(15, 23, 42, 0.12)`

---

## 3. Quy Chuẩn Thành Phần (Component Standards)

### 3.1. Nút Bấm & Thẻ Tương Tác
- Mọi phần tử có thể bấm (`button`, `a`, input) phải hỗ trợ trạng thái `:focus-visible` với vòng viền `2px solid var(--up-color-primary)` và `outline-offset: 2px`.
- Hiệu ứng hover vi mô: Nâng nhẹ `transform: translateY(-1px)` và tăng bóng đổ nhẹ; bấm xuống `transform: translateY(0px)`. Tuyệt đối không dùng `transition: all`.

### 3.2. Bảng Dữ Liệu Quản Trị (Admin & PXU Tables)
- Tiêu đề cột `<thead>` luôn có `position: sticky; top: 0; z-index: 10;`, nền `var(--up-color-surface)` và đường kẻ đáy rõ ràng.
- Khung cuộn ngang có `tabindex="0"`, `role="region"`, `aria-label` để người dùng bàn phím có thể dùng phím mũi tên cuộn ngang dễ dàng.
- Các cột sắp xếp được phải khai báo `aria-sort="ascending" | "descending"`.

### 3.3. Hộp Thoại (Modals & Dialogs)
- Lớp nền mờ (Backdrop) và khung chứa phải áp dụng `overscroll-behavior: contain;` để chặn hoàn toàn hiện tượng cuộn xích trang phía sau.
- Tự động đóng khi người dùng ấn phím `Escape` (Light-dismiss).
- Nút an toàn (Hủy/Đóng) trong hộp thoại hủy hồ sơ hoặc xóa dữ liệu phải nhận `autofocus` để tránh thao tác nhầm lẫn nguy hại.

### 3.4. Bộ Gõ Tiếng Việt & Nhập Liệu
- Tất cả ô nhập văn bản có bắt sự kiện phím `Enter` (như ChatBot, Search Input) phải kiểm tra `if (e.nativeEvent.isComposing || e.keyCode === 229) return;` trước khi gửi.
- Ô số điện thoại và điểm số phải mang `inputmode="tel"` và `inputmode="decimal"`. Ô tài khoản/mật khẩu có `autocomplete` và `spellcheck="false"`.
