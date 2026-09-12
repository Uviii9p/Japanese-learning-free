'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { courseModules } from '@/content/courses';
import {
  BookOpen, Star, Trophy, ChevronRight, Sparkles,
  Edit3, Headphones, Mic, MessageCircle, BookMarked, Layers, Play
} from 'lucide-react';

const categoryCards = [
  { id: 'hiragana', title: 'Hiragana', titleJP: 'ひらがな', icon: 'あ', href: '/learn/hiragana', color: 'from-pink-500 to-rose-600', count: '46 Characters', desc: 'The foundational Japanese syllabary' },
  { id: 'katakana', title: 'Katakana', titleJP: 'カタカナ', icon: 'ア', href: '/learn/katakana', color: 'from-blue-500 to-indigo-600', count: '46 Characters', desc: 'Used for foreign words & loanwords' },
  { id: 'kanji', title: 'Kanji System', titleJP: '漢字', icon: '漢', href: '/learn/kanji', color: 'from-red-500 to-orange-600', count: 'N5 - N1 Kanji', desc: 'Meanings, readings, stroke order & mnemonics' },
  { id: 'vocabulary', title: 'Vocabulary', titleJP: '語彙', icon: '📖', href: '/learn/vocabulary', color: 'from-emerald-500 to-teal-600', count: '800+ Words', desc: 'Spaced repetition flashcard system' },
  { id: 'grammar', title: 'Grammar', titleJP: '文法', icon: '✍️', href: '/learn/grammar', color: 'from-amber-500 to-yellow-600', count: 'N5 - N1 Grammar', desc: 'Particle rules, verb forms & structure' },
  { id: 'writing', title: 'Handwriting', titleJP: '書き方', icon: '🎨', href: '/learn/writing', color: 'from-purple-500 to-pink-600', count: 'Canvas Practice', desc: 'Interactive stroke-order feedback' },
  { id: 'sentence', title: 'Sentence Builder', titleJP: '文章構築', icon: '🧩', href: '/learn/sentence-builder', color: 'from-indigo-500 to-purple-600', count: 'Interactive Tiles', desc: 'Drag-and-drop word order practice' },
  { id: 'listening', title: 'Listening', titleJP: '聴解', icon: '🎧', href: '/learn/listening', color: 'from-violet-500 to-purple-600', count: 'Speed Controls', desc: 'Audio dictation, shadowing & transcript' },
  { id: 'speaking', title: 'Speaking', titleJP: 'スピーキング', icon: '🎤', href: '/learn/speaking', color: 'from-cyan-500 to-sky-600', count: 'Voice Analysis', desc: 'Pronunciation & fluency feedback' },
  { id: 'reading', title: 'Reading Passages', titleJP: '読解', icon: '📰', href: '/learn/reading', color: 'from-teal-500 to-emerald-600', count: 'N5 - N1 Texts', desc: 'Interactive tap-to-lookup & furigana' },
  { id: 'conversation', title: 'Conversation Mode', titleJP: '会話', icon: '💬', href: '/learn/conversation', color: 'from-fuchsia-500 to-pink-600', count: 'Real Scenarios', desc: 'Roleplay with Sakura, Yuki & Haruto' },
  { id: 'tutor', title: 'AI Japanese Tutor', titleJP: 'AI先生', icon: '🤖', href: '/tutor', color: 'from-rose-500 to-red-600', count: 'Smart Explanations', desc: 'Grammar correction & sentence generator' },
];

export default function LearnPage() {
  const { completedLessons, learnedHiragana, learnedKatakana, learnedKanji, learnedVocabulary } = useAppStore();

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--sakura-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Sparkles size={16} /> Course Curriculum
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Learn Japanese — 日本語学習
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Choose a skill module or follow your structured JLPT path from zero to N1.
          </p>
        </div>

        {/* Modules Roadmap Grid */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--sakura-400)" /> Structured Path
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1rem' }}>
            {courseModules.map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ y: -4 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: `linear-gradient(135deg, ${module.color.replace('from-', '').replace('to-', '')})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 800, color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    fontFamily: 'Noto Sans JP'
                  }}>
                    {module.icon}
                  </div>
                  <span className="badge badge-n5">{module.levelLabel}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {module.title}
                  </h3>
                  <div style={{ fontFamily: 'Noto Sans JP', fontSize: '0.8rem', color: 'var(--sakura-400)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {module.titleJP}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {module.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {module.lessons.length} Lessons • +{module.totalXP} XP
                  </span>
                  <Link href={`/learn/${module.id.replace('module-', '')}`} className="btn btn-primary btn-sm">
                    Start <Play size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skill Modules Grid */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--gold-400)" /> Specialized Learning Modules
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1rem' }}>
            {categoryCards.map((card) => (
              <motion.div key={card.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                <Link href={card.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 44, height: 44,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', fontFamily: 'Noto Sans JP',
                      }}>
                        {card.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {card.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--sakura-400)', fontFamily: 'Noto Sans JP', fontWeight: 700 }}>
                          {card.titleJP}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {card.desc}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>{card.count}</span>
                      <ChevronRight size={14} color="var(--text-muted)" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
