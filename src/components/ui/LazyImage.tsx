"use client";

import React, { useState } from 'react';

export default function LazyImage({ 
  src, 
  alt, 
  lqip,
  style,
  className,
  onError
}: { 
  src: string; 
  alt: string; 
  lqip?: string;
  style?: React.CSSProperties;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const { objectFit, objectPosition, ...containerStyle } = style || {};

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...containerStyle }}>
      {lqip && !loaded && (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: (objectFit as any) || 'cover',
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
          width: '100%',
          height: '100%',
          objectFit: (objectFit as any) || 'cover',
          objectPosition: objectPosition,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />
    </div>
  );
}
