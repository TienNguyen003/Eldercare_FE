import { Box, Typography, alpha } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Chiều cao tối thiểu của khối, mặc định 220px */
  minHeight?: number;
}

/**
 * Trạng thái trống dùng cho các khối ngoài bảng (danh sách thẻ, biểu đồ, panel).
 * Đồng bộ phong cách với EmptyHint và DataTable.
 */
export default function EmptyState({ icon, title, description, action, minHeight = 220 }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 5, minHeight }}>
      <Box
        sx={{
          width: 78, height: 78, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: alpha('#0D9488', 0.08),
          border: `1px dashed ${alpha('#0D9488', 0.3)}`,
          color: '#0D9488',
          '& svg': { fontSize: 34 },
        }}
      >
        {icon}
      </Box>
      <Typography fontWeight={700} fontSize={15} color="#334155" mt={2}>{title}</Typography>
      {description && (
        <Typography fontSize={13} color="text.secondary" mt={0.8} maxWidth={420}>{description}</Typography>
      )}
      {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
    </Box>
  );
}