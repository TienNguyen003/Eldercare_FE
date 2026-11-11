import { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, TextField,
  Button, Avatar, Divider, Alert, Skeleton, Stack, Chip,
} from '@mui/material';
import { Person, Email, Phone, Lock, Save, Edit } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setCredentials } from '../../store/slices/authSlice';
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../../store/api/apiSlice';
import type { User } from '../../types';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { data, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [editMode, setEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const currentUser = data?.data || user;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await updateProfile(profileForm).unwrap();
      // Máy chủ cấp lại token khi username thay đổi -> đồng bộ lại phiên đăng nhập
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }));
      setSuccessMsg('Cập nhật thành công!');
      setEditMode(false);
    } catch {
      setErrorMsg('Lỗi cập nhật. Vui lòng thử lại.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setSuccessMsg('Đổi mật khẩu thành công!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setErrorMsg('Lỗi đổi mật khẩu. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1.8, mb: 1 }}>
          <Box sx={{ width: 4, borderRadius: '4px', background: 'linear-gradient(180deg, #0D9488, #10B981)', flexShrink: 0 }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="#0F172A" sx={{ lineHeight: 1.3 }}>Thông tin cá nhân</Typography>
            <Typography color="text.secondary" fontSize={13.5} mt={0.5}>Quản lý tài khoản và bảo mật</Typography>
          </Box>
        </Box>
        <Skeleton variant="rectangular" height={420} sx={{ borderRadius: '20px', mt: 3 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1.8, mb: 4 }}>
        <Box sx={{ width: 4, borderRadius: '4px', background: 'linear-gradient(180deg, #0D9488, #10B981)', flexShrink: 0 }} />
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A" sx={{ lineHeight: 1.3 }}>Thông tin cá nhân</Typography>
          <Typography color="text.secondary" fontSize={13.5} mt={0.5}>Quản lý tài khoản và bảo mật</Typography>
        </Box>
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileCard user={currentUser} />
        </Grid>
        <Grid item xs={12} md={8}>
          <ProfileForm
            editMode={editMode}
            setEditMode={setEditMode}
            form={profileForm}
            setForm={setProfileForm}
            onSubmit={handleProfileUpdate}
            loading={isUpdating}
          />
          <PasswordForm
            form={passwordForm}
            setForm={setPasswordForm}
            onSubmit={handlePasswordChange}
            loading={isChangingPassword}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

function ProfileCard({ user }: { user: User | null }) {
  const roles = user?.roles ?? [];
  const rows = [
    { icon: <Email sx={{ fontSize: 17 }} />, label: 'Email', value: user?.email || '—' },
    { icon: <Phone sx={{ fontSize: 17 }} />, label: 'Điện thoại', value: user?.phone || '—' },
  ];
  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', textAlign: 'center', overflow: 'hidden' }}>
      <Box sx={{ height: 6, background: 'linear-gradient(135deg, #0D9488, #10B981)' }} />
      <CardContent sx={{ p: 3.5 }}>
        <Box sx={{ width: 88, height: 88, borderRadius: '50%', mx: 'auto', mb: 2, p: '3px', background: 'linear-gradient(135deg,#0D9488,#10B981)' }}>
          <Avatar
            sx={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg,#0F172A,#123E3C)',
              fontSize: 30, fontWeight: 800, color: '#5EEAD4',
            }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
        </Box>
        <Typography variant="h6" fontWeight={800} color="#0F172A">{user?.username}</Typography>
        <Typography color="text.secondary" fontSize={13} mb={2}>Thành viên hệ thống ElderCare</Typography>
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
          {roles.map((r) => (
            <Chip key={r.id} label={r.name} size="small" sx={{ bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', fontWeight: 700, border: '1px solid rgba(13,148,136,0.18)' }} />
          ))}
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={1.2} sx={{ textAlign: 'left' }}>
          {rows.map((row) => (
            <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.2, borderRadius: '12px', bgcolor: '#F8FAFC', border: '1px solid #EDF1F5' }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '10px', bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {row.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontSize={10.5} color="text.secondary" textTransform="uppercase" fontWeight={700} letterSpacing="0.05em">{row.label}</Typography>
                <Typography fontSize={13.5} fontWeight={600} color="#0F172A" noWrap>{row.value}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProfileForm({ editMode, setEditMode, form, setForm, onSubmit, loading }: any) {
  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Person sx={{ color: '#0D9488', fontSize: 19 }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>Thông tin</Typography>
          </Box>
          {!editMode && (
            <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditMode(true)}
              sx={{ borderRadius: '12px', borderColor: '#E2E8F0', color: '#475569', fontWeight: 600, '&:hover': { borderColor: '#0D9488', color: '#0D9488', bgcolor: 'rgba(13,148,136,0.06)' } }}>
              Sửa
            </Button>
          )}
        </Box>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Tên đăng nháp" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={!editMode}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!editMode}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Số điện thoại" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!editMode}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            {editMode && (
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit" variant="contained" startIcon={<Save />} disabled={loading}
                    sx={{ borderRadius: '12px', background: 'linear-gradient(135deg,#0D9488,#10B981)', fontWeight: 700, px: 3, boxShadow: '0 6px 18px rgba(13,148,136,0.3)', '&:hover': { background: 'linear-gradient(135deg,#0B7A70,#059669)' } }}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)} sx={{ borderRadius: '12px' }}>
                    Húy
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordForm({ form, setForm, onSubmit, loading }: any) {
  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock sx={{ color: '#0D9488', fontSize: 18 }} />
          </Box>
          <Typography variant="h6" fontWeight={700}>Đổi mật khẩu</Typography>
        </Box>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Mật khẩu hiện tại" type="password"
                value={form.oldPassword}
                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Mật khẩu mới" type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required inputProps={{ minLength: 6 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Xác nhận mật khẩu" type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit" variant="contained" startIcon={<Lock />} disabled={loading}
                sx={{ borderRadius: '12px', background: 'linear-gradient(135deg,#0D9488,#10B981)', fontWeight: 700, px: 3, boxShadow: '0 6px 18px rgba(13,148,136,0.3)', '&:hover': { background: 'linear-gradient(135deg,#0B7A70,#059669)' } }}
              >
                {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}