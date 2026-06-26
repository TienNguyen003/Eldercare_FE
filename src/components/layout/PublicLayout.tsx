import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, Container, IconButton, Drawer,
  List, ListItemButton, ListItemText, Typography, alpha, Divider,
} from '@mui/material';
import { Menu as MenuIcon, FavoriteOutlined, Close, AdminPanelSettings } from '@mui/icons-material';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(241,245,249,0.8)', color: '#0F172A' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: '0 !important', gap: 2, minHeight: '68px !important' }}>
            {/* Logo */}
            <Box onClick={() => navigate('/home')} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', flexGrow: { xs: 1, md: 0 } }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FavoriteOutlined sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ElderCare
              </Typography>
            </Box>

            {/* Desktop nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1, justifyContent: 'center' }}>
              {navLinks.map((link) => (
                <Button key={link.path} onClick={() => navigate(link.path)}
                  sx={{
                    color: location.pathname === link.path ? '#2563EB' : '#475569',
                    fontWeight: location.pathname === link.path ? 600 : 500,
                    fontSize: 14, borderRadius: '8px',
                    bgcolor: location.pathname === link.path ? alpha('#2563EB', 0.08) : 'transparent',
                    '&:hover': { bgcolor: alpha('#2563EB', 0.06), color: '#2563EB' },
                  }}>
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Desktop actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Button variant="text" startIcon={<AdminPanelSettings fontSize="small" />} onClick={() => navigate('/login')}
                sx={{ color: '#475569', fontSize: 13, '&:hover': { color: '#2563EB' } }}>
                Quản trị
              </Button>
              <Button variant="outlined" onClick={() => navigate('/login')}
                sx={{ borderColor: '#E2E8F0', color: '#475569', borderRadius: '10px', '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: 'transparent' } }}>
                Đăng nhập
              </Button>
              <Button variant="contained" onClick={() => navigate('/register')}
                sx={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: '10px', '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #6D28D9)' } }}>
                Bắt đầu ngay
              </Button>
            </Box>

            {/* Mobile menu btn */}
            <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 280, p: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FavoriteOutlined sx={{ color: '#fff', fontSize: 15 }} />
            </Box>
            <Typography fontWeight={800} fontSize={15}>ElderCare</Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItemButton key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false); }}
              sx={{ borderRadius: '10px', mb: 0.5, bgcolor: location.pathname === link.path ? alpha('#2563EB', 0.1) : 'transparent' }}>
              <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: location.pathname === link.path ? 600 : 400, color: location.pathname === link.path ? '#2563EB' : '#0F172A', fontSize: 14 }} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button fullWidth variant="outlined" onClick={() => { navigate('/login'); setMobileOpen(false); }} sx={{ borderRadius: '10px' }}>Đăng nhập</Button>
          <Button fullWidth variant="contained" onClick={() => { navigate('/register'); setMobileOpen(false); }}
            sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            Bắt đầu ngay
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ pt: '68px' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
