import React from 'react';
import { Typography, Paper, Box, Grid, Card, CardContent } from '@mui/material';
import { People, DeliveryDining, Restaurant, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  const stats = [
    { icon: <People />, label: 'Клиенты', path: '/customers' },
    { icon: <DeliveryDining />, label: 'Курьеры', path: '/couriers' },
    { icon: <Restaurant />, label: 'Продукты', path: '/products' },
    { icon: <ShoppingCart />, label: 'Заказы', path: '/orders' },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Платформа для доставки продуктов питания
      </Typography>
      
      <Typography variant="h6" color="textSecondary" align="center" sx={{ mb: 4 }}>
        Управление клиентами, курьерами, продуктами и заказами
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              onClick={() => handleCardClick(stat.path)}
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box sx={{ color: 'primary.main', fontSize: 48, mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h6" component="div">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default HomePage;
