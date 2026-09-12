'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { Map, CheckCircle2, Lock, Sparkles, Play } from 'lucide-react';

const pathNodes = [
  { id: 'hiragana', title: 'Hiragana', icon: 'あ', href: '/learn/hiragana', level: 'Beginner', color: '#ec4899', isUnlocked: true },
  { id: 'katakana', title: 'Katakana', icon: 'ア', href: '/learn/katakana', level: 'Beginner', color: '#3b82f6', isUnlocked: true },
  { id: 'basic_vocab', title: 'Basic Vocabulary', icon: '📖', href: '/learn/vocabulary', level: 'N5', color: '#10b981', isUnlocked: true },
  { id: 'n5', title: 'JLPT N5 Core', icon: '📗', href: '/learn/grammar', level: 'N5', color: '#10b981', isUnlocked: true },
  { id: 'n4', title: 'JLPT N4 Intermediate', icon: '📘', href: '/jlpt', level: 'N4', color: '#3b82f6', isUnlocked: true },
  { id: 'n3', title: 'JLPT N3 Advanced', icon: '📙', href: '/jlpt', level: 'N3', color: '#8b5cf6', isUnlocked: false },
  { id: 'n2', title: 'JLPT N2 Pre-Expert', icon: '📕', href: '/jlpt', level: 'N2', color: '#f59e0b', isUnlocked: false },
  { id: 'n1', title: 'JLPT N1 Mastery', icon: '🏆', href: '/jlpt', level: 'N1', color: '#ef4444', isUnlocked: false },
  { id: 'master', title: '日本語マスター', icon: '🏯', href: '/jlpt', level: 'Master', color: '#dc2626', isUnlocked: false },
];

export default function CourseMapPage() {
  const { completedLessons } = useAppStore();

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Map size={28} color="var(--sakura-400)" /> Japanese Mastery Map — コースマップ
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
        Your interactive journey from zero Japanese knowledge to N1 Japanese Master.
      </p>

      <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
        {pathNodes.map((node, i) => (
          <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <Link href={node.isUnlocked ? node.href : '#'} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={node.isUnlocked ? { scale: 1.1 } : {}}
                whileTap={node.isUnlocked ? { scale: 0.95 } : {}}
                className={`course-node-icon ${node.isUnlocked ? 'completed' : 'locked'}`}
                style={{
                  width: 72, height: 72,
                  fontSize: '2rem',
                  fontFamily: 'Noto Sans JP',
                  background: node.isUnlocked ? 'var(--bg-card)' : 'var(--bg-elevated)',
                  borderColor: node.isUnlocked ? node.color : 'var(--border-subtle)',
                }}
              >
                {node.isUnlocked ? node.icon : <Lock size={24} color="var(--text-muted)" />}
              </motion.div>
            </Link>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: node.isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {node.title}
              </div>
              <span className="badge badge-n5" style={{ fontSize: '0.65rem' }}>{node.level}</span>
            </div>

            {i < pathNodes.length - 1 && (
              <div style={{ width: 3, height: 36, background: node.isUnlocked ? node.color : 'var(--border-subtle)', margin: '0.5rem 0' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
