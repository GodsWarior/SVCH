import { ReactNode } from 'react';
import { Button, Paper, Typography } from '@mui/material';

interface ReportDownloadCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onDownload: () => void;
}

export function ReportDownloadCard({ icon, title, description, buttonLabel, onDownload }: ReportDownloadCardProps) {
  return (
    <Paper className="interactive-card" sx={{ p: 3 }}>
      {icon}
      <Typography variant="h5" fontWeight={800}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>
      <Button variant="contained" onClick={onDownload}>{buttonLabel}</Button>
    </Paper>
  );
}
