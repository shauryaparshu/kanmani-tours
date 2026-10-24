import { NextRequest, NextResponse } from 'next/server';
import { MEMORIES_COOKIE, safeEqual } from '@/lib/server/memoriesAuth';
import { getClientIp, isRateLimited } from '@/lib/server/rateLimit';

// 10 password attempts per IP per 15 minutes.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
    if (isRateLimited(`memories-login:${getClientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
        return NextResponse.json(
            { error: 'Too many attempts. Please wait 15 minutes and try again.' },
            { status: 429 }
        );
    }

    try {
        let password = '';
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const body = await request.json();
            password = typeof body.password === 'string' ? body.password : '';
        } else {
            const formData = await request.formData();
            password = (formData.get('password') as string) || '';
        }

        const expectedPassword = process.env.MEMORIES_GALLERY_PASSWORD;
        const sessionToken = process.env.MEMORIES_SESSION_TOKEN;

        // If server env vars are not set yet, reject safely
        if (!expectedPassword || !sessionToken) {
            return NextResponse.json(
                { error: 'Server authentication configuration is missing.' },
                { status: 500 }
            );
        }

        // Compare password (never store password in cookie)
        if (!password || !safeEqual(password, expectedPassword)) {
            return NextResponse.json(
                { error: 'Invalid password. Please try again.' },
                { status: 401 }
            );
        }

        // Successful authentication: set httpOnly cookie with session token
        const response = NextResponse.json({ success: true });
        response.cookies.set({
            name: MEMORIES_COOKIE,
            value: sessionToken,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 120 * 24 * 60 * 60, // 120 days in seconds
            path: '/',
        });

        return response;
    } catch {
        return NextResponse.json(
            { error: 'An unexpected error occurred during authentication.' },
            { status: 500 }
        );
    }
}
