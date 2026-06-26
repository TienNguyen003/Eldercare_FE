import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, Tooltip, Box
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import {
  useGetElderliesQuery, useGetDiseasesQuery, useGetElderlyDiseasesQuery,
  useCreateElderlyDiseaseMutation, useDeleteElderlyDiseaseMutation
} from '../../store/api/apiSlice';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';

export default function ElderlyDiseasesPage() {
  const [selectedElderly, setSelectedElderly] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const { data: diseasesData } = useGetDiseasesQuery({ page: 0, size: 100 });
  const { data, isLoading } = useGetElderlyDiseasesQuery(selectedElderly, { skip: !selectedElderly });
  const [create] = useCreateElderlyDiseaseMutation();
  const [remove] = useDeleteElderlyDiseaseMutation();

  const { register, handleSubmit, control, reset } = useForm();
  const elderlyDiseases = data?.data ?? [];
  const elderlies = elderliesData?.data?.content ?? [];
  const diseases = diseasesData?.data?.content ?? [];

  const onSubmit = async (values: any) => {
    await create({ ...values, elderlyId: selectedElderly });
    setDialogOpen(false);
    reset();
  };

  return (
    <PageHeader title="Bệnh án người già" action={{ label: 'Thêm bệnh', onClick: () => setDialogOpen(true) }}>
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
                <TableCell>Bệnh</TableCell>
                <TableCell>Ngày chẩn đoán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!selectedElderly ? (
                <TableRow><TableCell colSpan={5} align="center">Chọn người già để xem</TableCell></TableRow>
              ) : isLoading ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
              ) : elderlyDiseases.map((d) => (
                <TableRow key={d.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{d.diseaseName || `#${d.diseaseId}`}</TableCell>
                  <TableCell>{d.diagnosedDate ? format(new Date(d.diagnosedDate), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell><StatusChip status={d.status ?? 'ACTIVE'} /></TableCell>
                  <TableCell>{d.notes || '-'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xóa"><IconButton size="small" color="error" onClick={() => setDeleteId(d.id)}><span>✕</span></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm bệnh cho người già</DialogTitle>
        <DialogContent>
          <form id="disease-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Controller name="diseaseId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Chọn bệnh *" {...field}>
                    {diseases.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={6}><TextField fullWidth label="Ngày chẩn đoán" type="date" InputLabelProps={{ shrink: true }} {...register('diagnosedDate')} /></Grid>
              <Grid item xs={6}>
                <Controller name="status" control={control} defaultValue="ACTIVE" render={({ field }) => (
                  <TextField select fullWidth label="Trạng thái" {...field}>
                    <MenuItem value="ACTIVE">Đang mắc</MenuItem>
                    <MenuItem value="INACTIVE">Đã khỏi</MenuItem>
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12}><TextField fullWidth label="Ghi chú" multiline rows={2} {...register('notes')} /></Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" type="submit" form="disease-form">Thêm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Xóa bệnh án này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={async () => { await remove(deleteId!); setDeleteId(null); }}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </PageHeader>
  );
}
