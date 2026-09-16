import React from 'react';

interface FlagIconProps {
  country: 'india' | 'japan';
}

export default function FlagIcon({ country }: FlagIconProps) {
  return (
    <div className="flag-icon-wrapper">
      {country === 'india' && (
        <svg viewBox="0 0 28 20" className="flag-svg" width="28" height="20" aria-label="Flag of India">
          {/* Saffron */}
          <rect x="0" y="0" width="28" height="6.67" fill="#FF9933" />
          {/* White */}
          <rect x="0" y="6.67" width="28" height="6.66" fill="#FFFFFF" />
          {/* Green */}
          <rect x="0" y="13.33" width="28" height="6.67" fill="#138808" />
          
          {/* Ashoka Chakra */}
          <g transform="translate(14, 10)" stroke="#000080" strokeWidth="0.4">
            <circle cx="0" cy="0" r="2.6" fill="none" strokeWidth="0.6" />
            <circle cx="0" cy="0" r="0.6" fill="#000080" />
            <line x1="0" y1="-2.6" x2="0" y2="2.6" />
            <line x1="-2.6" y1="0" x2="2.6" y2="0" />
            <line x1="-1.84" y1="-1.84" x2="1.84" y2="1.84" />
            <line x1="-1.84" y1="1.84" x2="1.84" y2="-1.84" />
            <line x1="-1" y1="-2.4" x2="1" y2="2.4" />
            <line x1="-2.4" y1="-1" x2="2.4" y2="1" />
            <line x1="1" y1="-2.4" x2="-1" y2="2.4" />
            <line x1="2.4" y1="-1" x2="-2.4" y2="1" />
          </g>
        </svg>
      )}

      {country === 'japan' && (
        <svg viewBox="0 0 28 20" className="flag-svg" width="28" height="20" aria-label="Flag of Japan">
          <rect x="0" y="0" width="28" height="20" fill="#FFFFFF" />
          <circle cx="14" cy="10" r="6" fill="#BC002D" />
        </svg>
      )}

      <style jsx>{`
        .flag-icon-wrapper {
          display: inline-flex;
          border-radius: 2px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: waveFlag 3s ease-in-out infinite alternate;
          transform-origin: left center;
        }
        .flag-svg {
          display: block;
        }

        @keyframes waveFlag {
          0% {
            transform: skewY(-1.5deg);
          }
          100% {
            transform: skewY(1.5deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .flag-icon-wrapper {
            animation: none;
            transform: none;
          }
        }

        @media (max-width: 768px) {
          .flag-icon-wrapper {
            width: 22px;
            height: 16px;
          }
          .flag-svg {
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}
