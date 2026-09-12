'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { voiceManager, VoiceStatus } from '@/lib/audio/voiceManager';
import { japaneseVoiceEngine } from '@/lib/audio/JapaneseVoiceEngine';
import { JapaneseAudioButton } from '@/components/audio/JapaneseAudioButton';
import { useAppStore } from '@/lib/store';
import { Volume2, CheckCircle2, AlertTriangle, RefreshCw, Sliders, Play, Square, Sparkles } from 'lucide-react';

const testPhrases = [
  { japanese: 'こんにちは。', english: 'Hello / Good afternoon.' },
  { japanese: 'おはようございます。', english: 'Good morning.' },
  { japanese: 'ありがとうございます。', english: 'Thank you very much.' },
  { japanese: '日本語を勉強しています。', english: 'I am studying Japanese.' },
  { japanese: '私は学生です。', english: 'I am a student.' },
  { japanese: '今日はいい天気ですね。', english: 'The weather is nice today, isn\'t it?' },
];

export default function AudioTestPage() {
  const { soundEnabled, setSoundEnabled } = useAppStore();
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>(voiceManager.getStatus());
  const [speed, setSpeed] = useState<number>(0.85);
  const [pitch, setPitch] = useState<number>(1.05);
  const [volume, setVolume] = useState<number>(1.0);
  const [style, setStyle] = useState<'gentle' | 'teacher' | 'friendly' | 'energetic'>('friendly');
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [testText, setTestText] = useState('こんにちは。日本語を一緒に勉強しましょう！');

  useEffect(() => {
    const unsubscribe = voiceManager.subscribe(status => {
      setVoiceStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const handleTestVoice = () => {
    japaneseVoiceEngine.speak(testText, {
      rate: speed,
      pitch,
      volume,
      style
    });
  };

  const handleStopVoice = () => {
    japaneseVoiceEngine.cancel();
  };

  return (
    <div className="page-content">
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Volume2 size={28} color="var(--sakura-400)" /> Japanese Audio & Female Voice Engine — 音声設定
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Configure female Japanese voice synthesis, playback speed, pitch tuning, and test audio diagnostics.
        </p>

        {/* Voice Status Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: `1px solid ${voiceStatus.status === 'available' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {voiceStatus.status === 'available' ? (
                <CheckCircle2 size={22} color="#10b981" />
              ) : voiceStatus.status === 'loading' ? (
                <RefreshCw size={22} className="animate-spin" color="var(--gold-400)" />
              ) : (
                <AlertTriangle size={22} color="#ef4444" />
              )}
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Japanese Voice Status: {voiceStatus.status === 'available' ? '✓ Ready' : voiceStatus.status === 'loading' ? 'Loading Voices...' : '⚠ Unavailable'}
              </span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => voiceManager.initVoices()}>
              <RefreshCw size={14} /> Refresh Voices
            </button>
          </div>

          {voiceStatus.selectedVoice ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))', gap: '0.75rem', background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Voice</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--sakura-400)' }}>
                  👩 {voiceStatus.selectedVoice.name}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Language Tag</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {voiceStatus.selectedVoice.lang}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Voice Type</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10b981' }}>
                  Female Japanese TTS
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {voiceStatus.error || 'Searching browser speech synthesis for Japanese voices...'}
            </div>
          )}
        </div>

        {/* Voice Controls Panel */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="var(--gold-400)" /> Voice Tuning & Personality
          </h2>

          {/* Personality Style Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>
              VOICE PERSONALITY STYLE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'gentle', label: '🌸 Gentle', pitch: 1.0 },
                { id: 'teacher', label: '🎓 Teacher', pitch: 1.08 },
                { id: 'friendly', label: '😊 Friendly', pitch: 1.15 },
                { id: 'energetic', label: '⚡ Energetic', pitch: 1.22 },
              ].map(s => (
                <button
                  key={s.id}
                  className={`btn ${style === s.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => { setStyle(s.id as any); setPitch(s.pitch); }}
                  style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.375rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>SPEECH RATE:</span>
              <span style={{ fontWeight: 800, color: 'var(--sakura-400)' }}>{speed}x ({speed === 0.85 ? 'Normal' : speed < 0.85 ? 'Slow' : 'Fast'})</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.3"
              step="0.05"
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--sakura-500)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span>Very Slow (0.45x)</span>
              <span>Slow (0.65x)</span>
              <span>Normal (0.85x)</span>
              <span>Fast (1.2x)</span>
            </div>
          </div>

          {/* Pitch Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.375rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>FEMALE PITCH TIMBRE:</span>
              <span style={{ fontWeight: 800, color: 'var(--gold-400)' }}>{pitch.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.02"
              value={pitch}
              onChange={e => setPitch(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--gold-500)' }}
            />
          </div>

          {/* Test Voice Control */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary btn-lg" onClick={handleTestVoice} style={{ flex: 2 }}>
              <Play size={18} /> Test Female Voice 🔊
            </button>
            <button className="btn btn-secondary btn-lg" onClick={handleStopVoice} style={{ flex: 1 }}>
              <Square size={18} /> Stop
            </button>
          </div>
        </div>

        {/* Audio Test Phrases Grid */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Test Sentences & Speed Modes
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {testPhrases.map((phrase, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.15rem', fontFamily: 'Noto Sans JP', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {phrase.japanese}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {phrase.english}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <JapaneseAudioButton text={phrase.japanese} speed={0.85} size="sm" showLabel label="Normal" />
                  <JapaneseAudioButton text={phrase.japanese} speed={0.65} size="sm" variant="ghost" showLabel label="Slow 🐢" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Mode Audio Debug Panel */}
        {process.env.NODE_ENV !== 'production' && (
          <div style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px dashed var(--indigo-400)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontWeight: 800, color: 'var(--indigo-400)', marginBottom: '0.5rem' }}>
              🛠 DEV AUDIO DEBUG PANEL
            </div>
            <div>Voices Detected: {voiceStatus.allVoices.length}</div>
            <div>Japanese Voices: {voiceStatus.japaneseVoices.length}</div>
            <div>Active Engine: Browser Speech Synthesis (ja-JP)</div>
          </div>
        )}
      </div>
    </div>
  );
}
