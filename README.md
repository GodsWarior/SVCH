# Food Delivery Platform

Fullstack coursework project — online grocery delivery platform.

Repository: [https://github.com/GodsWarior/SVCH](https://github.com/GodsWarior/SVCH)

Link to the explanatory note: [Google Docs](https://docs.google.com/document/d/1tJ05PsLDWpG5mH23euK5MMmXgGVCeKex/edit?usp=sharing&ouid=115557660193418079859&rtpof=true&sd=true)

## Stack

- **Frontend:** React, TypeScript, Redux Toolkit, Material UI, Webpack
- **Backend:** Node.js, Express, Sequelize
- **Database:** PostgreSQL
- **API:** REST

## Requirements

- Node.js 18+
- npm 9+
- PostgreSQL 14+

## Project structure

```
├── client/          # React frontend
└── server/          # Express backend
```

## Setup

### 1. Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

Or install separately:

```bash
npm install --prefix client
npm install --prefix server
```

### 2. Create PostgreSQL database

Create a database before starting the server:

```sql
CREATE DATABASE food_delivery;
```

On Windows (psql):

```bash
psql -U postgres -c "CREATE DATABASE food_delivery;"
```

### 3. Configure environment variables

Copy the example env file and edit connection settings:

```bash
copy server\.env.example server\.env
```

On Linux/macOS:

```bash
cp server/.env.example server/.env
```

Example `server/.env`:

```env
PORT=5000
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=change_me_to_a_long_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_delivery
DB_USER=postgres
DB_PASSWORD=postgres
```

Change `DB_USER`, `DB_PASSWORD`, and `JWT_SECRET` to your own values.

### 4. Run migrations (optional)

The server runs `sequelize.sync({ alter: true })` on startup, so migrations are usually not required for local development. If you need to run them manually:

```bash
npm run db:migrate --prefix server
```

## Running the project

### Development (client + server)

From the project root:

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)
- Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Run separately

```bash
npm run dev --prefix server
npm run dev --prefix client
```

### Production build

```bash
npm run build
npm start
```

## Test accounts

After the first server start, seed data is created automatically:

| Role     | Email               | Password       |
|----------|---------------------|----------------|
| Admin    | admin@fresh.test    | admin12345     |
| Customer | customer@fresh.test | customer12345  |

## Product images

Default product images are stored in `server/uploads/products/` and served at `/uploads/products/...`.

Images uploaded through the admin panel are saved on the server. User uploads (timestamped filenames) are excluded from git via `.gitignore`.

## Redux rule

Redux is used for client state only. Server requests are made directly through API services in `client/src/services`, without `createAsyncThunk` or async thunks.

## Useful commands

```bash
npm run lint              # lint client and server
npm run build --prefix client
npm run db:migrate --prefix server
```
