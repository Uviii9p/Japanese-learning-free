'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { formatNumber } from '@/lib/utils';
import { BarChart2, Trophy, Flame, BookOpen, Clock, Target, Award } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const mockWeeklyData = [
  { day: 'Mon', xp: 40 },
  { day: 'Tue', xp: 80 },
  { day: 'Wed', xp: 60 },
  { day: 'Thu', xp: 120 },
  { day: 'Fri', xp: 90 },
  { day: 'Sat', xp: 150 },
  { day: 'Sun', xp: 110 },
];

export default function ProgressPage() {
  const { totalXP, streak, learnedVocabulary, learnedKanji, learnedGrammar, listeningScore, readingScore, writingScore, speakingScore } = useAppStore();

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BarChart2 size={28} color="var(--indigo-400)" /> Learning Analytics — 進捗分析
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Track your weekly XP growth, skill breakdown, and long-term mastery.
      </p>

      {/* Weekly XP Chart Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Weekly XP Growth
        </h2>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockWeeklyData}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e63155" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#e63155" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="xp" stroke="#e63155" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Skill Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '1rem' }}>
        {[
          { label: 'Listening Skill', score: listeningScore, color: '#3b82f6' },
          { label: 'Reading Skill', score: readingScore, color: '#10b981' },
          { label: 'Writing Skill', score: writingScore, color: '#8b5cf6' },
          { label: 'Speaking Skill', score: speakingScore, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, marginBottom: '0.5rem' }}>{s.score}%</div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${s.score}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
