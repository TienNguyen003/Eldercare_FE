import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, Divider } from '@mui/material';
import { Close } from '@mui/icons-material';
import { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  formId: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export default function FormDialog({ open, onClose, title, formId, submitLabel = 'Lưu', isSubmitting, children, maxWidth = 'sm' }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth
      PaperProps={{ sx: { borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' } }}>
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2.5 }}>
          <Typography fontWeight={700} fontSize={17}>{title}</Typography>
          <IconButton size="small" onClick={onClose} sx={{ bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2 }}>
        {children}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: '10px', color: '#64748B', fontWeight: 600 }}>Hủy</Button>
        <Button
          variant="contained" type="submit" form={formId} disabled={isSubmitting}
          sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', fontWeight: 700, px: 3, '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #6D28D9)' } }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
