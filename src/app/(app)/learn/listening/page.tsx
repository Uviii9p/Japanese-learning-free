'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { Headphones, Volume2, Play, CheckCircle2, RotateCcw, Eye, EyeOff, Award, UserCheck } from 'lucide-react';

interface ListeningExercise {
  id: string;
  japanese: string;
  reading: string;
  english: string;
  options: string[];
  level: 'N5' | 'N4' | 'N3';
}

const listeningData: ListeningExercise[] = [
  {
    id: 'l01',
    japanese: '今日はいい天気ですね。',
    reading: 'Kyou wa ii tenki desu ne.',
    english: 'The weather is nice today, isn\'t it?',
    options: ['The weather is nice today.', 'It is raining today.', 'Tomorrow will be cold.', 'I am going to school.'],
    level: 'N5'
  },
  {
    id: 'l02',
    japanese: 'すみません、駅はどこですか？',
    reading: 'Sumimasen, eki wa doko desu ka?',
    english: 'Excuse me, where is the station?',
    options: ['Where is the station?', 'What time does the train leave?', 'How much is the ticket?', 'Where is the hospital?'],
    level: 'N5'
  },
  {
    id: 'l03',
    japanese: '私は毎日日本語を勉強しています。',
    reading: 'Watashi wa mainichi Nihongo o benkyou shite imasu.',
    english: 'I study Japanese every day.',
    options: ['I study Japanese every day.', 'I speak English at home.', 'I watched a Japanese movie.', 'I want to travel to Japan.'],
    level: 'N5'
  },
  {
    id: 'l04',
    japanese: '明日一緒に映画を見に行きませんか？',
    reading: 'Ashita issho ni eiga o mii ni ikimasen ka?',
    english: 'Would you like to go watch a movie together tomorrow?',
    options: ['Would you like to watch a movie tomorrow?', 'Did you watch the movie yesterday?', 'Which movie is good?', 'I love going to the cinema.'],
    level: 'N4'
  },
];

export default function ListeningPage() {
  const { addXP, updateSkillScore } = useAppStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [exerciseMode, setExerciseMode] = useState<'multiple_choice' | 'dictation'>('multiple_choice');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentEx = listeningData[currentIdx % listeningData.length];

  const handlePlayAudio = () => {
    speakJapanese(currentEx.japanese, playbackSpeed, 'friendly');
  };

  const handleOptionSelect = (opt: string) => {
    if (isSubmitted) return;
    setSelectedOption(opt);
    setIsSubmitted(true);

    const isCorrect = opt === currentEx.english;
    if (isCorrect) {
      playSound('correct');
      addXP(25);
      updateSkillScore('listening', 90);
    } else {
      playSound('incorrect');
    }
  };

  const handleDictationCheck = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const cleanUser = userInput.replace(/\s+/g, '').replace(/。/g, '');
    const cleanTarget = currentEx.japanese.replace(/\s+/g, '').replace(/。/g, '');

    const isCorrect = cleanUser === cleanTarget;
    if (isCorrect) {
      playSound('correct');
      addXP(35);
      updateSkillScore('listening', 95);
    } else {
      playSound('incorrect');
    }
  };

  const nextExercise = () => {
    setCurrentIdx(prev => prev + 1);
    setSelectedOption(null);
    setUserInput('');
    setIsSubmitted(false);
    setShowTranscript(false);
  };

  return (
    <div className="page-content">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Headphones size={24} color="var(--indigo-400)" /> Listening Practice — 聴解
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Listen to native female Japanese audio with speed controls & dictation exercises.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${exerciseMode === 'multiple_choice' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setExerciseMode('multiple_choice'); setIsSubmitted(false); }}
            >
              Listen & Choose
            </button>
            <button
              className={`btn ${exerciseMode === 'dictation' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setExerciseMode('dictation'); setIsSubmitted(false); }}
            >
              Dictation Mode ✍️
            </button>
          </div>
        </div>

        {/* Audio Player Card */}
        <motion.div
          key={currentEx.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Listening Exercise • {currentEx.level}
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--sakura-400)',
              background: 'rgba(230,49,85,0.12)',
              border: '1px solid rgba(230,49,85,0.25)',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              👩 Native Female Voice
            </span>
          </div>

          {/* Big Audio Play Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAudio}
            style={{
              width: 90, height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--sakura-500), var(--sakura-600))',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 24px rgba(230,49,85,0.4)',
            }}
          >
            <Volume2 size={40} />
          </motion.button>

          {/* Speed Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SPEED:</span>
            {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => { setPlaybackSpeed(speed); speakJapanese(currentEx.japanese, speed, 'friendly'); }}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: playbackSpeed === speed ? '1px solid var(--sakura-500)' : '1px solid var(--border-subtle)',
                  background: playbackSpeed === speed ? 'rgba(230,49,85,0.2)' : 'var(--bg-elevated)',
                  color: playbackSpeed === speed ? 'var(--sakura-400)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Transcript reveal button */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowTranscript(!showTranscript)}
            style={{ marginBottom: '1.5rem' }}
          >
            {showTranscript ? <EyeOff size={14} /> : <Eye size={14} />} {showTranscript ? 'Hide Transcript' : 'Reveal Transcript'}
          </button>

          {showTranscript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                marginBottom: '1.5rem',
                borderLeft: '4px solid var(--sakura-500)',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '1.25rem', fontFamily: 'Noto Sans JP', fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentEx.japanese}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
                {currentEx.reading}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--sakura-400)', fontWeight: 600 }}>
                {currentEx.english}
              </div>
            </motion.div>
          )}

          {/* Exercise Modes */}
          {exerciseMode === 'multiple_choice' ? (
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                What did you hear?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentEx.options.map((opt) => {
                  let btnClass = 'quiz-option';
                  if (isSubmitted) {
                    if (opt === currentEx.english) btnClass += ' correct';
                    else if (opt === selectedOption) btnClass += ' incorrect';
                    else btnClass += ' disabled';
                  }
                  return (
                    <button
                      key={opt}
                      className={btnClass}
                      onClick={() => handleOptionSelect(opt)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                Type the Japanese sentence you heard:
              </div>
              <input
                className="input"
                type="text"
                placeholder="日本語で入力..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{ fontSize: '1.1rem', fontFamily: 'Noto Sans JP', padding: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}
              />
              <button
                className="btn btn-primary"
                onClick={handleDictationCheck}
                disabled={!userInput.trim() || isSubmitted}
                style={{ width: '100%' }}
              >
                Check Dictation
              </button>
            </div>
          )}

          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '1.5rem' }}
            >
              <button className="btn btn-primary btn-lg" onClick={nextExercise} style={{ width: '100%' }}>
                Next Listening Challenge
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
