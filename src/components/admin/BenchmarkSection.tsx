import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Building2,
  Sparkles,
  Download,
} from 'lucide-react';
import type { ApplicationRecord, University } from '../../types';
import { getUniversityBenchmarkTable } from '../../services/AdminAnalyticsService';
import { UniversityAvatar } from '../common/UI';

interface BenchmarkSectionProps {
  universities: University[];
  applications: ApplicationRecord[];
  isDesktop: boolean;
}

type SortField =
  | 'code'
  | 'name'
  | 'region'
  | 'cutoffMin'
  | 'tuitionMin'
  | 'applicationCount'
  | 'approvalRate'
  | 'avgScore'
  | 'qualifiedRate';

export const BenchmarkSection: React.FC<BenchmarkSectionProps> = ({
  universities,
  applications,
}) => {
  const [regionFilter, setRegionFilter] = useState<'All' | 'Bắc' | 'Trung' | 'Nam'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('applicationCount');
  const [sortAsc, setSortAsc] = useState(false);

  const rawRows = useMemo(
    () => getUniversityBenchmarkTable(universities, applications),
    [universities, applications]
  );

  const filteredAndSortedRows = useMemo(() => {
    let list = rawRows;

    // Filter by Region
    if (regionFilter !== 'All') {
      list = list.filter((r) => r.region === regionFilter);
    }

    // Filter by Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      const numA = (valA as number) || 0;
      const numB = (valB as number) || 0;
      return sortAsc ? numA - numB : numB - numA;
    });
  }, [rawRows, regionFilter, searchTerm, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCsv = () => {
    const headers =
      'Mã trường,Tên trường,Miền,Điểm chuẩn Min,Điểm chuẩn Max,Học phí Min (tr),Học phí Max (tr),Số hồ sơ,Số trúng tuyển,Tỷ lệ duyệt (%),Điểm TB thí sinh,% Đạt chuẩn ngành,Ngành nộp nhiều nhất';
    const lines = filteredAndSortedRows.map((r) =>
      [
        r.code,
        `"${r.name.replace(/"/g, '""')}"`,
        r.region,
        r.cutoffMin,
        r.cutoffMax,
        r.tuitionMin,
        r.tuitionMax,
        r.applicationCount,
        r.approvedCount,
        r.approvalRate,
        r.avgScore !== null ? r.avgScore.toFixed(1) : '—',
        r.qualifiedRate !== null ? `${r.qualifiedRate}%` : '—',
        r.topMajor ? `"${r.topMajor.replace(/"/g, '""')}"` : '—',
      ].join(',')
    );
    const blob = new Blob(['\uFEFF' + headers + '\n' + lines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UniPath_Benchmark_30_Truong_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #050B14 0%, #0B132B 50%, #1C2541 100%)',
          borderRadius: '22px',
          padding: '24px 28px',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '3px 10px',
              borderRadius: '999px',
              color: '#38BDF8',
              fontSize: '11px',
              fontWeight: 800,
              marginBottom: '8px',
            }}
          >
            <Sparkles size={12} />
            <span>HỆ THỐNG ĐỐI SOÁT &amp; BENCHMARK ĐỐI TÁC</span>
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 900 }}>
            Bảng Đối Soát 30 Trường Đại Học Đối Tác
          </h2>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>
            Toàn bộ 30 cơ sở đào tạo chuẩn hóa, phân vùng 3 miền Bắc – Trung – Nam
          </div>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="up-btn-shine"
          style={{
            height: '40px',
            padding: '0 16px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Download size={15} />
          <span>Xuất Báo Cáo CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '14px 18px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã hoặc tên trường (BKA, PXU, FTU...)"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '13.5px',
              color: '#0F172A',
            }}
          />
        </div>

        {/* Region Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(['All', 'Bắc', 'Trung', 'Nam'] as const).map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setRegionFilter(reg)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: regionFilter === reg ? '1px solid #2563EB' : '1px solid #E2E8F0',
                backgroundColor: regionFilter === reg ? '#EFF6FF' : '#FFFFFF',
                color: regionFilter === reg ? '#2563EB' : '#64748B',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {reg === 'All' ? 'Tất cả miền' : `Miền ${reg}`}
            </button>
          ))}
        </div>
      </div>

      {/* 30-Row Benchmark Table Container with Safe Horizontal Scroll */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table
            style={{
              width: '100%',
              minWidth: '1080px',
              borderCollapse: 'collapse',
              fontSize: '13px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  color: '#475569',
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '0.3px',
                }}
              >
                <th style={{ padding: '12px 16px' }}>#</th>
                <th
                  onClick={() => handleSort('code')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>TRƯỜNG ĐẠI HỌC</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('region')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>MIỀN</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('cutoffMin')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>ĐIỂM CHUẨN</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('tuitionMin')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>HỌC PHÍ DỰ KIẾN</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('applicationCount')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>HỒ SƠ NỘP</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('approvalRate')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>TỶ LỆ DUYỆT</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgScore')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>ĐIỂM TB</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('qualifiedRate')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>% ĐẠT CHUẨN</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>
                  <span>NGÀNH NỘP NHIỀU</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedRows.map((row, idx) => {
                const isPxu = row.code === 'PXU';
                return (
                  <tr
                    key={row.code}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: isPxu ? '#F0FDF4' : idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '12px 16px', color: '#94A3B8', fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UniversityAvatar code={row.code} size={32} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ color: isPxu ? '#065F46' : '#0F172A', fontSize: '13.5px' }}>
                              {row.code}
                            </strong>
                            {isPxu && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  color: '#065F46',
                                  backgroundColor: '#A7F3D0',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                }}
                              >
                                Đơn vị Nhà trường
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor:
                            row.region === 'Bắc' ? '#EFF6FF' : row.region === 'Trung' ? '#ECFDF5' : '#FAF5FF',
                          color:
                            row.region === 'Bắc' ? '#1D4ED8' : row.region === 'Trung' ? '#047857' : '#6D28D9',
                        }}
                      >
                        {row.region}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }} className="tabular-nums">
                      {row.cutoffMin === row.cutoffMax ? `${row.cutoffMin}đ` : `${row.cutoffMin} – ${row.cutoffMax}đ`}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }} className="tabular-nums">
                      {row.tuitionMin} – {row.tuitionMax} tr/năm
                    </td>
                    <td style={{ padding: '12px 16px' }} className="tabular-nums">
                      {row.hasApplications ? (
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                          {row.applicationCount} hồ sơ
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }} className="tabular-nums">
                      {row.hasApplications ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 800,
                              color: row.approvalRate >= 50 ? '#059669' : '#D97706',
                              backgroundColor: row.approvalRate >= 50 ? '#ECFDF5' : '#FFFBEB',
                              padding: '2px 7px',
                              borderRadius: '6px',
                            }}
                          >
                            {row.approvalRate}%
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            ({row.approvedCount}/{row.applicationCount})
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>—</span>
                      )}
                    </td>

                    {/* 3 Mandatory B2 Indicators */}
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: row.avgScore ? '#0284C7' : '#94A3B8' }} className="tabular-nums">
                      {row.avgScore !== null ? row.avgScore.toFixed(1) : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: row.qualifiedRate !== null ? (row.qualifiedRate >= 50 ? '#059669' : '#D97706') : '#94A3B8' }} className="tabular-nums">
                      {row.qualifiedRate !== null ? `${row.qualifiedRate}%` : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: row.topMajor ? '#334155' : '#94A3B8', fontSize: '12.5px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.topMajor || ''}>
                      {row.topMajor || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer of Table */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748B',
          }}
        >
          <div>
            Hiển thị <strong>{filteredAndSortedRows.length}</strong> / 30 trường đại học đối tác
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={13} />
            <span>Dữ liệu CSDL tuyển sinh chính thức 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
