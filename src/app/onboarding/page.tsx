'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ChevronRight, ChevronLeft, Sparkles, Target, Clock, Map } from 'lucide-react';

const SAKURA_PETALS = ['🌸', '🌺', '🌸', '🌸', '🌺'];

function SakuraBackground() {
  return (
    <div
      className="sakura-bg"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="sakura-petal"
          style={{
            position: 'absolute',
            top: '-30px',
            left: `${(i * 7.2 + 2) % 96}%`,
            fontSize: `${0.85 + (i * 0.12) % 0.65}rem`,
            animationName: 'sakura-fall',
            animationDuration: `${7 + (i * 1.4) % 7}s`,
            animationDelay: `${(i * 0.65) % 5}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            opacity: 0.65,
            willChange: 'transform, opacity',
            userSelect: 'none',
            filter: 'drop-shadow(0 2px 6px rgba(217,49,83,0.25))',
          }}
        >
          {SAKURA_PETALS[i % SAKURA_PETALS.length]}
        </div>
      ))}
      <style>{`
        @keyframes sakura-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(52vh) translateX(28px) rotate(180deg);
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(106vh) translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

const levelOptions = [
  { id: 'absolute_beginner', label: 'Complete Beginner', labelJP: '全くの初めて', description: 'I know no Japanese at all', icon: '🌱', color: '#10b981' },
  { id: 'knows_hiragana', label: 'I know Hiragana', labelJP: 'ひらがな知ってる', description: 'I can read hiragana characters', icon: 'あ', color: '#3b82f6' },
  { id: 'basic_japanese', label: 'I know basic Japanese', labelJP: '基礎的な日本語', description: 'A few words and phrases', icon: '💬', color: '#8b5cf6' },
  { id: 'n5', label: 'JLPT N5 Level', labelJP: 'JLPT N5', description: 'Elementary Japanese', icon: '📗', color: '#f59e0b' },
  { id: 'n4', label: 'JLPT N4 Level', labelJP: 'JLPT N4', description: 'Elementary to Intermediate', icon: '📘', color: '#ef4444' },
  { id: 'n3', label: 'JLPT N3 Level', labelJP: 'JLPT N3', description: 'Intermediate Japanese', icon: '📙', color: '#ec4899' },
  { id: 'n2', label: 'JLPT N2 Level', labelJP: 'JLPT N2', description: 'Upper Intermediate', icon: '📕', color: '#6366f1' },
  { id: 'n1', label: 'JLPT N1 Level', labelJP: 'JLPT N1', description: 'Advanced Japanese', icon: '🏆', color: '#dc2626' },
];

const goalOptions = [
  { id: 'anime', label: 'Anime & Manga', icon: '🎌', description: 'Enjoy media without subtitles' },
  { id: 'travel', label: 'Travel', icon: '✈️', description: 'Navigate Japan confidently' },
  { id: 'conversation', label: 'Conversation', icon: '💬', description: 'Talk with Japanese speakers' },
  { id: 'school', label: 'School / Study', icon: '📚', description: 'Academic purposes' },
  { id: 'work', label: 'Work / Business', icon: '💼', description: 'Professional Japanese' },
  { id: 'jlpt', label: 'JLPT Certification', icon: '🎓', description: 'Pass a JLPT exam' },
  { id: 'living', label: 'Living in Japan', icon: '🏯', description: 'Daily life in Japan' },
  { id: 'interest', label: 'Personal Interest', icon: '🌸', description: 'Pure curiosity and love' },
];

const dailyGoalOptions = [
  { minutes: 5, xp: 20, label: '5 minutes', description: 'Casual', icon: '🌙' },
  { minutes: 10, xp: 40, label: '10 minutes', description: 'Regular', icon: '⭐' },
  { minutes: 15, xp: 60, label: '15 minutes', description: 'Committed', icon: '🔥' },
  { minutes: 30, xp: 100, label: '30 minutes', description: 'Serious', icon: '💪' },
  { minutes: 60, xp: 200, label: '60 minutes', description: 'Intensive', icon: '🚀' },
];

const roadmapSteps: Record<string, string[]> = {
  absolute_beginner: ['Japanese Basics', 'Hiragana', 'Katakana', 'N5', 'N4', 'N3', 'N2', 'N1'],
  knows_hiragana: ['Katakana', 'N5', 'N4', 'N3', 'N2', 'N1'],
  basic_japanese: ['N5 Review', 'N4', 'N3', 'N2', 'N1'],
  n5: ['N5 Review', 'N4', 'N3', 'N2', 'N1'],
  n4: ['N4 Review', 'N3', 'N2', 'N1'],
  n3: ['N3 Review', 'N2', 'N1'],
  n2: ['N2 Review', 'N1'],
  n1: ['Advanced Mastery', 'Business Japanese', 'Literature'],
};

const estimatedDays: Record<string, number> = {
  absolute_beginner: 730,
  knows_hiragana: 640,
  basic_japanese: 550,
  n5: 450,
  n4: 330,
  n3: 210,
  n2: 100,
  n1: 60,
};

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useAppStore(s => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState('absolute_beginner');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedDaily, setSelectedDaily] = useState(dailyGoalOptions[1]);
  const [displayName, setDisplayName] = useState('');

  const steps = [
    'welcome',
    'level',
    'goals',
    'daily',
    'roadmap',
  ];

  const totalSteps = steps.length;

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const levelMap: Record<string, string> = {
      absolute_beginner: 'beginner',
      knows_hiragana: 'beginner',
      basic_japanese: 'n5',
      n5: 'n5',
      n4: 'n4',
      n3: 'n3',
      n2: 'n2',
      n1: 'n1',
    };
    const jlptMap: Record<string, any> = {
      absolute_beginner: 'Beginner',
      knows_hiragana: 'Beginner',
      basic_japanese: 'N5',
      n5: 'N5',
      n4: 'N4',
      n3: 'N3',
      n2: 'N2',
      n1: 'N1',
    };
    completeOnboarding({
      displayName: displayName || 'Learner',
      level: levelMap[selectedLevel],
      jlptLevel: jlptMap[selectedLevel],
      learningGoals: selectedGoals,
      dailyGoalXP: selectedDaily.xp,
      onboardingComplete: true,
    });
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <SakuraBackground />
      
      {/* Background gradient orbs */}
      <div style={{
        position: 'fixed', top: '20%', left: '15%',
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(230,49,85,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', right: '15%',
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 520, padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Progress indicator */}
        {step > 0 && (
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: 8 }}>
            {steps.slice(1).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 4,
                  width: i < step - 1 ? 32 : i === step - 1 ? 32 : 20,
                  borderRadius: 9999,
                  background: i < step ? 'var(--sakura-500)' : 'rgba(255,255,255,0.12)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{ fontSize: '5rem', marginBottom: '1.5rem', display: 'block' }}
              >
                🇯🇵
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: 'Noto Sans JP, sans-serif',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                  marginBottom: '0.75rem',
                }}
              >
                日本語を学ぼう
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
              >
                Master Japanese from zero to N1.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '3rem' }}
              >
                Your complete Japanese learning journey starts here.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'left' }}>
                    What's your name? (optional)
                  </label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Your name..."
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="btn btn-primary btn-lg"
                onClick={() => setStep(1)}
                style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
              >
                Start Learning <ChevronRight size={20} />
              </motion.button>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}
              >
                {[
                  { icon: '🎌', label: 'Hiragana & Katakana' },
                  { icon: '漢', label: 'Kanji System' },
                  { icon: '🎧', label: 'Listening & Speaking' },
                  { icon: '🏆', label: 'N5 → N1 Path' },
                ].map(f => (
                  <div key={f.icon} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{f.icon}</div>
                    {f.label}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="level"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                What's your Japanese level?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                We'll personalize your learning path based on where you are now.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {levelOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLevel(option.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${selectedLevel === option.id ? option.color : 'var(--border-subtle)'}`,
                      background: selectedLevel === option.id ? `${option.color}18` : 'var(--bg-card)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      width: '100%',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', fontFamily: 'Noto Sans JP, sans-serif', minWidth: 36, textAlign: 'center' }}>{option.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{option.label}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{option.description}</div>
                    </div>
                    {selectedLevel === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          width: 20, height: 20,
                          borderRadius: '50%',
                          background: option.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', color: 'white', fontWeight: 800,
                        }}
                      >✓</motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep(0)} style={{ flex: 0.4 }}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button className="btn btn-primary" onClick={() => setStep(2)} style={{ flex: 1 }}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Why are you learning Japanese?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Choose all that apply. We'll tailor content to your interests.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {goalOptions.map(goal => {
                  const selected = selectedGoals.includes(goal.id);
                  return (
                    <motion.button
                      key={goal.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleGoal(goal.id)}
                      style={{
                        padding: '0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${selected ? 'var(--sakura-500)' : 'var(--border-subtle)'}`,
                        background: selected ? 'rgba(230,49,85,0.1)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.375rem' }}>{goal.icon}</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8rem' }}>{goal.label}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{goal.description}</div>
                    </motion.button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 0.4 }}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button className="btn btn-primary" onClick={() => setStep(3)} style={{ flex: 1 }}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                How much time can you study each day?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Even 5 minutes every day adds up. Consistency beats intensity.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {dailyGoalOptions.map(option => {
                  const selected = selectedDaily.minutes === option.minutes;
                  return (
                    <motion.button
                      key={option.minutes}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDaily(option)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${selected ? 'var(--sakura-500)' : 'var(--border-subtle)'}`,
                        background: selected ? 'rgba(230,49,85,0.1)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        width: '100%',
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{option.label}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{option.description}</div>
                      </div>
                      <div style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.875rem' }}>
                        +{option.xp} XP/day
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ flex: 0.4 }}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button className="btn btn-primary" onClick={() => setStep(4)} style={{ flex: 1 }}>
                  See My Roadmap <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles size={32} color="var(--gold-400)" style={{ marginBottom: '0.75rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                  あなたの日本語ロードマップ
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                  Your personalized Japanese journey
                </p>
              </motion.div>

              {/* Roadmap */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
              }}>
                {roadmapSteps[selectedLevel]?.map((step_label, i) => (
                  <motion.div
                    key={step_label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0,
                    }}>
                      <div style={{
                        width: 32, height: 32,
                        borderRadius: '50%',
                        background: i === 0 ? 'var(--sakura-500)' : 'var(--bg-elevated)',
                        border: '2px solid ' + (i === 0 ? 'var(--sakura-500)' : 'var(--border-medium)'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: i === 0 ? 'white' : 'var(--text-muted)',
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      {i < (roadmapSteps[selectedLevel]?.length ?? 0) - 1 && (
                        <div style={{ width: 2, height: 24, background: 'var(--border-subtle)', flexShrink: 0 }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: i < (roadmapSteps[selectedLevel]?.length ?? 0) - 1 ? '0.75rem' : 0 }}>
                      <div style={{ fontWeight: 600, color: i === 0 ? 'var(--sakura-400)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {step_label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}
              >
                <div style={{
                  flex: 1, padding: '1rem', background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <Clock size={20} color="var(--sakura-400)" style={{ marginBottom: '0.25rem' }} />
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    {selectedDaily.minutes}m
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Goal</div>
                </div>
                <div style={{
                  flex: 1, padding: '1rem', background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <Map size={20} color="var(--gold-400)" style={{ marginBottom: '0.25rem' }} />
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    ~{estimatedDays[selectedLevel]}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Est. Days</div>
                </div>
                <div style={{
                  flex: 1, padding: '1rem', background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <Target size={20} color="var(--indigo-400)" style={{ marginBottom: '0.25rem' }} />
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    {selectedGoals.length || 1}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Goals</div>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="btn btn-primary btn-lg"
                onClick={handleFinish}
                style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
              >
                🎌 Begin My Japanese Journey!
              </motion.button>
              
              <button
                className="btn btn-ghost"
                onClick={() => setStep(3)}
                style={{ width: '100%', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}
              >
                <ChevronLeft size={16} /> Go back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
