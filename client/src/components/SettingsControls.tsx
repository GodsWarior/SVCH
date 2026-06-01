import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { useT } from '../utils/i18n';

interface SettingsControlsProps {
  themeMode: 'light' | 'dark';
  language: 'ru' | 'en';
  onThemeChange: (value: 'light' | 'dark') => void;
  onLanguageChange: (value: 'ru' | 'en') => void;
}

export function SettingsControls({ themeMode, language, onThemeChange, onLanguageChange }: SettingsControlsProps) {
  const t = useT();

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={900}>{t.settings}</Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>{t.themeTitle}</InputLabel>
            <Select
              label={t.themeTitle}
              value={themeMode}
              onChange={(event) => onThemeChange(event.target.value as 'light' | 'dark')}
            >
              <MenuItem value="light">{t.lightTheme}</MenuItem>
              <MenuItem value="dark">{t.darkTheme}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>{t.languageTitle}</InputLabel>
            <Select
              label={t.languageTitle}
              value={language}
              onChange={(event) => onLanguageChange(event.target.value as 'ru' | 'en')}
            >
              <MenuItem value="ru">{t.russian}</MenuItem>
              <MenuItem value="en">{t.english}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
