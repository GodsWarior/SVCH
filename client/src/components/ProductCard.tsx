import { Favorite, FavoriteBorder } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { favoriteApi } from '../services';
import { useT } from '../utils/i18n';
import {
  defaultProductImage,
  getCategoryName,
  getProductName,
  price,
  weightFallbackEn,
} from '../utils/productPresentation';
import { cartActions, catalogActions } from '../store';
import { saveJson } from '../utils/storage';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.catalog.favorites);
  const user = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.settings.language);
  const t = useT();
  const [message, setMessage] = useState('');
  const isFavorite = favorites.includes(product.id);
  const localizedName = getProductName(product, language);
  const localizedCategory = getCategoryName(product.Category, language);
  const localizedWeight = language === 'en' ? weightFallbackEn(product.weight) : product.weight;

  const toggleFavorite = async () => {
    if (!user) {
      setMessage(t.signInForFavorites);
      return;
    }

    try {
      const nextFavorites = isFavorite
        ? favorites.filter((id) => id !== product.id)
        : [...favorites, product.id];

      if (isFavorite) {
        await favoriteApi.remove(product.id);
      } else {
        await favoriteApi.add(product.id);
      }

      saveJson(`fresh_favorites_${user.id}`, nextFavorites);
      dispatch(catalogActions.setFavorites(nextFavorites));
    } catch {
      setMessage(t.favoriteError);
    }
  };

  return (
    <>
      <Card className="interactive-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box
          sx={{
            height: { xs: 210, sm: 225 },
            p: 1,
            bgcolor: 'background.default',
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
        </Box>
        <CardContent sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Typography component={Link} to={`/products/${product.id}`} variant="h6" fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>
              {localizedName}
            </Typography>
            <IconButton onClick={toggleFavorite} color={isFavorite ? 'secondary' : 'default'} aria-label="Избранное">
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Stack>
          <Typography color="text.secondary">{localizedCategory} · {localizedWeight}</Typography>
          <Typography variant="h5" color="primary" fontWeight={900} sx={{ mt: 2 }}>{price(product.price)}</Typography>
          <Chip size="small" label={product.stock > 0 ? `${t.inStock}: ${product.stock}` : t.outOfStock} color={product.stock > 0 ? 'success' : 'default'} />
        </CardContent>
        <CardActions>
          <Button fullWidth variant="contained" onClick={() => dispatch(cartActions.addToCart(product))}>
            {t.addToCart}
          </Button>
        </CardActions>
      </Card>
      <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={() => setMessage('')}>
        <Alert severity="info">{message}</Alert>
      </Snackbar>
    </>
  );
}
