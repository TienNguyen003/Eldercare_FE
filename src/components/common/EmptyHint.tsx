import { Box, Typography, TableRow, TableCell, alpha } from '@mui/material';
import { PersonSearchOutlined } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  colSpan: number;
}

/**
 * Trạng thái trống dùng bên trong <TableBody> (ví dụ: chưa chọn người cao tuổi,
 * chưa có bản ghi). Giữ phong cách đồng nhất với DataTable.
 */
export default function EmptyHint({ title, description, icon, colSpan }: Props) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ textAlign: 'center', py: 7, borderBottom: '1px solid #EDF1F5' }}>
        <Box
          sx={{
            width: 76, height: 76, borderRadius: '50%', mx: 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: alpha('#0D9488', 0.08),
            border: `1px dashed ${alpha('#0D9488', 0.3)}`,
          }}
        >
          {icon ?? <PersonSearchOutlined sx={{ fontSize: 34, color: '#0D9488' }} />}
        </Box>
        <Typography fontWeight={700} fontSize={14.5} mt={1.8} color="#334155">{title}</Typography>
        {description && (
          <Typography fontSize={12.8} color="text.secondary" mt={0.5}>{description}</Typography>
        )}
      </TableCell>
    </TableRow>
  );
}