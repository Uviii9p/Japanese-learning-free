'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import {
  Home, BookOpen, Flame, BarChart2, Trophy, Settings, Search,
  Volume2, Edit3, MessageCircle, Headphones, Mic, BookMarked,
  Map, Star, ChevronRight, X, Menu, Moon, Sun, User, Zap
} from 'lucide-react';

const navItems = [
  { href: '/dashboard',           icon: Home,          label: 'Dashboard',   labelJP: 'ホーム' },
  { href: '/learn',               icon: BookOpen,      label: 'Learn',       labelJP: '学習' },
  { href: '/learn/hiragana',      icon: Star,          label: 'Hiragana',    labelJP: 'ひらがな' },
  { href: '/learn/katakana',      icon: Star,          label: 'Katakana',    labelJP: 'カタカナ' },
  { href: '/learn/kanji',         icon: BookOpen,      label: 'Kanji',       labelJP: '漢字' },
  { href: '/learn/grammar',       icon: Edit3,         label: 'Grammar',     labelJP: '文法' },
  { href: '/learn/vocabulary',    icon: BookMarked,    label: 'Vocabulary',  labelJP: '語彙' },
  { href: '/learn/listening',     icon: Headphones,    label: 'Listening',   labelJP: '聴解' },
  { href: '/learn/speaking',      icon: Mic,           label: 'Speaking',    labelJP: '会話' },
  { href: '/learn/writing',       icon: Edit3,         label: 'Writing',     labelJP: '書き方' },
  { href: '/learn/conversation',  icon: MessageCircle, label: 'Conversation',labelJP: '対話' },
  { href: '/jlpt',                icon: Trophy,        label: 'JLPT Prep',   labelJP: 'JLPT' },
  { href: '/review',              icon: Flame,         label: 'Review',      labelJP: '復習' },
  { href: '/progress',            icon: BarChart2,     label: 'Progress',    labelJP: '進捗' },
  { href: '/achievements',        icon: Trophy,        label: 'Achievements',labelJP: '実績' },
  { href: '/course-map',          icon: Map,           label: 'Course Map',  labelJP: 'コース' },
  { href: '/tutor',               icon: MessageCircle, label: 'AI Tutor',    labelJP: 'AIチューター' },
  { href: '/notebook',            icon: BookMarked,    label: 'Notebook',    labelJP: 'ノート' },
  { href: '/profile',             icon: User,          label: 'Profile',     labelJP: 'プロフィール' },
  { href: '/settings',            icon: Settings,      label: 'Settings',    labelJP: '設定' },
];

const navGroups = [
  { label: 'Overview',        items: navItems.slice(0, 2) },
  { label: 'Writing Systems', items: navItems.slice(2, 4) },
  { label: 'Language Skills', items: navItems.slice(4, 11) },
  { label: 'Practice',        items: navItems.slice(11, 14) },
  { label: 'More',            items: navItems.slice(14) },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { displayName, avatar, totalXP, streak, theme, setTheme } = useAppStore();

  return (
    <nav style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Logo */}
      <div style={{ padding: '1.1rem 1rem 0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34,
              background: 'var(--sakura-500)',
              borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
              boxShadow: '0 3px 10px rgba(217,49,83,0.35)',
              flexShrink: 0
            }}>
              🇯🇵
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Japanese
              </div>
              <div style={{ fontFamily: 'Noto Sans JP', fontSize: '0.65rem', color: 'var(--sakura-400)', fontWeight: 700 }}>
                マスタリー
              </div>
            </div>
          </Link>
          {onClose && (
            <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} aria-label="Close sidebar">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* User card */}
      <Link href="/profile" style={{
        margin: '0.65rem 0.65rem 0',
        padding: '0.65rem 0.75rem',
        background: 'rgba(217,49,83,0.06)',
        border: '1px solid rgba(217,49,83,0.1)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        textDecoration: 'none',
        transition: 'background 0.2s',
      }}>
        <Avatar src={avatar || '/avatar.png'} size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
            {displayName}
          </div>
          <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
            <Zap size={10} color="var(--gold-400)" />
            {totalXP.toLocaleString()} XP
          </div>
        </div>
        {streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: '#f97316', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
            🔥{streak}
          </div>
        )}
      </Link>

      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.5rem 1rem' }}>
        {navGroups.map(group => (
          <div key={group.label} style={{ marginBottom: '0.15rem' }}>
            <div className="section-title" style={{ paddingLeft: '0.5rem', marginTop: '0.75rem', marginBottom: '0.35rem' }}>
              {group.label}
            </div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                  style={{ marginBottom: '0.1rem' }}
                >
                  <Icon size={15} className="nav-icon" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.83rem' }}>{item.label}</span>
                  <span style={{ fontFamily: 'Noto Sans JP', fontSize: '0.6rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                    {item.labelJP}
                  </span>
                  {isActive && <ChevronRight size={11} style={{ opacity: 0.4, flexShrink: 0 }} />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Theme toggle */}
      <div style={{ padding: '0.6rem 0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.35rem' }}>
        <button
          className={`btn btn-sm ${theme === 'dark' ? 'btn-secondary' : 'btn-ghost'}`}
          style={{ flex: 1, fontSize: '0.72rem', gap: '0.3rem', minHeight: 36 }}
          onClick={() => setTheme('dark')}
        >
          <Moon size={12} /> Dark
        </button>
        <button
          className={`btn btn-sm ${theme === 'light' ? 'btn-secondary' : 'btn-ghost'}`}
          style={{ flex: 1, fontSize: '0.72rem', gap: '0.3rem', minHeight: 36 }}
          onClick={() => setTheme('light')}
        >
          <Sun size={12} /> Light
        </button>
      </div>

      {/* Creator credit */}
      <div style={{ padding: '0.4rem 1rem 0.65rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontWeight: 600 }}>Built by</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--sakura-400)', fontWeight: 800 }}>Sujal Rathod</div>
      </div>
    </nav>
  );
}

const mobileNavItems = [
  { href: '/dashboard', icon: Home,          label: 'Home',    labelJP: 'ホーム' },
  { href: '/learn',     icon: BookOpen,      label: 'Learn',   labelJP: '学習' },
  { href: '/tutor',     icon: MessageCircle, label: 'Tutor',   labelJP: 'AI' },
  { href: '/jlpt',      icon: Trophy,        label: 'JLPT',    labelJP: '試験' },
  { href: '/review',    icon: Flame,         label: 'Review',  labelJP: '復習' },
];

export function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav
      className="mobile-nav"
      style={{ display: 'flex', alignItems: 'stretch' }}
      aria-label="Mobile navigation"
    >
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
              gap: '0.18rem',
              color: isActive ? 'var(--sakura-400)' : 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.58rem',
              fontWeight: 700,
              transition: 'color 0.18s',
              padding: '0.4rem 0.25rem',
              position: 'relative',
              letterSpacing: '0.02em'
            }}
          >
            {/* Active indicator dot */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 6,
                width: 22,
                height: 2,
                borderRadius: 9999,
                background: 'var(--sakura-500)'
              }} />
            )}
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const streak = useAppStore(s => s.streak);

  const currentItem = navItems.find(n =>
    pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
  );
  const title = currentItem?.label || 'Japanese Mastery';

  return (
    <header className="topbar">
      <button
        className="btn btn-ghost btn-icon"
        onClick={onMenuClick}
        aria-label="Open menu"
        id="mobile-menu-btn"
        style={{ color: 'var(--text-secondary)', minHeight: 'unset', padding: '0.5rem' }}
      >
        <Menu size={19} />
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </span>
        {currentItem?.labelJP && (
          <span style={{ fontFamily: 'Noto Sans JP', fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700, flexShrink: 0 }}>
            {currentItem.labelJP}
          </span>
        )}
      </div>

      <Link href="/search" className="btn btn-ghost btn-icon" aria-label="Search" style={{ color: 'var(--text-secondary)', minHeight: 'unset', padding: '0.5rem' }}>
        <Search size={17} />
      </Link>

      {streak > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.2rem',
          background: 'rgba(249,115,22,0.1)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem 0.6rem',
          fontSize: '0.75rem', fontWeight: 800,
          color: '#f97316',
          flexShrink: 0
        }}>
          <span style={{ animation: 'streak-fire 1s ease-in-out infinite' }}>🔥</span>
          {streak}
        </div>
      )}
    </header>
  );
}
