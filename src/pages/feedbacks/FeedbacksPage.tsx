import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Rating } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useGetFeedbacksQuery, useDeleteFeedbackMutation } from '../../store/api/apiSlice';
import type { Feedback } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const COLUMNS = [
  { key: 'authorName', label: 'Người gửi', width: 200 },
  { key: 'caregiverName', label: 'Nhân viên được đánh giá', width: 200 },
  { key: 'rating', label: 'Điểm', width: 150 },
  { key: 'comment', label: 'Nhận xét' },
  { key: 'createdAt', label: 'Ngày gửi', width: 120 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 90 },
];

export default function FeedbacksPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetFeedbacksQuery({ page, size: 10 });
  const [remove, { isLoading: isDeleting }] = useDeleteFeedbackMutation();

  const rows = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const filtered = rows.filter((f) =>
    (f.caregiverName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (f.authorName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const avg = rows.length
    ? (rows.reduce((s, f) => s + (f.rating ?? 0), 0) / rows.length).toFixed(1)
    : '—';

  const renderCell = (row: Feedback, key: string) => {
    switch (key) {
      case 'authorName':
        return (
          <Box>
            <Typography fontWeight={600} fontSize={13.5}>{row.authorName}</Typography>
            {row.elderlyName && <Typography fontSize={12} color="text.secondary">Về: {row.elderlyName}</Typography>}
          </Box>
        );
      case 'caregiverName':
        return <Typography fontSize={13.5}>{row.caregiverName ?? `#${row.caregiverId}`}</Typography>;
      case 'rating':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating value={row.rating} readOnly size="small" sx={{ color: '#F59E0B' }} />
            <Typography fontSize={12} fontWeight={700} color="#F59E0B">{row.rating}/5</Typography>
          </Box>
        );
      case 'comment':
        return <Typography fontSize={13} color="text.secondary" sx={{ maxWidth: 340 }}>{row.comment || '—'}</Typography>;
      case 'createdAt':
        return row.createdAt ? format(parseISO(row.createdAt), 'dd/MM/yyyy') : '—';
      case 'actions':
        return (
          <Tooltip title="Xóa đánh giá">
            <IconButton size="small" onClick={() => setDeleteId(row.id)}
              sx={{ bgcolor: '#FEF2F2', color: '#DC2626' }}><Delete fontSize="small" /></IconButton>
          </Tooltip>
        );
      default:
        return (row as any)[key] || '—';
    }
  };

  return (
    <PageHeader
      title="Đánh giá dịch vụ"
      subtitle={`${total} đánh giá — điểm trung bình ${avg}/5`}
      badge={rows.length ? `${avg} ★` : undefined}
    >
      <DataTable
        columns={COLUMNS} rows={filtered} total={total} page={page}
        onPageChange={setPage} isLoading={isLoading}
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo nhân viên, người gửi..."
        renderCell={renderCell}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }}
        isDeleting={isDeleting}
        message="Xóa đánh giá này? Điểm trung bình của nhân viên sẽ được cập nhật lại."
      />
    </PageHeader>
  );
}
