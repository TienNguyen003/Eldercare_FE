import { Box, Grid, Card, CardContent, Typography, CircularProgress, Avatar, Chip, Stack } from '@mui/material';
import { People, PersonOutlined, WarningAmber, Payment, TrendingUp, TrendingDown, Assignment } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, Area, AreaChart } from 'recharts';
import { useGetElderliesQuery, useGetCaregiversQuery, useGetIncidentReportsQuery, useGetPaymentsQuery, useGetCarePlansQuery } from '../store/api/apiSlice';

const mockMonthly = [
  { month: 'T1', elderly: 12, incidents: 2 }, { month: 'T2', elderly: 15, incidents: 1 },
  { month: 'T3', elderly: 14, incidents: 3 }, { month: 'T4', elderly: 18, incidents: 1 },
  { month: 'T5', elderly: 20, incidents: 2 }, { month: 'T6', elderly: 22, incidents: 4 },
];

const mockPayments = [
  { month: 'T1', amount: 15000000 }, { month: 'T2', amount: 18000000 },
  { month: 'T3', amount: 14000000 }, { month: 'T4', amount: 22000000 },
  { month: 'T5', amount: 25000000 }, { month: 'T6', amount: 30000000 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon, gradient, trend, trendUp }: StatCardProps) => (
  <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'visible', position: 'relative' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" fontSize={13} fontWeight={500} mb={0.5}>{title}</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.2, color: '#0F172A' }}>{value}</Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              {trendUp ? <TrendingUp sx={{ fontSize: 14, color: '#10B981' }} /> : <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />}
              <Typography fontSize={12} sx={{ color: trendUp ? '#10B981' : '#EF4444', fontWeight: 600 }}>{trend}</Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ width: 52, height: 52, background: gradient, boxShadow: `0 8px 20px rgba(0,0,0,0.15)` }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { data: elderliesData, isLoading: l1 } = useGetElderliesQuery({});
  const { data: caregiversData, isLoading: l2 } = useGetCaregiversQuery({});
  const { data: incidentsData, isLoading: l3 } = useGetIncidentReportsQuery({});
  const { data: paymentsData, isLoading: l4 } = useGetPaymentsQuery({});
  const { data: carePlansData } = useGetCarePlansQuery({});

  if (l1 || l2 || l3 || l4) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  const totalElderly = elderliesData?.data?.totalElements ?? 0;
  const totalCaregivers = caregiversData?.data?.totalElements ?? 0;
  const totalIncidents = incidentsData?.data?.totalElements ?? 0;
  const totalPayments = paymentsData?.data?.content?.reduce((s: number, p: any) => s + (p.amount ?? 0), 0) ?? 0;

  const planStats = [
    { label: 'Đang thực hiện', count: carePlansData?.data?.content?.filter((p: any) => p.status === 'ACTIVE').length ?? 0, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Hoàn thành', count: carePlansData?.data?.content?.filter((p: any) => p.status === 'COMPLETED').length ?? 0, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Chờ duyệt', count: carePlansData?.data?.content?.filter((p: any) => p.status === 'PENDING').length ?? 0, color: '#F59E0B', bg: '#FFFBEB' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#0F172A">Tổng quan hệ thống</Typography>
        <Typography color="text.secondary" fontSize={14} mt={0.5}>Xin chào! Đây là tóm tắt hoạt động hôm nay.</Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng người cao tuổi" value={totalElderly} icon={<People sx={{ color: '#fff' }} />} gradient="linear-gradient(135deg, #2563EB, #3B82F6)" trend="+5% tháng này" trendUp />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Nhân viên chăm sóc" value={totalCaregivers} icon={<PersonOutlined sx={{ color: '#fff' }} />} gradient="linear-gradient(135deg, #7C3AED, #8B5CF6)" trend="+2 mới" trendUp />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Sự cố báo cáo" value={totalIncidents} icon={<WarningAmber sx={{ color: '#fff' }} />} gradient="linear-gradient(135deg, #DC2626, #EF4444)" trend="-12% so với trước" trendUp={false} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Doanh thu (VNĐ)" value={new Intl.NumberFormat('vi').format(totalPayments)} icon={<Payment sx={{ color: '#fff' }} />} gradient="linear-gradient(135deg, #059669, #10B981)" trend="+20% tháng này" trendUp />
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>Thống kê theo tháng</Typography>
                  <Typography color="text.secondary" fontSize={13}>Người cao tuổi & sự cố 6 tháng gần nhất</Typography>
                </Box>
                <Chip label="6 tháng" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600 }} />
              </Box>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={mockMonthly} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Legend />
                  <Bar dataKey="elderly" fill="#2563EB" name="Người già" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="incidents" fill="#EF4444" name="Sự cố" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Assignment sx={{ color: '#2563EB', fontSize: 20 }} />
                <Typography fontWeight={700} fontSize={16}>Kế hoạch chăm sóc</Typography>
              </Box>
              <Stack spacing={2}>
                {planStats.map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: '14px', bgcolor: item.bg }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography fontSize={13} fontWeight={500}>{item.label}</Typography>
                    </Box>
                    <Typography fontWeight={800} fontSize={20} sx={{ color: item.color }}>{item.count}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue chart */}
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography fontWeight={700} fontSize={16}>Doanh thu theo tháng</Typography>
              <Typography color="text.secondary" fontSize={13}>6 tháng gần nhất (VNĐ)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp sx={{ color: '#10B981', fontSize: 18 }} />
              <Typography fontSize={13} fontWeight={600} color="#10B981">+20% tổng thể</Typography>
            </Box>
          </Box>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockPayments}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => new Intl.NumberFormat('vi').format(v) + ' VNĐ'} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }} name="Doanh thu" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
