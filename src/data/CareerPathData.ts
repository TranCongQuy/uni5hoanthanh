import type { HollandCode, PathInfo } from '../types';

export const CAREER_PATHS: Record<HollandCode, PathInfo> = {
  R: {
    hollandCode: 'R',
    title: 'Lộ trình Kỹ sư Kỹ thuật & Công nghệ Thực tế',
    subtitle: 'Khám phá thế giới vật lý, chế tạo máy móc, ô tô và hạ tầng công nghệ',
    coreSkills: [
      'Tư duy cơ học & không gian',
      'Kỹ năng sửa chữa phần cứng',
      'Lập trình nhúng cơ bản',
      'Thao tác dụng cụ an toàn',
    ],
    grade10Milestones: [
      'Tham gia CLB STEM, Robotics hoặc khoa học kỹ thuật tại trường THPT.',
      'Tập trung học tốt nền tảng Toán học và Vật lý lớp 10.',
      'Làm quen với các công cụ chế tác cơ bản hoặc phần mềm mô phỏng 3D.',
    ],
    grade11Milestones: [
      'Học lập trình cơ bản (C/C++ hoặc Python) và vi điều khiển Arduino.',
      'Tham gia kỳ thi Khoa học Kỹ thuật (KHKT) cấp tỉnh/thành phố.',
      'Xác định tổ hợp môn xét tuyển trọng điểm (A00: Toán - Lý - Hóa, A01: Toán - Lý - Anh).',
    ],
    grade12Milestones: [
      'Luyện đề thi tốt nghiệp THPT và kỳ thi Đánh giá tư duy (TSA - Bách Khoa).',
      'Nộp hồ sơ xét tuyển sớm bằng học bạ hoặc chứng chỉ KHKT.',
      'Đăng ký nguyện vọng vào các trường top đầu: Bách Khoa Hà Nội, Bách Khoa TP.HCM, ĐH Sư Phạm Kỹ Thuật.',
    ],
    recommendedCerts: ['Chứng chỉ Tin học MOS', 'Arduino / IoT Maker Certificate', 'IELTS 5.5 - 6.5'],
  },

  I: {
    hollandCode: 'I',
    title: 'Lộ trình Nhà Nghiên cứu & Khoa học Dữ liệu',
    subtitle: 'Giải mã các bí ẩn học thuật, phát triển thuật toán và chuyên sâu y sinh',
    coreSkills: [
      'Tư duy logic & toán rời rạc',
      'Phân tích dữ liệu & thống kê',
      'Kỹ năng nghiên cứu tài liệu quốc tế',
      'Tư duy phản biện',
    ],
    grade10Milestones: [
      'Xây dựng thói quen đọc tài liệu khoa học, bài báo tiếng Anh chuyên khảo.',
      'Học vững phương pháp chứng minh và tư duy giải tích toán học lớp 10.',
      'Tìm hiểu các lĩnh vực nghiên cứu hiện đại: Trí tuệ nhân tạo, Gen, Y sinh học.',
    ],
    grade11Milestones: [
      'Học ngôn ngữ lập trình Python và xử lý bảng dữ liệu Pandas/NumPy.',
      'Ôn luyện chứng chỉ tiếng Anh học thuật (IELTS / TOEFL).',
      'Tham gia đề tài nghiên cứu học sinh giỏi cấp trường hoặc hội thảo khoa học trẻ.',
    ],
    grade12Milestones: [
      'Luyện thi Đánh giá năng lực ĐHQG (Hà Nội / TP.HCM) và tốt nghiệp THPT khối A00/B00.',
      'Chuẩn bị bài luận cá nhân nếu xét tuyển vào các viện nghiên cứu tài năng.',
      'Đặt nguyện vọng: ĐH KHTN (ĐHQG), ĐH Y Hà Nội, ĐH Công Nghệ - ĐHQGHN.',
    ],
    recommendedCerts: ['Chứng chỉ IELTS 6.5 - 7.5', 'Python for Data Science (Coursera/edX)', 'SAT 1300+'],
  },

  A: {
    hollandCode: 'A',
    title: 'Lộ trình Nhà Thiết kế Sáng tạo & Đa Phương tiện',
    subtitle: 'Định hình phong cách thị giác, kiến trúc không gian và truyền thông nghệ thuật',
    coreSkills: [
      'Tư duy thẩm mỹ & bố cục màu sắc',
      'Thành thạo công cụ Adobe (Photoshop/Illustrator)',
      'Kể chuyện bằng hình ảnh (Visual Storytelling)',
      'Sáng tạo nội dung số',
    ],
    grade10Milestones: [
      'Luyện vẽ hình họa cơ bản, tĩnh vật chì hoặc màu nước cuối tuần.',
      'Tập quan sát đời sống, xây dựng kho cảm hứng thiết kế (Pinterest, Behance).',
      'Tham gia ban truyền thông / văn nghệ của trường THPT.',
    ],
    grade11Milestones: [
      'Đăng ký lớp luyện thi môn Năng khiếu Vẽ mỹ thuật (Khối V00, H00).',
      'Xây dựng hồ sơ năng lực cá nhân (Portfolio) tập hợp 10 - 15 tác phẩm xuất sắc nhất.',
      'Học phần mềm thiết kế đồ họa 2D/3D (Photoshop, Illustrator, Blender).',
    ],
    grade12Milestones: [
      'Tham dự kỳ thi môn Năng khiếu tại các trường Đại học chuyên ngành.',
      'Hoàn thiện bài thi Portfolio gửi xét tuyển thẳng vào các ngành sáng tạo.',
      'Nguyện vọng ưu tiên: ĐH Kiến Trúc Hà Nội, ĐH Mỹ Thuật TP.HCM, ĐH Kiến Trúc TP.HCM.',
    ],
    recommendedCerts: ['Chứng chỉ Adobe Certified Professional (ACP)', 'IELTS 6.0+', 'Portfolio nghệ thuật đạt chuẩn'],
  },

  S: {
    hollandCode: 'S',
    title: 'Lộ trình Nhà Giáo dục, Tâm lý & Hoạt động Xã hội',
    subtitle: 'Lan tỏa tri thức, kết nối con người và xây dựng cộng đồng gắn kết',
    coreSkills: [
      'Giao tiếp & lắng nghe tích cực',
      'Thuyết trình & truyền cảm hứng',
      'Thấu cảm & tư vấn tâm lý',
      'Quản lý sự kiện cộng đồng',
    ],
    grade10Milestones: [
      'Tích cực tham gia các hoạt động tình nguyện, thiện nguyện tại địa phương.',
      'Rèn luyện kỹ năng viết luận, biểu đạt cảm xúc và học tốt môn Ngữ văn, Lịch sử.',
      'Đảm nhận các vai trò kết nối tập thể: Lớp phó phong trào, cán bộ Đoàn.',
    ],
    grade11Milestones: [
      'Tham gia dẫn chương trình (MC), điều phối các talkshow học đường.',
      'Tìm hiểu các chuyên đề về sức khỏe tinh thần, tâm lý lứa tuổi học sinh.',
      'Ôn luyện khối D01 (Toán - Văn - Anh) hoặc C00 (Văn - Sử - Địa).',
    ],
    grade12Milestones: [
      'Tập trung ôn thi điểm cao các môn xã hội trong kỳ thi tốt nghiệp THPT.',
      'Tích lũy hồ sơ minh chứng tham gia hoạt động xã hội để xét tuyển ưu tiên.',
      'Mục tiêu trường: ĐH Sư Phạm Hà Nội, ĐH KHXH&NV, Học viện Ngoại Giao, ĐH Sư Phạm TP.HCM.',
    ],
    recommendedCerts: ['IELTS 6.5+', 'Chứng nhận hoạt động tình nguyện quốc tế/quốc gia', 'Chứng chỉ MC Học đường'],
  },

  E: {
    hollandCode: 'E',
    title: 'Lộ trình Nhà Lãnh đạo Doanh nghiệp & Khởi nghiệp',
    subtitle: 'Chinh phục thương trường, dẫn dắt đội ngũ và phát triển thương hiệu',
    coreSkills: [
      'Tư duy kinh doanh & thị trường',
      'Kỹ năng đàm phán & thuyết phục',
      'Lãnh đạo & ủy quyền',
      'Tư duy tài chính cá nhân',
    ],
    grade10Milestones: [
      'Tham gia các cuộc thi Khởi nghiệp trẻ, ý tưởng sáng tạo học sinh THPT.',
      'Đọc sách về tư duy kinh tế, marketing căn bản và câu chuyện khởi nghiệp.',
      'Nâng cao năng lực tiếng Anh giao tiếp và từ vựng kinh doanh.',
    ],
    grade11Milestones: [
      'Đảm nhận vị trí Trưởng ban đối ngoại / Chủ nhiệm CLB học sinh.',
      'Tìm hiểu thị trường thương mại điện tử, cách vận hành kinh doanh nhỏ.',
      'Tập trung ôn tập các tổ hợp môn: A01 (Toán - Lý - Anh), D01 (Toán - Văn - Anh), D07.',
    ],
    grade12Milestones: [
      'Luyện thi Đánh giá năng lực và tối ưu điểm thi THPT quốc gia trên 26+ điểm.',
      'Nộp hồ sơ xét tuyển kết hợp chứng chỉ IELTS quốc tế vào các chương trình tiên tiến.',
      'Đích đến mục tiêu: ĐH Ngoại Thương (FTU), ĐH Kinh Tế Quốc Dân (NEU), ĐH Kinh Tế TP.HCM (UEH).',
    ],
    recommendedCerts: ['IELTS 7.0+', 'SAT 1350+', 'Giải thưởng Khởi nghiệp trẻ / Học sinh giỏi cấp tỉnh'],
  },

  C: {
    hollandCode: 'C',
    title: 'Lộ trình Chuyên gia Tài chính, Kế toán & Quản trị Dữ liệu',
    subtitle: 'Quản lý dòng tiền, chuẩn hóa hệ thống quy trình và kiểm soát rủi ro',
    coreSkills: [
      'Tính toán chính xác & cẩn trọng',
      'Xử lý bảng tính Excel nâng cao',
      'Phân tích tài chính & báo cáo',
      'Tuân thủ quy chuẩn pháp lý',
    ],
    grade10Milestones: [
      'Học thành thạo tin học văn phòng, phím tắt Excel và các hàm tính toán.',
      'Hình thành thói quen ghi chép tài chính cá nhân ngăn nắp, chính xác.',
      'Tập trung học tốt môn Toán học đại số và xác suất thống kê lớp 10.',
    ],
    grade11Milestones: [
      'Học chứng chỉ Tin học văn phòng quốc tế (MOS Excel / Word / PowerPoint).',
      'Tìm hiểu các chứng chỉ nghề nghiệp tài chính quốc tế khởi đầu (ACCA Foundation, ICAEW).',
      'Xác định tổ hợp môn xét tuyển: A00 (Toán - Lý - Hóa) hoặc A01 (Toán - Lý - Anh).',
    ],
    grade12Milestones: [
      'Luyện các dạng đề thi trắc nghiệm toán học đòi hỏi tốc độ và độ chính xác tuyệt đối.',
      'Đăng ký xét tuyển vào các chương trình kiểm toán quốc tế ACCA / CPA định hướng.',
      'Chọn trường mục tiêu: Học viện Tài chính (AOF), ĐH Kinh Tế Quốc Dân (NEU), ĐH Ngân Hàng TP.HCM, ĐH UEH.',
    ],
    recommendedCerts: ['Chứng chỉ MOS Master', 'Chứng chỉ ACCA Foundations in Accountancy', 'IELTS 6.5+'],
  },
};

export function getCareerPath(code?: string): PathInfo {
  if (!code) return CAREER_PATHS.E;
  const c = code.toUpperCase().trim() as HollandCode;
  return CAREER_PATHS[c] || CAREER_PATHS.E;
}

