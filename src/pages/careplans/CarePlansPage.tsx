import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Grid, TextField, MenuItem } from '@mui/material';
import { Edit, Delete, Assignment } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { useGetCarePlansQuery, useGetElderliesQuery, useCreateCarePlanMutation, useUpdateCarePlanMutation, useDeleteCarePlanMutation } from '../../store/api/apiSlice';
import type { CarePlan } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const COLUMNS = [
  { key: 'title', label: 'Kế hoạch' },
  { key: 'elderlyName', label: 'Người cao tuổi', width: 160 },
  { key: 'startDate', label: 'Bắt đầu', width: 120 },
  { key: 'endDate', label: 'Kết thúc', width: 120 },
  { key: 'status', label: 'Trạng thái', width: 130 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 100 },
];

export default function CarePlansPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CarePlan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetCarePlansQuery({ page, size: 10 });
  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const [create] = useCreateCarePlanMutation();
  const [update] = useUpdateCarePlanMutation();
  const [remove] = useDeleteCarePlanMutation();
  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm();

  const plans = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const elderlies = elderliesData?.data?.content ?? [];
  const filtered = plans.filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); reset({}); setDialogOpen(true); };
  const openEdit = (p: CarePlan) => { setEditing(p); reset(p); setDialogOpen(true); };
  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  const renderCell = (row: CarePlan, key: string) => {
    switch (key) {
      case 'title':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Assignment sx={{ fontSize: 16, color: '#0D9488' }} />
            </Box>
            <Typography fontWeight={600} fontSize={13.5}>{row.title}</Typography>
          </Box>
        );
      case 'elderlyName':
        return <Typography fontSize={13.5}>{row.elderlyName || `#${row.elderlyId}`}</Typography>;
      case 'startDate':
        return row.startDate ? format(new Date(row.startDate), 'dd/MM/yyyy') : '—';
      case 'endDate':
        return row.endDate ? format(new Date(row.endDate), 'dd/MM/yyyy') : '—';
      case 'status':
        return <StatusChip status={row.status} />;
      case 'actions':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <Tooltip title="Sửa">
              <IconButton size="small" onClick={() => openEdit(row)} sx={{ bgcolor: '#FFFBEB', color: '#D97706', '&:hover': { bgcolor: '#FEF3C7' } }}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton size="small" onClick={() => setDeleteId(row.id)} sx={{ bgcolor: '#FEF2F2', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      default: return (row as any)[key] ?? '—';
    }
  };

  return (
    <PageHeader title="Kế hoạch chăm sóc" subtitle={`${total} kế hoạch trong hệ thống`} action={{ label: 'Tạo kế hoạch', onClick: openCreate }}>
      <DataTable columns={COLUMNS} rows={filtered} total={total} page={page} onPageChange={setPage}
        isLoading={isLoading} search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tiêu đề..." renderCell={renderCell} />

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} formId="plan-form"
        title={editing ? 'Cập nhật kế hoạch' : 'Tạo kế hoạch mới'} submitLabel={editing ? 'Cập nhật' : 'Tạo'} isSubmitting={isSubmitting}>
        <form id="plan-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Tiêu đề *" {...register('title')} /></Grid>
            <Grid item xs={12}>
              <Controller name="elderlyId" control={control} render={({ field }) => (
                <TextField select fullWidth label="Người cao tuổi *" {...field}>
                  {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="Ngày bắt đầu" type="date" InputLabelProps={{ shrink: true }} {...register('startDate')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Ngày kết thúc" type="date" InputLabelProps={{ shrink: true }} {...register('endDate')} /></Grid>
            <Grid item xs={12}>
              <Controller name="status" control={control} defaultValue="ACTIVE" render={({ field }) => (
                <TextField select fullWidth label="Trạng thái" {...field}>
                  <MenuItem value="ACTIVE">Đang thực hiện</MenuItem>
                  <MenuItem value="PENDING">Chờ duyệt</MenuItem>
                  <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                  <MenuItem value="CANCELLED">Hủy</MenuItem>
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Mục tiêu" multiline rows={2} {...register('goals')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Mô tả" multiline rows={2} {...register('description')} /></Grid>
          </Grid>
        </form>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }} />
    </PageHeader>
  );
}
