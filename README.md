# Fullstack E-Commerce Project

This is a modern web application built with [Next.js](https://nextjs.org/) using the App Router.

## 🚀 Features

Currently, the application includes the following features:

- **User Authentication**: Secure user registration, login, and profile management using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Product Catalog**: Browse the available products on the platform.
- **Product Details**: View dedicated product pages with detailed descriptions and images.
- **Image Upload & Management**: Integrated with Cloudinary for seamless handling of user/product image uploads.
- **Modern UI**: Styled with Tailwind CSS for a fully responsive and beautiful user interface.
- **Database**: MongoDB (via Mongoose) to handle user data, products, and sessions.

> ⚠️ **Note regarding Payment Integration**
> The Stripe payment integration is currently **in development**. At this stage, users can freely browse the product catalog and view product details, but the checkout and purchasing functionalities are temporarily disabled.

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB & Mongoose
- **Authentication**: Custom JWT based auth
- **Media Storage**: Cloudinary
- **Payments**: Stripe (In Progress)

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to a `.env.local` file:

```env
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET

ACCESS_TOKEN_EXPIRY=YOUR_ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_EXPIRY=YOUR_REFRESH_TOKEN_EXPIRY

# Cloudinary
CLOUDINARY_URL=YOUR_CLOUDINARY_URL

# Stripe (In Development)
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
```
