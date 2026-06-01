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

export function CatalogPage() {
  const dispatch = useAppDispatch();
  const { products, filters } = useAppSelector((state) => state.catalog);
  const language = useAppSelector((state) => state.settings.language);
  const t = useT();
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');
  const [filterError, setFilterError] = useState('');

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(() => setMessage('Не удалось загрузить категории'));
  }, []);

  useEffect(() => {
    productApi.getAll(filters)
      .then((data) => dispatch(catalogActions.setProducts(data)))
      .catch(() => setMessage('Не удалось загрузить каталог'));
  }, [dispatch, filters]);

  const updateFilter = (name: string, value: string) => {
    if (['minPrice', 'maxPrice'].includes(name) && value && !/^\d{0,6}([.,]\d{0,2})?$/.test(value)) {
      setFilterError('Цена должна быть положительным числом, максимум 2 знака после запятой');
      return;
    }
    if (name === 'search' && value && !safeTextRegex.test(value)) {
      setFilterError('Поиск содержит недопустимые символы');
      return;
    }
    const nextFilters = { ...filters, [name]: value.replace(',', '.') };
    if (nextFilters.minPrice && nextFilters.maxPrice && Number(nextFilters.minPrice) > Number(nextFilters.maxPrice)) {
      setFilterError('Минимальная цена не может быть больше максимальной');
    } else {
      setFilterError('');
    }
    dispatch(catalogActions.setFilters({ [name]: nextFilters[name as keyof typeof nextFilters] }));
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>{t.catalogTitle}</Typography>
      <CatalogFilters
        categories={categories}
        filters={filters}
        filterError={filterError}
        language={language}
        onChange={updateFilter}
      />
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={() => setMessage('')}>
        <Alert severity="error">{message}</Alert>
      </Snackbar>
    </Stack>
  );
}
