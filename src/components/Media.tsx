import type { Media as M } from '@/content/types';

/** Renders real media when `src` is set, otherwise a labelled placeholder that reserves the same space. */
export function Media({ media, eager = false, className = '', label }: { media: M; eager?: boolean; className?: string; label?: string }) {
  const style = { aspectRatio: media.ratio };
  if (!media.src) {
    return (
      <div className={`media ${className}`} style={style} role="img" aria-label={`Placeholder: ${media.alt}`}>
        <div className="ph"><b>{label ?? 'Placeholder'}</b><span>{media.spec}</span></div>
      </div>
    );
  }
  if (media.kind === 'video') {
    return (
      <div className={`media ${className}`} style={style}>
        <video src={media.src} poster={media.poster ?? undefined} muted loop playsInline autoPlay
          preload={eager ? 'auto' : 'none'} aria-label={media.alt} />
      </div>
    );
  }
  return (
    <div className={`media ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media.src} alt={media.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} />
    </div>
  );
}
