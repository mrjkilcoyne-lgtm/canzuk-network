import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Send, MessageCircle } from 'lucide-react';

interface PanicPost {
  id: string;
  type: 'panic' | 'beacon';
  user: { name: string; avatar: string };
  title: string;
  content: string;
  location: string;
  timestamp: string;
  replies: number;
}

const INITIAL_POSTS: PanicPost[] = [
  {
    id: 'p1',
    type: 'panic',
    user: { name: 'Liam Davies', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
    title: 'BRP Delivery Delayed - Urgent Help Needed!',
    content: 'My company says I cannot start work tomorrow because my Biometric Residence Permit still hasn\'t arrived at the post office. Has anyone dealt with this? Is there a temporary proof of right to work I can show them?',
    location: 'London',
    timestamp: '15 mins ago',
    replies: 4
  },
  {
    id: 'p2',
    type: 'beacon',
    user: { name: 'Chloe Saunders', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
    title: 'Arriving from Sydney next Friday!',
    content: 'Hey everyone! Touching down in London for the first time next Friday. Moving into a place in Clapham. Would love to grab a pint with some fellow Aussies (or anyone really) over the weekend!',
    location: 'Clapham, London',
    timestamp: '2 hours ago',
    replies: 12
  }
];

export default function PanicBoard() {
  const [posts] = useState<PanicPost[]>(INITIAL_POSTS);
  const [filter, setFilter] = useState<'all' | 'panic' | 'beacon'>('all');

  const filteredPosts = posts.filter(p => filter === 'all' || p.type === filter);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle color="var(--primary-accent)" /> Urgent Q&A & Beacons
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Drop a beacon or ask for immediate help from the community.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setFilter('all')} style={{ padding: '6px 16px', borderRadius: '20px', border: filter === 'all' ? 'none' : '1px solid var(--border-color)', background: filter === 'all' ? 'var(--text-main)' : 'white', color: filter === 'all' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>All</button>
          <button onClick={() => setFilter('panic')} style={{ padding: '6px 16px', borderRadius: '20px', border: filter === 'panic' ? 'none' : '1px solid var(--border-color)', background: filter === 'panic' ? '#FFF3EE' : 'white', color: filter === 'panic' ? 'var(--primary-accent)' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>Panics</button>
          <button onClick={() => setFilter('beacon')} style={{ padding: '6px 16px', borderRadius: '20px', border: filter === 'beacon' ? 'none' : '1px solid var(--border-color)', background: filter === 'beacon' ? '#EBF4FF' : 'white', color: filter === 'beacon' ? 'var(--secondary-accent)' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>Beacons</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', background: '#F7FAFC' }}>
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Me" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <input type="text" placeholder="Drop a beacon or post a panic..." className="input-field" style={{ background: 'white', marginBottom: '0.5rem' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input type="radio" name="postType" defaultChecked /> <span style={{ color: 'var(--secondary-accent)', fontWeight: 600 }}>Beacon</span>
              </label>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input type="radio" name="postType" /> <span style={{ color: 'var(--primary-accent)', fontWeight: 600 }}>Panic Alert</span>
              </label>
            </div>
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}>
              <Send size={16} style={{ marginRight: '0.5rem' }} /> Post
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredPosts.map(post => (
          <motion.div 
            key={post.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card" 
            style={{ 
              borderLeft: post.type === 'panic' ? '4px solid var(--primary-accent)' : '4px solid var(--secondary-accent)',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img src={post.user.avatar} alt={post.user.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{post.user.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{post.timestamp} • <MapPin size={12} style={{ display: 'inline', margin: '0 2px' }} /> {post.location}</span>
                </div>
              </div>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '8px', 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                textTransform: 'uppercase',
                background: post.type === 'panic' ? '#FFF3EE' : '#EBF4FF',
                color: post.type === 'panic' ? 'var(--primary-accent)' : 'var(--secondary-accent)'
              }}>
                {post.type}
              </span>
            </div>
            
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{post.title}</h3>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', lineHeight: '1.5' }}>{post.content}</p>
            
            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                <MessageCircle size={18} /> {post.replies} Replies
              </button>
              {post.type === 'panic' && (
                <button style={{ background: 'none', border: 'none', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  Offer Help
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
