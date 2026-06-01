import { Button, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Paper sx={{ maxWidth: 520, mx: 'auto', p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
      <Typography variant="h1" fontWeight={900} color="primary" sx={{ fontSize: { xs: 72, sm: 96 } }}>
        404
      </Typography>
      <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
        Страница не найдена
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Запрошенный адрес не существует или был перемещён.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button component={Link} to="/" variant="contained" size="large">
          Вернуться на главную
        </Button>
        <Button component={Link} to="/catalog" variant="outlined" size="large">
          Перейти в каталог
        </Button>
      </Stack>
    </Paper>
  );
}
