import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Building, MessageSquare, PlusCircle, Search, Activity, Users, AlertTriangle, Home } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';
import FeedCard from '../components/FeedCard';
import SurvivalQuests from '../components/SurvivalQuests';
import PanicBoard from '../components/PanicBoard';
import BuddyMatches from '../components/BuddyMatches';
import HousingBoard from '../components/HousingBoard';

declare global {
  interface Window {
    google: any;
  }
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Recommendation {
  id: string;
  author: User;
  text: string;
  rating: number;
  timestamp: string;
  images?: string[];
  isSponsored?: boolean;
}

export interface Firm {
  id: string;
  name: string;
  location: string;
  type: string;
  googleMapsUrl?: string;
  companiesHouseId?: string;
  status: 'approved' | 'pending';
  recommendations: Recommendation[];
  addedAt: string;
  isSponsored?: boolean;
}

const MOCK_USERS: Record<string, User> = {
  u1: { id: 'u1', name: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  u2: { id: 'u2', name: 'Jack Smith', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80' },
  u3: { id: 'u3', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
};

const INITIAL_FIRMS: Firm[] = [
  {
    id: '1',
    name: 'Maple Leaf Relocations',
    location: 'Toronto, Canada',
    type: 'Logistics',
    status: 'approved',
    addedAt: '2d ago',
    recommendations: [
      { id: 'r1', author: MOCK_USERS.u1, text: 'Amazing team, super helpful with our move from London to Toronto!', rating: 5, timestamp: '1d ago', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'] }
    ]
  },
  {
    id: '2',
    name: 'Thames Financial Services',
    location: 'London, UK',
    type: 'Financial Services',
    status: 'approved',
    addedAt: '1w ago',
    recommendations: [
      { id: 'r2', author: MOCK_USERS.u2, text: 'Sorted my cross-border taxes effortlessly. Highly recommend if you are moving down under.', rating: 5, timestamp: '3d ago' }
    ]
  },
  {
    id: '3',
    name: 'Sydney Harbour Realty',
    location: 'Sydney, Australia',
    type: 'Real Estate',
    status: 'approved',
    addedAt: '1m ago',
    recommendations: [
      { id: 'r3', author: MOCK_USERS.u3, text: 'Found us the perfect rental within a week of landing.', rating: 4, timestamp: '5d ago' }
    ]
  },
  {
    id: '4',
    name: 'CANZUK Global Recruitment',
    location: 'London, UK',
    type: 'Recruitment',
    status: 'approved',
    addedAt: '1h ago',
    isSponsored: true,
    recommendations: [
      { id: 'r4', author: MOCK_USERS.u1, text: 'Looking for top talent from Canada, Australia, and New Zealand to fill immediate roles in Finance and Tech! Reach out to our London office.', rating: 5, timestamp: '1h ago', isSponsored: true }
    ]
  },
  {
    id: '5',
    name: 'The Falcon Pub',
    location: 'Clapham, London, UK',
    type: 'Other',
    status: 'approved',
    addedAt: '2h ago',
    recommendations: [
      { id: 'r5', author: MOCK_USERS.u2, text: 'The unofficial embassy for Aussies and Kiwis in South London. Absolute lifesaver when you are missing home and want to watch the Rugby or AFL. Gets incredibly busy on weekends!', rating: 5, timestamp: '3h ago' },
      { id: 'r6', author: MOCK_USERS.u3, text: 'Great atmosphere, met my first flatmates here on a Sunday afternoon.', rating: 4, timestamp: '1d ago' }
    ]
  },
  {
    id: '6',
    name: 'The Maple Leaf',
    location: 'Covent Garden, London, UK',
    type: 'Other',
    status: 'approved',
    addedAt: '4h ago',
    recommendations: [
      { id: 'r7', author: MOCK_USERS.u1, text: 'Poutine, Caesars, and hockey on the screens. If you are a Canadian in London experiencing severe homesickness, this is the cure. Highly recommend going for Canada Day.', rating: 5, timestamp: '4h ago', images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80'] }
    ]
  },
  {
    id: '7',
    name: 'Monzo Bank',
    location: 'London, UK (App)',
    type: 'Financial Services',
    status: 'approved',
    addedAt: '1d ago',
    recommendations: [
      { id: 'r8', author: MOCK_USERS.u2, text: 'Do not bother with traditional high street banks when you first arrive—they demand proof of address you won\'t have. Monzo let me open an account instantly with my BRP.', rating: 5, timestamp: '1d ago' }
    ]
  },
  {
    id: '8',
    name: 'Kiwis in London Flats (Facebook Group)',
    location: 'London (Online)',
    type: 'Real Estate',
    status: 'approved',
    addedAt: '3d ago',
    recommendations: [
      { id: 'r9', author: MOCK_USERS.u3, text: 'Forget the standard letting agents, they often require 6 months rent upfront without a UK guarantor. KIL is the best place to find a friendly flatshare with people who get it.', rating: 5, timestamp: '1w ago' }
    ]
  }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState<'feed' | 'directory' | 'submit' | 'matches' | 'panic' | 'housing'>('feed');
  
  const [firms, setFirms] = useState<Firm[]>(() => {
    const saved = localStorage.getItem('canzuk_network_firms_v2');
    return saved ? JSON.parse(saved) : INITIAL_FIRMS;
  });

  const [filterQuery, setFilterQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Current logged in user mock
  const currentUser = MOCK_USERS.u1;

  // Refs for auto-filling form from Google Places API
  const placeNameRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const mapUrlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('canzuk_network_firms_v2', JSON.stringify(firms));
  }, [firms]);

  // Load Google Places API Autocomplete when the "submit" tab is active
  useEffect(() => {
    let autocomplete: any = null;
    let listener: any = null;
    
    if (activeTab === 'submit' && placeNameRef.current) {
      const loader = new Loader({
        apiKey: "AIzaSyBOyIYKuxqgSegO0VcZra3jxz8OWUNwl-I", // Using the provided API key
        version: "weekly",
        libraries: ["places"]
      });

      (loader as any).load().then(() => {
        if (!placeNameRef.current) return;
        
        autocomplete = new window.google.maps.places.Autocomplete(placeNameRef.current, {
          fields: ["place_id", "name", "formatted_address", "url", "types"],
          // We can restrict to specific regions like CANZUK if we want, but letting it be global for expats is good too.
        });

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();
          if (!place) return;

          // Auto-fill the inputs based on Google API response
          if (place.name && placeNameRef.current) placeNameRef.current.value = place.name;
          if (place.formatted_address && locationRef.current) locationRef.current.value = place.formatted_address;
          if (place.url && mapUrlRef.current) mapUrlRef.current.value = place.url;
        });
      }).catch((e: any) => {
        console.error("Error loading Google Maps API", e);
      });
    }

    return () => {
      // Cleanup the listener if tab changes to prevent memory leaks or multiple bindings
      if (listener && window.google) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [activeTab]);

  const handleSubmitFirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFirm: Firm = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as string,
      googleMapsUrl: formData.get('googleMapsUrl') as string,
      companiesHouseId: formData.get('companiesHouseId') as string,
      status: 'pending',
      addedAt: 'Just now',
      recommendations: []
    };
    
    // Add reviewer recommendation immediately if they checked the box and added a review
    const rating = formData.get('rating');
    const reviewText = formData.get('reviewText');
    if (rating && reviewText) {
       newFirm.recommendations.push({
         id: Date.now().toString() + '_rev',
         author: currentUser,
         text: reviewText as string,
         rating: parseInt(rating as string),
         timestamp: 'Just now'
       });
    }

    setFirms([newFirm, ...firms]);
    e.currentTarget.reset();
    
    alert('Thank you! Your submission has been received. Validation teams will cross-reference the Maps/Companies data shortly.');
    setActiveTab('directory');
  };

  const calcRating = (recs: Recommendation[]) => {
    if (!recs.length) return 'New';
    return (recs.reduce((a, b) => a + b.rating, 0) / recs.length).toFixed(1);
  };

  const approvedFirms = firms.filter(f => f.status === 'approved');
  const pendingCount = firms.filter(f => f.status === 'pending').length;

  const filteredDirectory = approvedFirms.filter(firm => {
    const matchesQuery = firm.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         firm.location.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesLoc = locationFilter ? firm.location.includes(locationFilter) : true;
    const matchesCat = categoryFilter ? firm.type === categoryFilter : true;
    return matchesQuery && matchesLoc && matchesCat;
  });

  // Extract all feed events (reviews + new places)
  const feedEvents = [];
  for (const firm of approvedFirms) {
    feedEvents.push({
      type: 'new_place',
      placeName: firm.name,
      placeLocation: firm.location,
      category: firm.type,
      timestamp: firm.addedAt,
      isSponsored: firm.isSponsored,
      sortTime: firm.isSponsored ? new Date().getTime() + 10000000 : new Date().getTime() - Math.random() * 10000000 // Boost sponsored
    });

    for (const rec of firm.recommendations) {
      feedEvents.push({
        type: 'review',
        user: rec.author,
        placeName: firm.name,
        placeLocation: firm.location,
        content: rec.text,
        rating: rec.rating,
        timestamp: rec.timestamp,
        images: rec.images,
        isSponsored: rec.isSponsored,
        sortTime: rec.isSponsored ? new Date().getTime() + 5000000 : new Date().getTime() - Math.random() * 5000000 // Boost sponsored
      });
    }
  }
  
  // Sort feed events randomly for mock purposes, ideally by real timestamps
  feedEvents.sort((a, b) => b.sortTime - a.sortTime);

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Welcome Home 🏡</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Discover the places, faces, and spaces loved by our global family. 
          Grab a cuppa, explore genuine recommendations, and share the local gems that made you feel at home.
        </p>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {[
          { id: 'feed', label: 'Community Feed', icon: Activity },
          { id: 'directory', label: 'Explore Places', icon: Search },
          { id: 'matches', label: 'Buddy Matches', icon: Users },
          { id: 'panic', label: 'Q&A & Beacons', icon: AlertTriangle },
          { id: 'housing', label: 'Housing & Flats', icon: Home },
          { id: 'submit', label: 'Submit a Place', icon: PlusCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: isActive ? 'none' : '1px solid var(--border-color)',
                backgroundColor: isActive ? 'var(--primary-accent)' : 'var(--bg-panel)',
                color: isActive ? 'white' : 'var(--text-main)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 14px rgba(230, 106, 70, 0.3)' : 'var(--shadow-sm)'
              }}
            >
              <Icon size={18} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          
          {/* FEED TAB */}
          {activeTab === 'feed' && (
            <div style={{ display: 'flex', gap: '2rem', maxWidth: '1000px', margin: '0 auto', alignItems: 'flex-start', flexWrap: 'wrap-reverse' }}>
              
              {/* Main Feed Column */}
              <div style={{ flex: '1 1 600px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>Trending in:</span>
                  {['Clapham', 'Shoreditch', 'Islington', 'Covent Garden', 'Hackney'].map(city => (
                    <button 
                      key={city} 
                      onClick={() => {
                        setLocationFilter(locationFilter === city ? '' : city);
                        setActiveTab('directory');
                      }}
                      style={{
                        padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-panel)', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap'
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {feedEvents.map((event, idx) => (
                  <FeedCard key={idx} {...(event as any)} />
                ))}
              </div>

              {/* Sidebar Column */}
              <div style={{ flex: '0 0 320px', width: '100%' }}>
                <SurvivalQuests />
              </div>

            </div>
          )}

          {/* MATCHES TAB */}
          {activeTab === 'matches' && (
            <div style={{ paddingTop: '1rem' }}>
              <BuddyMatches />
            </div>
          )}

          {/* PANIC BOARD */}
          {activeTab === 'panic' && (
            <div style={{ paddingTop: '1rem' }}>
              <PanicBoard />
            </div>
          )}

          {/* HOUSING BOARD */}
          {activeTab === 'housing' && (
            <div style={{ paddingTop: '1rem' }}>
              <HousingBoard />
            </div>
          )}

          {/* DIRECTORY TAB */}
          {activeTab === 'directory' && (
            <div>
              <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Search by name or location..." 
                  className="input-field"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  style={{ flex: '1 1 300px' }}
                />
                <select className="input-field" style={{ flex: '1 1 200px' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="">All Categories</option>
                  <option value="Logistics">Logistics / Removals</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Legal Services">Legal Services / Visas</option>
                  <option value="Financial Services">Financial Services</option>
                </select>
              </div>

              {pendingCount > 0 && (
                <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto', padding: '1rem', background: '#FFFBEB', borderRadius: '12px', border: '1px solid #FEF3C7', color: '#92400E', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>{pendingCount}</strong> places are currently pending review by the community team.</span>
                  <a href="#" style={{ fontWeight: 600, textDecoration: 'underline' }}>View Pending</a>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filteredDirectory.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <h3>No matching places found.</h3>
                  </div>
                ) : (
                  filteredDirectory.map(firm => (
                    <div key={firm.id} className="card" style={{ display: 'flex', flexDirection: 'column', border: firm.isSponsored ? '1px solid var(--secondary-accent)' : '1px solid var(--border-color)', boxShadow: firm.isSponsored ? '0 4px 20px rgba(0, 36, 125, 0.1)' : 'var(--shadow-sm)' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0 }}>{firm.name}</h3>
                          {firm.isSponsored && (
                            <span style={{ background: '#EBF4FF', color: 'var(--secondary-accent)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Ad</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FFF3EE', color: 'var(--primary-accent)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600, fontSize: '0.9rem' }}>
                          <Star size={16} fill="currentColor" /> {calcRating(firm.recommendations)}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {firm.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={16} /> {firm.type}</span>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', flexGrow: 1 }}>
                        <h5 style={{ color: 'var(--secondary-accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MessageSquare size={16} /> Community Stories
                        </h5>
                        {firm.recommendations.length === 0 ? (
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>It's quiet here... why not be the first to drop a review and welcome others? 💛</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {firm.recommendations.slice(0, 2).map(rec => (
                              <div key={rec.id} style={{ display: 'flex', gap: '0.75rem', background: '#F7FAFC', padding: '1rem', borderRadius: '12px' }}>
                                <img src={rec.author.avatar} alt={rec.author.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
                                    <span>{rec.author.name}</span>
                                    <span style={{ color: '#F6AD55', display: 'flex', alignItems: 'center' }}><Star size={12} fill="currentColor"/> {rec.rating}</span>
                                  </div>
                                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>"{rec.text}"</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SUBMIT TAB */}
          {activeTab === 'submit' && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Submit a Place</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Search for the business below to automatically verify its legitimacy via Google Maps.
                </p>
              </div>

              <form onSubmit={handleSubmitFirm} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: '#F7FAFC', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: 0, color: 'var(--secondary-accent)' }}>Basic Information</h4>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Search Place/Firm Name *</label>
                    <input 
                      ref={placeNameRef} 
                      name="name" 
                      type="text" 
                      className="input-field" 
                      placeholder="Start typing a business name..."
                      required 
                      style={{ background: 'white', borderColor: 'var(--primary-accent)', boxShadow: '0 0 0 2px rgba(230, 106, 70, 0.1)' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Location (City, Country) *</label>
                    <input ref={locationRef} name="location" type="text" className="input-field" placeholder="e.g. Sydney, Australia" required style={{ background: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Category *</label>
                    <select name="type" className="input-field" required defaultValue="" style={{ background: 'white' }}>
                      <option value="" disabled>Select a category...</option>
                      <option value="Logistics">Logistics / Removals</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Legal Services">Legal Services / Visas</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Recruitment">Recruitment</option>
                      <option value="Other">Other Community Hub</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: '#F7FAFC', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: 0, color: 'var(--secondary-accent)' }}>Verification Data</h4>
                  <p style={{ margin: '-0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>This may have been auto-filled by Google Maps.</p>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Google Maps URL <i>(Optional)</i></label>
                    <input ref={mapUrlRef} name="googleMapsUrl" type="url" className="input-field" placeholder="https://maps.google.com/..." style={{ background: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Companies House / Reg. Number <i>(Optional)</i></label>
                    <input name="companiesHouseId" type="text" className="input-field" placeholder="e.g. 12345678" style={{ background: 'white' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: '#FFF3EE', borderRadius: '12px', border: '1px solid #FFE4D6' }}>
                  <h4 style={{ margin: 0, color: 'var(--primary-accent)' }}>Include a Review</h4>
                  <p style={{ margin: '-0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Did you use their services? Add your review to be published once approved.</p>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Rating (1-5)</label>
                    <input name="rating" type="number" min="1" max="5" defaultValue="5" className="input-field" style={{ background: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Review Details</label>
                    <textarea name="reviewText" rows={3} className="input-field" style={{ resize: 'vertical', background: 'white' }} placeholder="Share your experience..."></textarea>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Submit for Verification</button>
              </form>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
