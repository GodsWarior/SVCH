import { Search } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { Category, ProductFilters } from '../types';
import { Language, useT } from '../utils/i18n';
import { getCategoryName } from '../utils/productPresentation';

interface CatalogFiltersProps {
  categories: Category[];
  filters: ProductFilters;
  filterError: string;
  language: Language;
  onChange: (name: string, value: string) => void;
}

export function CatalogFilters({ categories, filters, filterError, language, onChange }: CatalogFiltersProps) {
  const t = useT();

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label={t.search}
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            error={Boolean(filterError && filterError.includes('Поиск'))}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>{t.category}</InputLabel>
            <Select label={t.category} value={filters.categoryId} onChange={(event) => onChange('categoryId', event.target.value)}>
              <MenuItem value="">{t.all}</MenuItem>
              {categories.map((category) => <MenuItem key={category.id} value={String(category.id)}>{getCategoryName(category, language)}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            label={t.priceFrom}
            value={filters.minPrice}
            onChange={(event) => onChange('minPrice', event.target.value)}
            error={Boolean(filterError && !filterError.includes('Поиск'))}
            inputProps={{ inputMode: 'decimal' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            label={t.priceTo}
            value={filters.maxPrice}
            onChange={(event) => onChange('maxPrice', event.target.value)}
            error={Boolean(filterError && !filterError.includes('Поиск'))}
            inputProps={{ inputMode: 'decimal' }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>{t.sort}</InputLabel>
            <Select label={t.sort} value={filters.sort} onChange={(event) => onChange('sort', event.target.value)}>
              <MenuItem value="name">{t.sortName}</MenuItem>
              <MenuItem value="priceAsc">{t.sortPriceAsc}</MenuItem>
              <MenuItem value="priceDesc">{t.sortPriceDesc}</MenuItem>
              <MenuItem value="popular">{t.sortPopular}</MenuItem>
              <MenuItem value="newest">{t.sortNewest}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {filterError && <FormHelperText error>{filterError}</FormHelperText>}
    </Paper>
  );
}
