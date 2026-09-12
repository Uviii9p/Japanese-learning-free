'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { BookOpen, Eye, EyeOff, Bookmark, Volume2, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface WordLookup {
  word: string;
  reading: string;
  meaning: string;
}

interface Passage {
  id: string;
  title: string;
  titleJP: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  contentJP: string;
  contentFurigana: string;
  translation: string;
  vocabulary: WordLookup[];
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

const readingPassages: Passage[] = [
  {
    id: 'rp01',
    title: 'My Daily Routine in Tokyo',
    titleJP: '私の東京での一日',
    level: 'N5',
    contentJP: '私は田中です。毎朝七時に起きます。朝ご飯にパンと卵を食べます。そして、八時に電車で会社へ行きます。仕事は楽しくて忙しいです。夜は七時に帰宅し、家族と一緒に夕飯を食べます。',
    contentFurigana: '私（わたし）は田中（たなか）です。毎朝（まいあさ）七時（しちじ）に起（お）きます。朝（あさ）ご飯（はん）にパンと卵（たまご）を食（た）べます。そして、八時（はちじ）に電車（でんしゃ）で会社（かいしゃ）へ行（い）きます。仕事（しごと）は楽（たの）しくて忙（いそが）しいです。夜（よる）は七時（しちじ）に帰宅（きたく）し、家族（かぞく）と一緒（いっしょ）に夕飯（ゆうはん）を食（た）べます。',
    translation: 'I am Tanaka. I wake up at 7:00 every morning. For breakfast, I eat bread and eggs. Then at 8:00 I go to the company by train. My work is fun and busy. In the evening I return home at 7:00 and eat dinner together with my family.',
    vocabulary: [
      { word: '毎朝', reading: 'まいあさ', meaning: 'every morning' },
      { word: '起きる', reading: 'おきる', meaning: 'to wake up' },
      { word: '電車', reading: 'でんしゃ', meaning: 'train' },
      { word: '会社', reading: 'かいしゃ', meaning: 'company' },
      { word: '家族', reading: 'かぞく', meaning: 'family' },
    ],
    questions: [
      { question: 'What time does Tanaka wake up?', options: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM'], answer: '7:00 AM' },
      { question: 'How does Tanaka go to work?', options: ['By bus', 'By train', 'By bicycle', 'On foot'], answer: 'By train' },
    ]
  },
  {
    id: 'rp02',
    title: 'A Trip to Kyoto',
    titleJP: '京都旅行記',
    level: 'N4',
    contentJP: '先週、新幹線で京都へ旅行に行きました。古い寺や綺麗な庭園をたくさん見学しました。特に金閣寺が素晴らしかったです。抹茶アイスクリームも美味しくて、良い思い出になりました。',
    contentFurigana: '先週（せんしゅう）、新幹線（しんかんせん）で京都（きょうと）へ旅行（りょこう）に行（い）きました。古（ふる）い寺（てら）や綺麗（きれい）な庭園（ていえん）をたくさん見学（けんがく）しました。特（とく）に金閣寺（きんかくじ）が素晴（すば）らしかったです。抹茶（まっちゃ）アイスクリームも美味（おい）しくて、良（よ）い思い出（おもいで）になりました。',
    translation: 'Last week I traveled to Kyoto by Bullet Train. I visited many old temples and beautiful gardens. Golden Pavilion was especially wonderful. The matcha ice cream was also delicious, and it became a great memory.',
    vocabulary: [
      { word: '新幹線', reading: 'しんかんせん', meaning: 'Bullet Train' },
      { word: '寺', reading: 'てら', meaning: 'temple' },
      { word: '庭園', reading: 'ていえん', meaning: 'garden' },
      { word: '素晴らしい', reading: 'すばらしい', meaning: 'wonderful' },
    ],
    questions: [
      { question: 'Where did the traveler go last week?', options: ['Tokyo', 'Kyoto', 'Osaka', 'Fukuoka'], answer: 'Kyoto' },
      { question: 'What dessert did they eat?', options: ['Cake', 'Dango', 'Matcha Ice Cream', 'Mochi'], answer: 'Matcha Ice Cream' },
    ]
  }
];

export default function ReadingPage() {
  const { addXP, updateSkillScore, learnVocabulary } = useAppStore();
  const [selectedPassage, setSelectedPassage] = useState<Passage>(readingPassages[0]);
  const [showFurigana, setShowFurigana] = useState(true);
  const [selectedWord, setSelectedWord] = useState<WordLookup | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const handleWordClick = (wordObj: WordLookup) => {
    setSelectedWord(wordObj);
    speakJapanese(wordObj.word);
  };

  const handleQuestionAnswer = (qIdx: number, opt: string) => {
    setAnswers(prev => ({ ...prev, [qIdx]: opt }));
  };

  const checkReadingQuiz = () => {
    let score = 0;
    selectedPassage.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score++;
    });

    setQuizFinished(true);
    if (score === selectedPassage.questions.length) {
      playSound('correct');
      addXP(50);
      updateSkillScore('reading', 95);
    } else {
      playSound('incorrect');
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} color="var(--emerald-400)" /> Reading Passages — 読解
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Practice reading authentic Japanese texts with furigana, vocabulary lookup, and comprehension quizzes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${showFurigana ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowFurigana(!showFurigana)}
          >
            {showFurigana ? <Eye size={16} /> : <EyeOff size={16} />} Furigana Toggle
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => speakJapanese(selectedPassage.contentJP)}
          >
            <Volume2 size={16} /> Listen Story
          </button>
        </div>
      </div>

      <div className="layout-split-right">
        {/* Main Passage Text Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div
            key={selectedPassage.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className={`badge badge-${selectedPassage.level.toLowerCase()}`}>
                JLPT {selectedPassage.level}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {selectedPassage.title}
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', fontFamily: 'Noto Sans JP' }}>
              {selectedPassage.titleJP}
            </h2>

            {/* Japanese Text with Interactive Word Highlights */}
            <div style={{
              fontSize: '1.4rem',
              fontFamily: 'Noto Sans JP, sans-serif',
              lineHeight: 2.2,
              color: 'var(--text-primary)',
              marginBottom: '2rem',
              background: 'var(--bg-elevated)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
            }}>
              {showFurigana ? selectedPassage.contentFurigana : selectedPassage.contentJP}
            </div>

            {/* English Translation */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--emerald-400)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                English Translation
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedPassage.translation}
              </p>
            </div>
          </motion.div>

          {/* Comprehension Quiz Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Reading Comprehension Questions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {selectedPassage.questions.map((q, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {idx + 1}. {q.question}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {q.options.map(opt => {
                      const isSelected = answers[idx] === opt;
                      return (
                        <button
                          key={opt}
                          className={`quiz-option ${isSelected ? 'correct' : ''}`}
                          onClick={() => handleQuestionAnswer(idx, opt)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!quizFinished ? (
                <button
                  className="btn btn-primary"
                  onClick={checkReadingQuiz}
                  disabled={Object.keys(answers).length < selectedPassage.questions.length}
                >
                  Submit Answers
                </button>
              ) : (
                <div style={{ color: '#10b981', fontWeight: 800, textAlign: 'center', fontSize: '1rem' }}>
                  🎉 Quiz Passed! +50 XP Earned
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vocabulary Lookup Drawer Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Passage Vocabulary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedPassage.vocabulary.map((v, i) => (
                <div
                  key={i}
                  onClick={() => handleWordClick(v)}
                  style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.1rem', fontFamily: 'Noto Sans JP', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {v.word}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {v.reading}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--emerald-400)', fontWeight: 600 }}>
                    {v.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
