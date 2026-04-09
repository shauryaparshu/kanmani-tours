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
  return (
    <div style={{
      borderBottom: '1px solid #E8E4DC',
      padding: '0'
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '24px'
        }}
      >
        <span style={{
          fontFamily: "'Jost', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: '500',
          color: '#1C1917',
          lineHeight: '1.5',
          letterSpacing: '0.02em'
        }}>
          {question}
        </span>
        <span style={{
          color: '#C9933A',
          fontSize: '20px',
          flexShrink: 0,
          marginTop: '2px',
          transition: 'transform 0.3s ease',
          display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)'
        }}>+</span>
      </button>
      {open && (
        <div style={{
          paddingBottom: '24px',
          paddingRight: '48px'
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '18px',
            fontWeight: '400',
            color: '#4A4540',
            lineHeight: '1.8',
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
        padding: '80px 60px 72px',
        borderBottom: '1px solid rgba(201,147,58,0.2)'
      }}>
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
            color: '#9A948F',
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

      {/* MAIN LAYOUT */}
      <div style={{
        backgroundColor: '#FAFAF7',
        display: 'flex',
        alignItems: 'flex-start',
        minHeight: '100vh'
      }}>

        {/* STICKY SIDEBAR */}
        <div
          ref={sidebarRef}
          style={{
            width: '280px',
            flexShrink: 0,
            position: 'sticky',
            top: '80px',
            padding: '48px 0 48px 60px',
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 16px 10px 12px',
                    background: 'none',
                    border: 'none',
                    borderLeft: isActive
                      ? '2px solid #C9933A'
                      : '2px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '4px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '13px',
                    fontWeight: isActive ? '500' : '400',
                    color: isActive ? '#C9933A' : '#6B6560',
                    letterSpacing: '0.04em',
                    transition: 'color 0.25s ease'
                  }}>
                    {label}
                    {star && (
                      <span style={{
                        color: '#C9933A',
                        marginLeft: '6px',
                        fontSize: '11px'
                      }}>★</span>
                    )}
                  </span>
                  {count > 0 && (
                    <span style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '11px',
                      color: isActive ? '#C9933A' : '#C8C2BC',
                      fontWeight: '400'
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
            marginTop: '40px',
            padding: '20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E4DC',
            borderLeft: '3px solid #C9933A'
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '16px',
              fontWeight: '500',
              color: '#1C1917',
              marginBottom: '8px'
            }}>
              Still have questions?
            </p>
            <p style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '12px',
              color: '#6B6560',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Our team speaks Japanese and is happy to help.
            </p>
            <Link href="/contact" style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.2em',
              color: '#1C1917',
              backgroundColor: '#C9933A',
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
          flex: 1,
          padding: '48px 60px 80px 60px',
          maxWidth: '900px'
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
                      color: '#C9933A',
                      fontSize: '18px'
                    }}>★</span>
                  )}
                </div>
                <div style={{
                  width: '48px', height: '1px',
                  backgroundColor: '#C9933A',
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
    </>
  );
}
