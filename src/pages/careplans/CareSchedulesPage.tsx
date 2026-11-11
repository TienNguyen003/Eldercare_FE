import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, CircularProgress, TextField, MenuItem, Grid, Tooltip
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
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { scheduleTypeLabel, SCHEDULE_TYPE_LABELS } from '../../utils/labels';

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
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người cao tuổi</TableCell>
                <TableCell>Nhân viên</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={7} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
                : schedules.map((s) => (
                  <TableRow key={s.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                    <TableCell>{s.elderlyName || `#${s.elderlyId}`}</TableCell>
                    <TableCell>{s.caregiverName || `#${s.caregiverId}`}</TableCell>
                    <TableCell>{s.scheduledDate ? format(new Date(s.scheduledDate), 'dd/MM/yyyy') : '-'}</TableCell>
                    <TableCell>{s.startTime} - {s.endTime}</TableCell>
                    <TableCell>{scheduleTypeLabel(s.type)}</TableCell>
                    <TableCell><StatusChip status={s.status} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sửa"><IconButton size="small" sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#D97706', '&:hover': { bgcolor: 'rgba(245,158,11,0.22)' } }} onClick={() => openEdit(s)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ bgcolor: 'rgba(239,68,68,0.12)', color: '#DC2626', '&:hover': { bgcolor: 'rgba(239,68,68,0.22)' } }} onClick={() => setDeleteId(s.id)}><Delete /></IconButton></Tooltip>
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
        title={editing ? 'Cập nhật lịch' : 'Tạo lịch mới'}
        formId="schedule-form" submitLabel={editing ? 'Cập nhật' : 'Tạo'}>
        <form id="schedule-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller name="elderlyId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Người cao tuổi *" {...field}>
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
              <Grid item xs={6}>
                <Controller name="type" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Loại dịch vụ" {...field}>
                    <MenuItem value="">— Không chọn —</MenuItem>
                    {Object.entries(SCHEDULE_TYPE_LABELS).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
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
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }}
        message="Xóa lịch chăm sóc này? Hành động này không thể hoàn tác." />
    </PageHeader>
  );
}
