import Footer from '@/components/layout/FooterSection';
import Link from 'next/link';

export default function MovingToIndiaPage() {
  return (
    <>
      <main>
        {/* HERO */}
        <div style={{
          backgroundColor: '#1C1917',
          padding: '80px 60px 72px',
          borderBottom: '1px solid rgba(201,147,58,0.2)'
        }}>
          <p style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.32em',
            color: '#C9933A',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>SERVICES</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: '500',
            color: '#F5F1EB',
            letterSpacing: '0.05em',
            lineHeight: '1.15',
            marginBottom: '16px'
          }}>Moving to India Support</h1>
          <div style={{
            width: '56px', height: '1px',
            backgroundColor: '#C9933A', marginBottom: '20px'
          }}/>
          <p style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: '300',
            color: '#9A948F',
            lineHeight: '1.7',
            maxWidth: '560px'
          }}>
            Relocating from Japan to India is a major life decision. We provide end-to-end support for Japanese nationals moving to Indian cities for work, family, or lifestyle reasons.
          </p>
        </div>

        {/* CONTENT */}
        <div style={{
          backgroundColor: '#FAFAF7',
          padding: '80px 60px'
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            padding: '48px',
            border: '1px solid #E8E4DC'
          }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '32px',
              fontWeight: '500',
              color: '#1C1917',
              marginBottom: '24px'
            }}>Our Support Includes</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Neighbourhood orientation tours',
                'School and international community introductions',
                'Administrative support and local registration',
                'Japanese expat community connections',
                'Ongoing settling-in assistance'
              ].map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '16px',
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '16px',
                  color: '#4A4540',
                  lineHeight: '1.5'
                }}>
                  <span style={{ color: '#C9933A', marginTop: '2px' }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '48px' }}>
              <Link href="/contact" style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.2em',
                color: '#1C1917',
                backgroundColor: '#C9933A',
                padding: '16px 40px',
                textDecoration: 'none',
                textTransform: 'uppercase',
                display: 'inline-block'
              }}>
                CONTACT FOR ASSISTANCE
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
