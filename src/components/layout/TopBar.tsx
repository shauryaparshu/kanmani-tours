// NOTE: This component is no longer rendered. 
// Kept for reference only. Do not delete.
'use client';

import { useState } from 'react';

// TopBar — contact info above the nav
export default function TopBar() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const baseStyle: React.CSSProperties = {
        color: '#FFF3D8',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        textDecoration: 'none',
        padding: '8px 14px',
        borderRadius: '999px',
        backgroundColor: 'rgba(201, 147, 58, 0.18)',
        border: '1px solid rgba(201, 147, 58, 0.35)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        whiteSpace: 'nowrap'
    };

    const hoverStyle: React.CSSProperties = {
        ...baseStyle,
        color: '#FFFFFF',
        backgroundColor: 'rgba(201, 147, 58, 0.28)',
        borderColor: 'rgba(255, 224, 130, 0.55)'
    };

    return (
        <div className="top-bar" style={{ backgroundColor: '#111110', margin: '0', padding: '0' }}>
            <div className="container top-bar-inner" style={{ display: 'flex', justifyContent: 'flex-start', padding: '8px 20px' }}>
                <div className="top-bar-left" style={{ display: 'flex', gap: '20px' }}>
                    {/* Phone */}
                    <a
                        href="tel:+919597716664"
                        style={hoveredItem === 'phone' ? hoverStyle : baseStyle}
                        onMouseEnter={() => setHoveredItem('phone')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        +91 95977-16664
                    </a>
                    {/* Email */}
                    <a
                        href="mailto:kanmanitours@gmail.com"
                        style={hoveredItem === 'email' ? hoverStyle : baseStyle}
                        onMouseEnter={() => setHoveredItem('email')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        kanmanitours@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}
