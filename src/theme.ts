import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D9488',
      light: '#14B8A6',
      dark: '#0B7A70',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#ffffff',
    },
    success: { main: '#10B981', light: '#34D399', dark: '#059669' },
    warning: { main: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
    error: { main: '#EF4444', light: '#F87171', dark: '#DC2626' },
    info: { main: '#0EA5E9', light: '#38BDF8', dark: '#0284C7' },
    background: {
      default: '#F4F7F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: '#EDF1F5',
  },

  shape: { borderRadius: 16 },

  typography: {
    fontFamily: '"Be Vietnam Pro", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F4F7F9' },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          minHeight: '42px',
          padding: '9px 20px',
          boxShadow: 'none',
          transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { boxShadow: '0 8px 20px rgba(15,23,42,0.12)' },
          '&:active': { transform: 'scale(0.97)' },
          '&.Mui-focusVisible': { boxShadow: '0 0 0 3px rgba(13,148,136,0.28)', outline: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0D9488 0%, #10B981 100%)',
          boxShadow: '0 6px 18px rgba(13,148,136,0.28)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0B7A70 0%, #059669 100%)',
            boxShadow: '0 8px 24px rgba(13,148,136,0.38)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
          color: '#0F172A',
          boxShadow: '0 6px 18px rgba(245,158,11,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
            color: '#fff',
            boxShadow: '0 8px 22px rgba(245,158,11,0.4)',
          },
        },
        outlinedPrimary: {
          borderColor: alpha('#0D9488', 0.4),
          '&:hover': { borderColor: '#0D9488', bgcolor: alpha('#0D9488', 0.06) },
        },
        textPrimary: {
          '&:hover': { bgcolor: alpha('#0D9488', 0.08) },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.05)',
          border: '1px solid #EDF1F5',
          backgroundColor: '#fff',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: '16px' },
        elevation1: { boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)' },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            transition: 'all 0.2s ease',
            '&:hover': { backgroundColor: '#fff' },
            '&.Mui-focused': { backgroundColor: '#fff' },
          },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0D9488',
            borderWidth: 2,
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#0D9488' },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: '#F8FAFC',
          transition: 'all 0.2s ease',
          '&:hover': { backgroundColor: '#fff' },
          '&.Mui-focused': { backgroundColor: '#fff' },
        },
        notchedOutline: { borderColor: '#E2E8F0' },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          transition: 'all 0.18s ease',
          '&.Mui-focusVisible': { boxShadow: '0 0 0 3px rgba(13,148,136,0.25)' },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: '10px', fontWeight: 600 },
        sizeSmall: { fontSize: 11, height: 26 },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            color: '#64748B',
            background: '#F8FAFC',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: '1px solid #E8EEF3',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: '#F1F5F9' },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: '#F8FAFC' },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '22px',
          boxShadow: '0 24px 80px rgba(15,23,42,0.22)',
          backgroundImage: 'none',
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': { display: 'none' },
          '&:first-of-type': { borderTopLeftRadius: '16px', borderTopRightRadius: '16px' },
          '&:last-of-type': { borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' },
          backgroundImage: 'none',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: '14px', fontWeight: 500 },
        standardSuccess: { bgcolor: alpha('#10B981', 0.1), color: '#047857' },
        standardError: { bgcolor: alpha('#EF4444', 0.1), color: '#B91C1C' },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: '9px',
          fontSize: 12,
          fontWeight: 500,
          backgroundColor: '#0F172A',
          boxShadow: '0 8px 24px rgba(15,23,42,0.25)',
          padding: '6px 12px',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: 'none' },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: '12px', transition: 'all 0.18s ease' },
      },
    },

    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: '10px',
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #0D9488, #10B981)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
            },
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: '10px 10px 0 0' },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          border: '1px solid #EDF1F5',
          boxShadow: '0 16px 48px rgba(15,23,42,0.16)',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: { borderRadius: '10px' },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#EDF1F5' },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: { transition: 'color 0.2s ease, transform 0.2s ease' },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          height: 8,
          backgroundColor: alpha('#0D9488', 0.12),
        },
        bar: {
          borderRadius: '8px',
          background: 'linear-gradient(90deg, #0D9488, #10B981)',
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: { borderRadius: '10px' },
      },
    },
  },
});

export default theme;
