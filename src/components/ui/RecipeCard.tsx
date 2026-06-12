'use client';
import { useState } from 'react';
import { Recipe } from '@/types';
import toast from 'react-hot-toast';

interface Props { recipe: Recipe; showSave?: boolean; }

export default function RecipeCard({ recipe, showSave = true }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const difficultyStyle = {
    Easy: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    Hard: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
  }[recipe.difficulty] || 'text-white/40 bg-white/5 border-white/10';

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/recipes/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recipe) });
    setSaving(false);
    if (res.ok) { setSaved(true); toast.success('Recipe saved! ✨'); }
    else toast.error('Failed to save');
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden card-hover flex flex-col h-full">
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-white leading-tight">{recipe.title}</h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${difficultyStyle}`}>
            {recipe.difficulty}
          </span>
        </div>

        <p className="text-white/50 text-sm leading-relaxed mb-4">{recipe.description}</p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="glass text-xs text-white/50 px-3 py-1 rounded-full border border-white/5">⏱ {recipe.cookTime}</span>
          <span className="glass text-xs text-white/50 px-3 py-1 rounded-full border border-white/5">👥 {recipe.servings}</span>
          <span className="glass text-xs text-white/50 px-3 py-1 rounded-full border border-white/5">🌍 {recipe.cuisine}</span>
        </div>

        {/* Ingredients */}
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3">Ingredients</p>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.map((ing, i) => (
              <span key={i} className="text-xs bg-purple-500/8 border border-purple-500/15 text-white/60 px-2.5 py-1 rounded-full">
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Instructions toggle */}
        <div className="mb-5 flex-1">
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            <span className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}>▶</span>
            {expanded ? 'Hide' : 'Show'} Instructions
          </button>

          {expanded && (
            <div className="mt-4 space-y-3">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm text-white/60">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-purple-500/20 text-purple-300 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
              {recipe.tips && recipe.tips.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-cyan-500/8 to-purple-500/8 border border-cyan-500/15">
                  <p className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">✨ Chef's Tips</p>
                  {recipe.tips.map((tip, i) => <p key={i} className="text-xs text-white/50 leading-relaxed">• {tip}</p>)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save button */}
        {showSave && (
          <button onClick={handleSave} disabled={saving || saved}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              saved ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
              : 'btn-aurora'
            }`}>
            {saved ? '✅ Saved!' : saving ? '💾 Saving...' : '💾 Save Recipe'}
          </button>
        )}
      </div>
    </div>
  );
}
