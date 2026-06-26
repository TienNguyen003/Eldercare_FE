import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Grid, Typography, Tab, Tabs, Button, Chip,
  CircularProgress, Avatar, IconButton, Divider, List, ListItem,
  ListItemText, TextField, ListItemIcon,
} from '@mui/material';
import {
  ArrowBack, Edit, Add, Delete, Favorite, Phone, MonitorHeart,
  LocalPharmacy, Person, MedicalServices, ContactPhone, FolderOpen,
} from '@mui/icons-material';
import { format } from 'date-fns';
import {
  useGetElderlyByIdQuery, useGetElderlyProfileQuery, useGetMedicalProfileQuery,
  useGetEmergencyContactsQuery, useGetElderlyDiseasesQuery, useGetVitalSignsQuery,
  useGetDocumentsByElderlyQuery, useCreateEmergencyContactMutation, useDeleteEmergencyContactMutation,
} from '../../store/api/apiSlice';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormDialog from '../../components/common/FormDialog';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useForm } from 'react-hook-form';

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid #F8FAFC' }}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 160, flexShrink: 0 }}>{label}</Typography>
    <Typography variant="body2" fontWeight={600} color="#0F172A">{value || '—'}</Typography>
  </Box>
);

const TABS = [
  { label: 'Hồ sơ cơ bản', icon: <Person fontSize="small" /> },
  { label: 'Hồ sơ y tế', icon: <MedicalServices fontSize="small" /> },
  { label: 'Chỉ số sức khỏe', icon: <MonitorHeart fontSize="small" /> },
  { label: 'Liên hệ khẩn cấp', icon: <ContactPhone fontSize="small" /> },
  { label: 'Bệnh án', icon: <LocalPharmacy fontSize="small" /> },
  { label: 'Tài liệu', icon: <FolderOpen fontSize="small" /> },
];

export default function ElderlyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const elderlyId = Number(id);
  const [tab, setTab] = useState(0);
  const [contactDialog, setContactDialog] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null);

  const { data: elderlyData, isLoading } = useGetElderlyByIdQuery(elderlyId);
  const { data: profileData } = useGetElderlyProfileQuery(elderlyId);
  const { data: medicalData } = useGetMedicalProfileQuery(elderlyId);
  const { data: contactsData } = useGetEmergencyContactsQuery(elderlyId);
  const { data: diseasesData } = useGetElderlyDiseasesQuery(elderlyId);
  const { data: vitalData } = useGetVitalSignsQuery(elderlyId);
  const { data: docsData } = useGetDocumentsByElderlyQuery(elderlyId);
  const [createContact] = useCreateEmergencyContactMutation();
  const [deleteContact] = useDeleteEmergencyContactMutation();
  const { register, handleSubmit, reset } = useForm();

  const elderly = elderlyData?.data;
  const profile = profileData?.data;
  const medical = medicalData?.data;
  const contacts = contactsData?.data ?? [];
  const diseases = diseasesData?.data ?? [];
  const vitalSigns = vitalData?.data ?? [];
  const docs = docsData?.data ?? [];

  const chartData = vitalSigns.slice(-10).map((v) => ({
    date: format(new Date(v.recordedAt), 'dd/MM'),
    'Huyết áp': v.bloodPressureSystolic,
    'Nhịp tim': v.heartRate,
    'SpO2': v.oxygenSaturation,
  }));

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/elderly')}
        sx={{ mb: 3, color: '#64748B', fontWeight: 600, '&:hover': { bgcolor: '#F1F5F9' } }}>
        Quay lại danh sách
      </Button>

      {/* Profile header card */}
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', mb: 3, overflow: 'hidden', boxShadow: 'none' }}>
        <Box sx={{ height: 6, background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 80, height: 80, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', fontSize: 28, fontWeight: 800 }}>
              {elderly?.fullName?.[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="h5" fontWeight={800} color="#0F172A">{elderly?.fullName}</Typography>
                <StatusChip status={elderly?.status ?? 'ACTIVE'} />
              </Box>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {[
                  { label: 'Mã', value: elderly?.code },
                  { label: 'Ngày sinh', value: elderly?.dateOfBirth ? format(new Date(elderly.dateOfBirth), 'dd/MM/yyyy') : '—' },
                  { label: 'Giới tính', value: elderly?.gender === 'MALE' ? 'Nam' : 'Nữ' },
                  { label: 'SĐT', value: elderly?.phone || '—' },
                ].map((item) => (
                  <Box key={item.label}>
                    <Typography fontSize={11} color="text.secondary" textTransform="uppercase" fontWeight={600}>{item.label}</Typography>
                    <Typography fontSize={13.5} fontWeight={600} color="#0F172A">{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Button variant="outlined" startIcon={<Edit />}
              sx={{ borderRadius: '12px', borderColor: '#E2E8F0', color: '#475569', fontWeight: 600 }}>
              Chỉnh sửa
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          variant="scrollable" scrollButtons="auto"
          sx={{
            px: 2, borderBottom: '1px solid #F1F5F9',
            '& .MuiTab-root': { minHeight: 56, fontWeight: 600, fontSize: 13, textTransform: 'none', color: '#64748B', gap: 0.8 },
            '& .Mui-selected': { color: '#2563EB' },
            '& .MuiTabs-indicator': { background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: '2px', height: 3 },
          }}
        >
          {TABS.map((t) => <Tab key={t.label} label={t.label} icon={t.icon} iconPosition="start" />)}
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {/* Tab 0 - Basic profile */}
          {tab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700} fontSize={15} mb={2} color="#0F172A">Thông tin cơ bản</Typography>
                <InfoRow label="Địa chỉ" value={elderly?.address} />
                <InfoRow label="Chiều cao (cm)" value={profile?.height} />
                <InfoRow label="Cân nặng (kg)" value={profile?.weight} />
                <InfoRow label="Nhóm máu" value={profile?.bloodType} />
                <InfoRow label="Dị ứng" value={profile?.allergies} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700} fontSize={15} mb={2} color="#0F172A">Ghi chú</Typography>
                <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', minHeight: 120 }}>
                  <Typography fontSize={14} color="text.secondary" lineHeight={1.7}>
                    {profile?.notes || 'Không có ghi chú'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Tab 1 - Medical */}
          {tab === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <InfoRow label="Chẩn đoán chính" value={medical?.primaryDiagnosis} />
                <InfoRow label="Chẩn đoán phụ" value={medical?.secondaryDiagnosis} />
                <InfoRow label="Lịch sử phẫu thuật" value={medical?.surgicalHistory} />
                <InfoRow label="Tiền sử gia đình" value={medical?.familyHistory} />
              </Grid>
            </Grid>
          )}

          {/* Tab 2 - Vitals */}
          {tab === 2 && (
            <Box>
              {/* Summary chips */}
              {vitalSigns.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  {[
                    { label: `${vitalSigns[vitalSigns.length - 1]?.bloodPressureSystolic}/${vitalSigns[vitalSigns.length - 1]?.bloodPressureDiastolic} mmHg`, title: 'Huyết áp', color: '#DC2626', bg: '#FEF2F2' },
                    { label: `${vitalSigns[vitalSigns.length - 1]?.heartRate} bpm`, title: 'Nhịp tim', color: '#2563EB', bg: '#EFF6FF' },
                    { label: `${vitalSigns[vitalSigns.length - 1]?.oxygenSaturation}%`, title: 'SpO2', color: '#059669', bg: '#ECFDF5' },
                  ].map((item) => (
                    <Box key={item.title} sx={{ p: 2, bgcolor: item.bg, borderRadius: '14px', minWidth: 130 }}>
                      <Typography fontSize={11} color={item.color} fontWeight={700} textTransform="uppercase">{item.title}</Typography>
                      <Typography fontSize={22} fontWeight={800} color={item.color}>{item.label}</Typography>
                      <Typography fontSize={11} color="text.secondary">Lần đo gần nhất</Typography>
                    </Box>
                  ))}
                </Box>
              )}
              {chartData.length > 0 ? (
                <Box>
                  <Typography fontWeight={700} fontSize={15} mb={2}>Biểu đồ 10 lần đo gần nhất</Typography>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={chartData}>
                      <defs>
                        {[['bp', '#DC2626'], ['hr', '#2563EB'], ['spo2', '#059669']].map(([k, c]) => (
                          <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={c} stopOpacity={0.1} />
                            <stop offset="95%" stopColor={c} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                      <Area type="monotone" dataKey="Huyết áp" stroke="#DC2626" fill="url(#grad-bp)" strokeWidth={2} />
                      <Area type="monotone" dataKey="Nhịp tim" stroke="#2563EB" fill="url(#grad-hr)" strokeWidth={2} />
                      <Area type="monotone" dataKey="SpO2" stroke="#059669" fill="url(#grad-spo2)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>Chưa có dữ liệu chỉ số sức khỏe</Typography>
              )}
            </Box>
          )}

          {/* Tab 3 - Emergency contacts */}
          {tab === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography fontWeight={700} fontSize={15}>Liên hệ khẩn cấp ({contacts.length})</Typography>
                <Button startIcon={<Add />} variant="contained" size="small"
                  onClick={() => { reset(); setContactDialog(true); }}
                  sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', fontWeight: 700 }}>
                  Thêm liên hệ
                </Button>
              </Box>
              {contacts.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>Chưa có liên hệ khẩn cấp</Typography>
              ) : (
                <Grid container spacing={2}>
                  {contacts.map((c) => (
                    <Grid item xs={12} sm={6} key={c.id}>
                      <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700 }}>{c.name?.[0]}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                            <Typography fontWeight={700} fontSize={14}>{c.name}</Typography>
                            {c.isPrimary && <Chip label="Chính" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: 10, height: 18 }} />}
                          </Box>
                          <Typography fontSize={12} color="text.secondary">{c.relationship} · {c.phone}</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setDeleteContactId(c.id)}
                          sx={{ bgcolor: '#FEF2F2', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Tab 4 - Diseases */}
          {tab === 4 && (
            <Box>
              <Typography fontWeight={700} fontSize={15} mb={2}>Bệnh án ({diseases.length})</Typography>
              {diseases.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>Chưa có bệnh án được ghi nhận</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {diseases.map((d) => (
                    <Chip key={d.id} label={d.diseaseName || `Bệnh #${d.diseaseId}`}
                      sx={{ bgcolor: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', fontWeight: 600, borderRadius: '10px' }} />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Tab 5 - Documents */}
          {tab === 5 && (
            <Box>
              <Typography fontWeight={700} fontSize={15} mb={2}>Tài liệu ({docs.length})</Typography>
              {docs.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>Chưa có tài liệu</Typography>
              ) : (
                <Grid container spacing={2}>
                  {docs.map((d) => (
                    <Grid item xs={12} sm={6} key={d.id}>
                      <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FolderOpen sx={{ color: '#2563EB', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography fontWeight={600} fontSize={13.5}>{d.title}</Typography>
                          <Typography fontSize={12} color="text.secondary">{d.type} · {d.uploadedAt ? format(new Date(d.uploadedAt), 'dd/MM/yyyy') : ''}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add contact dialog */}
      <FormDialog open={contactDialog} onClose={() => setContactDialog(false)} formId="contact-form" title="Thêm liên hệ khẩn cấp">
        <form id="contact-form" onSubmit={handleSubmit(async (values) => { await createContact({ ...values, elderlyId }); setContactDialog(false); reset(); })}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Họ tên *" {...register('name')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Quan hệ" {...register('relationship')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Điện thoại *" {...register('phone')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email" {...register('email')} /></Grid>
          </Grid>
        </form>
      </FormDialog>

      <ConfirmDialog open={!!deleteContactId} onClose={() => setDeleteContactId(null)}
        onConfirm={async () => { await deleteContact(deleteContactId!); setDeleteContactId(null); }}
        message="Bạn có chắc muốn xóa liên hệ khẩn cấp này không?" />
    </Box>
  );
}
