import { Button, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useT } from '../utils/i18n';

export function NotFoundPage() {
  const t = useT();

  return (
    <Paper sx={{ maxWidth: 520, mx: 'auto', p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
      <Typography variant="h1" fontWeight={900} color="primary" sx={{ fontSize: { xs: 72, sm: 96 } }}>
        404
      </Typography>
      <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
        {t.notFoundTitle}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        {t.notFoundText}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button component={Link} to="/" variant="contained" size="large">
          {t.notFoundHome}
        </Button>
        <Button component={Link} to="/catalog" variant="outlined" size="large">
          {t.notFoundCatalog}
        </Button>
      </Stack>
    </Paper>
  );
}
