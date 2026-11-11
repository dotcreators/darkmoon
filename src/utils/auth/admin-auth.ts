import { createHash, timingSafeEqual } from 'node:crypto';
import { envConfig } from 'env.config';

const hash = (value: string) => new Uint8Array(createHash('sha256').update(value).digest());

export function isAdminAuthorized(authorization: string | undefined): boolean {
  if (!envConfig.ADMIN_API_TOKEN || !authorization?.startsWith('Bearer ')) {
    return false;
  }

  const token = authorization.slice('Bearer '.length);
  return timingSafeEqual(hash(token), hash(envConfig.ADMIN_API_TOKEN));
}
