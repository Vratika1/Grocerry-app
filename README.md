# 🛒 GreenCart - Modern Grocery E-Commerce Platform

<div align="center">

![GreenCart Banner](https://img.shields.io/badge/GreenCart-Fresh%20Groceries%20Delivered-22c55e?style=for-the-badge&logo=shopify&logoColor=white)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=flat-square&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

**A full-stack grocery delivery application with real-time cart sync, Stripe payments, email notifications, and seller dashboard.**

[🚀 Live Demo](#) • [📖 Documentation](#-api-reference) • [🐛 Report Bug](../../issues) • [✨ Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🔧 Environment Variables](#-environment-variables)
- [🔄 Application Flow](#-application-flow)
- [📡 API Reference](#-api-reference)
- [📧 Email System](#-email-system)
- [💳 Payment Integration](#-payment-integration)
- [🛒 Cart System](#-cart-system)
- [👨‍💼 Seller Dashboard](#-seller-dashboard)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

### 🛍️ Customer Features
| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure JWT-based login/register with HTTP-only cookies |
| **Product Browsing** | Browse products by categories with search functionality |
| **Smart Cart** | Cart syncs to MongoDB when logged in, localStorage for guests |
| **Cart Merging** | Guest cart merges with account cart on login |
| **Multiple Addresses** | Save and manage multiple delivery addresses |
| **Dual Payment** | Pay via Cash on Delivery (COD) or Stripe online payment |
| **Order Tracking** | Track order status from placed to delivered |
| **Price Drop Alerts** | Email notifications when cart items get discounted |

### 👨‍💼 Seller/Admin Features
| Feature | Description |
|---------|-------------|
| **Seller Dashboard** | Dedicated admin panel for product management |
| **Add Products** | Upload products with multiple images via Cloudinary |
| **Edit Products** | Update product details with price drop notifications |
| **Stock Management** | Toggle product availability with one click |
| **Order Management** | View and update order statuses |

### 📧 Automated Emails
- ✅ Welcome email on signup
- ✅ Order confirmation email
- ✅ Payment success email (Stripe)
- ✅ Price drop notifications

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   React Client  │◄───────►│  Express Server │◄───────►│    MongoDB      │
│   (Vite + TW)   │  REST   │   (Node.js)     │         │    Atlas        │
│                 │   API   │                 │         │                 │
└────────┬────────┘         └────────┬────────┘         └─────────────────┘
         │                           │
         │                           ├──────────► Cloudinary (Images)
         │                           │
         │                           ├──────────► Stripe (Payments)
         │                           │
         └───────────────────────────┴──────────► Nodemailer (Emails)
```

### Request Flow
```
User Action → React Component → Context API → Axios Request → Express Route 
    → Middleware (Auth) → Controller → MongoDB → Response → Update UI
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Library |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client |
| **React Hot Toast** | Notifications |
| **Context API** | State management |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Multer** | File upload handling |
| **Cloudinary** | Image storage & CDN |
| **Stripe** | Payment processing |
| **Nodemailer** | Email service |

---

## 📁 Project Structure

```
📦 GreenCart
├── 📂 client/                    # React Frontend
│   ├── 📂 public/                # Static assets
│   ├── 📂 src/
│   │   ├── 📂 assets/            # Images & asset exports
│   │   ├── 📂 components/        # Reusable components
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── Login.jsx         # Auth modal
│   │   │   ├── ProductCard.jsx   # Product display card
│   │   │   ├── Loading.jsx       # Payment verification loader
│   │   │   └── 📂 seller/        # Seller-specific components
│   │   ├── 📂 context/
│   │   │   └── AppContext.jsx    # Global state management
│   │   ├── 📂 pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── AllProduct.jsx    # Product listing
│   │   │   ├── ProductDetails.jsx # Single product view
│   │   │   ├── Cart.jsx          # Shopping cart
│   │   │   ├── AddAddress.jsx    # Address form
│   │   │   ├── MyOrders.jsx      # Order history
│   │   │   └── 📂 seller/        # Seller dashboard pages
│   │   │       ├── SellerLayout.jsx
│   │   │       ├── AddProduct.jsx
│   │   │       ├── ProductList.jsx  # With edit modal
│   │   │       └── Orders.jsx
│   │   ├── App.jsx               # Route definitions
│   │   └── main.jsx              # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── 📂 server/                    # Express Backend
│   ├── 📂 configs/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── cloudinary.js         # Cloudinary setup
│   │   ├── multer.js             # File upload config
│   │   └── email.js              # Nodemailer transporter
│   ├── 📂 controllers/
│   │   ├── userController.js     # Auth & user logic
│   │   ├── productController.js  # Product CRUD
│   │   ├── cartController.js     # Cart operations
│   │   ├── orderController.js    # Order management
│   │   ├── addressController.js  # Address CRUD
│   │   └── sellerController.js   # Seller auth
│   ├── 📂 middlewares/
│   │   ├── authUser.js           # User JWT verification
│   │   └── authSeller.js         # Seller JWT verification
│   ├── 📂 models/
│   │   ├── User.js               # User schema (with cart)
│   │   ├── Product.js            # Product schema
│   │   ├── Order.js              # Order schema
│   │   └── Address.js            # Address schema
│   ├── 📂 routes/
│   │   ├── userRoute.js
│   │   ├── productRoute.js
│   │   ├── cartRoute.js
│   │   ├── orderRoute.js
│   │   ├── addressRoute.js
│   │   └── sellerRoute.js
│   ├── 📂 templates/
│   │   └── 📂 emails/            # HTML email templates
│   │       ├── welcome.html
│   │       ├── order-confirmation.html
│   │       ├── payment-success.html
│   │       └── price-drop.html
│   ├── server.js                 # Express app entry
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account
- Stripe account
- SMTP email service (Hostinger, Gmail, etc.)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/greencart.git
cd greencart
```

### 2️⃣ Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3️⃣ Configure Environment Variables
Create `.env` file in `/server` directory (see [Environment Variables](#-environment-variables))

### 4️⃣ Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5️⃣ Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **Seller Dashboard:** http://localhost:5173/seller

---

## 🔧 Environment Variables

Create a `.env` file in the `/server` directory:

```env
# ═══════════════════════════════════════════════════════════
#                    SERVER CONFIGURATION
# ═══════════════════════════════════════════════════════════
PORT=4000
NODE_ENV=development

# ═══════════════════════════════════════════════════════════
#                    DATABASE
# ═══════════════════════════════════════════════════════════
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart

# ═══════════════════════════════════════════════════════════
#                    AUTHENTICATION
# ═══════════════════════════════════════════════════════════
SECRET_KEY=your-super-secret-jwt-key-here
SELLER_EMAIL=admin@yourdomain.com
SELLER_PASSWORD=your-secure-admin-password

# ═══════════════════════════════════════════════════════════
#                    CLOUDINARY (Image Upload)
# ═══════════════════════════════════════════════════════════
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ═══════════════════════════════════════════════════════════
#                    STRIPE (Payments)
# ═══════════════════════════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...    # For webhook verification

# ═══════════════════════════════════════════════════════════
#                    EMAIL (SMTP)
# ═══════════════════════════════════════════════════════════
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@yourdomain.com
SMTP_PASS=your-email-password

# ═══════════════════════════════════════════════════════════
#                    FRONTEND URL
# ═══════════════════════════════════════════════════════════
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `/client` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

---

## 🔄 Application Flow

### 🔐 Authentication Flow
```
┌──────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    POST /api/user/register    ┌─────────────────┐  │
│  │  User   │ ─────────────────────────────►│  Create User    │  │
│  │ Signup  │                               │  Hash Password  │  │
│  └─────────┘                               │  Send Welcome   │  │
│                                            │  Email          │  │
│                                            └────────┬────────┘  │
│                                                     │           │
│                                                     ▼           │
│                                            ┌─────────────────┐  │
│  ┌─────────┐    POST /api/user/login       │  Verify User    │  │
│  │  User   │ ─────────────────────────────►│  Compare Pass   │  │
│  │  Login  │                               │  Generate JWT   │  │
│  └─────────┘                               └────────┬────────┘  │
│                                                     │           │
│                                                     ▼           │
│                                            ┌─────────────────┐  │
│                                            │ Set HTTP-Only   │  │
│                                            │ Cookie (7 days) │  │
│                                            └────────┬────────┘  │
│                                                     │           │
│                                                     ▼           │
│                                            ┌─────────────────┐  │
│  ┌─────────┐    GET /api/user/is-auth      │  Verify Token   │  │
│  │  Every  │ ─────────────────────────────►│  Return User    │  │
│  │ Refresh │                               │  + Cart Data    │  │
│  └─────────┘                               └─────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 🛒 Cart System Flow
```
┌──────────────────────────────────────────────────────────────────┐
│                       CART SYSTEM                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    GUEST USER                               │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │   Add to Cart ──► Update State ──► Save to localStorage    │ │
│  │                                    (key: 'guestCart')       │ │
│  │                                                             │ │
│  │   On Login ──► Merge with DB Cart ──► Clear localStorage   │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                  LOGGED-IN USER                             │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │   Add to Cart ──► Update State ──► POST /api/cart/update   │ │
│  │                                    (sync to MongoDB)        │ │
│  │                                                             │ │
│  │   On Logout ──► Cart stays in MongoDB                      │ │
│  │   On Re-login ──► Cart restored from MongoDB               │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    CART MERGE                               │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │   Guest Cart: [{productId: A, qty: 2}]                     │ │
│  │   DB Cart:    [{productId: A, qty: 1}, {productId: B, qty: 3}]│
│  │                        ▼                                    │ │
│  │   Merged:     [{productId: A, qty: 3}, {productId: B, qty: 3}]│
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 💳 Order & Payment Flow
```
┌──────────────────────────────────────────────────────────────────┐
│                      ORDER FLOW                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐                                                    │
│  │  Cart   │                                                    │
│  │  Page   │                                                    │
│  └────┬────┘                                                    │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────────────────┐                    │
│  │  Select/Add Delivery Address            │                    │
│  └─────────────────────────────────────────┘                    │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────────────────┐                    │
│  │  Choose Payment Method                  │                    │
│  └──────────────┬──────────────────────────┘                    │
│                 │                                                │
│        ┌────────┴────────┐                                      │
│        ▼                 ▼                                      │
│  ┌───────────┐    ┌─────────────┐                               │
│  │    COD    │    │   STRIPE    │                               │
│  └─────┬─────┘    └──────┬──────┘                               │
│        │                 │                                       │
│        ▼                 ▼                                       │
│  ┌───────────┐    ┌─────────────┐                               │
│  │  Create   │    │  Create     │                               │
│  │  Order    │    │  Checkout   │                               │
│  │  isPaid:  │    │  Session    │                               │
│  │  false    │    └──────┬──────┘                               │
│  └─────┬─────┘           │                                       │
│        │                 ▼                                       │
│        │          ┌─────────────┐                               │
│        │          │  Redirect   │                               │
│        │          │  to Stripe  │                               │
│        │          └──────┬──────┘                               │
│        │                 │                                       │
│        │                 ▼                                       │
│        │          ┌─────────────┐     ┌─────────────┐           │
│        │          │  Payment    │────►│  Redirect   │           │
│        │          │  Complete   │     │  to Loader  │           │
│        │          └─────────────┘     └──────┬──────┘           │
│        │                                     │                   │
│        │                                     ▼                   │
│        │                              ┌─────────────┐           │
│        │                              │  Verify     │           │
│        │                              │  Payment    │           │
│        │                              │  with Stripe│           │
│        │                              │  API        │           │
│        │                              └──────┬──────┘           │
│        │                                     │                   │
│        │                                     ▼                   │
│        │                              ┌─────────────┐           │
│        │                              │  Update     │           │
│        │                              │  Order      │           │
│        │                              │  isPaid:true│           │
│        │                              └──────┬──────┘           │
│        │                                     │                   │
│        ▼                                     ▼                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │           SEND CONFIRMATION EMAIL               │            │
│  └─────────────────────────────────────────────────┘            │
│                         │                                        │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────────┐            │
│  │              MY ORDERS PAGE                     │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📡 API Reference

### 🔐 User Routes (`/api/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Create new user account |
| `POST` | `/login` | ❌ | Login & get JWT cookie |
| `POST` | `/logout` | ✅ | Clear auth cookie |
| `GET` | `/is-auth` | ✅ | Verify auth & get user data |

### 📦 Product Routes (`/api/product`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/list` | ❌ | Get all products |
| `GET` | `/id` | ❌ | Get product by ID |
| `POST` | `/add` | 🔒 Seller | Add new product |
| `POST` | `/update` | 🔒 Seller | Update product (triggers price drop emails) |
| `POST` | `/stock` | 🔒 Seller | Toggle product stock status |

### 🛒 Cart Routes (`/api/cart`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/update` | ✅ | Sync cart to database |
| `POST` | `/merge` | ✅ | Merge guest cart with DB cart |

### 📍 Address Routes (`/api/address`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/add` | ✅ | Add new address |
| `GET` | `/get` | ✅ | Get user's addresses |

### 🧾 Order Routes (`/api/order`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/cod` | ✅ | Place COD order |
| `POST` | `/stripe` | ✅ | Create Stripe checkout session |
| `POST` | `/verify-stripe` | ✅ | Verify Stripe payment |
| `GET` | `/user` | ✅ | Get user's orders |
| `GET` | `/seller` | 🔒 Seller | Get all orders |

### 👨‍💼 Seller Routes (`/api/seller`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/login` | ❌ | Seller login |
| `GET` | `/is-auth` | 🔒 Seller | Verify seller session |

---

## 📧 Email System

### Email Templates Location
```
server/templates/emails/
├── welcome.html           # Sent on user registration
├── order-confirmation.html # Sent when order is placed
├── payment-success.html    # Sent after Stripe payment
└── price-drop.html         # Sent when cart item price drops
```

### Template Variables
Templates use `{{variableName}}` syntax for dynamic content:

| Template | Variables |
|----------|-----------|
| **welcome.html** | `userName`, `frontendUrl` |
| **order-confirmation.html** | `userName`, `orderId`, `paymentType`, `paymentStatus`, `orderDate`, `itemsHtml`, `totalAmount`, `frontendUrl` |
| **payment-success.html** | `userName`, `amount`, `orderId`, `paymentDate`, `frontendUrl` |
| **price-drop.html** | `userName`, `productName`, `productImage`, `oldPrice`, `newPrice`, `savings`, `frontendUrl` |

### Email Functions
```javascript
import { 
  sendWelcomeEmail,           // (user)
  sendOrderConfirmationEmail, // (user, order, items)
  sendPaymentSuccessEmail,    // (user, order)
  sendPriceDropEmail          // (user, product, oldPrice, newPrice)
} from './configs/email.js';
```

---

## 💳 Payment Integration

### Stripe Setup

1. **Get API Keys** from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

2. **Configure Webhook** (for production):
   - Endpoint: `https://yourdomain.com/stripe`
   - Events: `checkout.session.completed`

3. **Payment Flow**:
   ```
   Cart → Stripe Checkout → Payment → Redirect to /loader → Verify → My Orders
   ```

### Test Cards
| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 3220` | 3D Secure required |

---

## 👨‍💼 Seller Dashboard

### Access
- URL: `/seller`
- Login with credentials from `.env` (`SELLER_EMAIL` & `SELLER_PASSWORD`)

### Features

| Page | Functionality |
|------|---------------|
| **Add Product** | Upload product with images, set prices, category |
| **Product List** | View all products, toggle stock, **edit products** |
| **Orders** | View all customer orders, update status |

### Product Edit Modal
When editing a product:
- ✏️ Update name, description, category, prices
- 📧 If offer price is **decreased**, all users with that product in cart receive a **Price Drop Alert** email

---

## 🚀 Deployment

### Vercel Deployment

#### Backend (`/server`)
```json
// vercel.json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/server.js" }
  ]
}
```

#### Frontend (`/client`)
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Environment Setup for Production
- Set `NODE_ENV=production`
- Update `FRONTEND_URL` to your Vercel domain
- Configure Stripe webhook with production endpoint
- Ensure CORS allows your frontend domain

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Your Name]**

⭐ Star this repo if you find it helpful!

</div>
