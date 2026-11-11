import { Box, Typography, Button, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: { label: string; onClick: () => void; icon?: ReactNode };
  children: ReactNode;
}

export default function PageHeader({ title, subtitle, badge, action, children }: Props) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1.8 }}>
          <Box sx={{ width: 4, borderRadius: '4px', background: 'linear-gradient(180deg, #0D9488, #10B981)', flexShrink: 0 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h5" fontWeight={800} color="#0F172A" sx={{ lineHeight: 1.3 }}>{title}</Typography>
              {badge && (
                <Chip
                  label={badge}
                  size="small"
                  sx={{ bgcolor: 'rgba(13,148,136,0.1)', color: '#0D9488', fontWeight: 700, height: 24, fontSize: 11.5 }}
                />
              )}
            </Box>
            {subtitle && <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>}
          </Box>
        </Box>
        {action && (
          <Button
            variant="contained"
            startIcon={action.icon ?? <Add />}
            onClick={action.onClick}
            sx={{
              background: 'linear-gradient(135deg, #0D9488, #10B981)',
              borderRadius: '12px', fontWeight: 700, px: 3, py: 1.2,
              boxShadow: '0 4px 15px rgba(13,148,136,0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #0B7A70, #059669)', boxShadow: '0 6px 20px rgba(13,148,136,0.4)', transform: 'translateY(-1px)' },
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
