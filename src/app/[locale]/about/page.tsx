"use client";

import { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/FooterSection';
import AboutKanmaniClient from './AboutKanmaniClient';

export default function AboutPage() {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeSection, setActiveSection] = useState<'founder' | 'company'>('founder');

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Premium smooth scrolling momentum physics (90% speed, completely jitter-free)
  useEffect(() => {
    let targetScrollY = window.scrollY;
    let isScrolling = false;
    
    // Intensity settings (90% standard speed):
    // speedMultiplier = 0.9
    // easingFactor = 0.2 (extremely fast, reactive, eliminating jitter completely while keeping it smooth)
    const speedMultiplier = 0.9;
    const easingFactor = 0.2;
    
    const handleWheel = (e: WheelEvent) => {
      if (document.body.style.overflow === 'hidden') return;
      
      e.preventDefault();
      
      targetScrollY += e.deltaY * speedMultiplier;
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));
      
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(updateScroll);
      }
    };

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const difference = targetScrollY - currentScrollY;
      const step = difference * easingFactor;
      
      if (Math.abs(step) > 0.5) {
        window.scrollTo(0, currentScrollY + step);
        requestAnimationFrame(updateScroll);
      } else {
        window.scrollTo(0, targetScrollY);
        isScrolling = false;
      }
    };

    const handleScrollSync = () => {
      if (!isScrolling) {
        targetScrollY = window.scrollY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScrollSync);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScrollSync);
    };
  }, []);

  // ScrollSpy to sync active tab with section in view
  useEffect(() => {
    const handleScrollSpy = () => {
      const founderEl = document.getElementById('about-founder');
      const companyEl = document.getElementById('about-company');
      
      if (founderEl && companyEl) {
        const companyBound = companyEl.getBoundingClientRect();
        
        // If the top of About Company section is close to or above the mid-screen, highlight Company
        if (companyBound.top <= window.innerHeight / 2.2) {
          setActiveSection('company');
        } else {
          setActiveSection('founder');
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <>
      <Navigation />
      <div style={{
        backgroundColor: '#FAFAF7',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Two-column layout container */}
        <div style={{
          display: 'flex',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative'
        }}>
          {/* LEFT SIDEBAR: Sticky Tabs (Hidden on Mobile) */}
          {!isMobile && (
            <div style={{
              width: '280px',
              flexShrink: 0,
              padding: '80px 40px',
              position: 'sticky',
              top: '80px',
              height: 'calc(100vh - 80px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              borderRight: '1px solid #E8E4DC',
              zIndex: 90
            }}>
              <div style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.28em',
                color: '#C9933A',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>Category</div>
              
              {[
                { id: 'founder', label: 'About Founder', targetId: 'about-founder' },
                { id: 'company', label: 'About Company', targetId: 'about-company' }
              ].map(tab => {
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      const el = document.getElementById(tab.targetId);
                      if (el) {
                        const offset = el.offsetTop - 80;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '13px',
                      fontWeight: '600',
                      letterSpacing: '0.18em',
                      color: isActive ? '#1C1917' : '#9A948F',
                      backgroundColor: isActive ? 'rgba(201,147,58,0.06)' : 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${isActive ? '#C9933A' : 'transparent'}`,
                      padding: '14px 20px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <div style={{
            flexGrow: 1,
            width: isMobile ? '100%' : 'calc(100% - 280px)',
            position: 'relative'
          }}>
            {/* Mobile Sticky Tab bar at top */}
            {isMobile && (
              <div style={{
                position: 'sticky',
                top: '0',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(28,25,23,0.95)',
                backdropFilter: 'blur(8px)',
                zIndex: 100,
                display: 'flex',
                borderBottom: '1px solid rgba(201,147,58,0.2)'
              }}>
                {[
                  { id: 'founder', label: 'Founder', targetId: 'about-founder' },
                  { id: 'company', label: 'Company', targetId: 'about-company' }
                ].map(tab => {
                  const isActive = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        const el = document.getElementById(tab.targetId);
                        if (el) {
                          const offset = el.offsetTop - 60;
                          window.scrollTo({ top: offset, behavior: 'smooth' });
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '16px 8px',
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        color: isActive ? '#C9933A' : '#9A948F',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: `2px solid ${isActive ? '#C9933A' : 'transparent'}`,
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}

            <main>
              {/* Dr. Kanmani's Full Biography & History */}
              <div id="about-founder">
                <AboutKanmaniClient />
              </div>

              {/* Company Info section wrapper */}
              <div id="about-company">
                {/* OUR STORY SECTION */}
                <div style={{
                  backgroundColor: '#FAFAF7',
                  padding: isMobile ? '48px 20px' : '80px 60px',
                  borderTop: '1px solid rgba(201,147,58,0.15)'
                }}>
                  <div style={{
                    maxWidth: '1300px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '40px' : '80px',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '11px',
                        fontWeight: '500',
                        letterSpacing: '0.28em',
                        color: '#C9933A',
                        textTransform: 'uppercase',
                        marginBottom: '16px'
                      }}>OUR STORY</p>
                      <h2 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(28px, 3vw, 42px)',
                        fontWeight: '500',
                        color: '#1C1917',
                        letterSpacing: '0.05em',
                        marginBottom: '8px'
                      }}>
                        Built on Two Decades of Trust
                      </h2>
                      <div style={{
                        width: '48px', height: '1px',
                        backgroundColor: '#C9933A', marginBottom: '24px'
                      }}/>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '18px',
                        color: '#2C2420',
                        lineHeight: '1.9',
                        marginBottom: '20px'
                      }}>
                        Kanmani Tours was born from a unique position — a deep 
                        understanding of both Japanese and Indian culture, built 
                        over more than two decades of living between two worlds.
                      </p>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '18px',
                        color: '#2C2420',
                        lineHeight: '1.9',
                        marginBottom: '20px'
                      }}>
                        We specialise exclusively in journeys for Japanese 
                        travellers visiting India. Every detail — from our 
                        Japanese-speaking guides to our carefully chosen 
                        accommodations — is designed with the Japanese traveller 
                        in mind.
                      </p>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '18px',
                        color: '#2C2420',
                        lineHeight: '1.9'
                      }}>
                        Our tours are small, personal, and meticulously crafted. 
                        We do not run large group buses. We create intimate 
                        experiences that leave lasting impressions.
                      </p>
                    </div>

                    {/* IMAGE PLACEHOLDER */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gridTemplateRows: '240px 240px',
                      gap: '8px'
                    }}>
                      {['Dr. Kanmani with\nJapanese guests', 'South India\nTemple Visit', 'Cultural\nExchange'].map((label, i) => (
                        <div key={i} style={{
                          backgroundColor: '#E8E4DC',
                          border: '1px solid #D4CFC9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: '8px',
                          gridColumn: i === 0 ? 'span 2' : 'span 1',
                          gridRow: i === 0 ? 'span 1' : 'span 1',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '10px',
                            letterSpacing: '0.2em',
                            color: '#9A948F',
                            textTransform: 'uppercase'
                          }}>Photo {i + 1}</div>
                          <div style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '14px',
                            color: '#6B6560',
                            textAlign: 'center',
                            whiteSpace: 'pre-line'
                          }}>{label}</div>

                          <img
                            src={`/assets/img/about/about-${i + 1}.jpg`}
                            alt={label.replace('\n', ' ')}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              zIndex: 3
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* VALUES SECTION */}
                <div style={{
                  backgroundColor: '#FAFAF7',
                  padding: isMobile ? '48px 20px' : '80px 60px',
                  borderTop: '1px solid rgba(201,147,58,0.15)'
                }}>
                  <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <p style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '11px',
                      fontWeight: '500',
                      letterSpacing: '0.28em',
                      color: '#C9933A',
                      textTransform: 'uppercase',
                      marginBottom: '16px'
                    }}>WHY CHOOSE US</p>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 'clamp(28px, 3vw, 42px)',
                      fontWeight: '500',
                      color: '#1C1917',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}>What Makes Us Different</h2>
                    <div style={{
                      width: '48px', height: '1px',
                      backgroundColor: '#C9933A', marginBottom: '48px'
                    }}/>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                      gap: isMobile ? '16px' : '2px'
                    }}>
                      {[
                        {
                          number: '01',
                          title: 'Japanese First',
                          body: 'Every aspect of our service is designed specifically for Japanese travellers. Our guides speak fluent Japanese, our communications are in Japanese, and we understand Japanese expectations of quality and service.'
                        },
                        {
                          number: '02',
                          title: 'Small Groups Only',
                          body: 'We cap every tour at 12 guests maximum. This means personalised attention, flexibility in the schedule, and a more authentic experience. You travel as a guest, not a number.'
                        },
                        {
                          number: '03',
                          title: 'Real Connections',
                          body: 'We do not just show you India — we connect you with it. Private temple access, family home visits, cooking with local chefs, and meeting artists in their studios. Real India, not tourist India.'
                        },
                        {
                          number: '04',
                          title: 'End-to-End Care',
                          body: 'From the moment you land in India to the moment you depart, we handle everything. Transfers, accommodation, meals, activities, and 24/7 emergency support throughout your journey.'
                        },
                        {
                          number: '05',
                          title: 'Two Decades of Trust',
                          body: 'Kanmani Tours was not built overnight. Our reputation has been earned through more than 25 years of consistently delivering extraordinary experiences for Japanese travellers.'
                        },
                        {
                          number: '06',
                          title: 'Cultural Bridge',
                          body: 'Our founder\'s unique position — Indian born, Japan educated — means we truly understand both cultures. We bridge the gap in a way no other tour company can.'
                        },
                      ].map(({ number, title, body }) => (
                        <div key={number} style={{
                          backgroundColor: '#FFFFFF',
                          padding: '40px 36px',
                          border: '1px solid #E8E4DC',
                          borderLeft: '3px solid #C9933A'
                        }}>
                          <div style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '11px',
                            color: '#C9933A',
                            letterSpacing: '0.22em',
                            marginBottom: '16px'
                          }}>{number}</div>
                          <h3 style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '22px',
                            fontWeight: '500',
                            color: '#1C1917',
                            letterSpacing: '0.04em',
                            marginBottom: '12px'
                          }}>{title}</h3>
                          <p style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '16px',
                            color: '#4A4540',
                            lineHeight: '1.7'
                          }}>{body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
