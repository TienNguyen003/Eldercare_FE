import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, TextField, InputAdornment, Typography,
  IconButton, Tooltip, alpha,
} from '@mui/material';
import { Search, InboxOutlined, Close } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface Column { key: string; label: string; align?: 'left' | 'center' | 'right'; width?: number }

interface Props {
  columns: Column[];
  rows: any[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  isLoading?: boolean;
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  renderCell: (row: any, key: string) => ReactNode;
  extraToolbar?: ReactNode;
  rowsPerPage?: number;
}

export default function DataTable({
  columns, rows, total, page, onPageChange, isLoading,
  search, onSearchChange, searchPlaceholder = 'Tìm kiếm...',
  renderCell, extraToolbar, rowsPerPage = 10,
}: Props) {
  const showToolbar = Boolean(onSearchChange || extraToolbar);

  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
      {/* Toolbar */}
      {showToolbar && (
        <Box sx={{ px: 3, py: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid #E8EEF3', flexWrap: 'wrap' }}>
          {onSearchChange && (
            <TextField
              size="small" placeholder={searchPlaceholder} value={search} onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: alpha('#0F172A', 0.45) }} /></InputAdornment>,
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <Tooltip title="Xóa tìm kiếm">
                      <IconButton size="small" onClick={() => onSearchChange('')} sx={{ width: 26, height: 26, color: '#94A3B8', '&:hover': { color: '#0D9488', bgcolor: 'rgba(13,148,136,0.08)' } }}>
                        <Close sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : undefined,
              }}
              sx={{
                width: 280,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', bgcolor: '#F8FAFC', transition: 'all 0.2s',
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                  '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 0 0 3px rgba(13,148,136,0.12)' },
                },
              }}
            />
          )}
          <Box sx={{ flex: 1 }} />
          {extraToolbar}
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align}
                  width={col.width}
                  sx={{ fontWeight: 700, color: '#475569', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #E2E8F0', py: 1.5 }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i} sx={{ '& td': { borderBottom: '1px solid #F1F5F9' } }}>
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align} sx={{ py: 2.2 }}>
                      <Box className="skeleton" sx={{ height: 13, width: col.width && col.width < 130 ? '60%' : '78%', borderRadius: '6px' }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Box sx={{ width: 88, height: 88, borderRadius: '50%', bgcolor: alpha('#94A3B8', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
                    <InboxOutlined sx={{ fontSize: 42, color: '#94A3B8' }} />
                  </Box>
                  <Typography fontWeight={700} fontSize={15} mt={1.8}>Không có dữ liệu</Typography>
                  <Typography color="text.secondary" fontSize={13} mt={0.6}>Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc khác</Typography>
                </TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow
                key={row.id ?? i}
                sx={{
                  transition: 'background-color 0.15s ease',
                  '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 },
                  '&:hover td': { bgcolor: alpha('#0D9488', 0.045) },
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align}>
                    {renderCell(row, col.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ px: 2, borderTop: '1px solid #E8EEF3', bgcolor: '#FAFBFD' }}>
        <TablePagination
          component="div" count={total} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[rowsPerPage]}
          onPageChange={(_, p) => onPageChange(p)}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count} bản ghi`}
          sx={{ '& .MuiTablePagination-toolbar': { fontSize: 13 }, '& .MuiTablePagination-displayedRows': { fontSize: 13, fontWeight: 600 } }}
        />
      </Box>
    </Card>
  );
}
