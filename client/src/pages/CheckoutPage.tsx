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

export function CheckoutPage() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const defaultDelivery = useMemo(getDefaultDeliveryTimes, []);
  const [form, setForm] = useState({
    city: 'Минск',
    street: '',
    house: '',
    flat: '',
    deliverAtTime: false,
    deliveryDate: defaultDelivery.date,
    deliveryStartTime: defaultDelivery.startTime,
    paymentMethod: 'card',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState('');
  const deliverySlot = formatDeliverySlot(form.deliveryDate, form.deliveryStartTime);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateAddress(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Исправьте ошибки в адресе доставки');
      return;
    }
    if (items.length === 0) {
      setSubmitError('Корзина пуста');
      return;
    }

    await orderApi.create({
      address: {
        city: form.city.trim(),
        street: form.street.trim(),
        house: form.house.trim(),
        flat: form.flat.trim(),
      },
      deliverySlot,
      paymentMethod: form.paymentMethod,
      items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
    });
    dispatch(cartActions.clearCart());
    navigate('/profile');
  };

  return (
    <Paper component="form" onSubmit={submit} sx={{ maxWidth: 720, mx: 'auto', p: { xs: 3, sm: 4 } }}>
      <Typography variant="h4" fontWeight={900}>Оформление заказа</Typography>
      <Stack spacing={2} sx={{ mt: 3 }}>
        <TextField
          label="Город"
          value={form.city}
          onChange={(event) => setForm({ ...form, city: event.target.value })}
          error={Boolean(errors.city)}
          helperText={errors.city}
          required
        />
        <TextField
          label="Улица"
          value={form.street}
          onChange={(event) => setForm({ ...form, street: event.target.value })}
          error={Boolean(errors.street)}
          helperText={errors.street}
          required
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Дом"
            value={form.house}
            onChange={(event) => setForm({ ...form, house: event.target.value })}
            error={Boolean(errors.house)}
            helperText={errors.house}
            required
          />
          <TextField
            fullWidth
            label="Квартира"
            value={form.flat}
            onChange={(event) => setForm({ ...form, flat: event.target.value })}
            error={Boolean(errors.flat)}
            helperText={errors.flat}
          />
        </Stack>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography fontWeight={800}>Интервал доставки: {deliverySlot}</Typography>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={form.deliverAtTime}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    const nextDefault = getDefaultDeliveryTimes();
                    setForm({
                      ...form,
                      deliverAtTime: checked,
                      deliveryDate: checked ? form.deliveryDate : nextDefault.date,
                      deliveryStartTime: checked ? form.deliveryStartTime : nextDefault.startTime,
                    });
                    setErrors({ ...errors, deliveryDate: '', deliveryStartTime: '' });
                  }}
                />
              )}
              label="Доставить ко времени"
            />
            {form.deliverAtTime && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Дата доставки"
                  value={form.deliveryDate}
                  onChange={(event) => setForm({ ...form, deliveryDate: event.target.value })}
                  error={Boolean(errors.deliveryDate)}
                  helperText={errors.deliveryDate}
                  inputProps={{ min: toDateInputValue(new Date()) }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  fullWidth
                  type="time"
                  label="Время доставки"
                  value={form.deliveryStartTime}
                  onChange={(event) => setForm({ ...form, deliveryStartTime: event.target.value })}
                  error={Boolean(errors.deliveryStartTime)}
                  helperText={errors.deliveryStartTime}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Stack>
            )}
          </Stack>
        </Paper>
        <FormControl>
          <InputLabel>Оплата</InputLabel>
          <Select label="Оплата" value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
            <MenuItem value="card">Картой</MenuItem>
            <MenuItem value="cash">Наличными</MenuItem>
          </Select>
        </FormControl>
        {submitError && <Alert severity="error">{submitError}</Alert>}
        <Button disabled={items.length === 0} type="submit" variant="contained" size="large">Подтвердить заказ</Button>
      </Stack>
    </Paper>
  );
}
