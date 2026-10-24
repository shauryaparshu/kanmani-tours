import fs from 'fs';
import path from 'path';

/**
 * server-images.ts
 * Directly reads the filesystem. Only works in Server Components.
 */

const ROOT = path.join(process.cwd(), 'public');

export function getImages(folderPath: string): string[] {
    const absolutePath = path.join(ROOT, folderPath);

    if (!fs.existsSync(absolutePath)) {
        console.warn(`Folder not found: ${absolutePath}`);
        return [];
    }

    const files = fs.readdirSync(absolutePath);

    const images = files
        .filter(f => /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(f))
        .map(f => `${folderPath}/${f}`.replace(/\\/g, '/'));

    // Logic: Sort images so those starting with "cover-" are first.
    // Others are sorted alphabetically.
    return images.sort((a, b) => {
        const aName = path.basename(a).toLowerCase();
        const bName = path.basename(b).toLowerCase();

        const aIsCover = aName.startsWith('cover-');
        const bIsCover = bName.startsWith('cover-');

        if (aIsCover && !bIsCover) return -1;
        if (!aIsCover && bIsCover) return 1;

        return aName.localeCompare(bName);
    });
}
