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
  useGetElderliesQuery, useGetMedicationsQuery,
  useGetMedicationSchedulesByElderlyQuery, useCreateMedicationScheduleMutation,
  useUpdateMedicationScheduleMutation, useDeleteMedicationScheduleMutation
} from '../../store/api/apiSlice';
import type { MedicationSchedule } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';

export default function MedicationSchedulesPage() {
  const [selectedElderly, setSelectedElderly] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MedicationSchedule | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const { data: medsData } = useGetMedicationsQuery({ page: 0, size: 100 });
  const { data, isLoading } = useGetMedicationSchedulesByElderlyQuery(selectedElderly, { skip: !selectedElderly });
  const [create] = useCreateMedicationScheduleMutation();
  const [update] = useUpdateMedicationScheduleMutation();
  const [remove] = useDeleteMedicationScheduleMutation();

  const { register, handleSubmit, control, reset } = useForm();
  const schedules = data?.data ?? [];
  const elderlies = elderliesData?.data?.content ?? [];
  const meds = medsData?.data?.content ?? [];

  const openCreate = () => { setEditing(null); reset({ elderlyId: selectedElderly }); setDialogOpen(true); };
  const openEdit = (s: MedicationSchedule) => { setEditing(s); reset(s); setDialogOpen(true); };

  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  return (
    <PageHeader title="Lịch uống thuốc" action={{ label: 'Thêm lịch', onClick: openCreate }}>
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', mb: 2, p: 2 }}>
        <TextField select label="Chọn người già" value={selectedElderly} onChange={(e) => setSelectedElderly(Number(e.target.value))} size="small" sx={{ minWidth: 250 }}>
          <MenuItem value={0}>-- Chọn người già --</MenuItem>
          {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
        </TextField>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Thuốc</TableCell>
                <TableCell>Liều lượng</TableCell>
                <TableCell>Tần suất</TableCell>
                <TableCell>Thời gian uống</TableCell>
                <TableCell>Ngày bắt đầu</TableCell>
                <TableCell>Ngày kết thúc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!selectedElderly ? (
                <TableRow><TableCell colSpan={8} align="center">Vui lòng chọn người già</TableCell></TableRow>
              ) : isLoading ? (
                <TableRow><TableCell colSpan={8} align="center"><CircularProgress /></TableCell></TableRow>
              ) : schedules.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{s.medicationName || `#${s.medicationId}`}</TableCell>
                  <TableCell>{s.dosage}</TableCell>
                  <TableCell>{s.frequency}</TableCell>
                  <TableCell>{s.timeOfDay || '-'}</TableCell>
                  <TableCell>{s.startDate ? format(new Date(s.startDate), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell>{s.endDate ? format(new Date(s.endDate), 'dd/MM/yyyy') : '-'}</TableCell>
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
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Cập nhật lịch uống thuốc' : 'Thêm lịch uống thuốc'}</DialogTitle>
        <DialogContent>
          <form id="med-sched-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Controller name="elderlyId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Người già *" {...field}>
                    {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="medicationId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Thuốc *" {...field}>
                    {meds.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={6}><TextField fullWidth label="Liều lượng" {...register('dosage')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Tần suất" {...register('frequency')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Thời gian trong ngày" {...register('timeOfDay')} /></Grid>
              <Grid item xs={6}>
                <Controller name="status" control={control} defaultValue="ACTIVE" render={({ field }) => (
                  <TextField select fullWidth label="Trạng thái" {...field}>
                    <MenuItem value="ACTIVE">Đang dùng</MenuItem>
                    <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                    <MenuItem value="CANCELLED">Ngừng</MenuItem>
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={6}><TextField fullWidth label="Ngày bắt đầu" type="date" InputLabelProps={{ shrink: true }} {...register('startDate')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Ngày kết thúc" type="date" InputLabelProps={{ shrink: true }} {...register('endDate')} /></Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" type="submit" form="med-sched-form">{editing ? 'Cập nhật' : 'Thêm'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Xóa lịch uống thuốc này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={async () => { await remove(deleteId!); setDeleteId(null); }}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </PageHeader>
  );
}
