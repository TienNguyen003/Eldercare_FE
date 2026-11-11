import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Box, Card, CardContent, Grid, Typography, Avatar, Chip, Divider, CircularProgress, Alert, alpha,
} from '@mui/material';
import {
  MonitorHeart, CalendarMonth, LocalPharmacy, WarningAmber, Payment as PayIcon, Person,
} from '@mui/icons-material';
import { format, isAfter, isSameDay, parseISO } from 'date-fns';
import {
  useGetMyFamilyElderliesQuery, useGetVitalSignsQuery, useGetCareSchedulesByElderlyQuery,
  useGetMedicationSchedulesByElderlyQuery, useGetIncidentReportsByElderlyQuery, useGetPaymentsByElderlyQuery,
} from '../../store/api/apiSlice';
import type { Elderly, VitalSign, CareSchedule, MedicationSchedule, IncidentReport, Payment } from '../../types';
import StatusChip from '../../components/common/StatusChip';
import EmptyState from '../../components/common/EmptyState';

const fmtVnd = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function FamilyPortalPage() {
  const { data, isLoading } = useGetMyFamilyElderliesQuery();
  const relatives: Elderly[] = data?.data ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = relatives.find((r) => r.id === selectedId) ?? relatives[0];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1.8, mb: 3 }}>
        <Box sx={{ width: 4, borderRadius: '4px', background: 'linear-gradient(180deg, #0D9488, #10B981)', flexShrink: 0 }} />
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A" sx={{ lineHeight: 1.3 }}>Người thân của tôi</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Theo dõi tình hình sức khỏe và lịch chăm sóc của người thân
          </Typography>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={32} sx={{ color: '#0D9488' }} /></Box>
      ) : relatives.length === 0 ? (
        <EmptyState
          icon={<Person />}
          title="Chưa liên kết người thân"
          description="Tài khoản của bạn chưa được liên kết với người thân nào. Vui lòng liên hệ quản lý để được gán người thân theo dõi."
          minHeight={280}
        />
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
            {relatives.map((r) => (
              <Chip
                key={r.id}
                avatar={<Avatar sx={{ bgcolor: r.id === selected?.id ? '#0D9488' : '#E2E8F0', fontSize: 13, fontWeight: 700 }}>{r.fullName[0]}</Avatar>}
                label={r.fullName}
                onClick={() => setSelectedId(r.id)}
                sx={{
                  py: 2.2, px: 0.5, fontWeight: 700, borderRadius: '12px',
                  bgcolor: r.id === selected?.id ? 'rgba(13,148,136,0.12)' : '#fff',
                  color: r.id === selected?.id ? '#0D9488' : '#475569',
                  border: '1px solid #E2E8F0',
                }}
              />
            ))}
          </Box>
          {selected && <RelativeDetail key={selected.id} elderly={selected} />}
        </>
      )}
    </Box>
  );
}

function RelativeDetail({ elderly }: { elderly: Elderly }) {
  const { data: vitalsData, isLoading: lVitals } = useGetVitalSignsQuery(elderly.id);
  const { data: schedulesData, isLoading: lSched } = useGetCareSchedulesByElderlyQuery(elderly.id);
  const { data: medsData, isLoading: lMeds } = useGetMedicationSchedulesByElderlyQuery(elderly.id);
  const { data: incidentsData } = useGetIncidentReportsByElderlyQuery(elderly.id);
  const { data: paymentsData } = useGetPaymentsByElderlyQuery(elderly.id);

  const today = new Date();
  const vitals: VitalSign[] = vitalsData?.data ?? [];
  const latestVital = useMemo(() => {
    const sorted = [...vitals].sort((a, b) => (b.recordedAt ?? '').localeCompare(a.recordedAt ?? ''));
    return sorted[0];
  }, [vitals]);

  const schedules: CareSchedule[] = useMemo(() => {
    const all = schedulesData?.data ?? [];
    return all
      .filter((s) => s.scheduledDate && !isAfter(today, parseISO(s.scheduledDate)))
      .sort((a, b) => (a.scheduledDate ?? '').localeCompare(b.scheduledDate ?? ''))
      .slice(0, 5);
  }, [schedulesData, today]);

  const medsToday: MedicationSchedule[] = useMemo(() => {
    const all = medsData?.data ?? [];
    return all.filter((m) => {
      if (!m.date) return true;
      try { return isSameDay(parseISO(m.date), today); } catch { return true; }
    });
  }, [medsData, today]);

  const incidents: IncidentReport[] = useMemo(() => {
    const all = incidentsData?.data ?? [];
    return [...all].sort((a, b) => (b.incidentDate ?? '').localeCompare(a.incidentDate ?? '')).slice(0, 5);
  }, [incidentsData]);

  const payments: Payment[] = useMemo(() => {
    const all = paymentsData?.data ?? [];
    return [...all].sort((a, b) => (b.paymentDate ?? '').localeCompare(a.paymentDate ?? '')).slice(0, 5);
  }, [paymentsData]);

  const age = elderly.dateOfBirth
    ? Math.floor((Date.now() - parseISO(elderly.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  return (
    <Box>
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', mb: 3, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.25)', fontSize: 24, fontWeight: 800 }}>
            {elderly.fullName[0]}
          </Avatar>
          <Box>
            <Typography fontWeight={800} fontSize={20} color="#fff">{elderly.fullName}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.8, flexWrap: 'wrap' }}>
              <Chip size="small" label={`Mã: ${elderly.code}`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />
              {age !== null && <Chip size="small" label={`${age} tuổi`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />}
              <Chip size="small" label={elderly.gender === 'MALE' ? 'Nam' : elderly.gender === 'FEMALE' ? 'Nữ' : 'Khác'} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />
              <Chip size="small" label={elderly.status ?? ''} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />
            </Box>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SectionCard icon={<MonitorHeart sx={{ color: '#0D9488' }} />} title="Chỉ số sức khỏe gần nhất" loading={lVitals}>
            {!latestVital ? <Empty text="Chưa có chỉ số nào được ghi nhận" /> : (
              <Grid container spacing={1.5}>
                <VitalItem label="Huyết áp" value={latestVital.bloodPressureSystolic && latestVital.bloodPressureDiastolic ? `${latestVital.bloodPressureSystolic}/${latestVital.bloodPressureDiastolic} mmHg` : '—'} />
                <VitalItem label="Nhịp tim" value={latestVital.heartRate ? `${latestVital.heartRate} bpm` : '—'} />
                <VitalItem label="Nhiệt độ" value={latestVital.temperature ? `${latestVital.temperature}°C` : '—'} />
                <VitalItem label="SpO2" value={latestVital.oxygenSaturation ? `${latestVital.oxygenSaturation}%` : '—'} />
                <VitalItem label="Đường huyết" value={latestVital.bloodSugar ? `${latestVital.bloodSugar} mg/dL` : '—'} />
                <VitalItem label="Cân nặng" value={latestVital.weight ? `${latestVital.weight} kg` : '—'} />
              </Grid>
            )}
            {latestVital?.recordedAt && (
              <Typography fontSize={11.5} color="text.disabled" mt={1.5}>
                Ghi nhận lúc: {format(parseISO(latestVital.recordedAt), 'HH:mm dd/MM/yyyy')}
              </Typography>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard icon={<CalendarMonth sx={{ color: '#0284C7' }} />} title="Lịch chăm sóc sắp tới" loading={lSched}>
            {schedules.length === 0 ? <Empty text="Không có lịch chăm sóc nào sắp tới" /> : schedules.map((s) => (
              <ListItemRow key={s.id}
                left={`${s.caregiverName ?? 'Nhân viên'} — ${s.type ?? 'Chăm sóc'}`}
                sub={`${format(parseISO(s.scheduledDate), 'dd/MM')} · ${s.startTime ?? ''}–${s.endTime ?? ''}`}
                right={<StatusChip status={s.status} />} />
            ))}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard icon={<LocalPharmacy sx={{ color: '#D97706' }} />} title="Thuốc hôm nay" loading={lMeds}>
            {medsToday.length === 0 ? <Empty text="Không có lịch uống thuốc hôm nay" /> : medsToday.map((m) => (
              <ListItemRow key={m.id}
                left={m.medicationName ?? `Thuốc #${m.medicationId}`}
                sub={`${m.dosage ?? ''}${m.timeToTake ? ` · ${m.timeToTake}` : ''}`}
                right={<StatusChip status={m.status} />} />
            ))}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard icon={<WarningAmber sx={{ color: '#DC2626' }} />} title="Sự cố gần đây">
            {incidents.length === 0 ? <Empty text="Không có sự cố nào được ghi nhận" /> : incidents.map((i) => (
              <ListItemRow key={i.id}
                left={i.description || i.type}
                sub={i.incidentDate ? format(parseISO(i.incidentDate), 'dd/MM/yyyy') : ''}
                right={<StatusChip status={i.severity} />} />
            ))}
          </SectionCard>
        </Grid>

        <Grid item xs={12}>
          <SectionCard icon={<PayIcon sx={{ color: '#059669' }} />} title="Thanh toán gần đây">
            {payments.length === 0 ? <Empty text="Chưa có hóa đơn nào" /> : payments.map((p) => (
              <ListItemRow key={p.id}
                left={p.description || 'Phí dịch vụ chăm sóc'}
                sub={p.paymentDate ? format(parseISO(p.paymentDate), 'dd/MM/yyyy') : ''}
                right={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={700} fontSize={13} color="#059669">{fmtVnd(p.amount)}</Typography>
                    <StatusChip status={p.status} />
                  </Box>
                } />
            ))}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}

function SectionCard({ icon, title, children, loading }: { icon: ReactNode; title: string; children: ReactNode; loading?: boolean }) {
  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon}
          <Typography fontWeight={800} fontSize={15}>{title}</Typography>
        </Box>
        {loading ? (
          <Box sx={{ py: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: '#0D9488' }} /></Box>
        ) : children}
      </CardContent>
    </Card>
  );
}

function VitalItem({ label, value }: { label: string; value: string }) {
  return (
    <Grid item xs={6} sm={4}>
      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha('#0D9488', 0.05), border: '1px solid #E2E8F0' }}>
        <Typography fontSize={11} color="text.secondary" fontWeight={600}>{label}</Typography>
        <Typography fontSize={15} fontWeight={800} mt={0.3}>{value}</Typography>
      </Box>
    </Grid>
  );
}

function ListItemRow({ left, sub, right }: { left: string; sub: string; right: ReactNode }) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontSize={13.5} fontWeight={600} noWrap>{left}</Typography>
          {sub && <Typography fontSize={11.5} color="text.secondary">{sub}</Typography>}
        </Box>
        {right}
      </Box>
      <Divider sx={{ borderColor: '#F1F5F9' }} />
    </>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <EmptyState
      icon={<Person />}
      title={text}
      description="Dữ liệu sẽ được cập nhật ngay khi có thông tin mới từ nhân viên chăm sóc"
      minHeight={160}
    />
  );
}
