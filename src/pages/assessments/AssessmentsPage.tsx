import { useState } from 'react';
import {
  Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, TextField, MenuItem, Grid, LinearProgress, Box, Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import {
  useGetElderliesQuery, useGetFunctionalAssessmentsQuery, useCreateFunctionalAssessmentMutation,
  useGetMentalHealthAssessmentsQuery, useCreateMentalHealthAssessmentMutation
} from '../../store/api/apiSlice';
import PageHeader from '../../components/common/PageHeader';
import FormDialog from '../../components/common/FormDialog';
import EmptyHint from '../../components/common/EmptyHint';

const ScoreBar = ({ score, max = 100 }: { score?: number; max?: number }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <LinearProgress variant="determinate" value={((score ?? 0) / max) * 100} sx={{ flex: 1, height: 8, borderRadius: 4 }} />
    <Typography variant="caption">{score ?? 0}/{max}</Typography>
  </Box>
);

export default function AssessmentsPage() {
  const [tab, setTab] = useState<'functional' | 'mental'>('functional');
  const [selectedElderly, setSelectedElderly] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: elderliesData } = useGetElderliesQuery({ page: 0, size: 100 });
  const { data: functionalData, isLoading: fl } = useGetFunctionalAssessmentsQuery(selectedElderly, { skip: !selectedElderly || tab !== 'functional' });
  const { data: mentalData, isLoading: ml } = useGetMentalHealthAssessmentsQuery(selectedElderly, { skip: !selectedElderly || tab !== 'mental' });
  const [createFunctional] = useCreateFunctionalAssessmentMutation();
  const [createMental] = useCreateMentalHealthAssessmentMutation();

  const { register, handleSubmit, reset } = useForm();
  const elderlies = elderliesData?.data?.content ?? [];
  const functionals = functionalData?.data ?? [];
  const mentals = mentalData?.data ?? [];

  const onSubmit = async (values: any) => {
    const payload = { ...values, elderlyId: selectedElderly };
    if (tab === 'functional') await createFunctional(payload);
    else await createMental(payload);
    setDialogOpen(false);
    reset();
  };

  return (
    <PageHeader title="Đánh giá sức khỏe" action={{ label: 'Tạo đánh giá', onClick: () => setDialogOpen(true) }}>
      <Card sx={{ mb: 2.5, p: 2, borderRadius: '20px', bgcolor: '#FBFDFE', borderLeft: '4px solid #0D9488' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField select label="Chọn người cao tuổi" value={selectedElderly} onChange={(e) => setSelectedElderly(Number(e.target.value))} size="small" sx={{ minWidth: 250 }}>
            <MenuItem value={0}>— Chọn người cao tuổi —</MenuItem>
            {elderlies.map((e) => <MenuItem key={e.id} value={e.id}>{e.fullName}</MenuItem>)}
          </TextField>
          <TextField select label="Loại đánh giá" value={tab} onChange={(e) => setTab(e.target.value as any)} size="small">
            <MenuItem value="functional">Chức năng</MenuItem>
            <MenuItem value="mental">Sức khỏe tâm thần</MenuItem>
          </TextField>
        </Box>
      </Card>

      {tab === 'functional' && (
        <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày đánh giá</TableCell>
                  <TableCell>Vận động</TableCell>
                  <TableCell>Sinh hoạt hàng ngày</TableCell>
                  <TableCell>Nhận thức</TableCell>
                  <TableCell>Tổng điểm</TableCell>
                  <TableCell>Người đánh giá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!selectedElderly ? <EmptyHint colSpan={6} title="Chưa chọn người cao tuổi" description="Chọn người cao tuổi ở bộ lọc phía trên để xem đánh giá chức năng" />
                  : fl ? <TableRow><TableCell colSpan={6} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
                    : functionals.map((f) => (
                      <TableRow key={f.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                        <TableCell>{f.assessmentDate ? format(new Date(f.assessmentDate), 'dd/MM/yyyy') : '-'}</TableCell>
                        <TableCell><ScoreBar score={f.mobilityScore} /></TableCell>
                        <TableCell><ScoreBar score={f.adlScore} /></TableCell>
                        <TableCell><ScoreBar score={f.cognitiveScore} /></TableCell>
                        <TableCell><Typography fontWeight={600} color="primary">{f.totalScore}</Typography></TableCell>
                        <TableCell>{f.assessedBy || '-'}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {tab === 'mental' && (
        <Card sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày đánh giá</TableCell>
                  <TableCell>Trầm cảm</TableCell>
                  <TableCell>Lo âu</TableCell>
                  <TableCell>Nhận thức</TableCell>
                  <TableCell>Tình trạng tổng thể</TableCell>
                  <TableCell>Người đánh giá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!selectedElderly ? <EmptyHint colSpan={6} title="Chưa chọn người cao tuổi" description="Chọn người cao tuổi ở bộ lọc phía trên để xem đánh giá sức khỏe tâm thần" />
                  : ml ? <TableRow><TableCell colSpan={6} align="center" sx={{ py: 7 }}><CircularProgress size={30} sx={{ color: '#0D9488' }} /></TableCell></TableRow>
                    : mentals.map((m) => (
                      <TableRow key={m.id} sx={{ '& td': { borderBottom: '1px solid #EDF1F5', py: 1.7, fontSize: 13.5 }, '&:hover td': { bgcolor: 'rgba(13,148,136,0.045)' } }}>
                        <TableCell>{m.assessmentDate ? format(new Date(m.assessmentDate), 'dd/MM/yyyy') : '-'}</TableCell>
                        <TableCell><ScoreBar score={m.depressionScore} /></TableCell>
                        <TableCell><ScoreBar score={m.anxietyScore} /></TableCell>
                        <TableCell><ScoreBar score={m.cognitiveScore} /></TableCell>
                        <TableCell>{m.overallStatus || '-'}</TableCell>
                        <TableCell>{m.assessedBy || '-'}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        title={`Tạo đánh giá ${tab === 'functional' ? 'chức năng' : 'tâm thần'}`}
        formId="assessment-form" submitLabel="Tạo">
        <form id="assessment-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Ngày đánh giá" type="date" InputLabelProps={{ shrink: true }} {...register('assessmentDate')} /></Grid>
              {tab === 'functional' ? (
                <>
                  <Grid item xs={4}><TextField fullWidth label="Điểm vận động" type="number" {...register('mobilityScore')} /></Grid>
                  <Grid item xs={4}><TextField fullWidth label="Điểm ADL" type="number" {...register('adlScore')} /></Grid>
                  <Grid item xs={4}><TextField fullWidth label="Điểm nhận thức" type="number" {...register('cognitiveScore')} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Tổng điểm" type="number" {...register('totalScore')} /></Grid>
                </>
              ) : (
                <>
                  <Grid item xs={4}><TextField fullWidth label="Điểm trầm cảm" type="number" {...register('depressionScore')} /></Grid>
                  <Grid item xs={4}><TextField fullWidth label="Điểm lo âu" type="number" {...register('anxietyScore')} /></Grid>
                  <Grid item xs={4}><TextField fullWidth label="Điểm nhận thức" type="number" {...register('cognitiveScore')} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Tình trạng tổng thể" {...register('overallStatus')} /></Grid>
                </>
              )}
              <Grid item xs={6}><TextField fullWidth label="Người đánh giá" {...register('assessedBy')} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Ghi chú" multiline rows={2} {...register('notes')} /></Grid>
            </Grid>
          </form>
      </FormDialog>
    </PageHeader>
  );
}
