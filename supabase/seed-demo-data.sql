-- ============================================================================
-- UNIPATH 2.0 — SEED DATA CHO 4 BẢNG DỮ LIỆU DEMO
-- Nhóm UP5 — Trường Đại học Phú Xuân (PXU)
--
-- Kỳ vọng sau khi chạy:
--   1. public.profiles:        6 tài khoản (3 tài khoản demo hệ thống + 3 thí sinh nộp hồ sơ)
--   2. public.applications:    8 hồ sơ (đủ 6 trạng thái nghiệp vụ FSM)
--   3. public.bookings:        3 lịch hẹn tư vấn tuyển sinh 1-1
--   4. public.processing_logs: 4 nhật ký thẩm định & xử lý hồ sơ
-- ============================================================================

-- Tùy chọn an toàn: nếu bảng profiles có FK trỏ tới auth.users mà chưa bật Supabase Auth,
-- lệnh dưới gỡ bỏ ràng buộc này để nạp dữ liệu demo không bị gián đoạn.
alter table public.profiles drop constraint if exists profiles_id_fkey;

-- ----------------------------------------------------------------------------
-- 1. BẢNG PROFILES (6 bản ghi)
-- ----------------------------------------------------------------------------
insert into public.profiles (
  id, email, full_name, role, phone, school, province, expected_score, holland_primary, is_premium, created_at
)
values
  (
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'quy@unipath.vn',
    'Trần Công Quý',
    'student',
    '0912 345 678',
    'THPT Chuyên Quốc Học Huế',
    'Thừa Thiên Huế',
    24.50,
    'E',
    false,
    '2026-10-15T08:00:00+07:00'
  ),
  (
    'a0000000-0000-0000-0000-000000000002'::uuid,
    'admin@unipath.vn',
    'Quản trị viên Hệ thống',
    'admin',
    '0905 000 001',
    'Ban Quản trị Tuyển sinh',
    'Thừa Thiên Huế',
    25.00,
    'I',
    true,
    '2026-10-01T08:00:00+07:00'
  ),
  (
    'a0000000-0000-0000-0000-000000000003'::uuid,
    'tuyensinh@pxu.edu.vn',
    'Ban Tuyển sinh ĐH Phú Xuân',
    'university_pxu',
    '0234 7306 888',
    'Trường Đại học Phú Xuân',
    'Thừa Thiên Huế',
    24.50,
    'S',
    true,
    '2026-10-01T08:00:00+07:00'
  ),
  (
    'a0000000-0000-0000-0000-000000000004'::uuid,
    'an.nguyen@thpt.edu.vn',
    'Nguyễn Văn An',
    'student',
    '0988 776 655',
    'THPT Nguyễn Huệ',
    'Thừa Thiên Huế',
    23.50,
    'E',
    false,
    '2026-11-01T09:00:00+07:00'
  ),
  (
    'a0000000-0000-0000-0000-000000000005'::uuid,
    'thaovy.le@gmail.com',
    'Lê Thị Thảo Vy',
    'student',
    '0935 123 789',
    'THPT Hai Bà Trưng',
    'Thừa Thiên Huế',
    25.00,
    'A',
    false,
    '2026-11-02T10:00:00+07:00'
  ),
  (
    'a0000000-0000-0000-0000-000000000006'::uuid,
    'minhkhoi.tran@thpt.edu.vn',
    'Trần Minh Khôi',
    'student',
    '0905 678 234',
    'THPT Phan Đăng Lưu',
    'Thừa Thiên Huế',
    25.80,
    'S',
    false,
    '2026-10-28T11:00:00+07:00'
  )
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  phone = excluded.phone,
  school = excluded.school,
  province = excluded.province,
  expected_score = excluded.expected_score,
  holland_primary = excluded.holland_primary,
  is_premium = excluded.is_premium;

-- ----------------------------------------------------------------------------
-- 2. BẢNG APPLICATIONS (8 bản ghi mẫu khớp AppContext)
-- ----------------------------------------------------------------------------
insert into public.applications (
  id, code, uni_id, uni_code, uni_name, major, candidate_name, phone, email,
  score, status, notes, cancel_reason, submitted_at_iso, updated_at
)
values
  (
    'app-1',
    'HS-2026-PXU01',
    11,
    'PXU',
    'Đại học Phú Xuân',
    'Công nghệ Thông tin',
    'Trần Công Quý',
    '0912 345 678',
    'quy@unipath.vn',
    24.50,
    'Đang xét duyệt',
    'Đăng ký xét tuyển sớm đợt 1 bằng kết quả học bạ THPT và chứng chỉ tin học quốc tế. Đăng ký xét học bổng OJT doanh nghiệp.',
    null,
    '2026-10-24T09:30:00+07:00',
    '2026-10-24T09:30:00+07:00'
  ),
  (
    'app-2',
    'HS-2026-BKA02',
    1,
    'BKA',
    'Đại học Bách Khoa Hà Nội',
    'Khoa học Máy tính',
    'Trần Công Quý',
    '0912 345 678',
    'quy@unipath.vn',
    28.50,
    'Hồ sơ hợp lệ',
    'Đã hoàn tất đối chiếu CCCD, Học bạ 5 học kỳ và Phiếu điểm kỳ thi Đánh giá tư duy.',
    null,
    '2026-10-22T15:45:00+07:00',
    '2026-10-23T08:15:00+07:00'
  ),
  (
    'app-3',
    'HS-2026-FTU03',
    2,
    'FTU',
    'Đại học Ngoại Thương (Cơ sở Hà Nội)',
    'Kinh tế Quốc tế',
    'Trần Công Quý',
    '0912 345 678',
    'quy@unipath.vn',
    28.20,
    'Thiếu hồ sơ',
    'Cần bổ sung bản scan học bạ học kỳ 1 lớp 12 có dấu mộc đỏ và chứng chỉ ngoại ngữ quốc tế trước ngày 25/11.',
    null,
    '2026-10-20T11:15:00+07:00',
    '2026-10-20T11:15:00+07:00'
  ),
  (
    'app-4',
    'HS-2026-NEU04',
    3,
    'NEU',
    'Đại học Kinh Tế Quốc Dân',
    'Marketing',
    'Trần Công Quý',
    '0912 345 678',
    'quy@unipath.vn',
    27.50,
    'Đã hủy',
    'Thí sinh chủ động rút hồ sơ xét tuyển để điều chỉnh thứ tự nguyện vọng ưu tiên.',
    'Thí sinh chủ động rút hồ sơ',
    '2026-10-18T14:20:00+07:00',
    '2026-10-19T10:00:00+07:00'
  ),
  (
    'app-5',
    'HS-2026-HMU05',
    5,
    'HMU',
    'Đại học Y Hà Nội',
    'Kỹ thuật Xét nghiệm Y học',
    'Trần Công Quý',
    '0912 345 678',
    'quy@unipath.vn',
    22.00,
    'Đã bị hủy',
    'Hội đồng tuyển sinh từ chối hồ sơ do tổng điểm tổ hợp chưa đạt ngưỡng đảm bảo chất lượng đầu vào khối sức khỏe.',
    'Không đạt ngưỡng điểm sàn nhận hồ sơ khối ngành Sức khỏe',
    '2026-10-15T10:00:00+07:00',
    '2026-10-16T09:00:00+07:00'
  ),
  (
    'app-6',
    'HS-2026-PXU06',
    11,
    'PXU',
    'Đại học Phú Xuân',
    'Quản trị Kinh doanh',
    'Nguyễn Văn An',
    '0988 776 655',
    'an.nguyen@thpt.edu.vn',
    23.50,
    'Đang xét duyệt',
    'Đăng ký xét tuyển học bạ THPT 3 học kỳ (ĐTB 8.2) kèm nguyện vọng học bổng OJT doanh nghiệp.',
    null,
    '2026-11-02T14:10:00+07:00',
    '2026-11-02T14:10:00+07:00'
  ),
  (
    'app-7',
    'HS-2026-PXU07',
    11,
    'PXU',
    'Đại học Phú Xuân',
    'Thiết kế Đồ họa',
    'Lê Thị Thảo Vy',
    '0935 123 789',
    'thaovy.le@gmail.com',
    25.00,
    'Thiếu hồ sơ',
    'Cần nộp bổ sung bản sao công chứng CCCD và Portfolio sản phẩm sáng tạo cá nhân trước ngày 25/11.',
    null,
    '2026-11-04T16:30:00+07:00',
    '2026-11-04T17:00:00+07:00'
  ),
  (
    'app-8',
    'HS-2026-PXU08',
    11,
    'PXU',
    'Đại học Phú Xuân',
    'Ngôn ngữ Anh',
    'Trần Minh Khôi',
    '0905 678 234',
    'minhkhoi.tran@thpt.edu.vn',
    25.80,
    'Đã trúng tuyển',
    'Đủ điều kiện trúng tuyển sớm đợt 1 và đạt học bổng Tài năng Trẻ PXU 30% học phí toàn khóa.',
    null,
    '2026-11-01T08:45:00+07:00',
    '2026-11-01T10:30:00+07:00'
  )
on conflict (id) do update set
  code = excluded.code,
  uni_id = excluded.uni_id,
  uni_code = excluded.uni_code,
  uni_name = excluded.uni_name,
  major = excluded.major,
  candidate_name = excluded.candidate_name,
  phone = excluded.phone,
  email = excluded.email,
  score = excluded.score,
  status = excluded.status,
  notes = excluded.notes,
  cancel_reason = excluded.cancel_reason,
  submitted_at_iso = excluded.submitted_at_iso,
  updated_at = excluded.updated_at;

-- ----------------------------------------------------------------------------
-- 3. BẢNG BOOKINGS (3 bản ghi tư vấn 1-1 mẫu)
-- ----------------------------------------------------------------------------
insert into public.bookings (
  id, name, email, phone, uni_code, uni_name, major,
  scheduled_date, time_slot, channel, status, notes, created_at
)
values
  (
    'bk-1',
    'Trần Công Quý',
    'quy@unipath.vn',
    '0912 345 678',
    'PXU',
    'Đại học Phú Xuân',
    'Công nghệ Thông tin',
    current_date + interval '2 day',
    '14:30 - 15:00',
    'Google Meet 1-1',
    'pending',
    'Muốn tìm hiểu kỹ hơn về lộ trình thực tập OJT từ năm nhất và học bổng doanh nghiệp tại Huế.',
    '2026-11-10T14:00:00+07:00'
  ),
  (
    'bk-2',
    'Nguyễn Văn An',
    'an.nguyen@thpt.edu.vn',
    '0988 776 655',
    'PXU',
    'Đại học Phú Xuân',
    'Quản trị Kinh doanh',
    current_date + interval '3 day',
    '09:00 - 09:30',
    'Gọi điện / Zalo',
    'pending',
    'Cần tư vấn phương thức xét tuyển học bạ 3 học kỳ và thông tin ký túc xá sinh viên.',
    '2026-11-11T09:30:00+07:00'
  ),
  (
    'bk-3',
    'Lê Hoàng Nam',
    'hoangnam@thpt.edu.vn',
    '0905 246 810',
    'DUT',
    'Đại học Bách Khoa - ĐH Đà Nẵng',
    'Kỹ thuật Ô tô',
    current_date + interval '4 day',
    '16:00 - 16:30',
    'Google Meet 1-1',
    'pending',
    'Hỏi về chỉ tiêu xét điểm thi ĐGNL và chương trình kỹ sư chất lượng cao.',
    '2026-11-12T16:00:00+07:00'
  )
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  phone = excluded.phone,
  uni_code = excluded.uni_code,
  uni_name = excluded.uni_name,
  major = excluded.major,
  scheduled_date = excluded.scheduled_date,
  time_slot = excluded.time_slot,
  channel = excluded.channel,
  status = excluded.status,
  notes = excluded.notes;

-- ----------------------------------------------------------------------------
-- 4. BẢNG PROCESSING_LOGS (4 bản ghi nhật ký thẩm định)
-- ----------------------------------------------------------------------------
insert into public.processing_logs (
  id, actor, role, action, target_code, uni_code, detail, created_at
)
values
  (
    'log-init-1',
    'Ban Tuyển sinh PXU',
    'university_pxu',
    'Phê duyệt trúng tuyển',
    'HS-2026-PXU08',
    'PXU',
    'Xét duyệt trúng tuyển sớm diện học bạ 3 học kỳ (25.8 điểm) và cấp học bổng Tài năng Trẻ 30%.',
    '2026-11-01T10:30:00+07:00'
  ),
  (
    'log-init-2',
    'Admin Hệ Thống',
    'admin',
    'Xác thực hồ sơ',
    'HS-2026-BKA02',
    'BKA',
    'Đối chiếu thành công kết quả thi Đánh giá tư duy và học bạ THPT.',
    '2026-10-23T08:15:00+07:00'
  ),
  (
    'log-init-3',
    'Ban Tuyển sinh PXU',
    'university_pxu',
    'Yêu cầu bổ sung',
    'HS-2026-PXU07',
    'PXU',
    'Yêu cầu thí sinh nộp bổ sung bản sao công chứng CCCD và Portfolio cá nhân trước ngày 25/11.',
    '2026-11-04T17:00:00+07:00'
  ),
  (
    'log-init-4',
    'Hội đồng Tuyển sinh HMU',
    'admin',
    'Từ chối hồ sơ',
    'HS-2026-HMU05',
    'HMU',
    'Hồ sơ chưa đạt ngưỡng điểm sàn nhận hồ sơ khối ngành Sức khỏe (điểm đạt 22.0 / sàn 23.0).',
    '2026-10-16T09:00:00+07:00'
  )
on conflict (id) do update set
  actor = excluded.actor,
  role = excluded.role,
  action = excluded.action,
  target_code = excluded.target_code,
  uni_code = excluded.uni_code,
  detail = excluded.detail;

-- ============================================================================
-- KIỂM CHỨNG ĐỐI CHIẾU SỐ LƯỢNG SAU KHI SEED
-- ============================================================================
select count(*) as total_profiles from public.profiles;         -- Kỳ vọng: 6
select count(*) as total_applications from public.applications; -- Kỳ vọng: 8
select count(*) as total_bookings from public.bookings;         -- Kỳ vọng: 3
select count(*) as total_logs from public.processing_logs;      -- Kỳ vọng: 4
