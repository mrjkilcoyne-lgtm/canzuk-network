import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, MapPin, Mail, Search, MessageSquare, Twitter, AlertCircle } from 'lucide-react';

// MOCK DATA: Simulating responses from TheyWorkForYou / Democracy Club APIs
const MOCK_CIVIC_DATA: Record<string, any> = {
  'SW4': {
    area: 'Clapham (London Borough of Lambeth)',
    mp: { name: 'Bell Ribeiro-Addy', party: 'Labour', role: 'Member of Parliament for Streatham', email: 'bell.ribeiroaddy.mp@parliament.uk', twitter: '@BellRibeiroAddy' },
    mayor: { name: 'Sadiq Khan', party: 'Labour', role: 'Mayor of London', twitter: '@MayorofLondon' },
    councillors: [
      { name: 'Linda Bray', role: 'Councillor for Clapham Common & Abbeville' },
      { name: 'Alison Griffiths', role: 'Councillor for Clapham Common & Abbeville' }
    ]
  },
  'N1': {
    area: 'Islington (London Borough of Islington)',
    mp: { name: 'Emily Thornberry', party: 'Labour', role: 'Member of Parliament for Islington South and Finsbury', email: 'emily.thornberry.mp@parliament.uk', twitter: '@EmilyThornberry' },
    mayor: { name: 'Sadiq Khan', party: 'Labour', role: 'Mayor of London', twitter: '@MayorofLondon' },
    councillors: [
      { name: 'Roulin Khondoker', role: 'Councillor for St Mary\'s & St James\'' },
      { name: 'Hannah McHugh', role: 'Councillor for St Mary\'s & St James\'' }
    ]
  }
};

export default function Civic() {
  const [postcode, setPostcode] = useState('');
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'results' | 'error'>('idle');
  const [results, setResults] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode) return;

    setSearchState('searching');
    
    // Simulate network delay
    setTimeout(() => {
      // Very basic normalization for mock matching
      const prefix = postcode.trim().toUpperCase().split(' ')[0].substring(0, 3);
      if (MOCK_CIVIC_DATA[prefix] || MOCK_CIVIC_DATA[postcode.trim().toUpperCase()]) {
        setResults(MOCK_CIVIC_DATA[prefix] || MOCK_CIVIC_DATA[postcode.trim().toUpperCase()]);
        setSearchState('results');
      } else {
        setSearchState('error');
      }
    }, 800);
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <section style={{ 
        background: 'var(--bg-panel)', 
        padding: '5rem 1rem', 
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '1rem', background: '#EBF4FF', color: 'var(--secondary-accent)', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Landmark size={48} />
          </div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Find Your Representatives</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
            The UK civic system is split into multiple levels. Enter your postcode to find exactly who represents you and who to contact for your specific issues.
          </p>

          <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Enter your UK postcode (e.g., SW4 7AA)" 
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="input-field"
              style={{ padding: '1.25rem 2rem', fontSize: '1.1rem', borderRadius: '30px', boxShadow: 'var(--shadow-md)', border: '2px solid transparent', transition: 'border 0.3s ease' }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', padding: '0 1.5rem', borderRadius: '24px' }}
              disabled={searchState === 'searching'}
            >
              <Search size={20} />
            </button>
          </form>

          {searchState === 'error' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--primary-accent)', marginTop: '1rem', fontWeight: 600 }}>
              <AlertCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/>
              We couldn't find representatives for that postcode. For this demo, try "SW4" or "N1".
            </motion.p>
          )}
        </div>
      </section>

      <div className="container" style={{ paddingTop: '4rem' }}>
        
        <AnimatePresence mode="wait">
          {searchState === 'results' && results ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#F7FAFC', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                  <MapPin size={16} /> {results.area}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                
                {/* Councillor Card */}
                <div className="card" style={{ borderTop: '4px solid #10B981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#10B981', letterSpacing: '0.05em' }}>Local Level</span>
                      <h3 style={{ margin: '0.25rem 0 0 0' }}>Borough Councillors</h3>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {results.councillors.map((c: any, i: number) => (
                      <li key={i} style={{ borderBottom: i !== results.councillors.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: i !== results.councillors.length - 1 ? '1rem' : 0 }}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.role}</div>
                      </li>
                    ))}
                  </ul>
                  <div style={{ background: '#F7FAFC', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-main)' }}>Contact them for:</strong> Bins, recycling, noise complaints, local parks, parking permits, and immediate neighborhood planning.
                  </div>
                </div>

                {/* Mayor Card */}
                {results.mayor && (
                  <div className="card" style={{ borderTop: '4px solid var(--secondary-accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--secondary-accent)', letterSpacing: '0.05em' }}>City Level</span>
                        <h3 style={{ margin: '0.25rem 0 0 0' }}>{results.mayor.name}</h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{results.mayor.role} ({results.mayor.party})</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {results.mayor.twitter && (
                        <a href={`https://twitter.com/${results.mayor.twitter.replace('@','')}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Twitter size={14} /> {results.mayor.twitter}
                        </a>
                      )}
                    </div>

                    <div style={{ background: '#F7FAFC', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-main)' }}>Their jurisdiction:</strong> Transport for London (TfL), the Metropolitan Police, fire services, and city-wide strategic housing.
                    </div>
                  </div>
                )}

                {/* MP Card */}
                <div className="card" style={{ borderTop: '4px solid var(--primary-accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-accent)', letterSpacing: '0.05em' }}>National Level</span>
                      <h3 style={{ margin: '0.25rem 0 0 0' }}>{results.mp.name}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{results.mp.role} ({results.mp.party})</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <a href={`mailto:${results.mp.email}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} /> Email MP
                    </a>
                    {results.mp.twitter && (
                      <a href={`https://twitter.com/${results.mp.twitter.replace('@','')}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Twitter size={14} /> {results.mp.twitter}
                      </a>
                    )}
                  </div>

                  <div style={{ background: '#F7FAFC', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-main)' }}>Contact them for:</strong> Visas & immigration issues, HMRC/taxation problems, NHS policy, national defense, and foreign affairs.
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="disambiguation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Default Disambiguation State */}
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Civic Disambiguation 101</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                  If you've just arrived from overseas, the UK democratic system sits on three distinct tiers. Before you fire off an angry email about a pothole, make sure you're yelling at the right person!
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <div style={{ display: 'inline-block', padding: '1rem', background: '#ECFDF5', color: '#10B981', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <MapPin size={32} />
                  </div>
                  <h3>Local Councillors</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.6 }}>
                    The hyper-local team. They handle your day-to-day neighborhood life: bin collections, recycling, parking permits, noise complaints, and local park maintenance.
                  </p>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <div style={{ display: 'inline-block', padding: '1rem', background: '#EBF4FF', color: 'var(--secondary-accent)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <Landmark size={32} />
                  </div>
                  <h3>City Mayor</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.6 }}>
                    Strategic city-wide oversight. In London, the Mayor controls Transport for London (TfL), the Metropolitan Police, and the Fire Brigade. They do not fix your local potholes.
                  </p>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <div style={{ display: 'inline-block', padding: '1rem', background: '#FFF3EE', color: 'var(--primary-accent)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <MessageSquare size={32} />
                  </div>
                  <h3>Member of Parliament</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.6 }}>
                    Your voice in Westminster. You contact your MP when a federal/national agency severely fails you: Visa complications, HMRC/Tax errors, or NHS policy blockages.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
