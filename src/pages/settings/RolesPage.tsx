import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Chip
} from '@mui/material';
import { useGetRolesQuery } from '../../store/api/apiSlice';
import PageHeader from '../../components/common/PageHeader';

export default function RolesPage() {
  const { data, isLoading } = useGetRolesQuery();
  const roles = data?.data?.content ?? [];

  return (
    <PageHeader title="Phân quyền">
      <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên vai trò</TableCell>
                <TableCell>Mô tả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={3} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
                : roles.map((r) => (
                  <TableRow key={r.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell><Chip label={r.name} color="primary" size="small" /></TableCell>
                    <TableCell>{r.description || '-'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </PageHeader>
  );
}
