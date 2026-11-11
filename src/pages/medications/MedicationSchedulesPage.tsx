import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, CircularProgress, TextField, MenuItem, Grid, Tooltip
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
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyHint from '../../components/common/EmptyHint';

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
      <Card sx={{ mb: 2.5, p: 2, borderRadius: '20px', bgcolor: '#FBFDFE', borderLeft: '4px solid #0D9488' }}>
        <TextField select label="Chọn người cao tuổi" value={selectedElderly} onChange={(e) => setSelectedElderly(Number(e.target.value))} size="small" sx={{ minWidth: 250 }}>
          <MenuItem value={0}>— Chọn người cao tuổi —</MenuItem>
          {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
        </TextField>
      </Card>

      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
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
                <EmptyHint colSpan={8} title="Chưa chọn người cao tuổi" description="Chọn người cao tuổi ở bộ lọc phía trên để xem lịch uống thuốc" />
              ) : isLoading ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
              ) : schedules.map((s) => (
                <TableRow key={s.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{s.medicationName || `#${s.medicationId}`}</TableCell>
                  <TableCell>{s.dosage}</TableCell>
                  <TableCell>{s.frequency}</TableCell>
                  <TableCell>{s.timeOfDay || '-'}</TableCell>
                  <TableCell>{s.startDate ? format(new Date(s.startDate), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell>{s.endDate ? format(new Date(s.endDate), 'dd/MM/yyyy') : '-'}</TableCell>
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
      </Card>

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        title={editing ? 'Cập nhật lịch uống thuốc' : 'Thêm lịch uống thuốc'}
        formId="med-sched-form" submitLabel={editing ? 'Cập nhật' : 'Thêm'}>
        <form id="med-sched-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller name="elderlyId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Người cao tuổi *" {...field}>
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
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }}
        message="Xóa lịch uống thuốc này? Hành động này không thể hoàn tác." />
    </PageHeader>
  );
}
