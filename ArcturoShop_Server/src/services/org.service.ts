import { OrgRepository } from '../repositories/org.repository';

const orgRepository = new OrgRepository();

export class OrgService {
  async getProfile(orgId: string) {
    const profile = await orgRepository.getProfile(orgId);
    if (!profile) throw Object.assign(new Error('Organization not found'), { statusCode: 404 });
    return profile;
  }
}
