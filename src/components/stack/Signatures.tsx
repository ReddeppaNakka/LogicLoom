/**
 * A tiny living illustration per technology, drawn in the corner of its bento
 * tile. Each one hints at what the thing does: an orbiting atom for React, a
 * blinking cursor for the editor, bars growing for the chart library.
 *
 * All pure CSS or SVG. They pause under the app's "Still" motion setting.
 */
export function Signature({ id, corner = 'bottom', size = 'lg' }: { id: string; corner?: 'top' | 'bottom'; size?: 'sm' | 'lg' }) {
  const c = 'var(--accent)'
  const d = 'var(--fg-muted)'
  const cls = ['sig', corner === 'top' && 'sig-top', size === 'sm' && 'sig-sm'].filter(Boolean).join(' ')
  return <SigInner id={id} c={c} d={d} cls={cls} />
}

function SigInner({ id, c, d, cls }: { id: string; c: string; d: string; cls: string }) {
  switch (id) {
    case 'typescript':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <text x="10" y="40" fontFamily="var(--font-mono)" fontSize="26" fill={c} className="sig-fade">{'{'}</text>
          <text x="30" y="60" fontFamily="var(--font-mono)" fontSize="15" fill={d}>: T</text>
          <text x="62" y="40" fontFamily="var(--font-mono)" fontSize="26" fill={c} className="sig-fade" style={{ animationDelay: '1.3s' }}>{'}'}</text>
        </svg>
      )
    case 'react':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <g className="sig-orbit" style={{ transformOrigin: '46px 46px' }}>
            <ellipse cx="46" cy="46" rx="34" ry="13" fill="none" stroke={c} strokeWidth="1.4" />
            <ellipse cx="46" cy="46" rx="34" ry="13" fill="none" stroke={c} strokeWidth="1.4" transform="rotate(60 46 46)" />
            <ellipse cx="46" cy="46" rx="34" ry="13" fill="none" stroke={c} strokeWidth="1.4" transform="rotate(120 46 46)" />
          </g>
          <circle cx="46" cy="46" r="5" fill={c} className="sig-pulse" style={{ transformOrigin: '46px 46px' }} />
        </svg>
      )
    case 'vite':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <path d="M52 6 L26 52 L44 52 L38 86 L68 36 L50 36 Z" fill={c} className="sig-pulse" style={{ transformOrigin: '46px 46px' }} />
        </svg>
      )
    case 'tailwind':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          {['var(--accent)', 'var(--good)', 'var(--gold)', 'var(--violet)'].map((col, i) => (
            <rect key={i} x="6" y={12 + i * 18} width="80" height="10" rx="5" fill={col} opacity="0.8" className="sig-slide" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </svg>
      )
    case 'react-router':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <path id="rr-path" d="M10 70 C 30 10, 60 80, 82 22" fill="none" stroke={d} strokeWidth="1.4" strokeDasharray="4 5" />
          <circle cx="10" cy="70" r="5" fill={c} />
          <circle cx="82" cy="22" r="5" fill={c} />
          <circle r="4" fill="var(--accent-bright)" style={{ offsetPath: 'path("M10 70 C 30 10, 60 80, 82 22")', animation: 'sig-flow-x 2.4s ease-in-out infinite alternate' }} />
        </svg>
      )
    case 'zustand':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <rect x="16" y="26" width="60" height="44" rx="8" fill="none" stroke={c} strokeWidth="1.6" />
          <rect x="16" y="26" width="60" height="44" rx="8" fill="none" stroke={c} strokeWidth="1.6" className="sig-pulse" style={{ transformOrigin: '46px 48px' }} />
          <circle cx="46" cy="48" r="6" fill={c} />
        </svg>
      )
    case 'framer-motion':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <line x1="14" y1="78" x2="78" y2="78" stroke={d} strokeWidth="1.2" />
          <circle cx="46" cy="66" r="10" fill={c} className="sig-bounce" />
        </svg>
      )
    case 'css-arch':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          {[0, 1, 2].map((i) => (
            <rect key={i} x={14 + i * 8} y={16 + i * 10} width={64 - i * 16} height="30" rx="6" fill="none" stroke={c} strokeWidth="1.4" opacity={0.9 - i * 0.25} />
          ))}
          <rect x="30" y="8" width="32" height="6" rx="3" fill={c} className="sig-cascade" />
        </svg>
      )
    case 'web-storage':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <ellipse cx="46" cy="24" rx="28" ry="9" fill="none" stroke={c} strokeWidth="1.5" />
          <path d="M18 24 v40 a28 9 0 0 0 56 0 v-40" fill="none" stroke={c} strokeWidth="1.5" />
          <ellipse cx="46" cy="44" rx="28" ry="9" fill="none" stroke={d} strokeWidth="1" />
          <rect x="30" y="50" width="32" height="4" rx="2" fill={c} className="sig-blink" />
        </svg>
      )
    case 'lucide':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <rect key={i} x={12 + (i % 3) * 26} y={12 + Math.floor(i / 3) * 26} width="16" height="16" rx="4" fill="none" stroke={c} strokeWidth="1.5" className="sig-fade" style={{ animationDelay: `${(i % 4) * 0.4}s` }} />
          ))}
        </svg>
      )
    case 'three':
      return (
        <div className={cls} style={{ perspective: '200px' }}>
          <div className="sig-spin3d" style={{ position: 'absolute', inset: 16, transformStyle: 'preserve-3d' }}>
            {[0, 90, 180, 270].map((deg) => (
              <div key={deg} style={{ position: 'absolute', inset: 0, border: '1.4px solid var(--accent)', transform: `rotateY(${deg}deg) translateZ(30px)`, opacity: 0.7 }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, border: '1.4px solid var(--accent)', transform: 'rotateX(90deg) translateZ(30px)', opacity: 0.7 }} />
            <div style={{ position: 'absolute', inset: 0, border: '1.4px solid var(--accent)', transform: 'rotateX(-90deg) translateZ(30px)', opacity: 0.7 }} />
          </div>
        </div>
      )
    case 'recharts':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          {[38, 62, 50, 78, 44].map((h, i) => (
            <rect key={i} x={10 + i * 16} y={84 - h} width="10" height={h} rx="2" fill={c} opacity={0.5 + i * 0.1} className="sig-grow" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
        </svg>
      )
    case 'monaco':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          {[0, 1, 2].map((i) => (
            <rect key={i} x="12" y={22 + i * 16} width={44 - i * 10} height="6" rx="3" fill={d} opacity="0.7" />
          ))}
          <rect x="12" y="70" width="3" height="14" fill={c} className="sig-blink" />
        </svg>
      )
    case 'react-markdown':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <text x="10" y="46" fontFamily="var(--font-mono)" fontSize="30" fill={c} className="sig-fade">#</text>
          <text x="36" y="46" fontFamily="var(--font-display)" fontSize="30" fill="var(--fg)" className="sig-fade" style={{ animationDelay: '1.3s' }}>H1</text>
        </svg>
      )
    case 'date-fns':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <rect x="12" y="18" width="68" height="60" rx="8" fill="none" stroke={c} strokeWidth="1.5" />
          <line x1="12" y1="34" x2="80" y2="34" stroke={c} strokeWidth="1.5" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={20 + (i % 3) * 20} y={42 + Math.floor(i / 3) * 16} width="12" height="10" rx="2" fill={i === 4 ? c : d} opacity={i === 4 ? 1 : 0.4} className={i === 4 ? 'sig-pulse' : undefined} style={{ transformOrigin: '66px 63px' }} />
          ))}
        </svg>
      )
    case 'gh-actions':
      return (
        <svg className={cls} viewBox="0 0 92 92">
          <line x1="14" y1="46" x2="78" y2="46" stroke={d} strokeWidth="1.2" />
          {[14, 46, 78].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="46" r="8" fill="var(--bg)" stroke={c} strokeWidth="1.6" className="sig-fade" style={{ animationDelay: `${i * 0.7}s` }} />
              <path d={`M${x - 3} 46 l2.5 2.5 l4 -5`} fill="none" stroke={c} strokeWidth="1.6" />
            </g>
          ))}
        </svg>
      )
    default:
      return null
  }
}
