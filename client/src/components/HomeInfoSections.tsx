import { Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useAppSelector } from '../hooks/redux';
import { useT } from '../utils/i18n';

export function HomeInfoSections() {
  const t = useT();
  const language = useAppSelector((state) => state.settings.language);
  const benefits = language === 'en'
    ? [
      ['Fresh every day', 'We select products with good shelf life and keep chilled items at the right temperature.'],
      ['Convenient delivery', 'Order for the nearest slot or choose the exact date and delivery time yourself.'],
      ['Everything at hand', 'Save favorite products, repeat regular purchases and track every order in your profile.'],
    ]
    : [
      ['Свежие продукты каждый день', 'Мы выбираем товары с хорошими сроками годности и соблюдаем температурный режим для молочных и мясных продуктов.'],
      ['Доставка когда удобно', 'Оформите заказ на ближайший интервал или выберите точную дату и время доставки сами.'],
      ['Все покупки под рукой', 'Сохраняйте любимые товары, повторяйте привычные покупки и отслеживайте каждый заказ в профиле.'],
    ];
  const steps = language === 'en'
    ? ['Choose groceries from the catalog', 'Add items to the cart and confirm the address', 'Receive fresh products at the selected time']
    : ['Выберите продукты в каталоге', 'Добавьте товары в корзину и укажите адрес', 'Получите свежие продукты в выбранное время'];
  const stats = language === 'en'
    ? [['60 min', 'average fast delivery slot'], ['7 days', 'we deliver every week'], ['100+', 'fresh products in the catalog']]
    : [['60 мин', 'быстрый интервал доставки'], ['7 дней', 'доставляем всю неделю'], ['100+', 'свежих товаров в каталоге']];

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
