import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void; icon?: ReactNode };
  children: ReactNode;
}

export default function PageHeader({ title, subtitle, action, children }: Props) {
  return (
    <Box>
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3,
        pb: 3, borderBottom: '1px solid #F1F5F9',
      }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A">{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>}
        </Box>
        {action && (
          <Button
            variant="contained"
            startIcon={action.icon ?? <Add />}
            onClick={action.onClick}
            sx={{
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              borderRadius: '12px', fontWeight: 700, px: 3, py: 1.2,
              boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #6D28D9)', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' },
            }}
          >
            {action.label}
          </Button>
        )}
      </Box>
      {children}
    </Box>
  );
}
