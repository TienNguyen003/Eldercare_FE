import { useState } from 'react';
import {
  Box, Container, Typography, Chip, Card, CardContent, Avatar,
  Grid, IconButton, Button, CircularProgress,
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, Today, CalendarMonth,
  AccessTime, FiberManualRecord,
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, addMonths, subMonths, isSameMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useGetCareSchedulesQuery, useGetCaregiversQuery } from '../../store/api/apiSlice';
import EmptyState from '../../components/common/EmptyState';

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const CAREGIVER_COLORS = [
  { bg: '#EFF6FF', border: '#BFDBFE', text: '#0B7A70', dot: '#0D9488' },
  { bg: '#F5F3FF', border: '#DDD6FE', text: '#059669', dot: '#10B981' },
  { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', dot: '#059669' },
  { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', dot: '#D97706' },
  { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', dot: '#DC2626' },
  { bg: '#F0FDFA', border: '#99F6E4', text: '#134E4A', dot: '#0D9488' },
];

export default function CaregiverSchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const { data: schedulesData, isLoading } = useGetCareSchedulesQuery({ page: 0, size: 200 });
  const { data: caregiversData } = useGetCaregiversQuery({ page: 0, size: 100 });

  const schedules = schedulesData?.data?.content ?? [];
  const caregivers = caregiversData?.data?.content ?? [];

  // Map caregiver id → color index
  const colorMap: Record<number, number> = {};
  caregivers.forEach((c, i) => { colorMap[c.id] = i % CAREGIVER_COLORS.length; });

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startPad = getDay(startOfMonth(currentMonth)); // 0=Sun

  // Lấy schedules theo ngày
  const getSchedulesForDay = (day: Date) =>
    schedules.filter((s) => {
      if (!s.scheduledDate) return false;
      return isSameDay(new Date(s.scheduledDate), day);
    });

  const selectedSchedules = getSchedulesForDay(selectedDay);

  // Lấy caregiver name
  const getCaregiverName = (id?: number) =>
    caregivers.find((c) => c.id === id)?.fullName ?? `Nhân viên #${id}`;

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0F172A, #123E3C)', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Chip label="Lịch chăm sóc" sx={{ bgcolor: 'rgba(13,148,136,0.2)', color: '#99F6E4', fontWeight: 600, mb: 2 }} />
          <Typography variant="h3" fontWeight={800} color="#fff" mb={1.5}>Lịch nhân viên chăm sóc</Typography>
          <Typography color="#94A3B8" fontSize={16}>Xem lịch phân công chăm sóc — ai đang chăm sóc ai, ca nào còn trống</Typography>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#F8FAFC', py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Calendar */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)' }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Month nav */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                      <ChevronLeft />
                    </IconButton>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography fontWeight={800} fontSize={18} color="#0F172A">
                        {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Today />} onClick={() => { setCurrentMonth(new Date()); setSelectedDay(new Date()); }}
                        sx={{ borderRadius: '10px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: 12 }}>
                        Hôm nay
                      </Button>
                      <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                        <ChevronRight />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Day headers */}
                  <Grid container sx={{ mb: 1 }}>
                    {DAY_LABELS.map((d) => (
                      <Grid item key={d} xs={12 / 7}>
                        <Typography textAlign="center" fontSize={12} fontWeight={700} color="#94A3B8"
                          sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', py: 0.5 }}>
                          {d}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Calendar grid */}
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
                  ) : (
                    <Grid container>
                      {/* Padding cells */}
                      {Array.from({ length: startPad }).map((_, i) => (
                        <Grid item key={`pad-${i}`} xs={12 / 7}>
                          <Box sx={{ aspectRatio: '1', p: 0.5 }} />
                        </Grid>
                      ))}
                      {days.map((day) => {
                        const daySchedules = getSchedulesForDay(day);
                        const isSelected = isSameDay(day, selectedDay);
                        const isCurrentDay = isToday(day);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        // Lấy tối đa 3 màu dots
                        const dotColors = [...new Set(daySchedules.map((s) => colorMap[s.caregiverId ?? 0] ?? 0))].slice(0, 3);

                        return (
                          <Grid item key={day.toISOString()} xs={12 / 7}>
                            <Box onClick={() => setSelectedDay(day)} sx={{
                              aspectRatio: '1', p: 0.5, cursor: 'pointer',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              borderRadius: '12px', position: 'relative',
                              bgcolor: isSelected ? '#0D9488' : isCurrentDay ? '#EFF6FF' : 'transparent',
                              border: isCurrentDay && !isSelected ? '2px solid #0D9488' : '2px solid transparent',
                              '&:hover': { bgcolor: isSelected ? '#0D9488' : '#F1F5F9' },
                              transition: 'all 0.15s',
                              opacity: isCurrentMonth ? 1 : 0.3,
                            }}>
                              <Typography fontSize={13} fontWeight={isCurrentDay || isSelected ? 700 : 400}
                                sx={{ color: isSelected ? '#fff' : isCurrentDay ? '#0D9488' : '#374151', lineHeight: 1 }}>
                                {format(day, 'd')}
                              </Typography>
                              {/* Dots */}
                              {dotColors.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 0.3, mt: 0.3 }}>
                                  {dotColors.map((ci, i) => (
                                    <Box key={i} sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: isSelected ? 'rgba(255,255,255,0.8)' : CAREGIVER_COLORS[ci].dot }} />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </CardContent>
              </Card>

              {/* Legend */}
              {caregivers.length > 0 && (
                <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', mt: 2 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography fontWeight={700} fontSize={13} color="#64748B" mb={1.5}
                      sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>
                      Nhân viên
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {caregivers.slice(0, 8).map((c) => {
                        const ci = colorMap[c.id];
                        const col = CAREGIVER_COLORS[ci];
                        return (
                          <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.6, borderRadius: '8px', bgcolor: col.bg, border: `1px solid ${col.border}` }}>
                            <FiberManualRecord sx={{ fontSize: 8, color: col.dot }} />
                            <Typography fontSize={12} fontWeight={600} sx={{ color: col.text }}>{c.fullName}</Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Day detail panel */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', position: 'sticky', top: 20 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarMonth sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography fontWeight={800} fontSize={16} color="#0F172A">
                        {format(selectedDay, 'EEEE', { locale: vi })}
                      </Typography>
                      <Typography fontSize={13} color="#64748B">
                        {format(selectedDay, 'dd/MM/yyyy')}
                      </Typography>
                    </Box>
                  </Box>

                  {selectedSchedules.length === 0 ? (
                    <EmptyState
                      icon={<CalendarMonth />}
                      title="Không có lịch chăm sóc"
                      description="Ngày này chưa có ca phân công nào"
                      minHeight={180}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Typography fontSize={12} color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {selectedSchedules.length} ca chăm sóc
                      </Typography>
                      {selectedSchedules.map((s) => {
                        const ci = colorMap[s.caregiverId ?? 0] ?? 0;
                        const col = CAREGIVER_COLORS[ci];
                        return (
                          <Box key={s.id} sx={{ p: 2, borderRadius: '14px', bgcolor: col.bg, border: `1px solid ${col.border}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                              <Avatar sx={{ width: 30, height: 30, bgcolor: col.dot, fontSize: 12, fontWeight: 700 }}>
                                {getCaregiverName(s.caregiverId)?.[0]}
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography fontWeight={700} fontSize={13} sx={{ color: col.text }} noWrap>
                                  {getCaregiverName(s.caregiverId)}
                                </Typography>
                                <Typography fontSize={11} sx={{ color: col.text, opacity: 0.75 }}>
                                  {s.elderlyName ?? `Người cao tuổi #${s.elderlyId}`}
                                </Typography>
                              </Box>
                            </Box>
                            {(s.startTime || s.endTime) && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime sx={{ fontSize: 12, color: col.dot }} />
                                <Typography fontSize={11} fontWeight={600} sx={{ color: col.text }}>
                                  {s.startTime ?? '?'} – {s.endTime ?? '?'}
                                </Typography>
                              </Box>
                            )}
                            {s.notes && (
                              <Typography fontSize={11} sx={{ color: col.text, opacity: 0.7, mt: 0.5 }} noWrap>{s.notes}</Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
