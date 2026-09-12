'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { speakJapanese, playSound } from '@/lib/utils';
import { MessageCircle, Volume2, Send, Sparkles, Loader2, RotateCcw, Zap } from 'lucide-react';

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
  avatar: string;
  location: string;
  description: string;
  systemPrompt: string;
  initialMessage: { japanese: string; reading: string; english: string };
  quickReplies: string[];
}

const scenarios: Scenario[] = [
  {
    id: 'free',
    title: 'Free Chat (フリー会話)',
    character: 'Sensei (先生)',
    avatar: '🎌',
    location: 'Anywhere',
    description: 'Chat freely in Japanese about anything. Sensei will respond naturally and help with corrections.',
    systemPrompt: 'You are a friendly Japanese conversation partner. Reply primarily in Japanese (with furigana readings in parentheses) and add short English translations. If the user makes mistakes, gently correct them. Keep responses short and conversational (2-4 sentences). Always respond naturally as if having a real conversation.',
    initialMessage: {
      japanese: 'こんにちは！何でも日本語で話しましょう！何について話したいですか？ 😊',
      reading: 'Konnichiwa! Nandemo nihongo de hanashimashou! Nani ni tsuite hanashitai desu ka?',
      english: 'Hello! Let\'s talk about anything in Japanese! What would you like to talk about?'
    },
    quickReplies: ['こんにちは！元気ですか？', '今日は何をしましたか？', '日本語の勉強は楽しいです', '好きな食べ物は何ですか？']
  },
  {
    id: 'conbini',
    title: 'Convenience Store (コンビニ)',
    character: 'Sakura (サクラ)',
    avatar: '👩',
    location: 'FamilyMart Tokyo',
    description: 'Order food and pay at a Japanese convenience store.',
    systemPrompt: 'You are Sakura, a friendly convenience store clerk in Tokyo. Stay in character. Reply in Japanese with readings and English translations. Keep responses short (1-3 sentences). Guide the customer through ordering, paying, and receiving change. Use polite keigo (敬語).',
    initialMessage: {
      japanese: 'いらっしゃいませ！温めますか？',
      reading: 'Irasshaimase! Atatame masu ka?',
      english: 'Welcome! Would you like this warmed up?'
    },
    quickReplies: ['はい、お願いします', 'いいえ、大丈夫です', 'お箸をください', '袋はいりません']
  },
  {
    id: 'ramen',
    title: 'Ramen Shop (ラーメン屋)',
    character: 'Haruto (ハルト)',
    avatar: '👨‍🍳',
    location: 'Ramen Shop Shinjuku',
    description: 'Order ramen and customize your bowl.',
    systemPrompt: 'You are Haruto, a passionate ramen shop chef in Shinjuku. Stay in character. Reply in Japanese with readings and English translations. Keep responses short (1-3 sentences). Help the customer choose their ramen type, toppings, and noodle firmness. Be enthusiastic about ramen!',
    initialMessage: {
      japanese: 'ご注文はお決まりですか？うちの醤油ラーメンは最高ですよ！',
      reading: 'Gochuumon wa okimari desu ka? Uchi no shouyu raamen wa saikou desu yo!',
      english: 'Are you ready to order? Our soy sauce ramen is the best!'
    },
    quickReplies: ['醤油ラーメンをください', '味噌ラーメンにします', '麺は固めでお願いします', 'チャーシュー追加できますか？']
  },
  {
    id: 'station',
    title: 'Train Station (駅)',
    character: 'Yuki (ユキ)',
    avatar: '👩‍✈️',
    location: 'Shibuya Station',
    description: 'Ask for directions and buy train tickets.',
    systemPrompt: 'You are Yuki, a helpful station attendant at Shibuya Station. Stay in character. Reply in Japanese with readings and English translations. Keep responses short (1-3 sentences). Help the customer buy tickets, find platforms, and navigate the station. Be polite and helpful.',
    initialMessage: {
      japanese: 'いらっしゃいませ。どちらまで行かれますか？',
      reading: 'Irasshaimase. Dochira made ikaremasu ka?',
      english: 'Welcome. Where would you like to go?'
    },
    quickReplies: ['東京駅までお願いします', '切符はいくらですか？', '何番線ですか？', '乗り換えはありますか？']
  },
  {
    id: 'cafe',
    title: 'Japanese Café (喫茶店)',
    character: 'Aoi (アオイ)',
    avatar: '☕',
    location: 'Kyoto Traditional Café',
    description: 'Order matcha, talk about Japanese culture.',
    systemPrompt: 'You are Aoi, a calm and cultured café owner in Kyoto. Stay in character. Reply in Japanese with readings and English translations. Keep responses short (1-3 sentences). Help the customer order drinks and sweets, and share interesting facts about Japanese tea culture. Be warm and thoughtful.',
    initialMessage: {
      japanese: 'いらっしゃいませ。抹茶はいかがですか？今日はとても良い茶葉が入りましたよ。',
      reading: 'Irasshaimase. Matcha wa ikaga desu ka? Kyou wa totemo yoi chaba ga hairimashita yo.',
      english: 'Welcome. How about some matcha? We got some excellent tea leaves today.'
    },
    quickReplies: ['抹茶をお願いします', 'おすすめは何ですか？', '和菓子はありますか？', '京都のおすすめを教えてください']
  }
];

export default function ConversationPage() {
  const { addXP } = useAppStore();
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
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
      // Build conversation context for the AI
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
          apiKey: savedKey
        })
      });

      const data = await res.json();

      if (data.success) {
        // Parse Japanese, reading, and English from the AI response
        const responseText = data.text || '';
        
        const aiMsg: ChatMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: responseText,
          timestamp: Date.now()
        };
        setChatHistory(prev => [...prev, aiMsg]);
        
        // Try to speak the Japanese parts
        const jpMatch = responseText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g);
        if (jpMatch) {
          speakJapanese(jpMatch.slice(0, 3).join('。'));
        }
        
        addXP(15);
        playSound('xp');
      } else {
        throw new Error(data.error || 'No response');
      }
    } catch (err: unknown) {
      const errorMsg: ChatMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `すみません！接続エラーです。\n(Sumimasen! Setsuzoku eraa desu.)\nSorry! Connection error: ${(err as Error).message}\n\nPlease check your AI settings in the Tutor page.`,
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
    <div className="page-content">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageCircle size={28} color="var(--sakura-400)" /> Japanese Conversation — 会話
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Chat freely in Japanese with AI conversation partners. Type your own messages or use quick replies!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.25rem' }}>
        {/* Scenario Selection Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Choose Partner
          </div>
          {scenarios.map(sc => (
            <motion.button
              key={sc.id}
              whileHover={{ x: 3 }}
              onClick={() => selectScenario(sc)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                background: selectedScenario.id === sc.id ? 'rgba(230,49,85,0.12)' : 'var(--bg-card)',
                border: `1px solid ${selectedScenario.id === sc.id ? 'var(--sakura-500)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{sc.avatar}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sc.title}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {sc.character}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Chat Panel */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 220px)',
          minHeight: 400,
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{selectedScenario.avatar}</span>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {selectedScenario.character}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--sakura-400)', fontWeight: 600 }}>
                  {selectedScenario.location} • {selectedScenario.id === 'free' ? '🟢 AI Chat' : '🎭 Roleplay'}
                </div>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={clearChat}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {chatHistory.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <div
                  style={{
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, var(--sakura-500), var(--sakura-600))'
                      : 'var(--bg-elevated)',
                    color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '0.85rem 1.1rem',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontFamily: 'Noto Sans JP, sans-serif', fontWeight: 700, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </div>
                  {msg.reading && (
                    <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '0.2rem' }}>
                      {msg.reading}
                    </div>
                  )}
                  {msg.english && (
                    <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '0.25rem', fontStyle: 'italic' }}>
                      &quot;{msg.english}&quot;
                    </div>
                  )}
                </div>
                {/* Speak button for AI messages */}
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => {
                      const jpMatch = msg.text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g);
                      speakJapanese(jpMatch ? jpMatch.join('。') : msg.text);
                    }}
                    style={{
                      background: 'transparent', border: 'none', color: 'var(--text-muted)',
                      cursor: 'pointer', padding: '0.25rem', marginTop: '0.2rem',
                      display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem'
                    }}
                  >
                    <Volume2 size={13} /> Listen
                  </button>
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
                  padding: '0.75rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}
              >
                <Loader2 size={15} className="animate-spin" color="var(--sakura-400)" />
                {selectedScenario.character} is typing...
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies */}
          <div style={{
            padding: '0.5rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            flexShrink: 0
          }}>
            {selectedScenario.quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSend(reply)}
                disabled={isTyping}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Noto Sans JP, sans-serif',
                  fontWeight: 700,
                  color: 'var(--sakura-400)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            gap: '0.65rem',
            alignItems: 'center'
          }}>
            <input
              className="input"
              type="text"
              placeholder="日本語で書いてください... (Write in Japanese...)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              style={{
                flex: 1,
                fontSize: '0.95rem',
                fontFamily: 'Noto Sans JP, sans-serif',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)'
              }}
            />
            <button
              className="btn btn-primary btn-icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              style={{ width: 42, height: 42, borderRadius: 'var(--radius-lg)', flexShrink: 0 }}
              aria-label="Send message"
            >
              {isTyping ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
