'use client';
import { useState } from 'react';
import { track } from '@/lib/analytics';

/**
 * Newsletter / launch-notify form. No provider is wired yet: connect one in `submit()`
 * (Mailchimp, Brevo, ConvertKit, a serverless function). Until then it validates and reports honestly.
 */
export function Signup({ placement }: { placement: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('err'); setMsg('Enter an email address like name@example.com.'); return; }
    // TODO: POST to your email provider here.
    track('newsletter_signup', { placement });
    setState('ok'); setMsg('You’re on the list. We’ll email you on launch day.');
    e.currentTarget.reset();
  }
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={`email-${placement}`} className="sr-only">Email address</label>
      <div className="signup">
        <input id={`email-${placement}`} name="email" type="email" autoComplete="email" placeholder="Your email" aria-describedby={`msg-${placement}`} />
        <button className="btn btn-primary" type="submit">Notify me</button>
      </div>
      <p id={`msg-${placement}`} className="form-msg" data-state={state} aria-live="polite">{msg}</p>
    </form>
  );
}
