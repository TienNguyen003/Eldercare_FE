import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, MenuItem, Alert, CircularProgress, Box, Typography, IconButton, Divider, alpha,
} from '@mui/material';
import { Close, EventAvailable, CheckCircle } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useCreateServiceBookingMutation, useGetServicePackagesQuery } from '../../store/api/apiSlice';

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedPackageId?: number;
}

export default function BookingDialog({ open, onClose, preselectedPackageId }: Props) {
  const [create, { isLoading }] = useCreateServiceBookingMutation();
  const { data: pkgData } = useGetServicePackagesQuery({ page: 0, size: 50 });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register, handleSubmit, control, reset, setValue } = useForm();

  const packages = pkgData?.data?.content ?? [];

  useEffect(() => {
    if (open) {
      reset();
      setSuccess(false);
      setErrorMsg('');
      if (preselectedPackageId) setValue('servicePackageId', String(preselectedPackageId));
    }
  }, [open, preselectedPackageId, reset, setValue]);

  const onSubmit = async (values: any) => {
    setErrorMsg('');
    try {
      await create({
        ...values,
        servicePackageId: values.servicePackageId ? Number(values.servicePackageId) : undefined,
      }).unwrap();
      setSuccess(true);
      reset();
    } catch (e: any) {
      setErrorMsg(e?.data?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: '22px', overflow: 'hidden', border: '1px solid #EDF1F5', boxShadow: '0 30px 70px rgba(15,23,42,0.22)', backgroundImage: 'none' } }}>
      <DialogTitle sx={{ p: 0, borderBottom: '1px solid #E8EEF3' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2.4, bgcolor: '#F8FAFC' }}>
          <Box sx={{ width: 38, height: 38, borderRadius: '12px', background: 'linear-gradient(135deg,#0D9488,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(13,148,136,0.32)', flexShrink: 0 }}>
            <EventAvailable sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={800} fontSize={16.5} lineHeight={1.25}>Đăng ký dịch vụ chăm sóc</Typography>
            <Typography fontSize={12.5} color="text.secondary">Chúng tôi sẽ liên hệ lại trong vòng 24 giờ</Typography>
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
            <Typography fontWeight={800} fontSize={17} mb={0.8}>Gửi yêu cầu thành công!</Typography>
            <Typography color="text.secondary" fontSize={14} lineHeight={1.8}>
              Yêu cầu của bạn đã được ghi nhận. Nhân viên tư vấn của ElderCare sẽ liên hệ lại trong thời gian sớm nhất.
            </Typography>
          </Box>
        ) : (
          <form id="booking-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {errorMsg && <Grid item xs={12}><Alert severity="error">{errorMsg}</Alert></Grid>}
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Họ và tên *" {...register('fullName', { required: true })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Số điện thoại *" {...register('phone', { required: true })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" {...register('email')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Địa chỉ cần chăm sóc" {...register('address')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="servicePackageId" control={control} render={({ field }) => (
                  <TextField select fullWidth label="Gói dịch vụ" {...field}>
                    <MenuItem value="">— Chưa chọn —</MenuItem>
                    {packages.filter((p) => p.isActive).map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Ngày mong muốn" type="date" InputLabelProps={{ shrink: true }} {...register('preferredDate')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Nhu cầu / ghi chú" multiline rows={3} {...register('notes')}
                  placeholder="VD: cần chăm sóc ban ngày cho mẹ 75 tuổi, bị cao huyết áp..." />
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>
      <Divider sx={{ borderColor: '#E8EEF3' }} />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '11px', borderColor: '#E2E8F0', color: '#64748B', fontWeight: 600, px: 3 }}>{success ? 'Đóng' : 'Hủy'}</Button>
        {!success && (
          <Button variant="contained" type="submit" form="booking-form" disabled={isLoading}
            sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', borderRadius: '11px', fontWeight: 700, px: 3.5, boxShadow: '0 6px 18px rgba(13,148,136,0.3)', '&:hover': { background: 'linear-gradient(135deg,#0B7A70,#059669)' } }}>
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Gửi yêu cầu'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
