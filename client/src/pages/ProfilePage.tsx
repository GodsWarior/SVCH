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

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    orderApi.getAll().then(setOrders);
  }, []);

  useEffect(() => {
    setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  }, [user]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateUserForm({ ...form, role: user?.role || 'customer' });
    const { role, ...profileErrors } = nextErrors;
    setErrors(profileErrors);
    if (Object.keys(profileErrors).length > 0) return;

    try {
      const data = await authApi.updateMe({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      dispatch(authActions.updateUser(data.user));
      setMessage('Профиль обновлен');
    } catch {
      setMessage('Не удалось обновить профиль');
    }
  };

  const logout = () => {
    dispatch(authActions.logout());
    dispatch(catalogActions.clearFavoritesLocal());
    navigate('/login');
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>Профиль</Typography>
      <Paper component="form" onSubmit={saveProfile} sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>Личные данные</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Имя"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Телефон"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              error={Boolean(errors.phone)}
              helperText={errors.phone || 'Например: +375293737994'}
            />
          </Grid>
        </Grid>
        {message && <Alert severity={message.includes('Не удалось') ? 'error' : 'success'} sx={{ mt: 2 }}>{message}</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button type="submit" variant="contained">Сохранить изменения</Button>
          <Button variant="outlined" color="error" startIcon={<Logout />} onClick={logout}>Выйти из аккаунта</Button>
        </Stack>
      </Paper>
      <Typography variant="h5" fontWeight={800}>История заказов</Typography>
      {orders.map((order) => (
        <Paper key={order.id} sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
            <Typography>Заказ #{order.id}</Typography>
            <Chip label={order.status} color="primary" />
            <Typography fontWeight={800}>{price(order.total)}</Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
