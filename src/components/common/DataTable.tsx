import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, TextField, InputAdornment, Typography,
  CircularProgress, Button,
} from '@mui/material';
import { Search, InboxOutlined } from '@mui/icons-material';
import { ReactNode } from 'react';

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
  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'none', overflow: 'hidden' }}>
      {/* Toolbar */}
      {(onSearchChange || extraToolbar) && (
        <Box sx={{ px: 3, py: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          {onSearchChange && (
            <TextField
              size="small" placeholder={searchPlaceholder} value={search} onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#94A3B8' }} /></InputAdornment> }}
              sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#F8FAFC', '& fieldset': { borderColor: '#E2E8F0' } } }}
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
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <InboxOutlined sx={{ fontSize: 48, color: '#CBD5E1', mb: 1, display: 'block', mx: 'auto' }} />
                  <Typography color="text.secondary" fontSize={14}>Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={row.id ?? i} hover sx={{ '&:hover': { bgcolor: '#F8FAFC' }, '& td': { borderBottom: '1px solid #F1F5F9' } }}>
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align} sx={{ py: 1.5, fontSize: 13.5 }}>
                    {renderCell(row, col.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ px: 2, borderTop: '1px solid #F1F5F9' }}>
        <TablePagination
          component="div" count={total} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[rowsPerPage]}
          onPageChange={(_, p) => onPageChange(p)}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count} bản ghi`}
          sx={{ '& .MuiTablePagination-toolbar': { fontSize: 13 }, '& .MuiTablePagination-displayedRows': { fontSize: 13 } }}
        />
      </Box>
    </Card>
  );
}
