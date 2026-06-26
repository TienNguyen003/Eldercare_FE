import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Tooltip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { useGetElderliesQuery, useGetPrescriptionsByElderlyQuery, useCreatePrescriptionMutation, useUpdatePrescriptionMutation, useDeletePrescriptionMutation } from '../../store/api/apiSlice';
import type { Prescription } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';

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
                <TableRow><TableCell colSpan={6} align="center">Vui lòng chọn người già</TableCell></TableRow>
              ) : isLoading ? (
                <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
              ) : prescriptions.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.prescribedBy}</TableCell>
                  <TableCell>{p.prescribedDate ? format(new Date(p.prescribedDate), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell>{p.diagnosis || '-'}</TableCell>
                  <TableCell><StatusChip status={p.status} /></TableCell>
                  <TableCell>{p.notes || '-'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa"><IconButton size="small" color="warning" onClick={() => openEdit(p)}><Edit /></IconButton></Tooltip>
                    <Tooltip title="Xóa"><IconButton size="small" color="error" onClick={() => setDeleteId(p.id)}><Delete /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Cập nhật đơn thuốc' : 'Tạo đơn thuốc'}</DialogTitle>
        <DialogContent>
          <form id="presc-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Controller name="elderlyId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Người già *" {...field}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" type="submit" form="presc-form">{editing ? 'Cập nhật' : 'Tạo'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Xóa đơn thuốc này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={async () => { await remove(deleteId!); setDeleteId(null); }}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </PageHeader>
  );
}
