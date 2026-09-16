'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SHOW_JAPAN_DESTINATION } from '@/lib/featureFlags';
import FlightRoute from '@/components/ui/FlightRoute';

interface DestinationCardProps {
  href: string;
  image: string;
  label: string;
  title: string;
  desc: string;
  count: string;
  ctaLabel: string;
  from: 'india' | 'japan';
  to: 'india' | 'japan';
}

function DestinationCard({ href, image, label, title, desc, count, ctaLabel, from, to }: DestinationCardProps) {
  return (
    <Link href={href} style={{ 
      flex: 1, 
      textDecoration: 'none', 
      color: 'inherit', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px', 
      overflow: 'hidden',
      border: '1px solid rgba(201,147,58,0.25)', 
      background: '#1C1917',
      boxShadow: '0 18px 45px rgba(28, 25, 23, 0.08)',
      transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 24px 55px rgba(28, 25, 23, 0.2)';
      const img = e.currentTarget.querySelector('.card-image') as HTMLElement;
      if (img) {
        img.style.filter = 'brightness(1.1)';
        img.style.transform = 'scale(1.03)';
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 18px 45px rgba(28, 25, 23, 0.08)';
      const img = e.currentTarget.querySelector('.card-image') as HTMLElement;
      if (img) {
        img.style.filter = 'brightness(1)';
        img.style.transform = 'scale(1)';
      }
    }}
    >
      {/* Top Zone - Image */}
      <div className="card-top-zone">
        <img src={image} alt={title} className="card-image" />
        <div className="card-image-gradient" />
      </div>

      {/* Bottom Zone - Content */}
      <div className="card-bottom-zone">
        <FlightRoute from={from} to={to} />
        
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{desc}</p>
        <div className="card-count">{count}</div>
        
        <div className="card-cta">
          {ctaLabel}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .card-top-zone {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: #2a2623;
          flex-shrink: 0;
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), filter 0.6s ease;
        }
        .card-image-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to bottom, rgba(28,25,23,0) 0%, rgba(28,25,23,1) 100%);
        }
        
        .card-bottom-zone {
          flex-grow: 1;
          background-color: #1C1917;
          padding: 32px;
          display: flex;
          flex-direction: column;
          color: #F5F1EB;
        }
        
        .card-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 500;
          line-height: 1.1;
          margin: 0 0 16px;
        }
        
        .card-desc {
          font-family: 'Jost', Arial, sans-serif;
          font-size: 1.05rem;
          font-weight: 300;
          color: rgba(245, 241, 235, 0.7);
          line-height: 1.5;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          /* autoprefixer: ignore next */
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .card-count {
          font-family: 'Jost', Arial, sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #EBB14E;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        
        .card-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #EBB14E;
          font-family: 'Jost', Arial, sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: auto;
        }
        
        @media (max-width: 768px) {
          .card-top-zone {
            height: 180px;
          }
          .card-bottom-zone {
            padding: 24px;
          }
          .card-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </Link>
  );
}

export default function DestinationChoice() {
  const t = useTranslations('DestinationChoice');
  const locale = useLocale();

  const cardsData: DestinationCardProps[] = [
    {
      href: '/india/tours',
      image: '/assets/img/home/hero/002-59707893.jpg',
      label: t('indiaLabel'),
      title: t('indiaTitle'),
      desc: t('indiaDesc'),
      count: t('indiaCount'),
      ctaLabel: t('indiaCta'),
      from: 'japan',
      to: 'india'
    },
    ...(SHOW_JAPAN_DESTINATION ? [{
      href: '/japan/tours',
      image: '/assets/img/home/hero/004-whatsapp(1).jpeg',
      label: t('japanLabel'),
      title: t('japanTitle'),
      desc: t('japanDesc'),
      count: t('japanCount'),
      ctaLabel: t('japanCta'),
      from: 'india' as 'india' | 'japan',
      to: 'japan' as 'india' | 'japan'
    }] : [])
  ];

  if (SHOW_JAPAN_DESTINATION) {
    if (locale === 'en') {
      cardsData.sort((a, b) => a.title === t('japanTitle') ? -1 : 1);
    } else {
      cardsData.sort((a, b) => a.title === t('indiaTitle') ? -1 : 1);
    }
  }

  return (
    <section style={{ backgroundColor: '#1C1917', width: '100%', padding: '80px 16px 96px', borderBottom: '1px solid rgba(201,147,58,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '700px', margin: '0 auto 64px' }}>
          <span style={{ 
            display: 'block',
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#EBB14E',
            textTransform: 'uppercase',
            margin: '0 0 16px 0'
          }}>
            {t('subheading')}
          </span>
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(36px, 5vw, 56px)', 
            color: '#F5F1EB', 
            fontWeight: 500,
            margin: '0 0 16px',
            lineHeight: 1.1
          }}>
            {t('heading')}
          </h2>
          <p style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '1.1rem',
            color: '#9CA3AF',
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 300
          }}>
            {t('description')}
          </p>
        </div>

        {/* Destination Cards */}
        <div className="destination-cards-container">
          {cardsData.map((cardProps) => (
            <DestinationCard key={cardProps.href} {...cardProps} />
          ))}
        </div>

      </div>

      <style jsx>{`
        .destination-cards-container {
          display: flex;
          flex-direction: row;
          gap: 32px;
          align-items: stretch;
        }
        .destination-card-content {
          position: relative;
          height: 100%;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          border-radius: 23px;
          background: #1C1917;
          border: 1px solid rgba(201, 147, 58, 0.2);
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .destination-cards-container {
            flex-direction: column;
            gap: 24px;
          }
          .destination-card-content {
            min-height: auto;
          }
        }
      `}</style>
    </section>
  );
}
