import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// No Prisma 7, é obrigatório passar um adapter ao PrismaClient
// O Pool do pg gerencia as conexões com o banco PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Singleton: garante uma única instância em toda a aplicação
const prisma = new PrismaClient({ adapter });

export default prisma;
