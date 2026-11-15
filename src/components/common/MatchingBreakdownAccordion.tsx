import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import type { MatchResult } from '../../types';
import { explainMatchResult } from '../../services/MatchingService';

export interface MatchingBreakdownAccordionProps {
  item: MatchResult;
  userScore: number;
  maxBudget?: number;
  className?: string;
}

export const MatchingBreakdownAccordion: React.FC<MatchingBreakdownAccordionProps> = ({
  item,
  userScore,
  maxBudget,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const exp = explainMatchResult(item, userScore, maxBudget);

  return (
    <div className={className} style={{ width: '100%', marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          color: 'var(--up-student-primary, #4F46E5)',
          fontSize: '11.5px',
          fontWeight: 700,
          cursor: 'pointer',
          padding: '2px 4px',
          borderRadius: '6px',
        }}
      >
        <Sparkles size={12} />
        <span>Vì sao {item.matchingPercent}%?</span>
        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {isOpen && (
        <div
          className="tabular-nums"
          style={{
            marginTop: '6px',
            padding: '10px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--up-color-slate-50, #F8FAFC)',
            border: '1px solid var(--up-color-slate-200, #E2E8F0)',
            fontSize: '11.5px',
            lineHeight: 1.5,
            color: 'var(--up-color-slate-700, #334155)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: 'var(--up-color-slate-500, #64748B)' }}>Ngành tham chiếu:</span>
            <strong style={{ color: 'var(--up-color-slate-900, #0F172A)' }}>
              {exp.matchedMajor} ({exp.majorCutoff.toFixed(1)}đ)
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: 'var(--up-color-slate-500, #64748B)' }}>Chênh lệch điểm:</span>
            <strong style={{ color: exp.diffScore >= 0 ? '#059669' : '#D97706' }}>
              Delta {exp.diffScoreLabel} ({exp.userScore.toFixed(1)}đ − {exp.majorCutoff.toFixed(1)}đ)
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: 'var(--up-color-slate-500, #64748B)' }}>Đóng góp từ điểm số:</span>
            <strong>Cơ bản {exp.basePercent}% theo bảng bậc</strong>
          </div>

          {exp.hollandBonus > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#047857' }}>
              <CheckCircle2 size={12} />
              <span>{exp.hollandExplanation}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: exp.isBudgetMatched ? '#047857' : '#B45309' }}>
            {exp.isBudgetMatched ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            <span>{exp.budgetExplanation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
