'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabularyData, vocabularyCategories, VocabItem } from '@/content/vocabulary';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { JapaneseAudioButton } from '@/components/audio/JapaneseAudioButton';
import { Volume2, Bookmark, CheckCircle2, RotateCcw, Filter, Eye, EyeOff } from 'lucide-react';

export default function VocabularyPage() {
  const { learnedVocabulary, learnVocabulary, bookmarkedVocab, toggleBookmark, addReviewItem, addXP, furiganaMode, setFuriganaMode } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mode, setMode] = useState<'browse' | 'srs'>('browse');

  // Flashcard SRS state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFurigana, setShowFurigana] = useState(furiganaMode !== 'never');

  const filteredVocab = selectedCategory === 'all'
    ? vocabularyData
    : vocabularyData.filter(v => v.category === selectedCategory);

  const currentVocab = filteredVocab[cardIndex % filteredVocab.length];

  const handleSRSAnswer = (rating: 1 | 2 | 3 | 4) => {
    if (!currentVocab) return;

    addReviewItem({
      id: `rev-${currentVocab.id}`,
      type: 'vocabulary',
      itemId: currentVocab.id,
    });

    if (!learnedVocabulary.includes(currentVocab.id)) {
      learnVocabulary([currentVocab.id]);
    }

    playSound(rating >= 3 ? 'correct' : 'incorrect');
    addXP(rating >= 3 ? 10 : 2);

    setIsFlipped(false);
    setTimeout(() => {
      setCardIndex(prev => prev + 1);
    }, 200);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Vocabulary — 語彙
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Spaced repetition vocabulary learning ({learnedVocabulary.length} / {vocabularyData.length} Words Mastered)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${showFurigana ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setShowFurigana(!showFurigana)}
            title="Toggle Furigana"
          >
            {showFurigana ? <Eye size={16} /> : <EyeOff size={16} />} Furigana
          </button>

          <button
            className={`btn ${mode === 'browse' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('browse')}
          >
            Browse Library
          </button>
          <button
            className={`btn ${mode === 'srs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setMode('srs'); setIsFlipped(false); }}
          >
            SRS Flashcards 🎴
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          className={`badge ${selectedCategory === 'all' ? 'badge-n5' : ''}`}
          onClick={() => { setSelectedCategory('all'); setCardIndex(0); }}
          style={{
            padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer',
            background: selectedCategory === 'all' ? undefined : 'var(--bg-card)',
            border: selectedCategory === 'all' ? undefined : '1px solid var(--border-subtle)',
            color: selectedCategory === 'all' ? undefined : 'var(--text-muted)'
          }}
        >
          All ({vocabularyData.length})
        </button>
        {vocabularyCategories.map(cat => (
          <button
            key={cat.id}
            className={`badge ${selectedCategory === cat.id ? 'badge-n5' : ''}`}
            onClick={() => { setSelectedCategory(cat.id); setCardIndex(0); }}
            style={{
              padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer',
              background: selectedCategory === cat.id ? undefined : 'var(--bg-card)',
              border: selectedCategory === cat.id ? undefined : '1px solid var(--border-subtle)',
              color: selectedCategory === cat.id ? undefined : 'var(--text-muted)'
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {mode === 'browse' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1rem' }}>
          {filteredVocab.map((item) => {
            const isLearned = learnedVocabulary.includes(item.id);
            const isBookmarked = bookmarkedVocab.includes(item.id);
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-n5">{item.jlptLevel}</span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => toggleBookmark('vocab', item.id)}
                    >
                      <Bookmark size={16} color={isBookmarked ? 'var(--gold-400)' : 'var(--text-muted)'} fill={isBookmarked ? 'var(--gold-400)' : 'none'} />
                    </button>
                    <JapaneseAudioButton text={item.japanese} variant="icon" size="sm" />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '2rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {item.japanese}
                  </div>
                  {showFurigana && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--sakura-400)', fontWeight: 700 }}>
                      {item.reading}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {item.meaning}
                </div>

                {item.examples[0] && (
                  <div style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.625rem 0.75rem',
                    fontSize: '0.8rem',
                    borderLeft: '3px solid var(--sakura-500)'
                  }}>
                    <div style={{ fontFamily: 'Noto Sans JP', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.examples[0].japanese}
                    </div>
                    {showFurigana && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.examples[0].reading}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: 'var(--sakura-400)', marginTop: '0.2rem' }}>
                      {item.examples[0].english}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {mode === 'srs' && currentVocab && (
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Card {cardIndex + 1} of {filteredVocab.length}
          </div>

          {/* Flashcard Component */}
          <motion.div
            onClick={() => setIsFlipped(!isFlipped)}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2rem',
              textAlign: 'center',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: '4.5rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {currentVocab.japanese}
            </div>

            {showFurigana && (
              <div style={{ fontSize: '1.25rem', color: 'var(--sakura-400)', fontWeight: 700, marginBottom: '1rem' }}>
                {currentVocab.reading}
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <JapaneseAudioButton text={currentVocab.japanese} showLabel label="Listen" />
            </div>

            {isFlipped ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-400)', marginBottom: '1rem' }}>
                  {currentVocab.meaning}
                </div>
                {currentVocab.examples[0] && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'Noto Sans JP' }}>
                    "{currentVocab.examples[0].japanese}" — {currentVocab.examples[0].english}
                  </div>
                )}
              </motion.div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tap card to reveal meaning
              </div>
            )}
          </motion.div>

          {/* SRS Action Buttons */}
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <button className="srs-btn srs-btn-again" onClick={() => handleSRSAnswer(1)}>
                <span>Again</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>&lt; 1 min</span>
              </button>
              <button className="srs-btn srs-btn-hard" onClick={() => handleSRSAnswer(2)}>
                <span>Hard</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>1 day</span>
              </button>
              <button className="srs-btn srs-btn-good" onClick={() => handleSRSAnswer(3)}>
                <span>Good</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>3 days</span>
              </button>
              <button className="srs-btn srs-btn-easy" onClick={() => handleSRSAnswer(4)}>
                <span>Easy</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>6 days</span>
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
