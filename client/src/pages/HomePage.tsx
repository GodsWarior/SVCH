import { Stack } from '@mui/material';
import { HomeHero } from '../components/HomeHero';
import { HomeInfoSections } from '../components/HomeInfoSections';

export function HomePage() {
  return (
    <Stack spacing={4}>
      <HomeHero />
      <HomeInfoSections />
    </Stack>
  );
}
