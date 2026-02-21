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

/**
 * Lists subdirectories (slugs) in a folder.
 */
export function getSlugs(parentFolder: string): string[] {
    const absolutePath = path.join(ROOT, parentFolder);
    if (!fs.existsSync(absolutePath)) return [];

    return fs.readdirSync(absolutePath).filter(f => {
        return fs.statSync(path.join(absolutePath, f)).isDirectory();
    });
}

/**
 * Gets the most recently modified image from a folder.
 */
export function getLatestImage(folderPath: string): string | null {
    const absolutePath = path.join(ROOT, folderPath);
    if (!fs.existsSync(absolutePath)) return null;

    const files = fs.readdirSync(absolutePath);
    const images = files
        .filter(f => /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(f))
        .map(f => ({
            name: f,
            mtime: fs.statSync(path.join(absolutePath, f)).mtime.getTime()
        }));

    if (images.length === 0) return null;

    // Sort by modification time descending
    images.sort((a, b) => b.mtime - a.mtime);

    return `${folderPath}/${images[0].name}`.replace(/\\/g, '/');
}
