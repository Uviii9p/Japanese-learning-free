'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hiraganaData, hiraganaGroups, KanaChar } from '@/content/hiragana';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { Volume2, CheckCircle2, RotateCcw, Award, ChevronRight, HelpCircle } from 'lucide-react';

export default function HiraganaPage() {
  const { learnedHiragana, learnHiragana, addXP, unlockAchievement } = useAppStore();
  const [selectedChar, setSelectedChar] = useState<KanaChar | null>(hiraganaData[0]);
  const [mode, setMode] = useState<'grid' | 'quiz'>('grid');
  
  // Quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  const handleCharClick = (char: KanaChar) => {
    setSelectedChar(char);
    speakJapanese(char.char);
    if (!learnedHiragana.includes(char.char)) {
      learnHiragana([char.char]);
      addXP(5);
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
    const current = hiraganaData[index % hiraganaData.length];
    const wrong = hiraganaData.filter(h => h.romaji !== current.romaji);
    const shuffledWrong = [...wrong].sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.romaji);
    const opts = [...shuffledWrong, current.romaji].sort(() => 0.5 - Math.random());
    setQuizOptions(opts);
    setSelectedOption(null);
    speakJapanese(current.char);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    const current = hiraganaData[quizIndex % hiraganaData.length];
    const isCorrect = option === current.romaji;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playSound('correct');
      if (!learnedHiragana.includes(current.char)) {
        learnHiragana([current.char]);
      }
    } else {
      playSound('incorrect');
    }

    setTimeout(() => {
      if (quizIndex + 1 >= 10) {
        setQuizFinished(true);
        addXP(50);
        if (learnedHiragana.length + 10 >= 46) {
          unlockAchievement('hiragana_complete');
        }
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
            Hiragana — ひらがな
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Progress: {learnedHiragana.length} / 46 Learned ({Math.round((learnedHiragana.length / 46) * 100)}%)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${mode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('grid')}
          >
            Grid Study
          </button>
          <button
            className={`btn ${mode === 'quiz' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={startQuiz}
          >
            Take Quiz 🎯
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar" style={{ height: 8, marginBottom: '2rem' }}>
        <div className="progress-fill" style={{ width: `${(learnedHiragana.length / 46) * 100}%` }} />
      </div>

      {mode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div className="layout-split-kana">
            {/* Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {hiraganaGroups.map(group => (
                <div key={group.id}>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {group.label}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                    {group.chars.map(c => {
                      const itemData = hiraganaData.find(h => h.char === c);
                      if (!itemData) return null;
                      const isLearned = learnedHiragana.includes(c);
                      const isSelected = selectedChar?.char === c;
                      return (
                        <motion.button
                          key={c}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCharClick(itemData)}
                          className={`kana-cell ${isLearned ? 'learned' : ''}`}
                          style={{
                            borderColor: isSelected ? 'var(--sakura-500)' : undefined,
                            background: isSelected ? 'rgba(230,49,85,0.15)' : undefined,
                            padding: '0.75rem 0.5rem',
                          }}
                        >
                          <span className="kana-char">{c}</span>
                          <span className="kana-romaji">{itemData.romaji}</span>
                          {isLearned && <CheckCircle2 size={12} color="#10b981" style={{ position: 'absolute', top: 4, right: 4 }} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Character Detail Drawer */}
            {selectedChar && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                position: 'sticky',
                top: '5rem',
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '5rem',
                  fontFamily: 'Noto Sans JP, sans-serif',
                  fontWeight: 900,
                  color: 'var(--sakura-400)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  {selectedChar.char}
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  {selectedChar.romaji}
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => speakJapanese(selectedChar.char)}
                  style={{ marginBottom: '1.5rem', width: '100%' }}
                >
                  <Volume2 size={16} /> Listen Pronunciation
                </button>

                <div style={{ width: '100%', textAlign: 'left', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    EXAMPLE WORDS
                  </div>
                  {selectedChar.examples.map((ex, idx) => (
                    <div key={idx} style={{
                      background: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.625rem 0.75rem',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontFamily: 'Noto Sans JP', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {ex.word}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {ex.reading}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--sakura-400)', fontWeight: 600 }}>
                        {ex.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                Question {quizIndex + 1} of 10
              </div>

              <div style={{
                fontSize: '6rem',
                fontFamily: 'Noto Sans JP',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginBottom: '1rem'
              }}>
                {hiraganaData[quizIndex % hiraganaData.length].char}
              </div>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => speakJapanese(hiraganaData[quizIndex % hiraganaData.length].char)}
                style={{ marginBottom: '2rem' }}
              >
                <Volume2 size={16} /> Replay Audio
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {quizOptions.map((opt) => {
                  const current = hiraganaData[quizIndex % hiraganaData.length];
                  let btnClass = 'quiz-option';
                  if (selectedOption !== null) {
                    if (opt === current.romaji) btnClass += ' correct';
                    else if (opt === selectedOption) btnClass += ' incorrect';
                    else btnClass += ' disabled';
                  }
                  return (
                    <button
                      key={opt}
                      className={btnClass}
                      onClick={() => handleAnswer(opt)}
                      style={{ justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Quiz Completed! 🎉</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                You scored {quizScore} out of 10!
              </p>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '2rem' }}>
                +50 XP Earned
              </div>
              <button className="btn btn-primary" onClick={() => setMode('grid')}>
                Back to Grid <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
