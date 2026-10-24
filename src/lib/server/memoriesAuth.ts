import { createHash, timingSafeEqual } from 'crypto';

export const MEMORIES_COOKIE = 'memories_access';

// Constant-time comparison. Hashing first gives equal-length buffers, so
// timingSafeEqual never throws and the input length isn't leaked.
export function safeEqual(a: string, b: string): boolean {
    const ha = createHash('sha256').update(a).digest();
    const hb = createHash('sha256').update(b).digest();
    return timingSafeEqual(ha, hb);
}

export function hasMemoriesAccess(token: string | undefined): boolean {
    const expected = process.env.MEMORIES_SESSION_TOKEN;
    return Boolean(expected && token && safeEqual(token, expected));
}
