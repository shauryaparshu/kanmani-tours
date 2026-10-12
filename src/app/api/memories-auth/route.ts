import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        let password = '';
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const body = await request.json();
            password = body.password || '';
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
        if (!password || password !== expectedPassword) {
            return NextResponse.json(
                { error: 'Invalid password. Please try again.' },
                { status: 401 }
            );
        }

        // Successful authentication: set httpOnly cookie with session token
        const response = NextResponse.json({ success: true });
        response.cookies.set({
            name: 'memories_access',
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
