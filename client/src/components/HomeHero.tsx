import { Button, CardMedia, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useT } from '../utils/i18n';

export function HomeHero() {
  const t = useT();

  return (
    <Paper className="hero" sx={{ p: { xs: 3, md: 6 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="overline" color="primary">{t.heroOverline}</Typography>
          <Typography variant="h2" fontWeight={900} sx={{ fontSize: { xs: 36, md: 64 } }}>
            {t.heroTitle}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ my: 3 }}>
            {t.heroText}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={Link} to="/catalog" size="large" variant="contained">{t.goCatalog}</Button>
            <Button component={Link} to="/register" size="large" variant="outlined">{t.createAccount}</Button>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <CardMedia
            component="img"
            image="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
            alt={t.heroImageAlt}
            sx={{ borderRadius: 6, minHeight: 280, objectFit: 'cover' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
