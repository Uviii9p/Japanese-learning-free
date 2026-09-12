'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import {
  MessageCircle, Send, Sparkles, User, Bot, Volume2,
  Settings, Key, Check, ExternalLink, RotateCcw,
  BookOpen, HelpCircle, CheckCircle2, AlertCircle, Copy, Loader2
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
  text: `こんにちは！(Konnichiwa!) I am **Sensei (先生)**, your AI Japanese Language Tutor! 🌸\n\nI can help you with:\n• **Grammar explanations** (particles like は vs が, に vs で, verb conjugations)\n• **Sentence corrections** (send me any Japanese sentence to check for mistakes)\n• **Translations** ("How do I say [phrase] in Japanese?")\n• **JLPT practice & challenges**!\n\nWhat would you like to study today?`,
  suggestions: [
    'Explain は vs が',
    'How to say "Where is the station?"',
    'Check: 私は昨日映画を見ます',
    'Give me an N5 practice challenge'
  ],
  provider: 'Sensei AI Engine (Free Built-in)',
  timestamp: Date.now()
};

export default function TutorPage() {
  const { addXP } = useAppStore();
  const [messages, setMessages] = useState<TutorMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Configuration States
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState<'auto' | 'gemini' | 'groq' | 'openrouter' | 'sensei'>('auto');
  const [apiKey, setApiKey] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySavedNotice, setKeySavedNotice] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load saved settings & messages from localStorage on mount
  useEffect(() => {
    try {
      const savedProvider = localStorage.getItem('sensei_ai_provider');
      const savedKey = localStorage.getItem('sensei_ai_key');
      const savedChat = localStorage.getItem('sensei_chat_history');

      if (savedProvider) setProvider(savedProvider as any);
      if (savedKey) setApiKey(savedKey);
      if (savedChat) {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save chat to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem('sensei_chat_history', JSON.stringify(messages.slice(-30)));
      } catch {
        // Ignore quota errors
      }
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const saveSettings = () => {
    setIsSavingKey(true);
    try {
      localStorage.setItem('sensei_ai_provider', provider);
      localStorage.setItem('sensei_ai_key', apiKey.trim());
      setKeySavedNotice(true);
      setTimeout(() => setKeySavedNotice(false), 2500);
    } catch {
      // ignore
    } finally {
      setIsSavingKey(false);
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'hello' }],
          provider,
          apiKey: apiKey.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('failed');
      }
    } catch {
      setConnectionStatus('failed');
    }
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

    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Prepare history for API
      const apiMessages = newMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          provider,
          apiKey: apiKey.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        const tutorReply: TutorMessage = {
          id: `tutor-${Date.now()}`,
          sender: 'tutor',
          text: data.text,
          provider: data.provider,
          correction: data.correction,
          suggestions: data.suggestions,
          japaneseAudio: data.japaneseAudio,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, tutorReply]);
        addXP(10);
        playSound('xp');

        // If response has audio or mistake correction, trigger speech optionally
        if (data.japaneseAudio) {
          speakJapanese(data.japaneseAudio);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err: unknown) {
      const errorReply: TutorMessage = {
        id: `tutor-err-${Date.now()}`,
        sender: 'tutor',
        text: `申し訳ありません (I apologize)! I encountered a temporary connection issue: ${(err as Error).message}\n\nPlease try again or verify your settings.`,
        provider: 'System',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to extract Japanese speech snippet from tutor text
  const speakMessage = (msg: TutorMessage) => {
    if (msg.japaneseAudio) {
      speakJapanese(msg.japaneseAudio);
      return;
    }
    if (msg.correction) {
      speakJapanese(msg.correction.correct);
      return;
    }
    // Find Japanese characters in the message
    const jpMatch = msg.text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g);
    if (jpMatch && jpMatch.length > 0) {
      speakJapanese(jpMatch.join(' '));
    } else {
      speakJapanese('こんにちは！');
    }
  };

  return (
    <div className="page-content">
      <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', minHeight: 520 }}>
        
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={26} color="var(--sakura-400)" /> AI Japanese Tutor — Sensei
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: apiKey ? 'var(--gold-400)' : 'var(--sakura-400)',
                background: apiKey ? 'rgba(245,158,11,0.12)' : 'rgba(230,49,85,0.12)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                border: apiKey ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(230,49,85,0.25)'
              }}>
                <Sparkles size={12} />
                {apiKey
                  ? (provider === 'gemini' || apiKey.startsWith('AIza') ? 'Gemini 1.5/2.0 Flash (Free Tier)' : 'Groq Llama 3 (Free Tier)')
                  : 'Sensei AI Engine (Free Built-in)'
                }
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                • Interactive Corrections & Audio
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={clearChat}
              title="Clear conversation"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={14} /> Clear
            </button>
            <button
              className={`btn ${showSettings ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setShowSettings(!showSettings)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Settings size={14} /> AI Settings
            </button>
          </div>
        </div>

        {/* AI Settings Drawer / Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Key size={16} color="var(--sakura-400)" /> AI Provider & Free API Key
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Stored securely in your local browser
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setProvider('auto')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: provider === 'auto' ? 'rgba(230,49,85,0.15)' : 'var(--bg-elevated)',
                    border: `1px solid ${provider === 'auto' ? 'var(--sakura-500)' : 'var(--border-subtle)'}`,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>⚡ Auto-Detect / Built-in</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Zero-config, fast, 100% free offline Sensei</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('gemini')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: provider === 'gemini' ? 'rgba(230,49,85,0.15)' : 'var(--bg-elevated)',
                    border: `1px solid ${provider === 'gemini' ? 'var(--sakura-500)' : 'var(--border-subtle)'}`,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>✨ Google Gemini (Free)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>15 req/min free from Google AI Studio</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('groq')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: provider === 'groq' ? 'rgba(230,49,85,0.15)' : 'var(--bg-elevated)',
                    border: `1px solid ${provider === 'groq' ? 'var(--sakura-500)' : 'var(--border-subtle)'}`,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>🚀 Groq / Llama 3 (Free)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Blazing fast, 100% free tier</div>
                </button>
              </div>

              {/* Key Input */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="password"
                  className="input"
                  placeholder="Paste your free API key here (e.g. AIzaSy... or gsk_...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ flex: 1, minWidth: 240, fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={saveSettings}
                  disabled={isSavingKey}
                >
                  {keySavedNotice ? <><Check size={14} /> Saved!</> : 'Save Key'}
                </button>
                {apiKey && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={testConnection}
                    disabled={connectionStatus === 'testing'}
                  >
                    {connectionStatus === 'testing' ? <Loader2 size={14} className="animate-spin" /> : 'Test'}
                  </button>
                )}
              </div>

              {connectionStatus === 'success' && (
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={14} /> Connected successfully to Cloud AI!
                </div>
              )}
              {connectionStatus === 'failed' && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={14} /> Connection test failed. Check key or use built-in engine.
                </div>
              )}

              {/* Free Key Info Links */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Get a free key (no credit card):</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--sakura-400)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  Google AI Studio <ExternalLink size={11} />
                </a>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--sakura-400)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  Groq Console <ExternalLink size={11} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages Feed */}
        <div
          className="tutor-chat-container"
          style={{
            flex: 1,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-lg)',
            minHeight: 280,
          }}
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div
                style={{
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, var(--sakura-500), var(--sakura-600))'
                    : 'var(--bg-elevated)',
                  color: 'white',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '1rem 1.25rem',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Header of message */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--sakura-400)' }}>
                    {msg.sender === 'user' ? 'You' : 'Sensei 先生'}
                  </span>
                  {msg.sender === 'tutor' && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => speakMessage(msg)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Pronounce Japanese"
                      >
                        <Volume2 size={15} />
                      </button>
                      <button
                        onClick={() => copyText(msg.id, msg.text)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedId === msg.id ? '#10b981' : 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Body text */}
                <div style={{ fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line', color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)' }}>
                  {msg.text}
                </div>

                {/* Structured Mistake Correction Card */}
                {msg.correction && (
                  <div style={{
                    marginTop: '0.85rem',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.85rem 1rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                      GRAMMAR CORRECTION
                    </div>
                    <div style={{ color: '#ef4444', textDecoration: 'line-through', fontWeight: 700, fontSize: '0.9rem' }}>
                      ❌ {msg.correction.incorrect}
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 800, marginTop: '0.25rem', fontSize: '0.95rem' }}>
                      ✅ {msg.correction.correct}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem' }}>
                      💡 {msg.correction.explanation}
                    </div>
                  </div>
                )}
              </div>

              {/* Provider attribution badge */}
              {msg.provider && (
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', paddingLeft: '0.5rem' }}>
                  Via {msg.provider}
                </div>
              )}

              {/* Follow-up Suggestion Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  {msg.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      disabled={isTyping}
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.3rem 0.7rem',
                        fontSize: '0.75rem',
                        color: 'var(--sakura-400)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--sakura-500)';
                        e.currentTarget.style.background = 'rgba(230,49,85,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.background = 'var(--bg-elevated)';
                      }}
                    >
                      💬 {sug}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px 18px 18px 4px',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}
            >
              <Loader2 size={16} className="animate-spin" color="var(--sakura-400)" />
              <span>Sensei is thinking...</span>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Starter Chips */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}>
          {[
            'Explain は vs が',
            'Explain に vs で',
            'How to use て-form?',
            'How to say "Thank you"?',
            'Give me an N5 challenge'
          ].map((prompt, i) => (
            <button
              key={i}
              className="btn btn-secondary btn-sm"
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
              style={{
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', alignItems: 'center' }}>
          <input
            className="input"
            type="text"
            placeholder="Ask Sensei grammar, translations, or send a Japanese sentence..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            style={{
              fontSize: '0.95rem',
              padding: '0.85rem 1rem',
              flex: 1,
              borderRadius: 'var(--radius-lg)'
            }}
          />
          <button
            className="btn btn-primary btn-icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', flexShrink: 0 }}
            aria-label="Send message"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
}
