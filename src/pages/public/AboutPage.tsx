import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { FavoriteOutlined, VerifiedUser, EmojiPeople, Lightbulb } from '@mui/icons-material';
import PageHero from '../../components/public/PageHero';
import SmartImage from '../../components/public/SmartImage';

const values = [
  { icon: <FavoriteOutlined />, title: 'Tận tâm', desc: 'Chúng tôi chăm sóc người cao tuổi với tình yêu thương và sự tận tâm như chăm sóc chính người thân của mình.', color: '#DC2626' },
  { icon: <VerifiedUser />, title: 'Chuyên nghiệp', desc: 'Đội ngũ được đào tạo bài bản, có chứng chỉ chuyên môn và kinh nghiệm thực tế trong lĩnh vực chăm sóc y tế.', color: '#0D9488' },
  { icon: <EmojiPeople />, title: 'Cá nhân hóa', desc: 'Mỗi người cao tuổi có nhu cầu riêng. Chúng tôi xây dựng kế hoạch chăm sóc phù hợp với từng cá nhân.', color: '#059669' },
  { icon: <Lightbulb />, title: 'Đổi mới', desc: 'Ứng dụng công nghệ tiên tiến để nâng cao chất lượng chăm sóc và kết nối gia đình thuận tiện hơn.', color: '#10B981' },
];

const team = [
  { name: 'TS. Nguyễn Minh Khoa', role: 'Giám đốc Y tế', dept: 'Chuyên gia lão khoa 15 năm kinh nghiệm', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=75' },
  { name: 'ThS. Trần Thị Lan', role: 'Trưởng phòng Chăm sóc', dept: 'Điều dưỡng chuyên khoa cấp cao', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=75' },
  { name: 'Lê Văn Hùng', role: 'Giám đốc Công nghệ', dept: '10 năm phát triển hệ thống y tế', photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=75' },
  { name: 'Phạm Thu Hà', role: 'Trưởng phòng Khách hàng', dept: 'Chuyên gia tư vấn dịch vụ chăm sóc', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=75' },
];

export default function AboutPage() {
  return (
    <Box>
      {/* Hero */}
      <PageHero
        chip="Về chúng tôi"
        title="Sứ mệnh của chúng tôi"
        subtitle="Mang lại cuộc sống chất lượng và an toàn cho người cao tuổi Việt Nam thông qua công nghệ và sự tận tâm"
        image="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1600&q=75"
        fade="#FFFFFF"
      />

      {/* Story */}
      <Box sx={{ py: 10, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip label="Câu chuyện của chúng tôi" sx={{ bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', fontWeight: 600, mb: 2 }} />
              <Typography variant="h3" fontWeight={800} mb={3}>Bắt đầu từ tình yêu với người thân</Typography>
              <Typography color="text.secondary" fontSize={15} lineHeight={1.9} mb={2}>
                ElderCare được thành lập năm 2020 bởi nhóm chuyên gia y tế và công nghệ, những người đã trải qua khó khăn khi chăm sóc người thân cao tuổi và nhận ra sự cần thiết của một giải pháp toàn diện.
              </Typography>
              <Typography color="text.secondary" fontSize={15} lineHeight={1.9}>
                Từ một ý tưởng nhỏ, chúng tôi đã phát triển thành nền tảng chăm sóc người cao tuổi hàng đầu Việt Nam, phục vụ hơn 500 người dùng tại nhiều tỉnh thành.
              </Typography>
              <Box sx={{ mt: 4, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(11,18,32,0.14)' }}>
                <SmartImage
                  src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=75"
                  alt="Cặp vợ chồng cao tuổi vui sống cùng con cháu"
                  sx={{ height: { xs: 220, md: 260 } }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {[
                  { value: '2020', label: 'Năm thành lập' },
                  { value: '500+', label: 'Người được chăm sóc' },
                  { value: '50+', label: 'Nhân viên chuyên nghiệp' },
                  { value: '10+', label: 'Tỉnh thành phục vụ' },
                ].map((item) => (
                  <Grid item xs={6} key={item.label}>
                    <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', textAlign: 'center', p: 1 }}>
                      <CardContent>
                        <Typography variant="h3" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #0D9488, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{item.value}</Typography>
                        <Typography color="text.secondary" fontSize={13} mt={0.5}>{item.label}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values */}
      <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight={800} mb={1.5}>Giá trị cốt lõi</Typography>
            <Typography color="text.secondary" fontSize={16}>Những giá trị định hướng mọi hoạt động của chúng tôi</Typography>
          </Box>
          <Grid container spacing={3}>
            {values.map((v) => (
              <Grid item xs={12} sm={6} md={3} key={v.title}>
                <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid #E2E8F0', textAlign: 'center', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }, transition: 'all 0.3s' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar sx={{ bgcolor: `${v.color}15`, width: 60, height: 60, mx: 'auto', mb: 2 }}>
                      <Box sx={{ color: v.color, '& svg': { fontSize: 28 } }}>{v.icon}</Box>
                    </Avatar>
                    <Typography fontWeight={700} fontSize={17} mb={1.5}>{v.title}</Typography>
                    <Typography color="text.secondary" fontSize={13.5} lineHeight={1.7}>{v.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team */}
      <Box sx={{ py: 10, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight={800} mb={1.5}>Đội ngũ lãnh đạo</Typography>
            <Typography color="text.secondary" fontSize={16}>Những chuyên gia dẫn dắt ElderCare phát triển</Typography>
          </Box>
          <Grid container spacing={3}>
            {team.map((member) => (
              <Grid item xs={12} sm={6} md={3} key={member.name}>
                <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', textAlign: 'center', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }, transition: 'all 0.3s' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar src={member.photo} sx={{ width: 72, height: 72, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, #0D9488, #10B981)', fontSize: 24, fontWeight: 700 }}>
                      {member.name.split(' ').pop()?.[0]}
                    </Avatar>
                    <Typography fontWeight={700} fontSize={15} mb={0.5}>{member.name}</Typography>
                    <Typography sx={{ color: '#0D9488', fontSize: 13, fontWeight: 600, mb: 0.5 }}>{member.role}</Typography>
                    <Typography color="text.secondary" fontSize={12}>{member.dept}</Typography>
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
