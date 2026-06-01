import { SettingsBackupRestore } from '@mui/icons-material';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { SettingsControls } from '../components/SettingsControls';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { favoriteApi } from '../services';
import { cartActions, catalogActions, settingsActions } from '../store';
import { useT } from '../utils/i18n';
import { clearAppStorage } from '../utils/storage';

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const t = useT();
  const favoriteIds = useAppSelector((state) => state.catalog.favorites);
  const { themeMode, language } = useAppSelector((state) => state.settings);
  const reset = async () => {
    await Promise.allSettled(favoriteIds.map((productId) => favoriteApi.remove(productId)));
    clearAppStorage();
    dispatch(catalogActions.resetFilters());
    dispatch(catalogActions.clearFavoritesLocal());
    dispatch(cartActions.clearCart());
    dispatch(settingsActions.setThemeMode('light'));
    dispatch(settingsActions.setLanguage('ru'));
  };

  return (
    <Stack spacing={3}>
      <SettingsControls
        themeMode={themeMode}
        language={language}
        onThemeChange={(value) => dispatch(settingsActions.setThemeMode(value))}
        onLanguageChange={(value) => dispatch(settingsActions.setLanguage(value))}
      />
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t.resetText}
        </Typography>
        <Button startIcon={<SettingsBackupRestore />} variant="contained" color="secondary" onClick={reset}>
          {t.reset}
        </Button>
      </Paper>
    </Stack>
  );
}
