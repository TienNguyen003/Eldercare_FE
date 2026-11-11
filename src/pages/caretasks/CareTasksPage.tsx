import { useState } from 'react';
import {
  Box, IconButton, Tooltip, Typography, Grid, TextField, MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import {
  useGetCareTasksQuery, useGetCareSchedulesQuery,
  useCreateCareTaskMutation, useUpdateCareTaskMutation, useDeleteCareTaskMutation
} from '../../store/api/apiSlice';
import type { CareTask } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip, { statusLabel } from '../../components/common/StatusChip';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const COLUMNS = [
  { key: 'taskType', label: 'Loại công việc' },
  { key: 'description', label: 'Mô tả', width: 240 },
  { key: 'scheduleId', label: 'Ca (ID)', width: 120 },
  { key: 'status', label: 'Trạng thái', width: 140 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 100 },
];

const TASK_TYPE_LABELS: Record<string, string> = {
  FEEDING: 'Cho ăn',
  BATHING: 'Tắm rửa',
  MEDICATION: 'Uống thuốc',
  CHECK_BP: 'Đo huyết áp',
  EXERCISE: 'Tập luyện',
};

const TASK_STATUS = ['PENDING', 'IN_PROGRESS', 'DONE', 'SKIPPED', 'FAILED'];

export default function CareTasksPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CareTask | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetCareTasksQuery({ page, size: 10 });
  const { data: schedulesData } = useGetCareSchedulesQuery({ page: 0, size: 100 });
  const [create] = useCreateCareTaskMutation();
  const [update] = useUpdateCareTaskMutation();
  const [remove] = useDeleteCareTaskMutation();
  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm();

  const tasks = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const schedules = schedulesData?.data?.content ?? [];
  const filtered = tasks.filter((t) =>
    (TASK_TYPE_LABELS[t.taskType] || t.taskType || '').toLowerCase().includes(search.toLowerCase()) ||
    String(t.scheduleId).includes(search)
  );

  const openCreate = () => { setEditing(null); reset({}); setDialogOpen(true); };
  const openEdit = (t: CareTask) => { setEditing(t); reset(t); setDialogOpen(true); };
  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  const renderCell = (row: CareTask, key: string) => {
    switch (key) {
      case 'taskType':
        return <Typography fontWeight={600} fontSize={13.5}>{TASK_TYPE_LABELS[row.taskType] || row.taskType}</Typography>;
      case 'description':
        return <Typography fontSize={13.5}>{row.description || '—'}</Typography>;
      case 'scheduleId':
        return <Typography fontSize={13.5}>{row.scheduleId ? ('#' + String(row.scheduleId)) : '—'}</Typography>;
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
    <PageHeader title="Công việc trong ca" subtitle={total + ' công việc trong hệ thống'}
      action={{ label: 'Tạo công việc', onClick: openCreate }}>
      <DataTable columns={COLUMNS} rows={filtered} total={total} page={page} onPageChange={setPage}
        isLoading={isLoading} search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo loại công việc..." renderCell={renderCell} />

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} formId="task-form"
        title={editing ? 'Cập nhật' : 'Tạo mới'} submitLabel={editing ? 'Cập nhật' : 'Tạo'} isSubmitting={isSubmitting}>
        <form id="task-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller name="scheduleId" control={control} render={({ field }) => (
                <TextField select fullWidth label="Ca chăm sóc" {...field} size="small">
                  {schedules.map((s) => <MenuItem key={s.id} value={s.id}>#{s.id} — {s.scheduledDate}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={6}>
              <Controller name="taskType" control={control} render={({ field }) => (
                <TextField select fullWidth label="Loại công việc *" {...field} size="small">
                  {Object.entries(TASK_TYPE_LABELS).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Mô tả" multiline rows={2} {...register('description')} size="small" /></Grid>
            <Grid item xs={6}>
              <Controller name="status" control={control} defaultValue="PENDING" render={({ field }) => (
                <TextField select fullWidth label="Trạng thái" {...field} size="small">
                  {TASK_STATUS.map((st) => <MenuItem key={st} value={st}>{statusLabel(st)}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
          </Grid>
        </form>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }} />
    </PageHeader>
  );
}