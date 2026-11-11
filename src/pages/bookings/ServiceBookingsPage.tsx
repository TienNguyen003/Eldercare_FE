import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useState } from 'react';
import { useGetServiceBookingsQuery, useUpdateBookingStatusMutation, useDeleteServiceBookingMutation } from '../../store/api/apiSlice';
import type { ServiceBooking } from '../../types';
import { format } from 'date-fns';
import { CheckCircle, Cancel, Delete, Done } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';

const COLUMNS = [
  { key: 'fullName', label: 'Khách hàng', width: 200 },
  { key: 'phone', label: 'Điện thoại', width: 130 },
  { key: 'package', label: 'Gói dịch vụ', width: 180 },
  { key: 'preferredDate', label: 'Ngày mong muốn', width: 130 },
  { key: 'createdAt', label: 'Ngày đặt', width: 120 },
  { key: 'status', label: 'Trạng thái', width: 140 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 170 },
];

export default function ServiceBookingsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetServiceBookingsQuery({ page, size: 10, status: statusFilter || undefined });
  const [updateStatus] = useUpdateBookingStatusMutation();
  const [remove] = useDeleteServiceBookingMutation();

  const bookings = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const filtered = bookings.filter((b) =>
    b.fullName?.toLowerCase().includes(search.toLowerCase()) || b.phone?.includes(search)
  );

  const renderCell = (row: ServiceBooking, key: string) => {
    switch (key) {
      case 'fullName':
        return (
          <Box>
            <Typography fontWeight={600} fontSize={13.5}>{row.fullName}</Typography>
            <Typography fontSize={12} color="text.secondary" noWrap>{row.address || row.email || '—'}</Typography>
          </Box>
        );
      case 'package':
        return row.servicePackageName || (row.servicePackageId ? `#${row.servicePackageId}` : '—');
      case 'preferredDate':
        return row.preferredDate ? format(new Date(row.preferredDate), 'dd/MM/yyyy') : '—';
      case 'createdAt':
        return row.createdAt ? format(new Date(row.createdAt), 'dd/MM/yyyy') : '—';
      case 'status':
        return <StatusChip status={row.status} />;
      case 'actions':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            {row.status === 'NEW' && (
              <>
                <Tooltip title="Xác nhận">
                  <IconButton size="small" onClick={() => updateStatus({ id: row.id, status: 'CONFIRMED' })}
                    sx={{ bgcolor: '#ECFDF5', color: '#059669' }}><CheckCircle fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Hủy">
                  <IconButton size="small" onClick={() => updateStatus({ id: row.id, status: 'CANCELLED' })}
                    sx={{ bgcolor: '#FFFBEB', color: '#D97706' }}><Cancel fontSize="small" /></IconButton>
                </Tooltip>
              </>
            )}
            {row.status === 'CONFIRMED' && (
              <Tooltip title="Hoàn thành">
                <IconButton size="small" onClick={() => updateStatus({ id: row.id, status: 'DONE' })}
                  sx={{ bgcolor: '#EFF6FF', color: '#0284C7' }}><Done fontSize="small" /></IconButton>
              </Tooltip>
            )}
            <Tooltip title="Xóa">
              <IconButton size="small" onClick={() => setDeleteId(row.id)}
                sx={{ bgcolor: '#FEF2F2', color: '#DC2626' }}><Delete fontSize="small" /></IconButton>
            </Tooltip>
          </Box>
        );
      default:
        return (row as any)[key] || '—';
    }
  };

  return (
    <PageHeader title="Yêu cầu đặt dịch vụ" subtitle={`${total} yêu cầu từ website`}>
      <DataTable
        columns={COLUMNS} rows={filtered} total={total} page={page}
        onPageChange={setPage} isLoading={isLoading}
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên, SĐT..."
        renderCell={renderCell}
        extraToolbar={
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={statusFilter} label="Trạng thái" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="NEW">Mới</MenuItem>
              <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
              <MenuItem value="DONE">Hoàn thành</MenuItem>
              <MenuItem value="CANCELLED">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        }
      />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }} />
    </PageHeader>
  );
}
