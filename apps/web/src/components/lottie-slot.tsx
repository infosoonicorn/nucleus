'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

type LottieSlotProps = {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  ariaLabel?: string;
};

export function LottieSlot({
  src,
  className,
  loop = true,
  autoplay = true,
  ariaLabel,
}: LottieSlotProps) {
  const [data, setData] = useState<unknown>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Lottie not found at ${src}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (failed || !data) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <div className={className} role="img" aria-label={ariaLabel}>
      <Lottie animationData={data} loop={loop} autoplay={autoplay} />
    </div>
  );
}
