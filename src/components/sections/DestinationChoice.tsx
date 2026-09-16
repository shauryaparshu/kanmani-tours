'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SHOW_JAPAN_DESTINATION } from '@/lib/featureFlags';

interface DestinationCardProps {
  href: string;
  image: string;
  title: string;
  desc: string;
  ctaLabel: string;
}

function DestinationCard({ href, image, title, desc, ctaLabel }: DestinationCardProps) {
  return (
    <Link href={href} style={{ 
      flex: '1 1 300px', 
      textDecoration: 'none', 
      color: 'inherit', 
      display: 'block', 
      padding: '1px', 
      borderRadius: '24px', 
      background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(201,147,58,0.28))', 
      boxShadow: '0 18px 45px rgba(28, 25, 23, 0.08)', 
      transition: 'transform 0.35s ease, box-shadow 0.35s ease' 
    }}>
      <article style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,240,231,0.98))', 
        borderRadius: '23px', 
        overflow: 'hidden', 
        border: '1px solid rgba(74, 69, 64, 0.10)', 
        position: 'relative' 
      }}>
        <div style={{ 
          aspectRatio: '4/3', 
          overflow: 'hidden', 
          position: 'relative', 
          background: 'linear-gradient(180deg, rgba(26,25,24,0.04), rgba(26,25,24,0.14)), #1a1918' 
        }}>
          <div style={{ 
            position: 'absolute', 
            left: 0, 
            right: 0, 
            top: 0, 
            height: '3px', 
            background: 'linear-gradient(90deg, #8A5B18 0%, #FFE082 45%, #C9933A 100%)', 
            zIndex: 10 
          }} />
          <img src={image} alt={title} style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block' 
          }} />
        </div>
        <div style={{ 
          padding: '1.35rem 1.35rem 1.45rem', 
          textAlign: 'left', 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <h3 style={{ 
            fontFamily: "'Jost', Arial, sans-serif", 
            fontSize: '1.65rem', 
            fontWeight: 650, 
            color: '#1a1918', 
            letterSpacing: '0.03em', 
            lineHeight: 1.28, 
            margin: '0 0 0.5rem' 
          }}>{title}</h3>
          <p style={{ 
            fontFamily: "'Cormorant Garamond', Georgia, serif", 
            fontSize: '18px', 
            color: '#4A3E34', 
            lineHeight: 1.6, 
            margin: '0 0 1.5rem', 
            flexGrow: 1 
          }}>{desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <span style={{ 
              height: '1px', 
              flex: 1, 
              background: 'linear-gradient(90deg, rgba(201,147,58,0.05), rgba(201,147,58,0.45), rgba(201,147,58,0.05))' 
            }} />
            <i style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              display: 'block', 
              background: '#C9933A', 
              boxShadow: '0 0 10px rgba(201,147,58,0.6)' 
            }} />
          </div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#d49a36', 
            fontFamily: "'Jost', Arial, sans-serif", 
            fontSize: '13px', 
            fontWeight: 700, 
            letterSpacing: '0.16em', 
            textTransform: 'uppercase' 
          }}>
            {ctaLabel}
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function DestinationChoice() {
  const t = useTranslations('DestinationChoice');
  const locale = useLocale();

  const cardsData = [
    {
      key: 'india',
      href: '/india/tours',
      image: '/assets/img/about/about-2.jpg',
      title: t('indiaTitle'),
      desc: t('indiaDesc'),
      ctaLabel: t('indiaCta')
    },
    ...(SHOW_JAPAN_DESTINATION ? [{
      key: 'japan',
      href: '/japan/tours',
      image: '/assets/img/about/about-1.jpg',
      title: t('japanTitle'),
      desc: t('japanDesc'),
      ctaLabel: t('japanCta')
    }] : [])
  ];

  if (SHOW_JAPAN_DESTINATION) {
    if (locale === 'en') {
      cardsData.sort((a, b) => a.key === 'japan' ? -1 : 1);
    } else {
      cardsData.sort((a, b) => a.key === 'india' ? -1 : 1);
    }
  }

  return (
    <section style={{ backgroundColor: '#1C1917', width: '100%', padding: '64px 16px 80px', borderBottom: '1px solid rgba(201,147,58,0.2)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Bridge Intro */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ flex: '1 1 300px', backgroundColor: '#111010', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ width: '100%', aspectRatio: '1', position: 'relative' }}>
              <img 
                src="/assets/img/about-kanmani/founder-hero.jpg" 
                alt="Dr. Kanmani"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }}
              />
            </div>
          </div>

          <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 4vw, 48px)', color: '#F5F1EB', marginBottom: '24px', fontWeight: 400 }}>
              {t('heading')}
            </h2>
            
            <div style={{ position: 'relative', borderLeft: '4px solid #EBB14E', padding: '20px 24px', backgroundColor: 'rgba(235, 177, 78, 0.04)', marginBottom: '24px', borderRadius: '0 8px 8px 0' }}>
              <span style={{ position: 'absolute', top: '-15px', left: '12px', fontSize: '72px', fontFamily: "'Cormorant Garamond', Georgia, serif", color: 'rgba(201, 147, 58, 0.12)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>“</span>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(15px, 1.25vw, 18px)', fontStyle: 'italic', color: '#F5F1EB', lineHeight: 1.6, margin: 0, fontWeight: 400, letterSpacing: '0.01em', position: 'relative', zIndex: 1 }}>
                "Born in India, shaped by 28 years in Japan, and inspired by both— I walk forward as a bridge between the two cultures that live within me."
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.32em', color: '#EBB14E', textTransform: 'uppercase', marginBottom: '6px' }}>THE FOUNDER</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 400, color: '#F5F1EB', letterSpacing: '0.06em', marginBottom: '4px', margin: 0 }}>Dr. Kanmani</p>
              <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: 400, letterSpacing: '0.12em', color: '#EBB14E', lineHeight: 1.2, marginBottom: '0' }}>PhD SCHOLAR · ENTREPRENEUR · MOTIVATIONAL SPEAKER · HUMANITARIAN</p>
            </div>
          </div>
        </div>

        {/* Destination Cards */}
        <div style={{
          marginTop: '64px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '32px'
        }}>
          {cardsData.map(({ key, ...cardProps }) => (
            <DestinationCard key={key} {...cardProps} />
          ))}
        </div>

      </div>
    </section>
  );
}
