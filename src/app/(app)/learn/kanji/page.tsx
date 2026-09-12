'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { kanjiData, KanjiItem, kanjiByLevel } from '@/content/kanji';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { Volume2, CheckCircle2, Bookmark, Award, Sparkles, ChevronRight, Layers, Lightbulb } from 'lucide-react';

export default function KanjiPage() {
  const { learnedKanji, learnKanji, bookmarkedKanji, toggleBookmark, addXP } = useAppStore();
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem>(kanjiData[0]);
  const [mode, setMode] = useState<'study' | 'quiz'>('study');
  
  // Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  const filteredKanji = kanjiByLevel[selectedLevel] || kanjiData;

  const handleKanjiSelect = (item: KanjiItem) => {
    setSelectedKanji(item);
    speakJapanese(item.kanji);
    if (!learnedKanji.includes(item.id)) {
      learnKanji([item.id]);
      addXP(10);
      playSound('xp');
    }
  };

  const startQuiz = () => {
    setMode('quiz');
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setupQuestion(0);
  };

  const setupQuestion = (index: number) => {
    const current = filteredKanji[index % filteredKanji.length];
    const wrong = filteredKanji.filter(k => k.id !== current.id);
    const wrongMeanings = [...wrong].sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.meanings[0]);
    const opts = [...wrongMeanings, current.meanings[0]].sort(() => 0.5 - Math.random());
    setQuizOptions(opts);
    setSelectedOption(null);
    speakJapanese(current.kanji);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    const current = filteredKanji[quizIndex % filteredKanji.length];
    const isCorrect = option === current.meanings[0];

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playSound('correct');
      if (!learnedKanji.includes(current.id)) {
        learnKanji([current.id]);
      }
    } else {
      playSound('incorrect');
    }

    setTimeout(() => {
      if (quizIndex + 1 >= Math.min(10, filteredKanji.length)) {
        setQuizFinished(true);
        addXP(60);
      } else {
        setQuizIndex(prev => prev + 1);
        setupQuestion(quizIndex + 1);
      }
    }, 1200);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Kanji System — 漢字
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Master Japanese kanji characters, readings, radicals, and mnemonics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${mode === 'study' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('study')}>
            Kanji Cards
          </button>
          <button className={`btn ${mode === 'quiz' ? 'btn-primary' : 'btn-secondary'}`} onClick={startQuiz}>
            Kanji Quiz 🎯
          </button>
        </div>
      </div>

      {/* Level Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map(lvl => (
          <button
            key={lvl}
            className={`badge ${selectedLevel === lvl ? `badge-${lvl.toLowerCase()}` : ''}`}
            onClick={() => { setSelectedLevel(lvl); setSelectedKanji(kanjiByLevel[lvl][0] || kanjiData[0]); }}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: selectedLevel === lvl ? undefined : 'var(--bg-card)',
              border: selectedLevel === lvl ? undefined : '1px solid var(--border-subtle)',
              color: selectedLevel === lvl ? undefined : 'var(--text-muted)'
            }}
          >
            JLPT {lvl} ({kanjiByLevel[lvl]?.length || 0})
          </button>
        ))}
      </div>

      {mode === 'study' && (
        <div className="layout-split-left">
          {/* Kanji List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {filteredKanji.map((item) => {
              const isLearned = learnedKanji.includes(item.id);
              const isSelected = selectedKanji.id === item.id;
              const isBookmarked = bookmarkedKanji.includes(item.id);
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 3 }}
                  onClick={() => handleKanjiSelect(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? 'rgba(230,49,85,0.12)' : 'var(--bg-card)',
                    border: `1px solid ${isSelected ? 'var(--sakura-500)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.75rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--text-primary)', minWidth: 36 }}>
                      {item.kanji}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {item.meanings.join(', ')}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.onyomi.join(' • ')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    {isBookmarked && <Bookmark size={14} color="var(--gold-400)" fill="var(--gold-400)" />}
                    {isLearned && <CheckCircle2 size={16} color="#10b981" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Kanji Card Detail Display */}
          {selectedKanji && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className={`badge badge-${selectedKanji.jlptLevel.toLowerCase()}`}>
                    JLPT {selectedKanji.jlptLevel} • {selectedKanji.strokeCount} Strokes
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                    {selectedKanji.meanings.join(', ')}
                  </h2>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => toggleBookmark('kanji', selectedKanji.id)}
                  >
                    <Bookmark size={20} color={bookmarkedKanji.includes(selectedKanji.id) ? 'var(--gold-400)' : 'var(--text-muted)'} fill={bookmarkedKanji.includes(selectedKanji.id) ? 'var(--gold-400)' : 'none'} />
                  </button>
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => speakJapanese(selectedKanji.kanji)}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
              </div>

              {/* Large Kanji Character Display */}
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8rem',
                fontFamily: 'Noto Sans JP',
                fontWeight: 900,
                color: 'var(--sakura-400)',
                boxShadow: 'inner',
              }}>
                {selectedKanji.kanji}
              </div>

              {/* Readings grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    On'yomi (音読み - Chinese Reading)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Noto Sans JP' }}>
                    {selectedKanji.onyomi.join(', ') || '—'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Kun'yomi (訓読み - Japanese Reading)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Noto Sans JP' }}>
                    {selectedKanji.kunyomi.join(', ') || '—'}
                  </div>
                </div>
              </div>

              {/* Mnemonic */}
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '1rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Lightbulb size={20} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Mnemonic Hint
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {selectedKanji.mnemonic}
                  </div>
                </div>
              </div>

              {/* Example Words */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Example Words & Vocabulary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: '0.5rem' }}>
                  {selectedKanji.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      onClick={() => speakJapanese(ex.word)}
                      style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem'
                      }}
                    >
                      <div style={{ fontSize: '1.1rem', fontFamily: 'Noto Sans JP', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {ex.word}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ex.reading}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--sakura-400)', fontWeight: 600 }}>
                        {ex.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'quiz' && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          {!quizFinished ? (
            <motion.div
              key={quizIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Kanji Quiz • Question {quizIndex + 1} of {Math.min(10, filteredKanji.length)}
              </div>

              <div style={{
                fontSize: '6rem',
                fontFamily: 'Noto Sans JP',
                fontWeight: 900,
                color: 'var(--sakura-400)',
                marginBottom: '1rem'
              }}>
                {filteredKanji[quizIndex % filteredKanji.length].kanji}
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Select the correct meaning:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {quizOptions.map((opt) => {
                  const current = filteredKanji[quizIndex % filteredKanji.length];
                  let btnClass = 'quiz-option';
                  if (selectedOption !== null) {
                    if (opt === current.meanings[0]) btnClass += ' correct';
                    else if (opt === selectedOption) btnClass += ' incorrect';
                    else btnClass += ' disabled';
                  }
                  return (
                    <button
                      key={opt}
                      className={btnClass}
                      onClick={() => handleAnswer(opt)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                textAlign: 'center',
              }}
            >
              <Award size={48} color="var(--gold-400)" style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Kanji Quiz Complete! 🎉</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                You scored {quizScore} out of {Math.min(10, filteredKanji.length)}!
              </p>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '2rem' }}>
                +60 XP Earned
              </div>
              <button className="btn btn-primary" onClick={() => setMode('study')}>
                Back to Kanji Cards <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
