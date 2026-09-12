'use client';

import { motion } from 'framer-motion';
import { Sparkles, Globe, Heart, Utensils, Compass } from 'lucide-react';

const cultureTopics = [
  {
    id: 'c1',
    title: 'Japanese Bowing (お辞儀 - Ojigi)',
    titleJP: 'お辞儀の文化',
    icon: '🙇',
    description: 'Bowing is an essential part of Japanese etiquette used for greetings, gratitude, and apologies.',
    details: 'There are three main types of bows: Eshaku (15° casual), Keirei (30° business polite), and Saikeirei (45° formal/deep apologies).'
  },
  {
    id: 'c2',
    title: 'Dining Etiquette (いただきます & ごちそうさま)',
    titleJP: '食事の作法',
    icon: '🍱',
    description: 'Saying "Itadakimasu" before meals expresses gratitude to the food and chef.',
    details: 'Never stick chopsticks vertically into a bowl of rice (Tsukitate-bashi), as this is associated with funeral rites.'
  },
  {
    id: 'c3',
    title: 'Omotenashi (おもてなし - Hospitality)',
    titleJP: 'おもてなし',
    icon: '🍵',
    description: 'The spirit of selfless Japanese hospitality and mindfulness towards guests.',
    details: 'Anticipating someone\'s needs before they even ask is the core philosophy of Omotenashi.'
  }
];

export default function CulturePage() {
  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Globe size={28} color="var(--sakura-400)" /> Japanese Culture & Etiquette — 日本文化
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Explore cultural insights, social etiquette, customs, and everyday expressions in Japan.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.25rem' }}>
        {cultureTopics.map(topic => (
          <motion.div
            key={topic.id}
            whileHover={{ y: -4 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ fontSize: '3rem' }}>{topic.icon}</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {topic.title}
            </h2>
            <div style={{ fontFamily: 'Noto Sans JP', fontSize: '0.85rem', color: 'var(--sakura-400)', fontWeight: 700 }}>
              {topic.titleJP}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {topic.description}
            </p>
            <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', borderLeft: '3px solid var(--sakura-500)' }}>
              💡 {topic.details}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
