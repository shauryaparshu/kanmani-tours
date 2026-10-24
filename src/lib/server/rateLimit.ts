import type { NextRequest } from 'next/server';

// Best-effort in-memory rate limiter. Counts are per server instance, so on
// Vercel this slows down casual abuse but is not a hard global limit — use a
// Vercel Firewall rate-limit rule for that.

const buckets = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= limit) {
        buckets.set(key, recent);
        return true;
    }

    recent.push(now);
    buckets.set(key, recent);

    // Keep memory bounded on long-lived instances.
    if (buckets.size > 5000) {
        for (const [k, times] of buckets) {
            if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
        }
    }
    return false;
}

export function getClientIp(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}
