const bcrypt = require('bcryptjs');
const { Role, User, Category, Product } = require('./models');

const DEFAULT_IMAGE = 'default-product.svg';
const SEED_ADMIN_EMAIL = 'admin@fresh.test';

const getProductImageUrl = () => {
  const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  const image = (filename) => `${serverUrl}/uploads/products/${filename}`;
  return (filename) => image(filename || DEFAULT_IMAGE);
};

const getSeedProducts = () => [
  // Овощи
  { name: 'Томаты свежие', nameEn: 'Fresh Tomatoes', image: 'tomatoes.png', price: 4.9, weight: '1 кг', stock: 45, category: 'Овощи', isPopular: true },
  { name: 'Огурцы хрустящие', nameEn: 'Crispy Cucumbers', image: 'cucumbers.png', price: 3.7, weight: '1 кг', stock: 38, category: 'Овощи' },
  { name: 'Морковь мытая', nameEn: 'Washed Carrots', price: 2.2, weight: '1 кг', stock: 48, category: 'Овощи' },
  { name: 'Картофель молодой', nameEn: 'Young Potatoes', price: 1.9, weight: '1 кг', stock: 70, category: 'Овощи' },
  { name: 'Лук репчатый', nameEn: 'Onions', price: 1.5, weight: '1 кг', stock: 55, category: 'Овощи' },
  { name: 'Перец болгарский', nameEn: 'Bell Peppers', price: 5.8, weight: '1 кг', stock: 32, category: 'Овощи' },
  { name: 'Капуста белокочанная', nameEn: 'White Cabbage', price: 1.7, weight: '1 кг', stock: 40, category: 'Овощи' },
  { name: 'Чеснок', nameEn: 'Garlic', price: 6.2, weight: '200 г', stock: 25, category: 'Овощи' },
  { name: 'Свёкла', nameEn: 'Beetroot', price: 1.6, weight: '1 кг', stock: 44, category: 'Овощи' },
  { name: 'Брокколи', nameEn: 'Broccoli', price: 7.4, weight: '500 г', stock: 18, category: 'Овощи' },

  // Фрукты
  { name: 'Яблоки сезонные', nameEn: 'Seasonal Apples', image: 'apples.png', price: 2.8, weight: '1 кг', stock: 60, category: 'Фрукты', isPopular: true },
  { name: 'Бананы', nameEn: 'Bananas', image: 'bananas.png', price: 5.1, weight: '1 кг', stock: 52, category: 'Фрукты' },
  { name: 'Груши конференция', nameEn: 'Conference Pears', price: 6.4, weight: '1 кг', stock: 36, category: 'Фрукты' },
  { name: 'Апельсины', nameEn: 'Oranges', price: 4.5, weight: '1 кг', stock: 42, category: 'Фрукты' },
  { name: 'Мандарины', nameEn: 'Mandarins', price: 5.3, weight: '1 кг', stock: 38, category: 'Фрукты' },
  { name: 'Лимоны', nameEn: 'Lemons', price: 6.8, weight: '500 г', stock: 30, category: 'Фрукты' },
  { name: 'Киви', nameEn: 'Kiwi', price: 7.1, weight: '500 г', stock: 28, category: 'Фрукты' },
  { name: 'Виноград зелёный', nameEn: 'Green Grapes', price: 8.9, weight: '500 г', stock: 22, category: 'Фрукты' },
  { name: 'Персики', nameEn: 'Peaches', price: 7.6, weight: '1 кг', stock: 26, category: 'Фрукты' },
  { name: 'Слива', nameEn: 'Plums', price: 4.2, weight: '1 кг', stock: 34, category: 'Фрукты' },

  // Молочные продукты
  { name: 'Молоко 3.2%', nameEn: 'Milk 3.2%', image: 'milk.png', price: 2.4, weight: '1 л', stock: 30, category: 'Молочные продукты', isPopular: true },
  { name: 'Творог фермерский', nameEn: 'Farm Cottage Cheese', image: 'cottage-cheese.png', price: 4.6, weight: '400 г', stock: 21, category: 'Молочные продукты' },
  { name: 'Йогурт натуральный', nameEn: 'Natural Yogurt', price: 3.3, weight: '350 г', stock: 34, category: 'Молочные продукты' },
  { name: 'Сметана 20%', nameEn: 'Sour Cream 20%', price: 3.8, weight: '400 г', stock: 27, category: 'Молочные продукты' },
  { name: 'Кефир 1%', nameEn: 'Kefir 1%', price: 2.1, weight: '1 л', stock: 29, category: 'Молочные продукты' },
  { name: 'Сыр российский', nameEn: 'Russian Cheese', price: 12.5, weight: '300 г', stock: 19, category: 'Молочные продукты' },
  { name: 'Масло сливочное 82.5%', nameEn: 'Butter 82.5%', price: 8.7, weight: '180 г', stock: 24, category: 'Молочные продукты' },
  { name: 'Ряженка', nameEn: 'Fermented Baked Milk', price: 2.6, weight: '500 мл', stock: 20, category: 'Молочные продукты' },
  { name: 'Сливки 10%', nameEn: 'Cream 10%', price: 3.5, weight: '500 мл', stock: 18, category: 'Молочные продукты' },
  { name: 'Брынза', nameEn: 'Brine Cheese', price: 9.4, weight: '250 г', stock: 16, category: 'Молочные продукты' },

  // Хлеб
  { name: 'Батон пшеничный', nameEn: 'Wheat Loaf', price: 1.8, weight: '400 г', stock: 40, category: 'Хлеб' },
  { name: 'Хлеб бородинский', nameEn: 'Borodinsky Bread', price: 2.3, weight: '500 г', stock: 35, category: 'Хлеб' },
  { name: 'Багет французский', nameEn: 'French Baguette', price: 2.9, weight: '300 г', stock: 28, category: 'Хлеб' },
  { name: 'Лаваш тонкий', nameEn: 'Thin Lavash', price: 2.1, weight: '250 г', stock: 32, category: 'Хлеб' },
  { name: 'Булочки с кунжутом', nameEn: 'Sesame Buns', price: 3.4, weight: '4 шт', stock: 26, category: 'Хлеб' },

  // Напитки
  { name: 'Сок яблочный', nameEn: 'Apple Juice', price: 4.1, weight: '1 л', stock: 28, category: 'Напитки' },
  { name: 'Вода минеральная', nameEn: 'Mineral Water', price: 1.4, weight: '1.5 л', stock: 50, category: 'Напитки' },
  { name: 'Кола газированная', nameEn: 'Cola', price: 3.2, weight: '1.5 л', stock: 36, category: 'Напитки' },
  { name: 'Чай чёрный', nameEn: 'Black Tea', price: 5.5, weight: '100 г', stock: 22, category: 'Напитки' },
  { name: 'Кофе молотый', nameEn: 'Ground Coffee', price: 14.8, weight: '250 г', stock: 15, category: 'Напитки' },
  { name: 'Компот вишнёвый', nameEn: 'Cherry Compote', price: 3.9, weight: '1 л', stock: 24, category: 'Напитки' },
  { name: 'Энергетический напиток', nameEn: 'Energy Drink', price: 4.7, weight: '500 мл', stock: 31, category: 'Напитки' },
  { name: 'Кисель ягодный', nameEn: 'Berry Kissel', price: 2.8, weight: '500 мл', stock: 20, category: 'Напитки' },

  // Мясо
  { name: 'Филе куриное', nameEn: 'Chicken Fillet', price: 11.9, weight: '1 кг', stock: 24, category: 'Мясо', isPopular: true },
  { name: 'Говядина для тушения', nameEn: 'Beef Stew Meat', price: 18.5, weight: '1 кг', stock: 16, category: 'Мясо' },
  { name: 'Свинина корейка', nameEn: 'Pork Loin', price: 15.2, weight: '1 кг', stock: 18, category: 'Мясо' },
  { name: 'Индейка грудка', nameEn: 'Turkey Breast', price: 13.6, weight: '1 кг', stock: 20, category: 'Мясо' },
  { name: 'Фарш говяжий', nameEn: 'Ground Beef', price: 12.8, weight: '500 г', stock: 22, category: 'Мясо' },
  { name: 'Колбаса докторская', nameEn: 'Doctor Sausage', price: 9.9, weight: '400 г', stock: 25, category: 'Мясо' },
  { name: 'Сосиски молочные', nameEn: 'Milk Sausages', price: 7.3, weight: '400 г', stock: 30, category: 'Мясо' },
];

const seedMissingProducts = async () => {
  const productImage = getProductImageUrl();
  const categories = await Category.findAll();
  const categoryByName = Object.fromEntries(categories.map((category) => [category.name, category.id]));
  let added = 0;

  for (const product of getSeedProducts()) {
    const exists = await Product.findOne({ where: { name: product.name } });
    if (exists) {
      continue;
    }

    await Product.create({
      name: product.name,
      nameEn: product.nameEn,
      description: 'Качественный продукт с быстрой доставкой на дом.',
      descriptionEn: 'High-quality product with fast home delivery.',
      imageUrl: productImage(product.image),
      price: product.price,
      weight: product.weight,
      stock: product.stock,
      CategoryId: categoryByName[product.category],
      isPopular: Boolean(product.isPopular),
    });
    added += 1;
  }

  return added;
};

const seedInitialData = async () => {
  const alreadySeeded = await User.findOne({ where: { email: SEED_ADMIN_EMAIL } });
  if (alreadySeeded) {
    return;
  }

  const productImage = getProductImageUrl();

  const customerRole = await Role.create({ name: 'customer' });
  const adminRole = await Role.create({ name: 'admin' });

  await User.create({
    name: 'Администратор',
    email: SEED_ADMIN_EMAIL,
    passwordHash: await bcrypt.hash('admin12345', 10),
    phone: '+375291112233',
    RoleId: adminRole.id,
  });

  await User.create({
    name: 'Покупатель',
    email: 'customer@fresh.test',
    passwordHash: await bcrypt.hash('customer12345', 10),
    phone: '+375292223344',
    RoleId: customerRole.id,
  });

  const categories = ['Овощи', 'Фрукты', 'Молочные продукты', 'Хлеб', 'Напитки', 'Мясо'];
  const categoryByName = {};

  for (const name of categories) {
    const category = await Category.create({ name, description: `Категория ${name}` });
    categoryByName[name] = category.id;
  }

  await Product.bulkCreate(
    getSeedProducts().map((product) => ({
      name: product.name,
      nameEn: product.nameEn,
      description: 'Качественный продукт с быстрой доставкой на дом.',
      descriptionEn: 'High-quality product with fast home delivery.',
      imageUrl: productImage(product.image),
      price: product.price,
      weight: product.weight,
      stock: product.stock,
      CategoryId: categoryByName[product.category],
      isPopular: Boolean(product.isPopular),
    })),
  );
};

module.exports = { seedInitialData, seedMissingProducts };
