import { Logout } from '@mui/icons-material';
import {
  Alert,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { authApi, orderApi } from '../services';
import { authActions, catalogActions } from '../store';
import { Order } from '../types';
import { useT } from '../utils/i18n';
import { price } from '../utils/productPresentation';
import { validateUserForm, ValidationErrors } from '../utils/validation';

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.settings.language);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    orderApi.getAll().then(setOrders);
  }, []);

  useEffect(() => {
    setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  }, [user]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateUserForm({ ...form, role: user?.role || 'customer' }, language);
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
      setMessage('success');
    } catch {
      setMessage('error');
    }
  };

  const logout = () => {
    dispatch(authActions.logout());
    dispatch(catalogActions.clearFavoritesLocal());
    navigate('/login');
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>{t.profile}</Typography>
      <Paper component="form" onSubmit={saveProfile} sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>{t.personalData}</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label={t.nameLabel}
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
              label={t.phoneLabel}
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              error={Boolean(errors.phone)}
              helperText={errors.phone || t.phoneExample}
            />
          </Grid>
        </Grid>
        {message && (
          <Alert severity={message === 'error' ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message === 'error' ? t.profileUpdateError : t.profileUpdated}
          </Alert>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button type="submit" variant="contained">{t.saveChanges}</Button>
          <Button variant="outlined" color="error" startIcon={<Logout />} onClick={logout}>{t.logoutAccount}</Button>
        </Stack>
      </Paper>
      <Typography variant="h5" fontWeight={800}>{t.orderHistory}</Typography>
      {orders.map((order) => (
        <Paper key={order.id} sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
            <Typography>{t.orderNumber.replace('{id}', String(order.id))}</Typography>
            <Chip label={order.status} color="primary" />
            <Typography fontWeight={800}>{price(order.total)}</Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
