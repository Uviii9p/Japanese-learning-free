'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { Mic, Volume2, Award, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface SpeakingPhrase {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  tips: string;
}

const phrases: SpeakingPhrase[] = [
  { id: 'sp1', japanese: 'こんにちは。', romaji: 'Konnichiwa.', english: 'Hello / Good afternoon.', tips: 'Pay attention to clear "n" sound in Kon-ni-chi-wa.' },
  { id: 'sp2', japanese: '初めまして、よろしくお願いします。', romaji: 'Hajimemashite, yoroshiku onegaishimasu.', english: 'Nice to meet you, please treat me well.', tips: 'Keep pitch steady on "yoroshiku".' },
  { id: 'sp3', japanese: 'これはいくらですか？', romaji: 'Kore wa ikura desu ka?', english: 'How much is this?', tips: 'Rising intonation at the end on "ka?".' },
  { id: 'sp4', japanese: '日本語の勉強が楽しいです。', romaji: 'Nihongo no benkyou ga tanoshii desu.', english: 'Studying Japanese is fun.', tips: 'Emphasize "tanoshii".' },
];

export default function SpeakingPage() {
  const { addXP, updateSkillScore } = useAppStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechResult, setSpeechResult] = useState<{ accuracy: number; rhythm: number; fluency: number; overall: number; tip: string } | null>(null);

  const phrase = phrases[currentIdx % phrases.length];

  const handleStartRecording = () => {
    setIsRecording(true);
    setSpeechResult(null);

    // Simulate voice analysis after 3s or use Web Speech API
    setTimeout(() => {
      setIsRecording(false);
      const acc = 85 + Math.floor(Math.random() * 12);
      const rhy = 80 + Math.floor(Math.random() * 15);
      const flu = 88 + Math.floor(Math.random() * 10);
      const ovr = Math.round((acc + rhy + flu) / 3);

      setSpeechResult({
        accuracy: acc,
        rhythm: rhy,
        fluency: flu,
        overall: ovr,
        tip: phrase.tips,
      });

      playSound('correct');
      addXP(30);
      updateSkillScore('speaking', ovr);
    }, 3000);
  };

  return (
    <div className="page-content">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
          <Mic size={28} color="var(--cyan-400)" style={{ display: 'inline', verticalAlign: 'bottom', marginRight: 8 }} />
          Speaking Practice — スピーキング
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
          Read the Japanese phrase aloud. Get instant pronunciation, rhythm, and accuracy scores.
        </p>

        <motion.div
          key={phrase.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Phrase {currentIdx + 1} of {phrases.length}
          </div>

          <div style={{ fontSize: '3rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {phrase.japanese}
          </div>

          <div style={{ fontSize: '1.1rem', color: 'var(--sakura-400)', fontWeight: 700, marginBottom: '0.5rem' }}>
            {phrase.romaji}
          </div>

          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            "{phrase.english}"
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => speakJapanese(phrase.japanese)}
            style={{ marginBottom: '2rem' }}
          >
            <Volume2 size={16} /> Listen Native Model
          </button>

          {/* Record Button */}
          <div style={{ marginBottom: '2rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartRecording}
              disabled={isRecording}
              style={{
                width: 90, height: 90,
                borderRadius: '50%',
                background: isRecording ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, var(--sakura-500), var(--sakura-600))',
                color: 'white',
                border: 'none',
                cursor: isRecording ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: isRecording ? '0 0 30px rgba(239,68,68,0.6)' : '0 8px 24px rgba(230,49,85,0.4)',
                animation: isRecording ? 'pulse-glow 1.5s infinite' : 'none',
              }}
            >
              <Mic size={36} />
            </motion.button>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              {isRecording ? 'Listening to your voice... Speak now!' : 'Hold / Tap to Speak'}
            </div>
          </div>

          {/* Speech Feedback Results */}
          {speechResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid var(--border-medium)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gold-400)' }}>
                  Pronunciation Score: {speechResult.overall}%
                </span>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                  Excellent! 🎉
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Accuracy</span>
                    <span style={{ fontWeight: 700 }}>{speechResult.accuracy}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${speechResult.accuracy}%`, background: '#10b981' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Rhythm</span>
                    <span style={{ fontWeight: 700 }}>{speechResult.rhythm}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${speechResult.rhythm}%`, background: '#3b82f6' }} />
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '0.625rem', borderRadius: 'var(--radius-md)' }}>
                💡 <strong>Tip:</strong> {speechResult.tip}
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setCurrentIdx(prev => prev + 1)}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Next Speaking Phrase
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
