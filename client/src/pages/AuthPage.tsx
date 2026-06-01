import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { authApi } from '../services';
import { authActions } from '../store';
import { useT } from '../utils/i18n';
import { validateAuth, ValidationErrors } from '../utils/validation';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const language = useAppSelector((state) => state.settings.language);
  const t = useT();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateAuth(form, mode, language);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError(t.fixFormErrors);
      return;
    }

    try {
      const data = mode === 'login' ? await authApi.login(form) : await authApi.register(form);
      dispatch(authActions.setCredentials(data));
      navigate('/');
    } catch {
      setError(t.checkCredentials);
    }
  };

  return (
    <Paper component="form" onSubmit={submit} sx={{ maxWidth: 480, mx: 'auto', p: { xs: 3, sm: 4 } }}>
      <Typography variant="h4" fontWeight={900}>{mode === 'login' ? t.authLoginTitle : t.authRegisterTitle}</Typography>
      <Stack spacing={2} sx={{ mt: 3 }}>
        {mode === 'register' && (
          <>
            <TextField
              label={t.nameLabel}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              error={Boolean(errors.name)}
              helperText={errors.name || t.nameHelper}
              required
            />
            <TextField
              label={t.phoneLabel}
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              error={Boolean(errors.phone)}
              helperText={errors.phone || t.phoneExample}
            />
          </>
        )}
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          error={Boolean(errors.email)}
          helperText={errors.email}
          required
        />
        <TextField
          label={t.passwordLabel}
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          error={Boolean(errors.password)}
          helperText={errors.password || (mode === 'register' ? t.passwordMinHint : '')}
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" size="large">{mode === 'login' ? t.login : t.registerButton}</Button>
        <Button component={Link} to={mode === 'login' ? '/register' : '/login'}>
          {mode === 'login' ? t.createAccount : t.alreadyHaveAccount}
        </Button>
      </Stack>
    </Paper>
  );
}
