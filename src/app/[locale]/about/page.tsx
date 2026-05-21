"use client";

import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/FooterSection';
import AboutKanmaniHoverLink from '@/components/ui/AboutKanmaniHoverLink';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>

        {/* HERO SECTION */}
        <div style={{
          backgroundColor: '#1C1917',
          padding: '80px 60px 72px',
          borderBottom: '1px solid rgba(201,147,58,0.2)'
        }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <div style={{ maxWidth: '800px', marginBottom: '64px' }}>
              <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.32em',
                color: '#C9933A',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>WHO WE ARE</p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: '500',
                color: '#F5F1EB',
                letterSpacing: '0.05em',
                lineHeight: '1.15',
                marginBottom: '16px'
              }}>
                Connecting Japan and India Through Extraordinary Journeys
              </h1>
              <div style={{
                width: '56px', height: '1px',
                backgroundColor: '#C9933A', marginBottom: '20px'
              }}/>
              <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '16px',
                fontWeight: '300',
                color: '#9A948F',
                lineHeight: '1.7',
                maxWidth: '580px'
              }}>
                Kanmani Tours was founded on a simple belief — that travel 
                changes people. We create journeys from Japan to India that 
                go beyond sightseeing and into the heart of one of the 
                world's most extraordinary civilisations.
              </p>
            </div>

            {/* INTEGRATED STATS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '40px',
              borderTop: '1px solid rgba(201,147,58,0.15)',
              paddingTop: '48px'
            }}>
              {[
                { number: '25+', label: 'Years of Experience' },
                { number: '500+', label: 'Japanese Travellers Served' },
                { number: '50+', label: 'Tours Completed' },
                { number: '100%', label: 'Japanese Speaking Team' },
              ].map(({ number, label }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: 'clamp(32px, 3.5vw, 48px)',
                    fontWeight: '300',
                    color: '#C9933A',
                    letterSpacing: '0.04em',
                    marginBottom: '8px'
                  }}>{number}</div>
                  <div style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '12px',
                    fontWeight: '400',
                    color: '#9A948F',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase'
                  }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHAT WE ARE SECTION */}
        <div style={{
          backgroundColor: '#FAFAF7',
          padding: '80px 60px'
        }}>
          <div style={{
            maxWidth: '1300px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
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
              {['Dr. Kanmani with\nJapanese guests', 'South India\nTemple Visit', 'Cultural\nExchange', 'Team\nPhoto'].map((label, i) => (
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

        {/* FOUNDER SECTION */}
        <div style={{
          backgroundColor: '#1C1917',
          padding: '80px 60px',
          borderTop: '1px solid rgba(201,147,58,0.2)'
        }}>
          <div style={{
            maxWidth: '1300px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '72px',
            alignItems: 'center'
          }}>
            {/* Founder image placeholder */}
            <div>
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#2C2420',
                border: '1px solid rgba(201,147,58,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: '#6B6560',
                  textTransform: 'uppercase'
                }}>Founder Photo</div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '16px',
                  color: '#9A948F',
                  fontStyle: 'italic'
                }}>Dr. Kanmani</div>

                <img
                  src="/assets/img/about/founder.jpg"
                  alt="Dr. Kanmani - Founder"
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
              <AboutKanmaniHoverLink />
            </div>

            <div>
              <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.28em',
                color: '#C9933A',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>THE FOUNDER</p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(28px, 3vw, 44px)',
                fontWeight: '500',
                color: '#F5F1EB',
                letterSpacing: '0.05em',
                marginBottom: '8px'
              }}>Meet Kanmani</h2>
              <div style={{
                width: '48px', height: '1px',
                backgroundColor: '#C9933A', marginBottom: '28px'
              }}/>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '20px',
                fontWeight: '400',
                fontStyle: 'italic',
                color: '#C9933A',
                lineHeight: '1.6',
                marginBottom: '24px',
                letterSpacing: '0.02em'
              }}>
                "I came to Japan as a student and fell in love with two 
                countries at once. Kanmani Tours is my way of sharing 
                both with the world."
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '18px',
                color: '#D4CFC9',
                lineHeight: '1.9',
                marginBottom: '20px'
              }}>
                Born in India, Dr. Kanmani came to Japan to pursue her PhD 
                and never quite left. Over more than two decades living 
                between two extraordinary countries, she built deep 
                relationships in both cultures and discovered a calling — 
                helping Japanese people truly experience India.
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '18px',
                color: '#D4CFC9',
                lineHeight: '1.9',
                marginBottom: '32px'
              }}>
                She has worked alongside prominent figures in both 
                countries, built a reputation for uncompromising quality, 
                and personally guided hundreds of Japanese travellers 
                through the wonders of the Indian subcontinent.
              </p>
              <Link href="/about-kanmani" style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.22em',
                color: '#C9933A',
                textDecoration: 'none',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(201,147,58,0.4)',
                paddingBottom: '2px'
              }}>
                Read Her Full Story →
              </Link>
            </div>
          </div>
        </div>

        {/* VALUES SECTION */}
        <div style={{
          backgroundColor: '#FAFAF7',
          padding: '80px 60px',
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
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px'
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

      </main>
      <Footer />
    </>
  );
}
