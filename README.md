# GreenCart - Grocery Store E-commerce Platform

A full-stack grocery store e-commerce application built with MERN stack.

## Features

### User Features
- User registration and authentication
- Browse products by categories
- Add products to cart
- Place orders with delivery address
- Track order status
- Rate and review products
- View order history
- Profile management

### Seller Features
- Seller dashboard
- Add/Edit/Delete products
- Manage product inventory
- View and manage orders
- Date-wise order filtering

### Admin Features
- Admin dashboard with statistics
- Manage categories
- Manage products
- Manage delivery persons
- Manage orders (approve/reject/assign delivery)
- Manage users (block/delete)
- View all ratings and reviews

## Tech Stack

**Frontend:**
- React
- React Router
- Axios
- React Toastify

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Upload)
- Stripe (Payment Integration)

## Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd Grocary
```

2. Install dependencies for server
```bash
cd server
npm install
```

3. Install dependencies for client
```bash
cd ../client
npm install
```

4. Create `.env` file in server directory (use `.env.example` as template)

5. Run the application

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run dev
```

## Environment Variables

See `.env.example` file for required environment variables.

## Default Credentials

**Admin:**
- Email: admin@example.com
- Password: admin123

**Seller:**
- Email: seller@example.com
- Password: greatstack123

## License

MIT