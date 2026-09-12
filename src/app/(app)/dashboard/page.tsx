'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { getGreeting, formatNumber } from '@/lib/utils';
import { getXPLevel, motivationalMessages } from '@/content/courses';
import {
  BookOpen, Flame, Trophy, ChevronRight, Star,
  Headphones, Mic, Edit3, BarChart2, Clock, Zap, BookMarked, MessageCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Animated progress ring
function ProgressRing({ value, size = 80, strokeWidth = 6, color = '#e63155', label, labelSub }: {
  value: number; size?: number; strokeWidth?: number; color?: string; label: string; labelSub?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontWeight: 800, fontSize: size > 70 ? '1rem' : '0.8rem', color: 'var(--text-primary)' }}>
            {value}%
          </span>
        </div>
      </div>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>{label}</span>
      {labelSub && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>{labelSub}</span>}
    </div>
  );
}

// XP Progress Bar
function XPProgressBar({ current, max, percentage }: { current: number; max: number; percentage: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Today's Goal</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{current} / {max} XP</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(100, percentage)}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  );
}

const quickActions = [
  { href: '/learn/hiragana', icon: 'あ', label: 'Hiragana', color: 'from-pink-500 to-rose-600', bg: 'rgba(236,72,153,0.1)' },
  { href: '/learn/katakana', icon: 'ア', label: 'Katakana', color: 'from-blue-500 to-indigo-600', bg: 'rgba(99,102,241,0.1)' },
  { href: '/learn/kanji', icon: '漢', label: 'Kanji', color: 'from-red-500 to-orange-600', bg: 'rgba(239,68,68,0.1)' },
  { href: '/learn/vocabulary', icon: '📚', label: 'Vocabulary', color: 'from-emerald-500 to-teal-600', bg: 'rgba(16,185,129,0.1)' },
  { href: '/learn/grammar', icon: '✍️', label: 'Grammar', color: 'from-amber-500 to-yellow-600', bg: 'rgba(245,158,11,0.1)' },
  { href: '/learn/listening', icon: '🎧', label: 'Listening', color: 'from-violet-500 to-purple-600', bg: 'rgba(139,92,246,0.1)' },
  { href: '/learn/speaking', icon: '🎤', label: 'Speaking', color: 'from-cyan-500 to-sky-600', bg: 'rgba(6,182,212,0.1)' },
  { href: '/learn/conversation', icon: '💬', label: 'Conversation', color: 'from-fuchsia-500 to-pink-600', bg: 'rgba(217,70,239,0.1)' },
];

function StatCard({ value, label, icon, color }: { value: string | number; label: string; icon: string; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: color }}>{value}</div>
    </motion.div>
  );
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const {
    displayName, totalXP, streak, todayXP, dailyGoalXP, jlptLevel,
    learnedVocabulary, learnedKanji, learnedGrammar, learnedHiragana, learnedKatakana,
    listeningScore, readingScore, writingScore, speakingScore,
    completedLessons, getDueReviews, getXPProgress,
  } = useAppStore();

  const [greeting, setGreeting] = useState<ReturnType<typeof getGreeting> | null>(null);
  const [motivation, setMotivation] = useState<typeof motivationalMessages[0] | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
    setMotivation(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
  }, []);

  const xpProgress = getXPProgress();
  const dueReviews = getDueReviews();
  const dailyProgress = Math.min(100, Math.round((todayXP / dailyGoalXP) * 100));
  const currentLevel = getXPLevel(totalXP);

  return (
    <div className="page-content">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header Greeting */}
        <motion.div variants={item} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {greeting?.japanese ?? ''} {displayName ? `${displayName}` : ''} 👋
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {greeting?.english ?? ''} Let's study Japanese!
              </p>
            </div>
            {streak > 0 && (
              <motion.div
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(249,115,22,0.12)',
                  border: '1px solid rgba(249,115,22,0.25)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.625rem 1rem',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🔥</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#f97316', lineHeight: 1 }}>{streak}</div>
                  <div style={{ fontSize: '0.65rem', color: '#f97316', opacity: 0.8 }}>Day Streak</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Daily Progress Card */}
        <motion.div variants={item} style={{
          background: 'linear-gradient(135deg, rgba(230,49,85,0.12), rgba(99,102,241,0.08))',
          border: '1px solid rgba(230,49,85,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Today's Goal</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{motivation?.japanese ?? ''} — {motivation?.translation ?? ''}</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--gold-400)' }}>⭐ {todayXP}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Today's XP</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{completedLessons.length}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Lessons</div>
              </div>
            </div>
          </div>
          <XPProgressBar current={todayXP} max={dailyGoalXP} percentage={dailyProgress} />
          {dailyProgress >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ marginTop: '0.75rem', textAlign: 'center', color: '#10b981', fontWeight: 700, fontSize: '0.875rem' }}
            >
              🎉 Daily goal complete! Excellent work!
            </motion.div>
          )}
        </motion.div>

        {/* Level & XP */}
        <motion.div variants={item} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
          gap: '0.75rem', marginBottom: '1.5rem'
        }}>
          <StatCard value={jlptLevel} label="JLPT Level" icon="🎓" color="var(--sakura-400)" />
          <StatCard value={formatNumber(totalXP)} label="Total XP" icon="⭐" color="var(--gold-400)" />
          <StatCard value={learnedVocabulary.length} label="Words Learned" icon="📖" color="#3b82f6" />
          <StatCard value={learnedKanji.length} label="Kanji Learned" icon="漢" color="#ef4444" />
          <StatCard value={learnedGrammar.length} label="Grammar Points" icon="📝" color="#8b5cf6" />
          <StatCard value={learnedHiragana.length + learnedKatakana.length} label="Kana Learned" icon="あ" color="#10b981" />
        </motion.div>

        {/* Skill Rings */}
        <motion.div variants={item} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Skill Progress</h2>
            <Link href="/progress" style={{ fontSize: '0.75rem', color: 'var(--sakura-400)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            <ProgressRing value={listeningScore} color="#3b82f6" label="Listening" />
            <ProgressRing value={readingScore} color="#10b981" label="Reading" />
            <ProgressRing value={writingScore} color="#8b5cf6" label="Writing" />
            <ProgressRing value={speakingScore} color="#f59e0b" label="Speaking" />
          </div>
        </motion.div>

        {/* Due Reviews */}
        {dueReviews.length > 0 && (
          <motion.div variants={item}>
            <Link href="/review" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -2 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.08))',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Flame size={24} color="#ef4444" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {dueReviews.length} Items Due for Review
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Don't let your streak slip!</div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Quick Actions Grid */}
        <motion.div variants={item} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>
            Start Learning
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100px, 45%), 1fr))', gap: '0.625rem' }}>
            {quickActions.map((action, i) => (
              <motion.div key={action.href} variants={item}>
                <Link href={action.href} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: action.bg,
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', fontFamily: 'Noto Sans JP, sans-serif' }}>{action.icon}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>{action.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div variants={item} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {currentLevel.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Noto Sans JP, sans-serif' }}>
                {getXPLevel(totalXP)?.title}
              </div>
            </div>
            <div style={{
              background: `${currentLevel.color}22`,
              border: `1px solid ${currentLevel.color}44`,
              borderRadius: 'var(--radius-full)',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: currentLevel.color,
            }}>
              Level {xpProgress.level}
            </div>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <motion.div
              className="progress-fill"
              style={{ background: `linear-gradient(90deg, ${currentLevel.color}, ${currentLevel.color}aa)` }}
              initial={{ width: '0%' }}
              animate={{ width: `${xpProgress.percentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>{formatNumber(xpProgress.current)} XP</span>
            <span>{xpProgress.percentage}% to next level</span>
            <span>{formatNumber(xpProgress.max)} XP</span>
          </div>
        </motion.div>

        {/* Continue / Suggestions */}
        <motion.div variants={item}>
          <h2 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>
            Continue Learning
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { href: '/learn/hiragana', icon: 'あ', title: learnedHiragana.length < 46 ? 'Learn Hiragana' : 'Hiragana Review', sub: `${learnedHiragana.length}/46 learned`, color: '#ec4899', progress: Math.round((learnedHiragana.length / 46) * 100) },
              { href: '/learn/vocabulary', icon: '📖', title: 'Vocabulary Practice', sub: `${learnedVocabulary.length} words mastered`, color: '#10b981', progress: Math.min(100, Math.round((learnedVocabulary.length / 800) * 100)) },
              { href: '/learn/kanji', icon: '漢', title: 'Kanji Study', sub: `${learnedKanji.length} kanji learned`, color: '#ef4444', progress: Math.min(100, Math.round((learnedKanji.length / 40) * 100)) },
            ].map(item_data => (
              <Link key={item_data.href} href={item_data.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem 1rem',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', fontFamily: 'Noto Sans JP, sans-serif', minWidth: 36 }}>{item_data.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item_data.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{item_data.sub}</div>
                    <div className="progress-bar" style={{ height: 4, marginTop: '0.375rem' }}>
                      <div className="progress-fill" style={{ width: `${item_data.progress}%`, background: `linear-gradient(90deg, ${item_data.color}, ${item_data.color}cc)` }} />
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
