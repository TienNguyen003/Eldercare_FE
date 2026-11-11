import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, InputAdornment, IconButton,
  CircularProgress, Divider, alpha,
} from '@mui/material';
import { Search, Close, People, PersonOutlined, LocalPharmacy } from '@mui/icons-material';
import { useGetElderliesQuery, useGetCaregiversQuery, useGetMedicationsQuery } from '../../store/api/apiSlice';

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const trimmed = q.trim();
  const canSearch = trimmed.length >= 2;

  const { data: elderlyData, isLoading: l1 } = useGetElderliesQuery({ page: 0, size: 5, q: trimmed }, { skip: !canSearch });
  const { data: caregiverData, isLoading: l2 } = useGetCaregiversQuery({ page: 0, size: 5, q: trimmed }, { skip: !canSearch });
  const { data: medData, isLoading: l3 } = useGetMedicationsQuery({ page: 0, size: 5, q: trimmed }, { skip: !canSearch });

  const elders = elderlyData?.data?.content ?? [];
  const staff = caregiverData?.data?.content ?? [];
  const meds = medData?.data?.content ?? [];
  const loading = canSearch && (l1 || l2 || l3);
  const anyResult = elders.length > 0 || staff.length > 0 || meds.length > 0;

  const go = (path: string) => { setOpen(false); setQ(''); navigate(path); };

  return (
    <Box sx={{ position: 'relative', flex: 1, maxWidth: 380 }}>
      <TextField
        fullWidth size="small" hiddenLabel value={q} placeholder="Tìm kiếm nhanh..."
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => { if (trimmed.length >= 2) setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          const first = elders[0] ?? staff[0] ?? meds[0];
          if (!first) return;
          if (first === elders[0]) go(`/elderly/${first.id}`);
          else if (first === staff[0]) go('/caregivers');
          else go('/medications');
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 17, color: '#94A3B8' }} /></InputAdornment>,
          endAdornment: q ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setQ('')} sx={{ width: 26, height: 26, color: '#94A3B8', '&:hover': { color: '#0D9488' } }}>
                <Close sx={{ fontSize: 15 }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '11px', bgcolor: '#F1F5F9', fontSize: 13.5, transition: 'all 0.2s',
            '&:hover fieldset': { borderColor: '#CBD5E1' },
            '&.Mui-focused': { bgcolor: '#fff', borderRadius: '11px', boxShadow: '0 0 0 3px rgba(13,148,136,0.12)' },
          },
        }}
      />

      {open && canSearch && (
        <Box sx={{
          position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.6, zIndex: 1300,
          borderRadius: '14px', bgcolor: '#fff', border: '1px solid #E2E8F0',
          boxShadow: '0 16px 40px rgba(15,23,42,0.18)', maxHeight: 430, overflowY: 'auto',
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
              <CircularProgress size={22} sx={{ color: '#0D9488' }} />
            </Box>
          ) : !anyResult ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Search sx={{ fontSize: 32, color: '#CBD5E1', mb: 0.8 }} />
              <Typography fontWeight={600} color="text.secondary" fontSize={14}>Không có kết quả</Typography>
              <Typography fontSize={12} color="text.disabled" mt={0.4}>Thử với từ khóa khác</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {elders.length > 0 && (
                <>
                  <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography fontSize={10.5} fontWeight={700} sx={{ color: '#3E5B6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Người cao tuổi</Typography>
                  </Box>
                  {elders.map((e) => (
                    <Box key={`e${e.id}`} onClick={() => go(`/elderly/${e.id}`)} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.8, py: 1, cursor: 'pointer', borderRadius: '8px', mx: 0.4, '&:hover': { bgcolor: alpha('#0EA5E9', 0.08) } }}>
                      <People fontSize="small" sx={{ color: '#0D9488' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontSize={13} fontWeight={600} noWrap>{e.fullName}</Typography>
                        <Typography fontSize={11} color="text.secondary" noWrap>{e.code ?? ''} · {e.gender ?? ''}</Typography>
                      </Box>
                    </Box>
                  ))}
                </>
              )}
              {staff.length > 0 && (
                <>
                  <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography fontSize={10.5} fontWeight={700} sx={{ color: '#3E5B6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nhân viên chăm sóc</Typography>
                  </Box>
                  {staff.map((c) => (
                    <Box key={`c${c.id}`} onClick={() => go('/caregivers')} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.8, py: 1, cursor: 'pointer', borderRadius: '8px', mx: 0.4, '&:hover': { bgcolor: alpha('#0EA5E9', 0.08) } }}>
                      <PersonOutlined fontSize="small" sx={{ color: '#F59E0B' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontSize={13} fontWeight={600} noWrap>{c.fullName}</Typography>
                        <Typography fontSize={11} color="text.secondary" noWrap>{c.specialization ?? ''} · {c.status ?? ''}</Typography>
                      </Box>
                    </Box>
                  ))}
                </>
              )}
              {meds.length > 0 && (
                <>
                  <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography fontSize={10.5} fontWeight={700} sx={{ color: '#3E5B6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thuốc</Typography>
                  </Box>
                  {meds.map((m) => (
                    <Box key={`m${m.id}`} onClick={() => go('/medications')} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.8, py: 1, cursor: 'pointer', borderRadius: '8px', mx: 0.4, '&:hover': { bgcolor: alpha('#0EA5E9', 0.08) } }}>
                      <LocalPharmacy fontSize="small" sx={{ color: '#10B981' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontSize={13} fontWeight={600} noWrap>{m.name}</Typography>
                        <Typography fontSize={11} color="text.secondary" noWrap>{m.category ?? ''} · {m.isActive ? 'Đang dùng' : 'Ngừng'}</Typography>
                      </Box>
                    </Box>
                  ))}
                </>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 1.8, py: 1.2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ px: 0.6, borderRadius: '5px', border: '1px solid #D9E2EC', bgcolor: '#EEF2F6', color: '#475569', fontSize: 10, fontWeight: 700 }}>
                  Enter
                </Box>
                <Typography fontSize={12} color="text.secondary">để mở kết quả đầu tiên</Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}