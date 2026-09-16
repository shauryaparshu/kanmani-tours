'use client';
import React from 'react';
import { Plane } from 'lucide-react';
import FlagIcon from './FlagIcon';

interface FlightRouteProps {
  from: 'india' | 'japan';
  to: 'india' | 'japan';
}

export default function FlightRoute({ from, to }: FlightRouteProps) {
  return (
    <div className="flight-route-container">
      <FlagIcon country={from} />
      
      <div className="flight-track">
        {/* The dashed curved line */}
        <svg className="flight-svg" viewBox="0 0 100 24" preserveAspectRatio="none">
          <path 
            d="M 0 16 Q 50 0 100 16" 
            fill="none" 
            stroke="#C9933A" 
            strokeWidth="1.5" 
            strokeOpacity="0.35" 
            strokeDasharray="4 4" 
          />
        </svg>
        
        {/* Mobile SVG for different viewbox (hidden on desktop) */}
        <svg className="flight-svg-mobile" viewBox="0 0 70 24" preserveAspectRatio="none">
          <path 
            d="M 0 16 Q 35 0 70 16" 
            fill="none" 
            stroke="#C9933A" 
            strokeWidth="1.5" 
            strokeOpacity="0.35" 
            strokeDasharray="4 4" 
          />
        </svg>

        {/* The animated plane */}
        <div className="plane-wrapper">
          <Plane size={14} color="#EBB14E" fill="#EBB14E" strokeWidth={1} />
        </div>
      </div>
      
      <FlagIcon country={to} />
      
      <style jsx>{`
        .flight-route-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          height: 32px;
          width: fit-content;
        }

        .flight-track {
          position: relative;
          width: 100px;
          height: 24px;
          display: flex;
          align-items: center;
        }

        .flight-svg {
          width: 100px;
          height: 24px;
          position: absolute;
          top: 0;
          left: 0;
        }

        .flight-svg-mobile {
          display: none;
          width: 70px;
          height: 24px;
          position: absolute;
          top: 0;
          left: 0;
        }

        .plane-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          /* Center the plane on the path point */
          transform: translate(-50%, -50%);
          offset-path: path('M 0 16 Q 50 0 100 16');
          offset-rotate: auto;
          animation: flyPlane 4s ease-in-out infinite;
        }

        @keyframes flyPlane {
          0% {
            offset-distance: 0%;
            opacity: 0;
          }
          10% {
            offset-distance: 10%;
            opacity: 1;
          }
          85% {
            offset-distance: 90%;
            opacity: 1;
          }
          95% {
            offset-distance: 100%;
            opacity: 0;
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .plane-wrapper {
            animation: none;
            offset-distance: 50%;
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .flight-track {
            width: 70px;
          }
          .flight-svg {
            display: none;
          }
          .flight-svg-mobile {
            display: block;
          }
          .plane-wrapper {
            offset-path: path('M 0 16 Q 35 0 70 16');
          }
          .flight-route-container {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
