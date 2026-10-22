#!/usr/bin/env bash

# =============================================================================
# NestJS SaaS Boilerplate Setup
# Stack: NestJS + Prisma + PostgreSQL + JWT (Access + Refresh Token)
#        + Stripe + Swagger (OpenAPI)
# Deploy target: Render
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

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BOLD}${CYAN}"
echo "  ╔═══════════════════════════════════════╗"
echo "  ║   NestJS SaaS Boilerplate Setup       ║"
echo "  ╚═══════════════════════════════════════╝"
echo -e "${NC}"

read -rp "$(echo -e "${BOLD}Project name:${NC} ")" PROJECT_NAME
PROJECT_NAME="${PROJECT_NAME:-my-nest-api}"
PROJECT_DIR="$(pwd)/$PROJECT_NAME"

log "Creating project: ${BOLD}$PROJECT_NAME${NC}"

# ── Check required tools ──────────────────────────────────────────────────────
section "Checking requirements"

command -v node >/dev/null 2>&1 || error "Node.js is not installed. Install from https://nodejs.org"
command -v npm  >/dev/null 2>&1 || error "npm is not installed."
command -v git  >/dev/null 2>&1 || error "git is not installed."

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
  PM_ADD="pnpm add"
  PM_ADD_DEV="pnpm add -D"
elif command -v yarn >/dev/null 2>&1; then
  PM="yarn"
  PM_ADD="yarn add"
  PM_ADD_DEV="yarn add -D"
else
  PM="npm"
  PM_ADD="npm install"
  PM_ADD_DEV="npm install -D"
fi
success "Using: ${BOLD}$PM${NC}"

# ── Install NestJS CLI ────────────────────────────────────────────────────────
section "Installing NestJS CLI"
if ! command -v nest >/dev/null 2>&1; then
  npm install -g @nestjs/cli
  success "NestJS CLI installed"
else
  success "NestJS CLI already installed ($(nest --version))"
fi

# ── Create NestJS app ─────────────────────────────────────────────────────────
section "Creating NestJS app"
nest new "$PROJECT_NAME" --package-manager "${PM}" --skip-git --strict
cd "$PROJECT_DIR"
success "NestJS app created"

# ── Install dependencies ──────────────────────────────────────────────────────
section "Installing dependencies"

log "Installing Prisma..."
$PM_ADD @prisma/client
$PM_ADD_DEV prisma

log "Installing Auth (JWT + Passport)..."
$PM_ADD @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcryptjs
$PM_ADD_DEV @types/passport-jwt @types/passport-local @types/bcryptjs

log "Installing Config..."
$PM_ADD @nestjs/config

log "Installing Validation..."
$PM_ADD class-validator class-transformer

log "Installing Stripe..."
$PM_ADD stripe

log "Installing Swagger..."
$PM_ADD @nestjs/swagger swagger-ui-express

log "Installing utilities..."
$PM_ADD uuid
$PM_ADD_DEV @types/uuid

success "All dependencies installed"

# ── Prisma init ───────────────────────────────────────────────────────────────
section "Setting up Prisma"
npx prisma init --datasource-provider postgresql
success "Prisma initialized"

# ── Folder structure ──────────────────────────────────────────────────────────
section "Creating folder structure"

mkdir -p \
  src/auth \
  src/auth/guards \
  src/auth/strategies \
  src/auth/decorators \
  src/auth/dto \
  src/users \
  src/users/dto \
  src/stripe \
  src/stripe/dto \
  src/stripe/webhooks \
  src/prisma \
  src/common/filters \
  src/common/interceptors \
  src/common/pipes \
  src/common/decorators \
  src/config \
  src/mail \
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
  id                  String    @id @default(uuid())
  name                String?
  email               String    @unique
  password            String?
  role                Role      @default(USER)
  emailVerified       Boolean   @default(false)
  refreshToken        String?   @db.Text
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  subscription        Subscription?

  @@map("users")
}

model Subscription {
  id                     String             @id @default(uuid())
  userId                 String             @unique
  stripeCustomerId       String?            @unique
  stripeSubscriptionId   String?            @unique
  stripePriceId          String?
  stripeCurrentPeriodEnd DateTime?
  status                 SubscriptionStatus @default(INACTIVE)
  plan                   Plan               @default(FREE)
  createdAt              DateTime           @default(now())
  updatedAt              DateTime           @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
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

# ── src/prisma/prisma.service.ts ──────────────────────────────────────────────
cat > src/prisma/prisma.service.ts << 'EOF'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
EOF

# ── src/prisma/prisma.module.ts ───────────────────────────────────────────────
cat > src/prisma/prisma.module.ts << 'EOF'
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
EOF

# ── src/config/configuration.ts ───────────────────────────────────────────────
cat > src/config/configuration.ts << 'EOF'
export default () => ({
  port: parseInt(process.env.PORT ?? '3333', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    proPriceId: process.env.STRIPE_PRO_PRICE_ID,
    enterprisePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  },
  app: {
    url: process.env.APP_URL ?? 'http://localhost:3333',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  },
});
EOF

# ── src/auth/dto/register.dto.ts ──────────────────────────────────────────────
cat > src/auth/dto/register.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
EOF

# ── src/auth/dto/login.dto.ts ─────────────────────────────────────────────────
cat > src/auth/dto/login.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
EOF

# ── src/auth/dto/refresh-token.dto.ts ────────────────────────────────────────
cat > src/auth/dto/refresh-token.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
EOF

# ── src/auth/strategies/jwt.strategy.ts ──────────────────────────────────────
cat > src/auth/strategies/jwt.strategy.ts << 'EOF'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.accessSecret')!,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException();
    const { password, refreshToken, ...result } = user;
    return result;
  }
}
EOF

# ── src/auth/strategies/jwt-refresh.strategy.ts ──────────────────────────────
cat > src/auth/strategies/jwt-refresh.strategy.ts << 'EOF'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret')!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    const { refreshToken } = req.body;
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user?.refreshToken) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

    const { password, refreshToken: rt, ...result } = user;
    return result;
  }
}
EOF

# ── src/auth/guards/jwt-auth.guard.ts ────────────────────────────────────────
cat > src/auth/guards/jwt-auth.guard.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
EOF

# ── src/auth/guards/jwt-refresh.guard.ts ─────────────────────────────────────
cat > src/auth/guards/jwt-refresh.guard.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
EOF

# ── src/auth/guards/roles.guard.ts ───────────────────────────────────────────
cat > src/auth/guards/roles.guard.ts << 'EOF'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '@/auth/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true;
    const { user } = context.switchToHttp().getRequest();
    return required.includes(user.role);
  }
}
EOF

# ── src/auth/decorators/current-user.decorator.ts ────────────────────────────
cat > src/auth/decorators/current-user.decorator.ts << 'EOF'
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
EOF

# ── src/auth/decorators/roles.decorator.ts ───────────────────────────────────
cat > src/auth/decorators/roles.decorator.ts << 'EOF'
import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
EOF

# ── src/auth/decorators/public.decorator.ts ──────────────────────────────────
cat > src/auth/decorators/public.decorator.ts << 'EOF'
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
EOF

# ── src/auth/auth.service.ts ──────────────────────────────────────────────────
cat > src/auth/auth.service.ts << 'EOF'
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashed },
    });

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user?.password) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(userId: string, email: string) {
    const tokens = await this.generateTokens(userId, email);
    await this.saveRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessExpiresIn'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}
EOF

# ── src/auth/auth.controller.ts ───────────────────────────────────────────────
cat > src/auth/auth.controller.ts << 'EOF'
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@CurrentUser() user: any, @Body() _dto: RefreshTokenDto) {
    return this.authService.refresh(user.id, user.email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }
}
EOF

# ── src/auth/auth.module.ts ───────────────────────────────────────────────────
cat > src/auth/auth.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
EOF

# ── src/users/dto/update-user.dto.ts ─────────────────────────────────────────
cat > src/users/dto/update-user.dto.ts << 'EOF'
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;
}
EOF

# ── src/users/users.service.ts ────────────────────────────────────────────────
cat > src/users/users.service.ts << 'EOF'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        subscription: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted' };
  }
}
EOF

# ── src/users/users.controller.ts ────────────────────────────────────────────
cat > src/users/users.controller.ts << 'EOF'
import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  deleteMe(@CurrentUser() user: any) {
    return this.usersService.remove(user.id);
  }
}
EOF

# ── src/users/users.module.ts ─────────────────────────────────────────────────
cat > src/users/users.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
EOF

# ── src/stripe/dto/create-checkout.dto.ts ────────────────────────────────────
cat > src/stripe/dto/create-checkout.dto.ts << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({ description: 'Stripe Price ID' })
  @IsString()
  @IsNotEmpty()
  priceId: string;
}
EOF

# ── src/stripe/stripe.service.ts ──────────────────────────────────────────────
cat > src/stripe/stripe.service.ts << 'EOF'
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.config.get<string>('stripe.secretKey')!, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }

  async createCheckoutSession(userId: string, email: string, priceId: string) {
    let subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({ email });
      customerId = customer.id;
      await this.prisma.subscription.upsert({
        where: { userId },
        create: { userId, stripeCustomerId: customerId },
        update: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.config.get('app.frontendUrl')}/billing?success=true`,
      cancel_url: `${this.config.get('app.frontendUrl')}/billing?canceled=true`,
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!subscription?.stripeCustomerId) {
      throw new BadRequestException('No Stripe customer found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${this.config.get('app.frontendUrl')}/billing`,
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.get<string>('stripe.webhookSecret')!,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.updateMany({
          where: { stripeCustomerId: sub.customer as string },
          data: {
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            status: sub.status.toUpperCase() as any,
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.updateMany({
          where: { stripeCustomerId: sub.customer as string },
          data: { status: 'CANCELED', plan: 'FREE' },
        });
        break;
      }
    }

    return { received: true };
  }
}
EOF

# ── src/stripe/stripe.controller.ts ──────────────────────────────────────────
cat > src/stripe/stripe.controller.ts << 'EOF'
import {
  Body, Controller, Headers, Post,
  RawBodyRequest, Req, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  createCheckout(@CurrentUser() user: any, @Body() dto: CreateCheckoutDto) {
    return this.stripeService.createCheckoutSession(user.id, user.email, dto.priceId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('portal')
  @ApiOperation({ summary: 'Create a Stripe billing portal session' })
  createPortal(@CurrentUser() user: any) {
    return this.stripeService.createPortalSession(user.id);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(req.rawBody!, signature);
  }
}
EOF

# ── src/stripe/stripe.module.ts ───────────────────────────────────────────────
cat > src/stripe/stripe.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
EOF

# ── src/common/filters/http-exception.filter.ts ───────────────────────────────
cat > src/common/filters/http-exception.filter.ts << 'EOF'
import {
  ArgumentsHost, Catch, ExceptionFilter,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(`${request.method} ${request.url} — ${status}`, exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
EOF

# ── src/common/interceptors/transform.interceptor.ts ─────────────────────────
cat > src/common/interceptors/transform.interceptor.ts << 'EOF'
import {
  CallHandler, ExecutionContext,
  Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
EOF

# ── src/app.module.ts ─────────────────────────────────────────────────────────
cat > src/app.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StripeModule } from './stripe/stripe.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StripeModule,
  ],
})
export class AppModule {}
EOF

# ── src/main.ts ───────────────────────────────────────────────────────────────
cat > src/main.ts << 'EOF'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('My SaaS API')
    .setDescription('REST API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3333;
  await app.listen(port);
  console.log(`\n🚀 Server running on http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs\n`);
}

bootstrap();
EOF

# ── tsconfig.json path alias ──────────────────────────────────────────────────
# Add path alias @/* → src/*
node -e "
const fs = require('fs');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
tsconfig.compilerOptions.paths = { '@/*': ['src/*'] };
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
"
success "Path alias @/* configured"

# ── .env ──────────────────────────────────────────────────────────────────────
cat > .env << 'EOF'
# App
PORT=3333
APP_URL=http://localhost:3333
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# JWT
JWT_ACCESS_SECRET=your-access-secret-change-me
JWT_REFRESH_SECRET=your-refresh-secret-change-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_ENTERPRISE_PRICE_ID=
EOF

# ── .env.example ──────────────────────────────────────────────────────────────
cat > .env.example << 'EOF'
PORT=3333
APP_URL=http://localhost:3333
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_ENTERPRISE_PRICE_ID=
EOF

# ── render.yaml (Render deploy config) ───────────────────────────────────────
cat > render.yaml << 'EOF'
services:
  - type: web
    name: my-nest-api
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npx prisma migrate deploy && node dist/main
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: my-nest-db
          property: connectionString
      - key: JWT_ACCESS_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: STRIPE_SECRET_KEY
        sync: false
      - key: STRIPE_WEBHOOK_SECRET
        sync: false

databases:
  - name: my-nest-db
    databaseName: mydb
    plan: free
EOF

# ── .gitignore additions ──────────────────────────────────────────────────────
cat >> .gitignore << 'EOF'

# Local env
.env
.env.local
.env.*.local
EOF

# ── Git init ──────────────────────────────────────────────────────────────────
section "Initializing git"
git init
git add .
git commit -m "chore: initial NestJS SaaS boilerplate setup"
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
echo -e "  ${CYAN}1.${NC} Fill in ${BOLD}.env${NC} with your credentials"
echo -e "  ${CYAN}2.${NC} Start your PostgreSQL database"
echo -e "  ${CYAN}3.${NC} Run ${BOLD}npx prisma migrate dev --name init${NC}"
echo -e "  ${CYAN}4.${NC} Run ${BOLD}$PM run start:dev${NC}"
echo -e "  ${CYAN}5.${NC} Open ${BOLD}http://localhost:3333/docs${NC} for Swagger"
echo -e "  ${CYAN}6.${NC} Deploy to Render via ${BOLD}render.yaml${NC} (connect your repo)"
echo ""
echo -e "  ${YELLOW}Stripe webhook (local):${NC}"
echo -e "  stripe listen --forward-to localhost:3333/api/v1/stripe/webhook"
echo ""
