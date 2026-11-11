import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, CircularProgress, TextField, MenuItem, Grid, Tooltip
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import {
  useGetElderliesQuery, useGetDiseasesQuery, useGetElderlyDiseasesQuery,
  useCreateElderlyDiseaseMutation, useDeleteElderlyDiseaseMutation
} from '../../store/api/apiSlice';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyHint from '../../components/common/EmptyHint';

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
    <PageHeader title="Bệnh án người cao tuổi" action={{ label: 'Thêm bệnh', onClick: () => setDialogOpen(true) }}>
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
                <TableCell>Bệnh</TableCell>
                <TableCell>Ngày chẩn đoán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!selectedElderly ? (
                <EmptyHint colSpan={5} title="Chưa chọn người cao tuổi" description="Chọn người cao tuổi ở bộ lọc phía trên để xem bệnh án" />
              ) : isLoading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
              ) : elderlyDiseases.map((d) => (
                <TableRow key={d.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{d.diseaseName || `#${d.diseaseId}`}</TableCell>
                  <TableCell>{d.diagnosedDate ? format(new Date(d.diagnosedDate), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell><StatusChip status={d.status ?? 'ACTIVE'} /></TableCell>
                  <TableCell>{d.notes || '-'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xóa"><IconButton size="small" sx={{ bgcolor: 'rgba(239,68,68,0.12)', color: '#DC2626', '&:hover': { bgcolor: 'rgba(239,68,68,0.22)' } }} onClick={() => setDeleteId(d.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        title="Thêm bệnh cho người cao tuổi" formId="disease-form" submitLabel="Thêm">
        <form id="disease-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
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
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }}
        message="Xóa bệnh án này? Hành động này không thể hoàn tác." />
    </PageHeader>
  );
}
