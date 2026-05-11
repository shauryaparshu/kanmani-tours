'use client';

import React from 'react';
import Link from 'next/link';

export default function FooterSection() {
  return (
    <footer style={{
      backgroundColor: '#111010',
      borderTop: '2px solid #C9933A',
      fontFamily: "'Jost', Arial, sans-serif"
    }}>
      {/* ROW 1 — MAIN FOOTER CONTENT */}
      <div style={{
        padding: '64px 60px 48px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '60px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        
        {/* COLUMN 1 — BRAND */}
        <div>
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="264" height="52" viewBox="0 0 200 52" aria-label="Kanmani Tours">
              <g transform="translate(22, 29) scale(1.2)">
                <path d="M0,-16 C2,-9 2,-4 0,0 C-2,-4 -2,-9 0,-16Z" fill="#C9933A" opacity="0.95" />
                <path d="M0,0 C-4,-7 -9,-8 -12,-6 C-8,-3 -4,-1 0,0Z" fill="#C9933A" opacity="0.80" />
                <path d="M0,0 C4,-7 9,-8 12,-6 C8,-3 4,-1 0,0Z" fill="#C9933A" opacity="0.80" />
                <path d="M0,0 C-5,-3 -13,-2 -16,2 C-11,4 -6,2 0,0Z" fill="#C9933A" opacity="0.50" />
                <path d="M0,0 C5,-3 13,-2 16,2 C11,4 6,2 0,0Z" fill="#C9933A" opacity="0.50" />
                <path d="M-9,4 Q0,9 9,4" stroke="#C9933A" strokeWidth="0.7" fill="none" opacity="0.75" />
                <line x1="-14" y1="7" x2="14" y2="7" stroke="#C9933A" strokeWidth="0.5" opacity="0.40" />
                <line x1="-10" y1="11" x2="10" y2="11" stroke="#C9933A" strokeWidth="0.4" opacity="0.25" />
              </g>
              <line x1="44" y1="8" x2="44" y2="44" stroke="#C9933A" strokeWidth="0.5" opacity="0.35" />
              <text x="54" y="32"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "34px", fontWeight: "400", letterSpacing: "0.13em", fill: "#F5F1EB" }}>
                  Kanmani
              </text>
              <line x1="54" y1="37" x2="188" y2="37" stroke="#C9933A" strokeWidth="0.5" opacity="0.60" />
              <text x="121" y="51" textAnchor="middle"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", fontWeight: "bold", letterSpacing: "0.3em", fill: "#C9933A" }}>
                  T O U R S
              </text>
            </svg>
          </Link>



          <div style={{
            width: '40px',
            height: '1px',
            backgroundColor: '#C9933A',
            margin: '20px 0'
          }} />

          <div>
            <div style={{ fontSize: '13px', color: '#FFFFFF', marginBottom: '12px' }}>+91 95977-16664</div>
            <div style={{ fontSize: '13px', color: '#FFFFFF', marginBottom: '12px' }}>kanmanitours@gmail.com</div>
            <div style={{ fontSize: '13px', color: '#FFFFFF', marginBottom: '12px' }}>Chennai, India</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            {[
              { 
                href: 'https://www.instagram.com/kanmani_tours',
                id: 'ig',
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                )
              },
              { 
                href: 'https://x.com/kanmanitours',
                id: 'x',
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )
              },
              { 
                href: 'https://youtube.com/@kanmanitours',
                id: 'yt',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
                  </svg>
                )
              },
              { 
                href: 'https://line.me/kanmanitours',
                id: 'ln',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2C6.48 2 2 5.92 2 10.72c0 3.2 1.88 6.01 4.72 7.67-.19.7-.69 2.55-.79 2.95-.12.5.18.49.38.36.16-.11 2.1-1.42 2.95-2C10.19 19.88 11.08 20 12 20c5.52 0 10-3.92 10-8.72S17.52 2 12 2z"/>
                  </svg>
                )
              }
            ].map((social) => (
              <a 
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  width: '36px',
                  height: '36px',
                  border: '1px solid rgba(201,147,58,0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C9933A';
                  e.currentTarget.style.color = '#C9933A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,147,58,0.25)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* COLUMN 2 — OUR TOURS */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.28em',
            color: '#C9933A',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            Our Tours
          </h3>
          <div style={{
            width: '32px',
            height: '1px',
            backgroundColor: '#C9933A',
            marginBottom: '24px'
          }} />
          {[
            { label: 'Celebrity Tours', href: '/tours' },
            { label: 'Cultural Tours', href: '/tours' },
            { label: 'Food Tours', href: '/tours' },
            { label: 'Short Tours', href: '/tours' },
            { label: 'Village Tours', href: '/tours' },
            { label: 'View All Tours', href: '/tours', highlight: true }
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: '13px',
                color: link.highlight ? '#C9933A' : '#FFFFFF',
                fontWeight: link.highlight ? '500' : '400',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '14px',
                letterSpacing: '0.04em',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#F5F1EB'}
              onMouseLeave={(e) => e.currentTarget.style.color = link.highlight ? '#C9933A' : '#FFFFFF'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* COLUMN 3 — QUICK LINKS */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.28em',
            color: '#C9933A',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            Quick Links
          </h3>
          <div style={{
            width: '32px',
            height: '1px',
            backgroundColor: '#C9933A',
            marginBottom: '24px'
          }} />
          {[
            { label: 'Home', href: '/' },
            { label: 'About Us', href: '/about' },
            { label: 'Gallery', href: '/gallery' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact', href: '/contact' },
            { label: 'Services', href: '/services' },
            { label: 'About Kanmani', href: '/about-kanmani' }
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: '13px',
                color: '#FFFFFF',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '14px',
                letterSpacing: '0.04em',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#F5F1EB'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* COLUMN 4 — VISIT US */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.28em',
            color: '#C9933A',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            Visit Us
          </h3>
          <div style={{
            width: '32px',
            height: '1px',
            backgroundColor: '#C9933A',
            marginBottom: '24px'
          }} />

          {/* Block 1 */}
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C9933A', marginBottom: '6px' }}>
              INDIA OFFICE
            </div>
            <div style={{ fontSize: '13px', color: '#FFFFFF' }}>Anna Nagar</div>
            <div style={{ fontSize: '13px', color: '#FFFFFF' }}>Chennai, India</div>
            <div style={{ fontSize: '11px', color: '#FFFFFF', marginTop: '4px' }}>Mon–Sat · 9:00–18:00 IST</div>
          </div>



          {/* Contact CTA */}
          <div style={{
            padding: '16px 20px',
            border: '1px solid rgba(201,147,58,0.2)',
            borderLeft: '3px solid #C9933A',
            marginTop: '24px'
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '15px',
              color: '#F5F1EB',
              marginBottom: '6px'
            }}>
              Need help planning?
            </div>
            <div style={{
              fontSize: '11px',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Our team responds in Japanese
            </div>
            <Link href="/contact" style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.18em',
              color: '#C9933A',
              textDecoration: 'none',
              textTransform: 'uppercase',
              display: 'inline-block',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#F5F1EB'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#C9933A'}
            >
              GET IN TOUCH →
            </Link>
          </div>

        </div>
      </div>

      {/* ROW 2 — THIN DIVIDER */}
      <div style={{
        borderTop: '1px solid rgba(201,147,58,0.1)',
        maxWidth: '1400px',
        margin: '0 auto'
      }} />

      {/* ROW 3 — BOTTOM BAR */}
      <div style={{
        padding: '20px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#FFFFFF',
          letterSpacing: '0.04em'
        }}>
          © 2026 Kanmani Tours. All rights reserved.
        </div>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' }
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: '12px',
                color: '#FFFFFF',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#C9933A'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
