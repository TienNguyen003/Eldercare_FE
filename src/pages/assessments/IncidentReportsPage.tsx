import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, CircularProgress, TextField, MenuItem, Grid, Tooltip
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { useGetIncidentReportsQuery, useGetElderliesQuery, useCreateIncidentReportMutation, useUpdateIncidentReportMutation } from '../../store/api/apiSlice';
import type { IncidentReport } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import { incidentTypeLabel, INCIDENT_TYPE_LABELS } from '../../utils/labels';
import FormDialog from '../../components/common/FormDialog';

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
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người cao tuổi</TableCell>
                <TableCell>Loại sự cố</TableCell>
                <TableCell>Ngày xảy ra</TableCell>
                <TableCell>Mức độ</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={7} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
                : incidents.map((i) => (
                  <TableRow key={i.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                    <TableCell>{i.elderlyName || `#${i.elderlyId}`}</TableCell>
                    <TableCell>{incidentTypeLabel(i.type)}</TableCell>
                    <TableCell>{i.incidentDate ? format(new Date(i.incidentDate), 'dd/MM/yyyy') : '-'}</TableCell>
                    <TableCell><StatusChip status={i.severity} /></TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>{i.description?.substring(0, 60)}{i.description?.length > 60 ? '...' : ''}</TableCell>
                    <TableCell><StatusChip status={i.status} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sửa"><IconButton size="small" sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#D97706', '&:hover': { bgcolor: 'rgba(245,158,11,0.22)' } }} onClick={() => openEdit(i)}><Edit /></IconButton></Tooltip>
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
        title={editing ? 'Cập nhật sự cố' : 'Tạo báo cáo sự cố'}
        formId="incident-form" submitLabel={editing ? 'Cập nhật' : 'Tạo'}>
        <form id="incident-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller name="elderlyId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Người cao tuổi *" {...field}>
                    {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={6}>
                <Controller name="type" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Loại sự cố *" {...field}>
                    {Object.entries(INCIDENT_TYPE_LABELS).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
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
      </FormDialog>
    </PageHeader>
  );
}
