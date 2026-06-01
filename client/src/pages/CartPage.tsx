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
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { productApi } from '../services';
import { cartActions } from '../store';
import { hasCartStockIssues, isCartItemOverStock, isCartItemUnavailable } from '../utils/cartStock';
import { useT } from '../utils/i18n';
import { getProductName, price } from '../utils/productPresentation';

export function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const language = useAppSelector((state) => state.settings.language);
  const dispatch = useAppDispatch();
  const t = useT();
  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0), [items]);
  const stockIssues = hasCartStockIssues(items);

  useEffect(() => {
    productApi.getAll({ search: '', categoryId: '', minPrice: '', maxPrice: '', sort: 'name' })
      .then((products) => dispatch(cartActions.syncCartStock(products)));
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>{t.cart}</Typography>
      {items.length === 0 ? (
        <Alert severity="info">{t.cartEmpty}</Alert>
      ) : (
        <>
          {stockIssues && <Alert severity="warning">{t.cartStockIssues}</Alert>}
          {items.map((item) => (
            <Paper key={item.product.id} sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{getProductName(item.product, language)}</Typography>
                  <Typography color="text.secondary">{price(item.product.price)}</Typography>
                  {isCartItemUnavailable(item) && (
                    <Alert severity="error" sx={{ mt: 1 }}>{t.cartItemUnavailable}</Alert>
                  )}
                  {isCartItemOverStock(item) && (
                    <Alert severity="warning" sx={{ mt: 1 }}>{t.stockLimitReached}</Alert>
                  )}
                </Box>
                <TextField
                  type="number"
                  label={t.quantity}
                  value={item.quantity}
                  disabled={item.product.stock <= 0}
                  inputProps={{ min: 1, max: Math.max(item.product.stock, 1), step: 1 }}
                  helperText={item.product.stock > 0
                    ? t.quantityRange.replace('{max}', String(item.product.stock))
                    : t.outOfStock}
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
              <Button component={Link} to="/checkout" variant="contained" size="large" disabled={stockIssues}>
                {t.checkout}
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  );
}
