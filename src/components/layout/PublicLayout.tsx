import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, Container, IconButton, Drawer,
  List, ListItemButton, ListItemText, Typography, alpha, Divider,
  Avatar, Menu, MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, Favorite, Close, AdminPanelSettings, Logout, Dashboard, Person } from '@mui/icons-material';
import PublicFooter from './PublicFooter';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const navLinks = [
  { label: 'Trang chủ', path: '/home' },
  { label: 'Dịch vụ', path: '/services' },
  { label: 'Blog', path: '/blog' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Về chúng tôi', path: '/about' },
  { label: 'Liên hệ', path: '/contact' },
];

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate('/home');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F4F7F9' }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(226,232,240,0.7)', color: '#0F172A' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: '0 !important', gap: 2, minHeight: '72px !important' }}>
            <Box onClick={() => navigate('/home')} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', flexGrow: { xs: 1, md: 0 } }}>
              <Box sx={{ width: 38, height: 38, borderRadius: '12px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(13,148,136,0.35)' }}>
                <Favorite sx={{ color: '#fff', fontSize: 19 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 19, background: 'linear-gradient(135deg,#0D9488,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ElderCare</Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1, justifyContent: 'center' }}>
              {navLinks.map((link) => (
                <Button key={link.path} onClick={() => navigate(link.path)} sx={{ color: location.pathname === link.path ? '#0D9488' : '#475569', fontWeight: location.pathname === link.path ? 700 : 500, fontSize: 13.5, borderRadius: '10px', px: 1.8, bgcolor: location.pathname === link.path ? alpha('#0D9488', 0.08) : 'transparent', '&:hover': { bgcolor: alpha('#0D9488', 0.06), color: '#0D9488' } }}>
                  {link.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <Button variant="text" startIcon={<Dashboard fontSize="small" />} onClick={() => navigate('/')} sx={{ color: '#475569', fontSize: 13, '&:hover': { color: '#0D9488' } }}>Dashboard</Button>
                  <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: '10px', '&:hover': { bgcolor: '#F1F5F9' } }}>
                    <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg,#0D9488,#10B981)', fontSize: 12, fontWeight: 700 }}>
                      {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{user?.username}</Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Button variant="text" startIcon={<AdminPanelSettings fontSize="small" />} onClick={() => navigate('/login')} sx={{ color: '#475569', fontSize: 13, '&:hover': { color: '#0D9488' } }}>Quản trị</Button>
                  <Button variant="outlined" onClick={() => navigate('/login')} sx={{ borderColor: '#D9E2EC', color: '#334155', borderRadius: '10px', px: 2.2, '&:hover': { borderColor: '#0D9488', color: '#0D9488', bgcolor: 'transparent' } }}>Đăng nhập</Button>
                  <Button variant="contained" onClick={() => navigate('/register')} sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', borderRadius: '10px', px: 2.5, boxShadow: '0 6px 18px rgba(13,148,136,0.3)', '&:hover': { background: 'linear-gradient(135deg,#0B7A70,#059669)', boxShadow: '0 8px 24px rgba(13,148,136,0.42)' } }}>Bắt đầu ngay</Button>
                </>
              )}
            </Box>
            <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 290, p: 2, backgroundImage: 'none' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Favorite sx={{ color: '#fff', fontSize: 16 }} />
            </Box>
            <Typography fontWeight={800} fontSize={16}>ElderCare</Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItemButton key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false); }} sx={{ borderRadius: '12px', mb: 0.6, py: 1, bgcolor: location.pathname === link.path ? alpha('#0D9488', 0.1) : 'transparent' }}>
              <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: location.pathname === link.path ? 700 : 500, color: location.pathname === link.path ? '#0D9488' : '#0F172A', fontSize: 14 }} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1.5, borderColor: '#E5EBF1' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {isAuthenticated ? (
            <>
              <Button fullWidth variant="outlined" startIcon={<Dashboard fontSize="small" />} onClick={() => { navigate('/'); setMobileOpen(false); }} sx={{ borderRadius: '11px', py: 1.2 }}>Vào Dashboard</Button>
              <Button fullWidth variant="text" color="error" startIcon={<Logout fontSize="small" />} onClick={() => { handleLogout(); setMobileOpen(false); }} sx={{ borderRadius: '11px', py: 1.2 }}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="outlined" onClick={() => { navigate('/login'); setMobileOpen(false); }} sx={{ borderRadius: '11px', py: 1.2 }}>Đăng nhập</Button>
              <Button fullWidth variant="contained" onClick={() => { navigate('/register'); setMobileOpen(false); }} sx={{ borderRadius: '11px', py: 1.2, background: 'linear-gradient(135deg,#0D9488,#10B981)' }}>Bắt đầu ngay</Button>
            </>
          )}
        </Box>
      </Drawer>

      <Box component="main" sx={{ pt: '72px', flex: 1 }}>
        <Box key={location.pathname} className="fade-in" sx={{ animationDuration: '0.4s' }}>
          <Outlet />
        </Box>
      </Box>
      <PublicFooter />

      {/* User dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #EDF1F5' }}>
          <Typography fontWeight={700} fontSize={14}>{user?.username}</Typography>
          <Typography fontSize={12} color="text.secondary">{user?.email}</Typography>
        </Box>
        <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }} sx={{ gap: 1.5, py: 1.2, mx: 1, my: 0.5, borderRadius: '8px' }}>
          <Person fontSize="small" sx={{ color: '#64748B' }} />
          <Typography fontSize={13}>Thông tin cá nhân</Typography>
        </MenuItem>
        <MenuItem onClick={() => { navigate('/'); setAnchorEl(null); }} sx={{ gap: 1.5, py: 1.2, mx: 1, my: 0.5, borderRadius: '8px' }}>
          <Dashboard fontSize="small" sx={{ color: '#64748B' }} />
          <Typography fontSize={13}>Dashboard</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.2, mx: 1, my: 0.5, borderRadius: '8px', color: '#EF4444' }}>
          <Logout fontSize="small" />
          <Typography fontSize={13}>Đăng xuất</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}