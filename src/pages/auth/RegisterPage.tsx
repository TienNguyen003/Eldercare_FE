import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, TextField, Button, Typography, Alert, CircularProgress, Grid, Divider } from '@mui/material';
import { FavoriteOutlined, ArrowBack } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegisterMutation } from '../../store/api/apiSlice';

const schema = yup.object({
  username: yup.string().min(3, 'Ít nhất 3 ký tự').required('Bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Bắt buộc'),
  phone: yup.string(),
  password: yup.string().min(6, 'Ít nhất 6 ký tự').required('Bắt buộc'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Mật khẩu không khớp').required('Bắt buộc'),
});

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
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)',
      p: 3, position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '10%', left: '5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Card sx={{ width: '100%', maxWidth: 500, p: { xs: 3, sm: 4 }, borderRadius: '24px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FavoriteOutlined sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ElderCare</Typography>
        </Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>Tạo tài khoản mới</Typography>
        <Typography color="text.secondary" fontSize={14} mb={3}>Điền thông tin để bắt đầu sử dụng dịch vụ</Typography>

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
                sx={{ py: 1.6, fontWeight: 700, fontSize: 15, borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #6D28D9)' } }}>
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
            <Link to="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 1.5 }}>
          <Button startIcon={<ArrowBack fontSize="small" />} onClick={() => navigate('/home')}
            sx={{ color: '#94A3B8', fontSize: 13, '&:hover': { color: '#475569' } }}>
            Về trang chủ
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
