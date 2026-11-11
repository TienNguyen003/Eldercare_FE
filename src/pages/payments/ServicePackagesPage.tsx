import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, CircularProgress, TextField, MenuItem, Grid, Tooltip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useGetServicePackagesQuery, useCreateServicePackageMutation, useUpdateServicePackageMutation, useDeleteServicePackageMutation } from '../../store/api/apiSlice';
import type { ServicePackage } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function ServicePackagesPage() {
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServicePackage | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetServicePackagesQuery({ page, size: 10 });
  const [create] = useCreateServicePackageMutation();
  const [update] = useUpdateServicePackageMutation();
  const [remove] = useDeleteServicePackageMutation();

  const { register, handleSubmit, control, reset } = useForm();
  const packages = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;

  const openCreate = () => { setEditing(null); reset({}); setDialogOpen(true); };
  const openEdit = (p: ServicePackage) => { setEditing(p); reset(p); setDialogOpen(true); };

  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  return (
    <PageHeader title="Gói dịch vụ" action={{ label: 'Tạo gói', onClick: openCreate }}>
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên gói</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Giá (VND)</TableCell>
                <TableCell>Thời hạn (ngày)</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={6} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
                : packages.map((p) => (
                  <TableRow key={p.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{p.name}</TableCell>
                    <TableCell>{p.description?.substring(0, 60) || '-'}</TableCell>
                    <TableCell>{new Intl.NumberFormat('vi').format(p.price)}</TableCell>
                    <TableCell>{p.duration || '-'}</TableCell>
                    <TableCell><StatusChip status={p.isActive ? 'ACTIVE' : 'INACTIVE'} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sửa"><IconButton size="small" sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#D97706', '&:hover': { bgcolor: 'rgba(245,158,11,0.22)' } }} onClick={() => openEdit(p)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ bgcolor: 'rgba(239,68,68,0.12)', color: '#DC2626', '&:hover': { bgcolor: 'rgba(239,68,68,0.22)' } }} onClick={() => setDeleteId(p.id)}><Delete /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={total} page={page} rowsPerPage={10} rowsPerPageOptions={[10]}
          onPageChange={(_, p) => setPage(p)} labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`} sx={{ borderTop: '1px solid #E8EEF3', bgcolor: '#FAFBFD', '& .MuiTablePagination-toolbar': { px: 2, minHeight: 52 }, '& .MuiTablePagination-displayedRows': { fontSize: 13, fontWeight: 600 } }} />
      </Card>

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        title={editing ? 'Cập nhật gói dịch vụ' : 'Tạo gói dịch vụ mới'}
        formId="pkg-form" submitLabel={editing ? 'Cập nhật' : 'Tạo'}>
        <form id="pkg-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Tên gói *" {...register('name')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Giá (VND)" type="number" {...register('price')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Thời hạn (ngày)" type="number" {...register('duration')} /></Grid>
              <Grid item xs={6}>
                <Controller name="isActive" control={control} defaultValue={true} render={({ field }) => (
                  <TextField select fullWidth label="Trạng thái" value={field.value} onChange={field.onChange}>
                    <MenuItem value={true as any}>Hoạt động</MenuItem>
                    <MenuItem value={false as any}>Ngừng</MenuItem>
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12}><TextField fullWidth label="Mô tả" multiline rows={2} {...register('description')} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Tính năng" multiline rows={2} {...register('features')} /></Grid>
            </Grid>
          </form>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }}
        message="Xóa gói dịch vụ này? Hành động này không thể hoàn tác." />
    </PageHeader>
  );
}
