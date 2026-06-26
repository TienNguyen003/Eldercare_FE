import { useState } from 'react';
import { Box, Card, CardContent, Grid, IconButton, Tooltip, Typography, TextField, MenuItem, LinearProgress } from '@mui/material';
import { Edit, Delete, MonitorHeart, Favorite, DeviceThermostat, Air } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useGetElderliesQuery, useGetVitalSignsQuery, useCreateVitalSignMutation, useUpdateVitalSignMutation, useDeleteVitalSignMutation } from '../../store/api/apiSlice';
import type { VitalSign } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const COLUMNS = [
  { key: 'recordedAt', label: 'Thời gian', width: 150 },
  { key: 'bp', label: 'Huyết áp', width: 120 },
  { key: 'heartRate', label: 'Nhịp tim', width: 110 },
  { key: 'temperature', label: 'Nhiệt độ', width: 110 },
  { key: 'oxygenSaturation', label: 'SpO2', width: 100 },
  { key: 'bloodSugar', label: 'Đường huyết', width: 110 },
  { key: 'weight', label: 'Cân nặng', width: 100 },
  { key: 'actions', label: '', align: 'center' as const, width: 90 },
];

const Metric = ({ icon, label, value, unit, color, bg }: any) => (
  <Card sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ color, '& svg': { fontSize: 16 } }}>{icon}</Box>
        </Box>
        <Typography fontSize={12} color="text.secondary">{label}</Typography>
      </Box>
      <Typography fontWeight={800} fontSize={22} sx={{ color }}>{value ?? '—'}</Typography>
      <Typography fontSize={11} color="text.disabled">{unit}</Typography>
    </CardContent>
  </Card>
);

export default function VitalSignsPage() {
  const [selectedElderly, setSelectedElderly] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VitalSign | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const { data, isLoading } = useGetVitalSignsQuery(selectedElderly, { skip: !selectedElderly });
  const [create] = useCreateVitalSignMutation();
  const [update] = useUpdateVitalSignMutation();
  const [remove] = useDeleteVitalSignMutation();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const vitalSigns = data?.data ?? [];
  const elderlies = elderliesData?.data?.content ?? [];
  const latest = vitalSigns[vitalSigns.length - 1];

  const openCreate = () => { setEditing(null); reset({ elderlyId: selectedElderly, recordedAt: new Date().toISOString().slice(0, 16) }); setDialogOpen(true); };
  const openEdit = (v: VitalSign) => { setEditing(v); reset(v); setDialogOpen(true); };
  const onSubmit = async (values: any) => {
    if (editing) await update({ id: editing.id, body: values });
    else await create(values);
    setDialogOpen(false);
  };

  const chartData = vitalSigns.slice(-15).map((v) => ({
    date: format(new Date(v.recordedAt), 'dd/MM'),
    'Huyết áp': v.bloodPressureSystolic,
    'Nhịp tim': v.heartRate,
    'SpO2': v.oxygenSaturation,
  }));

  const renderCell = (row: VitalSign, key: string) => {
    switch (key) {
      case 'recordedAt': return <Typography fontSize={13}>{format(new Date(row.recordedAt), 'dd/MM/yyyy HH:mm')}</Typography>;
      case 'bp': return <Typography fontWeight={600} fontSize={13} sx={{ color: '#DC2626' }}>{row.bloodPressureSystolic}/{row.bloodPressureDiastolic}</Typography>;
      case 'heartRate': return <Typography fontSize={13}>{row.heartRate ? `${row.heartRate} bpm` : '—'}</Typography>;
      case 'temperature': return <Typography fontSize={13}>{row.temperature ? `${row.temperature}°C` : '—'}</Typography>;
      case 'oxygenSaturation': return <Typography fontSize={13}>{row.oxygenSaturation ? `${row.oxygenSaturation}%` : '—'}</Typography>;
      case 'bloodSugar': return <Typography fontSize={13}>{row.bloodSugar ?? '—'}</Typography>;
      case 'weight': return <Typography fontSize={13}>{row.weight ? `${row.weight} kg` : '—'}</Typography>;
      case 'actions':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <Tooltip title="Sửa"><IconButton size="small" onClick={() => openEdit(row)} sx={{ bgcolor: '#FFFBEB', color: '#D97706', '&:hover': { bgcolor: '#FEF3C7' } }}><Edit fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Xóa"><IconButton size="small" onClick={() => setDeleteId(row.id)} sx={{ bgcolor: '#FEF2F2', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}><Delete fontSize="small" /></IconButton></Tooltip>
          </Box>
        );
      default: return '—';
    }
  };

  return (
    <PageHeader title="Chỉ số sức khỏe" subtitle="Theo dõi và ghi nhận chỉ số sinh tồn" action={{ label: 'Thêm chỉ số', onClick: openCreate }}>
      {/* Filter */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none', mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <MonitorHeart sx={{ color: '#2563EB', fontSize: 20 }} />
          <TextField select label="Chọn người cao tuổi" value={selectedElderly} onChange={(e) => setSelectedElderly(Number(e.target.value))} size="small" sx={{ minWidth: 260 }}>
            <MenuItem value={0}>— Chọn người cao tuổi —</MenuItem>
            {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
          </TextField>
        </CardContent>
      </Card>

      {/* Latest metrics */}
      {latest && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} sm={3}><Metric icon={<Favorite />} label="Huyết áp" value={`${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}`} unit="mmHg" color="#DC2626" bg="#FEF2F2" /></Grid>
          <Grid item xs={6} sm={3}><Metric icon={<MonitorHeart />} label="Nhịp tim" value={latest.heartRate} unit="bpm" color="#2563EB" bg="#EFF6FF" /></Grid>
          <Grid item xs={6} sm={3}><Metric icon={<Air />} label="SpO2" value={latest.oxygenSaturation} unit="%" color="#059669" bg="#ECFDF5" /></Grid>
          <Grid item xs={6} sm={3}><Metric icon={<DeviceThermostat />} label="Nhiệt độ" value={latest.temperature} unit="°C" color="#D97706" bg="#FFFBEB" /></Grid>
        </Grid>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <Card sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography fontWeight={700} fontSize={15} mb={2}>Biểu đồ theo dõi</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  {[['bp','#DC2626'],['hr','#2563EB'],['spo2','#059669']].map(([k,c]) => (
                    <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.12} /><stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="Huyết áp" stroke="#DC2626" fill="url(#g-bp)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="Nhịp tim" stroke="#2563EB" fill="url(#g-hr)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="SpO2" stroke="#059669" fill="url(#g-spo2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <DataTable columns={COLUMNS} rows={vitalSigns} total={vitalSigns.length} page={0} onPageChange={() => {}}
        isLoading={isLoading && !!selectedElderly} renderCell={renderCell} />

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} formId="vital-form"
        title={editing ? 'Cập nhật chỉ số' : 'Thêm chỉ số sức khỏe'} submitLabel={editing ? 'Cập nhật' : 'Thêm'} isSubmitting={isSubmitting}>
        <form id="vital-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Thời gian đo" type="datetime-local" InputLabelProps={{ shrink: true }} {...register('recordedAt')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Huyết áp tâm thu" type="number" {...register('bloodPressureSystolic')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Huyết áp tâm trương" type="number" {...register('bloodPressureDiastolic')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Nhịp tim (bpm)" type="number" {...register('heartRate')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Nhiệt độ (°C)" type="number" {...register('temperature')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="SpO2 (%)" type="number" {...register('oxygenSaturation')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Cân nặng (kg)" type="number" {...register('weight')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Đường huyết" type="number" {...register('bloodSugar')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Ghi chú" multiline rows={2} {...register('notes')} /></Grid>
          </Grid>
        </form>
      </FormDialog>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { await remove(deleteId!); setDeleteId(null); }} />
    </PageHeader>
  );
}
