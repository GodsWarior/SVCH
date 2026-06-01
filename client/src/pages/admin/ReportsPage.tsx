import { BarChart, LocalShipping } from '@mui/icons-material';
import { Grid, Stack, Typography } from '@mui/material';
import { ReportDownloadCard } from '../../components/ReportDownloadCard';
import { reportApi } from '../../services';
import { useT } from '../../utils/i18n';

export function ReportsPage() {
  const t = useT();

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>{t.reports}</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReportDownloadCard
            icon={<BarChart color="primary" fontSize="large" />}
            title={t.salesReportTitle}
            description={t.salesReportDesc}
            buttonLabel={t.downloadPdf}
            onDownload={() => reportApi.download('sales.pdf')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReportDownloadCard
            icon={<LocalShipping color="primary" fontSize="large" />}
            title={t.stockReportTitle}
            description={t.stockReportDesc}
            buttonLabel={t.downloadDocx}
            onDownload={() => reportApi.download('stock.docx')}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
