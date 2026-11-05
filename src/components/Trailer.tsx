'use client';
import { useState } from 'react';
import { trailer } from '@/content/site';
import { track } from '@/lib/analytics';
import { PlayIcon } from './Icons';

/** Click-to-load: nothing heavy is fetched until the visitor asks for the trailer. */
export function TrailerPlayer() {
  const [playing, setPlaying] = useState(false);
  const has = Boolean(trailer.src || trailer.youtubeId);
  const start = () => { track('trailer_play', { has_video: has }); if (has) setPlaying(true); };
  return (
    <div className="player">
      {playing && trailer.youtubeId && (
        <iframe src={`https://www.youtube-nocookie.com/embed/${trailer.youtubeId}?autoplay=1&rel=0`} title="Official trailer"
          allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      )}
      {playing && trailer.src && !trailer.youtubeId && <video src={trailer.src} controls autoPlay playsInline />}
      {!playing && (
        <>
          {trailer.poster
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={trailer.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            : <div className="ph"><b>Trailer placeholder</b><span>1920×1080 MP4 (H.264) + WebM, or a YouTube ID. Poster 1920×1080 WebP.</span></div>}
          <button className="play" onClick={start} aria-label={has ? `Watch the trailer (${trailer.duration})` : 'Trailer coming soon'}>
            <span><PlayIcon /></span>
          </button>
        </>
      )}
    </div>
  );
}
