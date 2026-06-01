import { Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useT } from '../utils/i18n';

export function HomeInfoSections() {
  const t = useT();

  const benefits = [
    [t.benefit1Title, t.benefit1Text],
    [t.benefit2Title, t.benefit2Text],
    [t.benefit3Title, t.benefit3Text],
  ];
  const steps = [t.step1, t.step2, t.step3];
  const stats = [
    [t.stat1Value, t.stat1Label],
    [t.stat2Value, t.stat2Label],
    [t.stat3Value, t.stat3Label],
  ];

  return (
    <>
      <Typography variant="h4" fontWeight={900}>{t.whyTitle}</Typography>
      <Grid container spacing={2}>
        {benefits.map(([title, text]) => (
          <Grid key={title} size={{ xs: 12, md: 4 }}>
            <Paper className="interactive-card" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" fontWeight={800}>{title}</Typography>
              <Typography color="text.secondary">{text}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" fontWeight={900}>{t.stepsTitle}</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {steps.map((step, index) => (
                <Stack key={step} direction="row" spacing={2} alignItems="center">
                  <Chip color="primary" label={index + 1} />
                  <Typography>{step}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" fontWeight={900}>{t.statsTitle}</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {stats.map(([value, label]) => (
                <Grid key={label} size={{ xs: 12, sm: 4 }}>
                  <Typography variant="h4" color="primary" fontWeight={900}>{value}</Typography>
                  <Typography color="text.secondary">{label}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
