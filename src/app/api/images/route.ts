import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    if (!folder) {
        return NextResponse.json({ error: 'Folder parameter is required' }, { status: 400 });
    }

    const imagesDir = path.join(process.cwd(), 'public', 'images', folder);

    try {
        if (!fs.existsSync(imagesDir)) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        const files = fs.readdirSync(imagesDir);
        const images = files.filter(file =>
            /\.(png|jpe?g|gif|svg|webp)$/i.test(file)
        ).map(file => `/images/${folder}/${file}`);

        return NextResponse.json(images);
    } catch (error) {
        console.error('Error reading images directory:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
