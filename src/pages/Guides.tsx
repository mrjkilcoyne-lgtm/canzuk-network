import { Landmark, Navigation, Shield } from 'lucide-react';

export default function Guides() {
  return (
    <div style={{ paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--secondary-accent) 0%, #00154A 100%)', 
        color: 'white', 
        padding: '5rem 1rem', 
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'white' }}>The BACKer OS</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.6, fontWeight: 300 }}>
            Not a directory. Not a forum. The operating system for CANZUK life in Britain.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '4rem' }}>

        {/* Categories Grid (The Operating System) */}
        <div style={{ marginBottom: '6rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Everything. One place.</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-accent)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎖</div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Defence & Veterans</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>ANZAC to Afghanistan. Veteran communities, support networks.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary-accent)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏛</div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>High Commissions</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Where your embassy is. What they actually help with. Consular contacts.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚇</div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Getting Around</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>The Tube, TfL buses, Oyster cards, cycling. How to actually move in Britain.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏉</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Sport</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>The Ashes, All Blacks, NHL, AFL. Where to watch. Who's playing.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍳</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Food & Drink</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Flat whites, pies, poutine, pavlova. Restaurants, recipes, imports.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Professional Services</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Architects, accountants, lawyers, consultants. Trusted, verified.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛠</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Trades & Makers</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Builders, designers, craftspeople. Commission bespoke work from home.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏪</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Goods & Products</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Homewares, fashion, specialty imports. That thing you can't find here.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏫</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Schools & Nurseries</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Rated by CANZUK families who've actually been there.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍺</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Pubs Like Home</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Find your local. Game on the screen. People who get it.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌿</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Nature & Outdoors</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Hiking, national parks, coast paths, wild swimming. Where to find the green.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💻</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Technology</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Tech meetups, coworking, startup scene, digital nomad infrastructure.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💼</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Jobs & Careers</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Employers who value CANZUK talent. Hire within the network.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📰</div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', background: '#F7FAFC', padding: '2px 6px', borderRadius: '4px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>News & Features</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>What's happening across all four nations. Written for BACKers.</p>
            </div>

          </div>
        </div>

        {/* Existing Sections Below */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '0.75rem', background: '#EBF4FF', color: 'var(--secondary-accent)', borderRadius: '12px' }}>
              <Navigation size={28} />
            </div>
            <h2 style={{ margin: 0 }}>Getting Around</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            The Tube, buses, bikes, and the apps you need. Everything a new arrival should know.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.25rem' }}>Oyster Card & Contactless</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Use contactless (Visa/Mastercard) or Apple/Google Pay. It has the same daily caps as an Oyster card. Don't buy paper tickets—they cost roughly double.
              </p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.25rem' }}>The Tube & TfL</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Runs roughly 5am–midnight. Buses are £1.75 flat fare (unlimited within one hour "Hopper fare"). Cash is NOT accepted on London buses.
              </p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.25rem' }}>Essential Apps</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                TfL Go (official real-time planning), Citymapper (multi-modal routes), Trainline (national rail beyond London).
              </p>
            </div>
          </div>
        </div>

        {/* High Commissions */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '0.75rem', background: '#FFF3EE', color: 'var(--primary-accent)', borderRadius: '12px' }}>
              <Landmark size={28} />
            </div>
            <h2 style={{ margin: 0 }}>High Commissions</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Your embassy. Where to go, who to call, what they actually help with.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ borderLeft: '4px solid #FFCD00' }}> {/* Aus colours */}
              <h3 style={{ fontSize: '1.25rem' }}>🇦🇺 Australian High Commission</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Australia House, The Strand, London WC2B 4LA</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Consular:</strong> +44 20 7887 5776</li>
                <li><strong>Hours:</strong> Mon–Fri 9:00–17:00</li>
                <li style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>For passport queries, use the callback service—don't just show up.</li>
              </ul>
            </div>
            
            <div className="card" style={{ borderLeft: '4px solid var(--primary-accent)' }}>
              <h3 style={{ fontSize: '1.25rem' }}>🇨🇦 High Commission of Canada</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Canada House, Trafalgar Square, London SW1Y 5BJ</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Consular:</strong> +44 20 7004 6000</li>
                <li><strong>Hours:</strong> Mon–Fri 8:00–15:00</li>
                <li style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>Register with Canadians Abroad before you need help.</li>
              </ul>
            </div>

            <div className="card" style={{ borderLeft: '4px solid black' }}>
              <h3 style={{ fontSize: '1.25rem' }}>🇳🇿 New Zealand High Commission</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>New Zealand House, 80 Haymarket, London SW1Y 4TQ</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Consular:</strong> +44 20 7930 8422</li>
                <li><strong>Hours:</strong> Mon–Fri 10:00–14:00 (passport calls)</li>
                <li style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>Urgent replacements outside hours: call main number.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Defence & Veterans */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '0.75rem', background: '#ECFDF5', color: '#059669', borderRadius: '12px' }}>
              <Shield size={28} />
            </div>
            <h2 style={{ margin: 0 }}>Defence & Veterans</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            ANZAC to Afghanistan. Clubs, support, commemoration. You served together — stay connected.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.25rem' }}>Victory Services Club</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                The only military club in London open to ALL ranks from UK, Commonwealth and NATO forces. Free membership for serving personnel. Reciprocal clubs in Sydney, Canada, NZ.
              </p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.25rem' }}>ANZAC Day Dawn Service</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Hyde Park Corner. 5am Dawn Service. The biggest annual gathering of Australians and New Zealanders in the UK. Thousands attend — arrive from 4:40am.
              </p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.25rem' }}>SSAFA / Combat Stress</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Practical, emotional and financial support for veterans. Combat stress offers a 24-hour helpline (+44 800 138 1619) for those struggling with PTSD or anxiety.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
