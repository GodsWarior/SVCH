import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { orderApi } from '../services';
import { cartActions } from '../store';
import { formatDeliverySlot, getDefaultDeliveryTimes, toDateInputValue } from '../utils/delivery';
import { useT } from '../utils/i18n';
import { validateAddress, ValidationErrors } from '../utils/validation';

export function CheckoutPage() {
  const items = useAppSelector((state) => state.cart.items);
  const language = useAppSelector((state) => state.settings.language);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();
  const defaultDelivery = useMemo(getDefaultDeliveryTimes, []);
  const [form, setForm] = useState({
    city: t.defaultCity,
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
  const deliverySlot = formatDeliverySlot(form.deliveryDate, form.deliveryStartTime, language);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateAddress(form, language);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError(t.fixAddressErrors);
      return;
    }
    if (items.length === 0) {
      setSubmitError(t.cartEmptyCheckout);
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
      <Typography variant="h4" fontWeight={900}>{t.checkoutTitle}</Typography>
      <Stack spacing={2} sx={{ mt: 3 }}>
        <TextField
          label={t.cityLabel}
          value={form.city}
          onChange={(event) => setForm({ ...form, city: event.target.value })}
          error={Boolean(errors.city)}
          helperText={errors.city}
          required
        />
        <TextField
          label={t.streetLabel}
          value={form.street}
          onChange={(event) => setForm({ ...form, street: event.target.value })}
          error={Boolean(errors.street)}
          helperText={errors.street}
          required
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label={t.houseLabel}
            value={form.house}
            onChange={(event) => setForm({ ...form, house: event.target.value })}
            error={Boolean(errors.house)}
            helperText={errors.house}
            required
          />
          <TextField
            fullWidth
            label={t.flatLabel}
            value={form.flat}
            onChange={(event) => setForm({ ...form, flat: event.target.value })}
            error={Boolean(errors.flat)}
            helperText={errors.flat}
          />
        </Stack>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography fontWeight={800}>{t.deliveryInterval}: {deliverySlot}</Typography>
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
              label={t.deliverAtTime}
            />
            {form.deliverAtTime && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  type="date"
                  label={t.deliveryDate}
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
                  label={t.deliveryTime}
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
          <InputLabel>{t.paymentLabel}</InputLabel>
          <Select label={t.paymentLabel} value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
            <MenuItem value="card">{t.payCard}</MenuItem>
            <MenuItem value="cash">{t.payCash}</MenuItem>
          </Select>
        </FormControl>
        {submitError && <Alert severity="error">{submitError}</Alert>}
        <Button disabled={items.length === 0} type="submit" variant="contained" size="large">{t.confirmOrder}</Button>
      </Stack>
    </Paper>
  );
}
