'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const res = await fetch('/api/user/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) toast.error(data.error || 'Something went wrong');
    else { toast.success('Account created! 🎉'); router.push('/auth/login'); }
  };

  return (
    <main style={{ background: '#FAF9F6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar px-6 py-4">
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <Link href="/" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1B2D6B', textDecoration: 'none' }}>🥗 FridgeChef</Link>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🥑</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1B2D6B', marginBottom: 6 }}>Create account</h1>
            <p style={{ color: '#7A8AAD' }}>Free forever. Start cooking smarter.</p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <p className="section-label">Your name</p>
                <input type="text" className="input-light" placeholder="Aliya Shaikh"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <p className="section-label">Email</p>
                <input type="email" className="input-light" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <p className="section-label">Password</p>
                <input type="password" className="input-light" placeholder="At least 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <button type="submit" className="btn-main" disabled={loading} style={{ marginTop: 8 }}>
                {loading
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="spinner" />
                      Creating account...
                    </span>
                  : 'Create account →'}
              </button>
            </form>

            <div className="divider" />
            <p style={{ textAlign: 'center', color: '#7A8AAD', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: '#E8524A', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
