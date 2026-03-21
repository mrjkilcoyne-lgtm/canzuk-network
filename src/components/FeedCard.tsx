import { Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface FeedItemProps {
  type: 'review' | 'new_place';
  user?: User;
  placeName: string;
  placeLocation: string;
  content?: string;
  rating?: number;
  timestamp: string;
  category?: string;
  images?: string[];
  isSponsored?: boolean;
}

export default function FeedCard({ type, user, placeName, placeLocation, content, rating, timestamp, category, images, isSponsored }: FeedItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card" 
      style={{ 
        marginBottom: '1.5rem', 
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: isSponsored ? '1px solid var(--secondary-accent)' : '1px solid var(--border-color)',
        boxShadow: isSponsored ? '0 4px 20px rgba(0, 36, 125, 0.1)' : 'var(--shadow-sm)',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {type === 'review' && user ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
              {placeName.charAt(0)}
            </div>
          )}
          
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>
              {type === 'review' && user ? user.name : placeName}
            </h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {type === 'review' ? `Reviewed ${placeName}` : `New ${category} added in ${placeLocation}`} • {timestamp}
            </span>
          </div>
        </div>

        {type === 'review' && rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FFF3EE', color: 'var(--primary-accent)', padding: '6px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.9rem' }}>
            <Star size={16} fill="currentColor" /> {rating.toFixed(1)}
          </div>
        )}
        {isSponsored && (
          <div style={{ display: 'flex', alignItems: 'center', background: '#EBF4FF', color: 'var(--secondary-accent)', padding: '4px 10px', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sponsored
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ paddingLeft: type === 'review' ? '4rem' : '0' }}>
        {content && (
          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.5' }}>
            "{content}"
          </p>
        )}
        
        {images && images.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="Review attachment" 
                style={{ height: '160px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} 
              />
            ))}
          </div>
        )}

        {type === 'review' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            <MapPin size={14} /> {placeLocation}
          </div>
        )}
      </div>
    </motion.div>
  );
}
