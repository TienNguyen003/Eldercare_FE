import { useState } from 'react';
import { Box, IconButton, Tooltip, Avatar, Typography, Grid, TextField, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useGetCaregiversQuery, useCreateCaregiverMutation, useUpdateCaregiverMutation, useDeleteCaregiverMutation } from '../../store/api/apiSlice';
import type { Caregiver } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const COLUMNS = [
  { key: 'fullName', label: 'Nhân viên' },
  { key: 'specialization', label: 'Chuyên môn', width: 150 },
  { key: 'phone', label: 'Điện thoại', width: 130 },
  { key: 'email', label: 'Email', width: 180 },
  { key: 'experience', label: 'Kinh nghiệm', width: 110, align: 'center' as const },
  { key: 'status', label: 'Trạng thái', width: 120 },
  { key: 'availability', label: 'Khả dụng', width: 120 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 100 },
];

const COLORS = ['#0D9488', '#10B981', '#059669', '#DC2626', '#D97706', '#0EA5E9'];

export default function CaregiversPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Caregiver | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetCaregiversQuery({ page, size: 10 });
  const [create] = useCreateCaregiverMutation();
  const [update] = useUpdateCaregiverMutation();
  const [remove] = useDeleteCaregiverMutation();
  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm();

  const caregivers = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const filtered = caregivers.filter((c) =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.email?.includes(search)
  );

  const openCreate = () => { setEditing(null); reset({}); setDialogOpen(true); };
  const openEdit = (c: Caregiver) => { setEditing(c); reset(c); setDialogOpen(true); };
  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  const renderCell = (row: Caregiver, key: string) => {
    switch (key) {
      case 'fullName':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: COLORS[row.id % COLORS.length], fontSize: 13, fontWeight: 700 }}>
              {row.fullName?.[0]}
            </Avatar>
            <Box>
              <Typography fontWeight={600} fontSize={13.5}>{row.fullName}</Typography>
            </Box>
          </Box>
        );
      case 'experience':
        return row.experience != null ? `${row.experience} năm` : '-';
      case 'status':
        return <StatusChip status={row.status ?? 'ACTIVE'} />;
      case 'availability':
        return <StatusChip status={row.availability ?? 'AVAILABLE'} />;
      case 'actions':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <Tooltip title="Sửa">
              <IconButton size="small" onClick={() => openEdit(row)}
                sx={{ bgcolor: '#FFFBEB', color: '#D97706', '&:hover': { bgcolor: '#FEF3C7' } }}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton size="small" onClick={() => setDeleteId(row.id)}
                sx={{ bgcolor: '#FEF2F2', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      default:
        return (row as any)[key] || '-';
    }
  };

  return (
    <PageHeader title="Nhân viên chăm sóc" subtitle={`${total} nhân viên trong hệ thống`} action={{ label: 'Thêm nhân viên', onClick: openCreate }}>
      <DataTable
        columns={COLUMNS} rows={filtered} total={total} page={page}
        onPageChange={setPage} isLoading={isLoading}
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên, email..."
        renderCell={renderCell}
      />

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} formId="caregiver-form"
        title={editing ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
        submitLabel={editing ? 'Cập nhật' : 'Thêm'} isSubmitting={isSubmitting}>
        <form id="caregiver-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Họ và tên *" {...register('fullName')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Điện thoại" {...register('phone')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Email" {...register('email')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Chuyên môn" {...register('specialization')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Kinh nghiệm (năm)" type="number" {...register('experience')} /></Grid>
            <Grid item xs={6}>
              <Controller name="status" control={control} defaultValue="ACTIVE" render={({ field }) => (
                <TextField select fullWidth label="Trạng thái" {...field}>
                  <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                  <MenuItem value="INACTIVE">Ngừng</MenuItem>
                </TextField>
              )} />
            </Grid>
            <Grid item xs={6}>
              <Controller name="availability" control={control} defaultValue="AVAILABLE" render={({ field }) => (
                <TextField select fullWidth label="Khả dụng" {...field}>
                  <MenuItem value="AVAILABLE">Rảnh</MenuItem>
                  <MenuItem value="BUSY">Đang bận</MenuItem>
                </TextField>
              )} />
            </Grid>
          </Grid>
        </form>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }} />
    </PageHeader>
  );
}
