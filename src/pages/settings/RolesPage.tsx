import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Tooltip, Chip, Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useGetRolesQuery } from '../../store/api/apiSlice';
import PageHeader from '../../components/common/PageHeader';

export default function RolesPage() {
  const { data, isLoading } = useGetRolesQuery();
  const roles = data?.data?.content ?? [];

  return (
    <PageHeader title="Phân quyền">
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên vai trò</TableCell>
                <TableCell>Mô tả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>
                : roles.map((r) => (
                  <TableRow key={r.id} hover>
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
