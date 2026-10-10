'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { JapaneseAudioButton } from '@/components/audio/JapaneseAudioButton';
import {
  Send, Volume2, SlidersHorizontal, Check, CheckCircle2, AlertCircle,
  Copy, Loader2, X, Key, RotateCcw
} from 'lucide-react';

interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  provider?: string;
  correction?: {
    incorrect: string;
    correct: string;
    explanation: string;
  };
  suggestions?: string[];
  japaneseAudio?: string;
  timestamp: number;
}

const INITIAL_MESSAGE: TutorMessage = {
  id: 'init-1',
  sender: 'tutor',
  text: `こんにちは！(Konnichiwa!) I am **Sensei (先生)**, your Japanese Language Master! 🌸\n\nI can help you with:\n• **Grammar Explanations** — particles は vs が, verb conjugations\n• **Sentence Corrections** — submit any Japanese sentence to polish\n• **Vocabulary Nuances** — keigo forms, word origins, colloquial usage\n• **JLPT N5–N1 Exam Prep** with authentic practice questions\n\nWhat would you like to explore today?`,
  suggestions: [
    'Explain は vs が',
    'Check: 私は昨日映画を見ます',
    'How to say "Where is the station?"',
    'Give me an N5 practice challenge'
  ],
  provider: 'Sensei AI Engine (Free Built-in)',
  timestamp: 1700000000000
};

function FormattedSenseiText({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="sensei-prose">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: '0.35rem' }} />;

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} style={{ color: 'var(--text-primary)', marginTop: '0.45rem', marginBottom: '0.2rem', fontSize: '0.97rem', fontWeight: 800 }}>
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[•\-*]\s+/, '');
          return (
            <div key={i} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.25rem', paddingLeft: '0.15rem' }}>
              <span style={{ color: 'var(--sakura-400)', fontWeight: 900, flexShrink: 0 }}>•</span>
              <div>{renderFormattedSpans(content)}</div>
            </div>
          );
        }

        return <p key={i} style={{ margin: '0.18rem 0' }}>{renderFormattedSpans(trimmed)}</p>;
      })}
    </div>
  );
}

function renderFormattedSpans(str: string) {
  const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} style={{ color: 'var(--sakura-400)', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx} style={{ color: 'var(--gold-400)', fontStyle: 'italic' }}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} style={{ background: 'rgba(255,255,255,0.07)', padding: '0.1rem 0.35rem', borderRadius: 4, color: '#67e8f9', fontSize: '0.83em' }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function TutorPage() {
  const { addXP } = useAppStore();
  const [messages, setMessages] = useState<TutorMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [provider, setProvider] = useState<'auto' | 'gemini' | 'groq' | 'openrouter' | 'sensei'>('auto');
  const [apiKey, setApiKey] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySavedNotice, setKeySavedNotice] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedProvider = localStorage.getItem('sensei_ai_provider');
      const savedKey = localStorage.getItem('sensei_ai_key');
      const savedChat = localStorage.getItem('sensei_chat_history');
      if (savedProvider) setProvider(savedProvider as any);
      if (savedKey) setApiKey(savedKey);
      if (savedChat) {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      try { localStorage.setItem('sensei_chat_history', JSON.stringify(messages.slice(-30))); }
      catch { /* noop */ }
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const saveSettings = () => {
    setIsSavingKey(true);
    try {
      localStorage.setItem('sensei_ai_provider', provider);
      localStorage.setItem('sensei_ai_key', apiKey.trim());
      setKeySavedNotice(true);
      setTimeout(() => setKeySavedNotice(false), 2000);
    } catch { /* noop */ }
    finally { setIsSavingKey(false); }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }], provider, apiKey: apiKey.trim() })
      });
      const data = await res.json();
      setConnectionStatus(data.success ? 'success' : 'failed');
    } catch { setConnectionStatus('failed'); }
  };

  const clearChat = () => {
    if (confirm('Clear chat history with Sensei?')) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('sensei_chat_history');
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText ?? input).trim();
    if (!textToSend || isTyping) return;
    if (!customText) setInput('');

    const userMsg: TutorMessage = { id: `user-${Date.now()}`, sender: 'user', text: textToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const apiMessages = [
        ...messages.map(m => ({ role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant', content: m.text })),
        { role: 'user' as const, content: textToSend }
      ];

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, provider, apiKey: apiKey.trim() })
      });

      const data = await res.json();

      if (data.success) {
        const tutorMsg: TutorMessage = {
          id: `tutor-${Date.now()}`,
          sender: 'tutor',
          text: data.text,
          provider: data.provider,
          correction: data.correction,
          suggestions: data.suggestions,
          japaneseAudio: data.japaneseAudio,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, tutorMsg]);
        if (data.japaneseAudio) speakJapanese(data.japaneseAudio);
        addXP(15);
        playSound('xp');
      } else {
        throw new Error(data.error || 'No response');
      }
    } catch (err: unknown) {
      const errorMsg: TutorMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: `申し訳ありません！(Moushiwake arimasen!)\n\nConnection error. Switch to the free built-in Sensei Engine in AI Settings anytime.\n\nDetails: ${(err as Error).message}`,
        provider: 'System',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally { setIsTyping(false); }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakMessage = (msg: TutorMessage) => {
    if (msg.japaneseAudio) { speakJapanese(msg.japaneseAudio); return; }
    const jpMatch = msg.text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g);
    if (jpMatch) speakJapanese(jpMatch.slice(0, 4).join('。'));
    else speakJapanese(msg.text);
  };

  return (
    <div className="page-content chat-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="hanko-stamp">指導</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Sensei AI Tutor
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.1rem' }}>
            Grammar corrections, particle deep-dives, and JLPT guidance
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSettingsModal(true)}
            style={{ gap: '0.3rem', padding: '0.35rem 0.75rem' }}
          >
            <SlidersHorizontal size={13} color="var(--sakura-400)" />
            <span style={{ fontSize: '0.72rem' }}>AI Engine</span>
          </button>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={clearChat} title="Clear chat" style={{ color: 'var(--text-muted)' }}>
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* ── Chat Shell ── */}
      <div className="mobile-chat-shell">

        {/* Messages Stream */}
        <div style={{
          flex: 1, padding: '1rem', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          WebkitOverflowScrolling: 'touch'
        }}>
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18 }}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: isUser ? '82%' : '92%',
                  display: 'flex', flexDirection: 'column', gap: '0.25rem'
                }}
              >
                <div className={isUser ? 'msg-bubble-user' : 'msg-bubble-ai'}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: isUser ? 'rgba(255,255,255,0.8)' : 'var(--sakura-400)' }}>
                      {isUser ? 'You' : 'Sensei 先生'}
                    </span>
                    {!isUser && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => speakMessage(msg)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                        >
                          <Volume2 size={13} />
                        </button>
                        <button
                          onClick={() => copyText(msg.id, msg.text)}
                          style={{ background: 'transparent', border: 'none', color: copiedId === msg.id ? 'var(--matcha-400)' : 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                        >
                          {copiedId === msg.id ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Message body */}
                  {isUser ? (
                    <div style={{ fontSize: '0.93rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {msg.text}
                    </div>
                  ) : (
                    <FormattedSenseiText text={msg.text} />
                  )}

                  {/* Correction card */}
                  {msg.correction && (
                    <div style={{
                      marginTop: '0.7rem',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.7rem 0.85rem'
                    }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem', letterSpacing: '0.06em' }}>
                        添削 · CORRECTION
                      </div>
                      <div style={{ color: '#f87171', textDecoration: 'line-through', fontWeight: 700, fontSize: '0.85rem' }}>
                        ❌ {msg.correction.incorrect}
                      </div>
                      <div style={{ color: 'var(--matcha-400)', fontWeight: 800, marginTop: '0.18rem', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>✅ {msg.correction.correct}</span>
                        <JapaneseAudioButton text={msg.correction.correct} size="sm" variant="icon" />
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.3rem', lineHeight: 1.5 }}>
                        💡 {msg.correction.explanation}
                      </div>
                    </div>
                  )}
                </div>

                {/* Provider attribution */}
                {msg.provider && !isUser && (
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', paddingLeft: '0.5rem' }}>
                    via {msg.provider}
                  </div>
                )}

                {/* Dynamic suggestion chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', padding: '0.1rem 0' }}>
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        disabled={isTyping}
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-full)',
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.7rem',
                          color: 'var(--sakura-400)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s',
                          flexShrink: 0
                        }}
                      >
                        💬 {sug}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px 18px 18px 4px',
                padding: '0.65rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: 'var(--text-muted)', fontSize: '0.78rem'
              }}
            >
              <Loader2 size={13} className="animate-spin" color="var(--sakura-400)" />
              <span>Sensei is reviewing…</span>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Start Chips */}
        <div
          className="hide-scrollbar"
          style={{
            padding: '0.4rem 0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex', gap: '0.35rem',
            overflowX: 'auto', flexShrink: 0,
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {[
            'Explain は vs が',
            'Explain に vs で',
            'How to conjugate て-form?',
            'Give me N5 challenge',
            'Check: 私はアメリカに住んでいます'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.28rem 0.65rem',
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s', flexShrink: 0
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Dock */}
        <div style={{
          padding: '0.65rem 0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-elevated)',
          display: 'flex', gap: '0.45rem', alignItems: 'center', flexShrink: 0,
          paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0px))'
        }}>
          <input
            className="input"
            type="text"
            placeholder="Ask Sensei grammar, submit a sentence to check…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            autoComplete="off"
            style={{
              fontSize: '0.9rem', padding: '0.65rem 0.9rem', flex: 1,
              borderRadius: 'var(--radius-lg)', minHeight: 44,
              background: 'var(--bg-card)'
            }}
          />
          <button
            className="btn btn-primary btn-icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', flexShrink: 0 }}
            aria-label="Send"
          >
            {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>

      {/* ── AI Settings Modal ── */}
      <AnimatePresence>
        {showSettingsModal && (
          <div
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.75)',
              zIndex: 100, display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)'
            }}
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="washi-card"
              style={{
                width: '100%', maxWidth: 480,
                padding: '1.5rem',
                maxHeight: '92vh', overflowY: 'auto',
                borderRadius: '24px 24px var(--radius-lg) var(--radius-lg)'
              }}
            >
              {/* Modal handle bar */}
              <div style={{ width: 36, height: 4, background: 'var(--border-medium)', borderRadius: 9999, margin: '-0.5rem auto 1rem' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key size={16} color="var(--sakura-400)" /> AI Engine Settings
                </h3>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowSettingsModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.55 }}>
                Choose the built-in offline engine or connect your free Gemini / Groq API key for full generative power.
              </p>

              {/* Provider options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
                {[
                  { id: 'auto', title: '⚡ Built-in Sensei Engine', desc: '100% free, zero-latency, works offline.' },
                  { id: 'gemini', title: '✨ Google Gemini 1.5 Flash', desc: 'Free Google AI Studio key. High accuracy.' },
                  { id: 'groq', title: '🚀 Groq — Llama 3.3 70B', desc: 'Ultra-fast inference, free developer tier.' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProvider(item.id as any)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: provider === item.id ? 'rgba(217,49,83,0.1)' : 'var(--bg-elevated)',
                      border: `1.5px solid ${provider === item.id ? 'var(--sakura-500)' : 'var(--border-subtle)'}`,
                      color: 'var(--text-primary)',
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.84rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* API Key input */}
              {provider !== 'auto' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    API Key (stored locally):
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="password"
                      className="input"
                      placeholder={provider === 'gemini' ? 'AIzaSy...' : 'gsk_...'}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={testConnection}
                      disabled={connectionStatus === 'testing' || !apiKey.trim()}
                      style={{ flexShrink: 0 }}
                    >
                      {connectionStatus === 'testing' ? <Loader2 size={13} className="animate-spin" /> : 'Test'}
                    </button>
                  </div>
                  {connectionStatus === 'success' && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--matcha-400)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={12} /> Connected!
                    </div>
                  )}
                  {connectionStatus === 'failed' && (
                    <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={12} /> Failed. Verify key or use built-in engine.
                    </div>
                  )}
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={() => { saveSettings(); setShowSettingsModal(false); }}
                style={{ width: '100%' }}
              >
                {keySavedNotice ? <><Check size={14} /> Saved!</> : 'Save & Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
