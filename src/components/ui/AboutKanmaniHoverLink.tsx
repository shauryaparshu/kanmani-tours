'use client';

import Link from 'next/link';

export default function AboutKanmaniHoverLink() {
  return (
    <Link href="/about-kanmani" style={{
      display: 'block',
      fontFamily: "'Jost', Arial, sans-serif",
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.22em',
      color: '#1C1917',
      backgroundColor: '#C9933A',
      padding: '16px 24px',
      textDecoration: 'none',
      textTransform: 'uppercase',
      textAlign: 'center',
      transition: 'background-color 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#F5F1EB';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#C9933A';
    }}
    >
      Know More About Kanmani →
    </Link>
  );
}
