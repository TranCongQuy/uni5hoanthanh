# Learning Log — Quá Trình Học Stack & Giám Sát AI
> **Học phần:** AI-Based Programming  
> **Dự án:** UniPath 2.0 (`TranCongQuy/uni5hoanthanh`)  
> **Công nghệ (Stack):** React 19 + TypeScript + Vite + Supabase (PostgreSQL / Edge Functions)  
> **Mục tiêu:** Ghi nhận thực tế quá trình học và kiểm soát công nghệ khi làm việc cùng AI — chỉ rõ các điểm AI trả lời sai/ảo tưởng (hallucination) hoặc không phù hợp bối cảnh, và cách sinh viên độc lập phát hiện, sửa chữa.

---

## 1. Tình huống 1: Nhầm lẫn phiên bản Vite trong tài liệu kỹ thuật
- **Câu hỏi đã hỏi AI:**  
  *"Kiểm tra và cập nhật file tài liệu kiến trúc kỹ thuật `03-KY-THUAT-FRONTEND.md` để mô tả chính xác công cụ đóng gói và phiên bản Vite đang được dự án sử dụng."*
- **Chỗ AI trả lời sai / chưa phù hợp:**  
  AI tự động sinh văn bản mô tả dự án dùng *"Vite 6.x kết hợp plugin React 19"* dựa trên dữ liệu đào tạo phổ biến gần đây.
- **Cách con người phát hiện và sửa:**  
  Sinh viên mở trực tiếp file cấu hình chuẩn [package.json](package.json) và phát hiện dependency thực tế là `"vite": "^8.3.5"` (Vite 8 beta/nightly). Khi chạy `npx vite --version` trong terminal xác nhận `vite/8.3.5`.  
  **Khắc phục:** Con người từ chối văn bản của AI, sửa lại đúng định danh `Vite 8.3` trong toàn bộ tài liệu kỹ thuật và lưu ý AI luôn phải đọc file `package.json` trước khi đưa ra thông số kỹ thuật.

---

## 2. Tình huống 2: Lỗi tràn ngang do carousel ngoài khung nhìn & Tiêu chí đo lường
- **Câu hỏi đã hỏi AI:**  
  *"Tại sao trên màn hình di động 390px đôi khi xuất hiện thanh cuộn ngang khó chịu? Làm thế nào để viết kịch bản tự động kiểm tra trang web không bị tràn ngang?"*
- **Chỗ AI trả lời sai / chưa phù hợp:**  
  AI đề xuất đoạn script kiểm tra: `window.innerWidth >= document.body.clientWidth`. Theo AI, nếu hai giá trị này bằng nhau thì không có lỗi tràn ngang. Tuy nhiên, cách đo này hoàn toàn sai khi có các thẻ `position: absolute` hoặc flex item trượt ngoài khung nhìn (như slide carousel 3D của hero banner). Trình duyệt vẫn render thanh cuộn ngang nhưng `clientWidth` vẫn báo bằng `innerWidth`.
- **Cách con người phát hiện và sửa:**  
  Sinh viên kiểm tra DevTools và thấy `document.documentElement.scrollWidth` đạt `560px` trong khi `window.innerWidth` chỉ là `390px` (tràn 170px do slide thứ 2 và 3 của carousel đang neo ngoài viewport với `opacity: 0` nhưng chưa được `display: none` hoặc `overflow: clip`).  
  **Khắc phục:**  
  1. Thay đổi tiêu chí đo lường chính xác: `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.  
  2. Áp dụng chuẩn `overflow-x: clip` trên `html, body` và loại bỏ hoàn toàn carousel tự chạy ngoài tầm nhìn.

---

## 3. Tình huống 3: Phiên đăng nhập giả bằng `localStorage` & Lộ thông tin nhạy cảm
- **Câu hỏi đã hỏi AI:**  
  *"Hãy tạo chức năng đăng nhập và ghi nhớ phiên làm việc cho 3 vai trò: Admin, Cán bộ PXU và Thí sinh."*
- **Chỗ AI trả lời sai / chưa phù hợp:**  
  AI sinh mã nguồn lưu trực tiếp object `{ email: 'admin@unipath.vn', role: 'admin', pass: 'admin123' }` dưới dạng JSON plaintext vào `localStorage.setItem('unipath_session', ...)`. Đồng thời trong mã frontend, AI viết sẵn `if (pass === 'admin123') role = 'admin'`.  
  Cách làm này cực kỳ nguy hiểm: bất kỳ ai mở DevTools đều đọc được mật khẩu quản trị, và bất kỳ đoạn mã JS độc hại (XSS) nào cũng có thể sửa `role: 'admin'` trong localStorage để chiếm quyền hệ thống.
- **Cách con người phát hiện và sửa:**  
  Sinh viên thực hiện kiểm toán bảo mật (Security Audit), phát hiện chuỗi `"admin123"` xuất hiện trần trụi trong bundle `dist/assets/index-*.js`.  
  **Khắc phục:**  
  1. Xây dựng module `src/utils/security.ts` triển khai thuật toán băm **Salted SHA-256** chuẩn FIPS 180-4.  
  2. Chỉ lưu hash digest trong bundle, không bao giờ lưu mật khẩu plaintext.  
  3. Chuẩn bị schema Supabase Auth với bảng `users` và RLS (Row Level Security) phía backend để chuyển giao phiên đăng nhập thực thụ.

---

## 4. Tình huống 4: Lỗi gõ tiếng Việt Telex bị gửi tin nhắn non trong ChatBot
- **Câu hỏi đã hỏi AI:**  
  *"Thêm tính năng nhấn phím Enter để gửi tin nhắn nhanh trong hộp thoại tư vấn ChatBotModal."*
- **Chỗ AI trả lời sai / chưa phù hợp:**  
  AI lập tức viết:
  ```tsx
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  }}
  ```
  AI mặc định giả định người dùng chỉ gõ ký tự Latin (tiếng Anh). Với người dùng Việt Nam sử dụng bộ gõ Telex/VNI (Unikey, EVKey hoặc bàn phím gõ tiếng Việt mặc định của Windows/macOS), phím Enter được dùng để xác nhận hoàn tất tổ hợp âm tiết/dấu (ví dụ gõ `truowngf` -> ấn Enter để chọn `trường`). Đoạn code của AI bắt sự kiện Enter ngay lập tức, khiến tin nhắn bị gửi non thành `"truowng"` khi người dùng chưa kịp gõ xong câu.
- **Cách con người phát hiện và sửa:**  
  Khi chạy thử nghiệm thực tế, sinh viên gõ câu hỏi tiếng Việt và liên tục bị gửi tin nhắn rác không đầy đủ.  
  **Khắc phục:**  
  Sinh viên tra cứu bộ quy chuẩn `modern-web-guidance` (`ime-safe-enter-submit`) và bổ sung rào chắn IME:
  ```tsx
  if (e.key === 'Enter' && !e.shiftKey) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    handleSendMessage();
  }
  ```
  Nhờ đó, trình duyệt chờ người dùng hoàn thành dấu tiếng Việt rồi mới gửi tin nhắn.

---

## 5. Tình huống 5: Khác biệt giữa Snapshot Push và Xóa file thật trên Git Tree
- **Câu hỏi đã hỏi AI:**  
  *"Tôi muốn dọn dẹp các file tài liệu và mã nguồn cũ không còn sử dụng trong thư mục dự án trước khi nộp đồ án."*
- **Chỗ AI trả lời sai / chưa phù hợp:**  
  AI hướng dẫn xóa các file thừa bằng lệnh PowerShell `Remove-Item` trên máy cục bộ, sau đó bảo sinh viên chạy `git commit -m "clean files"` và `git push`.  
  Khi sinh viên làm theo, các file cũ trên GitHub vẫn còn nguyên vẹn, do lệnh `git commit` không tự động đánh dấu các file đã bị xóa cục bộ nếu không dùng cờ `-A` hoặc `git rm`.
- **Cách con người phát hiện và sửa:**  
  Mở giao diện GitHub của repository `TranCongQuy/uni5hoanthanh`, sinh viên nhận thấy cây thư mục remote vẫn chứa các file rác mà máy cục bộ đã xóa từ lâu.  
  **Khắc phục:**  
  Con người kiểm tra bằng `git status`, nhận ra các file đang ở trạng thái `Changes not staged for commit: deleted: ...`.  
  Sử dụng quy trình chuẩn: `git add -A` để đồng bộ toàn bộ trạng thái xóa (deletion staging) vào index trước khi commit, hoặc dùng `git rm <path>` trực tiếp. Đồng thời sinh viên hiểu rõ cơ chế Git Tree: Git theo dõi nội dung dạng snapshot, mọi thay đổi xóa file đều phải được ghi nhận rõ ràng vào commit.
