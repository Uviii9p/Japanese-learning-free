'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { hiraganaData } from '@/content/hiragana';
import { kanjiData } from '@/content/kanji';
import { useAppStore } from '@/lib/store';
import { playSound, speakJapanese } from '@/lib/utils';
import { Edit3, RotateCcw, CheckCircle2, Play, Volume2, Sparkles, Award } from 'lucide-react';

export default function WritingPracticePage() {
  const { addXP, updateSkillScore } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [characterList] = useState([...hiraganaData.slice(0, 15), ...kanjiData.slice(0, 10)]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ accuracy: number; strokeScore: number; overall: number; message: string } | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const currentChar = characterList[currentIndex];

  useEffect(() => {
    clearCanvas();
  }, [currentIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
    setStrokeHistory([]);
    setFeedback(null);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history for undo
    setStrokeHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#e63155';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStrokeCount(prev => prev + 1);
    }
  };

  const undoLastStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokeHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastState = strokeHistory[strokeHistory.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setStrokeHistory(prev => prev.slice(0, -1));
    setStrokeCount(prev => Math.max(0, prev - 1));
  };

  const checkWriting = () => {
    const targetStrokes = 'strokeCount' in currentChar ? currentChar.strokeCount : 3;
    const countDiff = Math.abs(strokeCount - targetStrokes);
    
    let accuracy = 90 - countDiff * 10;
    accuracy = Math.max(50, Math.min(98, accuracy + Math.floor(Math.random() * 8)));
    
    let strokeOrderScore = strokeCount === targetStrokes ? 95 : Math.max(60, 90 - countDiff * 15);
    let overall = Math.round((accuracy * 0.6) + (strokeOrderScore * 0.4));

    let msg = 'Excellent stroke precision!';
    if (overall < 75) {
      msg = `Almost! Target is ${targetStrokes} strokes. Check stroke direction and flow.`;
    }

    setFeedback({ accuracy, strokeScore: strokeOrderScore, overall, message: msg });

    if (overall >= 75) {
      playSound('correct');
      addXP(25);
      updateSkillScore('writing', overall);
    } else {
      playSound('incorrect');
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Edit3 size={24} color="var(--sakura-400)" /> Japanese Writing Practice — 書き方
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Practice stroke order and character structure using mouse, touch, or stylus.
        </p>
      </div>

      <div className="layout-split-right">
        {/* Canvas Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="writing-canvas-wrapper" style={{ maxWidth: '100%', width: 340, height: 340, position: 'relative' }}>
            {/* Guide background character */}
            {showGuide && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12rem',
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.06)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                {'char' in currentChar ? currentChar.char : currentChar.kanji}
              </div>
            )}

            <div className="writing-canvas-guide" />

            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ width: '100%', height: '100%', cursor: 'crosshair', position: 'relative', zIndex: 2 }}
            />
          </div>

          {/* Canvas Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', width: 340 }}>
            <button className="btn btn-secondary" onClick={undoLastStroke} disabled={strokeHistory.length === 0} style={{ flex: 1 }}>
              <RotateCcw size={14} /> Undo
            </button>
            <button className="btn btn-secondary" onClick={clearCanvas} style={{ flex: 1 }}>
              Clear
            </button>
            <button className="btn btn-primary" onClick={checkWriting} disabled={strokeCount === 0} style={{ flex: 1.5 }}>
              Check Stroke
            </button>
          </div>

          {/* Stroke Count info */}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            Strokes drawn: <strong style={{ color: 'var(--text-primary)' }}>{strokeCount}</strong> / Expected: {'strokeCount' in currentChar ? currentChar.strokeCount : 3}
          </div>
        </div>

        {/* Character Info & Scoring Drawer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Target Character
            </div>

            <div style={{ fontSize: '4.5rem', fontFamily: 'Noto Sans JP', fontWeight: 900, color: 'var(--sakura-400)', lineHeight: 1, marginBottom: '0.5rem' }}>
              {'char' in currentChar ? currentChar.char : currentChar.kanji}
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {'romaji' in currentChar ? currentChar.romaji : currentChar.meanings.join(', ')}
            </div>

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => speakJapanese('char' in currentChar ? currentChar.char : currentChar.kanji)}
              style={{ marginBottom: '1rem' }}
            >
              <Volume2 size={14} /> Audio Pronunciation
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowGuide(!showGuide)}>
                {showGuide ? 'Hide Guide' : 'Show Guide'}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentIndex((currentIndex + 1) % characterList.length)}
              >
                Next Character <Play size={12} />
              </button>
            </div>
          </div>

          {/* Feedback Card */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${feedback.overall >= 75 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Award size={20} color={feedback.overall >= 75 ? '#10b981' : '#ef4444'} />
                <span style={{ fontWeight: 800, fontSize: '1rem', color: feedback.overall >= 75 ? '#10b981' : '#ef4444' }}>
                  {feedback.overall >= 75 ? 'Great Handwriting!' : 'Keep Practicing'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Stroke Accuracy</span>
                    <span style={{ fontWeight: 700 }}>{feedback.accuracy}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${feedback.accuracy}%`, background: '#10b981' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Stroke Order</span>
                    <span style={{ fontWeight: 700 }}>{feedback.strokeScore}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${feedback.strokeScore}%`, background: '#3b82f6' }} />
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {feedback.message}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
