import { motion } from 'framer-motion';
import { Globe, Heart, Shield, Users } from 'lucide-react';

export default function About() {
  return (
    <div style={{ paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--secondary-accent) 0%, #00154A 100%)', 
        color: 'white', 
        padding: '6rem 2rem', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'url("https://images.unsplash.com/photo-1542382257-80dddd04e988?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}
        >
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1, color: 'white' }}>
            Welcome to your <span style={{ color: 'var(--primary-accent)' }}>New Home.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.6, fontWeight: 300 }}>
            CANZUK might sound a little unfamiliar now, but to us it means Home. 
            Home wherever you are in Canada, Australia, New Zealand, and the UK.
          </p>
        </motion.div>
      </section>

      {/* Main Philosophy */}
      <section className="container" style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        <div className="card" style={{ padding: '4rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
          <Globe size={48} color="var(--primary-accent)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--secondary-accent)' }}>The Connective Tissue</h2>
          
          <div style={{ fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 1.8, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p>
              We’re building a community—a genuine, hyper-local network of literal movers and those who have always called their country home. 
              Our mission is simple: <strong>To welcome you to your new home.</strong>
            </p>
            <p>
              Moving across the world shouldn't mean starting from zero. Despite driving on the same side of the road, sharing identical 
              legal frameworks, banking systems, and the exact same sense of humor, the sheer logistics of moving from Toronto to London 
              or Sydney to Auckland can be agonizing. 
            </p>
            <p>
              You arrive without a local guarantor, without a credit score, and without a network.
            </p>
            <p style={{ fontWeight: 600, color: 'var(--primary-accent)', fontSize: '1.25rem', textAlign: 'center', margin: '2rem 0' }}>
              We are here to fix that.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container" style={{ paddingTop: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>How We Broker Trust</h2>
          <p style={{ color: 'var(--text-muted)' }}>We lower the barriers to entry by relying on each other.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ display: 'inline-block', padding: '1.25rem', background: '#FFF3EE', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--primary-accent)' }}>
              <Heart size={32} />
            </div>
            <h3>Peer-to-Peer Housing</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
              Bypass hostile letting agencies. We connect new arrivals directly with expats who have spare rooms and who understand the temporary struggle of lacking a UK guarantor.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ display: 'inline-block', padding: '1.25rem', background: '#EBF4FF', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--secondary-accent)' }}>
              <Shield size={32} />
            </div>
            <h3>Vetted Logistics</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
              A community-verified directory of businesses, banks, and visa agents who actively recognize, trust, and seek out CANZUK citizens.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ display: 'inline-block', padding: '1.25rem', background: '#ECFDF5', borderRadius: '50%', marginBottom: '1.5rem', color: '#059669' }}>
              <Users size={32} />
            </div>
            <h3>Day 1 Mentorship</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
              Algorithmic pairing that ensures no CANZUK citizen ever touches down in a new city completely alone. Find a flatmate. Grab a pint. Settle in.
            </p>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
