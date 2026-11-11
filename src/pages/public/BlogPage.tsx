import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Avatar, Button } from '@mui/material';
import { ArrowForward, CalendarToday } from '@mui/icons-material';
import PageHero from '../../components/public/PageHero';
import SmartImage from '../../components/public/SmartImage';

const posts = [
  {
    tag: 'Sức khỏe', tagColor: '#059669', tagBg: '#ECFDF5',
    title: '10 dấu hiệu cảnh báo sức khỏe người cao tuổi cần chú ý',
    excerpt: 'Nhận biết sớm các dấu hiệu bất thường về sức khỏe giúp can thiệp kịp thời và ngăn ngừa các biến chứng nghiêm trọng...',
    author: 'BS. Nguyễn Minh Khoa', date: '15/01/2024', readTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=75',
    gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
  },
  {
    tag: 'Dinh dưỡng', tagColor: '#D97706', tagBg: '#FFFBEB',
    title: 'Chế độ dinh dưỡng khoa học cho người trên 70 tuổi',
    excerpt: 'Dinh dưỡng đúng cách đóng vai trò quan trọng trong việc duy trì sức khỏe và chất lượng cuộc sống cho người cao tuổi...',
    author: 'ThS. Trần Thị Lan', date: '10/01/2024', readTime: '7 phút',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=75',
    gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
  },
  {
    tag: 'Chăm sóc', tagColor: '#0D9488', tagBg: '#EFF6FF',
    title: 'Hướng dẫn chăm sóc người cao tuổi bị sa sút trí tuệ tại nhà',
    excerpt: 'Sa sút trí tuệ là thách thức lớn với gia đình. Những kỹ năng và phương pháp đúng đắn sẽ giúp cải thiện chất lượng cuộc sống...',
    author: 'ThS. Trần Thị Lan', date: '05/01/2024', readTime: '8 phút',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=75',
    gradient: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
  },
  {
    tag: 'Công nghệ', tagColor: '#10B981', tagBg: '#F5F3FF',
    title: 'Ứng dụng công nghệ trong quản lý và chăm sóc người cao tuổi',
    excerpt: 'Các giải pháp công nghệ hiện đại đang thay đổi cách chúng ta chăm sóc người thân cao tuổi, mang lại nhiều lợi ích thiết thực...',
    author: 'Lê Văn Hùng', date: '01/01/2024', readTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=75',
    gradient: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
  },
  {
    tag: 'Tâm lý', tagColor: '#DC2626', tagBg: '#FEF2F2',
    title: 'Vượt qua cô đơn và trầm cảm tuổi già — Hành trình tìm lại niềm vui',
    excerpt: 'Cô đơn và trầm cảm ảnh hưởng đến hàng triệu người cao tuổi. Hiểu và hỗ trợ đúng cách là chìa khóa giúp họ sống vui khỏe...',
    author: 'BS. Nguyễn Minh Khoa', date: '28/12/2023', readTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=75',
    gradient: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
  },
  {
    tag: 'Vật lý trị liệu', tagColor: '#0891B2', tagBg: '#ECFEFF',
    title: 'Các bài tập phục hồi chức năng đơn giản cho người cao tuổi',
    excerpt: 'Duy trì vận động hàng ngày với các bài tập phù hợp giúp người cao tuổi cải thiện thể lực, giảm nguy cơ té ngã và tăng sự độc lập...',
    author: 'ThS. Trần Thị Lan', date: '20/12/2023', readTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=75',
    gradient: 'linear-gradient(135deg, #ECFEFF, #CFFAFE)',
  },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <Box>
      {/* Hero */}
      <PageHero
        chip="Blog & Kiến thức"
        title="Kiến thức chăm sóc sức khỏe"
        subtitle="Các bài viết chuyên sâu từ đội ngũ bác sĩ và chuyên gia về chăm sóc sức khỏe người cao tuổi"
        image="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=75"
      />

      <Box sx={{ py: 8, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          {/* Featured */}
          <Card sx={{ borderRadius: '24px', border: '1px solid #E2E8F0', mb: 5, overflow: 'hidden', boxShadow: 'none', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ width: { xs: '100%', md: '42%' }, minHeight: 280, overflow: 'hidden', background: featured.gradient }}>
                <SmartImage src={featured.image} alt={featured.title} fallback={featured.gradient} loading="eager" />
              </Box>
              <CardContent sx={{ flex: 1, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Chip label={featured.tag} size="small" sx={{ bgcolor: featured.tagBg, color: featured.tagColor, fontWeight: 700, mb: 2, width: 'fit-content' }} />
                <Typography variant="h4" fontWeight={800} mb={1.5} color="#0F172A" lineHeight={1.3}>{featured.title}</Typography>
                <Typography color="text.secondary" fontSize={15} lineHeight={1.8} mb={3}>{featured.excerpt}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Avatar sx={{ width: 26, height: 26, bgcolor: featured.tagColor, fontSize: 11 }}>{featured.author[0]}</Avatar>
                    <Typography fontSize={13} color="text.secondary">{featured.author}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 13, color: '#94A3B8' }} />
                    <Typography fontSize={13} color="text.secondary">{featured.date}</Typography>
                  </Box>
                  <Chip label={`Đọc ${featured.readTime}`} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontSize: 11 }} />
                  <Button endIcon={<ArrowForward />} sx={{ ml: 'auto', fontWeight: 700, color: featured.tagColor }}>Đọc tiếp</Button>
                </Box>
              </CardContent>
            </Box>
          </Card>

          {/* Grid */}
          <Grid container spacing={3}>
            {rest.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.title}>
                <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'none', cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)', '& img': { transform: 'scale(1.06)' } } }}>
                  <Box sx={{ height: 160, overflow: 'hidden', background: post.gradient }}>
                    <SmartImage
                      src={post.image}
                      alt={post.title}
                      fallback={post.gradient}
                      sx={{ transition: 'transform 0.45s ease' }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Chip label={post.tag} size="small" sx={{ bgcolor: post.tagBg, color: post.tagColor, fontWeight: 700, mb: 1.5, fontSize: 11 }} />
                    <Typography fontWeight={700} fontSize={15} mb={1} color="#0F172A" lineHeight={1.4}>{post.title}</Typography>
                    <Typography color="text.secondary" fontSize={13} lineHeight={1.7} mb={2}
                      sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <CalendarToday sx={{ fontSize: 12, color: '#94A3B8' }} />
                        <Typography fontSize={12} color="text.disabled">{post.date}</Typography>
                      </Box>
                      <Typography fontSize={12} color={post.tagColor} fontWeight={600}>{post.readTime} đọc</Typography>
                    </Box>
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
