'use client';

import { useState } from 'react';
import Link from 'next/link';

const timelineEvents = [
  {
    year: '1998',
    title: 'Arrival in Japan',
    description: 'Dr. Kanmani arrives in Japan from India to begin her postgraduate studies. Her first encounter with Japanese culture — its precision, its beauty, its depth — leaves a profound impression.',
    imageLabel: 'Arrival in Japan — 1998'
  },
  {
    year: '2001',
    title: 'PhD Research Begins',
    description: 'Begins her doctoral research, immersing herself in Japanese academic life while maintaining her deep connection to Indian culture. She becomes a bridge between two worlds.',
    imageLabel: 'University Life — 2001'
  },
  {
    year: '2004',
    title: 'First Cultural Exchange',
    description: 'Organises her first informal cultural exchange — bringing a small group of Japanese colleagues to experience India. The journey changes everyone involved and plants the seed for what becomes Kanmani Tours.',
    imageLabel: 'First Group — 2004'
  },
  {
    year: '2006',
    title: 'PhD Completed',
    description: 'Completes her doctorate, earning recognition from her institution. Begins collaborating with prominent figures in both Japanese and Indian cultural circles.',
    imageLabel: 'Graduation — 2006'
  },
  {
    year: '2008',
    title: 'Kanmani Tours Founded',
    description: 'After years of informal tours and countless requests from Japanese friends, colleagues and acquaintances, Dr. Kanmani formally establishes Kanmani Tours. The first official tour departs in December.',
    imageLabel: 'First Official Tour — 2008'
  },
  {
    year: '2010',
    title: 'Celebrity Tour Breakthrough',
    description: 'Facilitates the first celebrity meet-and-greet experience for Japanese fans visiting South India. The tour becomes the most talked-about Japanese travel experience of the year.',
    imageLabel: 'Celebrity Tour — 2010'
  },
  {
    year: '2013',
    title: 'Expanding Across India',
    description: 'Expands the tour portfolio beyond South India to include Rajasthan, Kerala, and the Himalayan foothills. Develops partnerships with heritage properties and boutique hotels across the country.',
    imageLabel: 'Rajasthan Tour — 2013'
  },
  {
    year: '2016',
    title: 'Recognition & Awards',
    description: 'Dr. Kanmani and her work are recognised by prominent organisations in both Japan and India for her contribution to cultural exchange and responsible tourism.',
    imageLabel: 'Award Ceremony — 2016'
  },
  {
    year: '2019',
    title: 'Japanese Media Feature',
    description: 'Featured in major Japanese travel publications and television programmes as the go-to expert on Indian travel for Japanese tourists. Demand for tours reaches an all-time high.',
    imageLabel: 'Media Feature — 2019'
  },
  {
    year: '2022',
    title: 'Post-Pandemic Revival',
    description: 'After the global pause, Dr. Kanmani leads the revival of Japan-India travel with entirely redesigned tour experiences — smaller groups, deeper cultural immersion, and enhanced safety standards.',
    imageLabel: 'Revival Tour — 2022'
  },
  {
    year: '2024',
    title: 'Website & Digital Presence',
    description: 'Launches the new Kanmani Tours website, making it easier than ever for Japanese travellers to discover, explore, and book extraordinary India experiences online.',
    imageLabel: 'Digital Launch — 2024'
  },
  {
    year: '2026',
    title: 'The Journey Continues',
    description: 'With new tours, new destinations, and the same unwavering commitment to quality and cultural authenticity, the story of Kanmani Tours continues — one extraordinary journey at a time.',
    imageLabel: 'Present Day — 2026'
  },
];

export default function AboutKanmaniClient() {
  const [activeYear, setActiveYear] = useState<string | null>(null);

  return (
    <main>
      {/* HERO — Full bleed dark */}
      <div style={{
        backgroundColor: '#1C1917',
        padding: '100px 60px 80px',
        borderBottom: '1px solid rgba(201,147,58,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* decorative gold circle */}
        <div style={{
          position: 'absolute',
          right: '-100px',
          top: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          border: '1px solid rgba(201,147,58,0.08)',
          pointerEvents: 'none'
        }}/>
        <div style={{
          position: 'absolute',
          right: '-60px',
          top: '-60px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          border: '1px solid rgba(201,147,58,0.05)',
          pointerEvents: 'none'
        }}/>

        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <Link href="/about" style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '11px',
            fontWeight: '400',
            letterSpacing: '0.22em',
            color: '#6B6560',
            textDecoration: 'none',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px'
          }}>
            ← Back to About
          </Link>
          <p style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.32em',
            color: '#C9933A',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>THE FOUNDER</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(48px, 7vw, 88px)',
            fontWeight: '400',
            color: '#F5F1EB',
            letterSpacing: '0.08em',
            lineHeight: '1.1',
            marginBottom: '8px'
          }}>Dr. Kanmani</h1>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            fontWeight: '300',
            fontStyle: 'italic',
            color: '#C9933A',
            letterSpacing: '0.06em',
            marginBottom: '32px'
          }}>
            Founder & Lead Experience Designer, Kanmani Tours
          </h2>
          <div style={{
            width: '56px', height: '1px',
            backgroundColor: '#C9933A', marginBottom: '28px'
          }}/>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: '400',
            fontStyle: 'italic',
            color: '#D4CFC9',
            lineHeight: '1.7',
            maxWidth: '640px'
          }}>
            "I came to Japan as a student carrying one suitcase and 
            a curiosity about the world. I never expected to spend 
            the next 25 years building bridges between two of the 
            most beautiful cultures on earth."
          </p>
        </div>
      </div>

      {/* PORTRAIT SECTION */}
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
          alignItems: 'start'
        }}>
          {/* LEFT — large portrait + secondary image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Main portrait */}
            <div style={{
              width: '100%',
              height: '520px',
              backgroundColor: '#E8E4DC',
              border: '1px solid #D4CFC9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#9A948F',
                textTransform: 'uppercase'
              }}>Image 1</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '16px',
                color: '#6B6560',
                fontStyle: 'italic'
              }}>Main Portrait of Dr. Kanmani</div>

              <img
                src="/assets/img/about-kanmani/founder-large.jpg"
                alt="Main Portrait of Dr. Kanmani"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 2
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                backgroundColor: 'rgba(28,25,23,0.75)',
                padding: '8px 16px',
                backdropFilter: 'blur(4px)',
                zIndex: 10
              }}>
                <p style={{
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  color: '#C9933A',
                  margin: 0,
                  textTransform: 'uppercase'
                }}>Dr. Kanmani · Founder</p>
              </div>
            </div>
            {/* Two secondary images */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['Image 2 — With Japanese guests in India', 'Image 3 — At a cultural ceremony'].map((label, i) => (
                <div key={i} style={{
                  height: '200px',
                  backgroundColor: '#E8E4DC',
                  border: '1px solid #D4CFC9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '16px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    color: '#9A948F',
                    textTransform: 'uppercase'
                  }}>Photo {i + 2}</div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '13px',
                    color: '#6B6560',
                    fontStyle: 'italic'
                  }}>{label}</div>

                  <img
                    src={`/assets/img/about-kanmani/secondary-${i + 1}.jpg`}
                    alt={label}
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

          {/* RIGHT — Bio text */}
          <div style={{ paddingTop: '16px' }}>
            <p style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '11px',
              fontWeight: '500',
              letterSpacing: '0.28em',
              color: '#C9933A',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>HER STORY</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(28px, 3vw, 40px)',
              fontWeight: '500',
              color: '#1C1917',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>From India to Japan — and Back Again</h2>
            <div style={{
              width: '48px', height: '1px',
              backgroundColor: '#C9933A', marginBottom: '28px'
            }}/>
            {[
              'Dr. Kanmani grew up in India with an insatiable curiosity about the world beyond her borders. In 1998, that curiosity carried her across continents to Japan, where she arrived as a student and began what would become a lifelong love affair with Japanese culture.',
              'Japan, with its extraordinary precision, its aesthetic philosophy, its deep respect for craft and tradition — it resonated with Dr. Kanmani in ways she had not anticipated. She stayed. She studied. She completed her PhD. And all the while, she carried India within her.',
              'Over the years, she worked alongside prominent academics, cultural figures, and business leaders in both countries. She became known as someone who truly understood both worlds — their values, their aesthetics, their people.',
              'The idea for Kanmani Tours grew organically. Japanese colleagues and friends would ask her: "Can you take us to India? The real India?" She did. And those journeys changed people. They still do.',
              'Today, Dr. Kanmani personally oversees every tour — the itinerary, the guides, the accommodations, the experiences. Her name is on the door, and she means it.',
            ].map((paragraph, i) => (
              <p key={i} style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '18px',
                color: i === 0 ? '#1C1917' : '#2C2420',
                lineHeight: '1.9',
                marginBottom: '20px',
                fontWeight: i === 0 ? '500' : '400'
              }}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {/* PHOTO GRID — more images */}
      <div style={{
        backgroundColor: '#1C1917',
        padding: '80px 60px'
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
          }}>THROUGH THE YEARS</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: '500',
            color: '#F5F1EB',
            letterSpacing: '0.05em',
            marginBottom: '8px'
          }}>Moments That Matter</h2>
          <div style={{
            width: '48px', height: '1px',
            backgroundColor: '#C9933A', marginBottom: '40px'
          }}/>

          {/* Masonry-style grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'auto',
            gap: '8px'
          }}>
            {[
              { label: 'Image 4 — First tour group, 2008', tall: true },
              { label: 'Image 5 — Meenakshi Temple visit', tall: false },
              { label: 'Image 6 — Celebrity meet, 2010', tall: false },
              { label: 'Image 7 — Rajasthan expedition', tall: false },
              { label: 'Image 8 — Japanese guests at Mahabalipuram', tall: true },
              { label: 'Image 9 — Award ceremony', tall: false },
              { label: 'Image 10 — Cooking class experience', tall: false },
              { label: 'Image 11 — Kerala backwaters', tall: false },
              { label: 'Image 12 — Recent tour 2024', tall: false },
            ].map(({ label, tall }, i) => (
              <div key={i} style={{
                height: tall ? '360px' : '240px',
                backgroundColor: '#2C2420',
                border: '1px solid rgba(201,147,58,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '8px',
                padding: '20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: '#6B6560',
                  textTransform: 'uppercase'
                }}>Photo {i + 4}</div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '13px',
                  color: '#9A948F',
                  fontStyle: 'italic'
                }}>{label}</div>

                <img
                  src={`/assets/img/about-kanmani/gallery-${i + 1}.jpg`}
                  alt={label}
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

      {/* TIMELINE SECTION */}
      <div style={{
        backgroundColor: '#FAFAF7',
        padding: '80px 60px'
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
          }}>1998 — 2026</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: '500',
            color: '#1C1917',
            letterSpacing: '0.05em',
            marginBottom: '8px'
          }}>A Journey Through Time</h2>
          <div style={{
            width: '48px', height: '1px',
            backgroundColor: '#C9933A', marginBottom: '56px'
          }}/>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              bottom: '0',
              width: '1px',
              backgroundColor: '#E8E4DC',
              transform: 'translateX(-50%)'
            }}/>

            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              const isActive = activeYear === event.year;
              return (
                <div
                  key={event.year}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 1fr',
                    gap: '0',
                    marginBottom: '48px',
                    alignItems: 'start'
                  }}
                >
                  {/* Left content */}
                  <div style={{
                    padding: '0 40px 0 0',
                    textAlign: 'right',
                    opacity: isLeft ? 1 : 0,
                    pointerEvents: isLeft ? 'auto' : 'none'
                  }}>
                    {isLeft && (
                      <>
                        <div style={{
                          height: '200px',
                          backgroundColor: isActive ? '#1C1917' : '#E8E4DC',
                          border: `1px solid ${isActive ? '#C9933A' : '#D4CFC9'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: '6px',
                          marginBottom: '16px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onClick={() => setActiveYear(isActive ? null : event.year)}
                        >
                          <img
                            src={`/assets/img/about-kanmani/timeline-${event.year}.jpg`}
                            alt={event.imageLabel}
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
                          <div style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '10px',
                            letterSpacing: '0.16em',
                            color: isActive ? '#C9933A' : '#9A948F',
                            textTransform: 'uppercase'
                          }}>{event.year}</div>
                          <div style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '13px',
                            color: isActive ? '#D4CFC9' : '#6B6560',
                            fontStyle: 'italic',
                            padding: '0 16px',
                            textAlign: 'center'
                          }}>{event.imageLabel}</div>
                        </div>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '22px',
                          fontWeight: '500',
                          color: '#1C1917',
                          marginBottom: '8px'
                        }}>{event.title}</h3>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '16px',
                          color: '#4A4540',
                          lineHeight: '1.7'
                        }}>{event.description}</p>
                      </>
                    )}
                  </div>

                  {/* Center — year marker */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '80px'
                  }}>
                    <div
                      onClick={() => setActiveYear(isActive ? null : event.year)}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? '#C9933A' : '#FFFFFF',
                        border: `2px solid ${isActive ? '#C9933A' : '#E8E4DC'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        zIndex: 1,
                        position: 'relative'
                      }}
                    >
                      <span style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '10px',
                        fontWeight: '600',
                        color: isActive ? '#1C1917' : '#9A948F',
                        letterSpacing: '0.06em'
                      }}>{event.year.slice(2)}</span>
                    </div>
                  </div>

                  {/* Right content */}
                  <div style={{
                    padding: '0 0 0 40px',
                    opacity: !isLeft ? 1 : 0,
                    pointerEvents: !isLeft ? 'auto' : 'none'
                  }}>
                    {!isLeft && (
                      <>
                        <div style={{
                          height: '200px',
                          backgroundColor: isActive ? '#1C1917' : '#E8E4DC',
                          border: `1px solid ${isActive ? '#C9933A' : '#D4CFC9'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: '6px',
                          marginBottom: '16px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onClick={() => setActiveYear(isActive ? null : event.year)}
                        >
                          <img
                            src={`/assets/img/about-kanmani/timeline-${event.year}.jpg`}
                            alt={event.imageLabel}
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
                          <div style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '10px',
                            letterSpacing: '0.16em',
                            color: isActive ? '#C9933A' : '#9A948F',
                            textTransform: 'uppercase'
                          }}>{event.year}</div>
                          <div style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '13px',
                            color: isActive ? '#D4CFC9' : '#6B6560',
                            fontStyle: 'italic',
                            padding: '0 16px',
                            textAlign: 'center'
                          }}>{event.imageLabel}</div>
                        </div>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '22px',
                          fontWeight: '500',
                          color: '#1C1917',
                          marginBottom: '8px'
                        }}>{event.title}</h3>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '16px',
                          color: '#4A4540',
                          lineHeight: '1.7'
                        }}>{event.description}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CLOSING CTA */}
      <div style={{
        backgroundColor: '#1C1917',
        padding: '80px 60px',
        textAlign: 'center',
        borderTop: '1px solid rgba(201,147,58,0.2)'
      }}>
        <p style={{
          fontFamily: "'Jost', Arial, sans-serif",
          fontSize: '11px',
          fontWeight: '500',
          letterSpacing: '0.32em',
          color: '#C9933A',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>BEGIN YOUR JOURNEY</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: '400',
          fontStyle: 'italic',
          color: '#F5F1EB',
          letterSpacing: '0.05em',
          marginBottom: '32px',
          maxWidth: '700px',
          margin: '0 auto 32px'
        }}>
          Ready to experience India the way Kanmani does?
        </h2>
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/tours" style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.28em',
            color: '#1C1917',
            backgroundColor: '#C9933A',
            padding: '18px 48px',
            textDecoration: 'none',
            textTransform: 'uppercase'
          }}>Explore Tours</Link>
          <Link href="/contact" style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.28em',
            color: '#F5F1EB',
            backgroundColor: 'transparent',
            border: '1px solid rgba(201,147,58,0.4)',
            padding: '18px 48px',
            textDecoration: 'none',
            textTransform: 'uppercase'
          }}>Contact Us</Link>
        </div>
      </div>
    </main>
  );
}
