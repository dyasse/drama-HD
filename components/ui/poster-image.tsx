'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

const FALLBACK_POSTER = 'https://placehold.co/780x1170/0a0a0a/FFFDD0?text=Drama+HD';

type PosterImageProps = Omit<ImageProps, 'src'> & {
  src?: string;
};

export function PosterImage({ src, alt, ...props }: PosterImageProps) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_POSTER);

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      unoptimized
      onError={() => setImageSrc(FALLBACK_POSTER)}
    />
  );
}
