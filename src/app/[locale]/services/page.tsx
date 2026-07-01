import Footer from '@/components/layout/FooterSection';
import MoreDetailsButton from '@/components/ui/MoreDetailsButton';

export default function ServicesPage() {
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
          }}>WHAT WE OFFER</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: '500',
            color: '#F5F1EB',
            letterSpacing: '0.05em',
            lineHeight: '1.15',
            marginBottom: '16px'
          }}>Our Services</h1>
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
            Beyond our signature tours, we offer a range of 
            personalised services to make your India experience 
            seamless from start to finish.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="r-padding" style={{
          backgroundColor: '#FAFAF7'
        }}>
          <div className="r-grid-2" style={{
            maxWidth: '1300px',
            margin: '0 auto',
            gap: '2px'
          }}>

            {[
              {
                id: 'transfers',
                number: '01',
                title: 'Airport Transfers',
                description: 'Professional pickup and drop service between airports and hotels across all major Indian cities. Available 24 hours, with Japanese-speaking drivers on request. We track your flight and adjust for delays automatically.',
                href: '/airport-transfer',
                items: [
                  'All major Indian airports covered',
                  'Japanese-speaking drivers available',
                  'Flight tracking — no waiting for delays',
                  'Private air-conditioned vehicles',
                  'Meet & greet at arrivals'
                ]
              },
              {
                id: 'moving',
                number: '02',
                title: 'Moving to India Support',
                description: 'Relocating from Japan to India is a major life decision. We provide end-to-end support for Japanese nationals moving to Indian cities for work, family, or lifestyle reasons.',
                href: '/services/moving',
                items: [
                  'Neighbourhood orientation tours',
                  'School and international community introductions',
                  'Administrative support and local registration',
                  'Japanese expat community connections',
                  'Ongoing settling-in assistance'
                ]
              }
            ].map(({ id, number, title, description, href, items }) => (
              <div
                key={id}
                id={id}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '48px',
                  border: '1px solid #E8E4DC',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '11px',
                    fontWeight: '400',
                    letterSpacing: '0.22em',
                    color: '#C9933A',
                    marginBottom: '16px'
                  }}>{number}</div>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(24px, 2.5vw, 36px)',
                    fontWeight: '500',
                    color: '#1C1917',
                    letterSpacing: '0.04em',
                    marginBottom: '8px'
                  }}>{title}</h2>
                  <div style={{
                    width: '40px', height: '1px',
                    backgroundColor: '#C9933A', marginBottom: '20px'
                  }}/>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '17px',
                    color: '#2C2420',
                    lineHeight: '1.8',
                    marginBottom: '24px'
                  }}>{description}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '24px' }}>
                    {items.map((item, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '10px',
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '14px',
                        color: '#4A4540',
                        lineHeight: '1.5'
                      }}>
                        <span style={{
                          color: '#C9933A',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <MoreDetailsButton href={href} />
                </div>
              </div>
            ))}
          </div>

          {/* CONTACT CTA */}
          <div className="r-padding-sm" style={{
            maxWidth: '1300px',
            margin: '48px auto 0',
            backgroundColor: '#1C1917',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            borderTop: '2px solid #C9933A'
          }}>
            <div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '28px',
                fontWeight: '500',
                color: '#F5F1EB',
                marginBottom: '8px'
              }}>
                Need a custom service?
              </h3>
              <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '14px',
                color: '#9A948F',
                fontWeight: '300'
              }}>
                Our team speaks Japanese and responds within 24 hours.
              </p>
            </div>
            <a href="/contact" style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.28em',
              color: '#1C1917',
              backgroundColor: '#C9933A',
              padding: '16px 40px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              CONTACT US
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
