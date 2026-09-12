'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { courseModules, Lesson } from '@/content/courses';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { ArrowLeft, Volume2, CheckCircle2, ChevronRight, Award, Sparkles, BookOpen } from 'lucide-react';

export default function LessonPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;
  const router = useRouter();
  const { completeLesson, addXP } = useAppStore();

  // Find lesson data across all course modules
  let foundLesson: Lesson | null = null;
  for (const mod of courseModules) {
    const target = mod.lessons.find(l => l.id === lessonId);
    if (target) {
      foundLesson = target;
      break;
    }
  }

  const lesson = foundLesson || courseModules[0].lessons[0];

  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  const steps = [
    { type: 'intro', title: 'Introduction', content: 'Welcome to this lesson! We will cover key Japanese concepts, pronunciation, and practical vocabulary step-by-step.' },
    { type: 'explanation', title: 'Core Concept', content: 'Japanese sentences follow a Subject - Object - Verb (SOV) structure. Particles mark the roles of words in the sentence.' },
    { type: 'pronunciation', title: 'Listen & Practice', content: 'こんにちは！ (Konnichiwa) - Hello / Good Afternoon.' },
    { type: 'quiz', title: 'Quick Practice Quiz', question: 'What is the topic marker particle in Japanese?', options: ['は (wa)', 'を (o)', 'に (ni)', 'で (de)'], answer: 'は (wa)' },
  ];

  const currentStep = steps[stepIndex];

  const handleNextStep = () => {
    if (stepIndex + 1 < steps.length) {
      setStepIndex(prev => prev + 1);
      setSelectedQuizOption(null);
    } else {
      setCompleted(true);
      completeLesson(lesson.id, lesson.xpReward);
      playSound('complete');
    }
  };

  return (
    <div className="page-content">
      <Link href="/learn" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
        <ArrowLeft size={16} /> Back to Modules
      </Link>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Lesson Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <span className="badge badge-n5">{lesson.level.toUpperCase()}</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {lesson.title} — {lesson.titleJP}
            </h1>
          </div>
          <span style={{ fontSize: '0.875rem', color: 'var(--gold-400)', fontWeight: 800 }}>
            +{lesson.xpReward} XP
          </span>
        </div>

        {/* Step Progress bar */}
        <div className="progress-bar" style={{ height: 6, marginBottom: '2rem' }}>
          <div className="progress-fill" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
        </div>

        {!completed ? (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Step {stepIndex + 1} of {steps.length} • {currentStep.title}
            </div>

            {currentStep.type === 'intro' && (
              <div>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🇯🇵</div>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {currentStep.content}
                </p>
              </div>
            )}

            {currentStep.type === 'explanation' && (
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--sakura-400)', marginBottom: '1rem' }}>
                  Key Pattern
                </div>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {currentStep.content}
                </p>
              </div>
            )}

            {currentStep.type === 'pronunciation' && (
              <div>
                <div style={{ fontSize: '2.5rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  {currentStep.content}
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => speakJapanese('こんにちは')}
                  style={{ marginBottom: '2rem' }}
                >
                  <Volume2 size={18} /> Play Audio
                </button>
              </div>
            )}

            {currentStep.type === 'quiz' && currentStep.options && (
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                  {currentStep.question}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                  {currentStep.options.map(opt => {
                    const isSelected = selectedQuizOption === opt;
                    const isCorrect = opt === currentStep.answer;
                    let btnClass = 'quiz-option';
                    if (selectedQuizOption !== null) {
                      if (isCorrect) btnClass += ' correct';
                      else if (isSelected) btnClass += ' incorrect';
                    }
                    return (
                      <button
                        key={opt}
                        className={btnClass}
                        onClick={() => {
                          setSelectedQuizOption(opt);
                          if (opt === currentStep.answer) playSound('correct');
                          else playSound('incorrect');
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              onClick={handleNextStep}
              disabled={currentStep.type === 'quiz' && selectedQuizOption === null}
              style={{ width: '100%' }}
            >
              {stepIndex + 1 === steps.length ? 'Finish Lesson 🎉' : 'Continue'} <ChevronRight size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <Award size={64} color="var(--gold-400)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Lesson Complete! 🎉
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem' }}>
              You completed <strong>{lesson.title}</strong>
            </p>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-400)', marginBottom: '2rem' }}>
              +{lesson.xpReward} XP Earned
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => router.push('/learn')} style={{ width: '100%' }}>
              Continue Learning <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
