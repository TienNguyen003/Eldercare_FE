import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Tooltip, Chip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { useGetIncidentReportsQuery, useGetElderliesQuery, useCreateIncidentReportMutation, useUpdateIncidentReportMutation } from '../../store/api/apiSlice';
import type { IncidentReport } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';

const severityColor = (s: string) => s === 'HIGH' ? 'error' : s === 'MEDIUM' ? 'warning' : 'info';

export default function IncidentReportsPage() {
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IncidentReport | null>(null);

  const { data, isLoading } = useGetIncidentReportsQuery({ page, size: 10 });
  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const [create] = useCreateIncidentReportMutation();
  const [update] = useUpdateIncidentReportMutation();

  const { register, handleSubmit, control, reset } = useForm();
  const incidents = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const elderlies = elderliesData?.data?.content ?? [];

  const openCreate = () => { setEditing(null); reset({ incidentDate: new Date().toISOString().slice(0, 10) }); setDialogOpen(true); };
  const openEdit = (i: IncidentReport) => { setEditing(i); reset(i); setDialogOpen(true); };

  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  return (
    <PageHeader title="Báo cáo sự cố" action={{ label: 'Tạo báo cáo', onClick: openCreate }}>
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Người già</TableCell>
                <TableCell>Loại sự cố</TableCell>
                <TableCell>Ngày xảy ra</TableCell>
                <TableCell>Mức độ</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
                : incidents.map((i) => (
                  <TableRow key={i.id} hover>
                    <TableCell>{i.elderlyName || `#${i.elderlyId}`}</TableCell>
                    <TableCell>{i.type}</TableCell>
                    <TableCell>{i.incidentDate ? format(new Date(i.incidentDate), 'dd/MM/yyyy') : '-'}</TableCell>
                    <TableCell><Chip label={i.severity} color={severityColor(i.severity)} size="small" /></TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>{i.description?.substring(0, 60)}{i.description?.length > 60 ? '...' : ''}</TableCell>
                    <TableCell><StatusChip status={i.status} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sửa"><IconButton size="small" color="warning" onClick={() => openEdit(i)}><Edit /></IconButton></Tooltip>
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
        <DialogTitle>{editing ? 'Cập nhật sự cố' : 'Tạo báo cáo sự cố'}</DialogTitle>
        <DialogContent>
          <form id="incident-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Controller name="elderlyId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Người già *" {...field}>
                    {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={6}><TextField fullWidth label="Loại sự cố" {...register('type')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Ngày xảy ra" type="date" InputLabelProps={{ shrink: true }} {...register('incidentDate')} /></Grid>
              <Grid item xs={6}>
                <Controller name="severity" control={control} defaultValue="LOW" render={({ field }) => (
                  <TextField select fullWidth label="Mức độ" {...field}>
                    <MenuItem value="LOW">Thấp</MenuItem>
                    <MenuItem value="MEDIUM">Trung bình</MenuItem>
                    <MenuItem value="HIGH">Cao</MenuItem>
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={6}>
                <Controller name="status" control={control} defaultValue="OPEN" render={({ field }) => (
                  <TextField select fullWidth label="Trạng thái" {...field}>
                    <MenuItem value="OPEN">Mở</MenuItem>
                    <MenuItem value="INVESTIGATING">Đang xử lý</MenuItem>
                    <MenuItem value="RESOLVED">Đã giải quyết</MenuItem>
                    <MenuItem value="CLOSED">Đóng</MenuItem>
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12}><TextField fullWidth label="Vị trí" {...register('location')} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Mô tả *" multiline rows={3} {...register('description')} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Biện pháp xử lý" multiline rows={2} {...register('actionTaken')} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Người báo cáo" {...register('reportedBy')} /></Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" type="submit" form="incident-form">{editing ? 'Cập nhật' : 'Tạo'}</Button>
        </DialogActions>
      </Dialog>
    </PageHeader>
  );
}
