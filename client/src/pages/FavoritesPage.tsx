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

export function FavoritesPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.catalog.products);
  const favoriteIds = useAppSelector((state) => state.catalog.favorites);
  const [message, setMessage] = useState('');
  const favorites = products.filter((product) => favoriteIds.includes(product.id));

  useEffect(() => {
    if (favoriteIds.length > 0 && products.length === 0) {
      productApi.getAll({ search: '', categoryId: '', minPrice: '', maxPrice: '', sort: 'name' })
        .then((data) => dispatch(catalogActions.setProducts(data)))
        .catch(() => setMessage('Не удалось загрузить избранные товары'));
    }
  }, [dispatch, favoriteIds.length, products.length]);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>Избранное</Typography>
      {favorites.length === 0 && (
        <Alert severity="info">
          {favoriteIds.length > 0 ? 'Загружаем избранные товары...' : 'Добавьте товары в избранное в каталоге.'}
        </Alert>
      )}
      {message && <Alert severity="error">{message}</Alert>}
      <Grid container spacing={3}>
        {favorites.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
