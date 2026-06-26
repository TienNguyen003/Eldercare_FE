import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Badge, Avatar, Menu, MenuItem,
  Divider, Collapse, useTheme, useMediaQuery, Tooltip,
} from '@mui/material';
import {
  Dashboard, People, PersonOutlined, MedicalServices, CalendarMonth,
  Assignment, WarningAmber, Inventory, Payment, Notifications, Settings,
  ExpandLess, ExpandMore, Menu as MenuIcon, Logout, Assessment,
  AdminPanelSettings, MonitorHeart, LocalPharmacy, Description,
  FavoriteOutlined, GroupOutlined, ChevronRight,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { useGetUnreadCountQuery } from '../../store/api/apiSlice';

const DRAWER_WIDTH = 260;

const navGroups = [
  {
    group: 'Tổng quan',
    items: [{ label: 'Dashboard', icon: Dashboard, path: '/' }],
  },
  {
    group: 'Quản lý',
    items: [
      { label: 'Người cao tuổi', icon: People, children: [
        { label: 'Danh sách', path: '/elderly', icon: GroupOutlined },
        { label: 'Hồ sơ bệnh', path: '/elderly/diseases', icon: Description },
      ]},
      { label: 'Nhân viên', icon: PersonOutlined, path: '/caregivers' },
    ],
  },
  {
    group: 'Chăm sóc',
    items: [
      { label: 'Kế hoạch', icon: Assignment, children: [
        { label: 'Care Plans', path: '/care-plans', icon: Assignment },
        { label: 'Lịch chăm sóc', path: '/care-schedules', icon: CalendarMonth },
      ]},
      { label: 'Y tế', icon: MedicalServices, children: [
        { label: 'Chỉ số sức khỏe', path: '/vital-signs', icon: MonitorHeart },
        { label: 'Thuốc', path: '/medications', icon: LocalPharmacy },
        { label: 'Đơn thuốc', path: '/prescriptions', icon: Description },
        { label: 'Lịch uống thuốc', path: '/medication-schedules', icon: CalendarMonth },
      ]},
      { label: 'Đánh giá', icon: Assessment, children: [
        { label: 'Chức năng', path: '/functional-assessments', icon: Assessment },
        { label: 'Tâm thần', path: '/mental-health-assessments', icon: Assessment },
      ]},
      { label: 'Sự cố', icon: WarningAmber, path: '/incidents' },
    ],
  },
  {
    group: 'Tài chính',
    items: [
      { label: 'Gói dịch vụ', icon: Inventory, path: '/service-packages' },
      { label: 'Thanh toán', icon: Payment, path: '/payments' },
    ],
  },
  {
    group: 'Hệ thống',
    items: [
      { label: 'Thông báo', icon: Notifications, path: '/notifications' },
      { label: 'Quản trị', icon: AdminPanelSettings, children: [
        { label: 'Người dùng', path: '/users', icon: PersonOutlined },
        { label: 'Phân quyền', path: '/roles', icon: AdminPanelSettings },
        { label: 'Audit Logs', path: '/audit-logs', icon: Description },
      ]},
    ],
  },
];

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['Quản lý', 'Chăm sóc']);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { data: unreadData } = useGetUnreadCountQuery(user?.id ?? 0, { skip: !user?.id });
  const unreadCount = unreadData?.data ?? 0;

  const toggleMenu = (label: string) =>
    setOpenMenus((p) => p.includes(label) ? p.filter((x) => x !== label) : [...p, label]);
  const handleNav = (path: string) => { navigate(path); if (isMobile) setMobileOpen(false); };
  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (children: { path: string }[]) => children.some((c) => isActive(c.path));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0F172A' }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FavoriteOutlined sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{ color: '#F1F5F9', fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>ElderCare</Typography>
          <Typography sx={{ color: '#475569', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin Panel</Typography>
        </Box>
      </Box>

      <Box sx={{ mx: 3, height: '1px', bgcolor: 'rgba(255,255,255,0.06)', mb: 1 }} />

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, pb: 2, '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2 } }}>
        {navGroups.map((group) => (
          <Box key={group.group}>
            <Typography sx={{ color: '#334155', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', px: 1.5, pt: 2.5, pb: 0.8 }}>
              {group.group}
            </Typography>
            {group.items.map((item: any) => {
              const IconComp = item.icon;
              if (item.children) {
                const open = openMenus.includes(item.label);
                const active = isGroupActive(item.children);
                return (
                  <Box key={item.label}>
                    <ListItemButton onClick={() => toggleMenu(item.label)} sx={{
                      borderRadius: '10px', mb: 0.3, py: 0.9, px: 1.5, gap: 1.5,
                      color: active ? '#E2E8F0' : '#64748B',
                      bgcolor: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#CBD5E1' },
                      transition: 'all 0.15s',
                    }}>
                      <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: active ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconComp sx={{ fontSize: 15, color: active ? '#60A5FA' : 'inherit' }} />
                      </Box>
                      <Typography sx={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</Typography>
                      {open ? <ExpandLess sx={{ fontSize: 15, color: '#475569' }} /> : <ExpandMore sx={{ fontSize: 15, color: '#475569' }} />}
                    </ListItemButton>
                    <Collapse in={open} unmountOnExit>
                      <List disablePadding sx={{ pl: 1.5, mb: 0.5 }}>
                        {item.children.map((child: any) => {
                          const ChildIcon = child.icon;
                          const active = isActive(child.path);
                          return (
                            <ListItemButton key={child.path} onClick={() => handleNav(child.path)} sx={{
                              borderRadius: '8px', mb: 0.2, py: 0.7, px: 1.5, gap: 1.5,
                              color: active ? '#fff' : '#475569',
                              bgcolor: active ? 'linear-gradient(135deg,rgba(37,99,235,0.3),rgba(124,58,237,0.2))' : 'transparent',
                              background: active ? 'linear-gradient(135deg,rgba(37,99,235,0.25),rgba(124,58,237,0.15))' : 'transparent',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', color: '#94A3B8' },
                              transition: 'all 0.15s',
                            }}>
                              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: active ? '#60A5FA' : '#1E293B', ml: 0.5, flexShrink: 0 }} />
                              <Typography sx={{ fontSize: 12.5, fontWeight: active ? 600 : 400 }}>{child.label}</Typography>
                              {active && <ChevronRight sx={{ fontSize: 13, color: '#60A5FA', ml: 'auto' }} />}
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  </Box>
                );
              }
              const active = isActive(item.path);
              return (
                <ListItemButton key={item.path} onClick={() => handleNav(item.path)} sx={{
                  borderRadius: '10px', mb: 0.3, py: 0.9, px: 1.5, gap: 1.5,
                  color: active ? '#fff' : '#64748B',
                  bgcolor: active ? 'transparent' : 'transparent',
                  background: active ? 'linear-gradient(135deg,rgba(37,99,235,0.25),rgba(124,58,237,0.15))' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#CBD5E1' },
                  transition: 'all 0.15s',
                }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: active ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComp sx={{ fontSize: 15, color: active ? '#60A5FA' : 'inherit' }} />
                  </Box>
                  <Typography sx={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</Typography>
                  {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#60A5FA' }} />}
                </ListItemButton>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* User */}
      <Box sx={{ mx: 3, height: '1px', bgcolor: 'rgba(255,255,255,0.06)' }} />
      <Box sx={{ p: 2 }}>
        <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.04)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' }, transition: 'all 0.15s' }}>
          <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', fontSize: 13, fontWeight: 700 }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: '#E2E8F0', fontSize: 12.5, fontWeight: 600 }} noWrap>{user?.username}</Typography>
            <Typography sx={{ color: '#475569', fontSize: 11 }} noWrap>{user?.email || 'Admin'}</Typography>
          </Box>
          <Settings sx={{ color: '#334155', fontSize: 14 }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F1F5F9', minHeight: '100vh' }}>
      {/* Sidebar */}
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent"
          sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' } }}>
          {drawerContent}
        </Drawer>
      )}

      {/* Main column */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Topbar — sticky, không dùng AppBar fixed */}
        <Box sx={{
          position: 'sticky', top: 0, zIndex: 100,
          bgcolor: '#fff', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: { xs: 2, sm: 3 }, height: 58, flexShrink: 0,
        }}>
          {isMobile && <IconButton size="small" onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>}
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Thông báo">
            <IconButton size="small" onClick={() => navigate('/notifications')}
              sx={{ width: 36, height: 36, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
              <Badge badgeContent={unreadCount || 0} color="error" max={99}>
                <Notifications sx={{ fontSize: 17, color: '#64748B' }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Box sx={{ width: '1px', height: 24, bgcolor: '#E2E8F0', flexShrink: 0 }} />
          <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: '10px', '&:hover': { bgcolor: '#F8FAFC' } }}>
            <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', fontSize: 12, fontWeight: 700 }}>
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: '#0F172A' }}>{user?.username}</Typography>
              <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>Admin</Typography>
            </Box>
          </Box>
        </Box>

        {/* Page content */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { mt: 1, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', minWidth: 200 } }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #F1F5F9' }}>
          <Typography fontWeight={700} fontSize={14}>{user?.username}</Typography>
          <Typography fontSize={12} color="text.secondary">{user?.email}</Typography>
        </Box>
        <MenuItem onClick={() => { navigate('/notifications'); setAnchorEl(null); }} sx={{ gap: 1.5, py: 1.3, mx: 1, my: 0.5, borderRadius: '8px' }}>
          <Notifications fontSize="small" sx={{ color: '#64748B' }} />
          <Typography fontSize={13}>Thông báo</Typography>
          {unreadCount > 0 && <Badge badgeContent={unreadCount} color="error" sx={{ ml: 'auto' }} />}
        </MenuItem>
        <Divider sx={{ mx: 1 }} />
        <MenuItem onClick={() => { dispatch(logout()); navigate('/login'); }} sx={{ gap: 1.5, py: 1.3, mx: 1, my: 0.5, borderRadius: '8px', color: '#EF4444' }}>
          <Logout fontSize="small" />
          <Typography fontSize={13}>Đăng xuất</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
