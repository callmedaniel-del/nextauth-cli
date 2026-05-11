# 🔐 NextAuth CLI

**Interactive CLI wizard to scaffold NextAuth.js authentication in your Next.js project in seconds!**

[![npm version](https://badge.fury.io/js/nextauth-cli.svg)](https://www.npmjs.com/package/@callmedaniel/nextauth-cli)
[![GitHub license](https://img.shields.io/github/license/callmedaniel-del/nextauth-cli)](https://github.com/callmedaniel-del/nextauth-cli/blob/main/LICENSE)

---

## 🚀 Features

✅ **Interactive Setup Wizard** - Answer a few questions and get your auth system in seconds  
✅ **Multiple Providers** - Google, GitHub, Apple, Facebook, Email Magic Links, Credentials  
✅ **Session Strategies** - JWT (stateless) or Database (stateful)  
✅ **Database Support** - Prisma with PostgreSQL, MySQL, MongoDB, SQLite  
✅ **RBAC** - Role-Based Access Control utilities included  
✅ **Email Verification** - Ready-to-use email verification setup  
✅ **Protected Routes** - Middleware and component examples  
✅ **API Protection** - Utilities to protect API routes  
✅ **Auto-Install** - Optionally auto-install dependencies  

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @callmedaniel/nextauth-cli
```

### Local Installation

```bash
npm install --save-dev @callmedaniel/nextauth-cli
```

---

## 🎯 Quick Start

### 1. Create a Next.js Project

```bash
npx create-next-app@latest my-auth-app
cd my-auth-app
```

### 2. Run the NextAuth CLI

```bash
npx @callmedaniel/nextauth-cli
```

### 3. Answer the Interactive Questions

```
✓ Select authentication providers
✓ Choose session strategy (JWT or Database)
✓ Select database if needed
✓ Setup RBAC?
✓ Setup Email Verification?
✓ Generate protected routes?
✓ Install dependencies?
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your OAuth credentials:

```bash
cp .env.example .env.local
```

### 5. Start Your Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/auth/signin` to see your auth system in action!

---

## 📁 Generated Files

The CLI generates the following structure:

```
app/
├── api/auth/[...nextauth]/
│   └── route.ts                 # NextAuth configuration
├── dashboard/
│   └── page.tsx                 # Protected route example

components/
├── auth/
│   └── SignIn.tsx               # Sign-in component

lib/
├── auth/
│   ├── rbac.ts                  # Role-Based Access Control
│   ├── email-verification.ts    # Email verification utilities
│   └── protectedApi.ts          # API protection utilities

middleware.ts                     # Route protection middleware
prisma/
├── schema.prisma                # Database schema (if DB selected)

.env.example                      # Environment variables template
```

---

## 🔐 Authentication Providers

### Google OAuth
Requires: `GOOGLE_ID`, `GOOGLE_SECRET`

### GitHub OAuth
Requires: `GITHUB_ID`, `GITHUB_SECRET`

### Apple OAuth
Requires: `APPLE_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`

### Facebook OAuth
Requires: `FACEBOOK_ID`, `FACEBOOK_SECRET`

### Email Magic Links
Requires: `EMAIL_SERVER`, `EMAIL_FROM`

### Credentials (Username/Password)
No additional setup required. Implement your own authorization logic.

---

## 🛡️ RBAC (Role-Based Access Control)

The CLI generates RBAC utilities for role-based access control:

```typescript
import { hasPermission, hasRole } from '@/lib/auth/rbac';

// Check if user has a specific permission
if (hasPermission(userRole, 'write:all')) {
  // Allow action
}

// Check if user has a specific role
if (hasRole(userRole, 'admin')) {
  // Admin-only action
}
```

---

## 📧 Email Verification

The CLI includes email verification utilities:

```typescript
import { generateVerificationToken, verifyEmailToken } from '@/lib/auth/email-verification';

// Generate a verification token
const token = generateVerificationToken('user@example.com');

// Verify the token
const result = verifyEmailToken(token);
if (result.valid) {
  console.log('Email verified:', result.email);
}
```

---

## 🔒 Protected Routes

The generated middleware protects routes automatically:

```typescript
// middleware.ts already set up to protect:
// - /dashboard/*
// - /profile/*
// - /admin/*
```

---

## 🛠️ API Route Protection

Protect your API routes:

```typescript
import { requireAuth } from '@/lib/auth/protectedApi';

export async function GET(request) {
  const session = await requireAuth(request);
  if (session instanceof Response) return session; // Unauthorized

  // Your protected API logic
  return Response.json({ message: 'Success' });
}
```

---

## 📚 NextAuth Documentation

For more information about NextAuth.js, visit:
- [NextAuth.js Official Docs](https://next-auth.js.org/)
- [Auth.js Docs](https://authjs.dev/)
- [NextAuth.js Providers](https://next-auth.js.org/providers/)

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

---

## 🙋 Support

If you have questions or issues:

1. Check the [NextAuth.js Documentation](https://next-auth.js.org/)
2. Open an issue on [GitHub](https://github.com/callmedaniel-del/nextauth-cli/issues)
3. Start a discussion on [GitHub Discussions](https://github.com/callmedaniel-del/nextauth-cli/discussions)

---

**Made with ❤️ by [callmedaniel-del](https://github.com/callmedaniel-del)**
