import { OrgRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      admin?: {
        id: string;
        email: string;
        role: string;
      };
      orgId?: string;
      memberRole?: OrgRole;
    }
  }
}

export { };
