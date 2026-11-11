import { Box, Grid, Card, CardContent, Typography, Avatar, Chip, Stack, Button, alpha } from '@mui/material';
import { People, PersonOutlined, WarningAmber, Payment, TrendingUp, TrendingDown, Assignment, NotificationsActive, Download, Assessment } from '@mui/icons-material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { useGetElderliesQuery, useGetCaregiversQuery, useGetIncidentReportsQuery, useGetPaymentsQuery, useGetCarePlansQuery } from '../store/api/apiSlice';

const mockMonthly = [
  { month: 'T1', elderly:  12, incidents:  2 },
  { month: 'T2', elderly:  15, incidents:  1 },
  { month: 'T3', elderly:  14, incidents:  3 },
  { month: 'T4', elderly:  18, incidents:  1 },
  { month: 'T5', elderly:  20, incidents:  2 },
  { month: 'T6', elderly:  22, incidents:  4 },
];

const mockPayments = [
  { month: 'T1', amount:  15000000 },
  { month: 'T2', amount:  18000000 },
  { month: 'T3', amount:  14000000 },
  { month: 'T4', amount:  22000000 },
  { month: 'T5', amount:  25000000 },
  { month: 'T6', amount:  30000000 },
];

const alerts = [
  { msg: 'Phát hiện nhịp tim bất thường — Cụ Nguyễn Văn A', time: '2 phút trước', color: '#EF4444', bg: '#FEF2F2' },
  { msg: 'Nhắc nhở uống thuốc — Cụ Trần Thị B', time: '25 phút trước', color: '#D97706', bg: '#FFFBEB' },
  { msg: 'Hoàn thành đánh giá chức năng — Cụ Lê Văn C', time: '1 giờ trước', color: '#0D9488', bg: '#E6F7F4' },
  { msg: 'Thanh toán gói Tiêu chuẩn thành công', time: '3 giờ trước', color: '#0EA5E9', bg: '#EFF8FE' },
];

const vnd = (v: number) => new Intl.NumberFormat('vi').format(v);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon, gradient, trend, trendUp }: StatCardProps) => (
  <Card sx={{
    borderRadius: '22px', border: '1px solid #EDF1F5', overflow: 'hidden', position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 45px rgba(15,23,42,0.12)', borderColor: alpha('#0D9488', 0.3) },
  }}>
    <Box sx={{ position: 'absolute', top: 0, left:  0, right:  0, height: 3.5, background: gradient }} />
    <CardContent sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', right: -14, bottom: -26, opacity: 0.055, pointerEvents: 'none', transform: 'rotate(-10deg)', '& svg': { fontSize: 110, color: '#0F172A' } }}>
        {icon}
      </Box>
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" fontSize={13} fontWeight={500} mb={0.5}>{title}</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.2, color: '#0F172A' }}>{value}</Typography>
          {trend && (
            <Chip size="small" icon={trendUp ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
              label={trend} sx={{ mt: 1, bgcolor: trendUp ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: trendUp ? '#059669' : '#DC2626', fontWeight: 600, fontSize:  11 } } />
          )}
        </Box>
        <Avatar sx={{ width: 54, height: 54, background: gradient, boxShadow: `0 10px 24px rgba(15,23,42,0.18)` }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { data: elderliesData, isLoading: l1 } = useGetElderliesQuery({});
  const { data: caregiversData, isLoading: l2 } = useGetCaregiversQuery({});
  const { data: incidentsData, isLoading: l3 } = useGetIncidentReportsQuery({});
  const { data: paymentsData, isLoading: l4 } = useGetPaymentsQuery({});
  const { data: carePlansData } = useGetCarePlansQuery({});

  if (l1 || l2 || l3 || l4) return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box className="skeleton" sx={{ width: 190, height: 16, mb: 1.5 }} />
          <Box className="skeleton" sx={{ width: 280, height: 30 }} />
        </Box>
        <Box className="skeleton" sx={{ width: 140, height: 42, borderRadius: '12px' }} />
      </Box>
      <Grid container spacing={3} mb={3}>
        {[0, 1, 2, 3].map((i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Card sx={{ borderRadius: '22px', p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Box className="skeleton" sx={{ width: '70%', height: 12, mb: 1.5 }} />
                  <Box className="skeleton" sx={{ width: '45%', height: 28 }} />
                </Box>
                <Box className="skeleton" sx={{ width: 54, height: 54, borderRadius: '50%' }} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, borderRadius: '20px' }}>
            <Box className="skeleton" sx={{ width: 220, height: 18, mb: 2.5 }} />
            <Box className="skeleton" sx={{ width: '100%', height: 240 }} />
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: '20px', height: '100%' }}>
            <Box className="skeleton" sx={{ width: 160, height: 18, mb: 2.5 }} />
            {[0, 1, 2, 3].map((i) => (
              <Box className="skeleton" key={i} sx={{ width: '100%', height: 52, mb: 1.5, borderRadius: '14px' }} />
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const totalElderly = elderliesData?.data?.totalElements ?? 0;
  const totalCaregivers = caregiversData?.data?.totalElements ??  0;
  const totalIncidents = incidentsData?.data?.totalElements ??  0;
  const totalPayments = paymentsData?.data?.content?.reduce((s: number, p: any) => s + (p.amount ?? 0), 0) ?? 0;

  const planStats = [
    { label: 'Đang thực hiện', count: carePlansData?.data?.content?.filter((p: any) => p.status === 'ACTIVE').length ??  0, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Hoàn thành', count: carePlansData?.data?.content?.filter((p: any) =>
      p.status === 'COMPLETED').length ??  0, color: '#0D9488', bg: '#E6F7F4' },
    { label: 'Chờ duyệt', count: carePlansData?.data?.content?.filter((p: any) => p.status === 'PENDING').length ??  0, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Đã hủy', count: carePlansData?.data?.content?.filter((p: any) => p.status === 'CANCELLED').length ??  0, color: '#DC2626', bg: '#FEF2F2' },
  ];

  const today = new Date();
  const dateStr = today.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <Box>
      {/* Banner chào mừng */}
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', px: { xs: 3, md: 4 }, py: { xs: 3, md: 3.5 }, mb: 3, color: '#fff', background: 'linear-gradient(135deg, #0B1220 0%, #103334 55%, #0B1220 100%)', boxShadow: '0 24px 50px rgba(11,18,32,0.35)' }}>
        <Box sx={{ position: 'absolute', top: '-70%', right: '4%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-90%', left: '30%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ color: '#5EEAD4', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 1 }}>{dateStr}</Typography>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.25 }}>Xin chào, {user?.username ?? 'bạn'} 👋</Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: 13.5, mt: 0.7 }}>Chào mừng trở lại — đây là tình hình hoạt động hôm nay của hệ thống</Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" startIcon={<Assessment fontSize="small" />} onClick={() => navigate('/reports')} sx={{ background: 'linear-gradient(135deg, #0D9488, #10B981)', fontWeight: 700, borderRadius: '12px', px: 2.5, boxShadow: '0 8px 20px rgba(13,148,136,0.4)', '&:hover': { background: 'linear-gradient(135deg, #0B7A70, #059669)' } }}>
              Xem báo cáo
            </Button>
            <Button variant="outlined" startIcon={<Download fontSize="small" />} sx={{ borderRadius: '12px', borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontWeight: 600, '&:hover': { borderColor: '#5EEAD4', color: '#5EEAD4', bgcolor: 'rgba(94,234,212,0.06)' } }}>
              Xuất báo cáo
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Tổng người cao tuổi" value={totalElderly} icon={<People />} gradient="linear-gradient(135deg,#0D9488,#10B981)"
            trend="+12% so với tháng trước" trendUp />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Nhân viên chăm sóc" value={totalCaregivers} icon={<PersonOutlined />} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)"
            trend="+4 nhân viên mới" trendUp />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Sự cố đã ghi nhận" value={totalIncidents} icon={<WarningAmber />} gradient="linear-gradient(135deg,#EF4444,#F87171)"
            trend="-8% so với tháng trước" trendUp />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Doanh thu tháng này" value={`${vnd(totalPayments)}đ`} icon={<Payment />} gradient="linear-gradient(135deg,#0EA5E9,#38BDF8)"
            trend="+20% tổng thể" trendUp />
        </Grid>
      </Grid>

{/* Charts + plan */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5' }}>
            <CardContent sx={{ p:  3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb:  2.5, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>Tăng trưởng người cao tuổi & sự cố</Typography>
                  <Typography color="text.secondary" fontSize={13}>6 tháng gần nhất</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label="Người cao tuổi" size="small" sx={{ bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', fontWeight: 600 }} />
                  <Chip label="Sự cố" size="small" sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#DC2626', fontWeight: 600 }} />
                </Stack>
              </Box>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={mockMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(13,148,136,0.06)' }} contentStyle={{ borderRadius: 12, border: '1px solid #EDF1F5', boxShadow: '0 8px 24px rgba(15,23,42,0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="elderly" fill="#0D9488" name="Người cao tuổi" radius={[6,6,0,0]} maxBarSize={26} />
                  <Bar dataKey="incidents" fill="#EF4444" name="Sự cố" radius={[6,6,0,0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5', height: '100%' }}>
            <CardContent sx={{ p:  3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb:  2.5 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Assignment sx={{ color: '#0D9488', fontSize: 18 }} />
                </Box>
                <Typography fontWeight={700} fontSize={16}>Kế hoạch chăm sóc</Typography>
              </Box>
              <Stack spacing={1.5}>
                {planStats.map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p:  1.8, borderRadius: '14px', bgcolor: item.bg, border: '1px solid rgba(15,23,42,0.03)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: item.color, boxShadow: `0 0 0 3px ${item.color}22` }} />
                      <Typography fontSize={13.5} fontWeight={500}>{item.label}</Typography>
                    </Box>
                    <Typography fontWeight={800} fontSize={20} sx={{ color: item.color }}>{item.count}</Typography>
                  </Box>
                ))}
              </Stack>
              <Button fullWidth size="small" onClick={() => navigate('/care-plans')} sx={{ mt:  2, borderRadius: '11px', color: '#0D9488', fontWeight: 600 }}>
                Xem tất cả kế hoạch →
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

{/* Revenue + alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5' }}>
            <CardContent sx={{ p:  3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb:  2.5, flexWrap: 'wrap', gap:  1 }}>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>Doanh thu theo tháng</Typography>
                  <Typography color="text.secondary" fontSize={13}>6 tháng gần nhất (VNĐ)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUp sx={{ color: '#10B981', fontSize:  18 }} />
                  <Typography fontSize={13} fontWeight={600} color="#10B981">+20% tổng thể</Typography>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockPayments}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip formatter={(v) => new Intl.NumberFormat('vi').format(Number(v)) + ' VNĐ'} contentStyle={{ borderRadius: 12, border: '1px solid #EDF1F5', boxShadow: '0 8px 24px rgba(15,23,42,0.1)' }} />
                  <Area type="monotone" dataKey="amount" stroke="#0D9488" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ fill: '#0D9488', strokeWidth: 2, r:  4 }} name="Doanh thu" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #EDF1F5', height: '100%' }}>
            <CardContent sx={{ p:  3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap:  1, mb:  2.5 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <NotificationsActive sx={{ color: '#DC2626', fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>Cảnh báo gần đây</Typography>
                  <Typography color="text.secondary" fontSize={12}>Hoạt động cần chú ý</Typography>
                </Box>
              </Box>
              <Stack spacing={1.5}>
                {alerts.map((a, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, p:  1.5, borderRadius: '14px', bgcolor: a.bg }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: a.color, mt:  0.5, flexShrink:  0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontSize={13} lineHeight={1.5} fontWeight={500}>{a.msg}</Typography>
                      <Typography fontSize={11.5} color="text.secondary" mt={0.3}>{a.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Button fullWidth size="small" onClick={() => navigate('/notifications')} sx={{ mt:  2, borderRadius: '11px', color: '#475569', fontWeight: 600 }}>
                Xem tất cả thông báo →
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}