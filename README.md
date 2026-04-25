# GoVigi Produce Ordering App

This repository contains:

- `backend` — Node.js + Express + MongoDB API
- `web` — Next.js retailer portal
- `mobile` — React Native (Expo) retailer app

This project follows the requirements from the task brief: retailer registration/login, product browsing, order placement with delivery date, and order tracking with status badges. The brief asks for a single repository with `/backend`, `/web`, `/mobile`, a seed file, `.env.example` files, and a clear README.

## Features covered

### Backend
- JWT auth with password hashing using bcrypt
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/orders`
- `GET /api/orders`
- Protected routes using Bearer token
- MongoDB product seed script with sample vegetables and fruits
- Order status enum: `Pending`, `Confirmed`, `Delivered`

### Web (Next.js)
- Register / Login pages
- JWT stored in localStorage + cookie for protected routing
- Products page using server-side rendering with cookie token
- Place Order page
- My Orders page with status badges

### Mobile (React Native with Expo)
- Register / Login screen
- JWT stored in AsyncStorage
- Product List with category filter (Veg / Fruit)
- Place Order screen
- My Orders screen with status badges

## 1) Backend setup

### Install dependencies
```bash
cd backend
npm install
```

### Configure environment
Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Example:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/govigi
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
```

### Seed sample products
```bash
npm run seed
```

### Run backend
```bash
npm run dev
```

Backend will run on:
```bash
http://localhost:5000
```

## 2) Web setup

### Install dependencies
```bash
cd web
npm install
```

### Configure environment
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Example:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Run web app
```bash
npm run dev
```

Web app will run on:
```bash
http://localhost:3000
```

## 3) Mobile setup

This app uses Expo.

### Install dependencies
```bash
cd mobile
npm install
```

### Configure environment
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Example:
```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5000/api
```

### Run mobile app
```bash
npm start
```

### API base URL note for mobile
Use the right base URL depending on your device:
- Android emulator: `http://10.0.2.2:5000/api`
- iOS simulator: `http://localhost:5000/api`
- Physical device: `http://YOUR_LOCAL_IP:5000/api`

## Suggested run order
1. Start MongoDB
2. Run backend seed script
3. Start backend server
4. Start web app
5. Start Expo mobile app

## Sample test flow
1. Register a retailer account from web or mobile
2. Login with the same account
3. View products
4. Place an order with quantity and delivery date
5. Open My Orders and check order status badge

## Project structure
```text
govigi-produce-ordering-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── web/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── .env.example
│   └── package.json
├── mobile/
│   ├── App.js
│   ├── .env.example
│   ├── app.json
│   └── package.json
└── README.md
```

