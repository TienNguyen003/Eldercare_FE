import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, TextField, Button, Typography, Alert, CircularProgress,
  Grid, Divider, Stack,
} from '@mui/material';
import { Favorite, ArrowBack, Shield, MonitorHeart, LocalPharmacy, CheckCircle } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegisterMutation } from '../../store/api/apiSlice';
import SmartImage from '../../components/public/SmartImage';

const schema = yup.object({
  username: yup.string().min(3, 'Ít nhất 3 ký tự').required('Bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Bắt buộc'),
  phone: yup.string(),
  password: yup.string().min(6, 'Ít nhất 6 ký tự').required('Bắt buộc'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Mật khẩu không khớp').required('Bắt buộc'),
});

const perks = [
  { icon: <MonitorHeart />, text: 'Theo dõi sức khỏe 24/7' },
  { icon: <LocalPharmacy />, text: 'Nhắc thuốc thông minh' },
  { icon: <Shield />, text: 'Bảo mật dữ liệu cá nhân' },
];

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values: any) => {
    setError('');
    try {
      await registerUser({ username: values.username, email: values.email, phone: values.phone, password: values.password }).unwrap();
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(140deg,#0B1220 0%,#103334 55%,#0B1220 100%)',
      p:  3, position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: '-6%', right: '10%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulseGlow 9s ease-in-out infinite' }} />
      <Box sx={{ position: 'absolute', bottom: '-8%', left: '8%', width: 300, height:  300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Card sx={{
        width: '100%', maxWidth: 900, borderRadius: '28px', overflow: 'hidden',
        boxShadow: '0 50px 120px rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', position: 'relative', zIndex: 1,
      }}>
        <Box sx={{
          display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center',
          flex: 1, p:  4.5, background: 'linear-gradient(150deg,#0D9488 0%,#0B7A70 55%,#0F766C 100%)',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={4}>
            <Box sx={{ width: 44, height: 44, borderRadius: '13px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.25)' }}>
              <Favorite sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography fontWeight={800} fontSize={20}>ElderCare</Typography>
          </Stack>
          <Typography variant="h4" fontWeight={800} mb={1.5} sx={{ lineHeight: 1.25 }}>
            Trở thành một phần
            <Box component="span" sx={{ display: 'block', color: '#B7F0E7' }}>của gia đình ElderCare</Box>
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize:  13.5, lineHeight:  1.7, mb:  3, maxWidth:  320 }}>
            Tạo tài khoản để bắt đầu hành trình chăm sóc người thân yêu với sự an tâm tuyệt đối.
          </Typography>

          <Stack spacing={1.5} mb={4}>
            {perks.map((p) => (
              <Stack key={p.text} direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.icon}</Box>
                <Typography sx={{ color: '#fff', fontSize: 13 }}>{p.text}</Typography>
                <CheckCircle sx={{ color: '#A7F3E5', fontSize: 16, ml: 'auto' }} />
              </Stack>
            ))}
          </Stack>

          <Box sx={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 44px rgba(0,0,0,0.35)' }}>
            <SmartImage
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=75"
              alt="Nhân viên ElderCare chăm sóc người cao tuổi"
              sx={{ height: 150 }}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1.2, bgcolor: '#fff', p: { xs:  3, sm:  4 } }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap:  1, mb:  2 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Favorite sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg,#0D9488,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ElderCare</Typography>
          </Box>
          <Typography variant="h5" fontWeight={800} mb={0.5}>Tạo tài khoản mới</Typography>
          <Typography color="text.secondary" fontSize={13.5} mb={3}>Điền thông tin để bắt đầu sử dụng dịch vụ</Typography>

          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>Đăng ký thành công! Đang chuyển hướng...</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Tên đăng nhập *" size="small" {...register('username')} error={!!errors.username} helperText={errors.username?.message} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Số điện thoại" size="small" {...register('phone')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email *" size="small" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Mật khẩu *" type="password" size="small" {...register('password')} error={!!errors.password} helperText={errors.password?.message} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Xác nhận mật khẩu *" type="password" size="small" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading}
                  sx={{ py:  1.6, fontWeight: 700, fontSize: 15, borderRadius: '13px', background: 'linear-gradient(135deg,#0D9488,#10B981)', boxShadow: '0 8px 24px rgba(13,148,136,0.35)', '&:hover': { transform: 'translateY(-1px)', background: 'linear-gradient(135deg,#0B7A70,#059669)' } }}>
                  {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Tạo tài khoản'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography fontSize={12} color="text.secondary">hoặc</Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?{' '}
              <Link to="/login" style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>Đăng nhập</Link>
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', mt:  1.5 }}>
            <Button startIcon={<ArrowBack fontSize="small" />} onClick={() => navigate('/home')}
              sx={{ color: '#94A3B8', fontSize: 13, '&:hover': { color: '#475569' } }}>
              Về trang chủ
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}