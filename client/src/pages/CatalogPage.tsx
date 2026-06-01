import {
  Alert,
  Grid,
  Pagination,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { CatalogFilters } from '../components/CatalogFilters';
import { ProductCard } from '../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { categoryApi, productApi } from '../services';
import { catalogActions } from '../store';
import { Category } from '../types';
import { useT } from '../utils/i18n';
import { safeTextRegex } from '../utils/validation';

type FilterErrorKey = 'priceFormat' | 'searchInvalid' | 'priceRange' | null;

export function CatalogPage() {
  const dispatch = useAppDispatch();
  const { products, filters } = useAppSelector((state) => state.catalog);
  const language = useAppSelector((state) => state.settings.language);
  const theme = useTheme();
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const t = useT();
  const [categories, setCategories] = useState<Category[]>([]);
  const [messageKey, setMessageKey] = useState<'categories' | 'catalog' | null>(null);
  const [filterErrorKey, setFilterErrorKey] = useState<FilterErrorKey>(null);
  const [page, setPage] = useState(1);

  const message = messageKey === 'categories'
    ? t.categoriesLoadError
    : messageKey === 'catalog'
      ? t.catalogLoadError
      : '';

  const filterError = filterErrorKey === 'priceFormat'
    ? t.filterErrorPriceFormat
    : filterErrorKey === 'searchInvalid'
      ? t.filterErrorSearchInvalid
      : filterErrorKey === 'priceRange'
        ? t.filterErrorPriceRange
        : '';

  const pageSize = useMemo(() => {
    const columnsPerRow = isXl ? 4 : isMd ? 3 : isSm ? 2 : 1;
    return columnsPerRow * 4;
  }, [isMd, isSm, isXl]);

  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [page, pageSize, products]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(() => setMessageKey('categories'));
  }, []);

  useEffect(() => {
    productApi.getAll(filters)
      .then((data) => dispatch(catalogActions.setProducts(data)))
      .catch(() => setMessageKey('catalog'));
  }, [dispatch, filters]);

  const updateFilter = (name: string, value: string) => {
    if (['minPrice', 'maxPrice'].includes(name) && value && !/^\d{0,6}([.,]\d{0,2})?$/.test(value)) {
      setFilterErrorKey('priceFormat');
      return;
    }
    if (name === 'search' && value && !safeTextRegex.test(value)) {
      setFilterErrorKey('searchInvalid');
      return;
    }
    const nextFilters = { ...filters, [name]: value.replace(',', '.') };
    if (nextFilters.minPrice && nextFilters.maxPrice && Number(nextFilters.minPrice) > Number(nextFilters.maxPrice)) {
      setFilterErrorKey('priceRange');
    } else {
      setFilterErrorKey(null);
    }
    dispatch(catalogActions.setFilters({ [name]: nextFilters[name as keyof typeof nextFilters] }));
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>{t.catalogTitle}</Typography>
      <CatalogFilters
        categories={categories}
        filters={filters}
        filterError={filterError}
        searchFieldError={filterErrorKey === 'searchInvalid'}
        priceFieldsError={filterErrorKey === 'priceFormat' || filterErrorKey === 'priceRange'}
        language={language}
        onChange={updateFilter}
      />
      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      {pageCount > 1 && (
        <Stack alignItems="center" pt={1}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
      <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={() => setMessageKey(null)}>
        <Alert severity="error">{message}</Alert>
      </Snackbar>
    </Stack>
  );
}
