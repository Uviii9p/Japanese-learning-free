'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import { Trophy, Flame, Star, BookOpen, Edit3, Award, Sparkles, CheckCircle2, Shield, Settings, Upload } from 'lucide-react';
import Link from 'next/link';

const presetAvatars = [
  { id: 'fuji-sakura', type: 'image', value: '/avatar.png', label: 'Mount Fuji & Sakura (Custom Artwork)' },
  { id: 'flag', type: 'emoji', value: '🎌', label: 'Japanese Flag' },
  { id: 'sakura', type: 'emoji', value: '🌸', label: 'Sakura Blossom' },
  { id: 'castle', type: 'emoji', value: '🏯', label: 'Japanese Castle' },
  { id: 'torii', type: 'emoji', value: '⛩️', label: 'Torii Gate' },
  { id: 'ninja', type: 'emoji', value: '🥷', label: 'Ninja Master' },
  { id: 'kitsune', type: 'emoji', value: '🦊', label: 'Spirit Kitsune' },
  { id: 'samurai', type: 'emoji', value: '⚔️', label: 'Samurai' },
  { id: 'matcha', type: 'emoji', value: '🍵', label: 'Matcha Tea' },
  { id: 'cat', type: 'emoji', value: '🐱', label: 'Maneki Neko' },
];

export default function ProfilePage() {
  const {
    displayName, setDisplayName,
    avatar, setAvatar,
    totalXP, streak, jlptLevel,
    learnedHiragana, learnedKatakana, learnedKanji, learnedVocabulary, learnedGrammar,
    completedLessons, unlockedAchievements, getXPProgress
  } = useAppStore();

  const [nameInput, setNameInput] = useState(displayName);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const xpProgress = getXPProgress();

  const handleNameSave = () => {
    setDisplayName(nameInput);
    triggerSuccess('Display name updated!');
  };

  const handleSelectAvatar = (newAvatar: string) => {
    setAvatar(newAvatar);
    triggerSuccess('Profile picture updated!');
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setAvatar(customUrlInput.trim());
      triggerSuccess('Custom avatar image set!');
      setCustomUrlInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          triggerSuccess('Uploaded custom profile picture!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="page-content" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Toast message */}
      {successMessage && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: 'var(--sakura-500)', color: '#fff',
          padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(230,49,85,0.4)',
          fontWeight: 700, fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} /> {successMessage}
        </div>
      )}

      {/* Header Profile Card */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(230,49,85,0.15) 0%, rgba(99,102,241,0.15) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-2xl)',
        padding: '2rem',
        marginBottom: '2rem',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(230,49,85,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          {/* Avatar with edit overlay */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
            <Avatar src={avatar || '/avatar.png'} size="2xl" />
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              background: 'var(--sakura-500)', color: '#fff',
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--bg-card)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              <Edit3 size={16} />
            </div>
          </div>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(230,49,85,0.15)', border: '1px solid rgba(230,49,85,0.3)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--sakura-400)', marginBottom: '0.5rem' }}>
              <Shield size={14} /> Level {xpProgress.level}: {xpProgress.title} • {jlptLevel} Rank
            </div>
            
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
              {displayName}
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Japanese Learner • JLPT Target: {jlptLevel}
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total XP</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-400)' }}>⭐ {totalXP.toLocaleString()}</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Day Streak</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f97316' }}>🔥 {streak} Days</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lessons Done</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sakura-400)' }}>📚 {completedLessons.length}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
              🖼️ Change PFP
            </button>
            <Link href="/settings" className="btn btn-secondary">
              <Settings size={16} /> Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Avatar / PFP Picker Drawer / Modal */}
      {showAvatarPicker && (
        <div style={{
          background: 'var(--bg-card)',
          border: '2px solid var(--sakura-500)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ Choose Your Japanese Profile Picture (PFP)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Select our high-resolution Japanese Fuji artwork, pick an emoji avatar, or upload your own image!
          </p>

          {/* Preset list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {presetAvatars.map(preset => {
              const isSelected = avatar === preset.value;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectAvatar(preset.value)}
                  style={{
                    background: isSelected ? 'rgba(230,49,85,0.15)' : 'var(--bg-card-hover)',
                    border: isSelected ? '2px solid var(--sakura-500)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Avatar src={preset.value} size="lg" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Upload Custom Image & Custom URL */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* File Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                📁 Upload Custom Image File
              </label>
              <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Upload size={16} /> Choose File...
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Image URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                🔗 Image URL
              </label>
              <form onSubmit={handleCustomUrlSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="url"
                  className="input"
                  placeholder="https://example.com/pfp.png"
                  value={customUrlInput}
                  onChange={e => setCustomUrlInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary btn-sm">Set</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Info & Learning Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Name edit */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            ✏️ Profile Details
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
              Display Name
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="input"
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={handleNameSave}>Save</button>
            </div>
          </div>
        </div>

        {/* Knowledge Progress Breakdown */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            📊 Learning Mastery Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(230,49,85,0.06)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hiragana</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--sakura-400)' }}>{learnedHiragana.length} / 46</div>
            </div>
            <div style={{ background: 'rgba(99,102,241,0.06)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Katakana</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--indigo-400)' }}>{learnedKatakana.length} / 46</div>
            </div>
            <div style={{ background: 'rgba(234,179,8,0.06)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kanji</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-400)' }}>{learnedKanji.length}</div>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.06)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vocabulary</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22c55e' }}>{learnedVocabulary.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
