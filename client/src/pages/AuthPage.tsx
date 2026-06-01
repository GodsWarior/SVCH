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

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateAuth(form, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError('Исправьте ошибки в форме');
      return;
    }

    try {
      const data = mode === 'login' ? await authApi.login(form) : await authApi.register(form);
      dispatch(authActions.setCredentials(data));
      navigate('/');
    } catch {
      setError('Проверьте введенные данные');
    }
  };

  return (
    <Paper component="form" onSubmit={submit} sx={{ maxWidth: 480, mx: 'auto', p: { xs: 3, sm: 4 } }}>
      <Typography variant="h4" fontWeight={900}>{mode === 'login' ? 'Вход' : 'Регистрация'}</Typography>
      <Stack spacing={2} sx={{ mt: 3 }}>
        {mode === 'register' && (
          <>
            <TextField
              label="Имя"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              error={Boolean(errors.name)}
              helperText={errors.name || 'Только буквы, пробел и дефис'}
              required
            />
            <TextField
              label="Телефон"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              error={Boolean(errors.phone)}
              helperText={errors.phone || 'Например: +375293737994'}
            />
          </>
        )}
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          error={Boolean(errors.email)}
          helperText={errors.email}
          required
        />
        <TextField
          label="Пароль"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          error={Boolean(errors.password)}
          helperText={errors.password || (mode === 'register' ? 'Минимум 8 символов' : '')}
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" size="large">{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</Button>
        <Button component={Link} to={mode === 'login' ? '/register' : '/login'}>
          {mode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт'}
        </Button>
      </Stack>
    </Paper>
  );
}
