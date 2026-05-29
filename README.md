<div align="center">

# 🛒 PiMart
### An AI-Integrated E-Commerce Application With Payment Gateway

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge)](https://pi-mart.vercel.app/)
[![GitHub Stars](https://img.shields.io/github/stars/sabbirkhanoni/PiMart-An-AI-Integrated-Ecommerce-Application-With-Payment-Gateway?style=for-the-badge)](https://github.com/sabbirkhanoni/PiMart-An-AI-Integrated-Ecommerce-Application-With-Payment-Gateway/stargazers)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

</div>

---

## 📌 Overview

**PiMart** is a modern, full-stack AI-integrated e-commerce web application that delivers a seamless, scalable, and intelligent online shopping experience. Built with a MERN stack architecture, it supports secure authentication, real-time cart management, AI-assisted chat, dual payment gateway integration (Stripe & SSLCommerz), media uploads via Cloudinary, and transactional email via Resend.

> **Live Demo:** [https://pi-mart.vercel.app/](https://pi-mart.vercel.app)

---

## **The installation guide is provided below, after the User Interface (UI) section.**
<img width="1920" height="3976" alt="screencapture-pi-mart-vercel-app-2026-04-06-01_46_08" src="https://github.com/user-attachments/assets/fc947f70-3ac3-4da2-98c0-7ad24f2fc7bd" />
<img width="1920" height="2043" alt="screencapture-pi-mart-vercel-app-dashboard-category-2026-04-06-02_17_21" src="https://github.com/user-attachments/assets/f0c93277-3376-4839-ae51-161ecdef7785" />
<img width="1920" height="2137" alt="screencapture-pi-mart-vercel-app-dashboard-upload-product-2026-04-06-02_17_45" src="https://github.com/user-attachments/assets/73bbcf86-2ffb-4f14-9235-31dd11e2161d" />
<img width="1920" height="1865" alt="screencapture-pi-mart-vercel-app-dashboard-product-2026-04-06-02_18_18" src="https://github.com/user-attachments/assets/9887e8cb-5ac9-4f66-877e-6bfeb5f9d2ed" />
<img width="1920" height="1443" alt="screencapture-pi-mart-vercel-app-product-Pro-Nature-Atta-6896799d58f5255d2e2e402d-2026-04-06-02_08_50" src="https://github.com/user-attachments/assets/b73a7f19-57f4-4632-83dd-9986457c4ef4" />
<img width="1920" height="1605" alt="screencapture-pi-mart-vercel-app-proceed-2026-04-06-02_12_55" src="https://github.com/user-attachments/assets/c8a579af-92e5-4fed-acb3-7e12eb9fb08b" />
<img width="1904" height="926" alt="Screenshot 2026-04-06 021100" src="https://github.com/user-attachments/assets/94168cf2-be56-4cca-8c9d-ad182aeb2246" />
<img width="1920" height="1605" alt="screencapture-pi-mart-vercel-app-complete-2026-04-06-02_13_13" src="https://github.com/user-attachments/assets/a6507f53-7ce8-4b2b-92b0-ba55288942c8" />


## ✨ Features

### 👤 User Features
-  **Authentication** — Register, Login, Logout with JWT (Access + Refresh tokens)
-  **Product Browsing & Search** — Filter, search, and browse by category
-  **Product Detail Page** — Full product info with images (Cloudinary-hosted)
-  **Cart Management** — Add, remove, update quantities
-  **Delivery Address Management** — Save and manage multiple addresses
-  **Checkout & Payment** — Secure checkout via Stripe or SSLCommerz
-  **Order Management** — View order history and status
-  **Email Notifications** — Order confirmation emails via Resend / SMTP

### 🛠️ Admin Features
-  **Product Management** — Full CRUD (Create, Read, Update, Delete)
-  **Category Management** — Organize products by category
-  **Order Tracking** — View and manage all customer orders


---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Axios, React Router, Redux + Context API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **Authentication** | JWT (Access Token + Refresh Token) |
| **Media Storage** | Cloudinary |
| **Payment (Global)** | Stripe API |
| **Payment (BD)** | SSLCommerz |
| **Email Service** | Resend API + Nodemailer (SMTP) |
| **Deployment** | Vercel (Frontend + Backend) |

---

## 📂 Project Structure

```
PiMart/
│
├── client/                  # Frontend (React.js)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page-level components
│       ├── common/          # Shared utilities/components
│       ├── context/         # React Context providers
│       ├── hook/            # Custom React hooks
│       ├── layout/          # Layout wrappers
│       ├── route/           # Route definitions & guards
│       ├── store/           # State management
│       └── utils/           # Helper functions
│
├── server/                  # Backend (Node.js + Express)
│   ├── controllers/         # Route handler logic
│   ├── models/              # Mongoose schemas
│   ├── route/               # Express route definitions
│   ├── middleware/          # Auth, error, upload middleware
│   └── utils/               # Helper utilities (email, tokens, etc.)
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sabbirkhanoni/PiMart-An-AI-Integrated-Ecommerce-Application-With-Payment-Gateway.git
cd PiMart-An-AI-Integrated-Ecommerce-Application-With-Payment-Gateway
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```properties
# ── App ────────────────────────────────────────
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080
NODE_ENV=dev

# ── Database ───────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pimart

# ── Email (Resend) ─────────────────────────────
RESEND_API=re_xxxxxxxxxxxxxxxxxxxx

# ── JWT Secrets ────────────────────────────────
SECRET_KEY_ACCESS_TOKEN=your_super_secret_access_token_here
SECRET_KEY_REFRESH_TOKEN=your_super_secret_refresh_token_here

# ── Cloudinary ─────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_api_secret

# ── Stripe Payment Gateway ─────────────────────
STRIPE_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# ── SSLCommerz Payment Gateway ─────────────────
STORE_ID=your_sslcommerz_store_id
STORE_PASSWORD=your_sslcommerz_store_password

# ── SMTP / Nodemailer ──────────────────────────
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_gmail@gmail.com
EMAIL_RECEIVER=admin_receiver@gmail.com
```

Start the backend server:

```bash
npm run dev
```

> The backend will start on `http://localhost:8080` by default.

---

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` directory:

```properties
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

Start the frontend:

```bash
npm run dev
```

> The frontend will start on `http://localhost:5173` by default.

---

## 🔐 Environment Variables — Full Reference

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `FRONTEND_URL` | Frontend app URL (for CORS) | `http://localhost:5173` |
| `BACKEND_URL` | Backend server URL | `http://localhost:8080` |
| `NODE_ENV` | Environment mode | `dev` / `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `RESEND_API` | Resend transactional email API key | `re_xxxx` |
| `SECRET_KEY_ACCESS_TOKEN` | JWT access token secret | any long random string |
| `SECRET_KEY_REFRESH_TOKEN` | JWT refresh token secret | any long random string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my_cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET_KEY` | Cloudinary API secret | `abcdefgh` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_xxxx` |
| `STRIPE_WEBHOOK_SECRET_KEY` | Stripe webhook signing secret | `whsec_xxxx` |
| `STORE_ID` | SSLCommerz store ID | `pimart123` |
| `STORE_PASSWORD` | SSLCommerz store password | `pimart123@ssl` |
| `MAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username / Gmail address | `you@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (not your real password) | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | Sender email address | `you@gmail.com` |
| `EMAIL_RECEIVER` | Admin notification receiver | `admin@gmail.com` |

> **📌 Gmail App Password:** Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords) to generate one. 2FA must be enabled.

### Frontend (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_xxxx` |

---

## 💳 Payment Flow

### Stripe
```
User adds products to cart
    → Proceeds to checkout
    → Stripe Checkout Session created on backend
    → User enters card details on Stripe-hosted page
    → Stripe sends webhook event to backend
    → Order saved to MongoDB
    → Confirmation email sent
    → User redirected to success page
```

### SSLCommerz (Bangladesh)
```
User selects SSLCommerz at checkout
    → Payment session initiated with Store ID & Password
    → User redirected to SSLCommerz payment page
    → Payment processed (bKash, Nagad, cards, etc.)
    → Callback received by backend
    → Order saved to MongoDB
    → Confirmation email sent
    → User redirected to success page
```

---

## 🌐 Deployment Guide

### Deploy Backend to Vercel

1. Push your `server/` code to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo.
3. Set **Root Directory** to `server`.
4. Add all environment variables from `server/.env` in the Vercel dashboard.
5. Deploy.

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import same repo.
2. Set **Root Directory** to `client`.
3. Add environment variables:
   - `VITE_API_URL` = your deployed backend URL
   - `VITE_STRIPE_PUBLIC_KEY` = your Stripe public key
4. Deploy.

### Stripe Webhook (Production)

After deploying the backend, register your webhook URL in the Stripe Dashboard:

```
https://your-backend.vercel.app/api/webhook/stripe
```

Select event: `checkout.session.completed`

---

## 🔑 Getting Your API Keys

| Service | How to Get |
|---|---|
| **MongoDB Atlas** | [cloud.mongodb.com](https://cloud.mongodb.com) → Create cluster → Connect → Get URI |
| **Cloudinary** | [cloudinary.com](https://cloudinary.com) → Dashboard → Copy Cloud Name, API Key, Secret |
| **Stripe** | [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys |
| **Stripe Webhook** | Stripe Dashboard → Webhooks → Add Endpoint → Copy signing secret |
| **Resend** | [resend.com](https://resend.com) → API Keys → Create |
| **SSLCommerz** | [developer.sslcommerz.com](https://developer.sslcommerz.com) → Register → Get Store credentials |
| **Gmail App Password** | Google Account → Security → 2-Step Verification → App Passwords |

---

## 🚀 Future Improvements

-  Advanced AI product recommendation system
-  Real-time order tracking with map integration
-  Product reviews & ratings system
-  Admin analytics dashboard
-  Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

Please make sure your code follows the existing style and all features are tested before submitting a PR.

---

## 🐛 Known Issues / Troubleshooting

**MongoDB connection fails:**
> Make sure your IP is whitelisted in MongoDB Atlas → Network Access → Add IP Address (`0.0.0.0/0` for all).

**Stripe webhook not receiving events locally:**
> Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:
> ```bash
> stripe listen --forward-to localhost:8080/api/webhook/stripe
> ```

**Gmail SMTP not working:**
> Make sure 2FA is enabled and you're using an App Password, not your actual Gmail password. Also ensure "Less secure app access" is handled via App Passwords.

**Cloudinary upload fails:**
> Double-check that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET_KEY` are all correct and match your dashboard.

---

## 👨‍💻 Author

**Md Sabbir Khan Oni**

- 🌐 GitHub: [@sabbirkhanoni](https://github.com/sabbirkhanoni)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ⭐ Support

If you found this project useful:

- ⭐ **Star the repo**
-  **Fork it and build on top of it**
-  **Report issues**
-  **Contribute features**

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/sabbirkhanoni">Md Sabbir Khan Oni</a>
</div>
