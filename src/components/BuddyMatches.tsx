import { motion } from 'framer-motion';
import { Users, Briefcase, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';

interface MatchUser {
  id: string;
  name: string;
  avatar: string;
  role: 'Veteran' | 'Rookie';
  location: string;
  origin: string;
  job: string;
  matchScore: number;
  tags: string[];
}

const MOCK_MATCHES: MatchUser[] = [
  {
    id: 'm1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    role: 'Veteran',
    location: 'Clapham, London',
    origin: 'Sydney, Australia',
    job: 'Marketing Manager',
    matchScore: 94,
    tags: ['AFL', 'Sunday Roasts', 'Flat Hunting Advice']
  },
  {
    id: 'm2',
    name: 'James O\'Connor',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
    role: 'Veteran',
    location: 'Islington, London',
    origin: 'Toronto, Canada',
    job: 'Software Engineer',
    matchScore: 88,
    tags: ['Tech Startups', 'Ice Hockey', 'Tier 2 Visas']
  }
];

export default function BuddyMatches() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '2rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-block', padding: '1rem', background: '#EBF4FF', color: 'var(--secondary-accent)', borderRadius: '50%', marginBottom: '1rem' }}>
          <Users size={48} />
        </div>
        <h2 style={{ marginBottom: '0.5rem' }}>Your Recommended Buddies</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          We've paired you with CANZUK Veterans who have already made the move to your area. Reach out to ask questions, grab a coffee, or get insider tips.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {MOCK_MATCHES.map((match, idx) => (
          <motion.div 
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card"
            style={{ position: 'relative', overflow: 'hidden', padding: '2rem' }}
          >
            {/* Match Score Badge */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#ECFDF5', color: '#059669', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid #D1FAE5' }}>
              <CheckCircle2 size={16} /> {match.matchScore}% Match
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <img src={match.avatar} alt={match.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-color)' }} />
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0' }}>{match.name}</h3>
                <span style={{ 
                  background: 'var(--primary-accent)', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {match.role}
                </span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>From {match.origin}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <MapPin size={18} color="var(--text-muted)" /> Local Area: {match.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <Briefcase size={18} color="var(--text-muted)" /> {match.job}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
              {match.tags.map(tag => (
                <span key={tag} style={{ background: '#F7FAFC', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                  {tag}
                </span>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', bottom: '2rem', position: 'absolute', left: 0, borderRadius: '0', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
              <MessageSquare size={18} /> Send Message
            </button>
          </motion.div>
        ))}
      </div>
      
    </div>
  );
}
