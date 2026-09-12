'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { grammarData, grammarByLevel, GrammarPoint } from '@/content/grammar';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { Edit3, CheckCircle2, Volume2, AlertTriangle, BookOpen, ChevronRight, HelpCircle, Award } from 'lucide-react';

export default function GrammarPage() {
  const { learnedGrammar, learnGrammar, addXP } = useAppStore();
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [selectedPoint, setSelectedPoint] = useState<GrammarPoint>(grammarData[0]);
  const [mode, setMode] = useState<'study' | 'quiz'>('study');
  
  // Mini quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredGrammar = grammarByLevel[selectedLevel] || grammarData;

  const handleSelectPoint = (point: GrammarPoint) => {
    setSelectedPoint(point);
    speakJapanese(point.title);
    if (!learnedGrammar.includes(point.id)) {
      learnGrammar([point.id]);
      addXP(15);
      playSound('xp');
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={24} color="var(--amber-400)" /> Grammar Curriculum — 文法
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Master Japanese sentence structures, particle rules, and conjugations from N5 to N1.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${mode === 'study' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('study')}>
            Grammar Lessons
          </button>
          <button className={`btn ${mode === 'quiz' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('quiz')}>
            Grammar Quiz 🎯
          </button>
        </div>
      </div>

      {/* Level Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map(lvl => (
          <button
            key={lvl}
            className={`badge ${selectedLevel === lvl ? `badge-${lvl.toLowerCase()}` : ''}`}
            onClick={() => { setSelectedLevel(lvl); setSelectedPoint(grammarByLevel[lvl][0] || grammarData[0]); }}
            style={{
              padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer',
              background: selectedLevel === lvl ? undefined : 'var(--bg-card)',
              border: selectedLevel === lvl ? undefined : '1px solid var(--border-subtle)',
              color: selectedLevel === lvl ? undefined : 'var(--text-muted)'
            }}
          >
            JLPT {lvl} ({grammarByLevel[lvl]?.length || 0})
          </button>
        ))}
      </div>

      {mode === 'study' && (
        <div className="layout-split-left">
          {/* Grammar Sidebar List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
            {filteredGrammar.map((point) => {
              const isLearned = learnedGrammar.includes(point.id);
              const isSelected = selectedPoint.id === point.id;
              return (
                <motion.button
                  key={point.id}
                  whileHover={{ x: 3 }}
                  onClick={() => handleSelectPoint(point)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? 'rgba(245,158,11,0.12)' : 'var(--bg-card)',
                    border: `1px solid ${isSelected ? 'var(--gold-500)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'Noto Sans JP' }}>
                      {point.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {point.meaning}
                    </div>
                  </div>
                  {isLearned && <CheckCircle2 size={16} color="#10b981" />}
                </motion.button>
              );
            })}
          </div>

          {/* Grammar Detail Display */}
          {selectedPoint && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}>
              <div>
                <span className={`badge badge-${selectedPoint.jlptLevel.toLowerCase()}`}>
                  JLPT {selectedPoint.jlptLevel} • {selectedPoint.category}
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem', fontFamily: 'Noto Sans JP' }}>
                  {selectedPoint.title}
                </h2>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-400)', marginTop: '0.2rem' }}>
                  {selectedPoint.meaning}
                </div>
              </div>

              {/* Structure Card */}
              <div style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                  Grammar Structure
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Noto Sans JP' }}>
                  {selectedPoint.structure}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Explanation & Usage
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedPoint.explanation}
                </p>
              </div>

              {/* Example Sentences */}
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  Example Sentences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedPoint.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.15rem', fontFamily: 'Noto Sans JP', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {ex.japanese}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.1rem 0' }}>
                          {ex.reading}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--sakura-400)', fontWeight: 600 }}>
                          {ex.english}
                        </div>
                      </div>
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => speakJapanese(ex.japanese)}
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              {selectedPoint.commonMistakes.length > 0 && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}>
                  <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Common Mistakes to Avoid
                    </div>
                    {selectedPoint.commonMistakes.map((m, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        • {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {mode === 'quiz' && selectedPoint.exercises[0] && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <motion.div
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
              Grammar Mini Practice • {selectedPoint.title}
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2rem' }}>
              {selectedPoint.exercises[0].question}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedPoint.exercises[0].options?.map((opt) => (
                <button
                  key={opt}
                  className="quiz-option"
                  onClick={() => {
                    if (opt === selectedPoint.exercises[0].answer) {
                      playSound('correct');
                      addXP(20);
                    } else {
                      playSound('incorrect');
                    }
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
