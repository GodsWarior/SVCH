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

export function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0), [items]);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>Корзина</Typography>
      {items.length === 0 ? (
        <Alert severity="info">Корзина пуста. Перейдите в каталог и добавьте продукты.</Alert>
      ) : (
        <>
          {items.map((item) => (
            <Paper key={item.product.id} sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.product.name}</Typography>
                  <Typography color="text.secondary">{price(item.product.price)}</Typography>
                </Box>
                <TextField
                  type="number"
                  label="Количество"
                  value={item.quantity}
                  inputProps={{ min: 1, max: item.product.stock, step: 1 }}
                  helperText={`1-${item.product.stock} шт.`}
                  onChange={(event) => {
                    const value = Math.floor(Number(event.target.value));
                    if (!Number.isFinite(value)) return;
                    const quantity = Math.min(Math.max(value, 1), item.product.stock);
                    dispatch(cartActions.changeQuantity({ productId: item.product.id, quantity }));
                  }}
                  sx={{ width: 140 }}
                />
                <IconButton onClick={() => dispatch(cartActions.changeQuantity({ productId: item.product.id, quantity: 0 }))}>
                  <Delete />
                </IconButton>
              </Stack>
            </Paper>
          ))}
          <Paper sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
              <Typography variant="h5" fontWeight={900}>Итого: {price(total)}</Typography>
              <Button component={Link} to="/checkout" variant="contained" size="large">Оформить заказ</Button>
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  );
}
