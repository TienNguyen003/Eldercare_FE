import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, Typography, List, ListItemButton,
  IconButton, Badge, Avatar, Menu, MenuItem, Divider, Collapse,
  useTheme, useMediaQuery, Tooltip,
} from '@mui/material';
import {
  Dashboard, People, PersonOutlined, MedicalServices, CalendarMonth,
  Assignment, WarningAmber, Inventory, Payment, Notifications,
  ExpandLess, ExpandMore, Menu as MenuIcon, Logout, Assessment,
  AdminPanelSettings, MonitorHeart, LocalPharmacy, Description,
  Favorite, GroupOutlined, Person, FamilyRestroom, RateReview,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { useGetUnreadCountQuery } from '../../store/api/apiSlice';
import GlobalSearch from './GlobalSearch';

const DRAWER_WIDTH = 272;

const navGroups = [
  { group: 'Tổng quan', items: [{ label: 'Dashboard', icon: Dashboard, path: '/' }] },
  { group: 'Cá nhân', items: [
      { label: 'Người thân của tôi', icon: FamilyRestroom, path: '/my-family' },
      { label: 'Ngày làm việc của tôi', icon: Assignment, path: '/my-day' },
    ] },
  { group: 'Quản lý', items: [
      { label: 'Người cao tuổi', icon: People, children: [
        { label: 'Danh sách', path: '/elderly', icon: GroupOutlined },
        { label: 'Hồ sơ bệnh', path: '/elderly/diseases', icon: Description },
      ] },
      { label: 'Nhân viên', icon: PersonOutlined, path: '/caregivers' },
      { label: 'Documents', icon: Description, path: '/documents' },
    ] },
  { group: 'Chăm sóc', items: [
      { label: 'Kế hoạch', icon: Assignment, children: [
                { label: 'Care Plans', path: '/care-plans', icon: Assignment },
        { label: 'Lịch chăm sóc', path: '/care-schedules', icon: CalendarMonth },
        { label: 'Công việc trong ca', path: '/care-tasks', icon: Assignment },
      ] },
      { label: 'Y tế', icon: MedicalServices, children: [
        { label: 'Chỉ số sức khỏe', path: '/vital-signs', icon: MonitorHeart },
        { label: 'Thuốc', path: '/medications', icon: LocalPharmacy },
        { label: 'Đơn thuốc', path: '/prescriptions', icon: Description },
        { label: 'Lịch uống thuốc', path: '/medication-schedules', icon: CalendarMonth },
      ] },
      { label: 'Đánh giá', icon: Assessment, children: [
        { label: 'Chức năng', path: '/functional-assessments', icon: Assessment },
        { label: 'Tâm thần', path: '/mental-health-assessments', icon: Assessment },
      ] },
      { label: 'Sự cố', icon: WarningAmber, path: '/incidents' },
    ] },
  { group: 'Tài chính', items: [
      { label: 'Gói dịch vụ', icon: Inventory, path: '/service-packages' },
      { label: 'Yêu cầu đặt dịch vụ', icon: Inventory, path: '/service-bookings' },
      { label: 'Thanh toán', icon: Payment, path: '/payments' },
    ] },
  { group: 'Hệ thống', items: [
      { label: 'Thông báo', icon: Notifications, path: '/notifications' },
      { label: 'Đánh giá dịch vụ', icon: RateReview, path: '/feedbacks' },
      { label: 'Quản trị', icon: AdminPanelSettings, children: [
        { label: 'Người dùng', path: '/users', icon: PersonOutlined },
        { label: 'Phân quyền', path: '/roles', icon: AdminPanelSettings },
        { label: 'Audit Logs', path: '/audit-logs', icon: Description },
      ] },
    ] },
  { group: 'Báo cáo', items: [
      { label: 'Phân tích & thống kê', icon: Assessment, path: '/reports' },
    ] },
];

// Menu tối giản cho tài khoản GIA ĐÌNH (không phải ADMIN/CAREGIVER)
const familyNavGroups = [
  { group: 'Cá nhân', items: [
      { label: 'Người thân của tôi', icon: FamilyRestroom, path: '/my-family' },
    ] },
  { group: 'Hệ thống', items: [
      { label: 'Thông báo', icon: Notifications, path: '/notifications' },
    ] },
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
  const roleNames = user?.roles?.map((r) => r.name) ?? [];
  const isFamily = roleNames.length > 0 && !roleNames.includes('ADMIN') && !roleNames.includes('CAREGIVER');
  const visibleGroups = isFamily ? familyNavGroups : navGroups;

  const toggleMenu = (label: string) =>
    setOpenMenus((p) => p.includes(label) ? p.filter((x) => x !== label) : [...p, label]);
  const handleNav = (path: string) => { navigate(path); if (isMobile) setMobileOpen(false); };
  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (children: { path: string }[]) => children.some((c) => isActive(c.path));

const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0B1220', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: '-80px', left: '-60px', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ px: 3, py: 2.4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: '12px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(13,148,136,0.45)', flexShrink: 0 }}>
            <Favorite sx={{ color: '#fff', fontSize: 19 }} />
          </Box>
          <Box>
            <Typography sx={{ color: '#F1F5F9', fontWeight: 800, fontSize: 15.5, lineHeight: 1.1 }}>ElderCare</Typography>
            <Typography sx={{ color: '#5EEAD4', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</Typography>
          </Box>
        </Box>
        <Box sx={{ mx: 3, height: '1px', bgcolor: 'rgba(255,255,255,0.07)', mb: 1 }} />

        <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, pb:  2, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
          {visibleGroups.map((group) => (
            <Box key={group.group}>
              <Typography sx={{ color: '#3E5B6E', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', px: 1.5, pt:  2.5, pb:  0.9 }}>
                {group.group}
              </Typography>
              {group.items.map((item: any) => {
                const IconComp = item.icon;
                if (item.children) {
                  const open = openMenus.includes(item.label);
                  const active = isGroupActive(item.children);
                  return (
                    <Box key={item.label}>
                      <ListItemButton onClick={() => toggleMenu(item.label)} sx={{ borderRadius: '12px', mb: 0.3, py: 0.85, px: 1.5, gap:  1.5, color: active ? '#E2E8F0' : '#64748B', bgcolor: active ? 'rgba(13,148,136,0.16)' : 'transparent', position: 'relative', overflow: 'hidden', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }, transition: 'all 0.18s', ...(active && { '&::before': { content: '""', position: 'absolute', left: 0, top: '24%', bottom: '24%', width: 3, borderRadius: '4px', background: 'linear-gradient(180deg, #2DD4BF, #10B981)' } }) }}>
                        <Box sx={{ width: 30, height:  30, borderRadius: '9px', bgcolor: active ? 'rgba(13,148,136,0.3)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconComp sx={{ fontSize: 16, color: active ? '#5EEAD4' : 'inherit' }} />
                        </Box>
                        <Typography sx={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</Typography>
                        {open ? <ExpandLess sx={{ fontSize: 15, color: '#475569' }} /> : <ExpandMore sx={{ fontSize: 15, color: '#475569' }} />}
                      </ListItemButton>
                      <Collapse in={open} unmountOnExit>
                        <List disablePadding sx={{ pl: 1.5, mb:  0.6 }}>
                          {item.children.map((child: any) => {
                            const active = isActive(child.path);
                            return (
                              <ListItemButton key={child.path} onClick={() => handleNav(child.path)} sx={{ borderRadius: '10px', py: 0.6, px: 1.5, mb:  0.2, gap:  1, color: active ? '#E2E8F0' : '#64748B', bgcolor: active ? 'rgba(13,148,136,0.22)' : 'transparent', position: 'relative', overflow: 'hidden', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }, transition: 'all 0.18s', ...(active && { '&::before': { content: '""', position: 'absolute', left: 0, top: '26%', bottom: '26%', width: 2.5, borderRadius: '4px', background: '#2DD4BF' } }) }}>
                                <Box sx={{ width: 5, height:  5, borderRadius: '50%', bgcolor: active ? '#5EEAD4' : '#1E293B', ml: 0.5, flexShrink: 0 }} />
                                <Typography sx={{ fontSize: 12.5, fontWeight: active ? 600 : 400 }}>{child.label}</Typography>
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
                  <ListItemButton key={item.path} onClick={() => handleNav(item.path)} sx={{ borderRadius: '12px', mb: 0.3, py: 0.85, px:  1.5, gap:  1.5, color: active ? '#fff' : '#64748B', background: active ? 'linear-gradient(135deg,rgba(13,148,136,0.55),rgba(16,185,129,0.3))' : 'transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }, transition: 'all 0.18s' }}>
                    <Box sx={{ width: 30, height: 30, borderRadius: '9px', bgcolor: active ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComp sx={{ fontSize: 16, color: active ? '#5EEAD4' : 'inherit' }} />
                    </Box>
                    <Typography sx={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</Typography>
                    {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#5EEAD4', boxShadow: '0 0 10px rgba(94,234,212,0.8)' }} />}
                  </ListItemButton>
                );
              })}
            </Box>
          ))}
        </Box>

        <Box sx={{ mx: 3, height: '1px', bgcolor: 'rgba(255,255,255,0.07)' }} />
        <Box sx={{ p: 2 }}>
          <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.04)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' }, transition: 'all 0.18s' }}>
            <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg,#0D9488,#10B981)', fontSize: 13, fontWeight: 700 }}>
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: '#E2E8F0', fontSize: 12.5, fontWeight: 600 }} noWrap>{user?.username}</Typography>
              <Typography sx={{ color: '#475569', fontSize: 11 }} noWrap>{user?.email || 'Admin'}</Typography>
            </Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); dispatch(logout()); navigate('/login'); }} title="Đăng xuất" sx={{ width: 28, height: 28, color: '#334155', '&:hover': { color: '#F87171', bgcolor: 'rgba(239,68,68,0.15)' } }}>
              <Logout sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );

return (
    <Box sx={{ display: 'flex', bgcolor: '#F1F5F9', minHeight: '100vh' }}>
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', backgroundImage: 'none' } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none', backgroundImage: 'none' } }}>
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid #E8EEF3', display: 'flex', alignItems: 'center', gap: 1.5, px: { xs: 2, sm:  3 }, height:  64, flexShrink: 0 }}>
          {isMobile && <IconButton size="small" onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>}
          <GlobalSearch />
          <Box sx={{ flex: { xs: 1, sm:  0 } }} />
          <Tooltip title="Thông báo">
            <IconButton size="small" onClick={() => navigate('/notifications')} sx={{ width: 38, height: 38, bgcolor: '#F1F5F9', border: '1px solid #E8EEF3', borderRadius: '11px', '&:hover': { bgcolor: '#EDF5F3', borderColor: '#0D9488' } }}>
              <Badge badgeContent={unreadCount || 0} color="error" max={99}>
                <Notifications sx={{ fontSize: 18, color: '#64748B' }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Box sx={{ width: '1px', height: 26, bgcolor: '#E8EEF3', flexShrink: 0 }} />
          <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: '11px', '&:hover': { bgcolor: '#F1F5F9' } }}>
            <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg,#0D9488,#10B981)', fontSize: 12, fontWeight: 700 }}>
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: '#0F172A' }}>{user?.username}</Typography>
              <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>{user?.roles?.[0]?.name ?? 'Admin'}</Typography>
            </Box>
          </Box>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm:  3 }, overflow: 'auto' }}>
          <Box key={location.pathname} className="fade-in" sx={{ animationDuration: '0.35s' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} PaperProps={{ sx: { mt:  1, minWidth:  200 } }}>
        <Box sx={{ px: 2.5, py:  2, borderBottom: '1px solid #EDF1F5' }}>
          <Typography fontWeight={700} fontSize={14}>{user?.username}</Typography>
          <Typography fontSize={12} color="text.secondary">{user?.email}</Typography>
        </Box>
        <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }} sx={{ gap: 1.5, py: 1.3, mx: 1, my: 0.5 }}>
          <Person fontSize="small" sx={{ color: '#64748B' }} />
          <Typography fontSize={13}>Thông tin cá nhân</Typography>
        </MenuItem>
        <MenuItem onClick={() => { navigate('/notifications'); setAnchorEl(null); }} sx={{ gap: 1.5, py: 1.3, mx: 1, my: 0.5 }}>
          <Notifications fontSize="small" sx={{ color: '#64748B' }} />
          <Typography fontSize={13}>Thông báo</Typography>
          {unreadCount > 0 && <Badge badgeContent={unreadCount} color="error" sx={{ ml: 'auto' }} />}
        </MenuItem>
        <Divider sx={{ mx: 1 }} />
        <MenuItem onClick={() => { dispatch(logout()); navigate('/login'); }} sx={{ gap: 1.5, py: 1.3, mx: 1, my: 0.5, color: '#EF4444' }}>
          <Logout fontSize="small" />
          <Typography fontSize={13}>Đăng xuất</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}