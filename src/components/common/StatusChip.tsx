import { Chip, alpha, Box } from '@mui/material';

interface Config { label: string; color: string; bg: string }

const map: Record<string, Config> = {
  ACTIVE:     { label: 'Hoạt động',   color: '#059669', bg: '#ECFDF5' },
  active:     { label: 'Hoạt động',   color: '#059669', bg: '#ECFDF5' },
  INACTIVE:   { label: 'Ngừng',       color: '#64748B', bg: '#F1F5F9' },
  inactive:   { label: 'Ngừng',       color: '#64748B', bg: '#F1F5F9' },
  PENDING:    { label: 'Chờ duyệt',   color: '#D97706', bg: '#FFFBEB' },
  pending:    { label: 'Chờ duyệt',   color: '#D97706', bg: '#FFFBEB' },
  SCHEDULED:  { label: 'Đã lên lịch', color: '#0284C7', bg: '#EFF6FF' },
  IN_PROGRESS:{ label: 'Đang thực hiện', color: '#7C3AED', bg: '#F5F3FF' },
  DONE:       { label: 'Hoàn thành',  color: '#059669', bg: '#ECFDF5' },
  TAKEN:      { label: 'Đã uống',     color: '#059669', bg: '#ECFDF5' },
  MISSED:     { label: 'Bỏ lỡ',       color: '#DC2626', bg: '#FEF2F2' },
  SKIPPED:    { label: 'Bỏ qua',      color: '#D97706', bg: '#FFFBEB' },
  NEW:        { label: 'Mới',         color: '#0284C7', bg: '#EFF6FF' },
  CONFIRMED:  { label: 'Đã xác nhận', color: '#059669', bg: '#ECFDF5' },
  PROCESSED:  { label: 'Đã xử lý',    color: '#059669', bg: '#ECFDF5' },
  COMPLETED:  { label: 'Hoàn thành',  color: '#0D9488', bg: '#E6F7F4' },
  completed:  { label: 'Hoàn thành',  color: '#0D9488', bg: '#EFF6FF' },
  CANCELLED:  { label: 'Đã hủy',      color: '#DC2626', bg: '#FEF2F2' },
  cancelled:  { label: 'Đã hủy',      color: '#DC2626', bg: '#FEF2F2' },
  PAID:       { label: 'Đã thanh toán', color: '#059669', bg: '#ECFDF5' },
  paid:       { label: 'Đã thanh toán', color: '#059669', bg: '#ECFDF5' },
  UNPAID:     { label: 'Chưa thanh toán', color: '#DC2626', bg: '#FEF2F2' },
  unpaid:     { label: 'Chưa thanh toán', color: '#DC2626', bg: '#FEF2F2' },
  HIGH:       { label: 'Cao',         color: '#DC2626', bg: '#FEF2F2' },
  MEDIUM:     { label: 'Trung bình',  color: '#D97706', bg: '#FFFBEB' },
  LOW:        { label: 'Thấp',        color: '#0D9488', bg: '#E6F7F4' },
  AVAILABLE:  { label: 'Rảnh',        color: '#059669', bg: '#ECFDF5' },
  available:  { label: 'Rảnh',        color: '#059669', bg: '#ECFDF5' },
  BUSY:       { label: 'Đang bận',    color: '#D97706', bg: '#FFFBEB' },
  busy:       { label: 'Đang bận',    color: '#D97706', bg: '#FFFBEB' },
  READ:       { label: 'Đã đọc',      color: '#059669', bg: '#ECFDF5' },
  UNREAD:     { label: 'Chưa đọc',    color: '#D97706', bg: '#FFFBEB' },
  OPEN:       { label: 'Mở',          color: '#0284C7', bg: '#EFF6FF' },
  INVESTIGATING: { label: 'Đang xử lý', color: '#7C3AED', bg: '#F5F3FF' },
  RESOLVED:   { label: 'Đã giải quyết', color: '#059669', bg: '#ECFDF5' },
  CLOSED:     { label: 'Đã đóng',     color: '#64748B', bg: '#F1F5F9' },
  FAILED:     { label: 'Thất bại',    color: '#DC2626', bg: '#FEF2F2' },
  failed:     { label: 'Thất bại',    color: '#DC2626', bg: '#FEF2F2' },
  REFUNDED:   { label: 'Đã hoàn tiền', color: '#0284C7', bg: '#EFF6FF' },
};

/** Lấy nhãn tiếng Việt của một trạng thái (dùng cho dropdown, tooltip...) */
export const statusLabel = (status?: string | null): string =>
  (status && map[status]?.label) || status || '—';

export default function StatusChip({ status }: { status: string }) {
  const cfg = map[status] ?? { label: status, color: '#64748B', bg: '#F1F5F9' };
  return (
    <Chip
      label={cfg.label}
      size="small"
      icon={(
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
      )}
      sx={{
        bgcolor: cfg.bg, color: cfg.color, fontWeight: 600, fontSize: 11,
        border: `1px solid ${alpha(cfg.color, 0.22)}`,
        borderRadius: '9px', height: 26, py: 0,
      }}
    />
  );
}
