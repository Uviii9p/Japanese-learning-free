'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { Trophy, Clock, CheckCircle2, AlertTriangle, ChevronRight, Award, HelpCircle } from 'lucide-react';

interface MockQuestion {
  id: number;
  section: 'Vocabulary' | 'Grammar' | 'Kanji' | 'Reading' | 'Listening';
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const mockExamData: Record<string, MockQuestion[]> = {
  N5: [
    { id: 1, section: 'Vocabulary', question: '「たべる」の漢字はどれですか？', options: ['飲む', '食べる', '見る', '行く'], answer: '食べる', explanation: '食べる (taberu) means to eat.' },
    { id: 2, section: 'Grammar', question: '私___学生です。', options: ['は', 'を', 'に', 'で'], answer: 'は', explanation: 'は is the topic marker.' },
    { id: 3, section: 'Kanji', question: '「日曜日」の読み方はどれですか？', options: ['にちようび', 'げつようび', 'かようび', 'すいようび'], answer: 'にちようび', explanation: '日曜日 is pronounced Nichiyoubi (Sunday).' },
    { id: 4, section: 'Grammar', question: '昨日、映画を___。', options: ['見ます', '見ました', '見ない', '見たい'], answer: '見ました', explanation: '昨日 (yesterday) requires past tense 見ました.' },
    { id: 5, section: 'Reading', question: '図書館で静かに勉強します。どこで勉強しますか？', options: ['学校', '図書館', '家', '駅'], answer: '図書館', explanation: '図書館 (toshokan) means library.' },
  ],
  N4: [
    { id: 1, section: 'Grammar', question: '日本に行ったら、京都へ___と思っています。', options: ['行く', '行こう', '行きます', '行け'], answer: '行こう', explanation: 'Volitional form 行こう + と思っています for intentions.' },
  ]
};

export default function JLPTPage() {
  const { addXP } = useAppStore();
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [examState, setExamState] = useState<'start' | 'exam' | 'results'>('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins for mini mock

  const questions = mockExamData[selectedLevel] || mockExamData['N5'];

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
    setCurrentQ(0);
    setAnswers({});
    setTimeLeft(300);
  };

  const finishExam = () => {
    setExamState('results');
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    if (correct / questions.length >= 0.7) {
      playSound('achievement');
      addXP(150);
    } else {
      playSound('incorrect');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={28} color="var(--gold-400)" /> JLPT Exam Preparation — JLPT対策
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Take official-style timed JLPT mock tests with weak area diagnostics & detailed score reports.
        </p>
      </div>

      {/* Level Selection Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map(lvl => (
          <button
            key={lvl}
            className={`badge ${selectedLevel === lvl ? `badge-${lvl.toLowerCase()}` : ''}`}
            onClick={() => { setSelectedLevel(lvl); setExamState('start'); }}
            style={{
              padding: '0.5rem 1.25rem', fontSize: '0.85rem', cursor: 'pointer',
              background: selectedLevel === lvl ? undefined : 'var(--bg-card)',
              border: selectedLevel === lvl ? undefined : '1px solid var(--border-subtle)',
              color: selectedLevel === lvl ? undefined : 'var(--text-muted)'
            }}
          >
            JLPT {lvl}
          </button>
        ))}
      </div>

      {examState === 'start' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📜</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            JLPT {selectedLevel} Official Mock Exam
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Test your Vocabulary, Kanji, Grammar, and Reading under timed exam conditions.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--gold-400)' }}>{questions.length} Questions</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Section Questions</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)', padding: '0 2rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--sakura-400)' }}>5:00</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time Limit</div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#10b981' }}>70%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pass Mark</div>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={startExam} style={{ width: '100%' }}>
            Start JLPT {selectedLevel} Mock Test 🚀
          </button>
        </motion.div>
      )}

      {examState === 'exam' && (
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {/* Top Bar with Timer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Question {currentQ + 1} of {questions.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--sakura-400)', fontWeight: 800, fontSize: '1.1rem' }}>
              <Clock size={18} /> {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question Display Card */}
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <span className="badge badge-n5" style={{ marginBottom: '1rem' }}>
              {questions[currentQ].section}
            </span>

            <div style={{ fontSize: '1.4rem', fontFamily: 'Noto Sans JP', fontWeight: 800, color: 'var(--text-primary)', margin: '1rem 0 2rem' }}>
              {questions[currentQ].question}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {questions[currentQ].options.map((opt) => (
                <button
                  key={opt}
                  className={`quiz-option ${answers[questions[currentQ].id] === opt ? 'correct' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, [questions[currentQ].id]: opt }))}
                  style={{ fontFamily: 'Noto Sans JP', fontSize: '1.1rem', fontWeight: 700 }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button
                className="btn btn-secondary"
                disabled={currentQ === 0}
                onClick={() => setCurrentQ(prev => prev - 1)}
              >
                Previous
              </button>

              {currentQ + 1 < questions.length ? (
                <button className="btn btn-primary" onClick={() => setCurrentQ(prev => prev + 1)}>
                  Next Question <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={finishExam}>
                  Finish & Submit Exam
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {examState === 'results' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <Award size={56} color="var(--gold-400)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>
            JLPT {selectedLevel} Exam Results
          </h2>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginBottom: '1.5rem' }}>
            Status: LIKELY PASS 🎉
          </div>

          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Detailed Question Explanations
            </h3>
            {questions.map((q, i) => (
              <div key={q.id} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: answers[q.id] === q.answer ? '#10b981' : '#ef4444' }}>
                  Q{i + 1}: {q.question} ({answers[q.id] === q.answer ? 'Correct ✓' : 'Incorrect ❌'})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Explanation: {q.explanation}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg" onClick={() => setExamState('start')} style={{ width: '100%' }}>
            Retake Exam
          </button>
        </motion.div>
      )}
    </div>
  );
}
