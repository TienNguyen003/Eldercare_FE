import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, TextField, Button, Typography, Alert, InputAdornment,
  IconButton, CircularProgress, Divider, Chip, Stack, Avatar,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Favorite, ArrowBack, CheckCircle,
  MonitorHeart, LocalPharmacy, Assignment, Groups,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from '../../store/api/apiSlice';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/redux';

const schema = yup.object({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

const features = [
  { icon: <MonitorHeart />, text: 'Theo dõi sức khỏe 24/7', color: '#5EEAD4', bg: 'rgba(13,148,136,0.18)' },
  { icon: <LocalPharmacy />, text: 'Quản lý thuốc thông minh', color: '#FBBF24', bg: 'rgba(245,158,11,0.16)' },
  { icon: <Assignment />, text: 'Kế hoạch chăm sóc cá nhân hóa', color: '#6EE7B7', bg: 'rgba(16,185,129,0.16)' },
  { icon: <Groups />, text: 'Kết nối gia đình dễ dàng', color: '#38BDF8', bg: 'rgba(14,165,233,0.16)' },
];

/** Ảnh đại diện thật của khách hàng dùng trong khối "social proof" */
const communityAvatars = [
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=70', fallback: 'A' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=70', fallback: 'B' },
  { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=70', fallback: 'C' },
];

const socialButtonSx = {
  borderColor: '#E2E8F0',
  color: '#0F172A',
  fontWeight: 600,
  fontSize: 13.5,
  py: 1.3,
  borderRadius: '12px',
  textTransform: 'none' as const,
  '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' },
};

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
      // Điều hướng theo vai trò: ADMIN → Dashboard, CAREGIVER → Ngày làm việc, FAMILY → Người thân của tôi
      const roles = res.data.user.roles?.map((r) => r.name) ?? [];
      if (roles.includes('ADMIN')) navigate('/');
      else if (roles.includes('CAREGIVER')) navigate('/my-day');
      else navigate('/my-family');
    } catch {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(140deg,#0B1220 0%,#103334 55%,#0B1220 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative */}
      <Box sx={{ position: 'absolute', top: '-8%', left: '12%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulseGlow 9s ease-in-out infinite' }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', right: '6%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Left brand panel */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, flexDirection: 'column', justifyContent: 'center', px: { md: 6, lg: 8 }, position: 'relative', zIndex: 1, maxWidth: 600 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={5}>
          <Box sx={{ width: 46, height: 46, borderRadius: '14px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(13,148,136,0.5)' }}>
            <Favorite sx={{ color: '#fff', fontSize: 23 }} />
          </Box>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 21, lineHeight: 1.1 }}>ElderCare</Typography>
            <Typography sx={{ color: '#5EEAD4', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Chăm sóc tận tâm</Typography>
          </Box>
        </Stack>

        <Chip label="Chào mừng trở lại" sx={{ bgcolor: 'rgba(13,148,136,0.2)', color: '#5EEAD4', fontWeight: 600, alignSelf: 'flex-start', mb: 2, border: '1px solid rgba(94,234,212,0.25)' }} />
        <Typography variant="h2" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.2, mb: 2, fontSize: 36 }}>
          Chăm sóc tốt hơn,{' '}
          <Box component="span" sx={{ background: 'linear-gradient(135deg,#5EEAD4,#6EE7B7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>quản lý thông minh hơn</Box>
        </Typography>
        <Typography sx={{ color: '#94A3B8', fontSize: 16, lineHeight: 1.8, maxWidth: 420, mb: 4 }}>
          Đăng nhập để quản lý hệ thống chăm sóc người cao tuổi một cách toàn diện và hiệu quả.
        </Typography>

        <Stack spacing={2}>
          {features.map((f) => (
            <Stack key={f.text} direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 38, height: 38, borderRadius: '11px', background: `${f.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `${f.color}` }}>{f.icon}</Box>
              <Typography sx={{ color: '#CBD5E1', fontSize: 14 }}>{f.text}</Typography>
              <CheckCircle sx={{ color: '#10B981', fontSize: 17, ml: 'auto' }} />
            </Stack>
          ))}
        </Stack>

        <Box sx={{ mt: 5, p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex' }}>
            {communityAvatars.map((a, i) => (
              <Avatar key={a.src} src={a.src} sx={{ width: 30, height: 30, ml: i > 0 ? -1 : 0, border: '2px solid #0B1220', bgcolor: '#0D9488', fontSize: 12 }}>{a.fallback}</Avatar>
            ))}
          </Box>
          <Typography sx={{ color: '#E2E8F0', fontSize: 12.5, fontWeight: 600 }}>500+ người cao tuổi đang được chăm sóc mỗi ngày</Typography>
        </Box>
      </Box>

      {/* Right login form */}
      <Box sx={{ flex: { xs: 1, md: '0 0 500px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, position: 'relative', zIndex: 1 }}>
        <Card sx={{
          width: '100%', maxWidth: 440, p: { xs: 3, sm: 4 }, borderRadius: '26px',
          boxShadow: '0 40px 90px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.12)',
          bgcolor: 'rgba(255,255,255,0.97)',
          position: 'relative',
        }}>
          <Box sx={{ position: 'absolute', top: -14, right: 28, width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#FBBF24)', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(245,158,11,0.45)' }}>
            <Favorite sx={{ color: '#fff', fontSize: 26 }} />
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: '11px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Favorite sx={{ color: '#fff', fontSize: 19 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg,#0D9488,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ElderCare</Typography>
          </Box>

          <Typography variant="h5" fontWeight={800} mb={0.5}>Đăng nhập</Typography>
          <Typography color="text.secondary" fontSize={13.5} mb={3}>Nhập thông tin tài khoản của bạn để tiếp tục</Typography>

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
              sx={{ mt: 2.5, py: 1.6, fontWeight: 700, fontSize: 15, borderRadius: '13px', background: 'linear-gradient(135deg,#0D9488,#10B981)', boxShadow: '0 8px 24px rgba(13,148,136,0.35)', '&:hover': { transform: 'translateY(-1px)', background: 'linear-gradient(135deg,#0B7A70,#059669)' } }}>
              {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Đăng nhập'}
            </Button>
          </form>

          <Divider sx={{ my: 2.5 }}>
            <Typography fontSize={12} color="text.secondary">hoặc</Typography>
          </Divider>

          {/* Đăng nhập nhanh — logo thật của Google / Facebook / Apple */}
          <Stack spacing={1.5} my={2.5}>
            <Button
              fullWidth variant="outlined" size="large"
              startIcon={
                <Box component="span" sx={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
                    <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a11.98 11.98 0 0 0 0 10.76l3.98-3.09z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
                  </svg>
                </Box>
              }
              sx={socialButtonSx}
            >
              Đăng nhập với Google
            </Button>

            <Button
              fullWidth variant="outlined" size="large"
              startIcon={
                <Box component="span" sx={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z" />
                  </svg>
                </Box>
              }
              sx={socialButtonSx}
            >
              Đăng nhập với Facebook
            </Button>

            <Button
              fullWidth variant="outlined" size="large"
              startIcon={
                <Box component="span" sx={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#000" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                  </svg>
                </Box>
              }
              sx={socialButtonSx}
            >
              Đăng nhập với Apple
            </Button>
          </Stack>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tài khoản?{' '}
              <Link to="/register" style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>Đăng ký ngay</Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button startIcon={<ArrowBack fontSize="small" />} onClick={() => navigate('/home')}
              sx={{ color: '#94A3B8', fontSize: 13, textTransform: 'none', '&:hover': { color: '#475569' } }}>
              Về trang chủ
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}