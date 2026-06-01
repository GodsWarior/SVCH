import {
  BarChart,
  Delete,
  Edit,
  Inventory,
  LocalShipping,
  Logout,
  SettingsBackupRestore,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CatalogFilters } from '../components/CatalogFilters';
import { HomeHero } from '../components/HomeHero';
import { HomeInfoSections } from '../components/HomeInfoSections';
import { ProductCard } from '../components/ProductCard';
import { ProductImageUploader } from '../components/ProductImageUploader';
import { ReportDownloadCard } from '../components/ReportDownloadCard';
import { SettingsControls } from '../components/SettingsControls';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { authApi, categoryApi, favoriteApi, orderApi, productApi, reportApi, userApi } from '../services';
import { authActions, cartActions, catalogActions, settingsActions } from '../store';
import { Category, Order, Product, User } from '../types';
import { formatDeliverySlot, getDefaultDeliveryTimes, toDateInputValue } from '../utils/delivery';
import { useT } from '../utils/i18n';
import {
  defaultProductImage,
  getCategoryName,
  getFallbackProductDescriptionEn,
  getFallbackProductNameEn,
  getProductDescription,
  getProductName,
  price,
} from '../utils/productPresentation';
import { clearAppStorage } from '../utils/storage';
import {
  safeTextRegex,
  validateAddress,
  validateAuth,
  validateProductForm,
  validateUserForm,
  ValidationErrors,
} from '../utils/validation';

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
