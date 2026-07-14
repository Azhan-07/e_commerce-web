# KING - Premium Clothing E-Commerce

A modern, full-stack e-commerce platform for premium clothing built with React, Node.js, Express, and MongoDB.

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, React Hot Toast, React Icons

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, Helmet, Rate Limiting

## Features

- Modern UI with Dark/Light mode
- Fully responsive design
- Product catalog with search, filter, and sort
- Shopping cart with quantity management
- Checkout with shipping form
- User authentication (JWT)
- Admin panel (CRUD products, manage orders/users)
- Product reviews and ratings
- Wishlist and recently viewed products
- Newsletter subscription
- Seed data with 30 demo products

## Prerequisites

- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

Create `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/king-clothing
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Seed Database

```bash
cd server
npm run seed
```

### 4. Run the App

Open two terminals:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Demo Accounts

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@king.com   | admin123  |
| User  | john@example.com | john123   |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `GET /api/auth/users` - Get all users (admin)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add review (protected)

### Cart
- `GET /api/cart` - Get cart (protected)
- `POST /api/cart` - Add to cart (protected)
- `PUT /api/cart/:id` - Update quantity (protected)
- `DELETE /api/cart/:id` - Remove item (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - My orders (protected)
- `GET /api/orders` - All orders (admin)
- `PUT /api/orders/:id` - Update status (admin)

## Project Structure

```
king/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable components
│       ├── context/         # Auth, Cart, Theme context
│       ├── hooks/
│       ├── pages/           # Page components
│       └── utils/           # API helper
├── server/                  # Express backend
│   ├── config/              # DB config
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth, error, upload
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── uploads/             # Product images
│   ├── seeder.js            # Seed data
│   └── server.js            # Entry point
└── README.md
```
