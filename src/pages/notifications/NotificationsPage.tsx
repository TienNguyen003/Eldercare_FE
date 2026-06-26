import { Box, Card, Typography, IconButton, Chip, CircularProgress, Avatar, Button, Divider } from '@mui/material';
import { Notifications as NotifIcon, Delete, DoneAll, Circle, NotificationsNone } from '@mui/icons-material';
import { format } from 'date-fns';
import { useGetNotificationsQuery, useMarkNotificationReadMutation, useDeleteNotificationMutation } from '../../store/api/apiSlice';
import { useAppSelector } from '../../hooks/redux';
import PageHeader from '../../components/common/PageHeader';

export default function NotificationsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data, isLoading } = useGetNotificationsQuery(user?.id ?? 0, { skip: !user?.id });
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const notifications = data?.data ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <PageHeader title="Thông báo" subtitle={unread > 0 ? `${unread} thông báo chưa đọc` : 'Tất cả đã được đọc'}>
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'none', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', bgcolor: '#FAFBFC' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <NotifIcon sx={{ fontSize: 18, color: '#2563EB' }} />
            </Box>
            <Typography fontWeight={700} fontSize={15}>Tất cả thông báo</Typography>
            {unread > 0 && (
              <Chip label={unread} size="small" sx={{ bgcolor: '#EF4444', color: '#fff', fontWeight: 700, height: 20, fontSize: 11 }} />
            )}
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <NotificationsNone sx={{ fontSize: 56, color: '#CBD5E1', mb: 2 }} />
            <Typography fontWeight={600} color="text.secondary">Không có thông báo nào</Typography>
            <Typography fontSize={13} color="text.disabled" mt={0.5}>Các thông báo mới sẽ xuất hiện tại đây</Typography>
          </Box>
        ) : (
          <Box>
            {notifications.map((n, idx) => (
              <Box key={n.id}>
                <Box sx={{
                  display: 'flex', gap: 2, px: 3, py: 2.5, alignItems: 'flex-start',
                  bgcolor: n.isRead ? 'transparent' : 'rgba(37,99,235,0.03)',
                  borderLeft: n.isRead ? '3px solid transparent' : '3px solid #2563EB',
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: '#F8FAFC' },
                }}>
                  <Avatar sx={{ width: 38, height: 38, bgcolor: n.isRead ? '#F1F5F9' : '#EFF6FF', mt: 0.3, flexShrink: 0 }}>
                    <NotifIcon sx={{ fontSize: 18, color: n.isRead ? '#94A3B8' : '#2563EB' }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                      <Typography fontWeight={n.isRead ? 500 : 700} fontSize={14} color={n.isRead ? 'text.primary' : '#0F172A'}>
                        {n.title}
                      </Typography>
                      {!n.isRead && <Circle sx={{ fontSize: 8, color: '#2563EB' }} />}
                    </Box>
                    <Typography fontSize={13} color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.6 }}>{n.message}</Typography>
                    <Typography fontSize={11.5} color="text.disabled">
                      {n.createdAt ? format(new Date(n.createdAt), 'HH:mm · dd/MM/yyyy') : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    {!n.isRead && (
                      <IconButton size="small" onClick={() => markRead(n.id)}
                        sx={{ width: 30, height: 30, bgcolor: '#EFF6FF', color: '#2563EB', '&:hover': { bgcolor: '#DBEAFE' } }}>
                        <DoneAll sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => deleteNotif(n.id)}
                      sx={{ width: 30, height: 30, bgcolor: '#FEF2F2', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                      <Delete sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Box>
                {idx < notifications.length - 1 && <Divider sx={{ mx: 3 }} />}
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </PageHeader>
  );
}
