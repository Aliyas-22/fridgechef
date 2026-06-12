'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => { if (session) router.push('/dashboard'); }, [session, router]);

  return (
    <main style={{ background: '#FAF9F6', minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="navbar px-6 py-4">
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1B2D6B' }}>🥗 FridgeChef</span>
          <Link href="/auth/login">
            <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Sign in</button>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px' }}>
        {/* Hero */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '4.5rem', marginBottom: 16, lineHeight: 1 }}>🥦</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1B2D6B', lineHeight: 1.2, marginBottom: 12 }}>
            Cook with what<br />you already have
          </h1>
          <p style={{ color: '#7A8AAD', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 32 }}>
            Tell us your ingredients.<br />Get 3 delicious recipes — instantly.
          </p>
          <Link href="/auth/register">
            <button className="btn-main" style={{ width: 'auto', padding: '16px 40px', fontSize: '1.05rem' }}>
              Get started free 🍳
            </button>
          </Link>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 40 }}>
          <p className="section-label" style={{ textAlign: 'center' }}>How it works</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { emoji: '🧅', step: '1', title: 'Add your ingredients', desc: 'Type whatever is in your fridge or pantry' },
              { emoji: '🤖', step: '2', title: 'AI creates recipes', desc: 'Gemini AI builds 3 recipes just for you' },
              { emoji: '🍽️', step: '3', title: 'Pick and cook', desc: 'Choose a recipe and save it for later' },
            ].map(f => (
              <div key={f.step} className="card fade-up" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F0E98A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  {f.emoji}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1B2D6B', marginBottom: 2 }}>{f.title}</p>
                  <p style={{ color: '#7A8AAD', fontSize: '0.9rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bottom */}
        <div className="card" style={{ padding: 24, textAlign: 'center', background: '#1B2D6B', borderColor: '#1B2D6B' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🥕🍅🧄</div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>Ready to cook smarter?</p>
          <p style={{ color: '#A8DDD1', fontSize: '0.9rem', marginBottom: 20 }}>Free forever. No credit card needed.</p>
          <Link href="/auth/register">
            <button className="btn-main" style={{ background: '#E8524A', width: 'auto', padding: '14px 32px' }}>
              Create free account
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
