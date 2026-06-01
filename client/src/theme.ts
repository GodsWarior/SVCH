import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

export const createAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: { main: '#2e7d32' },
    secondary: { main: '#ff8f00' },
    background: {
      default: mode === 'dark' ? '#101510' : '#f7fbf6',
      paper: mode === 'dark' ? '#172017' : '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
});
