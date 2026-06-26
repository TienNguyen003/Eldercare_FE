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
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
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
              {isLoading ? <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                : logs.map((l) => (
                  <TableRow key={l.id} hover>
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
          onPageChange={(_, p) => setPage(p)} labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`} />
      </Card>
    </PageHeader>
  );
}
