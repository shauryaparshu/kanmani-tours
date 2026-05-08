'use client';

import React from 'react';
import Link from 'next/link';

interface MoreDetailsButtonProps {
  href: string;
}

export default function MoreDetailsButton({ href }: MoreDetailsButtonProps) {
  return (
    <Link 
      href={href} 
      style={{
        fontFamily: "'Jost', Arial, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.2em',
        color: '#C9933A',
        border: '1px solid #C9933A',
        padding: '12px 28px',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        textAlign: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#C9933A';
        e.currentTarget.style.color = '#1C1917';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#C9933A';
      }}
    >
      MORE DETAILS
    </Link>
  );
}
