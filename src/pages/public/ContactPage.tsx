import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, TextField, Button, Alert, Avatar, CircularProgress } from '@mui/material';
import { Phone, Email, LocationOn, AccessTime, Send } from '@mui/icons-material';
import { useSubmitContactMessageMutation } from '../../store/api/apiSlice';
import PageHero from '../../components/public/PageHero';

const contactInfo = [
  { icon: <Phone />, title: 'Điện thoại', value: '1800 1234', sub: 'Miễn phí, 24/7', color: '#0D9488' },
  { icon: <Email />, title: 'Email', value: 'support@eldercare.vn', sub: 'Phản hồi trong 2 giờ', color: '#10B981' },
  { icon: <LocationOn />, title: 'Địa chỉ', value: '123 Nguyễn Huệ, Q.1', sub: 'TP. Hồ Chí Minh', color: '#059669' },
  { icon: <AccessTime />, title: 'Giờ làm việc', value: 'Thứ 2 - Thứ 7', sub: '8:00 - 17:30', color: '#DC2626' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitMessage, { isLoading }] = useSubmitContactMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await submitMessage(form).unwrap();
      setSubmitted(true);
    } catch {
      setError('Lỗi gửi yêu cầu. Vui lòng thử lại.');
    }
  };

  return (
    <Box>
      {/* Hero */}
      <PageHero
        chip="Liên hệ"
        title="Chúng tôi luôn sẵn sàng hỗ trợ"
        subtitle="Liên hệ ngay để được tư vấn miễn phí về dịch vụ chăm sóc người cao tuổi"
        image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=75"
      />

      <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Contact info */}
            <Grid item xs={12} md={5}>
              <Typography variant="h4" fontWeight={800} mb={1.5}>Thông tin liên hệ</Typography>
              <Typography color="text.secondary" fontSize={15} mb={4} lineHeight={1.8}>
                Hãy để lại thông tin và chúng tôi sẽ liên hệ lại trong thời gian sớm nhất để tư vấn giải pháp phù hợp cho gia đình bạn.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {contactInfo.map((info) => (
                  <Box key={info.title} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: `${info.color}15`, width: 48, height: 48 }}>
                      <Box sx={{ color: info.color }}>{info.icon}</Box>
                    </Avatar>
                    <Box>
                      <Typography fontSize={13} color="text.secondary">{info.title}</Typography>
                      <Typography fontWeight={700} fontSize={15}>{info.value}</Typography>
                      <Typography fontSize={12} color="text.secondary">{info.sub}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Bản đồ thật (Google Maps embed) */}
              <Box sx={{ height: 220, borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(11,18,32,0.08)' }}>
                <Box
                  component="iframe"
                  title="Bản đồ văn phòng ElderCare"
                  src="https://maps.google.com/maps?q=123%20Nguy%E1%BB%85n%20Hu%E1%BB%87%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20HCM&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
                  loading="lazy"
                />
              </Box>
            </Grid>

            {/* Form */}
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={700} mb={0.5}>Gửi tin nhắn cho chúng tôi</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={3}>Điền thông tin bên dưới, chúng tôi sẽ liên hệ trong 2 giờ</Typography>

                  {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

                  {submitted ? (
                    <Alert severity="success" sx={{ borderRadius: '12px' }}>
                      Cảm ơn bạn! Chúng tôi đã nhận được thông tin và sẽ liên hệ lại sớm.
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Họ và tên *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Số điện thoại *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth label="Nội dung tư vấn *" multiline rows={5}
                            placeholder="Mô tả nhu cầu chăm sóc của gia đình bạn..."
                            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                        </Grid>
                        <Grid item xs={12}>
                          <Button fullWidth variant="contained" type="submit" size="large" endIcon={<Send />} disabled={isLoading}
                            sx={{ py: 1.8, fontWeight: 700, fontSize: 15, background: 'linear-gradient(135deg, #0D9488, #10B981)', borderRadius: '12px' }}>
                            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Gửi yêu cầu tư vấn'}
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
