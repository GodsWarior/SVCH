import { Alert, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { productApi } from '../services';
import { catalogActions } from '../store';
import { useT } from '../utils/i18n';

export function FavoritesPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.catalog.products);
  const favoriteIds = useAppSelector((state) => state.catalog.favorites);
  const t = useT();
  const [message, setMessage] = useState('');
  const favorites = products.filter((product) => favoriteIds.includes(product.id));

  useEffect(() => {
    if (favoriteIds.length > 0 && products.length === 0) {
      productApi.getAll({ search: '', categoryId: '', minPrice: '', maxPrice: '', sort: 'name' })
        .then((data) => dispatch(catalogActions.setProducts(data)))
        .catch(() => setMessage(t.favoritesLoadError));
    }
  }, [dispatch, favoriteIds.length, products.length, t.favoritesLoadError]);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>{t.favorites}</Typography>
      {favorites.length === 0 && (
        <Alert severity="info">
          {favoriteIds.length > 0 ? t.favoritesLoading : t.favoritesEmpty}
        </Alert>
      )}
      {message && <Alert severity="error">{message}</Alert>}
      <Grid container spacing={3}>
        {favorites.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
