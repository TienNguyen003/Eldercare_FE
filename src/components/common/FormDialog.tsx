import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, Divider, CircularProgress, alpha } from '@mui/material';
import { Close } from '@mui/icons-material';
import type { ReactNode } from 'react';

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
      PaperProps={{ sx: { borderRadius: '22px', boxShadow: '0 25px 60px rgba(0,0,0,0.16)', overflow: 'hidden', backgroundImage: 'none', border: '1px solid #EDF1F5' } }}>
      <DialogTitle sx={{ p: 0, borderBottom: '1px solid #E8EEF3' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2.4, bgcolor: '#F8FAFC' }}>
          <Typography fontWeight={800} fontSize={17}>{title}</Typography>
          <IconButton size="small" onClick={onClose} sx={{ bgcolor: '#F1F5F9', color: '#64748B', '&:hover': { bgcolor: alpha('#EF4444', 0.1), color: '#DC2626' } }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: '22px !important', pb: 2.5 }}>
        {children}
      </DialogContent>
      <Divider sx={{ borderColor: '#E8EEF3' }} />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ borderRadius: '11px', color: '#64748B', fontWeight: 600, px: 3 }}>Hủy</Button>
        <Button
          variant="contained" type="submit" form={formId} disabled={isSubmitting}
          sx={{ borderRadius: '11px', background: 'linear-gradient(135deg, #0D9488, #10B981)', fontWeight: 700, px: 3.5, boxShadow: '0 6px 18px rgba(13,148,136,0.3)', '&:hover': { background: 'linear-gradient(135deg, #0B7A70, #059669)', boxShadow: '0 8px 22px rgba(13,148,136,0.38)' } }}
        >
          {isSubmitting ? <><CircularProgress size={17} color="inherit" sx={{ mr: 0.7 }} />Lưu...</> : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
