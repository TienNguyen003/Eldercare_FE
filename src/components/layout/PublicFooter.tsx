import { Box, Container, Typography, IconButton } from '@mui/material';
import { Favorite, Facebook, YouTube, Twitter, Phone, Email, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const quickLinks = [
  { label: 'Trang chủ', path: '/home' },
  { label: 'Dịch vụ', path: '/services' },
  { label: 'Về chúng tôi', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Liên hệ', path: '/contact' },
];

const serviceLinks = [
  'Theo dõi sức khỏe',
  'Quản lý thuốc',
  'Kế hoạch chăm sóc',
  'Lịch chăm sóc',
  'Đội ngũ chuyên nghiệp',
];

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, py:  0.45, cursor: 'pointer', transition: 'all 0.18s', '&:hover': { color: '#2CE5C7', transform: 'translateX(3px)' } }}>
      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#0D9488', opacity: 0.7, flexShrink: 0 }} />
      <Typography fontSize={13.5}>{label}</Typography>
    </Box>
  );
}

export default function PublicFooter() {
  const navigate = useNavigate();
  return (
    <Box component="footer" sx={{ bgcolor: '#0B1220', color: '#94A3B8', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: '-120px', right: '-80px', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '-100px', left: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py:  6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1.4fr' }, gap:  5 }}>
          {/* Brand */}
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb:  2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #0D9488, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(13,148,136,0.4)' }}>
                <Favorite sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 19 }}>ElderCare</Typography>
            </Box>
            <Typography fontSize={13.5} lineHeight={1.8} mb={2.5} sx={{ maxWidth: 300 }}>
              Hệ thống chăm sóc người cao tuổi toàn diện — theo dõi sức khỏe, quản lý thuốc và kết nối gia đình mọi lúc mọi nơi.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Facebook, YouTube, Twitter].map((Icon, i) => (
                <IconButton key={i} size="small" sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.06)', color: '#94A3B8', '&:hover': { bgcolor: 'rgba(13,148,136,0.25)', color: '#fff' } }}>
                  <Icon sx={{ fontSize: 17 }} />
                </IconButton>
              ))}
            </Box>
          </Box>
          {/* Liên kết nhanh */}
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14.5, mb:  2 }}>Liên kết nhanh</Typography>
            {quickLinks.map((l) => <NavButton key={l.path} label={l.label} onClick={() => navigate(l.path)} />)}
          </Box>
          {/* Dịch vụ */}
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14.5, mb:  2 }}>Dịch vụ</Typography>
            {serviceLinks.map((s) => <NavButton key={s} label={s} onClick={() => navigate('/services')} />)}
          </Box>
          {/* Liên hệ */}
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14.5, mb:  2 }}>Liên hệ</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, mb:  1.4 }}>
              <LocationOn sx={{ fontSize: 17, color: '#0D9488', mt:  0.3 }} />
              <Typography fontSize={13.5} lineHeight={1.6}>Số 123 Đường Lê Lợi, Quận 1, TP. HCM</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb:  1.4 }}>
              <Phone sx={{ fontSize: 16, color: '#0D9488' }} />
              <Typography fontSize={13.5}>(028) 3822 3456</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Email sx={{ fontSize: 16, color: '#0D9488' }} />
              <Typography fontSize={13.5}>hello@eldercare.vn</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.07)', mt:  5, pt:  3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap:  1.5 }}>
          <Typography fontSize={12.5}>© {new Date().getFullYear()} ElderCare. Tất cả quyền được bảo lưu.</Typography>
          <Typography fontSize={12.5}>Made with ❤️ for the elderly</Typography>
        </Box>
      </Container>
    </Box>
  );
}