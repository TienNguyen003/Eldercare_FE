import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { MonitorHeart, LocalPharmacy, Assignment, Groups, CalendarMonth, WarningAmber, CheckCircle, ArrowForward } from '@mui/icons-material';

const packages = [
  {
    name: 'Cơ bản', price: '2.500.000', period: '/tháng', color: '#2563EB',
    features: ['Theo dõi sức khỏe cơ bản', 'Nhắc nhở uống thuốc', 'Báo cáo hàng tuần', 'Hỗ trợ giờ hành chính'],
  },
  {
    name: 'Tiêu chuẩn', price: '5.000.000', period: '/tháng', color: '#7C3AED', popular: true,
    features: ['Tất cả gói Cơ bản', 'Giám sát 24/7', 'Kế hoạch chăm sóc cá nhân', 'Báo cáo thời gian thực', 'Hỗ trợ 24/7'],
  },
  {
    name: 'Cao cấp', price: '8.000.000', period: '/tháng', color: '#059669',
    features: ['Tất cả gói Tiêu chuẩn', 'Nhân viên chuyên trách', 'Đánh giá sức khỏe định kỳ', 'Tư vấn bác sĩ online', 'Quản lý toàn diện'],
  },
];

const serviceDetails = [
  { icon: <MonitorHeart />, title: 'Theo dõi chỉ số sức khỏe', color: '#2563EB', items: ['Đo huyết áp, nhịp tim, nhiệt độ', 'Cảnh báo bất thường tức thì', 'Lưu trữ lịch sử sức khỏe', 'Biểu đồ xu hướng sức khỏe'] },
  { icon: <LocalPharmacy />, title: 'Quản lý thuốc', color: '#7C3AED', items: ['Quản lý đơn thuốc chi tiết', 'Nhắc nhở uống thuốc đúng giờ', 'Cảnh báo tương tác thuốc', 'Theo dõi tồn kho thuốc'] },
  { icon: <Assignment />, title: 'Kế hoạch chăm sóc', color: '#059669', items: ['Lập kế hoạch cá nhân hóa', 'Phân công nhân viên phù hợp', 'Theo dõi tiến độ thực hiện', 'Báo cáo định kỳ cho gia đình'] },
  { icon: <CalendarMonth />, title: 'Lịch chăm sóc', color: '#DC2626', items: ['Lên lịch chăm sóc linh hoạt', 'Nhắc lịch tự động', 'Điều phối nhân viên thông minh', 'Quản lý ca làm việc'] },
  { icon: <Groups />, title: 'Đội ngũ chuyên nghiệp', color: '#D97706', items: ['Nhân viên được chứng nhận', 'Đào tạo định kỳ', 'Đánh giá năng lực thường xuyên', 'Hỗ trợ tâm lý cho người cao tuổi'] },
  { icon: <WarningAmber />, title: 'Quản lý sự cố', color: '#6366F1', items: ['Ghi nhận sự cố tức thì', 'Phân loại mức độ ưu tiên', 'Thông báo cho gia đình', 'Báo cáo và phân tích'] },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0F172A, #1E3A5F)', py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Chip label="Dịch vụ" sx={{ bgcolor: 'rgba(37,99,235,0.2)', color: '#93C5FD', fontWeight: 600, mb: 3 }} />
          <Typography variant="h2" fontWeight={800} color="#fff" mb={2}>Dịch vụ chăm sóc toàn diện</Typography>
          <Typography color="#94A3B8" fontSize={17} lineHeight={1.8}>
            Chúng tôi cung cấp các dịch vụ chăm sóc người cao tuổi chất lượng cao, được cá nhân hóa cho từng người
          </Typography>
        </Container>
      </Box>

      {/* Services grid */}
      <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {serviceDetails.map((s) => (
              <Grid item xs={12} md={4} key={s.title}>
                <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid #E2E8F0', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }, transition: 'all 0.3s' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar sx={{ bgcolor: `${s.color}15`, width: 52, height: 52, mb: 2 }}>
                      <Box sx={{ color: s.color }}>{s.icon}</Box>
                    </Avatar>
                    <Typography fontWeight={700} fontSize={17} mb={2}>{s.title}</Typography>
                    <List dense disablePadding>
                      {s.items.map((item) => (
                        <ListItem key={item} disableGutters sx={{ py: 0.3 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}><CheckCircle sx={{ color: s.color, fontSize: 16 }} /></ListItemIcon>
                          <ListItemText primary={item} primaryTypographyProps={{ fontSize: 13, color: '#475569' }} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing */}
      <Box sx={{ py: 10, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight={800} mb={1.5}>Bảng giá dịch vụ</Typography>
            <Typography color="text.secondary" fontSize={16}>Chọn gói phù hợp với nhu cầu của gia đình bạn</Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {packages.map((pkg) => (
              <Grid item xs={12} md={4} key={pkg.name}>
                <Card sx={{
                  height: '100%', borderRadius: '20px', position: 'relative', overflow: 'visible',
                  border: pkg.popular ? `2px solid ${pkg.color}` : '1px solid #E2E8F0',
                  boxShadow: pkg.popular ? `0 20px 60px ${pkg.color}25` : 'none',
                }}>
                  {pkg.popular && (
                    <Chip label="Phổ biến nhất" size="small" sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', bgcolor: pkg.color, color: '#fff', fontWeight: 700 }} />
                  )}
                  <CardContent sx={{ p: 3.5 }}>
                    <Typography variant="h5" fontWeight={700} mb={0.5}>{pkg.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 3 }}>
                      <Typography variant="h3" fontWeight={800} sx={{ color: pkg.color }}>{pkg.price}</Typography>
                      <Typography color="text.secondary" fontSize={14}>đ{pkg.period}</Typography>
                    </Box>
                    <List dense disablePadding sx={{ mb: 3 }}>
                      {pkg.features.map((f) => (
                        <ListItem key={f} disableGutters sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color: pkg.color, fontSize: 18 }} /></ListItemIcon>
                          <ListItemText primary={f} primaryTypographyProps={{ fontSize: 14 }} />
                        </ListItem>
                      ))}
                    </List>
                    <Button fullWidth variant={pkg.popular ? 'contained' : 'outlined'} endIcon={<ArrowForward />}
                      onClick={() => navigate('/register')}
                      sx={{
                        py: 1.5, fontWeight: 700, borderRadius: '12px',
                        ...(pkg.popular ? { background: `linear-gradient(135deg, ${pkg.color}, #7C3AED)` } : { borderColor: pkg.color, color: pkg.color }),
                      }}>
                      Đăng ký ngay
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
