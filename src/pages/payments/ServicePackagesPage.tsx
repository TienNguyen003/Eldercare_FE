import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Tooltip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useGetServicePackagesQuery, useCreateServicePackageMutation, useUpdateServicePackageMutation, useDeleteServicePackageMutation } from '../../store/api/apiSlice';
import type { ServicePackage } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';

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
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
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
              {isLoading ? <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                : packages.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{p.name}</TableCell>
                    <TableCell>{p.description?.substring(0, 60) || '-'}</TableCell>
                    <TableCell>{new Intl.NumberFormat('vi').format(p.price)}</TableCell>
                    <TableCell>{p.duration || '-'}</TableCell>
                    <TableCell><StatusChip status={p.isActive ? 'ACTIVE' : 'INACTIVE'} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sửa"><IconButton size="small" color="warning" onClick={() => openEdit(p)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" color="error" onClick={() => setDeleteId(p.id)}><Delete /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={total} page={page} rowsPerPage={10} rowsPerPageOptions={[10]}
          onPageChange={(_, p) => setPage(p)} labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`} />
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Cập nhật gói dịch vụ' : 'Tạo gói dịch vụ mới'}</DialogTitle>
        <DialogContent>
          <form id="pkg-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" type="submit" form="pkg-form">{editing ? 'Cập nhật' : 'Tạo'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Xóa gói dịch vụ này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={async () => { await remove(deleteId!); setDeleteId(null); }}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </PageHeader>
  );
}
