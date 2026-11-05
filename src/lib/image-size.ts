import fs from 'fs';
import path from 'path';

/**
 * Reads the pixel size of a JPEG or PNG in /public from its file header,
 * so layouts can show a photo at its true shape (nothing cropped).
 * Returns null for other formats or unreadable files.
 */
export function readImageSize(publicPath: string): { width: number; height: number } | null {
    let buf: Buffer;
    try {
        buf = fs.readFileSync(path.join(process.cwd(), 'public', publicPath));
    } catch {
        return null;
    }

    // PNG: width and height sit at fixed offsets in the IHDR chunk.
    if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
        return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }

    // JPEG: walk the segments until a start-of-frame marker.
    if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
        let i = 2;
        while (i + 9 < buf.length) {
            if (buf[i] !== 0xff) { i++; continue; }
            const marker = buf[i + 1];
            if (marker === 0xff) { i++; continue; }
            const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
            if (isFrame) {
                return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
            }
            i += 2 + buf.readUInt16BE(i + 2);
        }
    }
    return null;
}
