import { Box, Grid, Card, CardContent, Typography, Avatar, alpha } from '@mui/material';
import { People, WarningAmber, Assignment, LocalPharmacy, MonitorHeart, FileDownload } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { useGetReportOverviewQuery } from '../../store/api/apiSlice';
import type { LabelValueDTO, MonthRevenueDTO } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const emptyBox = (msg = 'Chưa có dữ liệu') => (
  <EmptyState icon={<Assignment />} title={msg} description="Dữ liệu sẽ hiển thị ngay khi hệ thống ghi nhận thông tin mới" minHeight={200} />
);

function BarCard({ title, icon, data, fill, name, height = 200 }: { title: string; icon: any; data: LabelValueDTO[]; fill: string; name: string; height?: number }) {
  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: `${fill}15` }}>
            <Box sx={{ color: fill }}>{icon}</Box>
          </Avatar>
          <Typography fontWeight={700} fontSize={15} sx={{ flex: 1 }}>{title}</Typography>
        </Box>
        {data.length === 0 ? emptyBox() : (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip cursor={{ fill: 'rgba(13,148,136,0.06)' }} contentStyle={{ borderRadius: 12, border: '1px solid #EDF1F5', boxShadow: '0 8px 24px rgba(15,23,42,0.1)' }} />
              <Bar dataKey="value" fill={fill} name={name} radius={[6, 6, 0, 0]} maxBarSize={34} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function RevenueCard({ data, height = 200 }: { data: MonthRevenueDTO[]; height?: number }) {
  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(14,165,233,0.15)' }}>
            <MonitorHeart sx={{ color: '#0EA5E9', fontSize: 17 }} />
          </Avatar>
          <Typography fontWeight={700} fontSize={15} sx={{ flex: 1 }}>Doanh thu theo tháng</Typography>
        </Box>
        {data.length === 0 ? emptyBox() : (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip formatter={(v) => new Intl.NumberFormat('vi-VN').format(Number(v)) + ' VNĐ'} contentStyle={{ borderRadius: 12, border: '1px solid #EDF1F5', boxShadow: '0 8px 24px rgba(15,23,42,0.1)' }} />
              <Area type="monotone" dataKey="total" stroke="#0EA5E9" strokeWidth={2.5} fill="rgba(14,165,233,0.15)" dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }} name="Doanh thu" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function StatusListCard({ title, icon, data, color }: { title: string; icon: any; data: LabelValueDTO[]; color: string }) {
  const maxV = Math.max(1, ...data.map((d) => d.value));
  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: `${color}15` }}>
            <Box sx={{ color }}>{icon}</Box>
          </Avatar>
          <Typography fontWeight={700} fontSize={15} sx={{ flex: 1 }}>{title}</Typography>
        </Box>
        {data.length === 0 ? emptyBox() : (
          data.slice(0, 8).map((d) => (
            <Box key={d.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, my: 1.1 }}>
              <Typography fontSize={12} sx={{ width: 110, color: '#64748B' }} noWrap>{d.label}</Typography>
              <Box sx={{ flex: 1, height: 9, borderRadius: '5px', bgcolor: alpha('#E8EEF3', 0.7) }}>
                <Box sx={{ width: `${(d.value / maxV) * 100}%`, height: 9, borderRadius: '5px', background: color, transition: 'width 0.4s' }} />
              </Box>
              <Typography fontSize={12} fontWeight={700} sx={{ width: 34, textAlign: 'center' }}>{d.value}</Typography>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { data, isLoading } = useGetReportOverviewQuery();
  const o = data?.data;
  const caregiverLoad = o?.caregiverLoad ?? [];

  // Xuất toàn bộ số liệu tổng quan ra file CSV (Excel mở được tiếng Việt với BOM)
  const exportCsv = () => {
    if (!o) return;
    const lines: string[] = [];
    lines.push('BAO CAO TONG QUAN HE THONG CHAM SOC');
    lines.push(`Ngay xuat,${new Date().toLocaleString('vi-VN')}`);
    const dump = (title: string, rows: LabelValueDTO[]) => {
      lines.push('');
      lines.push(title);
      lines.push('Nhom,So luong');
      rows.forEach((r) => lines.push(`"${r.label}",${r.value}`));
    };
    dump('Nguoi cao tuoi theo trang thai', o.elderlyByStatus ?? []);
    dump('Ke hoach cham soc theo trang thai', o.planByStatus ?? []);
    dump('Cong viec ca theo trang thai', o.taskByStatus ?? []);
    dump('Lich uong thuoc theo trang thai', o.medicationScheduleByStatus ?? []);
    dump('Su co theo muc do', o.incidentBySeverity ?? []);
    dump('Phan cong nhan vien (so ca)', o.caregiverLoad ?? []);
    lines.push('');
    lines.push('Doanh thu theo thang');
    lines.push('Thang,Doanh thu (VND)');
    (o.revenueByMonth ?? []).forEach((r: MonthRevenueDTO) => lines.push(`${r.month},${r.total}`));

    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-cham-soc-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <PageHeader title="Báo cáo & Phân tích" subtitle="Thống kê hoạt động hệ thống chăm sóc" badge="LIVE">
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={3} key={i}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box className="skeleton" sx={{ height: 190, borderRadius: '12px' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageHeader>
    );
  }

  return (
    <PageHeader
      title="Báo cáo & Phân tích"
      subtitle="Thống kê hoạt động hệ thống chăm sóc"
      badge="LIVE"
      action={{ label: 'Xuất CSV', onClick: exportCsv, icon: <FileDownload /> }}
    >
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} lg={4}>
          <BarCard title="Người cao tuổi theo trạng thái" icon={<People />} data={o?.elderlyByStatus ?? []} fill="#0D9488" name="Người cao tuổi" />
        </Grid>
        <Grid item xs={12} lg={4}>
          <RevenueCard data={o?.revenueByMonth ?? []} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <BarCard title="Sự cố theo mức độ" icon={<WarningAmber />} data={o?.incidentBySeverity ?? []} fill="#EF4444" name="Sự cố" />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatusListCard title="Kế hoạch chăm sóc" icon={<Assignment />} data={o?.planByStatus ?? []} color="#0D9488" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusListCard title="Công việc ca" icon={<Assignment />} data={o?.taskByStatus ?? []} color="#10B981" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusListCard title="Lịch uống thuốc" icon={<LocalPharmacy />} data={o?.medicationScheduleByStatus ?? []} color="#F59E0B" />
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(16,185,129,0.15)' }}>
                  <People sx={{ color: '#10B981', fontSize: 17 }} />
                </Avatar>
                <Typography fontWeight={700} fontSize={15} sx={{ flex: 1 }}>Phân công nhân viên (số ca chăm sóc)</Typography>
              </Box>
              {caregiverLoad.length === 0 ? emptyBox() : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={caregiverLoad}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip cursor={{ fill: 'rgba(16,185,129,0.06)' }} contentStyle={{ borderRadius: 12, border: '1px solid #EDF1F5', boxShadow: '0 8px 24px rgba(15,23,42,0.1)' }} />
                    <Bar dataKey="value" fill="#10B981" name="Ca" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageHeader>
  );
}