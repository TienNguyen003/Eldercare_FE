import { Chip } from '@mui/material';

interface Config { label: string; color: string; bg: string }

const map: Record<string, Config> = {
  ACTIVE:     { label: 'Hoạt động',   color: '#059669', bg: '#ECFDF5' },
  active:     { label: 'Hoạt động',   color: '#059669', bg: '#ECFDF5' },
  INACTIVE:   { label: 'Ngừng',       color: '#64748B', bg: '#F1F5F9' },
  inactive:   { label: 'Ngừng',       color: '#64748B', bg: '#F1F5F9' },
  PENDING:    { label: 'Chờ duyệt',   color: '#D97706', bg: '#FFFBEB' },
  pending:    { label: 'Chờ duyệt',   color: '#D97706', bg: '#FFFBEB' },
  COMPLETED:  { label: 'Hoàn thành',  color: '#2563EB', bg: '#EFF6FF' },
  completed:  { label: 'Hoàn thành',  color: '#2563EB', bg: '#EFF6FF' },
  CANCELLED:  { label: 'Đã hủy',      color: '#DC2626', bg: '#FEF2F2' },
  cancelled:  { label: 'Đã hủy',      color: '#DC2626', bg: '#FEF2F2' },
  PAID:       { label: 'Đã thanh toán', color: '#059669', bg: '#ECFDF5' },
  paid:       { label: 'Đã thanh toán', color: '#059669', bg: '#ECFDF5' },
  UNPAID:     { label: 'Chưa thanh toán', color: '#DC2626', bg: '#FEF2F2' },
  unpaid:     { label: 'Chưa thanh toán', color: '#DC2626', bg: '#FEF2F2' },
  HIGH:       { label: 'Cao',         color: '#DC2626', bg: '#FEF2F2' },
  MEDIUM:     { label: 'Trung bình',  color: '#D97706', bg: '#FFFBEB' },
  LOW:        { label: 'Thấp',        color: '#2563EB', bg: '#EFF6FF' },
  AVAILABLE:  { label: 'Rảnh',        color: '#059669', bg: '#ECFDF5' },
  available:  { label: 'Rảnh',        color: '#059669', bg: '#ECFDF5' },
  BUSY:       { label: 'Đang bận',    color: '#D97706', bg: '#FFFBEB' },
  busy:       { label: 'Đang bận',    color: '#D97706', bg: '#FFFBEB' },
};

export default function StatusChip({ status }: { status: string }) {
  const cfg = map[status] ?? { label: status, color: '#64748B', bg: '#F1F5F9' };
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bg, color: cfg.color, fontWeight: 600, fontSize: 11,
        border: `1px solid ${cfg.color}30`, borderRadius: '8px', height: 24,
      }}
    />
  );
}
