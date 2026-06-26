import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Tooltip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import {
  useGetCareSchedulesQuery, useGetElderliesQuery, useGetCaregiversQuery,
  useCreateCareScheduleMutation, useUpdateCareScheduleMutation, useDeleteCareScheduleMutation
} from '../../store/api/apiSlice';
import type { CareSchedule } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';

export default function CareSchedulesPage() {
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CareSchedule | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetCareSchedulesQuery({ page, size: 10 });
  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const { data: caregiversData } = useGetCaregiversQuery({ page: 0, size: 100 });
  const [create] = useCreateCareScheduleMutation();
  const [update] = useUpdateCareScheduleMutation();
  const [remove] = useDeleteCareScheduleMutation();

  const { register, handleSubmit, control, reset } = useForm();
  const schedules = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const elderlies = elderliesData?.data?.content ?? [];
  const caregivers = caregiversData?.data?.content ?? [];

  const openCreate = () => { setEditing(null); reset({}); setDialogOpen(true); };
  const openEdit = (s: CareSchedule) => { setEditing(s); reset(s); setDialogOpen(true); };

  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  return (
    <PageHeader title="Lịch chăm sóc" action={{ label: 'Tạo lịch', onClick: openCreate }}>
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Người già</TableCell>
                <TableCell>Nhân viên</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
                : schedules.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell>{s.elderlyName || `#${s.elderlyId}`}</TableCell>
                    <TableCell>{s.caregiverName || `#${s.caregiverId}`}</TableCell>
                    <TableCell>{s.scheduledDate ? format(new Date(s.scheduledDate), 'dd/MM/yyyy') : '-'}</TableCell>
                    <TableCell>{s.startTime} - {s.endTime}</TableCell>
                    <TableCell>{s.type}</TableCell>
                    <TableCell><StatusChip status={s.status} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sửa"><IconButton size="small" color="warning" onClick={() => openEdit(s)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" color="error" onClick={() => setDeleteId(s.id)}><Delete /></IconButton></Tooltip>
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
        <DialogTitle>{editing ? 'Cập nhật lịch' : 'Tạo lịch mới'}</DialogTitle>
        <DialogContent>
          <form id="schedule-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <Controller name="elderlyId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Người già *" {...field}>
                    {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={6}>
                <Controller name="caregiverId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Nhân viên *" {...field}>
                    {caregivers.map((c) => <MenuItem key={c.id} value={c.id}>{c.fullName}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12}><TextField fullWidth label="Ngày" type="date" InputLabelProps={{ shrink: true }} {...register('scheduledDate')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Giờ bắt đầu" type="time" InputLabelProps={{ shrink: true }} {...register('startTime')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Giờ kết thúc" type="time" InputLabelProps={{ shrink: true }} {...register('endTime')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Loại dịch vụ" {...register('type')} /></Grid>
              <Grid item xs={6}>
                <Controller name="status" control={control} defaultValue="PENDING" render={({ field }) => (
                  <TextField select fullWidth label="Trạng thái" {...field}>
                    <MenuItem value="PENDING">Chờ</MenuItem>
                    <MenuItem value="ACTIVE">Đang thực hiện</MenuItem>
                    <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                    <MenuItem value="CANCELLED">Hủy</MenuItem>
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12}><TextField fullWidth label="Ghi chú" multiline rows={2} {...register('notes')} /></Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" type="submit" form="schedule-form">{editing ? 'Cập nhật' : 'Tạo'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Xóa lịch chăm sóc này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={async () => { await remove(deleteId!); setDeleteId(null); }}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </PageHeader>
  );
}
