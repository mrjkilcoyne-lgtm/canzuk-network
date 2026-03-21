import { useState } from 'react';
import { Home, MapPin, PoundSterling, Calendar, Plus } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  type: 'whole_flat' | 'spare_room';
  location: string;
  price: string;
  availableFrom: string;
  postedBy: {
    name: string;
    avatar: string;
  };
}

const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'l1',
    title: 'Sunny Double Room in Clapham South (Aussies/Kiwis Flat)',
    type: 'spare_room',
    location: 'Clapham, London',
    price: '£850/pcm + bills',
    availableFrom: 'Oct 1st',
    postedBy: {
      name: 'Jack Smith',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80'
    }
  },
  {
    id: 'l2',
    title: '1 Bed Modern Flat near Victoria Park',
    type: 'whole_flat',
    location: 'Hackney, London',
    price: '£2100/pcm',
    availableFrom: 'Nov 15th',
    postedBy: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
    }
  }
];

export default function HousingBoard() {
  const [listings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [filter, setFilter] = useState<'all' | 'whole_flat' | 'spare_room'>('all');

  const filtered = filter === 'all' ? listings : listings.filter(l => l.type === filter);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home color="var(--primary-accent)" /> Flat & Room Listings
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Listings from fellow CANZUK expats looking for flatmates or lease handovers.</p>
        </div>
        
        <button className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Post an Ad
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '6px 16px', borderRadius: '20px', border: filter === 'all' ? 'none' : '1px solid var(--border-color)', background: filter === 'all' ? 'var(--text-main)' : 'white', color: filter === 'all' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>All Specs</button>
        <button onClick={() => setFilter('spare_room')} style={{ padding: '6px 16px', borderRadius: '20px', border: filter === 'spare_room' ? 'none' : '1px solid var(--border-color)', background: filter === 'spare_room' ? '#FFF3EE' : 'white', color: filter === 'spare_room' ? 'var(--primary-accent)' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>Spare Rooms</button>
        <button onClick={() => setFilter('whole_flat')} style={{ padding: '6px 16px', borderRadius: '20px', border: filter === 'whole_flat' ? 'none' : '1px solid var(--border-color)', background: filter === 'whole_flat' ? '#EBF4FF' : 'white', color: filter === 'whole_flat' ? 'var(--secondary-accent)' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>Whole Flats</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(listing => (
          <div key={listing.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', background: '#FAFAFA' }}>
            
            <img src={listing.postedBy.avatar} alt={listing.postedBy.name} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{listing.title}</h3>
                <span style={{ 
                  background: listing.type === 'spare_room' ? '#FFF3EE' : '#EBF4FF',
                  color: listing.type === 'spare_room' ? 'var(--primary-accent)' : 'var(--secondary-accent)',
                  padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase'
                }}>
                  {listing.type === 'spare_room' ? 'Room' : 'Full Flat'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> {listing.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-main)', fontWeight: 600 }}><PoundSterling size={14}/> {listing.price}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14}/> Avail: {listing.availableFrom}</span>
              </div>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Listed by {listing.postedBy.name}</span>
            </div>
            
            <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', borderRadius: '8px' }}>
              Message
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No listings found for this category right now.
          </div>
        )}
      </div>

    </div>
  );
}
