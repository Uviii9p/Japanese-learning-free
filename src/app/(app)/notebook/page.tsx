'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { vocabularyData } from '@/content/vocabulary';
import { kanjiData } from '@/content/kanji';
import { BookMarked, Bookmark, Plus, Trash2, Edit3 } from 'lucide-react';

export default function NotebookPage() {
  const { bookmarkedVocab, bookmarkedKanji, notes, addNote, deleteNote } = useAppStore();
  const [tab, setTab] = useState<'notes' | 'bookmarks'>('notes');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAddNote = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    addNote({
      title: newTitle,
      content: newContent,
      tags: ['Japanese'],
    });
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookMarked size={28} color="var(--sakura-400)" /> My Japanese Notebook — ノート
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Save custom study notes and review your bookmarked vocabulary & kanji.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button className={`btn ${tab === 'notes' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('notes')}>
          Personal Notes ({notes.length})
        </button>
        <button className={`btn ${tab === 'bookmarks' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('bookmarks')}>
          Bookmarks ({bookmarkedVocab.length + bookmarkedKanji.length})
        </button>
      </div>

      {tab === 'notes' && (
        <div className="layout-split-equal">
          {/* Add Note Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Create New Note
            </h2>
            <input
              className="input"
              type="text"
              placeholder="Note title (e.g. て-form conjugation rules)"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
            <textarea
              className="input"
              rows={6}
              placeholder="Write your study notes here..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
            <button className="btn btn-primary" onClick={handleAddNote} disabled={!newTitle.trim()}>
              <Plus size={16} /> Save Note
            </button>
          </div>

          {/* Notes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notes.map(n => (
              <div key={n.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{n.title}</div>
                  <button className="btn btn-ghost btn-icon" onClick={() => deleteNote(n.id)}>
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {n.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'bookmarks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1rem' }}>
          {bookmarkedVocab.map(id => {
            const item = vocabularyData.find(v => v.id === id);
            if (!item) return null;
            return (
              <div key={id} style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.75rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--text-primary)' }}>{item.japanese}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--sakura-400)', fontWeight: 700 }}>{item.reading}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{item.meaning}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
