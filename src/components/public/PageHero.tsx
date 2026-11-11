import { Box, Chip, Container, Typography } from '@mui/material';
import SmartImage from './SmartImage';

interface PageHeroProps {
  chip: string;
  title: string;
  subtitle?: string;
  /** Ảnh nền thật cho hero */
  image: string;
  /** Gradient dự phòng nếu ảnh lỗi */
  fallback?: string;
  /** Màu chuyển tiếp đáy hero sang nền của section bên dưới */
  fade?: string;
}

/**
 * Hero dùng chung cho các trang public — ảnh nền thật + lớp phủ tối
 * giúp chữ nổi bật và tạo chiều sâu, thay cho khối gradient phẳng.
 */
export default function PageHero({ chip, title, subtitle, image, fallback, fade = '#F8FAFC' }: PageHeroProps) {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: { xs: 380, md: 470 }, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <SmartImage src={image} alt="" loading="eager" fallback={fallback} />
        {/* Lớp phủ tối giúp chữ nổi bật */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, rgba(11,18,32,0.94) 0%, rgba(16,51,52,0.84) 52%, rgba(11,18,32,0.92) 100%)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(720px 360px at 82% 0%, rgba(13,148,136,0.26), transparent 65%)' }} />
        {/* Chuyển tiếp mượt vào nội dung bên dưới */}
        <Box sx={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 96, background: `linear-gradient(180deg, transparent, ${fade})` }} />
      </Box>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: { xs: 9, md: 12 } }}>
        <Chip
          label={chip}
          sx={{
            bgcolor: 'rgba(13,148,136,0.25)', color: '#99F6E4', fontWeight: 700,
            border: '1px solid rgba(94,234,212,0.3)', mb: 3,
          }}
        />
        <Typography variant="h2" fontWeight={800} color="#fff" mb={2} sx={{ fontSize: { xs: 32, md: 46 } }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="#B7C4D4" fontSize={16.5} lineHeight={1.8}>
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
