const chalk = require('chalk');
const { getProviderConfig } = require('./utils');

function generateNextAuthRoute(providers, sessionStrategy) {
  const providerImports = providers
    .map((p) => getProviderConfig(p).import)
    .join('\n');

  const providerConfigs = providers
    .map((p) => `    ${getProviderConfig(p).config}`)
    .join(',\n');

  const strategy = sessionStrategy.includes('JWT') ? 'jwt' : 'database';

  return `import NextAuth from "next-auth";
${providerImports}

export const authOptions = {
  providers: [
${providerConfigs}
  ],
  session: {
    strategy: "${strategy}",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
`;
}

function generateSignInComponent() {
  return `\`use client\`;

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const providers = [
  { name: 'Google', id: 'google', icon: '🔵' },
  { name: 'GitHub', id: 'github', icon: '⬛' },
  { name: 'Apple', id: 'apple', icon: '🍎' },
  { name: 'Facebook', id: 'facebook', icon: '📘' },
];

export default function SignIn() {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">NextAuth</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

        <div className="space-y-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-2xl">{provider.icon}</span>
              <span className="font-semibold">Sign in with {provider.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
\``;
}

function generateDashboard() {
  return `\`use client\`;

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name || session?.user?.email}!</h2>
          <div className="space-y-4">
            <p className="text-gray-600">Email: {session?.user?.email}</p>
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
\``;
}

function generateRbacUtils() {
  return `// Role-Based Access Control Utilities

export const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
};

export const ROLE_PERMISSIONS = {
  admin: ['read:all', 'write:all', 'delete:all', 'manage:users', 'manage:roles'],
  moderator: ['read:all', 'write:own', 'delete:own', 'manage:comments'],
  user: ['read:own', 'write:own', 'delete:own'],
};

export function hasPermission(userRole, requiredPermission) {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  if (permissions.includes('*')) return true;
  return permissions.includes(requiredPermission);
}

export function hasRole(userRole, requiredRole) {
  return userRole === requiredRole;
}

export function hasAnyRole(userRole, requiredRoles) {
  return requiredRoles.includes(userRole);
}

export function getRoleLevel(role) {
  const levels = {
    admin: 3,
    moderator: 2,
    user: 1,
  };
  return levels[role] || 0;
}
`;
}

function generateEmailVerification() {
  return `// Email Verification Utilities

import crypto from 'crypto';

// In production, store these in a database
const verificationTokens = new Map();

export function generateVerificationToken(email) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  verificationTokens.set(token, {
    email,
    expiresAt,
    verified: false,
  });
  
  return token;
}

export function verifyEmailToken(token) {
  const record = verificationTokens.get(token);
  
  if (!record) return { valid: false, message: 'Invalid token' };
  if (new Date() > record.expiresAt) return { valid: false, message: 'Token expired' };
  
  record.verified = true;
  return { valid: true, email: record.email };
}

export function getVerificationEmailTemplate(name, verificationUrl) {
  return \`
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h1>Verify Your Email</h1>
        <p>Hi \${name},</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="\${verificationUrl}" style="padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this verification, you can safely ignore this email.</p>
      </body>
    </html>
  \`;
}
`;
}

function generateProtectedApi() {
  return `// Protected API Route Utilities

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return session;
}

export async function requireRole(request, requiredRole) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Assuming role is stored in session.user.role
  if (session.user.role !== requiredRole) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return session;
}
`;
}

function generateMiddleware() {
  return `import { withAuth } from 'next-auth/middleware';

export const middleware = withAuth(
  function middleware(req) {
    return req;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*'],
};
`;
}

function generateEnvExample(providers) {
  let env = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Database (if using database sessions)
DATABASE_URL=postgresql://user:password@localhost:5432/nextauth

# Providers\n`;

  providers.forEach((provider) => {
    const config = getProviderConfig(provider);
    env += `\n# ${provider}\n`;
    env += config.env + '\n';
  });

  return env;
}

function generatePrismaSchema(database) {
  const dbMap = {
    'Prisma + PostgreSQL': 'postgresql',
    'Prisma + MySQL': 'mysql',
    'Prisma + MongoDB': 'mongodb',
    'Prisma + SQLite': 'sqlite',
  };

  const provider = dbMap[database] || 'postgresql';

  return `// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
`;
}

module.exports = {
  generateNextAuthRoute,
  generateSignInComponent,
  generateDashboard,
  generateRbacUtils,
  generateEmailVerification,
  generateProtectedApi,
  generateMiddleware,
  generateEnvExample,
  generatePrismaSchema,
};
