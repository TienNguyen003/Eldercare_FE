import { Dialog, DialogContent, DialogActions, Button, Box, Typography, CircularProgress, alpha } from '@mui/material';
import { WarningAmberRounded } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  isDeleting?: boolean;
}

export default function ConfirmDialog({ open, onClose, onConfirm, message = 'Bạn có chắc muốn xóa mục này không? Hành động này không thể hoàn tác.', isDeleting }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: '22px', boxShadow: '0 25px 60px rgba(0,0,0,0.18)', overflow: 'hidden', backgroundImage: 'none' } }}>
      <DialogContent sx={{ textAlign: 'center', pt: '34px !important', pb: 2, px: 3 }}>
        <Box sx={{ width: 66, height: 66, borderRadius: '50%', bgcolor: alpha('#EF4444', 0.1), border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
          <WarningAmberRounded sx={{ color: '#DC2626', fontSize: 32 }} />
        </Box>
        <Typography fontWeight={800} fontSize={18} mb={1}>Xác nhận xóa</Typography>
        <Typography color="text.secondary" fontSize={14} lineHeight={1.7}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
        <Button onClick={onClose} variant="outlined" disabled={isDeleting} sx={{ borderRadius: '11px', borderColor: '#E2E8F0', color: '#64748B', fontWeight: 600, px: 3 }}>Hủy</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={isDeleting} autoFocus sx={{ borderRadius: '11px', fontWeight: 700, px: 3, background: 'linear-gradient(135deg,#EF4444,#F87171)', boxShadow: '0 6px 18px rgba(239,68,68,0.3)' }}>
          {isDeleting ? <><CircularProgress size={17} color="inherit" sx={{ mr: 0.7 }} />Xóa...</> : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
