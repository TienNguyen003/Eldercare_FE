import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, CircularProgress, TextField, MenuItem, Grid, Tooltip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { useGetElderliesQuery, useGetPrescriptionsByElderlyQuery, useCreatePrescriptionMutation, useUpdatePrescriptionMutation, useDeletePrescriptionMutation } from '../../store/api/apiSlice';
import type { Prescription } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyHint from '../../components/common/EmptyHint';

export default function PrescriptionsPage() {
  const [selectedElderly, setSelectedElderly] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const { data, isLoading } = useGetPrescriptionsByElderlyQuery(selectedElderly, { skip: !selectedElderly });
  const [create] = useCreatePrescriptionMutation();
  const [update] = useUpdatePrescriptionMutation();
  const [remove] = useDeletePrescriptionMutation();

  const { register, handleSubmit, control, reset } = useForm();
  const prescriptions = data?.data ?? [];
  const elderlies = elderliesData?.data?.content ?? [];

  const openCreate = () => { setEditing(null); reset({ elderlyId: selectedElderly }); setDialogOpen(true); };
  const openEdit = (p: Prescription) => { setEditing(p); reset(p); setDialogOpen(true); };

  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  return (
    <PageHeader title="Đơn thuốc" action={{ label: 'Tạo đơn thuốc', onClick: openCreate }}>
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
                <TableCell>Bác sĩ kê</TableCell>
                <TableCell>Ngày kê</TableCell>
                <TableCell>Chẩn đoán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!selectedElderly ? (
                <EmptyHint colSpan={6} title="Chưa chọn người cao tuổi" description="Chọn người cao tuổi ở bộ lọc phía trên để xem danh sách đơn thuốc" />
              ) : isLoading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
              ) : prescriptions.map((p) => (
                <TableRow key={p.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                  <TableCell>{p.prescribedBy}</TableCell>
                  <TableCell>{p.prescribedDate ? format(new Date(p.prescribedDate), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell>{p.diagnosis || '-'}</TableCell>
                  <TableCell><StatusChip status={p.status} /></TableCell>
                  <TableCell>{p.notes || '-'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa"><IconButton size="small" sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#D97706', '&:hover': { bgcolor: 'rgba(245,158,11,0.22)' } }} onClick={() => openEdit(p)}><Edit /></IconButton></Tooltip>
                    <Tooltip title="Xóa"><IconButton size="small" sx={{ bgcolor: 'rgba(239,68,68,0.12)', color: '#DC2626', '&:hover': { bgcolor: 'rgba(239,68,68,0.22)' } }} onClick={() => setDeleteId(p.id)}><Delete /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        title={editing ? 'Cập nhật đơn thuốc' : 'Tạo đơn thuốc'}
        formId="presc-form" submitLabel={editing ? 'Cập nhật' : 'Tạo'}>
        <form id="presc-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller name="elderlyId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Người cao tuổi *" {...field}>
                    {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={6}><TextField fullWidth label="Bác sĩ kê" {...register('prescribedBy')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Ngày kê" type="date" InputLabelProps={{ shrink: true }} {...register('prescribedDate')} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Chẩn đoán" {...register('diagnosis')} /></Grid>
              <Grid item xs={6}>
                <Controller name="status" control={control} defaultValue="ACTIVE" render={({ field }) => (
                  <TextField select fullWidth label="Trạng thái" {...field}>
                    <MenuItem value="ACTIVE">Đang dùng</MenuItem>
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
        message="Xóa đơn thuốc này? Hành động này không thể hoàn tác." />
    </PageHeader>
  );
}
