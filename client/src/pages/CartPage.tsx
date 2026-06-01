import { Delete } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { cartActions } from '../store';
import { useT } from '../utils/i18n';
import { getProductName, price } from '../utils/productPresentation';

export function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const language = useAppSelector((state) => state.settings.language);
  const dispatch = useAppDispatch();
  const t = useT();
  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0), [items]);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>{t.cart}</Typography>
      {items.length === 0 ? (
        <Alert severity="info">{t.cartEmpty}</Alert>
      ) : (
        <>
          {items.map((item) => (
            <Paper key={item.product.id} sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{getProductName(item.product, language)}</Typography>
                  <Typography color="text.secondary">{price(item.product.price)}</Typography>
                </Box>
                <TextField
                  type="number"
                  label={t.quantity}
                  value={item.quantity}
                  inputProps={{ min: 1, max: item.product.stock, step: 1 }}
                  helperText={t.quantityRange.replace('{max}', String(item.product.stock))}
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
              <Typography variant="h5" fontWeight={900}>{t.total}: {price(total)}</Typography>
              <Button component={Link} to="/checkout" variant="contained" size="large">{t.checkout}</Button>
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  );
}
