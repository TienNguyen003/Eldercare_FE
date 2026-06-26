import { Dialog, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { WarningAmberRounded } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ConfirmDialog({ open, onClose, onConfirm, message = 'Bạn có chắc muốn xóa mục này không? Hành động này không thể hoàn tác.' }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' } }}>
      <DialogContent sx={{ textAlign: 'center', pt: '32px !important', pb: 2, px: 3 }}>
        <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
          <WarningAmberRounded sx={{ color: '#DC2626', fontSize: 30 }} />
        </Box>
        <Typography fontWeight={700} fontSize={17} mb={1}>Xác nhận xóa</Typography>
        <Typography color="text.secondary" fontSize={14} lineHeight={1.7}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B', fontWeight: 600, px: 3 }}>Hủy</Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ borderRadius: '10px', fontWeight: 700, px: 3 }}>Xóa</Button>
      </DialogActions>
    </Dialog>
  );
}
