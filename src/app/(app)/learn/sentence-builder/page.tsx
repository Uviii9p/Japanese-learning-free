'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { playSound, speakJapanese } from '@/lib/utils';
import { Volume2, CheckCircle2, RotateCcw, Award, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

interface SentenceChallenge {
  id: string;
  prompt: string;
  correctOrder: string[];
  distractors: string[];
  reading: string;
  english: string;
}

const challenges: SentenceChallenge[] = [
  {
    id: 's01',
    prompt: 'Construct: "I eat sushi every day."',
    correctOrder: ['私', 'は', '毎日', '寿司', 'を', '食べます'],
    distractors: ['映画', '見ます', '飲みます'],
    reading: 'Watashi wa mainichi sushi o tabemasu.',
    english: 'I eat sushi every day.'
  },
  {
    id: 's02',
    prompt: 'Construct: "Teacher Tanaka is kind."',
    correctOrder: ['田中先生', 'は', '親切', 'です'],
    distractors: ['学生', 'じゃない', '行きます'],
    reading: 'Tanaka-sensei wa shinsetsu desu.',
    english: 'Teacher Tanaka is kind.'
  },
  {
    id: 's03',
    prompt: 'Construct: "I want to go to Japan."',
    correctOrder: ['日本', 'に', '行きたい', 'です'],
    distractors: ['で', '食べたい', '来ます'],
    reading: 'Nihon ni ikitai desu.',
    english: 'I want to go to Japan.'
  },
  {
    id: 's04',
    prompt: 'Construct: "Please write your name here."',
    correctOrder: ['ここ', 'に', '名前', 'を', '書いて', 'ください'],
    distractors: ['聞いて', '私', 'です'],
    reading: 'Koko ni namae o kaite kudasai.',
    english: 'Please write your name here.'
  },
];

export default function SentenceBuilderPage() {
  const { addXP } = useAppStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const challenge = challenges[currentIdx % challenges.length];

  const [availableTiles, setAvailableTiles] = useState<string[]>(() => {
    return [...challenge.correctOrder, ...challenge.distractors].sort(() => 0.5 - Math.random());
  });

  const [placedTiles, setPlacedTiles] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const resetChallenge = (idx: number) => {
    const nextChallenge = challenges[idx % challenges.length];
    setCurrentIdx(idx);
    setPlacedTiles([]);
    setIsCorrect(null);
    setAvailableTiles([...nextChallenge.correctOrder, ...nextChallenge.distractors].sort(() => 0.5 - Math.random()));
  };

  const handleTileClick = (tile: string, fromPlaced: boolean) => {
    if (isCorrect !== null) return;

    if (fromPlaced) {
      setPlacedTiles(prev => prev.filter((t, i) => i !== prev.lastIndexOf(tile)));
      setAvailableTiles(prev => [...prev, tile]);
    } else {
      setAvailableTiles(prev => prev.filter((t, i) => i !== prev.indexOf(tile)));
      setPlacedTiles(prev => [...prev, tile]);
    }
  };

  const checkSentence = () => {
    const userSentence = placedTiles.join('');
    const targetSentence = challenge.correctOrder.join('');

    if (userSentence === targetSentence) {
      setIsCorrect(true);
      playSound('correct');
      speakJapanese(targetSentence);
      addXP(30);
    } else {
      setIsCorrect(false);
      playSound('incorrect');
    }
  };

  return (
    <div className="page-content">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
          Sentence Builder — 文章構築
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
          Arrange the word tiles in the correct Japanese word order.
        </p>

        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>
            Challenge {currentIdx + 1} of {challenges.length}
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '2rem' }}>
            {challenge.prompt}
          </div>

          {/* Placed Tiles Slot Box */}
          <div style={{
            minHeight: 80,
            background: 'var(--bg-elevated)',
            border: `2px dashed ${isCorrect === true ? '#10b981' : isCorrect === false ? '#ef4444' : 'var(--border-medium)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            transition: 'all 0.3s ease',
          }}>
            {placedTiles.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tap tiles below to build the sentence</span>
            ) : (
              placedTiles.map((tile, i) => (
                <motion.button
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTileClick(tile, true)}
                  style={{
                    padding: '0.625rem 1rem',
                    background: 'linear-gradient(135deg, var(--sakura-500), var(--sakura-600))',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    fontFamily: 'Noto Sans JP',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(230,49,85,0.3)',
                  }}
                >
                  {tile}
                </motion.button>
              ))
            )}
          </div>

          {/* Available Tiles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {availableTiles.map((tile, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTileClick(tile, false)}
                style={{
                  padding: '0.625rem 1rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  fontFamily: 'Noto Sans JP',
                  cursor: 'pointer',
                }}
              >
                {tile}
              </motion.button>
            ))}
          </div>

          {/* Feedback & Actions */}
          {isCorrect === true && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid #10b981',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>
                Correct! 🎉 +30 XP
              </div>
              <div style={{ fontFamily: 'Noto Sans JP', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                {challenge.correctOrder.join('')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {challenge.reading}
              </div>
            </motion.div>
          )}

          {isCorrect === false && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: '#ef4444',
              fontWeight: 700,
            }}>
              Not quite right. Try again!
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => resetChallenge(currentIdx)} style={{ flex: 1 }}>
              <RotateCcw size={16} /> Reset
            </button>

            {isCorrect === true ? (
              <button className="btn btn-primary" onClick={() => resetChallenge(currentIdx + 1)} style={{ flex: 2 }}>
                Next Challenge <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={checkSentence} disabled={placedTiles.length === 0} style={{ flex: 2 }}>
                Check Sentence
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
