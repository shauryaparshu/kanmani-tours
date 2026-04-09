'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface FaqItem {
  _id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_CATEGORIES = [
  { value: 'booking',    label: 'Booking & Payment',         star: false },
  { value: 'visa',       label: 'Visa & Travel Documents',   star: false },
  { value: 'experience', label: 'The Tour Experience',       star: false },
  { value: 'health',     label: 'Safety & Health',           star: false },
  { value: 'money',      label: 'Money & Practical',         star: false },
  { value: 'weather',    label: 'Weather & Timing',          star: false },
  { value: 'celebrity',  label: 'Celebrity & Special Tours', star: true  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid',
        borderColor: hovered ? '#d49a36' : '#eaeaea',
        borderRadius: '8px',
        marginBottom: '1rem',
        padding: '0',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        overflow: 'hidden'
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '24px'
        }}
      >
        <span style={{
          fontFamily: "'Jost', Arial, sans-serif",
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#1a1918',
          lineHeight: '1.5',
          letterSpacing: '0.02em'
        }}>
          {question}
        </span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#d49a36" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          padding: '0 2rem 1.5rem 2rem',
        }}>
          <p style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: '400',
            color: '#4a4a4a',
            lineHeight: '1.7',
            margin: '0'
          }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqPageClient({ faqs }: { faqs: FaqItem[] }) {
  const [activeCategory, setActiveCategory] = useState('booking');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      let current = 'booking';
      FAQ_CATEGORIES.forEach(({ value }) => {
        const section = sectionRefs.current[value];
        if (section && section.offsetTop <= scrollPosition) {
          current = value;
        }
      });
      setActiveCategory(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (value: string) => {
    setActiveCategory(value);
    const section = sectionRefs.current[value];
    if (section) {
      const offset = 100;
      const top = section.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const groupedFaqs = FAQ_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = faqs.filter(f => f.category === cat.value);
    return acc;
  }, {} as { [key: string]: FaqItem[] });

  return (
    <>
      {/* HERO */}
      <div style={{
        backgroundColor: '#1C1917',
        padding: '3rem 0',
        borderBottom: '1px solid rgba(201,147,58,0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 60px' }}>
          <div style={{ maxWidth: '800px' }}>
            <p style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '11px',
              fontWeight: '500',
              letterSpacing: '0.32em',
              color: '#C9933A',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              HELP & INFORMATION
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: '500',
              color: '#F5F1EB',
              letterSpacing: '0.05em',
              lineHeight: '1.15',
              marginBottom: '20px'
            }}>
              Everything You Need to Know
            </h1>
            <div style={{
              width: '56px', height: '1px',
              backgroundColor: '#C9933A',
              marginBottom: '20px'
            }}/>
            <p style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '16px',
              fontWeight: '300',
              color: '#faf9f6',
              lineHeight: '1.7',
              maxWidth: '560px'
            }}>
              Your questions about traveling from Japan to India, answered. 
              Can't find what you're looking for?{' '}
              <Link href="/contact" style={{ color: '#C9933A', textDecoration: 'none' }}>
                Contact us directly.
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{
        backgroundColor: '#FAFAF7',
        minHeight: '100vh',
        paddingTop: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '28% 65%',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>

          {/* STICKY SIDEBAR */}
          <div
            ref={sidebarRef}
            style={{
              width: '100%',
              maxWidth: '280px',
              flexShrink: 0,
              position: 'sticky',
              top: '100px',
              padding: '48px 0',
              alignSelf: 'flex-start'
            }}
          >
            <p style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.28em',
              color: '#9A948F',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              CATEGORIES
            </p>
            <nav>
              {FAQ_CATEGORIES.map(({ value, label, star }) => {
                const isActive = activeCategory === value;
                const count = groupedFaqs[value]?.length || 0;
                return (
                  <button
                    key={value}
                    onClick={() => scrollToCategory(value)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: isActive ? '10px 16px 10px 1rem' : '10px 16px 10px 12px',
                      background: 'none',
                      border: 'none',
                      borderLeft: isActive
                        ? '3px solid #d49a36'
                        : '3px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginBottom: '1.25rem',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      zIndex: 10
                    }}
                  >
                    <span style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '1.1rem',
                      fontWeight: isActive ? '600' : '400',
                      color: isActive ? '#d49a36' : '#6B6560',
                      letterSpacing: '0.04em',
                      lineHeight: '1.4',
                      transition: 'color 0.25s ease',
                      flex: 1,
                      marginRight: '12px'
                    }}>
                      {(() => {
                        const words = label.split(' ');
                        const lastWord = words.pop();
                        const mainText = words.join(' ');
                        return (
                          <>
                            {mainText} 
                            <span style={{ whiteSpace: 'nowrap' }}>
                              &nbsp;{lastWord}
                              {star && (
                                <span style={{
                                  color: '#d49a36',
                                  marginLeft: '6px',
                                  fontSize: '11px'
                                }}>★</span>
                              )}
                            </span>
                          </>
                        );
                      })()}
                    </span>
                    {count > 0 && (
                      <span style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '12px',
                        color: '#1a1918',
                        backgroundColor: '#f5f1eb',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontWeight: '500',
                        marginTop: '2px'
                      }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Contact box */}
            <div style={{
              marginTop: '56px',
              padding: '2.5rem',
              backgroundColor: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.4rem',
                fontWeight: '500',
                color: '#1C1917',
                marginBottom: '12px'
              }}>
                Still have questions?
              </p>
              <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '1.05rem',
                color: '#6B6560',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Our team speaks Japanese and is happy to help.
              </p>
              <Link href="/contact" style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.2em',
                color: '#1a1918',
                backgroundColor: '#d49a36',
                padding: '10px 16px',
                textDecoration: 'none',
                textTransform: 'uppercase',
                display: 'inline-block'
              }}>
                Contact Us
              </Link>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div style={{
            padding: '48px 0 80px 0',
          }}>
            {FAQ_CATEGORIES.map(({ value, label, star }) => {
              const categoryFaqs = groupedFaqs[value] || [];
              if (categoryFaqs.length === 0) return null;
              return (
                <section
                  key={value}
                  ref={el => { sectionRefs.current[value] = el; }}
                  style={{ marginBottom: '72px' }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 'clamp(24px, 2.5vw, 36px)',
                      fontWeight: '500',
                      color: '#1C1917',
                      letterSpacing: '0.05em',
                      margin: '0'
                    }}>
                      {label}
                    </h2>
                    {star && (
                      <span style={{
                        color: '#d49a36',
                        fontSize: '18px'
                      }}>★</span>
                    )}
                  </div>
                  <div style={{
                    width: '100%', 
                    height: '1px',
                    backgroundColor: '#d49a36',
                    opacity: 0.3,
                    marginBottom: '32px'
                  }}/>
                  <div>
                    {categoryFaqs.map((faq) => (
                      <AccordionItem
                        key={faq._id}
                        question={faq.question}
                        answer={faq.answer}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Empty state */}
            {faqs.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '80px 0'
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '22px',
                  color: '#9A948F',
                  fontStyle: 'italic'
                }}>
                  FAQs are being added. Check back soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
