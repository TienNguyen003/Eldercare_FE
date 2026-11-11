import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Chip, alpha } from '@mui/material';
import { Delete, OpenInNew } from '@mui/icons-material';
import { useGetDocumentsQuery, useGetElderliesQuery, useDeleteDocumentMutation } from '../../store/api/apiSlice';
import type { Document } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { docTypeLabel } from '../../utils/labels';

const COLUMNS = [
  { key: 'title', label: 'Tên file' },
  { key: 'elderlyId', label: 'Người cao tuổi', width: 200 },
  { key: 'type', label: 'Loại', width: 140 },
  { key: 'fileSize', label: 'Kích thước', width: 110 },
  { key: 'uploadedAt', label: 'Ngày tải lên' },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 110 },
];

const TYPE_COLORS: Record<string, string> = {
  LAB_RESULT: '#DC2626',
  PRESCRIPTION: '#D97706',
  REPORT: '#0EA5E9',
  ID_DOCUMENT: '#0D9488',
  OTHER: '#64748B',
};

const fmtSize = (b?: number) =>
  b == null || b <= 0 ? '—' : b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

export default function DocumentsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetDocumentsQuery({ page, size: 10, title: search || undefined });
  const { data: elderlyData } = useGetElderliesQuery({ page: 0, size: 500 });
  const [remove] = useDeleteDocumentMutation();

  const docs = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const elderlyMap = Object.fromEntries((elderlyData?.data?.content ?? []).map((e) => [e.id, e.fullName]));

  const renderCell = (row: Document, key: string) => {
    switch (key) {
      case 'title':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={600} fontSize={13.5} noWrap>{row.title}</Typography>
              <Typography fontSize={11.5} color="text.disabled" noWrap>{row.fileName ?? ''}</Typography>
            </Box>
            {row.fileUrl && (
              <Tooltip title="Mở tệp">
                <IconButton size="small" component="a" href={row.fileUrl} target="_blank" rel="noreferrer"
                  sx={{ width: 28, height: 28, bgcolor: alpha('#0D9488', 0.1), color: '#0D9488' }}>
                  <OpenInNew fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      case 'elderlyId':
        return (
          <Typography fontSize={13}>{elderlyMap[row.elderlyId] ?? `Người cao tuổi #${row.elderlyId}`}</Typography>
        );
      case 'type':
        return (
          <Chip size="small" label={docTypeLabel(row.type || 'OTHER')} sx={{ bgcolor: `${(TYPE_COLORS[row.type] ?? '#E2E8F0')}22`, color: TYPE_COLORS[row.type] ?? '#475569', fontWeight: 600, fontSize: 11, height: 22 }} />
        );
      case 'fileSize':
        return <Typography fontSize={12.5}>{fmtSize(row.fileSize)}</Typography>;
      case 'uploadedAt':
        return (
          <Typography fontSize={12.5} color="text.secondary">{row.uploadedAt ? new Date(row.uploadedAt).toLocaleDateString('vi-VN') : '—'}</Typography>
        );
      case 'actions':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <Tooltip title="Xóa">
              <IconButton size="small" onClick={() => setDeleteId(row.id)} sx={{ bgcolor: '#FEF2F2', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      default: return <Typography fontSize={13}>{(row as any)[key] || '—'}</Typography>;
    }
  };

  return (
    <PageHeader title="Quản lý tài liệu" subtitle={`${total} bản ghi trong hệ thống`} badge="FILES">
      <DataTable columns={COLUMNS} rows={docs} total={total} page={page} onPageChange={setPage}
        isLoading={isLoading} search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên file..." renderCell={renderCell} />

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }} />
    </PageHeader>
  );
}