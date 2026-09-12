'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { achievements } from '@/content/courses';
import { Trophy, Award, Lock, CheckCircle2 } from 'lucide-react';

export default function AchievementsPage() {
  const { unlockedAchievements } = useAppStore();

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Trophy size={28} color="var(--gold-400)" /> Achievements & Badges — 実績
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Unlocked: {unlockedAchievements.length} / {achievements.length} Badges
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1rem' }}>
        {achievements.map(ach => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          return (
            <motion.div
              key={ach.id}
              whileHover={{ y: -3 }}
              style={{
                background: isUnlocked ? 'rgba(251,191,36,0.08)' : 'var(--bg-card)',
                border: `1px solid ${isUnlocked ? 'rgba(251,191,36,0.3)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: isUnlocked ? 1 : 0.6,
              }}
            >
              <div style={{
                width: 54, height: 54,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
                border: `1px solid ${isUnlocked ? 'var(--gold-400)' : 'var(--border-subtle)'}`
              }}>
                {isUnlocked ? ach.icon : <Lock size={22} color="var(--text-muted)" />}
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {ach.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.1rem 0' }}>
                  {ach.description}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700 }}>
                  +{ach.xpReward} XP
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
