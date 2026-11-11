import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip, Button, List, ListItem, ListItemIcon, ListItemText, Skeleton, Alert, Rating } from '@mui/material';
import { MonitorHeart, LocalPharmacy, Assignment, Groups, CalendarMonth, WarningAmber, CheckCircle, ArrowForward, Star } from '@mui/icons-material';
import { useGetServicePackagesQuery, useGetFeedbacksQuery } from '../../store/api/apiSlice';
import type { ServicePackage, Feedback } from '../../types';
import BookingDialog from '../../components/public/BookingDialog';
import FeedbackDialog from '../../components/public/FeedbackDialog';
import { format, parseISO } from 'date-fns';
import PageHero from '../../components/public/PageHero';

const serviceDetails = [
  { icon: <MonitorHeart />, title: 'Theo dõi chỉ số sức khỏe', color: '#0D9488', items: ['Đo huyết áp, nhịp tim, nhiệt độ', 'Cảnh báo bất thường tức thì', 'Lưu trữ lịch sử sức khỏe', 'Biểu đồ xu hướng sức khỏe'] },
  { icon: <LocalPharmacy />, title: 'Quản lý thuốc', color: '#10B981', items: ['Quản lý đơn thuốc chi tiết', 'Nhắc nhở uống thuốc đúng giờ', 'Cảnh báo tương tác thuốc', 'Theo dõi tồn kho thuốc'] },
  { icon: <Assignment />, title: 'Kế hoạch chăm sóc', color: '#059669', items: ['Lập kế hoạch cá nhân hóa', 'Phân công nhân viên phù hợp', 'Theo dõi tiến độ thực hiện', 'Báo cáo định kỳ cho gia đình'] },
  { icon: <CalendarMonth />, title: 'Lịch chăm sóc', color: '#DC2626', items: ['Lên lịch chăm sóc linh hoạt', 'Nhắc lịch tự động', 'Điều phối nhân viên thông minh', 'Quản lý ca làm việc'] },
  { icon: <Groups />, title: 'Đội ngũ chuyên nghiệp', color: '#D97706', items: ['Nhân viên được chứng nhận', 'Đào tạo định kỳ', 'Đánh giá năng lực thường xuyên', 'Hỗ trợ tâm lý cho người cao tuổi'] },
  { icon: <WarningAmber />, title: 'Quản lý sự cố', color: '#0EA5E9', items: ['Ghi nhận sự cố tức thì', 'Phân loại mức độ ưu tiên', 'Thông báo cho gia đình', 'Báo cáo và phân tích'] },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetServicePackagesQuery({ page: 0, size: 50 });
  const packages: ServicePackage[] = data?.data?.content ?? [];
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<number | undefined>(undefined);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { data: feedbackData } = useGetFeedbacksQuery({ page: 0, size: 6 });
  const feedbacks: Feedback[] = feedbackData?.data?.content ?? [];

  const openBooking = (pkgId?: number) => {
    setSelectedPkg(pkgId);
    setBookingOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getPackageColor = (index: number) => {
    const colors = ['#0D9488', '#10B981', '#059669', '#0891B2', '#D97706'];
    return colors[index % colors.length];
  };

  return (
    <Box>
      {/* Hero */}
      <PageHero
        chip="Dịch vụ"
        title="Dịch vụ chăm sóc toàn diện"
        subtitle="Các gói dịch vụ chất lượng cao, được cá nhân hóa cho từng người cao tuổi — từ theo dõi sức khỏe đến chăm sóc hằng ngày"
        image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=75"
      />

      {/* Services grid */}
      <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {serviceDetails.map((s) => (
              <Grid item xs={12} md={4} key={s.title}>
                <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid #E2E8F0', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }, transition: 'all 0.3s' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar sx={{ bgcolor: `${s.color}15`, width: 52, height: 52, mb: 2 }}>
                      <Box sx={{ color: s.color }}>{s.icon}</Box>
                    </Avatar>
                    <Typography fontWeight={700} fontSize={17} mb={2}>{s.title}</Typography>
                    <List dense disablePadding>
                      {s.items.map((item) => (
                        <ListItem key={item} disableGutters sx={{ py: 0.3 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}><CheckCircle sx={{ color: s.color, fontSize: 16 }} /></ListItemIcon>
                          <ListItemText primary={item} primaryTypographyProps={{ fontSize: 13, color: '#475569' }} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing */}
      <Box sx={{ py: 10, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight={800} mb={1.5}>Bảng giá dịch vụ</Typography>
            <Typography color="text.secondary" fontSize={16}>Chọn gói phù hợp với nhu cầu của gia đình bạn</Typography>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
              Không thể tải dữ liệu gói dịch vụ. Vui lòng thử lại sau.
            </Alert>
          )}

          {isLoading ? (
            <Grid container spacing={3} justifyContent="center">
              {[1, 2, 3].map((i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                    <CardContent sx={{ p: 3.5 }}>
                      <Skeleton variant="text" width="40%" height={32} />
                      <Skeleton variant="text" width="60%" height={48} sx={{ my: 2 }} />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="rectangular" height={48} sx={{ mt: 2, borderRadius: '12px' }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : packages.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {packages.map((pkg, index) => {
                const color = getPackageColor(index);
                const features = pkg.features ? pkg.features.split(',').map(f => f.trim()) : [];
                return (
                  <Grid item xs={12} md={4} key={pkg.id}>
                    <Card sx={{
                      height: '100%', borderRadius: '20px', position: 'relative', overflow: 'visible',
                      border: index === 1 ? `2px solid ${color}` : '1px solid #E2E8F0',
                      boxShadow: index === 1 ? `0 20px 60px ${color}25` : 'none',
                    }}>
                      {index === 1 && (
                        <Chip label="Phổ biến nhất" size="small" sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', bgcolor: color, color: '#fff', fontWeight: 700 }} />
                      )}
                      <CardContent sx={{ p: 3.5 }}>
                        <Typography variant="h5" fontWeight={700} mb={0.5}>{pkg.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 3 }}>
                          <Typography variant="h3" fontWeight={800} sx={{ color }}>{formatPrice(pkg.price)}</Typography>
                          <Typography color="text.secondary" fontSize={14}>đ{pkg.duration ? `/${pkg.duration} ngày` : '/tháng'}</Typography>
                        </Box>
                        {pkg.description && (
                          <Typography color="text.secondary" fontSize={13} mb={2} sx={{ fontStyle: 'italic' }}>
                            {pkg.description}
                          </Typography>
                        )}
                        <List dense disablePadding sx={{ mb: 3 }}>
                          {features.length > 0 ? features.map((f, i) => (
                            <ListItem key={i} disableGutters sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color, fontSize: 18 }} /></ListItemIcon>
                              <ListItemText primary={f} primaryTypographyProps={{ fontSize: 14 }} />
                            </ListItem>
                          )) : (
                            <ListItem disableGutters sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color, fontSize: 18 }} /></ListItemIcon>
                              <ListItemText primary="Gói dịch vụ đầy đủ tính năng" primaryTypographyProps={{ fontSize: 14 }} />
                            </ListItem>
                          )}
                        </List>
                        <Button fullWidth variant={index === 1 ? 'contained' : 'outlined'} endIcon={<ArrowForward />}
                          onClick={() => openBooking(pkg.id)}
                          sx={{
                            py: 1.5, fontWeight: 700, borderRadius: '12px',
                            ...(index === 1 ? { background: `linear-gradient(135deg, ${color}, #10B981)` } : { borderColor: color, color }),
                          }}>
                          Đăng ký ngay
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">Chưa có gói dịch vụ nào.</Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Đánh giá khách hàng */}
      <Box sx={{ py: 10, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight={800} mb={1.5}>Khách hàng nói về chúng tôi</Typography>
            <Typography color="text.secondary" fontSize={16}>Sự hài lòng của gia đình là thước đo thành công của chúng tôi</Typography>
          </Box>

          {feedbacks.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm!</Typography>
            </Box>
          ) : (
            <Grid container spacing={3} mb={4}>
              {feedbacks.map((f) => (
                <Grid item xs={12} md={4} key={f.id}>
                  <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Rating value={f.rating} readOnly size="small" sx={{ color: '#F59E0B', mb: 1 }} />
                      <Typography fontSize={14} color="#334155" sx={{ fontStyle: 'italic', mb: 2, minHeight: 42 }}>
                        “{f.comment || 'Dịch vụ chăm sóc tận tâm và chuyên nghiệp.'}”
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(13,148,136,0.12)', color: '#0D9488', fontSize: 14, fontWeight: 700 }}>
                          {f.authorName?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontSize={13.5} fontWeight={700}>{f.authorName}</Typography>
                          <Typography fontSize={11.5} color="text.secondary">
                            {f.caregiverName ? `Về ${f.caregiverName}` : ''} {f.createdAt ? `· ${format(parseISO(f.createdAt), 'dd/MM/yyyy')}` : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box textAlign="center">
            <Button variant="outlined" startIcon={<Star />} onClick={() => setFeedbackOpen(true)}
              sx={{ borderColor: '#0D9488', color: '#0D9488', borderRadius: '12px', fontWeight: 700, px: 3, py: 1.4 }}>
              Gửi đánh giá của bạn
            </Button>
          </Box>
        </Container>
      </Box>
      <BookingDialog open={bookingOpen} onClose={() => setBookingOpen(false)} preselectedPackageId={selectedPkg} />
      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </Box>
  );
}
