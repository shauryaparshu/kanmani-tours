import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import { getAboutData } from '@/lib/about';
import { getTranslations } from 'next-intl/server';
import './about.css';

export const metadata: Metadata = {
  title: 'About Us — Srikan Tours',
  description: 'Learn about Srikan Tours and our mission to connect Japanese travelers with the beauty of India.',
};

export default async function AboutPage() {
  const aboutData = await getAboutData();
  const { story } = aboutData;
  const t = await getTranslations('About');

  return (
    <main className="about-page">
      <TopBar />
      <Navigation />

      {/* 1. OUR STORY - CLEAN & MINIMAL */}
      <section className="about-story section-padding">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-text">
              <span className="section-badge">{t('badge')}</span>
              <h2 className="section-title-large">{story.title}</h2>
              {story.content.map((p: string, idx: number) => (
                <p key={idx} className="story-paragraph">{p}</p>
              ))}
            </div>
            <div className="about-story-visual">
              <div className="story-img-wrap">
                {story.image && (
                  <Image
                    src={story.image}
                    alt="Kanmani"
                    width={500}
                    height={500}
                    className="story-img"
                    priority
                  />
                )}
                <div className="story-attribution">
                  <strong>Kanmani</strong>
                  <span>{t('ceoTitle')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
