"use client";

import React, { useState } from 'react';

export default function LazyImage({ 
  src, 
  alt, 
  lqip,
  style,
  className,
  onError,
  mode = 'fill'
}: { 
  src: string; 
  alt: string; 
  lqip?: string;
  style?: React.CSSProperties;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  mode?: 'fill' | 'natural';
}) {
  const [loaded, setLoaded] = useState(false);
  const { objectFit, objectPosition, width, height, ...containerStyle } = style || {};
  const isNatural = mode === 'natural';
  const resolvedObjectFit: React.CSSProperties['objectFit'] = objectFit ?? (isNatural ? 'contain' : 'cover');

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: isNatural ? 'visible' : 'hidden',
        display: isNatural ? 'inline-block' : 'block',
        width: isNatural ? 'fit-content' : width,
        height: isNatural ? 'fit-content' : height,
        ...containerStyle
      }}
    >
      {lqip && !loaded && (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: isNatural ? 'auto' : '100%',
            height: isNatural ? 'auto' : '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: resolvedObjectFit,
            objectPosition: objectPosition,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={onError}
        style={{
          width: isNatural ? 'auto' : '100%',
          height: isNatural ? 'auto' : '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: resolvedObjectFit,
          objectPosition: objectPosition,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />
    </div>
  );
}
