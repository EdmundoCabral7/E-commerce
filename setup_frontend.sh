#!/usr/bin/env bash

# =============================================================================
# Next.js SaaS Boilerplate Setup
# Stack: Next.js 15 (App Router) + Tailwind + shadcn/ui + NextAuth.js
#        + Prisma + PostgreSQL + Stripe + Zustand + TanStack Query
#        + React Hook Form + Zod + Axios
# Deploy target: Vercel
# =============================================================================

set -e

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()    { echo -e "${CYAN}[setup]${NC} $1"; }
success(){ echo -e "${GREEN}[✔]${NC} $1"; }
warn()   { echo -e "${YELLOW}[!]${NC} $1"; }
error()  { echo -e "${RED}[✘]${NC} $1"; exit 1; }
section(){ echo -e "\n${BOLD}${BLUE}▸ $1${NC}"; }

# ── Project name ──────────────────────────────────────────────────────────────
echo -e "${BOLD}${CYAN}"
echo "  ╔═══════════════════════════════════════╗"
echo "  ║   Next.js SaaS Boilerplate Setup      ║"
echo "  ╚═══════════════════════════════════════╝"
echo -e "${NC}"

read -rp "$(echo -e "${BOLD}Project name:${NC} ")" PROJECT_NAME
PROJECT_NAME="${PROJECT_NAME:-my-saas-app}"
PROJECT_DIR="$(pwd)/$PROJECT_NAME"

log "Creating project: ${BOLD}$PROJECT_NAME${NC}"

# ── Check required tools ──────────────────────────────────────────────────────
section "Checking requirements"

command -v node  >/dev/null 2>&1 || error "Node.js is not installed. Install it from https://nodejs.org"
command -v npm   >/dev/null 2>&1 || error "npm is not installed."
command -v git   >/dev/null 2>&1 || error "git is not installed."

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  error "Node.js 18+ is required. Current: $(node -v)"
fi

success "Node.js $(node -v) — OK"
success "npm $(npm -v) — OK"

# ── Detect package manager ────────────────────────────────────────────────────
section "Package manager"
if command -v pnpm >/dev/null 2>&1; then
  PM="pnpm"
elif command -v yarn >/dev/null 2>&1; then
  PM="yarn"
else
  PM="npm"
fi
success "Using: ${BOLD}$PM${NC}"

# ── Create Next.js app ────────────────────────────────────────────────────────
section "Creating Next.js 15 app"
npx create-next-app@latest "$PROJECT_NAME" \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git \
  --yes

cd "$PROJECT_DIR"
success "Next.js app created"

# ── Install dependencies ──────────────────────────────────────────────────────
section "Installing dependencies"

# Auth
log "Installing NextAuth.js..."
$PM add next-auth@beta

# Database / ORM
log "Installing Prisma..."
$PM add @prisma/client
$PM add -D prisma

# Stripe
log "Installing Stripe..."
$PM add stripe @stripe/stripe-js

# State & data fetching
log "Installing Zustand + TanStack Query..."
$PM add zustand @tanstack/react-query @tanstack/react-query-devtools

# Forms & validation
log "Installing React Hook Form + Zod..."
$PM add react-hook-form @hookform/resolvers zod

# HTTP client
log "Installing Axios..."
$PM add axios

# Utilities
log "Installing utility libs..."
$PM add clsx tailwind-merge lucide-react date-fns

success "All dependencies installed"

# ── shadcn/ui ─────────────────────────────────────────────────────────────────
section "Initializing shadcn/ui"
npx shadcn@latest init --yes --defaults

log "Adding shadcn/ui components..."
npx shadcn@latest add button input label card badge avatar \
  dropdown-menu dialog sheet toast form select textarea \
  separator skeleton --yes

success "shadcn/ui components added"

# ── Prisma init ───────────────────────────────────────────────────────────────
section "Setting up Prisma"
npx prisma init --datasource-provider postgresql

success "Prisma initialized"

# ── Folder structure ──────────────────────────────────────────────────────────
section "Creating folder structure"

mkdir -p \
  src/app/\(auth\)/login \
  src/app/\(auth\)/register \
  src/app/\(auth\)/forgot-password \
  src/app/\(dashboard\)/dashboard \
  src/app/\(dashboard\)/settings \
  src/app/\(dashboard\)/billing \
  src/app/\(marketing\) \
  src/app/api/auth/\[...nextauth\] \
  src/app/api/stripe/webhook \
  src/app/api/stripe/checkout \
  src/components/ui \
  src/components/layout \
  src/components/auth \
  src/components/dashboard \
  src/components/shared \
  src/lib \
  src/hooks \
  src/store \
  src/services \
  src/types \
  src/utils \
  src/config \
  src/styles \
  prisma/migrations

success "Folder structure created"

# ── Core files ────────────────────────────────────────────────────────────────
section "Writing core files"

# ── prisma/schema.prisma ──────────────────────────────────────────────────────
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  subscription  Subscription?
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Subscription {
  id                 String             @id @default(cuid())
  userId             String             @unique
  stripeCustomerId   String?            @unique
  stripeSubId        String?            @unique
  stripePriceId      String?
  stripeCurrentPeriodEnd DateTime?
  status             SubscriptionStatus @default(INACTIVE)
  plan               Plan               @default(FREE)
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Role {
  USER
  ADMIN
}

enum SubscriptionStatus {
  ACTIVE
  INACTIVE
  PAST_DUE
  CANCELED
  TRIALING
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}
EOF

# ── src/lib/prisma.ts ─────────────────────────────────────────────────────────
cat > src/lib/prisma.ts << 'EOF'
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
EOF

# ── src/lib/auth.ts ───────────────────────────────────────────────────────────
cat > src/lib/auth.ts << 'EOF'
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: implement your credentials logic here
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
EOF

# ── src/app/api/auth/[...nextauth]/route.ts ───────────────────────────────────
cat > "src/app/api/auth/[...nextauth]/route.ts" << 'EOF'
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
EOF

# ── src/lib/stripe.ts ─────────────────────────────────────────────────────────
cat > src/lib/stripe.ts << 'EOF'
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});
EOF

# ── src/config/stripe.ts ──────────────────────────────────────────────────────
cat > src/config/stripe.ts << 'EOF'
export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: ["Up to 3 projects", "Basic support"],
  },
  PRO: {
    name: "Pro",
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    features: ["Unlimited projects", "Priority support", "Advanced analytics"],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    features: ["Everything in Pro", "SLA", "Dedicated support", "Custom integrations"],
  },
} as const;
EOF

# ── src/app/api/stripe/checkout/route.ts ─────────────────────────────────────
cat > src/app/api/stripe/checkout/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await req.json();

  let subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  let customerId = subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name ?? undefined,
    });
    customerId = customer.id;

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, stripeCustomerId: customerId },
      update: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
EOF

# ── src/app/api/stripe/webhook/route.ts ───────────────────────────────────────
cat > src/app/api/stripe/webhook/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data: {
          stripeSubId: sub.id,
          stripePriceId: sub.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
          status: sub.status.toUpperCase() as any,
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data: { status: "CANCELED", plan: "FREE" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
EOF

# ── src/lib/axios.ts ──────────────────────────────────────────────────────────
cat > src/lib/axios.ts << 'EOF'
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL + "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
EOF

# ── src/store/auth.store.ts ───────────────────────────────────────────────────
cat > src/store/auth.store.ts << 'EOF'
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "auth-storage" }
  )
);
EOF

# ── src/store/ui.store.ts ─────────────────────────────────────────────────────
cat > src/store/ui.store.ts << 'EOF'
import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
EOF

# ── src/lib/query-client.ts ───────────────────────────────────────────────────
cat > src/lib/query-client.ts << 'EOF'
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
EOF

# ── src/components/layout/providers.tsx ──────────────────────────────────────
cat > src/components/layout/providers.tsx << 'EOF'
"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
EOF

# ── src/app/layout.tsx ────────────────────────────────────────────────────────
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "My SaaS App",
    template: "%s | My SaaS App",
  },
  description: "Your SaaS description here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
EOF

# ── src/app/(marketing)/page.tsx ──────────────────────────────────────────────
cat > "src/app/(marketing)/page.tsx" << 'EOF'
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-bold tracking-tight">
        Welcome to <span className="text-primary">My SaaS App</span>
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Your boilerplate is ready. Start building something great.
      </p>
    </main>
  );
}
EOF

# ── src/app/(dashboard)/dashboard/page.tsx ───────────────────────────────────
cat > "src/app/(dashboard)/dashboard/page.tsx" << 'EOF'
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Welcome back, {session.user?.name ?? session.user?.email}
      </p>
    </div>
  );
}
EOF

# ── src/app/(auth)/login/page.tsx ─────────────────────────────────────────────
cat > "src/app/(auth)/login/page.tsx" << 'EOF'
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
EOF

# ── src/components/auth/login-form.tsx ───────────────────────────────────────
cat > src/components/auth/login-form.tsx << 'EOF'
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (res?.ok) router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Continue with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
EOF

# ── src/types/index.ts ────────────────────────────────────────────────────────
cat > src/types/index.ts << 'EOF'
export type { Session, User } from "next-auth";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export type Plan = "FREE" | "PRO" | "ENTERPRISE";
export type Role = "USER" | "ADMIN";

export interface Subscription {
  id: string;
  plan: Plan;
  status: string;
  stripeCurrentPeriodEnd?: Date | null;
}
EOF

# ── src/utils/cn.ts ───────────────────────────────────────────────────────────
cat > src/utils/cn.ts << 'EOF'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF

# ── src/hooks/use-subscription.ts ────────────────────────────────────────────
cat > src/hooks/use-subscription.ts << 'EOF'
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Subscription } from "@/types";

export function useSubscription() {
  return useQuery<Subscription>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await api.get("/subscription");
      return data;
    },
  });
}
EOF

# ── src/config/site.ts ────────────────────────────────────────────────────────
cat > src/config/site.ts << 'EOF'
export const siteConfig = {
  name: "My SaaS App",
  description: "Your SaaS description here",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  links: {
    github: "https://github.com/your-org/your-repo",
  },
  nav: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Billing",   href: "/billing" },
    { title: "Settings",  href: "/settings" },
  ],
};
EOF

# ── .env.local ────────────────────────────────────────────────────────────────
cat > .env.local << 'EOF'
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# NextAuth
AUTH_SECRET="your-auth-secret-here"
AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=
EOF

# ── .env.example (safe to commit) ─────────────────────────────────────────────
cat > .env.example << 'EOF'
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
AUTH_SECRET=
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=
EOF

# ── vercel.json ───────────────────────────────────────────────────────────────
cat > vercel.json << 'EOF'
{
  "buildCommand": "prisma generate && next build",
  "env": {
    "DATABASE_URL": "@database-url"
  }
}
EOF

# ── .gitignore additions ──────────────────────────────────────────────────────
cat >> .gitignore << 'EOF'

# Local env
.env.local
.env.*.local
EOF

# ── Git init ──────────────────────────────────────────────────────────────────
section "Initializing git"
git init
git add .
git commit -m "chore: initial SaaS boilerplate setup"
success "Git initialized with initial commit"

# ── Prisma generate ───────────────────────────────────────────────────────────
section "Generating Prisma client"
npx prisma generate
success "Prisma client generated"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║   ✔  Setup complete! Happy hacking :)        ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}Next steps:${NC}"
echo -e "  ${CYAN}1.${NC} Fill in ${BOLD}.env.local${NC} with your credentials"
echo -e "  ${CYAN}2.${NC} Start your PostgreSQL database"
echo -e "  ${CYAN}3.${NC} Run ${BOLD}npx prisma migrate dev --name init${NC}"
echo -e "  ${CYAN}4.${NC} Run ${BOLD}$PM run dev${NC} and open http://localhost:3000"
echo -e "  ${CYAN}5.${NC} Deploy to Vercel with ${BOLD}vercel --prod${NC}"
echo ""
echo -e "  ${YELLOW}Stripe webhook (local):${NC}"
echo -e "  stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo ""
