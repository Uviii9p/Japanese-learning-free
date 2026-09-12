'use client';

import { useState } from 'react';
import { vocabularyData } from '@/content/vocabulary';
import { kanjiData } from '@/content/kanji';
import { grammarData } from '@/content/grammar';
import { speakJapanese } from '@/lib/utils';
import { Search as SearchIcon, Volume2, BookOpen, Edit3, Bookmark } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const cleanQuery = query.toLowerCase().trim();

  const vocabResults = cleanQuery ? vocabularyData.filter(v =>
    v.japanese.includes(cleanQuery) || v.reading.toLowerCase().includes(cleanQuery) || v.meaning.toLowerCase().includes(cleanQuery)
  ) : [];

  const kanjiResults = cleanQuery ? kanjiData.filter(k =>
    k.kanji.includes(cleanQuery) || k.meanings.some(m => m.toLowerCase().includes(cleanQuery)) || k.onyomi.some(o => o.includes(cleanQuery)) || k.kunyomi.some(ku => ku.includes(cleanQuery))
  ) : [];

  const grammarResults = cleanQuery ? grammarData.filter(g =>
    g.title.includes(cleanQuery) || g.meaning.toLowerCase().includes(cleanQuery)
  ) : [];

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <SearchIcon size={28} color="var(--sakura-400)" /> Global Japanese Search — 検索
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Search across Kanji, Vocabulary, Grammar, and Japanese lessons instantly.
      </p>

      {/* Input */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          className="input"
          type="text"
          placeholder="Search by Kanji, Hiragana, Romaji, or English (e.g. 食べる, taberu, eat, 日)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ fontSize: '1.1rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-xl)' }}
        />
      </div>

      {!cleanQuery && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
          Type a word or kanji to search the complete dictionary.
        </div>
      )}

      {/* Results */}
      {cleanQuery && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Kanji */}
          {kanjiResults.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Kanji ({kanjiResults.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '1rem' }}>
                {kanjiResults.map(k => (
                  <div key={k.id} style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '2.5rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--sakura-400)' }}>{k.kanji}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{k.meanings.join(', ')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k.onyomi.join(' • ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vocabulary */}
          {vocabResults.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Vocabulary ({vocabResults.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '1rem' }}>
                {vocabResults.map(v => (
                  <div key={v.id} style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '1.75rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--text-primary)' }}>{v.japanese}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--sakura-400)', fontWeight: 700 }}>{v.reading}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{v.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar */}
          {grammarResults.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Grammar ({grammarResults.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '1rem' }}>
                {grammarResults.map(g => (
                  <div key={g.id} style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '1.25rem', fontFamily: 'Noto Sans JP', fontWeight: 800, color: 'var(--gold-400)' }}>{g.title}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{g.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
