'use client';
import { track } from '@/lib/analytics';
export function PressDownload({ href, label, asset }: { href: string | null; label: string; asset: string }) {
  if (!href) return <span className="btn btn-quiet" aria-disabled="true">File coming soon</span>;
  return <a className="btn btn-quiet" href={href} download onClick={() => track('presskit_download', { asset })}>{label}</a>;
}
