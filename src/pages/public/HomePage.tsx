import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Avatar, Chip, Stack,
} from '@mui/material';
import {
  FavoriteOutlined, MonitorHeart, LocalPharmacy, Assignment,
  Groups, VerifiedUser, AccessTime, ArrowForward, Star,
  Phone, CheckCircle,
} from '@mui/icons-material';

const services = [
  { icon: <MonitorHeart />, title: 'Theo dõi sức khỏe', desc: 'Giám sát chỉ số sinh tồn 24/7, cảnh báo bất thường tức thì', color: '#2563EB' },
  { icon: <LocalPharmacy />, title: 'Quản lý thuốc', desc: 'Nhắc nhở uống thuốc đúng giờ, theo dõi đơn thuốc chính xác', color: '#7C3AED' },
  { icon: <Assignment />, title: 'Kế hoạch chăm sóc', desc: 'Lập kế hoạch chăm sóc cá nhân hóa cho từng người cao tuổi', color: '#059669' },
  { icon: <Groups />, title: 'Đội ngũ chuyên nghiệp', desc: 'Nhân viên được đào tạo bài bản, tận tâm và kinh nghiệm', color: '#DC2626' },
];

const stats = [
  { value: '500+', label: 'Người cao tuổi', icon: <FavoriteOutlined /> },
  { value: '50+', label: 'Nhân viên chuyên nghiệp', icon: <Groups /> },
  { value: '24/7', label: 'Hỗ trợ liên tục', icon: <AccessTime /> },
  { value: '99%', label: 'Hài lòng từ gia đình', icon: <Star /> },
];

const testimonials = [
  { name: 'Bà Nguyễn Thị Hoa', role: 'Con gái người dùng', content: 'Nhờ ElderCare, tôi yên tâm hơn rất nhiều khi biết mẹ mình được chăm sóc tốt ngay cả khi tôi bận công việc.', rating: 5 },
  { name: 'Ông Trần Văn Minh', role: 'Người dùng trực tiếp', content: 'Hệ thống nhắc nhở uống thuốc rất tiện lợi. Tôi không bao giờ quên uống thuốc nữa.', rating: 5 },
  { name: 'Chị Lê Thu Hương', role: 'Con gái người dùng', content: 'Đội ngũ nhân viên rất chu đáo, giao diện app dễ dùng, gia đình tôi rất tin tưởng.', rating: 5 },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero */}
      <Box sx={{
        minHeight: '92vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip label="🏥 Nền tảng chăm sóc hàng đầu" sx={{ bgcolor: 'rgba(37,99,235,0.2)', color: '#93C5FD', mb: 3, fontWeight: 500 }} />
              <Typography variant="h2" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.15, mb: 2 }}>
                Chăm sóc người thân{' '}
                <Box component="span" sx={{ background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  với tình yêu thương
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ color: '#94A3B8', fontWeight: 400, mb: 4, lineHeight: 1.7 }}>
                Giải pháp quản lý chăm sóc người cao tuổi toàn diện — theo dõi sức khỏe, quản lý thuốc và kết nối gia đình mọi lúc mọi nơi.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained" size="large" endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{
                    background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                    py: 1.8, px: 4, fontSize: 16, fontWeight: 700,
                    boxShadow: '0 8px 32px rgba(37,99,235,0.4)',
                    '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #6D28D9)', transform: 'translateY(-1px)', boxShadow: '0 12px 40px rgba(37,99,235,0.5)' },
                    transition: 'all 0.2s',
                  }}
                >
                  Bắt đầu miễn phí
                </Button>
                <Button
                  variant="outlined" size="large"
                  onClick={() => navigate('/services')}
                  sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff', py: 1.8, px: 4, fontSize: 16, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
                >
                  Xem dịch vụ
                </Button>
              </Stack>
              <Stack direction="row" spacing={3} mt={4}>
                {['Theo dõi 24/7', 'Bảo mật tuyệt đối', 'Hỗ trợ miễn phí'].map((t) => (
                  <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <CheckCircle sx={{ color: '#34D399', fontSize: 16 }} />
                    <Typography sx={{ color: '#94A3B8', fontSize: 13 }}>{t}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                {/* Floating cards */}
                <Box sx={{ width: 380, height: 380, borderRadius: '50%', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ width: 280, height: 280, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FavoriteOutlined sx={{ fontSize: 80, color: '#60A5FA' }} />
                  </Box>
                </Box>
                {[
                  { pos: { top: 10, left: -30 }, icon: <MonitorHeart />, label: 'Nhịp tim: 72', color: '#2563EB' },
                  { pos: { bottom: 40, right: -40 }, icon: <LocalPharmacy />, label: 'Nhắc thuốc: 8:00', color: '#7C3AED' },
                  { pos: { top: '50%', right: -60 }, icon: <VerifiedUser />, label: 'An toàn 100%', color: '#059669' },
                ].map((item, i) => (
                  <Card key={i} sx={{
                    position: 'absolute', ...item.pos, bgcolor: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
                    backdropFilter: 'blur(12px)',
                  }}>
                    <CardContent sx={{ p: '10px 14px !important', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: item.color, '& svg': { fontSize: 18 } }}>{item.icon}</Box>
                      <Typography sx={{ color: '#E2E8F0', fontSize: 12, fontWeight: 600 }}>{item.label}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: '#fff', py: 6, borderBottom: '1px solid #F1F5F9' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services */}
      <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Dịch vụ của chúng tôi" sx={{ bgcolor: 'rgba(37,99,235,0.1)', color: '#2563EB', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1.5}>Chăm sóc toàn diện</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', fontSize: 16 }}>
              Chúng tôi cung cấp đầy đủ các dịch vụ hỗ trợ người cao tuổi sống khỏe mạnh và hạnh phúc
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {services.map((s) => (
              <Grid item xs={12} sm={6} md={3} key={s.title}>
                <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid #E2E8F0', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderColor: s.color } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar sx={{ bgcolor: `${s.color}15`, width: 52, height: 52, mb: 2 }}>
                      <Box sx={{ color: s.color }}>{s.icon}</Box>
                    </Avatar>
                    <Typography fontWeight={700} fontSize={16} mb={1}>{s.title}</Typography>
                    <Typography color="text.secondary" fontSize={14} lineHeight={1.7}>{s.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 10, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Đánh giá khách hàng" sx={{ bgcolor: 'rgba(124,58,237,0.1)', color: '#7C3AED', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800}>Gia đình tin tưởng</Typography>
          </Box>
          <Grid container spacing={3}>
            {testimonials.map((t) => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid #E2E8F0', p: 1 }}>
                  <CardContent>
                    <Stack direction="row" spacing={0.3} mb={2}>
                      {[...Array(t.rating)].map((_, i) => <Star key={i} sx={{ color: '#F59E0B', fontSize: 18 }} />)}
                    </Stack>
                    <Typography color="text.secondary" fontSize={14} lineHeight={1.8} mb={3}>"{t.content}"</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', fontSize: 14, fontWeight: 700 }}>{t.name[0]}</Avatar>
                      <Box>
                        <Typography fontWeight={600} fontSize={14}>{t.name}</Typography>
                        <Typography color="text.secondary" fontSize={12}>{t.role}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: 10, background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={800} color="#fff" mb={2}>Sẵn sàng bắt đầu?</Typography>
          <Typography color="#94A3B8" fontSize={16} mb={4}>Đăng ký ngay hôm nay và nhận 30 ngày dùng thử miễn phí</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={() => navigate('/register')}
              sx={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', py: 1.8, px: 5, fontSize: 16, fontWeight: 700 }}>
              Đăng ký miễn phí
            </Button>
            <Button variant="outlined" size="large" startIcon={<Phone />} onClick={() => navigate('/contact')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', py: 1.8, px: 5, '&:hover': { borderColor: '#fff' } }}>
              Liên hệ tư vấn
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0F172A', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FavoriteOutlined sx={{ color: '#fff', fontSize: 16 }} />
              </Box>
              <Typography sx={{ color: '#fff', fontWeight: 700 }}>ElderCare</Typography>
            </Box>
            <Typography sx={{ color: '#475569', fontSize: 13 }}>© 2024 ElderCare. Tất cả quyền được bảo lưu.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
