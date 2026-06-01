import { Box, Container, Grid, Typography } from '@mui/material';
import { useT } from '../utils/i18n';

export function Footer() {
  const t = useT();

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', mt: 6 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" color="primary" fontWeight={900}>FreshMarket</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>{t.footerTagline}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography fontWeight={800}>{t.contacts}</Typography>
            <Typography color="text.secondary">{t.phone}</Typography>
            <Typography color="text.secondary">{t.email}</Typography>
            <Typography color="text.secondary">{t.address}</Typography>
            <Typography color="text.secondary">{t.schedule}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography fontWeight={800}>{t.service}</Typography>
            <Typography color="text.secondary">{t.delivery}</Typography>
            <Typography color="text.secondary">{t.payment}</Typography>
            <Typography color="text.secondary">{t.returns}</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
