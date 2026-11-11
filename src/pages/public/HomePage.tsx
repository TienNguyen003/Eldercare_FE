import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Avatar, Chip, Stack, alpha,
} from '@mui/material';
import {
  Favorite, MonitorHeart, LocalPharmacy, Assignment, Groups,
  VerifiedUser, AccessTime, ArrowForward, Star, Phone, CheckCircle, Security,
} from '@mui/icons-material';
import SmartImage from '../../components/public/SmartImage';

const services = [
  { icon: <MonitorHeart />, title: 'Theo dõi sức khỏe', desc: 'Giám sát chỉ số sinh tồn 24/7, cảnh báo bất thường tức thì', color: '#0D9488', bg: 'rgba(13,148,136,0.12)' },
  { icon: <LocalPharmacy />, title: 'Quản lý thuốc', desc: 'Nhắc nhở uống thuốc đúng giờ, theo dõi đơn thuốc chính xác', color: '#F59E0B', bg: 'rgba(245,158,11,0.14)' },
  { icon: <Assignment />, title: 'Kế hoạch chăm sóc', desc: 'Lập kế hoạch chăm sóc cá nhân hóa cho từng người cao tuổi', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { icon: <Groups />, title: 'Đội ngũ chuyên nghiệp', desc: 'Nhân viên được đào tạo bài bản, tận tâm và giàu kinh nghiệm', color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)' },
];

const steps = [
  { title: 'Đăng ký dịch vụ', desc: 'Chọn gói phù hợp với nhu cầu gia đình và hoàn tất đăng ký trong vài phút' },
  { title: 'Lên kế hoạch chăm sóc', desc: 'Đội ngũ tư vấn xây dựng kế hoạch chăm sóc riêng cho người thân của bạn' },
  { title: 'Theo dõi mọi lúc', desc: 'Nhận báo cáo sức khỏe, lịch thuốc và cập nhật tình trạng thời gian thực' },
];

const stats = [
  { value: '500+', label: 'Người cao tuổi', icon: <Favorite /> },
  { value: '50+', label: 'Nhân viên chuyên nghiệp', icon: <Groups /> },
  { value: '24/7', label: 'Hỗ trợ liên tục', icon: <AccessTime /> },
  { value: '99%', label: 'Hài lòng từ gia đình', icon: <Star /> },
];

const testimonials = [
  {
    name: 'Bà Nguyễn Thị Hoa', role: 'Con gái người dùng', rating: 5,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=70',
    content: 'Nhờ ElderCare, tôi yên tâm hơn rất nhiều khi biết mẹ mình được chăm sóc tốt ngay cả khi tôi bận công việc.',
  },
  {
    name: 'Ông Trần Văn Minh', role: 'Người dùng trực tiếp', rating: 5,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=70',
    content: 'Hệ thống nhắc nhở uống thuốc rất tiện lợi. Tôi không bao giờ quên uống thuốc nữa.',
  },
  {
    name: 'Chị Lê Thu Hương', role: 'Con gái người dùng', rating: 5,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=70',
    content: 'Đội ngũ nhân viên rất chu đáo, giao diện app dễ dùng, gia đình tôi rất tin tưởng.',
  },
];

const whyPoints = [
  { icon: <VerifiedUser />, title: 'Nhân viên được chứng nhận', desc: 'Đào tạo bài bản, kiểm tra lý lịch rõ ràng và đánh giá năng lực định kỳ' },
  { icon: <MonitorHeart />, title: 'Giám sát sức khỏe 24/7', desc: 'Chỉ số sinh tồn cập nhật liên tục, cảnh báo tức thì khi có bất thường' },
  { icon: <Groups />, title: 'Gia đình luôn được kết nối', desc: 'Báo cáo chăm sóc và hình ảnh cập nhật hằng ngày trên ứng dụng' },
  { icon: <Security />, title: 'Dữ liệu bảo mật chuẩn y tế', desc: 'Mã hóa end-to-end, tuân thủ nghiêm ngặt quy định bảo vệ dữ liệu cá nhân' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* ============ HERO ============ */}
      <Box sx={{
        minHeight: '92vh',
        background: 'linear-gradient(140deg,#0B1220 0%,#103334 48%,#0B1220 100%)',
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative glows */}
        <Box sx={{ position: 'absolute', top: '-6%', right: '4%', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.22) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulseGlow 8s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '2%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: '30%', left: '40%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md:  4 }, pb:  8 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip icon={<VerifiedUser sx={{ fontSize: 15 }} />} label="Nền tảng chăm sóc hàng đầu"
                sx={{ bgcolor: 'rgba(13,148,136,0.2)', color: '#5EEAD4', fontWeight: 600, border: '1px solid rgba(94,234,212,0.25)', '& .MuiChip-icon': { color: '#5EEAD4' } }} />
              <Typography variant="h2" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.14, mb:  2, mt:  2, fontSize: { xs: 30, sm:  38, md:  44 } }}>
                Chăm sóc người thân{' '}
                <Box component="span" sx={{ background: 'linear-gradient(135deg,#5EEAD4,#6EE7B7,#FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  với tình yêu thương
                </Box>
              </Typography>
              <Typography sx={{ color: '#94A3B8', fontWeight: 400, mb:  4, lineHeight:  1.8, fontSize: { xs: 15, md:  16.5 } }}>
                Giải pháp quản lý chăm sóc người cao tuổi toàn diện — theo dõi sức khỏe, quản lý thuốc và kết nối gia đình mọi lúc mọi nơi.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mb={3}>
                <Button variant="contained" size="large" onClick={() => navigate('/register')}
                  sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', px:  4, py:  1.6, fontSize:  15, fontWeight: 700, borderRadius: '14px', boxShadow: '0 10px 30px rgba(13,148,136,0.45)', '&:hover': { transform: 'translateY(-2px)', background: 'linear-gradient(135deg,#0B7A70,#059669)', boxShadow: '0 14px 36px rgba(13,148,136,0.55)' } }}>
                  Bắt đầu miễn phí
                </Button>
                <Button variant="outlined" size="large" startIcon={<Phone />} onClick={() => navigate('/contact')}
                  sx={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff', px:  4, py:  1.6, fontSize:  15, borderRadius: '14px', '&:hover': { borderColor: '#5EEAD4', color: '#5EEAD4', bgcolor: 'transparent' } }}>
                  Liên hệ tư vấn
                </Button>
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'flex' }}>
                  {['Nguyễn','Trần','Lê','Phạm'].map((n, i) => (
                    <Avatar key={n} sx={{ width: 32, height:  32, ml: i ? -1 :  0, border: '2px solid #0B1220', background: i % 2 ? 'linear-gradient(135deg,#0D9488,#10B981)' : 'linear-gradient(135deg,#F59E0B,#FBBF24)', fontSize:  11, fontWeight: 700 }}>{n[0]}</Avatar>
                  ))}
                </Box>
                <Box>
                  <Typography sx={{ color: '#E2E8F0', fontWeight: 600, fontSize: 13 }}>500+ gia đình đang tin dùng</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} sx={{ color: '#FBBF24', fontSize: 14 }} />)}
                    <Typography sx={{ color: '#64748B', fontSize: 12, ml:  0.5 }}>4.9/5</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: { xs: 400, md: 470 }, display: { xs: 'none', md: 'block' } }}>
                {/* Ảnh chính: nhân viên chăm sóc bên người cao tuổi */}
                <Box sx={{ position: 'absolute', top: 30, right: 0, width: 330, height: 410, borderRadius: '26px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 34px 70px rgba(0,0,0,0.5)' }}>
                  <SmartImage
                    src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=75"
                    alt="Nhân viên chăm sóc ElderCare bên người cao tuổi"
                    loading="eager"
                  />
                </Box>

                {/* Ảnh phụ: cặp vợ chồng cao tuổi hạnh phúc */}
                <Box sx={{ position: 'absolute', bottom: -8, left: 26, width: 150, height: 190, borderRadius: '22px', overflow: 'hidden', border: '4px solid rgba(11,18,32,0.95)', boxShadow: '0 24px 48px rgba(0,0,0,0.5)', animation: 'floaty2 7s ease-in-out infinite' }}>
                  <SmartImage
                    src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=400&q=75"
                    alt="Cặp vợ chồng cao tuổi hạnh phúc"
                  />
                </Box>

                {/* Glass card: chỉ số sức khỏe thời gian thực */}
                <Box className="floaty" sx={{ position: 'absolute', top: -6, left: 0, width: 268, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.16)', p: 2.2, boxShadow: '0 28px 56px rgba(0,0,0,0.48)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.6 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '11px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MonitorHeart sx={{ color: '#fff', fontSize: 18 }} />
                    </Box>
                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13.5 }}>Theo dõi sức khỏe</Typography>
                    <Chip label="LIVE" size="small" sx={{ ml: 'auto', bgcolor: 'rgba(16,185,129,0.25)', color: '#6EE7B7', fontWeight: 800, fontSize: 10, height: 22 }} />
                  </Box>
                  <Stack spacing={1}>
                    {[['Nhịp tim', '78 bpm', '#F87171'], ['Huyết áp', '120/80', '#5EEAD4'], ['SpO₂', '98%', '#6EE7B7']].map(([k, v, c]) => (
                      <Box key={k} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.4, py: 0.9, borderRadius: '11px', bgcolor: 'rgba(255,255,255,0.07)' }}>
                        <Typography sx={{ color: '#B8C6D4', fontSize: 12 }}>{k}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{v}</Typography>
                          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: c }} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Glass badge: nhắc thuốc */}
                <Box className="floaty2" sx={{ position: 'absolute', bottom: 34, right: 36, borderRadius: '18px', bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.18)', px: 2.2, py: 1.6, boxShadow: '0 22px 44px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: 'rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LocalPharmacy sx={{ color: '#FBBF24', fontSize: 17 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 12.5 }}>Thuốc sáng 8:00</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckCircle sx={{ color: '#6EE7B7', fontSize: 14 }} />
                      <Typography sx={{ color: '#6EE7B7', fontSize: 11, fontWeight: 600 }}>Đã uống đúng giờ</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

{/* ============ STATS ============ */}
      <Box sx={{ position: 'relative', zIndex: 2, mt: { xs: -4, md: -12 } }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5,
            bgcolor: '#fff', borderRadius: '22px', boxShadow: '0 24px 60px rgba(11,18,32,0.14)',
            border: '1px solid #E8EEF3', p: { xs: 3, md: 4 },
          }}>
            {stats.map((s) => (
              <Box key={s.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.9 }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '15px', background: 'linear-gradient(135deg, rgba(13,148,136,0.12), rgba(16,185,129,0.12))', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </Box>
                <Typography sx={{ color: '#0F172A', fontWeight: 800, fontSize: { xs: 24, md: 30 }, lineHeight: 1.1 }}>{s.value}</Typography>
                <Typography color="text.secondary" fontSize={13} fontWeight={500}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

            {/* ============ WHY US ============ */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 7 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', pb: { xs: 3, md: 4 } }}>
                <Box sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 26px 60px rgba(11,18,32,0.16)' }}>
                  <SmartImage
                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=900&q=75"
                    alt="Người cao tuổi sống vui khỏe cùng ElderCare"
                    sx={{ height: { xs: 300, md: 420 } }}
                  />
                </Box>
                <Box sx={{ position: 'absolute', bottom: 0, right: { xs: 12, md: -16 }, bgcolor: '#fff', borderRadius: '18px', p: 2.2, boxShadow: '0 18px 44px rgba(11,18,32,0.16)', border: '1px solid #EDF1F5', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 46, height: 46, borderRadius: '13px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(13,148,136,0.35)' }}>
                    <VerifiedUser sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={800} fontSize={16} color="#0F172A">99% hài lòng</Typography>
                    <Typography color="text.secondary" fontSize={12}>Từ hơn 500 gia đình tin dùng</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Chip label="Vì sao chọn ElderCare" sx={{ bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', fontWeight: 700, mb: 2 }} />
              <Typography variant="h3" fontWeight={800} mb={1.5} sx={{ fontSize: { xs: 26, md: 32 }, color: '#0F172A' }}>
                Yên tâm trao gửi người thân yêu
              </Typography>
              <Typography color="text.secondary" fontSize={15} lineHeight={1.8} mb={3.5}>
                Chúng tôi kết hợp đội ngũ chăm sóc tận tâm với công nghệ giám sát thời gian thực — để gia đình luôn biết người thân đang được chăm sóc như thế nào, bất cứ lúc nào.
              </Typography>
              <Stack spacing={2.2}>
                {whyPoints.map((p) => (
                  <Box key={p.title} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.8 }}>
                    <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: '13px', bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { fontSize: 21 } }}>
                      {p.icon}
                    </Box>
                    <Box>
                      <Typography fontWeight={700} fontSize={14.5} color="#0F172A" mb={0.3}>{p.title}</Typography>
                      <Typography color="text.secondary" fontSize={13} lineHeight={1.65}>{p.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============ SERVICES ============ */}
      <Box sx={{ py:  9, bgcolor: '#F4F7F9' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Dịch vụ của chúng tôi" sx={{ bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', fontWeight: 700, mb:  2 }} />
            <Typography variant="h3" fontWeight={800} sx={{ color: '#0F172A' }}>Chăm sóc toàn diện, một nền tảng</Typography>
            <Typography color="text.secondary" fontSize={15.5} mt={1}>Mọi thứ gia đình cần để chăm sóc người thân — gọn trong một hệ sinh thái</Typography>
          </Box>
          <Grid container spacing={3}>
            {services.map((s) => (
              <Grid item xs={12} sm={6} md={3} key={s.title}>
                <Card sx={{ height: '100%', p:  2, borderRadius: '20px', border: '1px solid #EDF1F5', textAlign: 'center', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 45px rgba(13,148,136,0.14)', borderColor: 'rgba(13,148,136,0.35)' } }}>
                  <CardContent sx={{ p:  1 }}>
                    <Box sx={{ width: 58, height:  58, borderRadius: '17px', background: `${s.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb:  2, transition: 'transform 0.3s' }}>
                      <Box sx={{ color: s.color, display: 'flex' }}>{s.icon}</Box>
                    </Box>
                    <Typography fontWeight={700} fontSize={15.5} mb={1}>{s.title}</Typography>
                    <Typography color="text.secondary" fontSize={12.5} lineHeight={1.6}>{s.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============ HOW IT WORKS ============ */}
      <Box sx={{ py:  9, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Cách hoạt động" sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#D97706', fontWeight: 700, mb:  2 }} />
            <Typography variant="h3" fontWeight={800} sx={{ color: '#0F172A' }}>Bắt đầu chỉ trong 3 bước</Typography>
          </Box>
          <Grid container spacing={4}>
            {steps.map((st, i) => (
              <Grid item xs={12} md={4} key={st.title}>
                <Box sx={{ position: 'relative', textAlign: 'center', px:  2 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: '20px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb:  2.5, boxShadow: '0 12px 28px rgba(13,148,136,0.35)', position: 'relative' }}>
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>{i + 1}</Typography>
                    <Box sx={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#FBBF24', color: '#7C2D12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11.5, border: '2px solid #fff' }}>{i + 1}</Box>
                  </Box>
                  <Typography fontWeight={700} fontSize={17} mb={1}>{st.title}</Typography>
                  <Typography color="text.secondary" fontSize={13.5} lineHeight={1.7}>{st.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
{/* ============ TESTIMONIALS ============ */}
      <Box sx={{ py:  9, bgcolor: '#F4F7F9' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Đánh giá khách hàng" sx={{ bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', fontWeight: 700, mb:  2 }} />
            <Typography variant="h3" fontWeight={800} sx={{ color: '#0F172A' }}>Gia đình tin tưởng</Typography>
          </Box>
          <Grid container spacing={3}>
            {testimonials.map((t) => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card sx={{ height: '100%', borderRadius: '22px', border: '1px solid #EDF1F5', p:  1, position: 'relative', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 18px 40px rgba(13,148,136,0.12)' } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb:  1.5 }}>
                      {[...Array(t.rating)].map((_, i) => <Star key={i} sx={{ color: '#FBBF24', fontSize: 18 }} />)}
                    </Box>
                    <Typography color="text.secondary" fontSize={14} lineHeight={1.8} mb={2.5} fontStyle="italic">"{t.content}"</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={t.photo} sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', fontSize: 14, fontWeight: 700 }}>{t.name[0]}</Avatar>
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

      {/* ============ CTA ============ */}
      <Box sx={{ py:  9, background: 'linear-gradient(135deg,#0B1220 0%,#103334 60%,#0B1220 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '-60px', left: '30%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Chip label="Dùng thử miễn phí 30 ngày" sx={{ bgcolor: 'rgba(245,158,11,0.15)', color: '#FBBF24', fontWeight: 700, mb:  2.5 }} />
          <Typography variant="h3" fontWeight={800} color="#fff" mb={2}>Sẵn sàng bắt đầu?</Typography>
          <Typography color="#94A3B8" fontSize={16} mb={4} lineHeight={1.7}>Đăng ký ngay hôm nay và nhận 30 ngày dùng thử miễn phí — trải nghiệm sự khác biệt của ElderCare</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={() => navigate('/register')}
              sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', py:  1.8, px:  5, fontSize:  16, fontWeight: 700, borderRadius: '14px', boxShadow: '0 12px 32px rgba(13,148,136,0.5)', '&:hover': { transform: 'translateY(-2px)', background: 'linear-gradient(135deg,#0B7A70,#059669)' } }}>
              Đăng ký miễn phí
            </Button>
            <Button variant="outlined" size="large" startIcon={<Phone />} onClick={() => navigate('/contact')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', py:  1.8, px:  5, fontSize:  16, borderRadius: '14px', '&:hover': { borderColor: '#5EEAD4', color: '#5EEAD4', bgcolor: 'rgba(94,234,212,0.06)' } }}>
              Liên hệ tư vấn
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}