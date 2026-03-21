import { Lock, Video, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';

export default function Subscribe() {
  return (
    <div style={{ paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <section style={{ 
        background: 'var(--bg-panel)', 
        padding: '5rem 1rem 3rem', 
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', background: '#FEE2E2', color: 'var(--primary-accent)', padding: '0.5rem 1.25rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Founding Cohort
          </span>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-main)', lineHeight: 1.1 }}>
            BACK your people.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Full access to every feature, every guide, and every recommendation. The first BACKers shape the platform.
          </p>
        </div>
      </section>

      {/* Pricing / Funnel */}
      <div className="container" style={{ position: 'relative', marginTop: '-2rem', zIndex: 10 }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', boxShadow: 'var(--shadow-lg)', padding: '3rem 2rem', borderTop: '6px solid var(--secondary-accent)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>BACKer Membership</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '1rem 0 0.5rem 0' }}>
              £10<span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 500 }}>/month</span>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}><CheckCircle2 color="var(--primary-accent)" size={24} style={{ flexShrink: 0 }} /> <span>Full access to all BACKer guides and recommendations</span></li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}><CheckCircle2 color="var(--primary-accent)" size={24} style={{ flexShrink: 0 }} /> <span>Verified member profile and trust badge</span></li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}><CheckCircle2 color="var(--primary-accent)" size={24} style={{ flexShrink: 0 }} /> <span>Book & Meet video consultations with transcription</span></li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}><CheckCircle2 color="var(--primary-accent)" size={24} style={{ flexShrink: 0 }} /> <span>Access to the BACKer jobs board</span></li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}><CheckCircle2 color="var(--primary-accent)" size={24} style={{ flexShrink: 0 }} /> <span>Early access to events and exclusive meetups</span></li>
          </ul>

          <div style={{ background: '#FFF3EE', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--primary-accent)', fontWeight: 600 }}>
            🎁 First 10 subscribers get a free one-on-one chat with the founders on any subject.
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', borderRadius: '30px' }}>
            Subscribe — £10/month
          </button>
        </div>
      </div>

      {/* Four Pillars */}
      <section className="container" style={{ paddingTop: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>Built on Trust</h2>
          <p style={{ color: 'var(--text-muted)' }}>Four nations built the modern world together. Now they have a platform that matches the relationship.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <Lock size={32} color="var(--secondary-accent)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Trust Accounts</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Escrow protection on every cross-border transaction. Your money is safe until the work is delivered.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <Video size={32} color="var(--primary-accent)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Book & Meet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Video consultations with built-in transcription. Every conversation documented. Scope agreed before money moves.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <UserCheck size={32} color="#10B981" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Verified Members</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Every BACKer is vetted. Membership means something. This is what LinkedIn should have been.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <ShieldCheck size={32} color="#F59E0B" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Community Intelligence</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Schools, pubs, sports, local guides — all rated by people who've made the same move you're making.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
