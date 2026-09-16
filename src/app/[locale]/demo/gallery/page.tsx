import { Metadata } from 'next';
import DemoGalleryClient from './DemoGalleryClient';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DemoGalleryPage() {
  return <DemoGalleryClient />;
}
