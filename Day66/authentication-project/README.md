# SecureAuth — Authentication Mini Project (MERN Stack)

Day 66 of #111DaysOfLearningForChange. A complete authentication system: registration, email
verification, JWT-based sessions, password reset, and a protected dashboard — built with
MongoDB, Express, React, and Node.

## Stack

- **Frontend:** React 18, React Router DOM, Axios, Context API, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, Nodemailer

## Folder structure

```
authentication-project/
├── client/                  React frontend (Vite)
│   ├── src/
│   │   ├── pages/           Register, Login, VerifyEmail, ForgotPassword, ResetPassword, Dashboard, Home
│   │   ├── components/      Navbar, ProtectedRoute, LoadingSpinner, FormInput, Alert, AuthLayout, PasswordStrength
│   │   ├── context/         AuthContext.jsx (Context API)
│   │   └── services/        api.js, authService.js
│
├── server/                  Express backend
│   ├── controllers/         authController.js
│   ├── models/               User.js
│   ├── routes/               authRoutes.js
│   ├── middleware/           authMiddleware.js, errorMiddleware.js
│   ├── utils/                 generateToken.js, sendEmail.js
│   ├── config/                db.js
│   └── server.js
│
└── README.md
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB connection string (local MongoDB, or a free Atlas cluster)
- An SMTP account for sending email (Gmail App Password, Mailtrap, or Ethereal for testing)

## 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://localhost:27017/secureauth

JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="SecureAuth <no-reply@secureauth.com>"
```

> Gmail requires an **App Password** (not your regular password) if 2FA is enabled. For quick
> testing without a real inbox, create a free account at https://ethereal.email and use those
> SMTP credentials instead — emails won't actually deliver, but you'll get a preview link in
> the server console output you can open manually.

Run the server:

```bash
npm run dev
```

The API starts on `http://localhost:5000`. Check `GET /api/health` to confirm it's running.

## 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app starts on `http://localhost:5173`.

## 4. API reference

| Method | Route                              | Access  | Description                          |
|--------|-------------------------------------|---------|---------------------------------------|
| POST   | `/api/auth/register`                | Public  | Create account, sends verify email    |
| POST   | `/api/auth/login`                   | Public  | Log in, sets JWT httpOnly cookie      |
| POST   | `/api/auth/logout`                  | Private | Clears auth cookie                    |
| GET    | `/api/auth/verify-email/:token`     | Public  | Verifies email from emailed link      |
| POST   | `/api/auth/resend-verification`     | Public  | Resends verification email            |
| POST   | `/api/auth/forgot-password`         | Public  | Sends password reset email            |
| POST   | `/api/auth/reset-password/:token`   | Public  | Sets a new password                   |
| GET    | `/api/auth/profile`                 | Private | Returns the logged-in user's profile  |

## 5. How the security pieces fit together

- **Password hashing:** bcrypt with 12 salt rounds, applied automatically in a Mongoose
  `pre("save")` hook — plaintext passwords are never stored.
- **JWT sessions:** issued on login, stored in an `httpOnly`, `sameSite=lax` cookie so they
  aren't accessible to JavaScript (mitigates XSS token theft). `protect` middleware verifies
  the token on every request to a private route.
- **Verification & reset tokens:** a random 32-byte token is generated, the *raw* token is
  emailed to the user, and only a SHA-256 *hash* of it is stored in MongoDB. This means a
  database leak alone can't be used to verify accounts or reset passwords. Verification
  tokens expire after 24 hours, reset tokens after 1 hour.
- **Generic forgot-password responses:** the API always returns the same success message
  whether or not the email exists, so the endpoint can't be used to discover which emails
  are registered.

## 6. Implemented bonus features

- ✅ Remember Me checkbox on login
- ✅ Password strength indicator (segmented meter) on register & reset password
- ✅ Resend verification email
- ✅ Inline toast-style alerts with dismiss
- ✅ Loading states on every async action (spinners + disabled buttons)
- ◻ Full light/dark theme toggle — a preview toggle is wired up on the Dashboard card as a
  starting point; extending it app-wide just means adding `dark:` variants (already enabled
  in `tailwind.config.js`) to the remaining components.
- ◻ Full profile update form — `getProfile` is wired end-to-end; a `PUT /api/auth/profile`
  route and an edit form are natural next additions.

## 7. Learning outcomes covered

JWT authentication · password hashing with bcrypt · email verification flow · password
reset flow · protected routes · React Context API · MongoDB user management · full MERN
authentication workflow.
