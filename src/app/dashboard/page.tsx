'use client';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Recipe } from '@/types';
import Link from 'next/link';

const VEGGIE_EMOJIS = ['🥦', '🥕', '🍅', '🧅', '🫑', '🥒', '🌽', '🧄', '🥬', '🍆'];

export default function Dashboard() {
  const { data: session } = useSession();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [preferences, setPreferences] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState(0);
  const [tab, setTab] = useState<'generate' | 'saved'>('generate');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [expandedInstructions, setExpandedInstructions] = useState(false);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [savedIdxs, setSavedIdxs] = useState<number[]>([]);

  const addIngredient = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInput('');
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addIngredient(); }
  };

  const generate = async () => {
    if (!ingredients.length) { toast.error('Add at least one ingredient first!'); return; }
    setLoading(true); setRecipes([]); setActiveRecipe(0); setExpandedInstructions(false); setSavedIdxs([]);
    try {
      const res = await fetch('/api/recipes/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ingredients, preferences }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecipes(data.recipes);
      toast.success('3 recipes ready! 🎉');
    } catch (err: any) { toast.error(err.message || 'Something went wrong'); }
    setLoading(false);
  };

  const saveRecipe = async (recipe: Recipe, idx: number) => {
    setSavingIdx(idx);
    const res = await fetch('/api/recipes/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recipe) });
    setSavingIdx(null);
    if (res.ok) { setSavedIdxs(p => [...p, idx]); toast.success('Saved! 📖'); }
    else toast.error('Could not save');
  };

  const loadSaved = async () => {
    setLoadingSaved(true);
    const res = await fetch('/api/recipes/saved');
    const data = await res.json();
    setSavedRecipes(data.recipes || []);
    setLoadingSaved(false);
  };

  const switchTab = (t: 'generate' | 'saved') => {
    setTab(t);
    if (t === 'saved') loadSaved();
  };

  const recipe = recipes[activeRecipe];

  return (
    <main style={{ background: '#FAF9F6', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar px-5 py-4">
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1B2D6B', textDecoration: 'none' }}>🥗 FridgeChef</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.85rem', color: '#7A8AAD', fontWeight: 500 }}>Hi, {session?.user?.name?.split(' ')[0]} 👋</span>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-secondary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px' }}>
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#EEECEA', borderRadius: 16, padding: 4 }}>
          {(['generate', 'saved'] as const).map(t => (
            <button key={t} onClick={() => switchTab(t)}
              style={{
                flex: 1, padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600,
                fontSize: '0.9rem', transition: 'all 0.2s',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#1B2D6B' : '#7A8AAD',
                boxShadow: tab === t ? '0 1px 6px rgba(27,45,107,0.1)' : 'none',
              }}>
              {t === 'generate' ? '🍳 Cook' : '📖 Saved'}
            </button>
          ))}
        </div>

        {/* ── GENERATE TAB ── */}
        {tab === 'generate' && (
          <div>
            {/* Input card */}
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1B2D6B', marginBottom: 4 }}>
                What's in your fridge? 🧊
              </h2>
              <p style={{ color: '#7A8AAD', fontSize: '0.875rem', marginBottom: 16 }}>
                Add your ingredients one by one
              </p>

              {/* Input row */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input className="input-light" placeholder="e.g. tomato, paneer, rice"
                  value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  style={{ flex: 1 }} />
                <button onClick={addIngredient} className="btn-main"
                  style={{ width: 'auto', padding: '0 20px', borderRadius: 12, flexShrink: 0 }}>
                  Add
                </button>
              </div>

              {/* Ingredient chips */}
              {ingredients.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {ingredients.map((ing, i) => (
                    <span key={ing} className="chip pop-in">
                      {VEGGIE_EMOJIS[i % VEGGIE_EMOJIS.length]} {ing}
                      <button onClick={() => setIngredients(ingredients.filter(x => x !== ing))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8524A', fontWeight: 700, padding: 0, fontSize: '1rem', lineHeight: 1 }}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Preferences */}
              <input className="input-light" placeholder="Any preferences? (vegetarian, spicy, quick...)"
                value={preferences} onChange={e => setPreferences(e.target.value)}
                style={{ marginBottom: 14 }} />

              {/* Generate button */}
              <button className="btn-main" onClick={generate} disabled={loading || !ingredients.length}>
                {loading
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="spinner" />
                      Finding recipes...
                    </span>
                  : `✨ Find my recipes (${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''})`}
              </button>
            </div>

            {/* Recipe results */}
            {recipes.length > 0 && (
              <div className="fade-up">
                {/* Recipe selector tabs */}
                <p className="section-label" style={{ marginBottom: 10 }}>Choose a recipe</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {recipes.map((r, i) => (
                    <button key={i} className={`recipe-tab ${activeRecipe === i ? 'active' : ''}`}
                      onClick={() => { setActiveRecipe(i); setExpandedInstructions(false); }}>
                      <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>
                        {['1️⃣','2️⃣','3️⃣'][i]}
                      </div>
                      <div style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                        {r.title.split(' ').slice(0, 3).join(' ')}...
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active recipe card */}
                {recipe && (
                  <div className="card fade-up" style={{ padding: 20 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1B2D6B', lineHeight: 1.3, flex: 1 }}>
                        {recipe.title}
                      </h3>
                      <span className={`badge badge-${recipe.difficulty?.toLowerCase() || 'easy'}`}>
                        {recipe.difficulty}
                      </span>
                    </div>

                    <p style={{ color: '#7A8AAD', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>
                      {recipe.description}
                    </p>

                    {/* Meta pills */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      <span style={{ background: '#EEF6F4', color: '#1B6B5A', padding: '5px 12px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600 }}>
                        ⏱ {recipe.cookTime}
                      </span>
                      <span style={{ background: '#EEF6F4', color: '#1B6B5A', padding: '5px 12px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600 }}>
                        👥 {recipe.servings}
                      </span>
                      <span style={{ background: '#EEF6F4', color: '#1B6B5A', padding: '5px 12px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600 }}>
                        🌍 {recipe.cuisine}
                      </span>
                    </div>

                    <div className="divider" />

                    {/* Ingredients */}
                    <p className="section-label">Ingredients</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                      {recipe.ingredients.map((ing, i) => (
                        <span key={i} style={{ background: '#FAF9F6', border: '1px solid #E8E6E0', color: '#4A5A7A', padding: '5px 12px', borderRadius: 100, fontSize: '0.82rem' }}>
                          {VEGGIE_EMOJIS[i % VEGGIE_EMOJIS.length]} {ing}
                        </span>
                      ))}
                    </div>

                    <div className="divider" />

                    {/* Instructions toggle */}
                    <button onClick={() => setExpandedInstructions(!expandedInstructions)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: expandedInstructions ? 14 : 0 }}>
                      <p className="section-label" style={{ marginBottom: 0 }}>Steps to cook</p>
                      <span style={{ color: '#E8524A', fontWeight: 700, fontSize: '0.85rem' }}>
                        {expandedInstructions ? 'Hide ▲' : 'Show ▼'}
                      </span>
                    </button>

                    {expandedInstructions && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                        {recipe.instructions.map((step, i) => (
                          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div className="step-number">{i + 1}</div>
                            <p style={{ color: '#4A5A7A', fontSize: '0.9rem', lineHeight: 1.6, flex: 1, paddingTop: 4 }}>{step}</p>
                          </div>
                        ))}
                        {recipe.tips?.length ? (
                          <div className="tip-box">
                            <p style={{ fontWeight: 700, color: '#8A5F00', fontSize: '0.85rem', marginBottom: 6 }}>💡 Chef tip</p>
                            {recipe.tips.map((t, i) => <p key={i} style={{ color: '#7A5A00', fontSize: '0.85rem', lineHeight: 1.5 }}>• {t}</p>)}
                          </div>
                        ) : null}
                      </div>
                    )}

                    <div className="divider" />

                    {/* Save button */}
                    <button
                      onClick={() => saveRecipe(recipe, activeRecipe)}
                      disabled={savingIdx === activeRecipe || savedIdxs.includes(activeRecipe)}
                      className="btn-main"
                      style={{ background: savedIdxs.includes(activeRecipe) ? '#E8F8F0' : '#1B2D6B', color: savedIdxs.includes(activeRecipe) ? '#1A7A4A' : '#fff' }}>
                      {savedIdxs.includes(activeRecipe) ? '✅ Saved to collection' : savingIdx === activeRecipe ? 'Saving...' : '📖 Save this recipe'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!loading && recipes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🥬</div>
                <p style={{ color: '#7A8AAD', fontWeight: 600, marginBottom: 4 }}>Add ingredients above</p>
                <p style={{ color: '#B0AEAD', fontSize: '0.875rem' }}>We'll turn them into 3 amazing recipes</p>
              </div>
            )}
          </div>
        )}

        {/* ── SAVED TAB ── */}
        {tab === 'saved' && (
          <div>
            {loadingSaved ? (
              <div style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ width: 36, height: 36, border: '3px solid #E0DED9', borderTopColor: '#1B2D6B', borderRadius: '50%', margin: '0 auto 12px' }} className="spinner" />
                <p style={{ color: '#7A8AAD' }}>Loading your recipes...</p>
              </div>
            ) : savedRecipes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p className="section-label">{savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? 's' : ''}</p>
                {savedRecipes.map((r, i) => (
                  <div key={i} className="card fade-up" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1B2D6B', flex: 1, lineHeight: 1.3, paddingRight: 8 }}>{r.title}</h3>
                      <span className={`badge badge-${r.difficulty?.toLowerCase() || 'easy'}`}>{r.difficulty}</span>
                    </div>
                    <p style={{ color: '#7A8AAD', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 10 }}>{r.description}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ background: '#F4F2EE', color: '#7A8AAD', padding: '4px 10px', borderRadius: 100, fontSize: '0.78rem' }}>⏱ {r.cookTime}</span>
                      <span style={{ background: '#F4F2EE', color: '#7A8AAD', padding: '4px 10px', borderRadius: 100, fontSize: '0.78rem' }}>🌍 {r.cuisine}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>📖</div>
                <p style={{ color: '#7A8AAD', fontWeight: 600, marginBottom: 4 }}>No saved recipes yet</p>
                <p style={{ color: '#B0AEAD', fontSize: '0.875rem' }}>Generate recipes and save your favorites</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
