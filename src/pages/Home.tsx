import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '4rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ flex: '1 1 400px' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#E6F0F4', color: 'var(--secondary-accent)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <MapPin size={16} /> Headquartered in London
            </span>
            <h1 style={{ marginBottom: '1.5rem', lineHeight: '1.1' }}>
              A Welcome Hug,<br />
              <span style={{ color: 'var(--primary-accent)' }}>Far From Home.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px' }}>
              Find your people, your places, and your peace of mind. A community built by those who've made the leap, waiting to welcome you—no matter where you land.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/community" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  Join the Community <ArrowRight size={20} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                </Link>
                <Link to="/about" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  Learn More
                </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ flex: '1 1 500px', position: 'relative' }}
          >
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '110%', height: '110%', background: 'radial-gradient(circle, var(--secondary-accent) 0%, transparent 60%)', opacity: 0.1, zIndex: -1, borderRadius: '50%' }} />
            <img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Diverse group of young professionals laughing together" 
              className="image-rounded"
              style={{ border: '4px solid white' }}
            />
            
            {/* Floating popover stats */}
            <div className="card" style={{ position: 'absolute', bottom: '-20px', left: '-20px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#EBF4FF', color: 'var(--secondary-accent)', padding: '0.75rem', borderRadius: '12px' }}>
                <Users size={24} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--secondary-accent)' }}>Your Global Family</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>We're all in this together</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Feature Value Section */}
      <section style={{ backgroundColor: '#FDFBF7', padding: '6rem 0', marginTop: '6rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Settle In, Stress-Free</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Whether you're moving from Toronto to London, or Sydney to Auckland, our family has the organic recommendations you need to feel instantly at home.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Card 1 */}
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Community Gathering" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '2rem' }}>
                <h3 style={{ color: 'var(--primary-accent)' }}>Local Meetups</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Find your tribe. Connect with locals and expats alike sharing the CANZUK journey.</p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Group Hug" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-accent)' }}>Shared Experiences</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Real stories, real reviews, and real support from people who understand.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
