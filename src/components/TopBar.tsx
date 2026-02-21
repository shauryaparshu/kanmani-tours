// TopBar — contact info + social icons above the nav
import SocialIcons from '@/components/SocialIcons';

export default function TopBar() {
    return (
        <div className="top-bar">
            <div className="container top-bar-inner">
                <div className="top-bar-left">
                    {/* Phone */}
                    <a href="tel:+810312345678" className="top-bar-item">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        +81 (0)3-1234-5678
                    </a>
                    {/* Email */}
                    <a href="mailto:hello@srikantours.com" className="top-bar-item">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        hello@srikantours.com
                    </a>
                </div>
                <div className="top-bar-right">
                    <SocialIcons variant="topbar" />
                </div>
            </div>
        </div>
    );
}
