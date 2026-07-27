import { useState, useMemo } from 'react'

const PALETTES = [
  { name: 'Naranja', main: '#f97416e5', soft: '#f9731699', border: '#f9731633' },
  { name: 'Azul',    main: '#60a5fae5', soft: '#3b82f699', border: '#3b82f633' },
  { name: 'Verde',   main: '#4ade80e5', soft: '#22c55e99', border: '#22c55e33' },
  { name: 'Rosa',    main: '#f472b6e5', soft: '#ec489999', border: '#ec489933' },
  { name: 'Violeta', main: '#a78bfae5', soft: '#8b5cf699', border: '#8b5cf633' },
]

function generateBubbles(count) {
  return Array.from({ length: count }, (_, i) => ({
    size: Math.floor(Math.random() * 55) + 15,
    left: `${(i / count) * 100 + Math.random() * (100 / count)}%`,
    delay: `${(Math.random() * 5).toFixed(1)}s`,
    duration: `${(Math.random() * 7 + 7).toFixed(1)}s`,
  }))
}

export default function Bubbles({ t }) {
  const [count, setCount] = useState(() => Number(localStorage.getItem('bubbleCount')) || 20)
  const [enabled, setEnabled] = useState(() => localStorage.getItem('bubblesEnabled') !== 'false')
  const [colorIdx, setColorIdx] = useState(() => Number(localStorage.getItem('bubbleColor')) || 0)
  const [open, setOpen] = useState(false)
  const bubbles = useMemo(() => generateBubbles(count), [count])
  const palette = PALETTES[colorIdx]

  function handleCount(v) { setCount(v); localStorage.setItem('bubbleCount', v) }
  function handleEnabled(v) { setEnabled(v); localStorage.setItem('bubblesEnabled', v) }
  function handleColor() {
    const next = (colorIdx + 1) % PALETTES.length
    setColorIdx(next)
    localStorage.setItem('bubbleColor', next)
  }

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true" role="presentation">
        {enabled && bubbles.map((b, i) => (
          <span
            key={i}
            className="bubble"
            aria-hidden="true"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              animationDelay: b.delay,
              animationDuration: b.duration,
              background: `radial-gradient(circle at 30% 30%, ${palette.main}, ${palette.soft})`,
              borderColor: palette.border,
            }}
          />
        ))}
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2" role="region" aria-label="Bubble animation controls">
        {open && (
          <div className="animate-fade-in bg-black/70 border border-orange-500/40 rounded-xl px-4 py-3 flex gap-2 items-center neon-box" role="group" aria-label="Bubble settings">
            <button
              onClick={() => handleEnabled(!enabled)}
              className="relative w-8 h-8 cursor-pointer border border-orange-500/40 rounded-full focus:ring-2 focus:ring-orange-300 focus:outline-none transition-all"
              aria-label={enabled ? t.bubblesToggleOff : t.bubblesToggleOn}
              aria-pressed={enabled}
              title={enabled ? t.bubblesToggleOff : t.bubblesToggleOn}
            >
              <span className="text-xl leading-none" aria-hidden="true">🫧</span>
              {!enabled && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32" aria-hidden="true">
                  <circle cx="16" cy="16" r="13" stroke="#ef4444" strokeWidth="2.5" fill="none"/>
                  <line x1="6" y1="6" x2="26" y2="26" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
            <button
              onClick={handleColor}
              className="w-6 h-6 rounded-full border-2 border-white/30 cursor-pointer transition-transform hover:scale-110 focus:ring-2 focus:ring-orange-300 focus:outline-none"
              style={{ background: palette.main }}
              aria-label={`Change color. Current: ${palette.name}`}
              title={`Color: ${palette.name}`}
            />
            <div className="flex flex-col gap-1">
              <label htmlFor="bubble-count" className="sr-only">Bubble count: {count}</label>
              <input
                id="bubble-count"
                type="range" 
                min={1} 
                max={300} 
                value={count}
                onChange={e => handleCount(Number(e.target.value))}
                className="accent-orange-500 w-36 focus:ring-2 focus:ring-orange-300 rounded"
                aria-valuemin={1}
                aria-valuemax={300}
                aria-valuenow={count}
                aria-label="Number of bubbles"
              />
              <span className="text-xs text-gray-500" aria-live="polite">{count} bubbles</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="bg-black/70 border border-orange-500/40 rounded-full w-9 h-9 text-lg neon-btn cursor-pointer focus:ring-2 focus:ring-orange-300 focus:outline-none transition-all"
          aria-label={t.bubblesAdjust}
          aria-expanded={open}
          title={t.bubblesAdjust}
        >
          <span aria-hidden="true">🫧</span>
        </button>
      </div>
    </>
  )
}
