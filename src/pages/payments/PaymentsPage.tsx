import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Grid, TextField, MenuItem, Card, CardContent } from '@mui/material';
import { Edit, Payment as PayIcon, TrendingUp, CheckCircle, PendingActions } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { useGetPaymentsQuery, useGetElderliesQuery, useGetServicePackagesQuery, useCreatePaymentMutation, useUpdatePaymentMutation } from '../../store/api/apiSlice';
import type { Payment } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';

const COLUMNS = [
  { key: 'elderlyName', label: 'Người cao tuổi' },
  { key: 'amount', label: 'Số tiền', width: 150 },
  { key: 'paymentDate', label: 'Ngày thanh toán', width: 140 },
  { key: 'method', label: 'Phương thức', width: 130 },
  { key: 'status', label: 'Trạng thái', width: 150 },
  { key: 'actions', label: 'Thao tác', align: 'center' as const, width: 80 },
];

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

export default function PaymentsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);

  const { data, isLoading } = useGetPaymentsQuery({ page, size: 10 });
  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const { data: packagesData } = useGetServicePackagesQuery({ page: 0, size: 100 });
  const [create] = useCreatePaymentMutation();
  const [update] = useUpdatePaymentMutation();
  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm();

  const payments = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;
  const elderlies = elderliesData?.data?.content ?? [];
  const packages = packagesData?.data?.content ?? [];
  const filtered = payments.filter((p) => (p.elderlyName ?? '').toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = payments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const paidCount = payments.filter((p) => p.status === 'PAID').length;
  const pendingCount = payments.filter((p) => p.status === 'PENDING' || p.status === 'UNPAID').length;

  const openCreate = () => { setEditing(null); reset({ paymentDate: new Date().toISOString().slice(0, 10) }); setDialogOpen(true); };
  const openEdit = (p: Payment) => { setEditing(p); reset(p); setDialogOpen(true); };
  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  const methodLabel: Record<string, string> = { CASH: 'Tiền mặt', TRANSFER: 'Chuyển khoản', CARD: 'Thẻ' };

  const renderCell = (row: Payment, key: string) => {
    switch (key) {
      case 'elderlyName':
        return <Typography fontWeight={600} fontSize={13.5}>{row.elderlyName || `#${row.elderlyId}`}</Typography>;
      case 'amount':
        return <Typography fontWeight={700} fontSize={14} sx={{ color: '#059669' }}>{fmt(row.amount)} ₫</Typography>;
      case 'paymentDate':
        return row.paymentDate ? format(new Date(row.paymentDate), 'dd/MM/yyyy') : '—';
      case 'method':
        return <Typography fontSize={13}>{methodLabel[row.method] ?? row.method ?? '—'}</Typography>;
      case 'status':
        return <StatusChip status={row.status} />;
      case 'actions':
        return (
          <Tooltip title="Sửa">
            <IconButton size="small" onClick={() => openEdit(row)} sx={{ bgcolor: '#FFFBEB', color: '#D97706', '&:hover': { bgcolor: '#FEF3C7' } }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      default: return (row as any)[key] ?? '—';
    }
  };

  const summaryCards = [
    { label: 'Tổng doanh thu', value: `${fmt(totalRevenue)} ₫`, icon: <TrendingUp />, color: '#059669', bg: '#ECFDF5' },
    { label: 'Đã thanh toán', value: paidCount, icon: <CheckCircle />, color: '#0D9488', bg: '#EFF6FF' },
    { label: 'Chờ thanh toán', value: pendingCount, icon: <PendingActions />, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Tổng giao dịch', value: total, icon: <PayIcon />, color: '#10B981', bg: '#F5F3FF' },
  ];

  return (
    <PageHeader title="Quản lý thanh toán" subtitle="Theo dõi và quản lý các giao dịch thanh toán" action={{ label: 'Thêm thanh toán', onClick: openCreate }}>
      <Grid container spacing={2.5} mb={3}>
        {summaryCards.map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography fontSize={12} color="text.secondary" mb={0.5}>{s.label}</Typography>
                    <Typography fontWeight={800} fontSize={s.label === 'Tổng doanh thu' ? 14 : 22} sx={{ color: s.color, lineHeight: 1.2 }}>{s.value}</Typography>
                  </Box>
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ color: s.color, '& svg': { fontSize: 20 } }}>{s.icon}</Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DataTable columns={COLUMNS} rows={filtered} total={total} page={page} onPageChange={setPage}
        isLoading={isLoading} search={search} onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên người cao tuổi..." renderCell={renderCell} />

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} formId="pay-form"
        title={editing ? 'Cập nhật thanh toán' : 'Thêm thanh toán'} submitLabel={editing ? 'Cập nhật' : 'Thêm'} isSubmitting={isSubmitting}>
        <form id="pay-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller name="elderlyId" control={control} render={({ field }) => (
                <TextField select fullWidth label="Người cao tuổi *" {...field}>
                  {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="Số tiền *" type="number" {...register('amount')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Ngày thanh toán" type="date" InputLabelProps={{ shrink: true }} {...register('paymentDate')} /></Grid>
            <Grid item xs={6}>
              <Controller name="method" control={control} defaultValue="CASH" render={({ field }) => (
                <TextField select fullWidth label="Phương thức" {...field}>
                  <MenuItem value="CASH">Tiền mặt</MenuItem>
                  <MenuItem value="TRANSFER">Chuyển khoản</MenuItem>
                  <MenuItem value="CARD">Thẻ</MenuItem>
                </TextField>
              )} />
            </Grid>
            <Grid item xs={6}>
              <Controller name="status" control={control} defaultValue="PAID" render={({ field }) => (
                <TextField select fullWidth label="Trạng thái" {...field}>
                  <MenuItem value="PAID">Đã thanh toán</MenuItem>
                  <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                  <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="servicePackageId" control={control} render={({ field }) => (
                <TextField select fullWidth label="Gói dịch vụ" {...field}>
                  <MenuItem value="">— Không có —</MenuItem>
                  {packages.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Mô tả" multiline rows={2} {...register('description')} /></Grid>
          </Grid>
        </form>
      </FormDialog>
    </PageHeader>
  );
}
