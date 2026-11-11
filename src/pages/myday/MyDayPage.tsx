import { useState } from 'react';
import {
  Box, Card, CardContent, Grid, Typography, Chip, Avatar, IconButton,
  Tooltip, CircularProgress, Divider, Button, alpha,
} from '@mui/material';
import {
  AccessTime, CheckCircle, DoneAll, Today, ArrowForward, Login as LoginIcon, Logout as LogoutIcon,
} from '@mui/icons-material';
import { format, isSameDay } from 'date-fns';
import { useAppSelector } from '../../hooks/redux';
import {
  useGetCaregiverByUserIdQuery, useGetCareSchedulesByCaregiverQuery,
  useGetCareSchedulesQuery, useGetCareTasksQuery, useUpdateCareTaskMutation,
  useCheckInScheduleMutation, useCheckOutScheduleMutation,
  useGetMedicationSchedulesByElderlyQuery, useMarkMedicationTakenMutation, useMarkMedicationMissedMutation,
} from '../../store/api/apiSlice';
import type { CareSchedule, CareTask, MedicationSchedule } from '../../types';
import StatusChip from '../../components/common/StatusChip';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { scheduleTypeLabel } from '../../utils/labels';

const TASK_LABELS: Record<string, string> = {
  FEEDING: 'Cho ăn',
  BATHING: 'Tắm rửa',
  MEDICATION: 'Uống thuốc',
  CHECK_BP: 'Đo huyết áp',
  EXERCISE: 'Tập luyện',
  CLEANING: 'Vệ sinh',
  COMPANIONSHIP: 'Trò chuyện',
};

export default function MyDayPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [filter, setFilter] = useState('ALL');
  const [updateTask] = useUpdateCareTaskMutation();
  const [checkIn] = useCheckInScheduleMutation();
  const [checkOut] = useCheckOutScheduleMutation();
  const [markTaken] = useMarkMedicationTakenMutation();
  const [markMissed] = useMarkMedicationMissedMutation();

  const { data: caregiverData } = useGetCaregiverByUserIdQuery(user?.id ?? 0, { skip: !user?.id });
  const caregiver = caregiverData?.data;
  const hasOwn = Boolean(caregiver?.id);

  const { data: ownData, isLoading: l1 } = useGetCareSchedulesByCaregiverQuery(caregiver?.id ?? 0, { skip: !hasOwn });
  const { data: allData, isLoading: l2 } = useGetCareSchedulesQuery({ page: 0, size: 300 }, { skip: hasOwn });
  const { data: tasksData } = useGetCareTasksQuery({ page: 0, size: 1000 });

  const schedulesRaw = hasOwn ? (ownData?.data ?? []) : (allData?.data?.content ?? []);
  const isLoadingSchedules = hasOwn ? l1 : l2;
  const today = new Date();

  const schedules = schedulesRaw
    .filter((s) => s.scheduledDate && isSameDay(new Date(s.scheduledDate), today))
    .sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''));

  const tasksBySchedule: Record<number, CareTask[]> = {};
  (tasksData?.data?.content ?? []).forEach((t) => {
    (tasksBySchedule[t.scheduleId] ??= []).push(t);
  });

  const elderlyIds = [...new Set(schedules.map((s) => s.elderlyId))];
  const { data: medsData } = useGetMedicationSchedulesByElderlyQuery(elderlyIds[0] ?? 0, { skip: elderlyIds.length === 0 });
  const medsToday: MedicationSchedule[] = (medsData?.data ?? []).filter((m) => {
    if (!m.date) return true;
    try { return isSameDay(new Date(m.date), today); } catch { return true; }
  });
  const medsByElderly: Record<number, MedicationSchedule[]> = {};
  medsToday.forEach((m) => { (medsByElderly[m.elderlyId] ??= []).push(m); });

  const setStatus = async (task: CareTask, status: string) => {
    await updateTask({
      id: task.id,
      body: {
        scheduleId: task.scheduleId,
        taskType: task.taskType,
        description: task.description,
        status,
        completedAt: status === 'DONE' ? new Date().toISOString() : undefined,
      },
    });
  };

  const filteredSchedules = filter === 'ALL'
    ? schedules
    : schedules.filter((s) => (tasksBySchedule[s.id] ?? []).some((t) => t.status === filter));

  const totalTasks = Object.values(tasksBySchedule).flat().length;
  const doneTasks = Object.values(tasksBySchedule).flat().filter((t) => t.status === 'DONE').length;

  return (
    <PageHeader
      title="Ngày làm việc của tôi"
      subtitle={`${format(today, 'EEEE, dd/MM/yyyy')} — ${caregiver?.fullName ?? user?.username}`}
      badge={schedules.length > 0 ? `${schedules.length} ca hôm nay` : undefined}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {['ALL', 'DONE', 'PENDING'].map((f) => (
          <Chip
            key={f}
            label={f === 'ALL' ? 'Tất cả' : f === 'DONE' ? 'Hoàn thành' : 'Chờ thực hiện'}
            onClick={() => setFilter(f)}
            sx={{
              bgcolor: filter === f ? 'rgba(13,148,136,0.12)' : '#F1F5F9',
              color: filter === f ? '#0D9488' : '#475569',
              fontWeight: 600, height: 28, borderRadius: '9px',
            }}
          />
        ))}
        <Box sx={{ flex: 1 }} />
        <Typography fontSize={13} color="text.secondary">{doneTasks}/{Math.max(totalTasks, 0)} công việc hoàn thành</Typography>
      </Box>

      {isLoadingSchedules ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={30} sx={{ color: '#0D9488' }} />
        </Box>
      ) : filteredSchedules.length === 0 ? (
        <EmptyState
          icon={<Today />}
          title="Không có ca hôm nay"
          description="Chưa có ca chăm sóc nào được phân công cho hôm nay"
          minHeight={260}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredSchedules.map((s) => (
            <ScheduleCard
              key={s.id} schedule={s}
              tasks={tasksBySchedule[s.id] ?? []}
              meds={medsByElderly[s.elderlyId] ?? []}
              onSetStatus={setStatus}
              onCheckIn={() => checkIn(s.id)}
              onCheckOut={() => checkOut(s.id)}
              onMedTaken={(id) => markTaken(id)}
              onMedMissed={(id) => markMissed(id)}
            />
          ))}
        </Grid>
      )}
    </PageHeader>
  );
}

const COLORS = ['#0D9488', '#10B981', '#059669', '#D97706', '#0EA5E9'];

function ScheduleCard({ schedule, tasks, meds, onSetStatus, onCheckIn, onCheckOut, onMedTaken, onMedMissed }: {
  schedule: CareSchedule;
  tasks: CareTask[];
  meds: MedicationSchedule[];
  onSetStatus: (t: CareTask, s: string) => void;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onMedTaken: (id: number) => void;
  onMedMissed: (id: number) => void;
}) {
  const done = tasks.filter((t) => t.status === 'DONE').length;
  const color = COLORS[(schedule.caregiverId ?? 0) % COLORS.length];
  const name = schedule.elderlyName ?? `Người cao tuổi #${schedule.elderlyId}`;
  const checkedIn = Boolean(schedule.checkInTime) || schedule.status === 'IN_PROGRESS';
  const checkedOut = Boolean(schedule.checkOutTime) || schedule.status === 'DONE';

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: `${color}22`, fontSize: 14, fontWeight: 700 }}>
              {name[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={700} fontSize={14.5} noWrap>{name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 12.5, color: '#94A3B8' }} />
                <Typography fontSize={12} color="text.secondary">{schedule.startTime ?? '—'} – {schedule.endTime ?? '—'}</Typography>
              </Box>
            </Box>
            <StatusChip status={schedule.status} />
          </Box>

          {schedule.type && (
            <Box sx={{ mt: 1.2, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              <Chip size="small" label={scheduleTypeLabel(schedule.type)} sx={{ bgcolor: `${color}15`, color, fontWeight: 600, fontSize: 11, borderRadius: '8px', height: 22 }} />
            </Box>
          )}

          {/* Progress */}
          <Box sx={{ mt: 1.8, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1, height: 8, borderRadius: '5px', bgcolor: alpha('#E8EEF3', 0.7) }}>
              <Box sx={{ width: tasks.length ? `${(done / tasks.length) * 100}%` : '0%', height: 8, borderRadius: '5px', background: done === tasks.length && tasks.length ? '#10B981' : '#0D9488' }} />
            </Box>
            <Typography fontSize={11.5} fontWeight={700}>{done}/{tasks.length}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Tasks */}
          {tasks.length === 0 ? (
            <Typography fontSize={12.5} color="text.disabled" sx={{ textAlign: 'center', py: 1.5 }}>
              Chưa có công việc chi tiết
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1 }}>
              {tasks.map((t) => (
                <Box key={t.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: '10px', bgcolor: t.status === 'DONE' ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: t.status === 'DONE' ? '#10B981' : '#F59E0B', flexShrink: 0 }} />
                  <Typography fontSize={13} sx={{ flex: 1, fontWeight: 500, textDecoration: t.status === 'DONE' ? 'line-through' : 'none', color: t.status === 'DONE' ? '#94A3B8' : '#334155' }}>
                    {TASK_LABELS[t.taskType] ?? t.taskType}
                  </Typography>
                  {t.status === 'DONE' ? (
                    <CheckCircle sx={{ color: '#10B981', fontSize: 17 }} />
                  ) : (
                    <Box sx={{ display: 'flex', gap: 0.4 }}>
                      <Tooltip title="Hoàn thành">
                        <IconButton size="small" onClick={() => onSetStatus(t, 'DONE')} sx={{ width: 26, height: 26, bgcolor: '#ECFDF5', color: '#059669' }}>
                          <DoneAll sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Bỏ qua">
                        <IconButton size="small" onClick={() => onSetStatus(t, 'SKIPPED')} sx={{ width: 26, height: 26, bgcolor: '#FFFBEB', color: '#D97706' }}>
                          <ArrowForward sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Thuoc trong ca */}
          {meds.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography fontSize={12} fontWeight={700} color="#475569" sx={{ mb: 0.5 }}>
                Thuốc trong ca ({meds.filter((m) => m.status === 'TAKEN').length}/{meds.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {meds.map((m) => (
                  <Box key={m.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.8, borderRadius: '10px', bgcolor: m.status === 'TAKEN' ? 'rgba(16,185,129,0.08)' : 'rgba(14,165,233,0.06)' }}>
                    <Typography fontSize={12.5} sx={{ flex: 1, fontWeight: 500, color: m.status === 'TAKEN' ? '#94A3B8' : '#334155', textDecoration: m.status === 'TAKEN' ? 'line-through' : 'none' }}>
                      {m.medicationName ?? `#${m.medicationId}`} — {m.dosage} {m.timeToTake ? `· ${m.timeToTake}` : ''}
                    </Typography>
                    {m.status !== 'TAKEN' && m.status !== 'MISSED' ? (
                      <Box sx={{ display: 'flex', gap: 0.4 }}>
                        <Tooltip title="Đã uống">
                          <IconButton size="small" onClick={() => onMedTaken(m.id)} sx={{ width: 26, height: 26, bgcolor: '#ECFDF5', color: '#059669' }}>
                            <DoneAll sx={{ fontSize: 13 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Bỏ lỡ">
                          <IconButton size="small" onClick={() => onMedMissed(m.id)} sx={{ width: 26, height: 26, bgcolor: '#FEF2F2', color: '#DC2626' }}>
                            <ArrowForward sx={{ fontSize: 13 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <StatusChip status={m.status} />
                    )}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Check-in / Check-out */}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, pt: 0.5 }}>
            {!checkedIn && !checkedOut && (
              <Button fullWidth size="small" variant="contained" startIcon={<LoginIcon />}
                onClick={onCheckIn}
                sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', borderRadius: '10px', fontWeight: 700 }}>
                Bắt đầu ca
              </Button>
            )}
            {checkedIn && !checkedOut && (
              <Button fullWidth size="small" variant="outlined" startIcon={<LogoutIcon />} color="error"
                onClick={onCheckOut} sx={{ borderRadius: '10px', fontWeight: 700 }}>
                Kết thúc ca
              </Button>
            )}
            {checkedOut && (
              <Typography fontSize={12.5} fontWeight={700} color="#059669" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 'auto' }}>
                <CheckCircle sx={{ fontSize: 16 }} /> Ca đã hoàn thành
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}