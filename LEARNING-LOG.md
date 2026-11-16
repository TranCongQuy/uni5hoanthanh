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

---

## 6. Tình huống 6: Lỗi `margin-top: auto` trong flexbox cuộn làm che khuất đầu trang Sidebar
- **Câu hỏi đã hỏi AI:**  
  *"Hãy sửa thanh điều hướng ở cổng Admin và PXU để nó cố định bên trái màn hình, nếu dài thì lướt lên lướt xuống chứ không bị che khuất."*
- **Chỗ AI trả lời sai / chưa phù hợp:**  
  AI triển khai giải pháp ban đầu bằng cách đặt `<aside>` có `position: fixed`, `height: 100vh`, `display: flex`, `flexDirection: column`, `overflowY: auto`. Để đẩy khối thông tin chân trang xuống đáy, AI dùng thuộc tính CSS `marginTop: 'auto'` trên thẻ con chân trang.  
  Hậu quả tai hại: Trong đặc tả CSS Flexbox, khi một flex container dạng cột có `overflow-y: auto` và phần tử con có `margin-top: auto`, nếu chiều cao màn hình nhỏ hơn chiều cao nội dung, flexbox sẽ căn chỉnh và đẩy các phần tử đầu trang vào **tọa độ cuộn âm ($y < 0$)**. Trình duyệt coi đây là vùng đã vượt quá mép trên và không cho phép cuộn ngược lên, khiến logo và tiêu đề cổng biến mất hoàn toàn.
- **Cách con người phát hiện và sửa:**  
  Khi kiểm thử trên laptop màn hình 1440x700px, toàn bộ logo UniPath Admin và ĐH Phú Xuân bị biến mất khỏi màn hình, trong khi chân trang lại nằm đè lên trên.  
  **Khắc phục:**  
  Con người phát hiện nguyên lý xung đột giữa `margin-top: auto` và `overflow-y: auto`, yêu cầu bãi bỏ hoàn toàn cách làm này và chuyển sang **Kiến trúc 3 tầng (3-Tier Architecture)**:
  1. Khối đầu trang thương hiệu cố định (`flexShrink: 0`) ở đỉnh (`top: 0`).
  2. Khối danh mục điều hướng ở giữa cuộn độc lập (`flex: 1; minHeight: 0; overflowY: 'auto'`) với class `.up-sidebar-scroll`.
  3. Khối chân trang cố định (`flexShrink: 0`) ở đáy màn hình.  
  Nhờ đó, logo luôn luôn hiện rõ và danh mục ở giữa lướt lên lướt xuống mượt mà không bao giờ bị khuất.

---

## 7. Tình huống 7: Xung đột khóa cuộn giữa Onboarding Tour và các Cổng Quản trị
- **Câu hỏi đã hỏi AI:**  
  *"Tại sao khi đăng nhập vào Cổng Admin hoặc PXU, trang web đôi khi bị đóng băng không cuộn được?"*
- **Chỗ AI trả lời sai / chưa phù hợp:**  
  AI phỏng đoán rằng do thuộc tính `overflow: hidden` của layout Admin bị lỗi, và đề xuất xóa bỏ hoàn toàn component `OnboardingModal` khỏi dự án.
- **Cách con người phát hiện và sửa:**  
  Sinh viên kiểm tra mã nguồn tại `App.tsx` và phát hiện nguyên nhân thực sự: Logic khóa cuộn của Onboarding Tour (dành cho thí sinh) đã gán `document.body.style.overflow = 'hidden'` khi tour chưa hoàn tất. Khi người dùng dùng tính năng chuyển nhanh sang Admin/PXU, cờ khóa cuộn này không được dọn dẹp (cleanup), dẫn đến việc `body` bị khóa cứng cả ở cổng quản trị.  
  **Khắc phục:**  
  Con người từ chối xóa Onboarding Tour. Thay vào đó, bổ sung hook cleanup thông minh trong `App.tsx`: khi phát hiện `user.role === 'admin' || user.role === 'university_pxu'`, hệ thống tự động giải phóng khóa cuộn (`document.body.style.overflow = 'unset'`). Cả tour hướng dẫn thí sinh lẫn cổng quản trị đều hoạt động hoàn hảo song song.

---

## 8. Tình huống 8: Mâu thuẫn pha sự kiện EduFair (Đếm ngược vs Trực tiếp)
- **Câu hỏi đã hỏi AI:**  
  *"Kiểm tra tính logic của trang Ngày hội Tuyển sinh EduFair: tại sao vừa có đồng hồ đếm ngược Còn 34 ngày vừa có nhãn TRỰC TIẾP và người xem mô phỏng?"*
- **Chỗ AI trả lời sai / chưa phù hợp:**  
  AI ban đầu chỉ sửa component `LiveTab.tsx` (dành cho Mobile), nhưng bỏ quên khối sân khấu EduFair hoàn toàn riêng biệt trong `DesktopView.tsx`. Kết quả là trên Mobile thì đúng, nhưng trên màn hình Desktop 1440px vẫn hiển thị badge "TRỰC TIẾP", "2,480 người xem" dù đồng hồ ghi "Còn 34 ngày".
- **Cách con người phát hiện và sửa:**  
  Sinh viên thực hiện kiểm thử chéo giữa giao diện Mobile và Desktop, phát hiện sự thiếu đồng nhất giữa hai giao diện.  
  **Khắc phục:**  
  1. Tạo module dùng chung `src/utils/edufair.ts` với hàm `getEventPhase()` và `computeCountdownParts()` lấy mốc chuẩn EduFair Finale 20/12/2026 08:00 GMT+7.  
  2. Bắt buộc cả `LiveTab.tsx` (Mobile) và `DesktopView.tsx` (Desktop) đều dùng chung hàm tính toán này: khi ở pha `upcoming`, chuyển sân khấu thành panel "Sắp diễn ra", đổi nhãn điều hướng thành "EduFair" (bỏ chữ LIVE), đổi khung bình luận thành "Khung trao đổi câu hỏi".  
  3. Viết bộ unit test `src/__tests__/edufair.test.ts` để kiểm chứng độc lập logic chuyển pha.
