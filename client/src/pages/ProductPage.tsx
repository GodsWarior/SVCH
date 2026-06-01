import { Alert, Button, CardMedia, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { productApi } from '../services';
import { cartActions } from '../store';
import { Product } from '../types';
import { canAddToCart, getCartQuantity } from '../utils/cartStock';
import { useT } from '../utils/i18n';
import {
  defaultProductImage,
  getCategoryName,
  getProductDescription,
  getProductName,
  price,
} from '../utils/productPresentation';

export function ProductPage() {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.settings.language);
  const cartItems = useAppSelector((state) => state.cart.items);
  const t = useT();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    productApi.getOne(id).then(setProduct);
  }, [id]);

  if (!product) return <Typography>{t.productLoading}</Typography>;
  const localizedName = getProductName(product, language);
  const cartQuantity = getCartQuantity(cartItems, product.id);
  const canAdd = canAddToCart(product, cartQuantity);

  const handleAddToCart = () => {
    if (!canAdd) {
      setMessage(product.stock <= 0 ? t.outOfStock : t.stockLimitReached);
      return;
    }
    dispatch(cartActions.addToCart(product));
  };

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
        <Chip
          sx={{ mt: 2 }}
          label={product.stock > 0 ? `${t.inStock}: ${product.stock}` : t.outOfStock}
          color={product.stock > 0 ? 'success' : 'default'}
        />
        {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" size="large" disabled={product.stock <= 0} onClick={handleAddToCart}>
            {product.stock <= 0 ? t.outOfStock : t.addToCart}
          </Button>
          <Button variant="outlined" component={Link} to="/catalog">{t.backToCatalog}</Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
