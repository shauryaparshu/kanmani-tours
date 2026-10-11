import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface DriveRawFile {
    id: string;
    name: string;
    mimeType?: string;
    thumbnailLink?: string;
    imageMediaMetadata?: {
        width?: number;
        height?: number;
    };
    size?: string;
    parents?: string[];
}

export async function GET(request: NextRequest) {
    // 1. Auth check via memories_access cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('memories_access')?.value;
    const expectedToken = process.env.MEMORIES_SESSION_TOKEN;

    if (!expectedToken || !token || token !== expectedToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Env vars check
    const rootFolderId = process.env.MEMORIES_DRIVE_FOLDER_ID?.trim();
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY?.trim();

    if (!rootFolderId || !apiKey) {
        return NextResponse.json({ error: 'Gallery configuration error' }, { status: 500 });
    }

    // 3. Resolve target folder
    const searchParams = request.nextUrl.searchParams;
    const requestedFolder = searchParams.get('folder')?.trim();
    const targetFolderId = requestedFolder || rootFolderId;

    let currentFolderMeta: { id: string; name: string } | null = null;

    // 4. If a non-root folder is supplied, verify it sits under the root (max 5 levels)
    if (requestedFolder && requestedFolder !== rootFolderId) {
        let currentId = requestedFolder;
        let reachesRoot = false;

        for (let level = 0; level < 5; level++) {
            try {
                const parentRes = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(currentId)}?fields=parents&key=${apiKey}`,
                    { next: { revalidate: 60 } }
                );

                if (!parentRes.ok) {
                    break;
                }

                const parentData = await parentRes.json();
                let parents: string[] = parentData.parents || [];

                // For shared Drive folders accessed via API keys, files.get may not expose parents;
                // verify against root folder tree via cached listing
                if (parents.length === 0) {
                    const listCheckRes = await fetch(
                        `https://www.googleapis.com/drive/v3/files?q='${rootFolderId}'+in+parents+and+trashed=false&fields=files(id,parents)&pageSize=1000&key=${apiKey}`,
                        { next: { revalidate: 60 } }
                    );
                    if (listCheckRes.ok) {
                        const listCheckData = await listCheckRes.json();
                        const matched = listCheckData.files?.find((f: { id: string }) => f.id === currentId);
                        if (matched) {
                            parents = matched.parents || [rootFolderId];
                        }
                    }
                }

                if (parents.includes(rootFolderId)) {
                    reachesRoot = true;
                    break;
                }

                if (parents.length === 0) {
                    break;
                }

                currentId = parents[0];
            } catch {
                break;
            }
        }

        if (!reachesRoot) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Fetch the folder name with files.get fields=name
        try {
            const metaRes = await fetch(
                `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(requestedFolder)}?fields=name&key=${apiKey}`,
                { next: { revalidate: 60 } }
            );
            if (metaRes.ok) {
                const metaData = await metaRes.json();
                currentFolderMeta = {
                    id: requestedFolder,
                    name: metaData.name || 'Folder',
                };
            }
        } catch {
            // fallback if meta fetch fails
        }

        if (!currentFolderMeta) {
            currentFolderMeta = { id: requestedFolder, name: 'Folder' };
        }
    }

    // 5. List children from Google Drive v3
    const allRawFiles: DriveRawFile[] = [];
    let pageToken: string | undefined = undefined;

    try {
        do {
            const queryParams = new URLSearchParams({
                q: `'${targetFolderId.replace(/['\\]/g, '')}' in parents and trashed=false`,
                fields: 'nextPageToken,files(id,name,mimeType,thumbnailLink,imageMediaMetadata(width,height),size)',
                pageSize: '1000',
                key: apiKey,
            });

            if (pageToken) {
                queryParams.set('pageToken', pageToken);
            }

            const listRes = await fetch(
                `https://www.googleapis.com/drive/v3/files?${queryParams.toString()}`,
                { next: { revalidate: 60 } }
            );

            if (!listRes.ok) {
                return NextResponse.json(
                    { error: 'Failed to retrieve folder contents' },
                    { status: listRes.status }
                );
            }

            const data = await listRes.json();
            if (Array.isArray(data.files)) {
                allRawFiles.push(...data.files);
            }

            pageToken = data.nextPageToken;
        } while (pageToken);
    } catch {
        return NextResponse.json({ error: 'Failed to communicate with Google Drive' }, { status: 500 });
    }

    // 6. Filter, transform and sort folders and files
    const folders = allRawFiles
        .filter((f) => f.mimeType === 'application/vnd.google-apps.folder')
        .map((f) => ({ id: f.id, name: f.name }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    const files = allRawFiles
        .filter((f) => f.mimeType && (f.mimeType.startsWith('image/') || f.mimeType.startsWith('video/')))
        .map((f) => {
            const isVideo = f.mimeType?.startsWith('video/') ?? false;
            const kind: 'image' | 'video' = isVideo ? 'video' : 'image';
            const thumb = f.thumbnailLink
                ? f.thumbnailLink.replace(/=s\d+.*$/, '=w480')
                : `https://drive.google.com/thumbnail?id=${f.id}&sz=w480`;
            const large = f.thumbnailLink
                ? f.thumbnailLink.replace(/=s\d+.*$/, '=w1800')
                : `https://drive.google.com/thumbnail?id=${f.id}&sz=w1800`;
            const download = `https://drive.google.com/uc?export=download&id=${f.id}`;

            return {
                id: f.id,
                name: f.name,
                kind,
                thumb,
                large,
                download,
                width: f.imageMediaMetadata?.width,
                height: f.imageMediaMetadata?.height,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    return NextResponse.json({
        current: currentFolderMeta,
        folders,
        files,
    });
}
