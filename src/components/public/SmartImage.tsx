import { useState } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';

interface SmartImageProps {
  src: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  /** Gradient hiển thị thay thế nếu ảnh lỗi (404 / offline) */
  fallback?: string;
  sx?: SxProps<Theme>;
}

/**
 * Ảnh an toàn: nếu URL ảnh lỗi sẽ hiển thị gradient thay thế
 * thay vì hình ảnh gãy, giúp giao diện luôn trông sạch sẽ và chuyên nghiệp.
 */
export default function SmartImage({ src, alt = '', loading = 'lazy', fallback, sx }: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: fallback ?? 'linear-gradient(135deg, #103334 0%, #0B1220 100%)',
          ...sx,
        }}
      >
        <BrokenImage sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 42 }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', ...sx }}
    />
  );
}
