'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track, type AnalyticsEvent, type EventProps } from '@/lib/analytics';

type Props = ComponentProps<typeof Link> & { event: AnalyticsEvent; props?: EventProps };
export function TrackedLink({ event, props, onClick, ...rest }: Props) {
  return <Link {...rest} onClick={(e) => { track(event, props); onClick?.(e); }} />;
}
