'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import {
  Home, BookOpen, Flame, BarChart2, Trophy, Settings, Search,
  Volume2, Edit3, MessageCircle, Headphones, Mic, BookMarked,
  Map, Star, ChevronRight, X, Menu, Moon, Sun, User
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home', labelJP: 'ホーム' },
  { href: '/learn', icon: BookOpen, label: 'Learn', labelJP: '学習' },
  { href: '/learn/hiragana', icon: Star, label: 'Hiragana', labelJP: 'ひらがな' },
  { href: '/learn/katakana', icon: Star, label: 'Katakana', labelJP: 'カタカナ' },
  { href: '/learn/kanji', icon: BookOpen, label: 'Kanji', labelJP: '漢字' },
  { href: '/learn/grammar', icon: Edit3, label: 'Grammar', labelJP: '文法' },
  { href: '/learn/vocabulary', icon: BookMarked, label: 'Vocabulary', labelJP: '語彙' },
  { href: '/learn/listening', icon: Headphones, label: 'Listening', labelJP: '聴解' },
  { href: '/learn/speaking', icon: Mic, label: 'Speaking', labelJP: 'スピーキング' },
  { href: '/learn/writing', icon: Edit3, label: 'Writing', labelJP: '書き方' },
  { href: '/learn/conversation', icon: MessageCircle, label: 'Conversation', labelJP: '会話' },
  { href: '/jlpt', icon: Trophy, label: 'JLPT Prep', labelJP: 'JLPT' },
  { href: '/review', icon: Flame, label: 'Review', labelJP: '復習' },
  { href: '/progress', icon: BarChart2, label: 'Progress', labelJP: '進捗' },
  { href: '/achievements', icon: Trophy, label: 'Achievements', labelJP: '実績' },
  { href: '/course-map', icon: Map, label: 'Course Map', labelJP: 'コース' },
  { href: '/tutor', icon: MessageCircle, label: 'AI Tutor', labelJP: 'AIチューター' },
  { href: '/notebook', icon: BookMarked, label: 'Notebook', labelJP: 'ノート' },
  { href: '/profile', icon: User, label: 'Profile', labelJP: 'プロフィール' },
  { href: '/settings', icon: Settings, label: 'Settings', labelJP: '設定' },
];

const navGroups = [
  { label: 'Main', items: navItems.slice(0, 2) },
  { label: 'Writing Systems', items: navItems.slice(2, 4) },
  { label: 'Language Skills', items: navItems.slice(4, 11) },
  { label: 'Practice', items: navItems.slice(11, 14) },
  { label: 'More', items: navItems.slice(14) },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { displayName, avatar, totalXP, streak, theme, setTheme } = useAppStore();

  return (
    <nav style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, var(--sakura-500), var(--sakura-700))',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 4px 12px rgba(230,49,85,0.3)',
            }}>🇯🇵</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Japanese
              </div>
              <div style={{ fontFamily: 'Noto Sans JP', fontSize: '0.7rem', color: 'var(--sakura-400)', fontWeight: 700 }}>
                マスタリー
              </div>
            </div>
          </Link>
          {onClose && (
            <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close sidebar">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* User card */}
      <Link href="/profile" style={{
        margin: '0.75rem',
        padding: '0.75rem',
        background: 'rgba(230,49,85,0.06)',
        border: '1px solid rgba(230,49,85,0.12)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        transition: 'background 0.2s',
      }}>
        <Avatar src={avatar || '/avatar.png'} size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayName}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            ⭐ {totalXP.toLocaleString()} XP
          </div>
        </div>
        {streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f97316', fontWeight: 700, fontSize: '0.8rem' }}>
            🔥 {streak}
          </div>
        )}
      </Link>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem 1rem' }}>
        {navGroups.map(group => (
          <div key={group.label} style={{ marginBottom: '0.25rem' }}>
            <div className="section-title" style={{ paddingLeft: '0.5rem', marginTop: '0.75rem' }}>{group.label}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <Icon size={16} className="nav-icon" />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: theme toggle */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
        <button
          className={`btn ${theme === 'dark' ? 'btn-secondary' : 'btn-ghost'}`}
          style={{ flex: 1, fontSize: '0.75rem' }}
          onClick={() => setTheme('dark')}
        >
          <Moon size={14} /> Dark
        </button>
        <button
          className={`btn ${theme === 'light' ? 'btn-secondary' : 'btn-ghost'}`}
          style={{ flex: 1, fontSize: '0.75rem' }}
          onClick={() => setTheme('light')}
        >
          <Sun size={14} /> Light
        </button>
      </div>

      {/* Creator Credit */}
      <div style={{
        padding: '0.5rem 1rem 0.75rem',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Created by
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--sakura-400)', fontWeight: 800 }}>
          Sujal Rathod
        </div>
      </div>
    </nav>
  );
}

const mobileNavItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/learn', icon: BookOpen, label: 'Learn' },
  { href: '/review', icon: Flame, label: 'Review' },
  { href: '/progress', icon: BarChart2, label: 'Progress' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav className="mobile-nav" style={{ display: 'flex', alignItems: 'stretch' }}>
      {mobileNavItems.map(item => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              color: isActive ? 'var(--sakura-400)' : 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.6rem',
              fontWeight: 600,
              transition: 'color 0.2s',
              padding: '0.5rem 0.25rem',
            }}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const streak = useAppStore(s => s.streak);
  
  const title = navItems.find(n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)))?.label || 'Japanese Mastery';

  return (
    <header className="topbar">
      <button
        className="btn btn-ghost btn-icon"
        onClick={onMenuClick}
        aria-label="Open menu"
        id="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>
      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', flex: 1 }}>
        {title}
      </div>
      <Link href="/search" className="btn btn-ghost btn-icon" aria-label="Search">
        <Search size={18} />
      </Link>
      {streak > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          background: 'rgba(249,115,22,0.12)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 'var(--radius-full)',
          padding: '0.3rem 0.75rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#f97316',
        }}>
          <span style={{ animation: 'streak-fire 1s ease-in-out infinite' }}>🔥</span>
          {streak}
        </div>
      )}
    </header>
  );
}
