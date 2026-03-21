import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Target } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const INITIAL_QUESTS: Quest[] = [
  { id: 'q0', title: 'Activate a UK SIM Card', description: 'Priority #1 at the airport or corner shop (Giffgaff/Voxi). You need a UK +44 number for 2FA on banks and leases.', completed: false },
  { id: 'q1', title: 'Collect BRP / Visa Validation', description: 'Pick up your Biometric Residence Permit from the designated Post Office within 10 days of arrival.', completed: false },
  { id: 'q2', title: 'Open a Monzo/Revolut Account', description: 'Get a UK bank account setup instantly without needing proof of address.', completed: false },
  { id: 'q_transit', title: 'Master the Transit', description: 'Download Citymapper (do not rely on Google Maps) and link a contactless card for the Tube.', completed: false },
  { id: 'q3', title: 'Apply for National Insurance Number', description: 'Required to work in the UK. Apply online or by phone.', completed: false },
  { id: 'q4', title: 'Find a Flat / Room', description: 'Check popular sites like SpareRoom or Rightmove, or check out our own CANZUK Housing board for local spare rooms from fellow expats.', completed: false },
  { id: 'q_tax', title: 'Register for Council Tax & Utilities', description: 'Once you sign a lease, you must legally register with your local borough and energy supplier.', completed: false },
  { id: 'q5', title: 'Register with a GP', description: 'Register with a local NHS General Practitioner for healthcare access. Do this before you actually get sick!', completed: false }
];

export default function SurvivalQuests() {
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('canzuk_survival_quests_v3');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  useEffect(() => {
    localStorage.setItem('canzuk_survival_quests_v3', JSON.stringify(quests));
  }, [quests]);

  const toggleQuest = (id: string) => {
    setQuests(quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q));
  };

  const completedCount = quests.filter(q => q.completed).length;
  const progress = Math.round((completedCount / quests.length) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card"
      style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--secondary-accent)' }}>
        <Target size={24} />
        <h3 style={{ margin: 0 }}>Survival Quests</h3>
      </div>
      
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
        Tackle these essential Day 1 hurdles to complete your CANZUK relocation.
      </p>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%', background: 'var(--primary-accent)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {quests.map(quest => (
          <div 
            key={quest.id} 
            onClick={() => toggleQuest(quest.id)}
            style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              alignItems: 'flex-start',
              cursor: 'pointer',
              opacity: quest.completed ? 0.6 : 1,
              transition: 'opacity 0.2s ease'
            }}
          >
            <div style={{ color: quest.completed ? 'var(--primary-accent)' : 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }}>
              {quest.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </div>
            <div>
              <h5 style={{ margin: '0 0 0.25rem 0', color: quest.completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: quest.completed ? 'line-through' : 'none' }}>
                {quest.title}
              </h5>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {quest.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {progress === 100 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '1.5rem', padding: '1rem', background: '#FFF3EE', color: 'var(--primary-accent)', borderRadius: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}
        >
          🎉 Incredible! You're officially a local!
        </motion.div>
      )}
    </motion.div>
  );
}
