import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Grid, TextField, MenuItem, Chip } from '@mui/material';
import { Edit, Delete, LocalPharmacy } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useGetMedicationsQuery, useCreateMedicationMutation, useUpdateMedicationMutation, useDeleteMedicationMutation } from '../../store/api/apiSlice';
import type { Medication } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const COLUMNS = [
  { key: 'name', label: 'Tên thuốc' },
  { key: 'genericName', label: 'Tên generic', width: 160 },
  { key: 'category', label: 'Phân loại', width: 130 },
  { key: 'unit', label: 'Đơn vị', width: 100, align: 'center' as const },
  { key: 'status', label: 'Trạng thái', width: 130 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 100 },
];

export default function MedicationsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetMedicationsQuery({ page, size: 10 });
  const [create] = useCreateMedicationMutation();
  const [update] = useUpdateMedicationMutation();
  const [remove] = useDeleteMedicationMutation();
  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm();

  const medications = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const filtered = medications.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) || m.genericName?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); reset({}); setDialogOpen(true); };
  const openEdit = (m: Medication) => { setEditing(m); reset(m); setDialogOpen(true); };
  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  const renderCell = (row: Medication, key: string) => {
    switch (key) {
      case 'name':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalPharmacy sx={{ fontSize: 16, color: '#0D9488' }} />
            </Box>
            <Typography fontWeight={600} fontSize={13.5}>{row.name}</Typography>
          </Box>
        );
      case 'category':
        return row.category ? (
          <Chip label={row.category} size="small" sx={{ bgcolor: '#F5F3FF', color: '#10B981', fontWeight: 600, fontSize: 11, borderRadius: '8px' }} />
        ) : '-';
      case 'unit':
        return row.unit ? (
          <Chip label={row.unit} size="small" sx={{ bgcolor: '#F0FDF4', color: '#059669', fontWeight: 600, fontSize: 11, borderRadius: '8px' }} />
        ) : '-';
      case 'status':
        return <StatusChip status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />;
      case 'actions':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <Tooltip title="Sửa">
              <IconButton size="small" onClick={() => openEdit(row)}
                sx={{ bgcolor: '#FFFBEB', color: '#D97706', '&:hover': { bgcolor: '#FEF3C7' } }}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton size="small" onClick={() => setDeleteId(row.id)}
                sx={{ bgcolor: '#FEF2F2', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      default:
        return (row as any)[key] || '-';
    }
  };

  return (
    <PageHeader title="Danh mục thuốc" subtitle={`${total} loại thuốc trong hệ thống`} action={{ label: 'Thêm thuốc', onClick: openCreate }}>
      <DataTable
        columns={COLUMNS} rows={filtered} total={total} page={page}
        onPageChange={setPage} isLoading={isLoading}
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên thuốc..."
        renderCell={renderCell}
      />

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} formId="med-form"
        title={editing ? 'Cập nhật thuốc' : 'Thêm thuốc mới'}
        submitLabel={editing ? 'Cập nhật' : 'Thêm'} isSubmitting={isSubmitting}>
        <form id="med-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Tên thuốc *" {...register('name')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Tên generic" {...register('genericName')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Phân loại" {...register('category')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Đơn vị" {...register('unit')} /></Grid>
            <Grid item xs={6}>
              <Controller name="isActive" control={control} defaultValue={true} render={({ field }) => (
                <TextField select fullWidth label="Trạng thái" value={field.value} onChange={field.onChange}>
                  <MenuItem value={true as any}>Hoạt động</MenuItem>
                  <MenuItem value={false as any}>Ngừng</MenuItem>
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Mô tả" multiline rows={2} {...register('description')} /></Grid>
          </Grid>
        </form>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }} />
    </PageHeader>
  );
}
