import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip, Avatar, Typography, Grid, TextField, MenuItem, Button } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';
import { useGetElderliesQuery, useCreateElderlyMutation, useUpdateElderlyMutation, useDeleteElderlyMutation } from '../../store/api/apiSlice';
import type { Elderly } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const schema = yup.object({
  fullName: yup.string().required('Bắt buộc'),
  dateOfBirth: yup.string().required('Bắt buộc'),
  gender: yup.string().required('Bắt buộc'),
  phone: yup.string(),
  address: yup.string(),
  status: yup.string(),
});

const COLUMNS = [
  { key: 'fullName', label: 'Họ tên' },
  { key: 'code', label: 'Mã', width: 100 },
  { key: 'dateOfBirth', label: 'Ngày sinh', width: 120 },
  { key: 'gender', label: 'Giới tính', width: 100 },
  { key: 'phone', label: 'Điện thoại', width: 140 },
  { key: 'status', label: 'Trạng thái', width: 130 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 120 },
];

export default function ElderlyListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Elderly | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetElderliesQuery({ page, size: 10 });
  const [createElderly] = useCreateElderlyMutation();
  const [updateElderly] = useUpdateElderlyMutation();
  const [deleteElderly] = useDeleteElderlyMutation();
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const elderlies = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const filtered = elderlies.filter((e) =>
    e.fullName?.toLowerCase().includes(search.toLowerCase()) || e.code?.includes(search)
  );

  const openCreate = () => { setEditing(null); reset({}); setDialogOpen(true); };
  const openEdit = (e: Elderly) => { setEditing(e); reset(e as any); setDialogOpen(true); };
  const onSubmit = async (values: any) => {
    if (editing) await updateElderly({ id: editing.id, body: values });
    else await createElderly(values);
    setDialogOpen(false);
  };

  const renderCell = (row: Elderly, key: string) => {
    switch (key) {
      case 'fullName':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', fontSize: 13, fontWeight: 700 }}>
              {row.fullName?.[0]}
            </Avatar>
            <Typography fontWeight={600} fontSize={13.5}>{row.fullName}</Typography>
          </Box>
        );
      case 'dateOfBirth':
        return row.dateOfBirth ? format(new Date(row.dateOfBirth), 'dd/MM/yyyy') : '-';
      case 'gender':
        return row.gender === 'MALE' ? 'Nam' : row.gender === 'FEMALE' ? 'Nữ' : row.gender || '-';
      case 'phone':
        return <Typography fontSize={13.5}>{row.phone || '-'}</Typography>;
      case 'status':
        return <StatusChip status={row.status ?? 'ACTIVE'} />;
      case 'actions':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <Tooltip title="Chi tiết">
              <IconButton size="small" onClick={() => navigate(`/elderly/${row.id}`)}
                sx={{ bgcolor: '#EFF6FF', color: '#2563EB', '&:hover': { bgcolor: '#DBEAFE' } }}>
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
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
        return (row as any)[key] ?? '-';
    }
  };

  return (
    <PageHeader title="Quản lý Người cao tuổi" subtitle={`Tổng cộng ${total} người đang quản lý`} action={{ label: 'Thêm mới', onClick: openCreate }}>
      <DataTable
        columns={COLUMNS} rows={filtered} total={total} page={page}
        onPageChange={setPage} isLoading={isLoading}
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên, mã..."
        renderCell={renderCell}
      />

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} formId="elderly-form"
        title={editing ? 'Cập nhật thông tin' : 'Thêm người cao tuổi mới'}
        submitLabel={editing ? 'Cập nhật' : 'Thêm mới'} isSubmitting={isSubmitting}>
        <form id="elderly-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Họ và tên *" {...register('fullName')} error={!!errors.fullName} helperText={errors.fullName?.message} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Ngày sinh *" type="date" InputLabelProps={{ shrink: true }} {...register('dateOfBirth')} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />
            </Grid>
            <Grid item xs={6}>
              <Controller name="gender" control={control} defaultValue="" render={({ field }) => (
                <TextField select fullWidth label="Giới tính *" {...field} error={!!errors.gender} helperText={errors.gender?.message}>
                  <MenuItem value="MALE">Nam</MenuItem>
                  <MenuItem value="FEMALE">Nữ</MenuItem>
                  <MenuItem value="OTHER">Khác</MenuItem>
                </TextField>
              )} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Điện thoại" {...register('phone')} />
            </Grid>
            <Grid item xs={6}>
              <Controller name="status" control={control} defaultValue="ACTIVE" render={({ field }) => (
                <TextField select fullWidth label="Trạng thái" {...field}>
                  <MenuItem value="ACTIVE">Đang quản lý</MenuItem>
                  <MenuItem value="INACTIVE">Ngừng</MenuItem>
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Địa chỉ" multiline rows={2} {...register('address')} />
            </Grid>
          </Grid>
        </form>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await deleteElderly(deleteId!); setDeleteId(null); }} />
    </PageHeader>
  );
}
