import { z } from 'zod';

/**
 * Biểu thức chính quy kiểm tra định dạng số điện thoại di động Việt Nam:
 * 10 chữ số, bắt đầu bằng số 0, theo sau bởi các đầu số hợp chuẩn: 03, 05, 07, 08, 09.
 */
export const VIETNAM_PHONE_REGEX = /^(0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

/**
 * Schema xác thực form nộp hồ sơ xét tuyển trực tuyến (ApplyDemoModal)
 */
export const applicationSubmissionSchema = z.object({
  candidateName: z
    .string()
    .trim()
    .min(2, { message: 'Vui lòng nhập họ và tên thí sinh hợp lệ (tối thiểu 2 ký tự).' }),
  phone: z
    .string()
    .trim()
    .regex(VIETNAM_PHONE_REGEX, {
      message: 'Số điện thoại không hợp lệ (cần đúng 10 chữ số, bắt đầu bằng đầu số di động VN 03/05/07/08/09).',
    }),
  score: z
    .number({
      message: 'Điểm xét tuyển phải là số hợp lệ.',
    })
    .min(0, { message: 'Điểm xét tuyển không được nhỏ hơn 0 điểm.' })
    .max(30, { message: 'Điểm xét tuyển không được vượt quá 30 điểm.' }),
});

export type ApplicationSubmissionInput = z.infer<typeof applicationSubmissionSchema>;

/**
 * Schema xác thực form đăng nhập (AuthModal / AuthScreen)
 */
export const authLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng nhập địa chỉ email.' })
    .email({ message: 'Địa chỉ email không đúng định dạng.' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' }),
});

export type AuthLoginInput = z.infer<typeof authLoginSchema>;

/**
 * Schema xác thực form đăng ký tài khoản mới (AuthModal / AuthScreen)
 */
export const authRegisterSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Vui lòng nhập địa chỉ email.' })
      .email({ message: 'Địa chỉ email không đúng định dạng.' }),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Vui lòng xác nhận mật khẩu.' }),
    agreedTerms: z.literal(true, {
      message: 'Vui lòng đồng ý với Điều khoản sử dụng!',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp!',
    path: ['confirmPassword'],
  });

export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;
