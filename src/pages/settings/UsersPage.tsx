import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Grid, TextField, Avatar, Chip, Autocomplete } from '@mui/material';
import { Edit, Delete, AdminPanelSettings } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useGetUsersQuery, useGetRolesQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../../store/api/apiSlice';
import type { User, Role } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const COLUMNS = [
  { key: 'username', label: 'Người dùng' },
  { key: 'email', label: 'Email', width: 200 },
  { key: 'phone', label: 'Điện thoại', width: 130 },
  { key: 'roles', label: 'Vai trò', width: 160 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 100 },
];

const COLORS = ['#0D9488', '#10B981', '#059669', '#DC2626', '#D97706'];

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useGetUsersQuery({ page, size: 10 });
  const { data: rolesData } = useGetRolesQuery();
  const roles = rolesData?.data?.content ?? [];
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [create] = useCreateUserMutation();
  const [update] = useUpdateUserMutation();
  const [remove] = useDeleteUserMutation();
  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm();

  const users = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const filtered = users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.includes(search)
  );

  const openCreate = () => { setEditing(null); reset({}); setDialogOpen(true); };
  const openEdit = (u: User) => { setEditing(u); reset(u); setDialogOpen(true); };
  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  const renderCell = (row: User, key: string) => {
    switch (key) {
      case 'username':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: COLORS[row.id % COLORS.length], fontSize: 13, fontWeight: 700 }}>
              {row.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography fontWeight={600} fontSize={13.5}>{row.username}</Typography>
          </Box>
        );
      case 'roles':
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {row.roles?.map((r) => (
              <Chip key={r.id} label={r.name} size="small" icon={<AdminPanelSettings sx={{ fontSize: '12px !important' }} />}
                sx={{ bgcolor: '#F5F3FF', color: '#10B981', fontWeight: 600, fontSize: 11, borderRadius: '8px', height: 22 }} />
            )) ?? '—'}
          </Box>
        );
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
      default: return (row as any)[key] || '—';
    }
  };

  return (
    <PageHeader title="Quản lý người dùng" subtitle={`${total} tài khoản trong hệ thống`} action={{ label: 'Thêm người dùng', onClick: openCreate }}>
      <DataTable columns={COLUMNS} rows={filtered} total={total} page={page} onPageChange={setPage}
        isLoading={isLoading} search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên, email..." renderCell={renderCell} />

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} formId="user-form"
        title={editing ? 'Cập nhật người dùng' : 'Thêm người dùng'} submitLabel={editing ? 'Cập nhật' : 'Thêm'} isSubmitting={isSubmitting}>
        <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Tên đăng nhập *" {...register('username')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Email" {...register('email')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Điện thoại" {...register('phone')} /></Grid>
            {!editing && <Grid item xs={12}><TextField fullWidth label="Mật khẩu" type="password" {...register('password')} /></Grid>}
            <Grid item xs={12}>
              <Controller name="roles" control={control} render={() => (
                <Autocomplete
                  multiple
                  options={roles}
                  getOptionLabel={(o) => o.name}
                  value={selectedRoles}
                  onChange={(_, v) => setSelectedRoles(v)}
                  renderInput={(params) => <TextField {...params} label="Vai trò" size="small" />}
                />
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
