const bcrypt = require('bcryptjs');
const { Role, User, Category, Product } = require('./models');

const seedInitialData = async () => {
  const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  const image = (filename) => `${serverUrl}/uploads/products/${filename}`;

  const [customerRole] = await Role.findOrCreate({ where: { name: 'customer' } });
  const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });

  await User.findOrCreate({
    where: { email: 'admin@fresh.test' },
    defaults: {
      name: 'Администратор',
      passwordHash: await bcrypt.hash('admin12345', 10),
      phone: '+375291112233',
      RoleId: adminRole.id,
    },
  });

  await User.findOrCreate({
    where: { email: 'customer@fresh.test' },
    defaults: {
      name: 'Покупатель',
      passwordHash: await bcrypt.hash('customer12345', 10),
      phone: '+375292223344',
      RoleId: customerRole.id,
    },
  });

  const categories = ['Овощи', 'Фрукты', 'Молочные продукты', 'Хлеб', 'Напитки', 'Мясо'];
  for (const name of categories) {
    await Category.findOrCreate({ where: { name }, defaults: { description: `Категория ${name}` } });
  }

  const vegetable = await Category.findOne({ where: { name: 'Овощи' } });
  const fruit = await Category.findOne({ where: { name: 'Фрукты' } });
  const dairy = await Category.findOne({ where: { name: 'Молочные продукты' } });
  const bread = await Category.findOne({ where: { name: 'Хлеб' } });
  const drinks = await Category.findOne({ where: { name: 'Напитки' } });
  const meat = await Category.findOne({ where: { name: 'Мясо' } });

  const products = [
    { name: 'Томаты свежие', nameEn: 'Fresh Tomatoes', imageUrl: image('tomatoes.png'), price: 4.9, weight: '1 кг', stock: 45, CategoryId: vegetable.id, isPopular: true },
    { name: 'Огурцы хрустящие', nameEn: 'Crispy Cucumbers', imageUrl: image('cucumbers.png'), price: 3.7, weight: '1 кг', stock: 38, CategoryId: vegetable.id },
    { name: 'Яблоки сезонные', nameEn: 'Seasonal Apples', imageUrl: image('apples.png'), price: 2.8, weight: '1 кг', stock: 60, CategoryId: fruit.id, isPopular: true },
    { name: 'Бананы', nameEn: 'Bananas', imageUrl: image('bananas.png'), price: 5.1, weight: '1 кг', stock: 52, CategoryId: fruit.id },
    { name: 'Молоко 3.2%', nameEn: 'Milk 3.2%', imageUrl: image('milk.png'), price: 2.4, weight: '1 л', stock: 30, CategoryId: dairy.id, isPopular: true },
    { name: 'Творог фермерский', nameEn: 'Farm Cottage Cheese', imageUrl: image('cottage-cheese.png'), price: 4.6, weight: '400 г', stock: 21, CategoryId: dairy.id },
    { name: 'Морковь мытая', nameEn: 'Washed Carrots', imageUrl: image('tomatoes.png'), price: 2.2, weight: '1 кг', stock: 48, CategoryId: vegetable.id },
    { name: 'Груши конференция', nameEn: 'Conference Pears', imageUrl: image('apples.png'), price: 6.4, weight: '1 кг', stock: 36, CategoryId: fruit.id },
    { name: 'Йогурт натуральный', nameEn: 'Natural Yogurt', imageUrl: image('milk.png'), price: 3.3, weight: '350 г', stock: 34, CategoryId: dairy.id },
    { name: 'Батон пшеничный', nameEn: 'Wheat Loaf', imageUrl: image('bananas.png'), price: 1.8, weight: '400 г', stock: 40, CategoryId: bread.id },
    { name: 'Сок яблочный', nameEn: 'Apple Juice', imageUrl: image('apples.png'), price: 4.1, weight: '1 л', stock: 28, CategoryId: drinks.id },
    { name: 'Филе куриное', nameEn: 'Chicken Fillet', imageUrl: image('tomatoes.png'), price: 11.9, weight: '1 кг', stock: 24, CategoryId: meat.id, isPopular: true },
    { name: 'Говядина для тушения', nameEn: 'Beef Stew Meat', imageUrl: image('cottage-cheese.png'), price: 18.5, weight: '1 кг', stock: 16, CategoryId: meat.id },
  ];

  for (const product of products) {
    const [created] = await Product.findOrCreate({
      where: { name: product.name },
      defaults: {
        ...product,
        description: 'Качественный продукт с быстрой доставкой на дом.',
        descriptionEn: 'High-quality product with fast home delivery.',
        imageUrl: product.imageUrl,
      },
    });
    await created.update({
      nameEn: product.nameEn,
      descriptionEn: created.descriptionEn || 'High-quality product with fast home delivery.',
    });
  }
};

module.exports = { seedInitialData };
