import { AddShoppingCart, Logout } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoriteApi } from '../services';
import { useT } from '../utils/i18n';
import { authActions, catalogActions } from '../store';
import { loadJson, saveJson } from '../utils/storage';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Product } from '../types';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const cartCount = useAppSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const user = useAppSelector((state) => state.auth.user);
  const t = useT();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(catalogActions.clearFavoritesLocal());
      return;
    }

    const storageKey = `fresh_favorites_${user.id}`;
    dispatch(catalogActions.setFavorites(loadJson<number[]>(storageKey, [])));

    favoriteApi.getAll()
      .then((favorites) => {
        const ids = favorites
          .map((favorite: { ProductId?: number; Product?: Product }) => favorite.ProductId ?? favorite.Product?.id)
          .filter((id: number | undefined): id is number => Boolean(id));
        saveJson(storageKey, ids);
        dispatch(catalogActions.setFavorites(ids));
      })
      .catch(() => {
        dispatch(catalogActions.setFavorites(loadJson<number[]>(storageKey, [])));
      });
  }, [dispatch, user]);

  const nav = [
    [t.home, '/'],
    [t.catalog, '/catalog'],
    [t.favorites, '/favorites'],
    [t.profile, '/profile'],
    [t.settings, '/settings'],
  ];

  if (user?.role === 'admin') {
    nav.push([t.admin, '/admin/products'], [t.reports, '/admin/reports']);
  }

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar sx={{ gap: { xs: 1, sm: 2 }, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <Typography component={Link} to="/" variant="h6" color="primary" fontWeight={800}>
            FreshMarket
          </Typography>
          <Stack direction="row" gap={1} sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {nav.map(([label, href]) => (
              <Button key={href} component={Link} to={href}>{label}</Button>
            ))}
          </Stack>
          <IconButton component={Link} to="/cart" aria-label="Корзина">
            <Badge badgeContent={cartCount} color="secondary">
              <AddShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <Button
              startIcon={<Logout />}
              onClick={() => {
                dispatch(authActions.logout());
                dispatch(catalogActions.clearFavoritesLocal());
              }}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              {t.logout}
            </Button>
          ) : (
            <Button component={Link} to="/login" variant="contained">{t.login}</Button>
          )}
          <Button onClick={() => setDrawerOpen(true)} sx={{ display: { md: 'none' } }}>{t.menu}</Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box width={260} role="navigation" onClick={() => setDrawerOpen(false)}>
          <List>
            {nav.map(([label, href]) => (
              <ListItemButton key={href} component={Link} to={href}>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Container component="main" maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, md: 4 } }}>
        {children}
      </Container>
      <Footer />
    </>
  );
}
