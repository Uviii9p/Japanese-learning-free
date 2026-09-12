'use client';

import { useState } from 'react';
import { vocabularyData } from '@/content/vocabulary';
import { kanjiData } from '@/content/kanji';
import { grammarData } from '@/content/grammar';
import { Shield, Plus, Edit3, Trash2, BookOpen, Layers } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'vocab' | 'kanji' | 'grammar'>('vocab');

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield size={28} color="var(--gold-400)" /> Content Management Admin — 管理者
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Manage curriculum, seed vocabulary, kanji definitions, grammar structures, and publish new content.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button className={`btn ${activeTab === 'vocab' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('vocab')}>
          Vocabulary ({vocabularyData.length})
        </button>
        <button className={`btn ${activeTab === 'kanji' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('kanji')}>
          Kanji ({kanjiData.length})
        </button>
        <button className={`btn ${activeTab === 'grammar' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('grammar')}>
          Grammar ({grammarData.length})
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Curriculum Database Items
          </h2>
          <button className="btn btn-primary btn-sm">
            <Plus size={14} /> Add New Item
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {activeTab === 'vocab' && vocabularyData.slice(0, 10).map(v => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Noto Sans JP' }}>{v.japanese}</span> ({v.reading}) — {v.meaning}
              </div>
              <span className="badge badge-n5">{v.jlptLevel}</span>
            </div>
          ))}

          {activeTab === 'kanji' && kanjiData.slice(0, 10).map(k => (
            <div key={k.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: 'Noto Sans JP', color: 'var(--sakura-400)' }}>{k.kanji}</span> — {k.meanings.join(', ')}
              </div>
              <span className="badge badge-n5">{k.jlptLevel}</span>
            </div>
          ))}

          {activeTab === 'grammar' && grammarData.slice(0, 10).map(g => (
            <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Noto Sans JP', color: 'var(--gold-400)' }}>{g.title}</span> — {g.meaning}
              </div>
              <span className="badge badge-n5">{g.jlptLevel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
