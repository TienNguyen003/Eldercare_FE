import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, TextField, Button, Typography, Alert, InputAdornment, IconButton, CircularProgress, Divider } from '@mui/material';
import { Visibility, VisibilityOff, FavoriteOutlined, ArrowBack } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from '../../store/api/apiSlice';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/redux';

const schema = yup.object({ username: yup.string().required('Vui lòng nhập tên đăng nhập'), password: yup.string().required('Vui lòng nhập mật khẩu') });

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values: { username: string; password: string }) => {
    setError('');
    try {
      const res = await login(values).unwrap();
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }));
      navigate('/');
    } catch {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative */}
      <Box sx={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '15%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Left brand panel */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, flexDirection: 'column', justifyContent: 'center', px: 8, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FavoriteOutlined sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>ElderCare</Typography>
        </Box>
        <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.2, mb: 2 }}>
          Chào mừng trở lại
        </Typography>
        <Typography sx={{ color: '#94A3B8', fontSize: 16, lineHeight: 1.8, maxWidth: 360 }}>
          Đăng nhập để quản lý hệ thống chăm sóc người cao tuổi một cách toàn diện và hiệu quả.
        </Typography>
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['Theo dõi sức khỏe 24/7', 'Quản lý thuốc thông minh', 'Kết nối gia đình dễ dàng'].map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)' }} />
              <Typography sx={{ color: '#CBD5E1', fontSize: 14 }}>{item}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right login form */}
      <Box sx={{ flex: { xs: 1, md: '0 0 480px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, position: 'relative', zIndex: 1 }}>
        <Card sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 }, borderRadius: '24px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.98)' }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FavoriteOutlined sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={800} mb={0.5}>Đăng nhập</Typography>
          <Typography color="text.secondary" fontSize={14} mb={3}>Nhập thông tin tài khoản của bạn</Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField fullWidth label="Tên đăng nhập" margin="normal" {...register('username')}
              error={!!errors.username} helperText={errors.username?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            <TextField fullWidth label="Mật khẩu" margin="normal" type={showPass ? 'text' : 'password'}
              {...register('password')} error={!!errors.password} helperText={errors.password?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} size="small">{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
            <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading}
              sx={{ mt: 2.5, py: 1.6, fontWeight: 700, fontSize: 15, borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 4px 20px rgba(37,99,235,0.35)', '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #6D28D9)' } }}>
              {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Đăng nhập'}
            </Button>
          </form>

          <Divider sx={{ my: 2.5 }}>
            <Typography fontSize={12} color="text.secondary">hoặc</Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tài khoản?{' '}
              <Link to="/register" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button startIcon={<ArrowBack fontSize="small" />} onClick={() => navigate('/home')}
              sx={{ color: '#94A3B8', fontSize: 13, '&:hover': { color: '#475569' } }}>
              Về trang chủ
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
