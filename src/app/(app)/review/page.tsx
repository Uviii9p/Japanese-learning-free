'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { vocabularyData } from '@/content/vocabulary';
import { kanjiData } from '@/content/kanji';
import { grammarData } from '@/content/grammar';
import { speakJapanese, playSound } from '@/lib/utils';
import { Flame, CheckCircle2, RotateCcw, Volume2, Award, Zap, ChevronRight } from 'lucide-react';

export default function ReviewPage() {
  const { getDueReviews, updateReviewItem, addXP, reviewQueue } = useAppStore();
  const dueItems = getDueReviews();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentReview = dueItems[currentIdx % dueItems.length];

  // Resolve target item details
  let itemData: any = null;
  if (currentReview) {
    if (currentReview.type === 'vocabulary') {
      itemData = vocabularyData.find(v => v.id === currentReview.itemId);
    } else if (currentReview.type === 'kanji') {
      itemData = kanjiData.find(k => k.id === currentReview.itemId);
    } else if (currentReview.type === 'grammar') {
      itemData = grammarData.find(g => g.id === currentReview.itemId);
    }
  }

  const handleRating = (rating: 1 | 2 | 3 | 4) => {
    if (!currentReview) return;
    updateReviewItem(currentReview.itemId, rating);
    addXP(rating >= 3 ? 15 : 5);
    playSound(rating >= 3 ? 'correct' : 'incorrect');

    setIsFlipped(false);
    if (currentIdx + 1 < dueItems.length) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <div className="page-content">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={28} color="#ef4444" /> Smart SRS Review — 復習
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Intelligent Spaced Repetition engine targeting your weak areas.
        </p>

        {/* Status Breakdown Bar */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>{dueItems.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Due Now</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-400)' }}>{reviewQueue.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Tracked</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>92%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Retention Rate</div>
          </div>
        </div>

        {dueItems.length === 0 || !itemData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              All Caught Up! 🎉
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              No items are due for review right now. Come back tomorrow or practice new lessons!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={currentReview.itemId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentReview.type} Review • Card {currentIdx + 1} of {dueItems.length}
            </div>

            <div style={{ fontSize: '4.5rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {itemData.japanese || itemData.kanji || itemData.title}
            </div>

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => speakJapanese(itemData.japanese || itemData.kanji || itemData.title)}
              style={{ marginBottom: '2rem' }}
            >
              <Volume2 size={16} /> Pronunciation
            </button>

            {isFlipped ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-400)', marginBottom: '1rem' }}>
                  {itemData.meaning || itemData.meanings?.join(', ')}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                  <button className="srs-btn srs-btn-again" onClick={() => handleRating(1)}>Again</button>
                  <button className="srs-btn srs-btn-hard" onClick={() => handleRating(2)}>Hard</button>
                  <button className="srs-btn srs-btn-good" onClick={() => handleRating(3)}>Good</button>
                  <button className="srs-btn srs-btn-easy" onClick={() => handleRating(4)}>Easy</button>
                </div>
              </motion.div>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={() => setIsFlipped(true)} style={{ width: '100%' }}>
                Show Answer
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
