
# Ecommerce Admin Panel

Admin Panel for your Ecommerce website! With our sleek and efficient interface developed using technologies like Next.js 13, Shadcn UI, Prisma ORM, PostgreSQL of Supabase, Tailwind CSS, and TypeScript, managing your online store has never been easier.


## Tech Stack

**Client:** NextJs 13, Typescript, Tailwind CSS, ShadCN

**Databse:** PostGreSQL (Supabase), Prisma (ORM)

**Hosting:** Vercel And Database Supabase


## Features

- Sales Tracking: Keep a close eye on your sales performance with detailed charts and bar graphs that provide real-time insights into your revenue trends. Visualize your sales data to make informed decisions.

- Profit Analysis: Track your profits with precision. Dashboard provides you with interactive graphs to monitor your profitability over time, helping you identify your most profitable products and periods.

- Stock Management: Effortlessly manage your inventory by adding, editing, or removing products from your store. Get a quick overview of stock levels and receive alerts when it's time to restock.

- User Management: Gain control over your user base by managing user accounts. Monitor user registrations and activity to tailor your marketing efforts effectively.

- Order Tracking: Keep tabs on all orders with an intuitive order management system. Quickly view order details statuses to ensure smooth order processing.

- Product Management: Add new products to your catalog, update existing ones, and maintain accurate product information. Easily showcase your products to your customers.


## Connected Website Project

This admin panel is connected to the Ecommerce Website project:

**Website Repository:** https://github.com/krish-7104/ecommercely-website

## Setup Guide

This guide will help you set up the Ecommerce Admin Panel on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (or Supabase account)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/krish-7104/ecommercely-admin
cd ecommercely-admin
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Variables

Copy the `.env.sample` file to create your `.env` file:

```bash
cp .env.sample .env
```

Then open the `.env` file and fill in all the required values:

```env
DATABASE_URL="your_postgresql_connection_string"
SECRET_KEY="your_secret_key_for_jwt"
NODEMAILER_USER="your_email@gmail.com"
NODEMAILER_PASS="your_email_app_password"
NEXT_PUBLIC_CLOUD_NAME="your_cloudinary_cloud_name"
NEXT_PUBLIC_UPLOAD_PRESET="your_cloudinary_upload_preset"
STRIPE_SECRET_KEY="your_stripe_secret_key"
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"
ALLOW_INTERNATIONAL_PAYMENTS="true"
NODE_ENV="development"
```

#### Environment Variables Explained

- **DATABASE_URL**: Your PostgreSQL connection string. If using Supabase, you can find this in your project settings.
  - Format: `postgresql://username:password@host:port/database?schema=public`
  
- **SECRET_KEY**: A secret key used for JWT token generation and encryption. Use a strong, random string.
  
- **NODEMAILER_USER**: Your email address for sending emails (password reset, notifications, etc.)
  
- **NODEMAILER_PASS**: Your email app password. For Gmail, you'll need to generate an app-specific password from your Google Account settings.

- **NEXT_PUBLIC_CLOUD_NAME**: Your Cloudinary cloud name for image uploads. Get this from your Cloudinary dashboard.

- **NEXT_PUBLIC_UPLOAD_PRESET**: Your Cloudinary upload preset name. Create one in your Cloudinary dashboard settings.

- **STRIPE_SECRET_KEY**: Your Stripe secret key for payment processing. Get this from your Stripe dashboard.

- **NEXT_PUBLIC_WEBSITE_URL**: The URL of your connected ecommerce website. Default is `http://localhost:3000` for local development.

- **ALLOW_INTERNATIONAL_PAYMENTS**: Set to `"true"` to allow international payments, or `"false"` to restrict to specific regions.

- **NODE_ENV**: Set to `"development"` for local development or `"production"` for production deployment.

### Step 4: Database Setup

#### Using Prisma

1. Generate Prisma Client:
```bash
npx prisma generate
```

2. Run database migrations:
```bash
npx prisma migrate dev
```

3. (Optional) Open Prisma Studio to view your database:
```bash
npx prisma studio
```

#### Database Schema

The application uses the following main models:
- `AdminUser` - Admin accounts
- `User` - Customer accounts
- `Product` - Product catalog
- `Category` - Product categories
- `Order` - Customer orders
- `Cart` - Shopping carts
- `Logs` - Admin activity logs
- `resetToken` / `resetTokenAdmin` - Password reset tokens

### Step 5: Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Step 6: Build for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

### Additional Configuration

#### Cloudinary Setup (for Image Uploads)

If you're using Cloudinary for image uploads, you may need to configure it in your environment variables. Check the codebase for any Cloudinary-related configuration.

#### Stripe Integration

If you're using Stripe for payments, ensure you have the Stripe API keys configured in your environment variables (if required by the application).

### Troubleshooting

#### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` is correct
   - Ensure your database server is running
   - Check if your IP is whitelisted (for cloud databases like Supabase)

2. **Prisma Client Not Generated**
   - Run `npx prisma generate` after installing dependencies

3. **Port Already in Use**
   - The app runs on port 3001 by default
   - Change the port in `package.json` scripts if needed
   - Or kill the process using port 3001: `lsof -ti:3001 | xargs kill`

4. **Environment Variables Not Loading**
   - Ensure your `.env` file is in the root directory
   - Restart your development server after adding environment variables
   - Never commit `.env` files to version control

### Project Structure

```
ecommercely-admin/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin management pages
│   ├── category/          # Category management
│   ├── orders/            # Order management
│   ├── products/          # Product management
│   └── users/             # User management
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   └── blocks/           # Custom block components
├── lib/                   # Utility libraries
├── prisma/                # Prisma schema and migrations
├── redux/                 # Redux store and reducers
└── public/                # Static assets
```

### Next Steps

1. **Create Your First Admin Account**

   After setting up the database and starting the server, you need to create your first admin account by calling the registration API endpoint. You can do this using curl, Postman, or any HTTP client:

   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin Name",
       "email": "admin@example.com",
       "password": "your-secure-password"
     }'
   ```

   Or using a tool like Postman:
   - **Method:** POST
   - **URL:** `http://localhost:3001/api/auth/register`
   - **Headers:** `Content-Type: application/json`
   - **Body (JSON):**
     ```json
     {
       "name": "Admin Name",
       "email": "admin@example.com",
       "password": "your-secure-password"
     }
     ```

   Once you have created an admin account, you can log in to the admin panel at `http://localhost:3001/login` and use the admin interface to add more admins or manage your store.

2. Configure your email service for password reset functionality
3. Set up your product categories and add products
4. Configure payment gateway (if applicable)

## Feedback

If you have any feedback, please reach out to us at https://krishjotaniya.netlify.app/contactme?ref=Ecommerce%20Admin%20Github

