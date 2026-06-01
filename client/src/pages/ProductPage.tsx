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

export function ProductPage() {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.settings.language);
  const t = useT();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    productApi.getOne(id).then(setProduct);
  }, [id]);

  if (!product) return <Typography>Загрузка товара...</Typography>;
  const localizedName = getProductName(product, language);

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          sx={{
            p: 4,
            height: { xs: 340, sm: 430, md: 560 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <CardMedia
            component="img"
            image={product.imageUrl || defaultProductImage}
            alt={localizedName}
            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="overline">{getCategoryName(product.Category, language)}</Typography>
        <Typography variant="h3" fontWeight={900}>{localizedName}</Typography>
        <Typography color="text.secondary" sx={{ my: 2 }}>{getProductDescription(product, language)}</Typography>
        <Typography variant="h4" color="primary" fontWeight={900}>{price(product.price)}</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" size="large" onClick={() => dispatch(cartActions.addToCart(product))}>{t.addToCart}</Button>
          <Button variant="outlined" component={Link} to="/catalog">{t.backToCatalog}</Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
