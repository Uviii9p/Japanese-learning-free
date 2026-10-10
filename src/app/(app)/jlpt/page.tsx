'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { playSound } from '@/lib/utils';
import { JapaneseAudioButton } from '@/components/audio/JapaneseAudioButton';
import { jlptExamBank, JLPTQuestion } from '@/content/jlptExams';
import {
  Trophy, Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Award, RotateCcw, Bookmark
} from 'lucide-react';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

const PASS_THRESHOLDS: Record<JLPTLevel, number> = {
  N5: 90, N4: 90, N3: 95, N2: 90, N1: 100
};

const LEVEL_COLORS: Record<JLPTLevel, { bg: string; text: string; border: string }> = {
  N5: { bg: 'rgba(90,173,122,0.12)',  text: '#5aad7a', border: 'rgba(90,173,122,0.3)' },
  N4: { bg: 'rgba(59,130,246,0.12)',  text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  N3: { bg: 'rgba(139,92,246,0.12)',  text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  N2: { bg: 'rgba(232,171,59,0.12)',  text: '#e8ab3b', border: 'rgba(232,171,59,0.3)' },
  N1: { bg: 'rgba(217,49,83,0.12)',   text: '#f24a68', border: 'rgba(217,49,83,0.3)' },
};

export default function JLPTPage() {
  const { addXP, addReviewItem } = useAppStore();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [examState, setExamState] = useState<'start' | 'exam' | 'results'>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(480);
  const [savedToReview, setSavedToReview] = useState(false);

  const questions = jlptExamBank[selectedLevel] || jlptExamBank.N5;
  const currentQuestion: JLPTQuestion | undefined = questions[currentQIndex];
  const levelColor = LEVEL_COLORS[selectedLevel];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examState === 'exam' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && examState === 'exam') {
      finishExam();
    }
    return () => clearInterval(timer);
  }, [examState, timeLeft]);

  const startExam = () => {
    setExamState('exam');
    setCurrentQIndex(0);
    setAnswers({});
    setTimeLeft(480);
    setSavedToReview(false);
  };

  const finishExam = () => {
    setExamState('results');
    let correctCount = 0;
    questions.forEach(q => { if (answers[q.id] === q.answer) correctCount++; });
    const scaledScore = Math.round((correctCount / questions.length) * 180);
    const hasPassed = scaledScore >= PASS_THRESHOLDS[selectedLevel];
    if (hasPassed) { playSound('achievement'); addXP(200); }
    else { playSound('incorrect'); addXP(50); }
  };

  const addIncorrectToReview = () => {
    questions.forEach(q => {
      if (answers[q.id] !== q.answer) {
        addReviewItem({ id: `jlpt-${selectedLevel}-${q.id}`, type: 'grammar', itemId: `jlpt-${q.id}` });
      }
    });
    setSavedToReview(true);
    playSound('correct');
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  let totalCorrect = 0;
  questions.forEach(q => { if (answers[q.id] === q.answer) totalCorrect++; });
  const finalScore = Math.round((totalCorrect / questions.length) * 180);
  const isPass = finalScore >= PASS_THRESHOLDS[selectedLevel];

  const sectionScores: Record<string, { total: number; correct: number }> = {};
  questions.forEach(q => {
    if (!sectionScores[q.section]) sectionScores[q.section] = { total: 0, correct: 0 };
    sectionScores[q.section].total += 1;
    if (answers[q.id] === q.answer) sectionScores[q.section].correct += 1;
  });

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="hanko-stamp">試験</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              JLPT Mock Exam
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.1rem' }}>
            Official format diagnostic with Vocabulary, Grammar, Reading & Listening
          </p>
        </div>

        {examState !== 'start' && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setExamState('start')}
            style={{ gap: '0.35rem' }}
          >
            <RotateCcw size={13} />
            <span style={{ fontSize: '0.72rem' }}>Exit Test</span>
          </button>
        )}
      </div>

      {/* ── Level Tabs ── */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.1rem', WebkitOverflowScrolling: 'touch' }}>
        {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map(lvl => {
          const isSelected = selectedLevel === lvl;
          const lc = LEVEL_COLORS[lvl];
          return (
            <button
              key={lvl}
              disabled={examState === 'exam'}
              onClick={() => { setSelectedLevel(lvl); setExamState('start'); }}
              style={{
                padding: '0.38rem 1rem',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 600,
                cursor: examState === 'exam' ? 'not-allowed' : 'pointer',
                borderRadius: 'var(--radius-full)',
                background: isSelected ? lc.bg : 'var(--bg-card)',
                border: `1.5px solid ${isSelected ? lc.border : 'var(--border-subtle)'}`,
                color: isSelected ? lc.text : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              JLPT {lvl}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════
          START SCREEN
      ═══════════════════════════════════ */}
      {examState === 'start' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="washi-card"
          style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            maxWidth: 580,
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Subtle Kanji Watermark */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 10,
              bottom: 2,
              fontSize: '5rem',
              fontFamily: 'Noto Serif JP, serif',
              fontWeight: 900,
              color: 'var(--text-primary)',
              opacity: 0.04,
              pointerEvents: 'none',
              userSelect: 'none',
              lineHeight: 1
            }}
          >
            {selectedLevel}
          </div>

          {/* Level icon */}
          <div style={{
            width: 72, height: 72,
            margin: '0 auto 1rem',
            borderRadius: 'var(--radius-xl)',
            background: levelColor.bg,
            border: `2px solid ${levelColor.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            ⛩️
          </div>

          <span className={`badge badge-${selectedLevel.toLowerCase()}`} style={{ fontSize: '0.72rem', marginBottom: '0.6rem', position: 'relative', zIndex: 1 }}>
            Official Standard · JLPT {selectedLevel}
          </span>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.4rem 0 0.5rem', letterSpacing: '-0.02em' }}>
            JLPT {selectedLevel} Mock Exam
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.65, maxWidth: 460, margin: '0 auto 1.5rem' }}>
            Test your Vocabulary (語彙), Grammar (文法), Reading (読解), and Listening (聴解) under realistic timed conditions.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            background: 'var(--bg-elevated)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--gold-400)' }}>{questions.length}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Questions</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--sakura-400)' }}>8:00</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Timer</div>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', color: levelColor.text }}>{PASS_THRESHOLDS[selectedLevel]}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Pass / 180</div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={startExam}
            style={{ width: '100%', fontWeight: 800, letterSpacing: '-0.01em' }}
          >
            Start JLPT {selectedLevel} Mock
          </button>
        </motion.div>
      )}

      {/* ═══════════════════════════════════
          EXAM IN PROGRESS
      ═══════════════════════════════════ */}
      {examState === 'exam' && currentQuestion && (
        <div style={{ maxWidth: 680, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

          {/* Status Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-card)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge badge-${selectedLevel.toLowerCase()}`}>{currentQuestion.section}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Q{currentQIndex + 1} / {questions.length}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                ({answeredCount} answered)
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              color: timeLeft < 120 ? '#f87171' : 'var(--sakura-400)',
              fontWeight: 800, fontSize: '0.95rem'
            }}>
              <Clock size={14} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ height: 4 }}>
            <div
              className="progress-fill"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Navigation Dots */}
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', padding: '0.1rem 0' }}>
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentQIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  style={{
                    width: 30, height: 30,
                    borderRadius: 'var(--radius-sm)',
                    border: isCurrent ? `2px solid var(--sakura-500)` : '1px solid var(--border-subtle)',
                    background: isCurrent ? 'rgba(217,49,83,0.18)' : isAnswered ? 'rgba(90,173,122,0.12)' : 'var(--bg-elevated)',
                    color: isCurrent ? 'var(--sakura-400)' : isAnswered ? 'var(--matcha-400)' : 'var(--text-muted)',
                    fontSize: '0.7rem', fontWeight: 800,
                    cursor: 'pointer', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="washi-card"
            style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
          >
            {/* Audio for listening section */}
            {currentQuestion.audioText && (
              <div style={{
                background: 'rgba(217,49,83,0.07)',
                border: '1px solid rgba(217,49,83,0.18)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.85rem 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--sakura-400)' }}>🎧 聴解音声</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Tap to hear native speaker</div>
                </div>
                <JapaneseAudioButton text={currentQuestion.audioText} showLabel label="Play" variant="primary" />
              </div>
            )}

            {/* Prompt */}
            <div>
              <div style={{
                fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.65, whiteSpace: 'pre-line'
              }}>
                {currentQuestion.japanesePrompt}
              </div>
              {currentQuestion.subPrompt && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {currentQuestion.subPrompt}
                </div>
              )}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = answers[currentQuestion.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.7rem',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(217,49,83,0.1)' : 'var(--bg-elevated)',
                      border: `1.5px solid ${isSelected ? 'var(--sakura-500)' : 'var(--border-medium)'}`,
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-primary)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.18s',
                      minHeight: 50,
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <span style={{
                      width: 28, height: 28,
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'var(--sakura-500)' : 'rgba(255,255,255,0.06)',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.72rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {['A', 'B', 'C', 'D'][optIdx]}
                    </span>
                    <span style={{ fontFamily: 'Noto Sans JP, sans-serif', fontSize: '0.93rem', fontWeight: 600, flex: 1 }}>
                      {opt}
                    </span>
                    {isSelected && <CheckCircle2 size={16} color="var(--sakura-400)" style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>

            {/* Nav buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                className="btn btn-secondary"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                style={{ fontSize: '0.82rem', gap: '0.35rem' }}
              >
                <ChevronLeft size={15} /> Back
              </button>

              {currentQIndex + 1 < questions.length ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  style={{ fontSize: '0.82rem', gap: '0.35rem' }}
                >
                  Next <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={finishExam}
                  style={{ fontSize: '0.82rem', fontWeight: 800 }}
                >
                  Submit Exam 🏁
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════════════════════════
          RESULTS SCREEN
      ═══════════════════════════════════ */}
      {examState === 'results' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="washi-card"
          style={{ maxWidth: 680, margin: '0 auto', width: '100%', padding: '2rem 1.5rem', textAlign: 'center' }}
        >
          <Award size={48} color={isPass ? 'var(--gold-400)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.65rem' }} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            JLPT {selectedLevel} Score Report
          </h2>

          {/* Pass / Fail badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.38rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: isPass ? 'rgba(90,173,122,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1.5px solid ${isPass ? 'var(--matcha-500)' : '#ef4444'}`,
            color: isPass ? 'var(--matcha-400)' : '#f87171',
            fontWeight: 800, fontSize: '0.92rem',
            margin: '0.5rem 0 1.5rem'
          }}>
            {isPass ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{isPass ? 'PASS 🎉' : 'Did Not Pass — Keep Practicing!'}</span>
          </div>

          {/* Score display */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '2.75rem', fontWeight: 900, color: isPass ? 'var(--gold-400)' : 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {finalScore}
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}> / 180</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Pass mark: {PASS_THRESHOLDS[selectedLevel]} pts · {totalCorrect} / {questions.length} correct
            </div>
          </div>

          {/* Section scores */}
          <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Section Breakdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.55rem' }}>
              {Object.entries(sectionScores).map(([section, data]) => {
                const pct = Math.round((data.correct / data.total) * 100);
                const isStrong = pct >= 70;
                return (
                  <div key={section} style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.7rem'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{section}</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: isStrong ? 'var(--matcha-400)' : 'var(--gold-400)', marginTop: '0.15rem' }}>
                      {pct}%
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{data.correct} / {data.total}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add to SRS */}
          {totalCorrect < questions.length && (
            <button
              className="btn btn-secondary"
              onClick={addIncorrectToReview}
              disabled={savedToReview}
              style={{ width: '100%', marginBottom: '1.25rem', fontSize: '0.82rem', gap: '0.5rem' }}
            >
              <Bookmark size={14} color="var(--gold-400)" />
              {savedToReview ? '✓ Added to SRS Review Deck' : 'Add Missed Questions to SRS Deck'}
            </button>
          )}

          {/* Question review */}
          <div style={{ textAlign: 'left', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '1.1rem', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
              Detailed Explanations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.answer;
                return (
                  <div key={q.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.7rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span className={`badge badge-${selectedLevel.toLowerCase()}`} style={{ fontSize: '0.62rem' }}>{q.section}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isCorrect ? 'var(--matcha-400)' : '#f87171' }}>
                        {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'Noto Sans JP', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      Q{i + 1}: {q.japanesePrompt.slice(0, 80)}{q.japanesePrompt.length > 80 ? '…' : ''}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Your: <strong style={{ color: isCorrect ? 'var(--matcha-400)' : '#f87171' }}>{answers[q.id] || '(None)'}</strong>
                      {' · '}
                      Correct: <strong style={{ color: 'var(--matcha-400)' }}>{q.answer}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.15)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.5 }}>
                      💡 {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => setExamState('start')}
            style={{ width: '100%', fontWeight: 800 }}
          >
            Retake or Change Level
          </button>
        </motion.div>
      )}
    </div>
  );
}
