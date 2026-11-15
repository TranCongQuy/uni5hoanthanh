import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import type { ApplicationRecord } from '../../types';

export interface ApplicationTimelineProps {
  application: ApplicationRecord;
  className?: string;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  application,
  className = '',
}) => {
  const { status, submittedAt } = application;

  const isAdmitted = status === 'Đã trúng tuyển';
  const isCancelled = status === 'Đã hủy' || status === 'Đã bị hủy';
  const isMissing = status === 'Thiếu hồ sơ';
  const isValid = status === 'Hồ sơ hợp lệ';
  const isPending = status === 'Đang xét duyệt';

  const steps = [
    {
      title: 'Nộp hồ sơ trực tuyến',
      time: submittedAt || 'Đã ghi nhận',
      state: 'done' as const,
      desc: 'Hồ sơ đã được mã hóa và chuyển tới Hội đồng Tuyển sinh.',
    },
    {
      title: 'Thẩm định hồ sơ & đối soát',
      time: isPending ? 'Đang thực hiện' : isMissing ? 'Cần bổ sung' : 'Đã thẩm định',
      state: isPending
        ? ('current' as const)
        : isMissing
        ? ('warning' as const)
        : isCancelled
        ? ('neutral' as const)
        : ('done' as const),
      desc: isMissing
        ? 'Hồ sơ còn thiếu minh chứng học bạ hoặc CCCD.'
        : isValid || isAdmitted
        ? 'Dữ liệu điểm và thông tin thí sinh đã được xác thực hợp lệ.'
        : isCancelled
        ? 'Hồ sơ đã được rút theo yêu cầu của thí sinh.'
        : 'Ban tuyển sinh đang đối soát học bạ và điểm thi tốt nghiệp.',
    },
    {
      title: 'Xét trúng tuyển & Kết quả',
      time: isAdmitted ? 'Đã công bố' : isCancelled ? 'Đã dừng' : 'Dự kiến đợt 1',
      state: isAdmitted
        ? ('success' as const)
        : isCancelled
        ? ('neutral' as const)
        : ('upcoming' as const),
      desc: isAdmitted
        ? 'Chúc mừng! Bạn đã đủ điều kiện trúng tuyển sớm.'
        : isCancelled
        ? 'Nguyện vọng đã kết thúc hiệu lực.'
        : 'Chờ xét duyệt hội đồng và gửi giấy báo trúng tuyển.',
    },
  ];

  return (
    <div className={`flex flex-col gap-3 py-1 ${className}`}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        let iconNode = <CheckCircle2 size={16} className="text-emerald-600" />;
        let circleBg = 'bg-emerald-50 border-emerald-300';

        if (step.state === 'current') {
          iconNode = <Clock size={15} className="text-amber-600" />;
          circleBg = 'bg-amber-50 border-amber-300';
        } else if (step.state === 'warning') {
          iconNode = <AlertCircle size={15} className="text-orange-600" />;
          circleBg = 'bg-orange-50 border-orange-300';
        } else if (step.state === 'success') {
          iconNode = <CheckCircle2 size={16} className="text-emerald-600" />;
          circleBg = 'bg-emerald-50 border-emerald-300';
        } else if (step.state === 'upcoming' || step.state === 'neutral') {
          iconNode = <FileText size={14} className="text-slate-400" />;
          circleBg = 'bg-slate-100 border-slate-200';
        }

        return (
          <div key={idx} className="flex items-start gap-3 relative">
            {/* Connected Vertical Line */}
            {!isLast && (
              <div
                className="absolute left-[13px] top-[26px] w-[2px] bottom-[-12px]"
                style={{
                  backgroundColor:
                    step.state === 'done' || step.state === 'success'
                      ? 'var(--up-color-success-border, #A7F3D0)'
                      : 'var(--up-color-slate-200, #E2E8F0)',
                }}
              />
            )}

            {/* Step Icon */}
            <div
              className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 z-10 ${circleBg}`}
            >
              {iconNode}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {step.title}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                  {step.time}
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
