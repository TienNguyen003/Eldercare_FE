import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, CircularProgress, Chip, Typography, Box
} from '@mui/material';
import { format } from 'date-fns';
import { useGetAuditLogsQuery } from '../../store/api/apiSlice';
import PageHeader from '../../components/common/PageHeader';

export default function AuditLogsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetAuditLogsQuery({ page, size: 20 });
  const logs = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;

  const actionColor = (a: string): 'success' | 'error' | 'warning' | 'info' => {
    if (a?.includes('CREATE')) return 'success';
    if (a?.includes('DELETE')) return 'error';
    if (a?.includes('UPDATE')) return 'warning';
    return 'info';
  };

  return (
    <PageHeader title="Audit Logs">
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thời gian</TableCell>
                <TableCell>Người thực hiện</TableCell>
                <TableCell>Hành động</TableCell>
                <TableCell>Loại đối tượng</TableCell>
                <TableCell>ID đối tượng</TableCell>
                <TableCell>Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={6} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
                : logs.map((l) => (
                  <TableRow key={l.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                    <TableCell>{l.createdAt ? format(new Date(l.createdAt), 'dd/MM/yyyy HH:mm:ss') : '-'}</TableCell>
                    <TableCell><Typography variant="body2" fontWeight={500}>{l.actor}</Typography></TableCell>
                    <TableCell><Chip label={l.action} color={actionColor(l.action)} size="small" /></TableCell>
                    <TableCell>{l.entityType}</TableCell>
                    <TableCell>{l.entityId}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="caption" color="text.secondary">{l.details?.substring(0, 80)}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={total} page={page} rowsPerPage={20} rowsPerPageOptions={[20]}
          onPageChange={(_, p) => setPage(p)} labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`} sx={{ borderTop: '1px solid #E8EEF3', bgcolor: '#FAFBFD', '& .MuiTablePagination-toolbar': { px: 2, minHeight: 52 }, '& .MuiTablePagination-displayedRows': { fontSize: 13, fontWeight: 600 } }} />
      </Card>
    </PageHeader>
  );
}
