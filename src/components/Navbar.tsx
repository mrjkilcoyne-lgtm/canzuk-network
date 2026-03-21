import { Link, useLocation } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Community Hub', path: '/community' },
    { name: 'OS Guides', path: '/guides' },
    { name: 'Civic Duty', path: '/civic' },
    { name: 'Our Mission', path: '/about' },
    { name: 'Premium', path: '/subscribe' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-accent)' }}>
          <Globe2 size={32} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Canzuk <span style={{ color: 'var(--secondary-accent)' }}>Ltd</span>
          </span>
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: location.pathname === link.path ? 'var(--primary-accent)' : 'var(--text-muted)',
                position: 'relative'
              }}
            >
              {link.name}
              {location.pathname === link.path && (
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '3px',
                  backgroundColor: 'var(--primary-accent)',
                  borderRadius: '2px'
                }} />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
