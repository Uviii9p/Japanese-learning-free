'use client';

import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  '2xl': 120,
};

export function Avatar({ src, alt = 'User Avatar', size = 'md', className = '', style }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const px = sizeMap[size] || 40;

  const safeSrc = (typeof src === 'string' && src.trim()) ? src.trim() : '/avatar.png';
  const isImage = !imgError && (safeSrc.startsWith('/') || safeSrc.startsWith('http') || safeSrc.startsWith('data:'));

  return (
    <div
      className={className}
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(230,49,85,0.25), rgba(99,102,241,0.25))',
        border: '2px solid var(--sakura-500)',
        boxShadow: '0 4px 14px rgba(230,49,85,0.3)',
        flexShrink: 0,
        position: 'relative',
        ...style,
      }}
    >
      {isImage ? (
        <img
          src={safeSrc}
          alt={alt}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span style={{ fontSize: `${px * 0.5}px`, lineHeight: 1 }}>
          {safeSrc && !safeSrc.startsWith('/') && !safeSrc.startsWith('http') ? safeSrc : '🎌'}
        </span>
      )}
    </div>
  );
}
