import { Button, CardMedia, FormHelperText, Paper, Stack, Typography } from '@mui/material';
import { useT } from '../utils/i18n';
import { defaultProductImage } from '../utils/productPresentation';

interface ProductImageUploaderProps {
  imageUrl: string;
  alt: string;
  error?: string;
  uploading: boolean;
  onChange: (file?: File) => void;
  onReset: () => void;
}

export function ProductImageUploader({ imageUrl, alt, error, uploading, onChange, onReset }: ProductImageUploaderProps) {
  const t = useT();

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography fontWeight={800}>{t.productImage}</Typography>
        <CardMedia
          component="img"
          image={imageUrl || defaultProductImage}
          alt={alt || t.productImage}
          sx={{
            width: 180,
            height: 140,
            objectFit: 'contain',
            bgcolor: 'background.default',
            borderRadius: 2,
          }}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="outlined" component="label" disabled={uploading}>
            {uploading ? t.loading : t.chooseImage}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(event) => onChange(event.target.files?.[0])}
            />
          </Button>
          <Button variant="text" onClick={onReset}>
            {t.useDefault}
          </Button>
        </Stack>
        <FormHelperText error={Boolean(error)}>
          {error || t.defaultImageHint}
        </FormHelperText>
      </Stack>
    </Paper>
  );
}
