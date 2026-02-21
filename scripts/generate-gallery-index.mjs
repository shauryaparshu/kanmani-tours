import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../src/data/tours.json');
const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'assets/gallery-index.json');

const IMAGE_EXTS = /\.(jpg|jpeg|png|webp)$/i;
const VIDEO_EXTS = /\.(mp4|webm|ogv)$/i;

async function generateIndex() {
    try {
        const toursData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const galleryIndex = { tours: [] };

        for (const tour of toursData) {
            const galleryPath = path.join(PUBLIC_DIR, `assets/img/tours/${tour.slug}/gallery`);

            if (fs.existsSync(galleryPath)) {
                const files = fs.readdirSync(galleryPath);

                const videos = files
                    .filter(file => VIDEO_EXTS.test(file))
                    .sort((a, b) => a.localeCompare(b))
                    .map(file => ({
                        type: 'video',
                        url: `/assets/img/tours/${tour.slug}/gallery/${file}`
                    }));

                const images = files
                    .filter(file => IMAGE_EXTS.test(file))
                    .sort((a, b) => {
                        const aNum = parseInt(a.match(/^\d+/)?.[0]);
                        const bNum = parseInt(b.match(/^\d+/)?.[0]);

                        if (!isNaN(aNum) && !isNaN(bNum)) {
                            return aNum - bNum;
                        }
                        return a.localeCompare(b);
                    })
                    .map(file => ({
                        type: 'image',
                        url: `/assets/img/tours/${tour.slug}/gallery/${file}`
                    }));

                // Videos come first, then images
                const media = [...videos, ...images];

                if (media.length > 0) {
                    galleryIndex.tours.push({
                        slug: tour.slug,
                        title: tour.title,
                        shortDescription: tour.shortDescription,
                        category: tour.category,
                        startDate: tour.startDate,
                        endDate: tour.endDate,
                        year: new Date(tour.endDate || tour.startDate).getFullYear(),
                        coverImage: tour.coverImage || (images.length > 0 ? images[0].url : null),
                        media: media
                    });
                }
            }
        }

        const outputDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(galleryIndex, null, 2));
        console.log(`Gallery index generated successfully at ${OUTPUT_FILE}`);
        console.log(`Found ${galleryIndex.tours.length} tours with galleries.`);
    } catch (error) {
        console.error('Error generating gallery index:', error);
        process.exit(1);
    }
}

generateIndex();
