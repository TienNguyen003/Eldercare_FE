import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, MenuItem, Alert, CircularProgress, Rating, Typography, Box,
  IconButton, Divider, alpha,
} from '@mui/material';
import { Close, StarRate, CheckCircle } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useCreateFeedbackMutation, useGetCaregiversQuery } from '../../store/api/apiSlice';
import { useAppSelector } from '../../hooks/redux';

interface Props {
  open: boolean;
  onClose: () => void;
}

// Dialog gửi đánh giá chất lượng dịch vụ (public - không cần đăng nhập)
export default function FeedbackDialog({ open, onClose }: Props) {
  const [create, { isLoading }] = useCreateFeedbackMutation();
  const { data: cgData } = useGetCaregiversQuery({ page: 0, size: 50 });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const user = useAppSelector((s) => s.auth.user);
  const { register, handleSubmit, control, reset, setValue } = useForm();

  const caregivers = cgData?.data?.content ?? [];

  useEffect(() => {
    if (open) {
      reset({ rating: 5, authorName: user?.username ?? '' });
      setSuccess(false);
      setErrorMsg('');
    }
  }, [open, reset, user, setValue]);

  const onSubmit = async (values: any) => {
    setErrorMsg('');
    try {
      await create({ ...values, caregiverId: Number(values.caregiverId) }).unwrap();
      setSuccess(true);
    } catch (e: any) {
      setErrorMsg(e?.data?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.');
    }
  };

  const handleClose = () => { setSuccess(false); setErrorMsg(''); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: '22px', overflow: 'hidden', border: '1px solid #EDF1F5', boxShadow: '0 30px 70px rgba(15,23,42,0.22)', backgroundImage: 'none' } }}>
      <DialogTitle sx={{ p: 0, borderBottom: '1px solid #E8EEF3' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2.4, bgcolor: '#F8FAFC' }}>
          <Box sx={{ width: 38, height: 38, borderRadius: '12px', background: 'linear-gradient(135deg,#F59E0B,#FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(245,158,11,0.32)', flexShrink: 0 }}>
            <StarRate sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={800} fontSize={16.5} lineHeight={1.25}>Đánh giá chất lượng dịch vụ</Typography>
            <Typography fontSize={12.5} color="text.secondary">Ý kiến của bạn giúp chúng tôi phục vụ tốt hơn</Typography>
          </Box>
          <IconButton size="small" onClick={handleClose} sx={{ bgcolor: '#F1F5F9', color: '#64748B', '&:hover': { bgcolor: alpha('#EF4444', 0.1), color: '#DC2626' } }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: '22px !important', pb: 2.5 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ width: 68, height: 68, borderRadius: '50%', bgcolor: alpha('#10B981', 0.1), border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.2 }}>
              <CheckCircle sx={{ color: '#059669', fontSize: 34 }} />
            </Box>
            <Typography fontWeight={800} fontSize={17} mb={0.8}>Cảm ơn bạn đã đánh giá!</Typography>
            <Typography color="text.secondary" fontSize={14} lineHeight={1.8}>
              Đánh giá của bạn đã được ghi nhận và sẽ giúp ElderCare nâng cao chất lượng chăm sóc.
            </Typography>
          </Box>
        ) : (
          <form id="feedback-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {errorMsg && <Grid item xs={12}><Alert severity="error">{errorMsg}</Alert></Grid>}
              <Grid item xs={12} sm={6}>
                <Controller name="caregiverId" control={control} rules={{ required: true }} render={({ field }) => (
                  <TextField select fullWidth label="Nhân viên chăm sóc *" {...field}>
                    {caregivers.map((c) => <MenuItem key={c.id} value={c.id}>{c.fullName}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Tên của bạn *" {...register('authorName', { required: true })} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography fontSize={14} fontWeight={600}>Mức độ hài lòng *</Typography>
                  <Controller name="rating" control={control} render={({ field }) => (
                    <Rating value={Number(field.value) || 0} onChange={(_, v) => field.onChange(v ?? 5)} size="large" sx={{ color: '#F59E0B' }} />
                  )} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Nhận xét" multiline rows={3} {...register('comment')}
                  placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ chăm sóc..." />
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>
      <Divider sx={{ borderColor: '#E8EEF3' }} />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '11px', borderColor: '#E2E8F0', color: '#64748B', fontWeight: 600, px: 3 }}>{success ? 'Đóng' : 'Hủy'}</Button>
        {!success && (
          <Button variant="contained" type="submit" form="feedback-form" disabled={isLoading}
            sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', borderRadius: '11px', fontWeight: 700, px: 3.5, boxShadow: '0 6px 18px rgba(13,148,136,0.3)', '&:hover': { background: 'linear-gradient(135deg,#0B7A70,#059669)' } }}>
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Gửi đánh giá'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
