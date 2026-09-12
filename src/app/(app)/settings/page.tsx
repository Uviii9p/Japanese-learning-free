'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import { Settings as SettingsIcon, Moon, Sun, Volume2, Eye, Shield, User, Trash2, Camera } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const {
    displayName, setDisplayName, avatar, setAvatar, theme, setTheme,
    dailyGoalXP, setDailyGoal, soundEnabled, setSoundEnabled,
    furiganaMode, setFuriganaMode, animationsEnabled, setAnimationsEnabled
  } = useAppStore();

  const [name, setName] = useState(displayName);

  return (
    <div className="page-content">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={28} color="var(--sakura-400)" /> Settings — 設定
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Customize your profile, study targets, theme preferences, and learning experience.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Section */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} color="var(--sakura-400)" /> Profile Preferences
              </h2>
              <a href="/settings/audio-test" className="btn btn-secondary btn-sm">
                🎙️ Audio & Voice Settings
              </a>
            </div>

            {/* Avatar & PFP display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '1rem', background: 'rgba(230,49,85,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(230,49,85,0.1)' }}>
              <Avatar src={avatar || '/avatar.png'} size="xl" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Profile Picture (PFP)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Custom Japanese Fuji & Sakura artwork active
                </div>
                <Link href="/profile" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                  <Camera size={14} /> Change PFP & Avatar
                </Link>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                Learner Display Name
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => setDisplayName(name)}>
                  Save
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                Daily XP Goal
              </label>
              <select
                className="input"
                value={dailyGoalXP}
                onChange={e => setDailyGoal(Number(e.target.value))}
              >
                <option value={20}>5 min / day (20 XP)</option>
                <option value={40}>10 min / day (40 XP)</option>
                <option value={60}>15 min / day (60 XP)</option>
                <option value={100}>30 min / day (100 XP)</option>
                <option value={200}>60 min / day (200 XP)</option>
              </select>
            </div>
          </div>

          {/* Learning & Display Preferences */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} color="var(--gold-400)" /> Display & Furigana
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                Furigana Display Mode
              </label>
              <select
                className="input"
                value={furiganaMode}
                onChange={e => setFuriganaMode(e.target.value as any)}
              >
                <option value="always">Always Show Furigana (Beginner)</option>
                <option value="learning">Show for Unlearned Kanji</option>
                <option value="never">Hide Furigana (Advanced Kanji Reading)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                App Theme
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTheme('dark')}
                  style={{ flex: 1 }}
                >
                  <Moon size={16} /> Dark Mode
                </button>
                <button
                  className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTheme('light')}
                  style={{ flex: 1 }}
                >
                  <Sun size={16} /> Light Mode
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Audio Sound Effects</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Play audio beeps for correct/incorrect answers</div>
              </div>
              <button
                className={`btn ${soundEnabled ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Application Creator Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(230,49,85,0.08) 0%, rgba(99,102,241,0.08) 100%)',
            border: '1px solid rgba(230,49,85,0.15)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              Application Creator
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}>
              <div style={{
                width: 40, height: 40,
                background: 'linear-gradient(135deg, var(--sakura-500), #6366f1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 900,
                color: '#fff',
                boxShadow: '0 4px 12px rgba(230,49,85,0.4)',
              }}>SR</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Sujal Rathod
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--sakura-400)', fontWeight: 700 }}>
                  Creator & Developer • Japanese Mastery
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              🇯🇵 Japanese Mastery — Learn Japanese from Zero to N1
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              v1.0.0 • Built with Next.js 16 & ❤️
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
