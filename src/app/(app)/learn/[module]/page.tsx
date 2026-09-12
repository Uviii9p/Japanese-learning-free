'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { courseModules } from '@/content/courses';
import { BookOpen, Play, ChevronRight, CheckCircle2, Star, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function DynamicModulePage({ params }: { params: Promise<{ module: string }> }) {
  const resolvedParams = use(params);
  const rawModuleId = resolvedParams.module;
  const { completedLessons } = useAppStore();

  // Find module in courseModules or match level
  const moduleData = courseModules.find(m =>
    m.id === `module-${rawModuleId}` || m.id === rawModuleId || m.level === rawModuleId
  ) || courseModules[0];

  return (
    <div className="page-content">
      <Link href="/learn" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
        <ArrowLeft size={16} /> Back to All Modules
      </Link>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        {/* Module Header */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <span className="badge badge-n5" style={{ marginBottom: '0.75rem' }}>{moduleData.levelLabel}</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {moduleData.title} — {moduleData.titleJP}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 600 }}>
              {moduleData.description}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-400)' }}>
              +{moduleData.totalXP} XP
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {moduleData.lessons.length} Interactive Lessons
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="var(--sakura-400)" /> Module Lessons
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {moduleData.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <motion.div
                key={lesson.id}
                whileHover={{ x: 4 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: isCompleted ? 'rgba(16,185,129,0.15)' : 'var(--bg-elevated)',
                    border: `1px solid ${isCompleted ? '#10b981' : 'var(--border-medium)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', fontWeight: 800,
                    color: isCompleted ? '#10b981' : 'var(--text-primary)',
                    fontFamily: 'Noto Sans JP'
                  }}>
                    {isCompleted ? <CheckCircle2 size={22} color="#10b981" /> : (index + 1)}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {lesson.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--sakura-400)', fontFamily: 'Noto Sans JP', fontWeight: 700, margin: '0.1rem 0' }}>
                      {lesson.titleJP}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {lesson.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 700 }}>
                    +{lesson.xpReward} XP
                  </span>
                  <Link href={`/learn/lesson/${lesson.id}`} className="btn btn-primary btn-sm">
                    {isCompleted ? 'Review' : 'Start'} <Play size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
