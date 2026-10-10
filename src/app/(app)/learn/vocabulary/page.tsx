'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabularyData, vocabularyCategories, VocabItem } from '@/content/vocabulary';
import { useAppStore } from '@/lib/store';
import { playSound } from '@/lib/utils';
import { JapaneseAudioButton } from '@/components/audio/JapaneseAudioButton';
import {
  Bookmark, CheckCircle2, RotateCcw, Search, Eye, EyeOff,
  Layers, BookOpen, ChevronRight
} from 'lucide-react';

export default function VocabularyPage() {
  const {
    learnedVocabulary, learnVocabulary,
    bookmarkedVocab, toggleBookmark,
    addReviewItem, addXP, furiganaMode
  } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedJLPT, setSelectedJLPT] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mode, setMode] = useState<'browse' | 'srs'>('browse');

  // Flashcard SRS state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFurigana, setShowFurigana] = useState(furiganaMode !== 'never');

  const filteredVocab = useMemo(() => {
    return vocabularyData.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedJLPT !== 'all' && item.jlptLevel !== selectedJLPT) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (
          !item.japanese.includes(q) &&
          !item.reading.toLowerCase().includes(q) &&
          !item.meaning.toLowerCase().includes(q) &&
          !item.tags.some(t => t.toLowerCase().includes(q))
        ) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedJLPT, searchQuery]);

  const currentVocab = filteredVocab[cardIndex % (filteredVocab.length || 1)];

  const handleSRSAnswer = (rating: 1 | 2 | 3 | 4) => {
    if (!currentVocab) return;
    addReviewItem({ id: `rev-${currentVocab.id}`, type: 'vocabulary', itemId: currentVocab.id });
    if (!learnedVocabulary.includes(currentVocab.id)) learnVocabulary([currentVocab.id]);
    playSound(rating >= 3 ? 'correct' : 'incorrect');
    addXP(rating >= 3 ? 10 : 2);
    setIsFlipped(false);
    setTimeout(() => setCardIndex(prev => prev + 1), 180);
  };

  const progressPercent = Math.round((learnedVocabulary.length / (vocabularyData.length || 1)) * 100);

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="hanko-stamp">語彙</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Vocabulary
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.1rem' }}>
            {learnedVocabulary.length} of {vocabularyData.length} mastered ({progressPercent}%)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${showFurigana ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setShowFurigana(!showFurigana)}
            style={{ gap: '0.3rem', padding: '0.35rem 0.75rem' }}
            title="Toggle furigana"
          >
            {showFurigana ? <Eye size={13} /> : <EyeOff size={13} />}
            <span style={{ fontSize: '0.72rem' }}>ふり</span>
          </button>

          <button
            className={`btn btn-sm ${mode === 'browse' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('browse')}
            style={{ gap: '0.3rem', padding: '0.35rem 0.75rem' }}
          >
            <BookOpen size={13} />
            <span style={{ fontSize: '0.72rem' }}>Browse</span>
          </button>

          <button
            className={`btn btn-sm ${mode === 'srs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setMode('srs'); setIsFlipped(false); setCardIndex(0); }}
            style={{ gap: '0.3rem', padding: '0.35rem 0.75rem' }}
          >
            <Layers size={13} />
            <span style={{ fontSize: '0.72rem' }}>Flashcards</span>
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            className="input"
            type="text"
            placeholder="Search by English, Kana, or Kanji…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCardIndex(0); }}
            style={{ paddingLeft: '2.1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-lg)' }}
          />
        </div>

        {/* Filter pills (horizontal scroll) */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.1rem', WebkitOverflowScrolling: 'touch' }}>
          {(['all', 'N5', 'N4', 'N3'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => { setSelectedJLPT(lvl); setCardIndex(0); }}
              className={`pill-btn ${selectedJLPT === lvl ? 'pill-btn-active' : 'pill-btn-idle'}`}
            >
              {lvl === 'all' ? 'All JLPT' : lvl}
            </button>
          ))}

          <div style={{ width: 1, background: 'var(--border-subtle)', margin: '0 0.1rem', flexShrink: 0 }} />

          <button
            onClick={() => { setSelectedCategory('all'); setCardIndex(0); }}
            className={`pill-btn ${selectedCategory === 'all' ? 'pill-btn-active' : 'pill-btn-idle'}`}
          >
            All Topics
          </button>

          {vocabularyCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCardIndex(0); }}
              className={`pill-btn ${selectedCategory === cat.id ? 'pill-btn-active' : 'pill-btn-idle'}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
          BROWSE MODE
      ═══════════════════════════════════ */}
      {mode === 'browse' && (
        <>
          {filteredVocab.length === 0 ? (
            <div className="washi-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>No words found</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                Try adjusting your filters or search query.
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
              gap: '0.85rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {filteredVocab.map(item => {
                const isLearned = learnedVocabulary.includes(item.id);
                const isBookmarked = bookmarkedVocab.includes(item.id);

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="washi-card"
                    style={{
                      padding: '1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Background Kanji Watermark */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        right: 8,
                        bottom: -4,
                        fontSize: '4.8rem',
                        fontFamily: 'Noto Serif JP, serif',
                        fontWeight: 900,
                        color: 'var(--text-primary)',
                        opacity: 0.035,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        lineHeight: 1
                      }}
                    >
                      {item.japanese.slice(0, 1)}
                    </div>

                    {/* Card header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span className={`badge badge-${item.jlptLevel.toLowerCase()}`} style={{ fontWeight: 800 }}>
                          {item.jlptLevel}
                        </span>
                        <span style={{
                          fontSize: '0.62rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'var(--text-muted)',
                          background: 'rgba(255,255,255,0.04)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {item.category}
                        </span>
                        {isLearned && (
                          <span style={{ fontSize: '0.64rem', color: 'var(--matcha-400)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CheckCircle2 size={12} /> 習得
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => toggleBookmark('vocab', item.id)}
                          title="Bookmark"
                          style={{ padding: '0.28rem' }}
                        >
                          <Bookmark size={14} color={isBookmarked ? 'var(--gold-400)' : 'var(--text-muted)'} fill={isBookmarked ? 'var(--gold-400)' : 'none'} />
                        </button>
                        <JapaneseAudioButton text={item.japanese} variant="icon" size="sm" />
                      </div>
                    </div>

                    {/* Word display */}
                    <div>
                      <div style={{
                        fontSize: 'clamp(1.4rem, 5.5vw, 1.85rem)',
                        fontFamily: 'Noto Sans JP, sans-serif',
                        fontWeight: 900,
                        color: 'var(--text-primary)',
                        lineHeight: 1.2,
                        wordBreak: 'break-word'
                      }}>
                        {item.japanese}
                      </div>
                      {showFurigana && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--sakura-400)', fontWeight: 700, marginTop: '0.15rem', letterSpacing: '0.02em' }}>
                          {item.reading}
                        </div>
                      )}
                    </div>

                    {/* Meaning */}
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {item.meaning}
                    </div>

                    {/* Example sentence */}
                    {item.examples[0] && (
                      <div style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.76rem',
                        borderLeft: '3px solid var(--sakura-500)',
                        marginTop: 'auto',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <div style={{ fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {item.examples[0].japanese}
                        </div>
                        {showFurigana && (
                          <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                            {item.examples[0].reading}
                          </div>
                        )}
                        <div style={{ fontSize: '0.7rem', color: 'var(--sakura-400)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                          {item.examples[0].english}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════
          SRS FLASHCARD MODE
      ═══════════════════════════════════ */}
      {mode === 'srs' && currentVocab && (
        <div style={{ maxWidth: 420, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Card counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Card {(cardIndex % filteredVocab.length) + 1} of {filteredVocab.length}</span>
            <span className={`badge badge-${currentVocab.jlptLevel.toLowerCase()}`}>{currentVocab.jlptLevel}</span>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ height: 3 }}>
            <div
              className="progress-fill"
              style={{ width: `${((cardIndex % filteredVocab.length) / filteredVocab.length) * 100}%` }}
            />
          </div>

          {/* Flashcard */}
          <motion.div
            onClick={() => setIsFlipped(!isFlipped)}
            whileTap={{ scale: 0.98 }}
            className="washi-card"
            style={{
              padding: '2.25rem 1.5rem',
              textAlign: 'center',
              minHeight: 290,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              gap: '0.5rem'
            }}
          >
            {/* Bookmark button (stops propagation) */}
            <div
              onClick={e => e.stopPropagation()}
              style={{ position: 'absolute', top: 12, right: 12 }}
            >
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => toggleBookmark('vocab', currentVocab.id)}
                style={{ padding: '0.3rem' }}
              >
                <Bookmark
                  size={15}
                  color={bookmarkedVocab.includes(currentVocab.id) ? 'var(--gold-400)' : 'var(--text-muted)'}
                  fill={bookmarkedVocab.includes(currentVocab.id) ? 'var(--gold-400)' : 'none'}
                />
              </button>
            </div>

            {/* Kanji */}
            <div style={{
              fontSize: 'clamp(2.5rem, 9vw, 4rem)',
              fontFamily: 'Noto Sans JP, sans-serif',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.1
            }}>
              {currentVocab.japanese}
            </div>

            {/* Furigana */}
            {showFurigana && (
              <div style={{ fontSize: '1rem', color: 'var(--sakura-400)', fontWeight: 700 }}>
                {currentVocab.reading}
              </div>
            )}

            {/* Audio button */}
            <div onClick={e => e.stopPropagation()}>
              <JapaneseAudioButton text={currentVocab.japanese} showLabel label="Listen" size="sm" />
            </div>

            <AnimatePresence mode="wait">
              {isFlipped ? (
                <motion.div
                  key="back"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{ width: '100%' }}
                >
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold-400)', marginBottom: '0.5rem' }}>
                    {currentVocab.meaning}
                  </div>
                  {currentVocab.examples[0] && (
                    <div style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      fontFamily: 'Noto Sans JP',
                      background: 'var(--bg-elevated)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      lineHeight: 1.55
                    }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>"{currentVocab.examples[0].japanese}"</span>
                      <br />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentVocab.examples[0].english}</span>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}
                >
                  Tap card to reveal meaning
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* SRS Rating Buttons */}
          <AnimatePresence mode="wait">
            {isFlipped ? (
              <motion.div
                key="srs-btns"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}
              >
                <button className="srs-btn srs-btn-again" onClick={() => handleSRSAnswer(1)}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Again</span>
                  <span style={{ fontSize: '0.62rem', opacity: 0.75 }}>{'< 1 min'}</span>
                </button>
                <button className="srs-btn srs-btn-hard" onClick={() => handleSRSAnswer(2)}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Hard</span>
                  <span style={{ fontSize: '0.62rem', opacity: 0.75 }}>1 day</span>
                </button>
                <button className="srs-btn srs-btn-good" onClick={() => handleSRSAnswer(3)}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Good</span>
                  <span style={{ fontSize: '0.62rem', opacity: 0.75 }}>3 days</span>
                </button>
                <button className="srs-btn srs-btn-easy" onClick={() => handleSRSAnswer(4)}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Easy</span>
                  <span style={{ fontSize: '0.62rem', opacity: 0.75 }}>6 days</span>
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="reveal-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="btn btn-secondary"
                onClick={() => setIsFlipped(true)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                Reveal Meaning
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
