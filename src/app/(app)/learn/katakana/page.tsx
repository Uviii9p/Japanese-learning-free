'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { katakanaData, katakanaGroups, loanWordExamples, KanaChar } from '@/content/katakana';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { Volume2, CheckCircle2, Award, ChevronRight, Globe } from 'lucide-react';

export default function KatakanaPage() {
  const { learnedKatakana, learnKatakana, addXP, unlockAchievement } = useAppStore();
  const [selectedChar, setSelectedChar] = useState<KanaChar | null>(katakanaData[0]);
  const [tab, setTab] = useState<'grid' | 'loanwords' | 'quiz'>('grid');

  // Quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  const handleCharClick = (char: KanaChar) => {
    setSelectedChar(char);
    speakJapanese(char.char);
    if (!learnedKatakana.includes(char.char)) {
      learnKatakana([char.char]);
      addXP(5);
      playSound('xp');
    }
  };

  const startQuiz = () => {
    setTab('quiz');
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setupQuestion(0);
  };

  const setupQuestion = (index: number) => {
    const current = katakanaData[index % katakanaData.length];
    const wrong = katakanaData.filter(h => h.romaji !== current.romaji);
    const shuffledWrong = [...wrong].sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.romaji);
    const opts = [...shuffledWrong, current.romaji].sort(() => 0.5 - Math.random());
    setQuizOptions(opts);
    setSelectedOption(null);
    speakJapanese(current.char);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    const current = katakanaData[quizIndex % katakanaData.length];
    const isCorrect = option === current.romaji;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playSound('correct');
      if (!learnedKatakana.includes(current.char)) {
        learnKatakana([current.char]);
      }
    } else {
      playSound('incorrect');
    }

    setTimeout(() => {
      if (quizIndex + 1 >= 10) {
        setQuizFinished(true);
        addXP(50);
        if (learnedKatakana.length + 10 >= 46) {
          unlockAchievement('katakana_complete');
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
            Katakana — カタカナ
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Progress: {learnedKatakana.length} / 46 Learned ({Math.round((learnedKatakana.length / 46) * 100)}%)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${tab === 'grid' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('grid')}>
            Grid Study
          </button>
          <button className={`btn ${tab === 'loanwords' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('loanwords')}>
            <Globe size={16} /> Loan Words
          </button>
          <button className={`btn ${tab === 'quiz' ? 'btn-primary' : 'btn-secondary'}`} onClick={startQuiz}>
            Take Quiz 🎯
          </button>
        </div>
      </div>

      <div className="progress-bar" style={{ height: 8, marginBottom: '2rem' }}>
        <div className="progress-fill" style={{ width: `${(learnedKatakana.length / 46) * 100}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />
      </div>

      {tab === 'grid' && (
        <div className="layout-split-kana">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {katakanaGroups.map(group => (
              <div key={group.id}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {group.label}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {group.chars.map(c => {
                    const itemData = katakanaData.find(h => h.char === c);
                    if (!itemData) return null;
                    const isLearned = learnedKatakana.includes(c);
                    const isSelected = selectedChar?.char === c;
                    return (
                      <motion.button
                        key={c}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCharClick(itemData)}
                        className={`kana-cell ${isLearned ? 'learned' : ''}`}
                        style={{
                          borderColor: isSelected ? 'var(--indigo-400)' : undefined,
                          background: isSelected ? 'rgba(99,102,241,0.15)' : undefined,
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
                color: 'var(--indigo-400)',
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
                  EXAMPLE LOAN WORDS
                </div>
                {selectedChar.examples.map((ex: { word: string; reading: string; meaning: string }, idx: number) => (
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
                    <div style={{ fontSize: '0.8rem', color: 'var(--indigo-400)', fontWeight: 600 }}>
                      {ex.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'loanwords' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: '1rem' }}>
          {loanWordExamples.map((word, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              onClick={() => speakJapanese(word.katakana)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontFamily: 'Noto Sans JP', fontWeight: 800, color: 'var(--text-primary)' }}>
                {word.katakana}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {word.romaji}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--indigo-400)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{word.english}</span>
                <Volume2 size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'quiz' && (
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
                {katakanaData[quizIndex % katakanaData.length].char}
              </div>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => speakJapanese(katakanaData[quizIndex % katakanaData.length].char)}
                style={{ marginBottom: '2rem' }}
              >
                <Volume2 size={16} /> Replay Audio
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {quizOptions.map((opt) => {
                  const current = katakanaData[quizIndex % katakanaData.length];
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
              <button className="btn btn-primary" onClick={() => setTab('grid')}>
                Back to Grid <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
