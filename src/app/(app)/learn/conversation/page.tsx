'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { JapaneseAudioButton } from '@/components/audio/JapaneseAudioButton';
import {
  Send, Loader2, RotateCcw, Volume2, Copy, Check, Eye, EyeOff, ChevronDown
} from 'lucide-react';

interface ChatMsg {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  reading?: string;
  english?: string;
  timestamp: number;
}

interface Scenario {
  id: string;
  title: string;
  character: string;
  kanjiName: string;
  emoji: string;
  badge: string;
  location: string;
  description: string;
  systemPrompt: string;
  initialMessage: { japanese: string; reading: string; english: string };
  quickReplies: string[];
}

const scenarios: Scenario[] = [
  {
    id: 'free',
    title: 'Free Chat',
    character: 'Sensei',
    kanjiName: '先生',
    emoji: '🎌',
    badge: 'AI Partner',
    location: 'Dojo · Online',
    description: 'Chat freely in Japanese about daily life, hobbies, or grammar.',
    systemPrompt: 'You are Sensei, a warm, patient Japanese conversation partner. Reply in natural conversational Japanese with furigana reading and English translation. Keep replies short (2-3 sentences).',
    initialMessage: {
      japanese: 'こんにちは！何でも日本語で話しましょう！何について話したいですか？',
      reading: 'Konnichiwa! Nandemo nihongo de hanashimashou! Nani ni tsuite hanashitai desu ka?',
      english: "Hello! Let's talk about anything in Japanese! What would you like to discuss?"
    },
    quickReplies: ['こんにちは！元気ですか？', '今日はいい天気ですね', '日本語の勉強はとても楽しいです', 'おすすめの日本食は何ですか？']
  },
  {
    id: 'conbini',
    title: 'Convenience Store',
    character: 'Sakura',
    kanjiName: 'サクラ',
    emoji: '🏪',
    badge: 'Roleplay',
    location: 'FamilyMart · Shibuya',
    description: 'Order food, ask to warm a bento, and pay with cash or Suica.',
    systemPrompt: 'You are Sakura, a friendly convenience store clerk in Tokyo. Stay in character. Reply in polite Japanese (keigo) with readings and English translations. Keep responses short (1-2 sentences).',
    initialMessage: {
      japanese: 'いらっしゃいませ！こちらのお弁当、温めますか？',
      reading: 'Irasshaimase! Kochira no obentou, atatamemasu ka?',
      english: 'Welcome! Would you like this bento warmed up?'
    },
    quickReplies: ['はい、温めてください', 'いいえ、そのままで大丈夫です', 'お箸を一膳ください', '袋はいりません']
  },
  {
    id: 'ramen',
    title: 'Ramen Bar',
    character: 'Haruto',
    kanjiName: 'ハルト',
    emoji: '🍜',
    badge: 'Roleplay',
    location: 'Shinjuku · Ramen Alley',
    description: 'Order ramen, customize noodle firmness, and request the check.',
    systemPrompt: 'You are Haruto, a passionate ramen master chef in Shinjuku. Be energetic and welcoming. Reply in authentic Japanese with readings and translations.',
    initialMessage: {
      japanese: 'へい、いらっしゃい！空いてるカウンター席へどうぞ！ご注文はお決まりですか？',
      reading: 'Hei, irasshai! Aiteru kauntaa-seki e douzo! Gochuumon wa okimari desu ka?',
      english: 'Welcome! Have a seat at the counter! Are you ready to order?'
    },
    quickReplies: ['醤油ラーメンをお願いします', '麺はかためで！', '味玉とチャーシューを追加できますか？', 'ごちそうさまでした！']
  },
  {
    id: 'station',
    title: 'Train Station',
    character: 'Yuki',
    kanjiName: 'ユキ',
    emoji: '🚆',
    badge: 'Roleplay',
    location: 'JR Shibuya · Station',
    description: 'Ask for directions, verify platform numbers, and purchase tickets.',
    systemPrompt: 'You are Yuki, a helpful train station attendant at Shibuya Station. Reply in polite, clear Japanese with English translations.',
    initialMessage: {
      japanese: 'いらっしゃいませ。駅員です。どちらまで行かれますか？',
      reading: 'Irasshaimase. Ekiin desu. Dochira made ikaremasu ka?',
      english: 'Welcome! I am the station attendant. Where would you like to travel today?'
    },
    quickReplies: ['東京駅まで行きたいです', '何番線に乗ればいいですか？', '乗り換えはありますか？', '切符はいくらですか？']
  },
  {
    id: 'cafe',
    title: 'Kyoto Tea House',
    character: 'Aoi',
    kanjiName: 'アオイ',
    emoji: '🍵',
    badge: 'Cultural',
    location: 'Gion · Kyoto',
    description: 'Order fresh matcha, pair it with wagashi, and enjoy tranquil conversation.',
    systemPrompt: 'You are Aoi, a serene traditional tea master in Kyoto. Reply in polite, elegant Japanese with readings and translations.',
    initialMessage: {
      japanese: 'いらっしゃいませ。京都宇治の抹茶はいかがですか？新茶が入っておりますよ。',
      reading: 'Irasshaimase. Kyouto Uji no matcha wa ikaga desu ka? Shincha ga haitte orimasu yo.',
      english: 'Welcome. How about some Kyoto Uji matcha? We have fresh first-harvest tea today.'
    },
    quickReplies: ['お抹茶をお願いします', 'おすすめの和菓子は何ですか？', '冷たい抹茶ラテはありますか？', '京都でおすすめの場所はありますか？']
  }
];

export default function ConversationPage() {
  const { addXP } = useAppStore();
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [showFurigana, setShowFurigana] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: scenarios[0].initialMessage.japanese,
      reading: scenarios[0].initialMessage.reading,
      english: scenarios[0].initialMessage.english,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const selectScenario = (sc: Scenario) => {
    setSelectedScenario(sc);
    setChatHistory([{
      id: `init-${Date.now()}`,
      sender: 'ai',
      text: sc.initialMessage.japanese,
      reading: sc.initialMessage.reading,
      english: sc.initialMessage.english,
      timestamp: Date.now()
    }]);
    setInput('');
    speakJapanese(sc.initialMessage.japanese);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (customText?: string) => {
    const text = (customText ?? input).trim();
    if (!text || isTyping) return;
    if (!customText) setInput('');

    const userMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    setChatHistory(prev => [...prev, userMsg]);
    speakJapanese(text);
    setIsTyping(true);

    try {
      const apiMessages = [
        { role: 'system' as const, content: selectedScenario.systemPrompt },
        ...chatHistory.map(m => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text + (m.english ? `\n(${m.english})` : '')
        })),
        { role: 'user' as const, content: text }
      ];

      const savedKey = typeof window !== 'undefined' ? localStorage.getItem('sensei_ai_key') || '' : '';
      const savedProvider = typeof window !== 'undefined' ? localStorage.getItem('sensei_ai_provider') || 'auto' : 'auto';

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          provider: savedProvider,
          apiKey: savedKey,
          scenario: selectedScenario.id
        })
      });

      const data = await res.json();

      if (data.success) {
        const responseText = data.text || '';
        let reading = '';
        let english = '';
        const lines = responseText.split('\n');
        for (const line of lines) {
          if (line.startsWith('(') && line.endsWith(')') && !english) {
            reading = line.replace(/^\(|\)$/g, '');
          } else if (line.startsWith('"') && line.endsWith('"') && !english) {
            english = line.replace(/^"|"$/g, '');
          }
        }

        const aiMsg: ChatMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: responseText,
          reading: reading || undefined,
          english: english || undefined,
          timestamp: Date.now()
        };
        setChatHistory(prev => [...prev, aiMsg]);

        if (data.japaneseAudio) {
          speakJapanese(data.japaneseAudio);
        } else {
          const jpMatch = responseText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g);
          if (jpMatch) speakJapanese(jpMatch.slice(0, 3).join('。'));
        }

        addXP(15);
        playSound('xp');
      } else {
        throw new Error(data.error || 'No response');
      }
    } catch {
      const errorMsg: ChatMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'すみません！接続エラーが発生しました。\n(Sumimasen! Setsuzoku eraa ga hassei shimashita.)\n\nOffline Sensei mode active — try the built-in AI Engine in Settings.',
        timestamp: Date.now()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setChatHistory([{
      id: `init-${Date.now()}`,
      sender: 'ai',
      text: selectedScenario.initialMessage.japanese,
      reading: selectedScenario.initialMessage.reading,
      english: selectedScenario.initialMessage.english,
      timestamp: Date.now()
    }]);
  };

  return (
    <div className="page-content chat-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="hanko-stamp">会話</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Dialogue Lab
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.1rem' }}>
            Roleplay real-world Japanese conversations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            className={`btn btn-sm ${showFurigana ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setShowFurigana(!showFurigana)}
            title="Toggle furigana"
            style={{ gap: '0.35rem', padding: '0.3rem 0.7rem' }}
          >
            {showFurigana ? <Eye size={13} /> : <EyeOff size={13} />}
            <span style={{ fontSize: '0.72rem' }}>ふり</span>
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={clearChat}
            title="Restart"
            style={{ color: 'var(--text-muted)' }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* ── Scenario Selector (Horizontal Scroll Pills) ── */}
      <div
        className="hide-scrollbar"
        style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.1rem', WebkitOverflowScrolling: 'touch' }}
      >
        {scenarios.map(sc => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => selectScenario(sc)}
              className={`pill-btn ${isSelected ? 'pill-btn-active' : 'pill-btn-idle'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span style={{ fontSize: '1rem' }}>{sc.emoji}</span>
              <span style={{ fontFamily: 'Noto Sans JP', fontSize: '0.72rem', fontWeight: 700 }}>{sc.character}</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Layout: Dossier + Chat ── */}
      <div className="layout-split-conversation" style={{ gap: '1rem' }}>
        
        {/* ── Character Dossier (desktop only) ── */}
        <div
          className="washi-card"
          style={{ padding: '1.1rem', display: 'none', flexDirection: 'column', gap: '1rem' }}
          id="conversation-dossier"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(217,49,83,0.1)',
              border: '1px solid rgba(217,49,83,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', flexShrink: 0
            }}>
              {selectedScenario.emoji}
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.2 }}>
                {selectedScenario.character}
              </div>
              <div style={{ fontFamily: 'Noto Sans JP', fontSize: '0.72rem', color: 'var(--sakura-400)', fontWeight: 700 }}>
                {selectedScenario.kanjiName}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {selectedScenario.location}
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            padding: '0.7rem 0.85rem',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            {selectedScenario.description}
          </div>

          <div style={{
            background: 'rgba(217,49,83,0.05)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.8rem',
            border: '1px solid rgba(217,49,83,0.12)',
            fontSize: '0.73rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55
          }}>
            💡 <strong style={{ color: 'var(--text-secondary)' }}>Pro Tip:</strong> Tap any bubble to hear native pronunciation. Use quick replies or type in Japanese/Romaji.
          </div>
        </div>

        {/* ── Chat Shell ── */}
        <div className="mobile-chat-shell">
          
          {/* Character Header Bar */}
          <div style={{
            padding: '0.7rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: 'rgba(217,49,83,0.1)',
                border: '1px solid rgba(217,49,83,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', flexShrink: 0
              }}>
                {selectedScenario.emoji}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.2 }}>
                  {selectedScenario.character}{' '}
                  <span style={{ fontFamily: 'Noto Sans JP', fontSize: '0.7rem', color: 'var(--sakura-400)' }}>
                    {selectedScenario.kanjiName}
                  </span>
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                  {selectedScenario.location} •{' '}
                  <span style={{ color: 'var(--matcha-400)' }}>● Online</span>
                </div>
              </div>
            </div>
            <span className="badge badge-n5" style={{ fontSize: '0.62rem' }}>
              {selectedScenario.badge}
            </span>
          </div>

          {/* Messages Feed */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem',
            WebkitOverflowScrolling: 'touch'
          }}>
            {chatHistory.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: isUser ? '82%' : '88%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <div
                    className={isUser ? 'msg-bubble-user' : 'msg-bubble-ai'}
                    onClick={() => {
                      const jpMatch = msg.text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g);
                      speakJapanese(jpMatch ? jpMatch.join('。') : msg.text);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Japanese text */}
                    <div style={{
                      fontSize: '1rem',
                      fontFamily: 'Noto Sans JP, sans-serif',
                      fontWeight: 600,
                      lineHeight: 1.65,
                      whiteSpace: 'pre-line',
                      color: isUser ? '#ffffff' : 'var(--text-primary)'
                    }}>
                      {msg.text}
                    </div>

                    {/* Furigana reading */}
                    {showFurigana && msg.reading && (
                      <div style={{
                        fontSize: '0.72rem',
                        color: isUser ? 'rgba(255,255,255,0.8)' : 'var(--sakura-400)',
                        marginTop: '0.22rem',
                        fontWeight: 600,
                        lineHeight: 1.4
                      }}>
                        {msg.reading}
                      </div>
                    )}

                    {/* English subtitle */}
                    {msg.english && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
                        marginTop: '0.28rem',
                        borderTop: isUser ? '1px solid rgba(255,255,255,0.18)' : '1px solid var(--border-subtle)',
                        paddingTop: '0.28rem',
                        fontStyle: 'italic',
                        lineHeight: 1.45
                      }}>
                        {msg.english}
                      </div>
                    )}
                  </div>

                  {/* Message actions */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    paddingInline: '0.25rem'
                  }}>
                    <button
                      onClick={() => {
                        const jpMatch = msg.text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g);
                        speakJapanese(jpMatch ? jpMatch.join('。') : msg.text);
                      }}
                      style={{
                        background: 'transparent', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        padding: '0.15rem', display: 'flex', alignItems: 'center',
                        gap: '0.2rem', fontSize: '0.65rem'
                      }}
                    >
                      <Volume2 size={12} />
                    </button>
                    <button
                      onClick={() => copyMessage(msg.id, msg.text)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: copiedId === msg.id ? 'var(--matcha-400)' : 'var(--text-muted)',
                        cursor: 'pointer', padding: '0.15rem',
                        display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem'
                      }}
                    >
                      {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing indicator */}
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
                <span>{selectedScenario.character} is replying…</span>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies Bar */}
          <div
            className="hide-scrollbar"
            style={{
              padding: '0.45rem 0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              display: 'flex', gap: '0.4rem',
              overflowX: 'auto', flexShrink: 0,
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {selectedScenario.quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSend(reply)}
                disabled={isTyping}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.72rem',
                  fontFamily: 'Noto Sans JP, sans-serif',
                  fontWeight: 700,
                  color: 'var(--sakura-400)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  opacity: isTyping ? 0.5 : 1
                }}
              >
                {reply}
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
              ref={inputRef}
              className="input"
              type="text"
              placeholder="日本語で書いてください… (Romaji ok)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              autoComplete="off"
              autoCorrect="off"
              style={{
                flex: 1,
                fontSize: '0.9rem',
                fontFamily: 'Noto Sans JP, sans-serif',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-lg)',
                minHeight: 44,
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
      </div>
    </div>
  );
}
